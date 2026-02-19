// ========================================
// TESTE ESPECÍFICO: CHECKBOX "SOU MEI"
// Valida o comportamento do checkbox MEI
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

function compareResults(testName, inputsBase, meiResult, simplesResult, expectedDifference) {
  testCount++;
  console.log(`\n${colors.blue}[TESTE ${testCount}]${colors.reset} ${testName}`);
  console.log(`  Preço: R$ ${inputsBase.precoVenda.toFixed(2)}`);
  console.log(`  Marketplace: ${inputsBase.marketplace}`);
  
  console.log(`\n  ${colors.cyan}📋 COM MEI (checkbox marcado):${colors.reset}`);
  console.log(`    Lucro: R$ ${meiResult.lucroLiquido.toFixed(2)}`);
  console.log(`    Margem: ${meiResult.margemLucro.toFixed(2)}%`);
  console.log(`    Impostos: R$ ${meiResult.breakdown.impostos.toFixed(2)}`);
  
  console.log(`\n  ${colors.yellow}📋 SEM MEI (checkbox desmarcado, Simples ${inputsBase.aliquotaImposto}%):${colors.reset}`);
  console.log(`    Lucro: R$ ${simplesResult.lucroLiquido.toFixed(2)}`);
  console.log(`    Margem: ${simplesResult.margemLucro.toFixed(2)}%`);
  console.log(`    Impostos: R$ ${simplesResult.breakdown.impostos.toFixed(2)}`);
  
  const actualDifference = meiResult.lucroLiquido - simplesResult.lucroLiquido;
  const tolerance = 0.01;
  
  console.log(`\n  ${colors.bright}💰 DIFERENÇA NO LUCRO:${colors.reset}`);
  console.log(`    R$ ${actualDifference.toFixed(2)} (esperado: R$ ${expectedDifference.toFixed(2)})`);
  
  let allPassed = true;
  
  // Verificar se MEI não tem impostos
  if (meiResult.breakdown.impostos !== 0) {
    console.log(`  ${colors.red}✗${colors.reset} MEI deveria ter impostos = R$ 0,00 mas tem R$ ${meiResult.breakdown.impostos.toFixed(2)}`);
    allPassed = false;
  } else {
    console.log(`  ${colors.green}✓${colors.reset} MEI corretamente com impostos = R$ 0,00`);
  }
  
  // Verificar se Simples tem impostos calculados
  if (Math.abs(simplesResult.breakdown.impostos - expectedDifference) > tolerance) {
    console.log(`  ${colors.red}✗${colors.reset} Simples deveria ter R$ ${expectedDifference.toFixed(2)} de impostos mas tem R$ ${simplesResult.breakdown.impostos.toFixed(2)}`);
    allPassed = false;
  } else {
    console.log(`  ${colors.green}✓${colors.reset} Simples corretamente com impostos = R$ ${simplesResult.breakdown.impostos.toFixed(2)}`);
  }
  
  // Verificar diferença no lucro
  if (Math.abs(actualDifference - expectedDifference) > tolerance) {
    console.log(`  ${colors.red}✗${colors.reset} Diferença no lucro incorreta`);
    allPassed = false;
  } else {
    console.log(`  ${colors.green}✓${colors.reset} Diferença no lucro correta`);
  }
  
  if (allPassed) {
    console.log(`\n  ${colors.green}${colors.bold}PASSOU ✓${colors.reset}`);
    passCount++;
  } else {
    console.log(`\n  ${colors.red}${colors.bold}FALHOU ✗${colors.reset}`);
    failCount++;
  }
}

// ============================================
// INICIAR TESTES DO CHECKBOX MEI
// ============================================
console.log(`\n${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}  TESTE DO CHECKBOX "SOU MEI"  ${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);

console.log(`\n${colors.dim}Validando que marcar/desmarcar o checkbox MEI${colors.reset}`);
console.log(`${colors.dim}altera corretamente os cálculos de impostos${colors.reset}\n`);

// ============================================
// TESTE 1: Shopee - MEI vs Simples 6%
// ============================================
const inputs1 = {
  precoVenda: 100,
  custoProduto: 40,
  custoEmbalagem: 5,
  custoFrete: 15,
  marketplace: 'shopee',
  aliquotaImposto: 6
};

const mei1 = calculateProfit({ ...inputs1, isMEI: true });
const simples1 = calculateProfit({ ...inputs1, isMEI: false });
const expectedDiff1 = 6; // 6% de R$ 100 = R$ 6

compareResults(
  'Shopee - Toggle MEI checkbox (6% Simples)',
  inputs1,
  mei1,
  simples1,
  expectedDiff1
);

// ============================================
// TESTE 2: ML Clássico - MEI vs Simples 4%
// ============================================
const inputs2 = {
  precoVenda: 150,
  custoProduto: 60,
  custoEmbalagem: 8,
  custoFrete: 20,
  marketplace: 'mercadolivre-classico',
  aliquotaImposto: 4
};

const mei2 = calculateProfit({ ...inputs2, isMEI: true });
const simples2 = calculateProfit({ ...inputs2, isMEI: false });
const expectedDiff2 = 6; // 4% de R$ 150 = R$ 6

compareResults(
  'ML Clássico - Toggle MEI checkbox (4% Simples)',
  inputs2,
  mei2,
  simples2,
  expectedDiff2
);

// ============================================
// TESTE 3: ML Premium - MEI vs Simples 8%
// ============================================
const inputs3 = {
  precoVenda: 200,
  custoProduto: 100,
  custoEmbalagem: 10,
  custoFrete: 25,
  marketplace: 'mercadolivre-premium',
  aliquotaImposto: 8
};

const mei3 = calculateProfit({ ...inputs3, isMEI: true });
const simples3 = calculateProfit({ ...inputs3, isMEI: false });
const expectedDiff3 = 16; // 8% de R$ 200 = R$ 16

compareResults(
  'ML Premium - Toggle MEI checkbox (8% Simples)',
  inputs3,
  mei3,
  simples3,
  expectedDiff3
);

// ============================================
// TESTE 4: Pix - MEI vs Simples 11.35% (máximo)
// ============================================
const inputs4 = {
  precoVenda: 500,
  custoProduto: 200,
  custoEmbalagem: 20,
  custoFrete: 50,
  marketplace: 'pix',
  aliquotaImposto: 11.35,
  pixGatewayFee: 0.5
};

const mei4 = calculateProfit({ ...inputs4, isMEI: true });
const simples4 = calculateProfit({ ...inputs4, isMEI: false });
const expectedDiff4 = 56.75; // 11.35% de R$ 500 = R$ 56.75

compareResults(
  'Pix - Toggle MEI checkbox (11.35% Simples - máximo)',
  inputs4,
  mei4,
  simples4,
  expectedDiff4
);

// ============================================
// TESTE 5: Produto barato - MEI vs Simples 5%
// ============================================
const inputs5 = {
  precoVenda: 50,
  custoProduto: 20,
  custoEmbalagem: 3,
  custoFrete: 10,
  marketplace: 'shopee',
  aliquotaImposto: 5
};

const mei5 = calculateProfit({ ...inputs5, isMEI: true });
const simples5 = calculateProfit({ ...inputs5, isMEI: false });
const expectedDiff5 = 2.5; // 5% de R$ 50 = R$ 2.50

compareResults(
  'Produto barato R$ 50 - Toggle MEI checkbox (5% Simples)',
  inputs5,
  mei5,
  simples5,
  expectedDiff5
);

// ============================================
// TESTE 6: Produto caro - MEI vs Simples 10%
// ============================================
const inputs6 = {
  precoVenda: 1000,
  custoProduto: 600,
  custoEmbalagem: 30,
  custoFrete: 80,
  marketplace: 'mercadolivre-premium',
  aliquotaImposto: 10
};

const mei6 = calculateProfit({ ...inputs6, isMEI: true });
const simples6 = calculateProfit({ ...inputs6, isMEI: false });
const expectedDiff6 = 100; // 10% de R$ 1000 = R$ 100

compareResults(
  'Produto caro R$ 1.000 - Toggle MEI checkbox (10% Simples)',
  inputs6,
  mei6,
  simples6,
  expectedDiff6
);

// ============================================
// TESTE 7: Margem apertada - MEI vs Simples 7%
// ============================================
const inputs7 = {
  precoVenda: 100,
  custoProduto: 65,
  custoEmbalagem: 10,
  custoFrete: 15,
  marketplace: 'mercadolivre-classico',
  aliquotaImposto: 7
};

const mei7 = calculateProfit({ ...inputs7, isMEI: true });
const simples7 = calculateProfit({ ...inputs7, isMEI: false });
const expectedDiff7 = 7; // 7% de R$ 100 = R$ 7

compareResults(
  'Margem apertada - Toggle MEI checkbox (7% Simples)',
  inputs7,
  mei7,
  simples7,
  expectedDiff7
);

// ============================================
// TESTE 8: Serviço digital - MEI vs Simples 6%
// ============================================
const inputs8 = {
  precoVenda: 297,
  custoProduto: 0,
  custoEmbalagem: 0,
  custoFrete: 0,
  marketplace: 'pix',
  aliquotaImposto: 6,
  pixGatewayFee: 0.75
};

const mei8 = calculateProfit({ ...inputs8, isMEI: true });
const simples8 = calculateProfit({ ...inputs8, isMEI: false });
const expectedDiff8 = 17.82; // 6% de R$ 297 = R$ 17.82

compareResults(
  'Serviço digital R$ 297 - Toggle MEI checkbox (6% Simples)',
  inputs8,
  mei8,
  simples8,
  expectedDiff8
);

// ============================================
// RESUMO FINAL
// ============================================
console.log(`\n\n${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bold}RESUMO DOS TESTES DO CHECKBOX MEI${colors.reset}\n`);
console.log(`Total de testes: ${colors.bold}${testCount}${colors.reset}`);
console.log(`${colors.green}Passou: ${passCount}${colors.reset}`);
console.log(`${colors.red}Falhou: ${failCount}${colors.reset}\n`);

const successRate = ((passCount / testCount) * 100).toFixed(1);
console.log(`Taxa de sucesso: ${colors.bold}${successRate}%${colors.reset}\n`);

if (failCount === 0) {
  console.log(`${colors.green}${colors.bold}✓ CHECKBOX MEI FUNCIONA PERFEITAMENTE! 🎉${colors.reset}`);
  console.log(`${colors.dim}  → MEI corretamente não aplica impostos${colors.reset}`);
  console.log(`${colors.dim}  → Simples Nacional aplica alíquota correta${colors.reset}`);
  console.log(`${colors.dim}  → Diferença de lucro calculada com precisão${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${colors.red}${colors.bold}✗ ALGUNS TESTES FALHARAM${colors.reset}\n`);
  process.exit(1);
}

