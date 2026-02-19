// Versão CommonJS do calculator para testes
// Este arquivo é gerado a partir de lib/calculator.ts

const MARKETPLACE_FEES = {
  shopee: {
    comissaoPercentual: 20,
    taxaFixa: 4,
    descricao: 'Shopee (14% + 6% Frete Grátis + R$ 4,00)',
  },
  'mercadolivre-classico': {
    comissaoPercentual: 12.5,
    taxaFixa: 6.5,
    descricao: 'Mercado Livre Clássico (~12.5%)',
  },
  'mercadolivre-premium': {
    comissaoPercentual: 17.5,
    taxaFixa: 6.5,
    descricao: 'Mercado Livre Premium (~17.5%)',
  },
  pix: {
    comissaoPercentual: 0,
    taxaFixa: 0,
    descricao: 'Pix / Venda Direta',
  },
};

function calculateProfit(inputs) {
  const {
    precoVenda,
    custoProduto,
    custoEmbalagem,
    custoFrete,
    marketplace,
    isMEI,
    aliquotaImposto,
    pixGatewayFee,
  } = inputs;

  const fees = MARKETPLACE_FEES[marketplace];
  
  let comissaoMarketplace = 0;
  if (marketplace === 'pix') {
    comissaoMarketplace = (precoVenda * pixGatewayFee) / 100;
  } else {
    comissaoMarketplace = (precoVenda * fees.comissaoPercentual) / 100;
  }

  const taxaFixaMarketplace = fees.taxaFixa;

  let impostos = 0;
  if (!isMEI && aliquotaImposto > 0) {
    impostos = (precoVenda * aliquotaImposto) / 100;
  }

  const custoTotal =
    custoProduto +
    custoEmbalagem +
    custoFrete +
    comissaoMarketplace +
    taxaFixaMarketplace +
    impostos;

  const lucroLiquido = precoVenda - custoTotal;
  const margemLucro = precoVenda > 0 ? (lucroLiquido / precoVenda) * 100 : 0;

  const custosFixos = custoProduto + custoEmbalagem + custoFrete + taxaFixaMarketplace;
  const taxaEfetiva = marketplace === 'pix' 
    ? pixGatewayFee / 100 
    : fees.comissaoPercentual / 100;
  const taxaImpostoDecimal = isMEI ? 0 : aliquotaImposto / 100;
  
  const pontoEquilibrio = custosFixos / (1 - taxaEfetiva - taxaImpostoDecimal);

  return {
    lucroLiquido: parseFloat(lucroLiquido.toFixed(2)),
    margemLucro: parseFloat(margemLucro.toFixed(2)),
    pontoEquilibrio: parseFloat(pontoEquilibrio.toFixed(2)),
    precoVenda,
    breakdown: {
      custoProduto,
      custoEmbalagem,
      custoFrete,
      comissaoMarketplace: parseFloat(comissaoMarketplace.toFixed(2)),
      taxaFixaMarketplace,
      impostos: parseFloat(impostos.toFixed(2)),
    },
    marketplaceDescricao: fees.descricao,
  };
}

function generateSummary(inputs, result) {
  const lines = [
    '📊 *Resumo da Calculadora de Lucro*',
    '',
    `💰 *Preço de Venda:* R$ ${result.precoVenda.toFixed(2)}`,
    `✅ *Lucro Líquido:* R$ ${result.lucroLiquido.toFixed(2)}`,
    `📈 *Margem:* ${result.margemLucro.toFixed(2)}%`,
    `⚖️ *Ponto de Equilíbrio:* R$ ${result.pontoEquilibrio.toFixed(2)}`,
    '',
    `🏪 *Marketplace:* ${result.marketplaceDescricao}`,
    `💼 *Regime:* ${inputs.isMEI ? 'MEI' : `Simples Nacional (${inputs.aliquotaImposto}%)`}`,
    '',
    '*Detalhamento:*',
    `• Custo Produto: R$ ${result.breakdown.custoProduto.toFixed(2)}`,
    `• Custo Embalagem: R$ ${result.breakdown.custoEmbalagem.toFixed(2)}`,
    `• Custo Frete: R$ ${result.breakdown.custoFrete.toFixed(2)}`,
    `• Comissão: R$ ${result.breakdown.comissaoMarketplace.toFixed(2)}`,
  ];

  if (result.breakdown.taxaFixaMarketplace > 0) {
    lines.push(`• Taxa Fixa: R$ ${result.breakdown.taxaFixaMarketplace.toFixed(2)}`);
  }

  if (result.breakdown.impostos > 0) {
    lines.push(`• Impostos: R$ ${result.breakdown.impostos.toFixed(2)}`);
  }

  lines.push('');
  lines.push('🧮 Calculadora: https://calculadora.dbcdatastudio.com');

  return lines.join('\n');
}

module.exports = {
  calculateProfit,
  generateSummary,
  MARKETPLACE_FEES,
};

