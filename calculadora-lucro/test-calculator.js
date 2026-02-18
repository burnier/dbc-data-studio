#!/usr/bin/env node

/**
 * Test Script para Calculadora de Lucro
 * Testa todos os marketplaces e cenários
 */

// Implementação do calculator em JavaScript puro
function getMarketplaceFees(marketplace, precoVenda) {
  switch (marketplace) {
    case 'shopee':
      return {
        comissaoPercentual: 20,
        taxaFixa: 4.00,
        descricao: 'Shopee: 14% comissão + 6% Frete Grátis + R$ 4,00'
      };
    case 'mercadolivre-classico':
      return {
        comissaoPercentual: 12.5,
        taxaFixa: precoVenda < 79 ? 6.50 : 0,
        descricao: `ML Clássico: ~12.5% + ${precoVenda < 79 ? 'R$ 6,50' : 'sem taxa fixa'}`
      };
    case 'mercadolivre-premium':
      return {
        comissaoPercentual: 17.5,
        taxaFixa: precoVenda < 79 ? 6.50 : 0,
        descricao: `ML Premium: ~17.5% + ${precoVenda < 79 ? 'R$ 6,50' : 'sem taxa fixa'}`
      };
    case 'pix':
      return {
        comissaoPercentual: 0.5,
        taxaFixa: 0,
        descricao: 'Pix: ~0.5% gateway'
      };
    default:
      return {
        comissaoPercentual: 0,
        taxaFixa: 0,
        descricao: 'Sem taxas'
      };
  }
}

function calculateProfit(inputs) {
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

  const marketplaceFees = getMarketplaceFees(marketplace, precoVenda);
  if (marketplace === 'pix' && pixGatewayFee !== undefined) {
    marketplaceFees.comissaoPercentual = pixGatewayFee;
    marketplaceFees.descricao = `Pix: ${pixGatewayFee}% gateway`;
  }

  const comissaoMarketplace = (precoVenda * marketplaceFees.comissaoPercentual) / 100;
  const taxaFixaMarketplace = marketplaceFees.taxaFixa;
  const taxasMarketplace = comissaoMarketplace + taxaFixaMarketplace;

  let impostos = 0;
  if (isMEI) {
    impostos = 0;
  } else if (aliquotaImposto > 0) {
    impostos = (precoVenda * aliquotaImposto) / 100;
  }

  const custoTotal = custoProduto + custoEmbalagem + custoFrete + taxasMarketplace + impostos;
  const lucroLiquido = precoVenda - custoTotal;
  const margemLucro = precoVenda > 0 ? (lucroLiquido / precoVenda) * 100 : 0;

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

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Helper para formatar moeda
function formatCurrency(value) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

// Helper para formatar percentual
function formatPercent(value) {
  return `${value.toFixed(2).replace('.', ',')}%`;
}

// Contador de testes
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log(`\n${colors.bold}${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}  TESTE DA CALCULADORA DE LUCRO 2026  ${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}========================================${colors.reset}\n`);

// Função de teste
function runTest(testName, inputs, expected) {
  totalTests++;
  console.log(`${colors.blue}[TESTE ${totalTests}]${colors.reset} ${testName}`);
  console.log(`  Marketplace: ${inputs.marketplace}`);
  console.log(`  Preço: ${formatCurrency(inputs.precoVenda)}`);
  
  const result = calculateProfit(inputs);
  
  // Validações
  const tests = [
    { name: 'Lucro Líquido', actual: result.lucroLiquido, expected: expected.lucroLiquido, tolerance: 0.01 },
    { name: 'Margem %', actual: result.margemLucro, expected: expected.margemLucro, tolerance: 0.1 },
    { name: 'Comissão', actual: result.breakdown.comissaoMarketplace, expected: expected.comissao, tolerance: 0.01 },
    { name: 'Taxa Fixa', actual: result.breakdown.taxaFixaMarketplace, expected: expected.taxaFixa, tolerance: 0.01 }
  ];
  
  let testPassed = true;
  
  tests.forEach(test => {
    const diff = Math.abs(test.actual - test.expected);
    const passed = diff <= test.tolerance;
    
    if (passed) {
      console.log(`  ${colors.green}✓${colors.reset} ${test.name}: ${test.name === 'Margem %' ? formatPercent(test.actual) : formatCurrency(test.actual)}`);
    } else {
      console.log(`  ${colors.red}✗${colors.reset} ${test.name}: ${test.name === 'Margem %' ? formatPercent(test.actual) : formatCurrency(test.actual)} (esperado: ${test.name === 'Margem %' ? formatPercent(test.expected) : formatCurrency(test.expected)})`);
      testPassed = false;
    }
  });
  
  if (testPassed) {
    passedTests++;
    console.log(`  ${colors.green}${colors.bold}PASSOU ✓${colors.reset}\n`);
  } else {
    failedTests++;
    console.log(`  ${colors.red}${colors.bold}FALHOU ✗${colors.reset}\n`);
  }
  
  return testPassed;
}

// ==========================================
// TESTES SHOPEE
// ==========================================
console.log(`${colors.bold}📦 TESTES SHOPEE${colors.reset}\n`);

runTest(
  'Shopee - Venda R$ 100 (MEI)',
  {
    precoVenda: 100,
    custoProduto: 40,
    custoEmbalagem: 5,
    custoFrete: 15,
    marketplace: 'shopee',
    isMEI: true
  },
  {
    lucroLiquido: 16.00, // 100 - 40 - 5 - 15 - 20 - 4
    margemLucro: 16.00,
    comissao: 20.00, // 20% de 100
    taxaFixa: 4.00
  }
);

runTest(
  'Shopee - Venda R$ 200 (MEI)',
  {
    precoVenda: 200,
    custoProduto: 80,
    custoEmbalagem: 10,
    custoFrete: 20,
    marketplace: 'shopee',
    isMEI: true
  },
  {
    lucroLiquido: 46.00, // 200 - 80 - 10 - 20 - 40 - 4
    margemLucro: 23.00,
    comissao: 40.00, // 20% de 200
    taxaFixa: 4.00
  }
);

// ==========================================
// TESTES MERCADO LIVRE CLÁSSICO
// ==========================================
console.log(`${colors.bold}🛒 TESTES MERCADO LIVRE CLÁSSICO${colors.reset}\n`);

runTest(
  'ML Clássico - Venda R$ 50 (< R$ 79, MEI)',
  {
    precoVenda: 50,
    custoProduto: 20,
    custoEmbalagem: 3,
    custoFrete: 10,
    marketplace: 'mercadolivre-classico',
    isMEI: true
  },
  {
    lucroLiquido: 4.25, // 50 - 20 - 3 - 10 - 6.25 - 6.50 = 4.25
    margemLucro: 8.50,  // 4.25/50 * 100 = 8.50%
    comissao: 6.25, // 12.5% de 50
    taxaFixa: 6.50 // Porque < R$ 79
  }
);

runTest(
  'ML Clássico - Venda R$ 100 (≥ R$ 79, MEI)',
  {
    precoVenda: 100,
    custoProduto: 40,
    custoEmbalagem: 5,
    custoFrete: 15,
    marketplace: 'mercadolivre-classico',
    isMEI: true
  },
  {
    lucroLiquido: 27.50, // 100 - 40 - 5 - 15 - 12.50 - 0
    margemLucro: 27.50,
    comissao: 12.50, // 12.5% de 100
    taxaFixa: 0.00 // Porque ≥ R$ 79
  }
);

// ==========================================
// TESTES MERCADO LIVRE PREMIUM
// ==========================================
console.log(`${colors.bold}💎 TESTES MERCADO LIVRE PREMIUM${colors.reset}\n`);

runTest(
  'ML Premium - Venda R$ 50 (< R$ 79, MEI)',
  {
    precoVenda: 50,
    custoProduto: 20,
    custoEmbalagem: 3,
    custoFrete: 10,
    marketplace: 'mercadolivre-premium',
    isMEI: true
  },
  {
    lucroLiquido: 1.75, // 50 - 20 - 3 - 10 - 8.75 - 6.50 = 1.75
    margemLucro: 3.50,  // 1.75/50 * 100 = 3.50%
    comissao: 8.75, // 17.5% de 50
    taxaFixa: 6.50
  }
);

runTest(
  'ML Premium - Venda R$ 150 (≥ R$ 79, MEI)',
  {
    precoVenda: 150,
    custoProduto: 60,
    custoEmbalagem: 8,
    custoFrete: 20,
    marketplace: 'mercadolivre-premium',
    isMEI: true
  },
  {
    lucroLiquido: 35.75, // 150 - 60 - 8 - 20 - 26.25 - 0
    margemLucro: 23.83,
    comissao: 26.25, // 17.5% de 150
    taxaFixa: 0.00
  }
);

// ==========================================
// TESTES PIX
// ==========================================
console.log(`${colors.bold}💳 TESTES PIX${colors.reset}\n`);

runTest(
  'Pix - Venda R$ 100 (0.5% gateway, MEI)',
  {
    precoVenda: 100,
    custoProduto: 40,
    custoEmbalagem: 5,
    custoFrete: 15,
    marketplace: 'pix',
    isMEI: true,
    pixGatewayFee: 0.5
  },
  {
    lucroLiquido: 39.50, // 100 - 40 - 5 - 15 - 0.50 - 0
    margemLucro: 39.50,
    comissao: 0.50, // 0.5% de 100
    taxaFixa: 0.00
  }
);

runTest(
  'Pix - Venda R$ 100 (1% gateway, MEI)',
  {
    precoVenda: 100,
    custoProduto: 40,
    custoEmbalagem: 5,
    custoFrete: 15,
    marketplace: 'pix',
    isMEI: true,
    pixGatewayFee: 1.0
  },
  {
    lucroLiquido: 39.00, // 100 - 40 - 5 - 15 - 1.00 - 0
    margemLucro: 39.00,
    comissao: 1.00, // 1% de 100
    taxaFixa: 0.00
  }
);

runTest(
  'Pix - Venda R$ 100 (0% gateway, MEI)',
  {
    precoVenda: 100,
    custoProduto: 40,
    custoEmbalagem: 5,
    custoFrete: 15,
    marketplace: 'pix',
    isMEI: true,
    pixGatewayFee: 0.0
  },
  {
    lucroLiquido: 40.00, // 100 - 40 - 5 - 15 - 0 - 0
    margemLucro: 40.00,
    comissao: 0.00, // 0% de 100
    taxaFixa: 0.00
  }
);

// ==========================================
// TESTES SIMPLES NACIONAL
// ==========================================
console.log(`${colors.bold}🏛️ TESTES SIMPLES NACIONAL${colors.reset}\n`);

runTest(
  'Shopee - Venda R$ 100 (Simples 6%)',
  {
    precoVenda: 100,
    custoProduto: 40,
    custoEmbalagem: 5,
    custoFrete: 15,
    marketplace: 'shopee',
    isMEI: false,
    aliquotaImposto: 6.0
  },
  {
    lucroLiquido: 10.00, // 100 - 40 - 5 - 15 - 20 - 4 - 6
    margemLucro: 10.00,
    comissao: 20.00,
    taxaFixa: 4.00
  }
);

runTest(
  'ML Clássico - Venda R$ 100 (Simples 8%)',
  {
    precoVenda: 100,
    custoProduto: 40,
    custoEmbalagem: 5,
    custoFrete: 15,
    marketplace: 'mercadolivre-classico',
    isMEI: false,
    aliquotaImposto: 8.0
  },
  {
    lucroLiquido: 19.50, // 100 - 40 - 5 - 15 - 12.50 - 0 - 8
    margemLucro: 19.50,
    comissao: 12.50,
    taxaFixa: 0.00
  }
);

// ==========================================
// TESTES DE EDGE CASES
// ==========================================
console.log(`${colors.bold}⚠️  TESTES DE CASOS EXTREMOS${colors.reset}\n`);

runTest(
  'Prejuízo - Venda R$ 50 (custos altos)',
  {
    precoVenda: 50,
    custoProduto: 40,
    custoEmbalagem: 5,
    custoFrete: 15,
    marketplace: 'shopee',
    isMEI: true
  },
  {
    lucroLiquido: -24.00, // 50 - 40 - 5 - 15 - 10 - 4
    margemLucro: -48.00,
    comissao: 10.00,
    taxaFixa: 4.00
  }
);

runTest(
  'Venda alta - R$ 500 (Shopee, MEI)',
  {
    precoVenda: 500,
    custoProduto: 200,
    custoEmbalagem: 15,
    custoFrete: 30,
    marketplace: 'shopee',
    isMEI: true
  },
  {
    lucroLiquido: 151.00, // 500 - 200 - 15 - 30 - 100 - 4
    margemLucro: 30.20,
    comissao: 100.00, // 20% de 500
    taxaFixa: 4.00
  }
);

// ==========================================
// RESUMO FINAL
// ==========================================
console.log(`${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bold}RESUMO DOS TESTES${colors.reset}\n`);
console.log(`Total de testes: ${colors.bold}${totalTests}${colors.reset}`);
console.log(`${colors.green}Passou: ${passedTests}${colors.reset}`);
console.log(`${colors.red}Falhou: ${failedTests}${colors.reset}`);

const successRate = (passedTests / totalTests * 100).toFixed(1);
console.log(`\nTaxa de sucesso: ${colors.bold}${successRate}%${colors.reset}\n`);

if (failedTests === 0) {
  console.log(`${colors.green}${colors.bold}✓ TODOS OS TESTES PASSARAM! 🎉${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${colors.red}${colors.bold}✗ ALGUNS TESTES FALHARAM${colors.reset}\n`);
  process.exit(1);
}
