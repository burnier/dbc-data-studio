'use client';

import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Package, Truck, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NumberInputField } from '@/components/ui/number-input-field';
import { MetricCard } from '@/components/ui/metric-card';
import { BreakdownLine } from '@/components/ui/breakdown-line';
import {
  calculateProfit,
  generateSummary,
  type MarketplaceType,
  type CalculatorInputs,
  type CalculatorResult,
} from '@/lib/calculator';
import { formatCurrency, formatPercent } from '@/lib/utils';

const marketplaceOptions: { value: MarketplaceType; label: string; description: string; ariaLabel: string }[] = [
  { 
    value: 'shopee', 
    label: 'Shopee', 
    description: '20% (14% + 6% frete) + R$ 4,00',
    ariaLabel: 'Shopee - Taxa de 20% mais R$ 4 reais fixo por venda'
  },
  { 
    value: 'mercadolivre-classico', 
    label: 'Mercado Livre Clássico', 
    description: '~12.5% + taxa variável',
    ariaLabel: 'Mercado Livre Clássico - Taxa de 12,5% mais taxa variável'
  },
  { 
    value: 'mercadolivre-premium', 
    label: 'Mercado Livre Premium', 
    description: '~17.5% + taxa variável',
    ariaLabel: 'Mercado Livre Premium - Taxa de 17,5% mais taxa variável'
  },
  { 
    value: 'pix', 
    label: 'Pix / Direto', 
    description: '0-1% intermediador',
    ariaLabel: 'Venda direta por Pix - Taxa de 0 a 1% de intermediador'
  },
];

const DEFAULT_VALUES = {
  precoVenda: '100',
  custoProduto: '40',
  custoEmbalagem: '5',
  custoFrete: '15',
  aliquotaImposto: '0',
  pixGatewayFee: '0.5',
};

export default function ProfitCalculator() {
  const [inputStrings, setInputStrings] = useState(DEFAULT_VALUES);
  const [inputs, setInputs] = useState<CalculatorInputs>({
    precoVenda: 100,
    custoProduto: 40,
    custoEmbalagem: 5,
    custoFrete: 15,
    marketplace: 'shopee',
    isMEI: true,
    aliquotaImposto: 0,
    pixGatewayFee: 0.5,
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const calculated = calculateProfit(inputs);
    setResult(calculated);
  }, [inputs]);

  const handleInputChange = (field: keyof CalculatorInputs, value: string | number | boolean) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumberInput = (field: keyof CalculatorInputs, inputValue: string) => {
    setInputStrings((prev) => ({ ...prev, [field]: inputValue }));

    if (inputValue === '' || inputValue === '-') {
      setInputs((prev) => ({ ...prev, [field]: 0 }));
    } else {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        setInputs((prev) => ({ ...prev, [field]: numValue }));
      }
    }
  };

  const handleCopyToClipboard = () => {
    if (result) {
      const summary = generateSummary(inputs, result);
      navigator.clipboard.writeText(summary).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const lucroPositivo = result && result.lucroLiquido > 0;

  return (
    <div className="space-y-8">
      {/* Calculadora */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-green-600" aria-hidden="true" />
            Calculadora de Lucro
          </CardTitle>
          <CardDescription>
            Informe os dados da sua venda para calcular seu lucro líquido real
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Marketplace Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Marketplace / Canal de Venda
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" role="group" aria-label="Selecione o marketplace">
              {marketplaceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange('marketplace', option.value)}
                  aria-label={option.ariaLabel}
                  aria-pressed={inputs.marketplace === option.value}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    inputs.marketplace === option.value
                      ? 'border-green-600 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs de Valores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberInputField
              id="preco-venda"
              label="Preço de Venda (R$)"
              value={inputStrings.precoVenda}
              onChange={(value) => handleNumberInput('precoVenda', value)}
              placeholder="100,00"
              description="Digite o preço de venda do produto em reais"
              icon={<DollarSign className="h-4 w-4" />}
            />

            <NumberInputField
              id="custo-produto"
              label="Custo do Produto (R$)"
              value={inputStrings.custoProduto}
              onChange={(value) => handleNumberInput('custoProduto', value)}
              placeholder="40,00"
              description="Digite o custo de aquisição do produto"
              icon={<Package className="h-4 w-4" />}
            />

            <NumberInputField
              id="custo-embalagem"
              label="Custo de Embalagem (R$)"
              value={inputStrings.custoEmbalagem}
              onChange={(value) => handleNumberInput('custoEmbalagem', value)}
              placeholder="5,00"
              description="Digite o custo da embalagem do produto"
              icon={<Package className="h-4 w-4" />}
            />

            <NumberInputField
              id="custo-frete"
              label="Custo de Frete/Envio (R$)"
              value={inputStrings.custoFrete}
              onChange={(value) => handleNumberInput('custoFrete', value)}
              placeholder="15,00"
              description="Digite o custo de frete ou envio"
              icon={<Truck className="h-4 w-4" />}
            />
          </div>

          {/* Configurações de Impostos */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mei-checkbox"
                checked={inputs.isMEI}
                onChange={(e) => handleInputChange('isMEI', e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="mei-checkbox" className="ml-2 block text-sm text-gray-700">
                Sou MEI (DAS fixo de R$ 81,05/mês)
              </label>
            </div>

            {!inputs.isMEI && (
              <NumberInputField
                id="aliquota-imposto"
                label="Alíquota Simples Nacional (%)"
                value={inputStrings.aliquotaImposto}
                onChange={(value) => handleNumberInput('aliquotaImposto', value)}
                placeholder="6,0"
                description="Informe sua alíquota do Simples Nacional (ex: 6.0% para Comércio Anexo I)"
              />
            )}

            {inputs.marketplace === 'pix' && (
              <NumberInputField
                id="pix-gateway-fee"
                label="Taxa do Intermediador Pix (%)"
                value={inputStrings.pixGatewayFee}
                onChange={(value) => handleNumberInput('pixGatewayFee', value)}
                placeholder="0,5"
                description="Taxa cobrada pelo intermediador de pagamento (geralmente 0% a 1%)"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {result && (
        <Card className={lucroPositivo ? 'border-green-500' : 'border-red-500'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className={`h-6 w-6 ${lucroPositivo ? 'text-green-600' : 'text-red-600'}`} aria-hidden="true" />
              Resultado da Venda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Principais Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                label="Lucro Líquido"
                value={formatCurrency(result.lucroLiquido)}
                colorClass={lucroPositivo ? 'bg-green-50' : 'bg-red-50'}
                borderColorClass={lucroPositivo ? 'border-green-200' : 'border-red-200'}
                textColorClass={lucroPositivo ? 'text-green-700' : 'text-red-700'}
              />

              <MetricCard
                label="Margem de Lucro"
                value={formatPercent(result.margemLucro)}
                colorClass="bg-blue-50"
                borderColorClass="border-blue-200"
                textColorClass="text-blue-700"
              />

              <MetricCard
                label="Ponto de Equilíbrio"
                value={formatCurrency(result.pontoEquilibrio)}
                colorClass="bg-purple-50"
                borderColorClass="border-purple-200"
                textColorClass="text-purple-700"
                subtitle="(Preço Mínimo)"
                footer="Venda abaixo disso = prejuízo"
              />
            </div>

            {/* Breakdown Detalhado */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Composição do Lucro</h4>
              <div className="space-y-2 text-sm">
                <BreakdownLine 
                  label="Preço de Venda" 
                  value={formatCurrency(result.precoVenda)} 
                />
                <BreakdownLine 
                  label="- Custo do Produto" 
                  value={formatCurrency(result.breakdown.custoProduto)} 
                  isNegative 
                />
                <BreakdownLine 
                  label="- Custo de Embalagem" 
                  value={formatCurrency(result.breakdown.custoEmbalagem)} 
                  isNegative 
                />
                <BreakdownLine 
                  label="- Custo de Frete" 
                  value={formatCurrency(result.breakdown.custoFrete)} 
                  isNegative 
                />
                <BreakdownLine 
                  label="- Comissão Marketplace" 
                  value={formatCurrency(result.breakdown.comissaoMarketplace)} 
                  isNegative 
                />
                {result.breakdown.taxaFixaMarketplace > 0 && (
                  <BreakdownLine 
                    label="- Taxa Fixa Marketplace" 
                    value={formatCurrency(result.breakdown.taxaFixaMarketplace)} 
                    isNegative 
                  />
                )}
                {result.breakdown.impostos > 0 && (
                  <BreakdownLine 
                    label="- Impostos" 
                    value={formatCurrency(result.breakdown.impostos)} 
                    isNegative 
                  />
                )}
                <BreakdownLine 
                  label="= Lucro Líquido" 
                  value={formatCurrency(result.lucroLiquido)} 
                  isTotal 
                  textColor={lucroPositivo ? 'text-green-700' : 'text-red-700'}
                />
              </div>
            </div>

            {/* Botão Copiar */}
            <Button onClick={handleCopyToClipboard} variant="outline" className="w-full">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" aria-hidden="true" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" aria-hidden="true" />
                  Compartilhar no WhatsApp
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
