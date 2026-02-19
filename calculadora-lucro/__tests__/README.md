# Testes

Esta pasta contém testes automatizados para a lógica de negócio da calculadora.

## Executar Testes

```bash
npm test
```

ou

```bash
node __tests__/calculator.test.js
```

## Estrutura

- `calculator.test.js` - Testes da lógica de cálculo de lucro

## Adicionando Novos Testes

Para adicionar novos testes, siga o padrão:

```javascript
test('Nome do teste', () => {
  const result = calculateProfit({...});
  assertEquals(result.lucroLiquido, esperado, 'mensagem');
});
```

## Cobertura

Testes atuais cobrem:
- ✅ Shopee (taxa 20% + R$ 4,00)
- ✅ Mercado Livre Clássico (~12.5%)
- ✅ Mercado Livre Premium (~17.5%)
- ✅ Pix (0-1%)
- ✅ MEI (DAS fixo)
- ✅ Simples Nacional (alíquota variável)
- ✅ Edge cases (valores extremos)

