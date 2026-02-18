'use client';

import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Package, Truck, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  calculateProfit,
  generateSummary,
  type MarketplaceType,
  type CalculatorInputs,
  type CalculatorResult,
} from '@/lib/calculator';
import { formatCurrency, formatPercent, parseCurrency } from '@/lib/utils';

const marketplaceOptions: { value: MarketplaceType; label: string; description: string; ariaLabel: string }[] = [
  { 
    value: 'shopee', 
    label: 'Shopee', 
    description: '20% (14% + 6% frete) + R$ 4,00',
    ariaLabel: 'Shopee - Taxa de 20% mais R$ 4 reais fixo por venda'
  },
  { 
    value: 'mercadolivre-classico', 
    label: 'ML Clássico', 
    description: '~12.5% + taxa variável',
    ariaLabel: 'Mercado Livre Clássico - Taxa de 12,5% mais taxa variável'
  },
  { 
    value: 'mercadolivre-premium', 
    label: 'ML Premium', 
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

export default function ProfitCalculator() {
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

  // Recalcula quando inputs mudam
  useEffect(() => {
    const calculated = calculateProfit(inputs);
    setResult(calculated);
  }, [inputs]);

  const handleInputChange = (field: keyof CalculatorInputs, value: string | number | boolean) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
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
            <div>
              <label htmlFor="preco-venda" className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline h-4 w-4 mr-1" aria-hidden="true" />
                Preço de Venda (R$)
              </label>
              <Input
                id="preco-venda"
                type="number"
                step="0.01"
                min="0"
                value={inputs.precoVenda}
                onChange={(e) => handleInputChange('precoVenda', parseFloat(e.target.value) || 0)}
                placeholder="100,00"
                aria-describedby="preco-venda-desc"
              />
              <p id="preco-venda-desc" className="sr-only">Digite o preço de venda do produto em reais</p>
            </div>

            <div>
              <label htmlFor="custo-produto" className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="inline h-4 w-4 mr-1" aria-hidden="true" />
                Custo do Produto (R$)
              </label>
              <Input
                id="custo-produto"
                type="number"
                step="0.01"
                min="0"
                value={inputs.custoProduto}
                onChange={(e) => handleInputChange('custoProduto', parseFloat(e.target.value) || 0)}
                placeholder="40,00"
                aria-describedby="custo-produto-desc"
              />
              <p id="custo-produto-desc" className="sr-only">Digite o custo de aquisição do produto</p>
            </div>

            <div>
              <label htmlFor="custo-embalagem" className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="inline h-4 w-4 mr-1" aria-hidden="true" />
                Custo de Embalagem (R$)
              </label>
              <Input
                id="custo-embalagem"
                type="number"
                step="0.01"
                min="0"
                value={inputs.custoEmbalagem}
                onChange={(e) => handleInputChange('custoEmbalagem', parseFloat(e.target.value) || 0)}
                placeholder="5,00"
                aria-describedby="custo-embalagem-desc"
              />
              <p id="custo-embalagem-desc" className="sr-only">Digite o custo da embalagem do produto</p>
            </div>

            <div>
              <label htmlFor="custo-frete" className="block text-sm font-medium text-gray-700 mb-2">
                <Truck className="inline h-4 w-4 mr-1" aria-hidden="true" />
                Custo de Frete/Envio (R$)
              </label>
              <Input
                id="custo-frete"
                type="number"
                step="0.01"
                min="0"
                value={inputs.custoFrete}
                onChange={(e) => handleInputChange('custoFrete', parseFloat(e.target.value) || 0)}
                placeholder="15,00"
                aria-describedby="custo-frete-desc"
              />
              <p id="custo-frete-desc" className="sr-only">Digite o custo de frete ou envio</p>
            </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alíquota Simples Nacional (%)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={inputs.aliquotaImposto || 0}
                  onChange={(e) => handleInputChange('aliquotaImposto', parseFloat(e.target.value) || 0)}
                  placeholder="6,0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Informe sua alíquota do Simples Nacional (ex: 6.0% para Comércio Anexo I)
                </p>
              </div>
            )}

            {inputs.marketplace === 'pix' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taxa do Intermediador Pix (%)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={inputs.pixGatewayFee || 0}
                  onChange={(e) => handleInputChange('pixGatewayFee', parseFloat(e.target.value) || 0)}
                  placeholder="0,5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Taxa cobrada pelo intermediador de pagamento (geralmente 0% a 1%)
                </p>
              </div>
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
              <div className={`p-6 rounded-lg ${lucroPositivo ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                <div className="text-sm text-gray-600 mb-1">Lucro Líquido</div>
                <div className={`text-3xl font-bold ${lucroPositivo ? 'text-green-700' : 'text-red-700'}`}>
                  {formatCurrency(result.lucroLiquido)}
                </div>
              </div>

              <div className="p-6 rounded-lg bg-blue-50 border-2 border-blue-200">
                <div className="text-sm text-gray-600 mb-1">Margem de Lucro</div>
                <div className="text-3xl font-bold text-blue-700">
                  {formatPercent(result.margemLucro)}
                </div>
              </div>

              <div className="p-6 rounded-lg bg-purple-50 border-2 border-purple-200">
                <div className="text-sm text-gray-600 mb-1">Ponto de Equilíbrio</div>
                <div className="text-3xl font-bold text-purple-700">
                  {formatCurrency(result.pontoEquilibrio)}
                </div>
              </div>
            </div>

            {/* Breakdown Detalhado */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Composição do Lucro</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Preço de Venda</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(result.precoVenda)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">- Custo do Produto</span>
                  <span className="text-red-600">-{formatCurrency(result.breakdown.custoProduto)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">- Custo de Embalagem</span>
                  <span className="text-red-600">-{formatCurrency(result.breakdown.custoEmbalagem)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">- Custo de Frete</span>
                  <span className="text-red-600">-{formatCurrency(result.breakdown.custoFrete)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">- Comissão Marketplace</span>
                  <span className="text-red-600">-{formatCurrency(result.breakdown.comissaoMarketplace)}</span>
                </div>
                {result.breakdown.taxaFixaMarketplace > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">- Taxa Fixa Marketplace</span>
                    <span className="text-red-600">-{formatCurrency(result.breakdown.taxaFixaMarketplace)}</span>
                  </div>
                )}
                {result.breakdown.impostos > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">- Impostos</span>
                    <span className="text-red-600">-{formatCurrency(result.breakdown.impostos)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold text-base">
                  <span className={lucroPositivo ? 'text-green-700' : 'text-red-700'}>= Lucro Líquido</span>
                  <span className={lucroPositivo ? 'text-green-700' : 'text-red-700'}>
                    {formatCurrency(result.lucroLiquido)}
                  </span>
                </div>
              </div>
            </div>

            {/* Botão Copiar */}
            <Button
              onClick={handleCopyToClipboard}
              variant="outline"
              className="w-full"
            >
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

