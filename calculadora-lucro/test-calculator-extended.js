// ========================================
// TESTE ESTENDIDO DA CALCULADORA DE LUCRO 2026
// Includes EDGE CASES and boundary testing
// ========================================

// Importar lógica de cálculo
function getMarketplaceFees(marketplace, precoVenda) {
  switch (marketplace) {
    case 'shopee':
      return {
        comissaoPercentual: 20,
        taxaFixa: 4.00,
        descricao: 'Shopee: 20% (14% + 6% frete) + R$ 4,00'
      };
    case 'mercadolivre-classico':
      const comissaoClassico = 12.5;
      const taxaFixaClassico = precoVenda < 79 ? 6.50 : 0;
      return {
        comissaoPercentual: comissaoClassico,
        taxaFixa: taxaFixaClassico,
        descricao: `ML Clássico: ${comissaoClassico}% + R$ ${taxaFixaClassico.toFixed(2)}`
      };
    case 'mercadolivre-premium':
      const comissaoPremium = 17.5;
      const taxaFixaPremium = precoVenda < 79 ? 6.50 : 0;
      return {
        comissaoPercentual: comissaoPremium,
        taxaFixa: taxaFixaPremium,
        descricao: `ML Premium: ${comissaoPremium}% + R$ ${taxaFixaPremium.toFixed(2)}`
      };
    case 'pix':
      return {
        comissaoPercentual: 0.5,
        taxaFixa: 0,
        descricao: 'Pix: ~0.5% intermediador'
      };
    default:
      throw new Error(`Marketplace desconhecido: ${marketplace}`);
  }
}

function calculateProfit({
  precoVenda,
  custoProduto,
  custoEmbalagem,
  custoFrete,
  marketplace,
  isMEI = true,
  aliquotaImposto = 0,
  pixGatewayFee = 0.5
}) {
  const marketplaceFees = getMarketplaceFees(marketplace, precoVenda);
  if (marketplace === 'pix' && pixGatewayFee !== undefined) {
    marketplaceFees.comissaoPercentual = pixGatewayFee;
    marketplaceFees.descricao = `Pix: ${pixGatewayFee}% intermediador`;
  }

  const comissaoMarketplace = (precoVenda * marketplaceFees.comissaoPercentual) / 100;
  const taxaFixaMarketplace = marketplaceFees.taxaFixa;
  const impostos = isMEI ? 0 : (precoVenda * aliquotaImposto) / 100;

  const custoTotal = custoProduto + custoEmbalagem + custoFrete + comissaoMarketplace + taxaFixaMarketplace + impostos;
  const lucroLiquido = precoVenda - custoTotal;
  const margemLucro = (lucroLiquido / precoVenda) * 100;

  const pontoEquilibrio = (custoProduto + custoEmbalagem + custoFrete + taxaFixaMarketplace + impostos) / 
    (1 - (marketplaceFees.comissaoPercentual / 100) - (isMEI ? 0 : aliquotaImposto / 100));

  return {
    precoVenda,
    lucroLiquido: Math.round(lucroLiquido * 100) / 100,
    margemLucro: Math.round(margemLucro * 100) / 100,
    pontoEquilibrio: Math.round(pontoEquilibrio * 100) / 100,
    breakdown: {
      custoProduto,
      custoEmbalagem,
      custoFrete,
      comissaoMarketplace: Math.round(comissaoMarketplace * 100) / 100,
      taxaFixaMarketplace,
      impostos: Math.round(impostos * 100) / 100
    }
  };
}

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

let testCount = 0;
let passCount = 0;
let failCount = 0;

function runTest(testName, marketplace, inputs, expected) {
  testCount++;
  console.log(`${colors.blue}[TESTE ${testCount}]${colors.reset} ${testName}`);
  console.log(`  Marketplace: ${marketplace}`);
  console.log(`  Preço: R$ ${inputs.precoVenda.toFixed(2)}`);

  const result = calculateProfit({ ...inputs, marketplace });
  
  let allPassed = true;
  const tolerance = 0.01; // Tolerância para arredondamento

  // Check lucroLiquido
  if (Math.abs(result.lucroLiquido - expected.lucroLiquido) > tolerance) {
    console.log(`  ${colors.red}✗${colors.reset} Lucro Líquido: R$ ${result.lucroLiquido.toFixed(2)} (esperado: R$ ${expected.lucroLiquido.toFixed(2)})`);
    allPassed = false;
  } else {
    console.log(`  ${colors.green}✓${colors.reset} Lucro Líquido: R$ ${result.lucroLiquido.toFixed(2)}`);
  }

  // Check margemLucro
  if (Math.abs(result.margemLucro - expected.margemLucro) > tolerance) {
    console.log(`  ${colors.red}✗${colors.reset} Margem %: ${result.margemLucro.toFixed(2)}% (esperado: ${expected.margemLucro.toFixed(2)}%)`);
    allPassed = false;
  } else {
    console.log(`  ${colors.green}✓${colors.reset} Margem %: ${result.margemLucro.toFixed(2)}%`);
  }

  // Check comissão
  if (Math.abs(result.breakdown.comissaoMarketplace - expected.comissaoMarketplace) > tolerance) {
    console.log(`  ${colors.red}✗${colors.reset} Comissão: R$ ${result.breakdown.comissaoMarketplace.toFixed(2)} (esperado: R$ ${expected.comissaoMarketplace.toFixed(2)})`);
    allPassed = false;
  } else {
    console.log(`  ${colors.green}✓${colors.reset} Comissão: R$ ${result.breakdown.comissaoMarketplace.toFixed(2)}`);
  }

  // Check taxa fixa
  if (Math.abs(result.breakdown.taxaFixaMarketplace - expected.taxaFixaMarketplace) > tolerance) {
    console.log(`  ${colors.red}✗${colors.reset} Taxa Fixa: R$ ${result.breakdown.taxaFixaMarketplace.toFixed(2)} (esperado: R$ ${expected.taxaFixaMarketplace.toFixed(2)})`);
    allPassed = false;
  } else {
    console.log(`  ${colors.green}✓${colors.reset} Taxa Fixa: R$ ${result.breakdown.taxaFixaMarketplace.toFixed(2)}`);
  }

  if (allPassed) {
    console.log(`  ${colors.green}${colors.bold}PASSOU ✓${colors.reset}\n`);
    passCount++;
  } else {
    console.log(`  ${colors.red}${colors.bold}FALHOU ✗${colors.reset}\n`);
    failCount++;
  }
}

// ============================================
// INICIAR TESTES
// ============================================
console.log(`\n${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}  TESTES ESTENDIDOS - EDGE CASES 2026  ${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}\n`);

// ============================================
// EDGE CASES: VALORES ZERO
// ============================================
console.log(`${colors.bold}💎 EDGE CASE: VALORES ZERO${colors.reset}\n`);

runTest(
  'Todos custos ZERO - Lucro máximo (Shopee)',
  'shopee',
  {
    precoVenda: 100,
    custoProduto: 0,
    custoEmbalagem: 0,
    custoFrete: 0,
    isMEI: true
  },
  {
    lucroLiquido: 76,
    margemLucro: 76,
    comissaoMarketplace: 20,
    taxaFixaMarketplace: 4
  }
);

runTest(
  'Frete ZERO - Entrega local (ML Premium)',
  'mercadolivre-premium',
  {
    precoVenda: 100,
    custoProduto: 40,
    custoEmbalagem: 5,
    custoFrete: 0,
    isMEI: true
  },
  {
    lucroLiquido: 37.5,
    margemLucro: 37.5,
    comissaoMarketplace: 17.5,
    taxaFixaMarketplace: 0
  }
);

runTest(
  'Embalagem ZERO - Produto sem embalagem (Pix)',
  'pix',
  {
    precoVenda: 50,
    custoProduto: 20,
    custoEmbalagem: 0,
    custoFrete: 5,
    pixGatewayFee: 0.5,
    isMEI: true
  },
  {
    lucroLiquido: 24.75,
    margemLucro: 49.5,
    comissaoMarketplace: 0.25,
    taxaFixaMarketplace: 0
  }
);

runTest(
  'Taxa Pix ZERO - Sem intermediador (Pix)',
  'pix',
  {
    precoVenda: 100,
    custoProduto: 40,
    custoEmbalagem: 5,
    custoFrete: 15,
    pixGatewayFee: 0,
    isMEI: true
  },
  {
    lucroLiquido: 40,
    margemLucro: 40,
    comissaoMarketplace: 0,
    taxaFixaMarketplace: 0
  }
);

// ============================================
// EDGE CASES: LIMITES MERCADO LIVRE R$ 79
// ============================================
console.log(`${colors.bold}🎯 EDGE CASE: LIMITE R$ 79 (Taxa Fixa ML)${colors.reset}\n`);

runTest(
  'EXATAMENTE R$ 79,00 - No limite (ML Clássico)',
  'mercadolivre-classico',
  {
    precoVenda: 79,
    custoProduto: 30,
    custoEmbalagem: 5,
    custoFrete: 10,
    isMEI: true
  },
  {
    lucroLiquido: 24.13, // 79 - 30 - 5 - 10 - 9.875 = 24.125 (taxa fixa não aplicada, >= 79)
    margemLucro: 30.54,
    comissaoMarketplace: 9.88,
    taxaFixaMarketplace: 0 // >= 79, sem taxa fixa
  }
);

runTest(
  'R$ 78,99 - Logo abaixo (ML Premium)',
  'mercadolivre-premium',
  {
    precoVenda: 78.99,
    custoProduto: 30,
    custoEmbalagem: 5,
    custoFrete: 10,
    isMEI: true
  },
  {
    lucroLiquido: 13.67, // 78.99 - 30 - 5 - 10 - 13.82 - 6.5 = 13.67
    margemLucro: 17.30,
    comissaoMarketplace: 13.82,
    taxaFixaMarketplace: 6.5 // < 79, tem taxa fixa
  }
);

runTest(
  'R$ 79,01 - Logo acima (ML Clássico)',
  'mercadolivre-classico',
  {
    precoVenda: 79.01,
    custoProduto: 30,
    custoEmbalagem: 5,
    custoFrete: 10,
    isMEI: true
  },
  {
    lucroLiquido: 24.13,
    margemLucro: 30.55,
    comissaoMarketplace: 9.88,
    taxaFixaMarketplace: 0
  }
);

runTest(
  'R$ 80,00 - Acima do limite (ML Premium)',
  'mercadolivre-premium',
  {
    precoVenda: 80,
    custoProduto: 30,
    custoEmbalagem: 5,
    custoFrete: 10,
    isMEI: true
  },
  {
    lucroLiquido: 21,
    margemLucro: 26.25,
    comissaoMarketplace: 14,
    taxaFixaMarketplace: 0
  }
);

// ============================================
// EDGE CASES: PRODUTOS BARATOS
// ============================================
console.log(`${colors.bold}💸 EDGE CASE: PRODUTOS MUITO BARATOS${colors.reset}\n`);

runTest(
  'Produto R$ 10 - Taxa fixa maior que comissão (ML Clássico)',
  'mercadolivre-classico',
  {
    precoVenda: 10,
    custoProduto: 2,
    custoEmbalagem: 0.5,
    custoFrete: 5,
    isMEI: true
  },
  {
    lucroLiquido: -5.25, // 10 - 2 - 0.5 - 5 - 1.25 - 6.5 = -5.25
    margemLucro: -52.5,
    comissaoMarketplace: 1.25,
    taxaFixaMarketplace: 6.5 // < 79, tem taxa fixa
  }
);

runTest(
  'Produto R$ 5 - Prejuízo garantido (ML Premium)',
  'mercadolivre-premium',
  {
    precoVenda: 5,
    custoProduto: 1,
    custoEmbalagem: 0.5,
    custoFrete: 3,
    isMEI: true
  },
  {
    lucroLiquido: -6.875,
    margemLucro: -137.5,
    comissaoMarketplace: 0.875,
    taxaFixaMarketplace: 6.5
  }
);

// ============================================
// EDGE CASES: PRODUTOS CAROS
// ============================================
console.log(`${colors.bold}💎 EDGE CASE: PRODUTOS MUITO CAROS${colors.reset}\n`);

runTest(
  'Produto R$ 1.000 - Alta comissão (Shopee)',
  'shopee',
  {
    precoVenda: 1000,
    custoProduto: 600,
    custoEmbalagem: 20,
    custoFrete: 50,
    isMEI: true
  },
  {
    lucroLiquido: 126,
    margemLucro: 12.6,
    comissaoMarketplace: 200,
    taxaFixaMarketplace: 4
  }
);

runTest(
  'Produto R$ 5.000 - Muito caro (ML Premium)',
  'mercadolivre-premium',
  {
    precoVenda: 5000,
    custoProduto: 3000,
    custoEmbalagem: 50,
    custoFrete: 100,
    isMEI: true
  },
  {
    lucroLiquido: 975,
    margemLucro: 19.5,
    comissaoMarketplace: 875,
    taxaFixaMarketplace: 0
  }
);

// ============================================
// EDGE CASES: SIMPLES NACIONAL EXTREMOS
// ============================================
console.log(`${colors.bold}🏛️ EDGE CASE: ALÍQUOTAS EXTREMAS SIMPLES${colors.reset}\n`);

runTest(
  'Simples 4% - Mínimo (Pix)',
  'pix',
  {
    precoVenda: 100,
    custoProduto: 40,
    custoEmbalagem: 5,
    custoFrete: 15,
    isMEI: false,
    aliquotaImposto: 4,
    pixGatewayFee: 0
  },
  {
    lucroLiquido: 36,
    margemLucro: 36,
    comissaoMarketplace: 0,
    taxaFixaMarketplace: 0
  }
);

runTest(
  'Simples 11,35% - Máximo (Shopee)',
  'shopee',
  {
    precoVenda: 200,
    custoProduto: 80,
    custoEmbalagem: 10,
    custoFrete: 20,
    isMEI: false,
    aliquotaImposto: 11.35
  },
  {
    lucroLiquido: 23.3, // 200 - 80 - 10 - 20 - 40 - 4 - 22.7 (11.35% de 200) = 23.3
    margemLucro: 11.65,
    comissaoMarketplace: 40,
    taxaFixaMarketplace: 4
  }
);

// ============================================
// EDGE CASES: SERVIÇOS DIGITAIS
// ============================================
console.log(`${colors.bold}💻 EDGE CASE: SERVIÇOS DIGITAIS (Sem custos físicos)${colors.reset}\n`);

runTest(
  'Serviço digital - Sem custos físicos (Pix)',
  'pix',
  {
    precoVenda: 50,
    custoProduto: 0,
    custoEmbalagem: 0,
    custoFrete: 0,
    pixGatewayFee: 1,
    isMEI: true
  },
  {
    lucroLiquido: 49.5,
    margemLucro: 99,
    comissaoMarketplace: 0.5,
    taxaFixaMarketplace: 0
  }
);

runTest(
  'Curso online R$ 297 - Típico (Pix)',
  'pix',
  {
    precoVenda: 297,
    custoProduto: 0,
    custoEmbalagem: 0,
    custoFrete: 0,
    pixGatewayFee: 0.75,
    isMEI: true
  },
  {
    lucroLiquido: 294.77,
    margemLucro: 99.25,
    comissaoMarketplace: 2.23,
    taxaFixaMarketplace: 0
  }
);

// ============================================
// EDGE CASES: CENTAVOS E PRECISÃO
// ============================================
console.log(`${colors.bold}🔬 EDGE CASE: PRECISÃO DE CENTAVOS${colors.reset}\n`);

runTest(
  'Preço com centavos R$ 99,99 (Shopee)',
  'shopee',
  {
    precoVenda: 99.99,
    custoProduto: 39.50,
    custoEmbalagem: 4.99,
    custoFrete: 14.50,
    isMEI: true
  },
  {
    lucroLiquido: 17.00, // 99.99 - 39.50 - 4.99 - 14.50 - 20.00 (arredondado) - 4 = 17.00
    margemLucro: 17.00,
    comissaoMarketplace: 20.00,
    taxaFixaMarketplace: 4
  }
);

runTest(
  'Valores decimais complexos R$ 123,45 (ML Premium)',
  'mercadolivre-premium',
  {
    precoVenda: 123.45,
    custoProduto: 45.67,
    custoEmbalagem: 6.78,
    custoFrete: 12.34,
    isMEI: true
  },
  {
    lucroLiquido: 37.06,
    margemLucro: 30.02,
    comissaoMarketplace: 21.60,
    taxaFixaMarketplace: 0
  }
);

// ============================================
// EDGE CASES: MARGEM APERTADA
// ============================================
console.log(`${colors.bold}⚠️ EDGE CASE: MARGENS MUITO APERTADAS${colors.reset}\n`);

runTest(
  'Break-even quase exato - Prejuízo mínimo (ML Clássico)',
  'mercadolivre-classico',
  {
    precoVenda: 100,
    custoProduto: 70,
    custoEmbalagem: 8,
    custoFrete: 12,
    isMEI: true
  },
  {
    lucroLiquido: -2.5,
    margemLucro: -2.5,
    comissaoMarketplace: 12.5,
    taxaFixaMarketplace: 0
  }
);

runTest(
  'Lucro de R$ 1,00 - Margem mínima viável (Shopee)',
  'shopee',
  {
    precoVenda: 100,
    custoProduto: 55,
    custoEmbalagem: 8,
    custoFrete: 12,
    isMEI: true
  },
  {
    lucroLiquido: 1,
    margemLucro: 1,
    comissaoMarketplace: 20,
    taxaFixaMarketplace: 4
  }
);

// ============================================
// RESUMO FINAL
// ============================================
console.log(`\n${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bold}RESUMO DOS TESTES ESTENDIDOS${colors.reset}\n`);
console.log(`Total de testes: ${colors.bold}${testCount}${colors.reset}`);
console.log(`${colors.green}Passou: ${passCount}${colors.reset}`);
console.log(`${colors.red}Falhou: ${failCount}${colors.reset}\n`);

const successRate = ((passCount / testCount) * 100).toFixed(1);
console.log(`Taxa de sucesso: ${colors.bold}${successRate}%${colors.reset}\n`);

if (failCount === 0) {
  console.log(`${colors.green}${colors.bold}✓ TODOS OS TESTES PASSARAM! 🎉${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${colors.red}${colors.bold}✗ ALGUNS TESTES FALHARAM${colors.reset}\n`);
  process.exit(1);
}

