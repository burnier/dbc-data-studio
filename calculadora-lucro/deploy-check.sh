#!/bin/bash

# Quick Deploy Script para Vercel
# Faz o build e verifica se está tudo OK antes do deploy

echo "🚀 Preparando deploy para Vercel..."
echo ""

# Verifica se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na pasta calculadora-lucro"
    exit 1
fi

# Limpa builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf .next
rm -rf node_modules/.cache

# Instala dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

# Roda testes
echo "🧪 Rodando testes..."
node test-calculator.js

if [ $? -ne 0 ]; then
    echo "❌ Testes falharam! Corrija os erros antes de fazer deploy."
    exit 1
fi

# Testa o build
echo "🏗️  Testando build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build falhou! Corrija os erros antes de fazer deploy."
    exit 1
fi

echo ""
echo "✅ Todos os checks passaram!"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Se ainda não fez, inicialize o Git:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'feat: Calculadora de Lucro'"
echo ""
echo "2. Faça push para o GitHub/GitLab"
echo ""
echo "3. Deploy no Vercel:"
echo "   vercel"
echo "   (ou use o dashboard: https://vercel.com/new)"
echo ""
echo "4. Configure o subdomain:"
echo "   calculadora.dbcdatastudio.com"
echo ""
echo "🎉 Pronto para deploy!"
echo ""

