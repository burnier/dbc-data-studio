/**
 * Calculadora de Lucro para Marketplaces Brasileiros 2026
 * Regras atualizadas para Shopee, Mercado Livre e Pix
 */

export type MarketplaceType = 'shopee' | 'mercadolivre-classico' | 'mercadolivre-premium' | 'pix';

export interface CalculatorInputs {
  precoVenda: number;
  custoProduto: number;
  custoEmbalagem: number;
  custoFrete: number;
  marketplace: MarketplaceType;
  isMEI: boolean;
  aliquotaImposto?: number; // % para Simples Nacional (se não for MEI)
  pixGatewayFee?: number; // % para intermediador Pix (0-1%)
}

export interface MarketplaceFees {
  comissaoPercentual: number;
  taxaFixa: number;
  descricao: string;
}

export interface CalculatorResult {
  precoVenda: number;
  custoTotal: number;
  taxasMarketplace: number;
  impostos: number;
  lucroLiquido: number;
  margemLucro: number;
  pontoEquilibrio: number;
  breakdown: {
    custoProduto: number;
    custoEmbalagem: number;
    custoFrete: number;
    comissaoMarketplace: number;
    taxaFixaMarketplace: number;
    impostos: number;
  };
}

/**
 * Retorna as taxas do marketplace conforme regras 2026
 */
export function getMarketplaceFees(
  marketplace: MarketplaceType,
  precoVenda: number
): MarketplaceFees {
  switch (marketplace) {
    case 'shopee':
      // Shopee: 14% base + 6% Frete Grátis + R$ 4,00 fixo
      return {
        comissaoPercentual: 20, // 14% + 6%
        taxaFixa: 4.00,
        descricao: 'Shopee: 14% comissão + 6% Frete Grátis + R$ 4,00'
      };

    case 'mercadolivre-classico':
      // ML Clássico: 11-14% (média 12.5%) + R$ 6,50 se < R$ 79
      return {
        comissaoPercentual: 12.5,
        taxaFixa: precoVenda < 79 ? 6.50 : 0,
        descricao: `ML Clássico: ~12.5% + ${precoVenda < 79 ? 'R$ 6,50' : 'sem taxa fixa'}`
      };

    case 'mercadolivre-premium':
      // ML Premium: 16-19% (média 17.5%) + R$ 6,50 se < R$ 79
      return {
        comissaoPercentual: 17.5,
        taxaFixa: precoVenda < 79 ? 6.50 : 0,
        descricao: `ML Premium: ~17.5% + ${precoVenda < 79 ? 'R$ 6,50' : 'sem taxa fixa'}`
      };

    case 'pix':
      // Pix: 0-1% intermediador (padrão 0.5%)
      return {
        comissaoPercentual: 0.5,
        taxaFixa: 0,
        descricao: 'Pix: ~0.5% intermediador'
      };

    default:
      return {
        comissaoPercentual: 0,
        taxaFixa: 0,
        descricao: 'Sem taxas'
      };
  }
}

/**
 * Calcula o lucro líquido com todas as taxas e impostos
 */
export function calculateProfit(inputs: CalculatorInputs): CalculatorResult {
  const {
    precoVenda,
    custoProduto,
    custoEmbalagem,
    custoFrete,
    marketplace,
    isMEI,
    aliquotaImposto = 0,
    pixGatewayFee = 0.5
  } = inputs;

  // Ajusta a taxa do Pix se fornecida
  const marketplaceFees = getMarketplaceFees(marketplace, precoVenda);
  if (marketplace === 'pix' && pixGatewayFee !== undefined) {
    marketplaceFees.comissaoPercentual = pixGatewayFee;
    marketplaceFees.descricao = `Pix: ${pixGatewayFee}% intermediador`;
  }

  // Calcula comissão do marketplace
  const comissaoMarketplace = (precoVenda * marketplaceFees.comissaoPercentual) / 100;
  const taxaFixaMarketplace = marketplaceFees.taxaFixa;
  const taxasMarketplace = comissaoMarketplace + taxaFixaMarketplace;

  // Calcula impostos
  let impostos = 0;
  if (isMEI) {
    // MEI: DAS fixo de R$ 81,05/mês, mas para cálculo unitário mostramos R$ 0
    // (a não ser que o usuário queira amortizar por quantidade de vendas)
    impostos = 0;
  } else if (aliquotaImposto > 0) {
    // Simples Nacional: aplica % sobre o preço de venda
    impostos = (precoVenda * aliquotaImposto) / 100;
  }

  // Custo total
  const custoTotal = custoProduto + custoEmbalagem + custoFrete + taxasMarketplace + impostos;

  // Lucro líquido
  const lucroLiquido = precoVenda - custoTotal;

  // Margem de lucro %
  const margemLucro = precoVenda > 0 ? (lucroLiquido / precoVenda) * 100 : 0;

  // Ponto de equilíbrio (preço mínimo para lucro zero)
  // Preço = (Custos fixos + Custos variáveis) / (1 - (% comissão + % imposto))
  const custoFixo = custoProduto + custoEmbalagem + custoFrete + taxaFixaMarketplace;
  const percentualVariavel = (marketplaceFees.comissaoPercentual + (isMEI ? 0 : aliquotaImposto)) / 100;
  const pontoEquilibrio = percentualVariavel >= 1 ? 0 : custoFixo / (1 - percentualVariavel);

  return {
    precoVenda,
    custoTotal,
    taxasMarketplace,
    impostos,
    lucroLiquido,
    margemLucro,
    pontoEquilibrio,
    breakdown: {
      custoProduto,
      custoEmbalagem,
      custoFrete,
      comissaoMarketplace,
      taxaFixaMarketplace,
      impostos
    }
  };
}

/**
 * Gera um resumo formatado para compartilhar no WhatsApp
 */
export function generateSummary(inputs: CalculatorInputs, result: CalculatorResult): string {
  const marketplaceNames: Record<MarketplaceType, string> = {
    'shopee': 'Shopee',
    'mercadolivre-classico': 'Mercado Livre Clássico',
    'mercadolivre-premium': 'Mercado Livre Premium',
    'pix': 'Pix/Venda Direta'
  };

  const formatCurrency = (value: number): string => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const summary = `
📊 *Calculadora de Lucro - ${marketplaceNames[inputs.marketplace]}*

💰 *Preço de Venda:* ${formatCurrency(result.precoVenda)}

📦 *Custos:*
- Produto: ${formatCurrency(result.breakdown.custoProduto)}
- Embalagem: ${formatCurrency(result.breakdown.custoEmbalagem)}
- Frete: ${formatCurrency(result.breakdown.custoFrete)}

💳 *Taxas Marketplace:*
- Comissão: ${formatCurrency(result.breakdown.comissaoMarketplace)}
- Taxa fixa: ${formatCurrency(result.breakdown.taxaFixaMarketplace)}

🏛️ *Impostos:* ${formatCurrency(result.breakdown.impostos)}${inputs.isMEI ? ' (MEI - DAS R$ 81,05/mês)' : ''}

✅ *Lucro Líquido:* ${formatCurrency(result.lucroLiquido)}
📈 *Margem:* ${result.margemLucro.toFixed(2).replace('.', ',')}%
⚖️ *Ponto de Equilíbrio:* ${formatCurrency(result.pontoEquilibrio)}

_Calculado em ${new Date().toLocaleDateString('pt-BR')}_
`.trim();

  return summary;
}

