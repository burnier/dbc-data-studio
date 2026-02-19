// Testes completos da lógica de cálculo
const { calculateProfit } = require('./calculator-cjs');

console.log('🧪 Executando testes completos da calculadora...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
        passed++;
    } catch (error) {
        console.log(`❌ ${name}`);
        console.log(`   Erro: ${error.message}\n`);
        failed++;
    }
}

function assertEquals(actual, expected, message = '') {
    if (Math.abs(actual - expected) > 0.01) {
        throw new Error(`${message}\n   Esperado: ${expected}\n   Recebido: ${actual}`);
    }
}

// ============================================
// TESTES SHOPEE
// ============================================
console.log('📦 TESTES SHOPEE\n');

test('Shopee: Lucro correto para venda de R$ 100', () => {
    const result = calculateProfit({
        precoVenda: 100,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'shopee',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    assertEquals(result.breakdown.comissaoMarketplace, 20, 'Comissão Shopee 20%');
    assertEquals(result.breakdown.taxaFixaMarketplace, 4, 'Taxa fixa Shopee R$ 4');
    assertEquals(result.lucroLiquido, 16, 'Lucro líquido Shopee');
    assertEquals(result.margemLucro, 16, 'Margem de lucro');
});

test('Shopee: Venda de R$ 50 (produto barato)', () => {
    const result = calculateProfit({
        precoVenda: 50,
        custoProduto: 20,
        custoEmbalagem: 2,
        custoFrete: 8,
        marketplace: 'shopee',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    assertEquals(result.breakdown.comissaoMarketplace, 10, 'Comissão 20% de R$ 50');
    assertEquals(result.breakdown.taxaFixaMarketplace, 4, 'Taxa fixa R$ 4');
    assertEquals(result.lucroLiquido, 6, 'Lucro líquido');
});

test('Shopee: Venda de R$ 500 (produto caro)', () => {
    const result = calculateProfit({
        precoVenda: 500,
        custoProduto: 200,
        custoEmbalagem: 10,
        custoFrete: 30,
        marketplace: 'shopee',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    assertEquals(result.breakdown.comissaoMarketplace, 100, 'Comissão 20% de R$ 500');
    assertEquals(result.breakdown.taxaFixaMarketplace, 4, 'Taxa fixa R$ 4');
    assertEquals(result.lucroLiquido, 156, 'Lucro líquido produto caro');
});

// ============================================
// TESTES MERCADO LIVRE CLÁSSICO
// ============================================
console.log('\n🛒 TESTES MERCADO LIVRE CLÁSSICO\n');

test('ML Clássico: Venda de R$ 100', () => {
    const result = calculateProfit({
        precoVenda: 100,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'mercadolivre-classico',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    assertEquals(result.breakdown.comissaoMarketplace, 12.5, 'Comissão ML Clássico 12.5%');
    assertEquals(result.breakdown.taxaFixaMarketplace, 6.5, 'Taxa fixa ML R$ 6,50');
    assertEquals(result.lucroLiquido, 21, 'Lucro líquido ML Clássico');
});

test('ML Clássico: Produto abaixo de R$ 79 (com taxa fixa)', () => {
    const result = calculateProfit({
        precoVenda: 70,
        custoProduto: 30,
        custoEmbalagem: 3,
        custoFrete: 10,
        marketplace: 'mercadolivre-classico',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    assertEquals(result.breakdown.comissaoMarketplace, 8.75, 'Comissão 12.5% de R$ 70');
    assertEquals(result.breakdown.taxaFixaMarketplace, 6.5, 'Taxa fixa aplicada');
});

test('ML Clássico: Produto acima de R$ 79 (com taxa fixa)', () => {
    const result = calculateProfit({
        precoVenda: 100,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'mercadolivre-classico',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    assertEquals(result.breakdown.taxaFixaMarketplace, 6.5, 'Taxa fixa ainda aplicada');
});

// ============================================
// TESTES MERCADO LIVRE PREMIUM
// ============================================
console.log('\n💎 TESTES MERCADO LIVRE PREMIUM\n');

test('ML Premium: Venda de R$ 100', () => {
    const result = calculateProfit({
        precoVenda: 100,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'mercadolivre-premium',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    assertEquals(result.breakdown.comissaoMarketplace, 17.5, 'Comissão ML Premium 17.5%');
    assertEquals(result.breakdown.taxaFixaMarketplace, 6.5, 'Taxa fixa ML Premium');
    assertEquals(result.lucroLiquido, 16, 'Lucro líquido ML Premium');
});

test('ML Premium: Produto de R$ 200', () => {
    const result = calculateProfit({
        precoVenda: 200,
        custoProduto: 80,
        custoEmbalagem: 8,
        custoFrete: 20,
        marketplace: 'mercadolivre-premium',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    assertEquals(result.breakdown.comissaoMarketplace, 35, 'Comissão 17.5% de R$ 200');
    assertEquals(result.breakdown.taxaFixaMarketplace, 6.5, 'Taxa fixa');
    assertEquals(result.lucroLiquido, 50.5, 'Lucro líquido');
});

// ============================================
// TESTES PIX
// ============================================
console.log('\n💰 TESTES PIX\n');

test('Pix: Taxa de 0% (sem intermediador)', () => {
    const result = calculateProfit({
        precoVenda: 100,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'pix',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    assertEquals(result.breakdown.comissaoMarketplace, 0, 'Taxa Pix 0%');
    assertEquals(result.lucroLiquido, 40, 'Lucro líquido Pix sem taxa');
});

test('Pix: Taxa de 0.5% (intermediador comum)', () => {
    const result = calculateProfit({
        precoVenda: 100,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'pix',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0.5,
    });

    assertEquals(result.breakdown.comissaoMarketplace, 0.5, 'Taxa Pix 0.5%');
    assertEquals(result.lucroLiquido, 39.5, 'Lucro líquido Pix 0.5%');
});

test('Pix: Taxa de 1% (intermediador mais caro)', () => {
    const result = calculateProfit({
        precoVenda: 100,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'pix',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 1,
    });

    assertEquals(result.breakdown.comissaoMarketplace, 1, 'Taxa Pix 1%');
    assertEquals(result.lucroLiquido, 39, 'Lucro líquido Pix 1%');
});

// ============================================
// TESTES MEI
// ============================================
console.log('\n🏢 TESTES MEI\n');

test('MEI: Imposto deve ser R$ 0 no cálculo individual', () => {
    const result = calculateProfit({
        precoVenda: 100,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'shopee',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    assertEquals(result.breakdown.impostos, 0, 'Impostos MEI devem ser 0 por venda');
});

test('MEI: Lucro não deve considerar DAS de R$ 81,05', () => {
    const result = calculateProfit({
        precoVenda: 100,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'pix',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    // O DAS é fixo mensal, não por venda
    assertEquals(result.breakdown.impostos, 0, 'DAS não entra no cálculo por unidade');
    assertEquals(result.lucroLiquido, 40, 'Lucro sem desconto de DAS');
});

// ============================================
// TESTES SIMPLES NACIONAL
// ============================================
console.log('\n📋 TESTES SIMPLES NACIONAL\n');

test('Simples: Alíquota de 4%', () => {
    const result = calculateProfit({
        precoVenda: 100,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'shopee',
        isMEI: false,
        aliquotaImposto: 4,
        pixGatewayFee: 0,
    });

    assertEquals(result.breakdown.impostos, 4, 'Impostos 4% de R$ 100');
    assertEquals(result.lucroLiquido, 12, 'Lucro líquido com Simples 4%');
});

test('Simples: Alíquota de 6%', () => {
    const result = calculateProfit({
        precoVenda: 100,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'shopee',
        isMEI: false,
        aliquotaImposto: 6,
        pixGatewayFee: 0,
    });

    assertEquals(result.breakdown.impostos, 6, 'Impostos 6% de R$ 100');
    assertEquals(result.lucroLiquido, 10, 'Lucro líquido com Simples 6%');
});

test('Simples: Alíquota de 11.35% (faixa mais alta)', () => {
    const result = calculateProfit({
        precoVenda: 100,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'shopee',
        isMEI: false,
        aliquotaImposto: 11.35,
        pixGatewayFee: 0,
    });

    assertEquals(result.breakdown.impostos, 11.35, 'Impostos 11.35% de R$ 100');
    assertEquals(result.lucroLiquido, 4.65, 'Lucro líquido com Simples 11.35%');
});

// ============================================
// TESTES EDGE CASES
// ============================================
console.log('\n⚠️  TESTES EDGE CASES\n');

test('Edge: Venda de R$ 0 resulta em prejuízo', () => {
    const result = calculateProfit({
        precoVenda: 0,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'shopee',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    if (result.lucroLiquido >= 0) {
        throw new Error('Lucro não pode ser positivo com preço de venda R$ 0');
    }
});

test('Edge: Todos os custos em R$ 0', () => {
    const result = calculateProfit({
        precoVenda: 100,
        custoProduto: 0,
        custoEmbalagem: 0,
        custoFrete: 0,
        marketplace: 'pix',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    assertEquals(result.lucroLiquido, 100, 'Lucro = preço quando custos são 0');
    assertEquals(result.margemLucro, 100, 'Margem = 100% quando custos são 0');
});

test('Edge: Custos maiores que preço de venda', () => {
    const result = calculateProfit({
        precoVenda: 50,
        custoProduto: 40,
        custoEmbalagem: 10,
        custoFrete: 20,
        marketplace: 'shopee',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    if (result.lucroLiquido >= 0) {
        throw new Error('Deve ter prejuízo quando custos > preço');
    }
});

test('Edge: Valor muito alto (R$ 10.000)', () => {
    const result = calculateProfit({
        precoVenda: 10000,
        custoProduto: 4000,
        custoEmbalagem: 50,
        custoFrete: 100,
        marketplace: 'shopee',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    assertEquals(result.breakdown.comissaoMarketplace, 2000, 'Comissão 20% de R$ 10.000');
    assertEquals(result.breakdown.taxaFixaMarketplace, 4, 'Taxa fixa continua R$ 4');
    assertEquals(result.lucroLiquido, 3846, 'Lucro produto muito caro');
});

test('Edge: Centavos (R$ 10,50)', () => {
    const result = calculateProfit({
        precoVenda: 10.5,
        custoProduto: 5,
        custoEmbalagem: 1,
        custoFrete: 2.5,
        marketplace: 'pix',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    assertEquals(result.lucroLiquido, 2, 'Cálculo com centavos');
});

// ============================================
// TESTES PONTO DE EQUILÍBRIO
// ============================================
console.log('\n📊 TESTES PONTO DE EQUILÍBRIO\n');

test('Ponto de Equilíbrio: Shopee', () => {
    const result = calculateProfit({
        precoVenda: 100,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'shopee',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    // Ponto de equilíbrio = custos / (1 - taxa)
    // (40 + 5 + 15 + 4) / (1 - 0.2) = 64 / 0.8 = 80
    if (result.pontoEquilibrio < 80 || result.pontoEquilibrio > 90) {
        throw new Error(`Ponto de equilíbrio Shopee fora do esperado: ${result.pontoEquilibrio}`);
    }
});

test('Ponto de Equilíbrio: Venda no ponto exato = lucro zero', () => {
    const result = calculateProfit({
        precoVenda: 100,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'shopee',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    // Vende exatamente no ponto de equilíbrio
    const resultEquilibrio = calculateProfit({
        precoVenda: result.pontoEquilibrio,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'shopee',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    // Lucro deve ser aproximadamente zero (tolerância de R$ 0,50)
    if (Math.abs(resultEquilibrio.lucroLiquido) > 0.5) {
        throw new Error(`Lucro no ponto de equilíbrio deve ser ~0, foi: ${resultEquilibrio.lucroLiquido}`);
    }
});

// ============================================
// TESTES MARGEM DE LUCRO
// ============================================
console.log('\n💹 TESTES MARGEM DE LUCRO\n');

test('Margem: Deve ser percentual do preço de venda', () => {
    const result = calculateProfit({
        precoVenda: 100,
        custoProduto: 40,
        custoEmbalagem: 5,
        custoFrete: 15,
        marketplace: 'shopee',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    // Lucro = 16, Preço = 100, Margem = 16%
    assertEquals(result.margemLucro, 16, 'Margem deve ser 16%');
});

test('Margem: Negativa quando há prejuízo', () => {
    const result = calculateProfit({
        precoVenda: 50,
        custoProduto: 60,
        custoEmbalagem: 5,
        custoFrete: 10,
        marketplace: 'shopee',
        isMEI: true,
        aliquotaImposto: 0,
        pixGatewayFee: 0,
    });

    if (result.margemLucro >= 0) {
        throw new Error('Margem deve ser negativa quando há prejuízo');
    }
});

// ============================================
// RESUMO
// ============================================
console.log('\n' + '='.repeat(60));
console.log(`✅ Testes passados: ${passed}`);
console.log(`❌ Testes falhados: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);
console.log(`📈 Taxa de sucesso: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
console.log('='.repeat(60));

if (failed === 0) {
    console.log('\n🎉 Todos os testes passaram! Calculadora 100% funcional.\n');
} else {
    console.log(`\n⚠️  ${failed} teste(s) falharam. Revisar implementação.\n`);
}

process.exit(failed > 0 ? 1 : 0);
