#!/bin/bash

# Setup script para Calculadora de Lucro
# Este script instala as dependências e prepara o ambiente

echo "🚀 Configurando Calculadora de Lucro para Marketplaces..."
echo ""

# Verifica se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js primeiro."
    echo "   Visite: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"
echo "✅ npm $(npm -v) encontrado"
echo ""

# Navega para o diretório correto
cd "$(dirname "$0")"

# Remove node_modules se existir
if [ -d "node_modules" ]; then
    echo "🧹 Removendo node_modules existente..."
    rm -rf node_modules
fi

# Remove package-lock.json se existir
if [ -f "package-lock.json" ]; then
    echo "🧹 Removendo package-lock.json existente..."
    rm -f package-lock.json
fi

# Instala as dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erro ao instalar dependências."
    exit 1
fi

echo ""
echo "✅ Instalação concluída com sucesso!"
echo ""
echo "📝 Para executar em desenvolvimento:"
echo "   npm run dev"
echo ""
echo "🏗️  Para build de produção:"
echo "   npm run build"
echo "   npm start"
echo ""
echo "🌐 A aplicação estará disponível em: http://localhost:3002"
echo ""

