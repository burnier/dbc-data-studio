# Calculadora de Lucro para Marketplaces Brasileiros 2026

Uma calculadora moderna e otimizada para SEO que ajuda vendedores brasileiros a calcular seu lucro real em marketplaces como Shopee, Mercado Livre e vendas diretas via Pix.

## 🚀 Funcionalidades

- ✅ **Cálculo preciso** com taxas atualizadas de 2026
- ✅ **Múltiplos marketplaces**: Shopee, Mercado Livre (Clássico e Premium), Pix
- ✅ **Impostos brasileiros**: Suporte para MEI e Simples Nacional
- ✅ **Interface moderna** com Tailwind CSS e Shadcn/UI
- ✅ **Responsivo** e mobile-first
- ✅ **Formatação brasileira** (R$ 1.234,56)
- ✅ **Compartilhamento** fácil via WhatsApp
- ✅ **SEO otimizado** para Google

## 📊 Regras de Negócio 2026

### Shopee
- 14% comissão base
- 6% adicional para Frete Grátis
- R$ 4,00 taxa fixa por item

### Mercado Livre Clássico
- ~11-14% comissão (média 12,5%)
- R$ 6,50 taxa fixa para itens < R$ 79,00

### Mercado Livre Premium
- ~16-19% comissão (média 17,5%)
- R$ 6,50 taxa fixa para itens < R$ 79,00
- Permite parcelamento

### Pix / Venda Direta
- 0% a 1% taxa de gateway (personalizável)

### Impostos
- **MEI**: DAS fixo de R$ 81,05/mês
- **Simples Nacional**: Alíquota personalizável

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Componentes**: Shadcn/UI (customizados)

## 📦 Instalação

```bash
cd /Users/dburnier/Documents/my_repos/dbc-data-studio/calculadora-lucro
npm install
```

## 🚀 Executar em Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3002](http://localhost:3002) no seu navegador.

## 🏗️ Build para Produção

```bash
npm run build
npm start
```

## 📁 Estrutura de Arquivos

```
calculadora-lucro/
├── app/
│   ├── layout.tsx          # Layout raiz com SEO
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globais
├── components/
│   ├── ProfitCalculator.tsx # Componente principal
│   └── ui/
│       ├── button.tsx      # Botão customizado
│       ├── card.tsx        # Card customizado
│       └── input.tsx       # Input customizado
├── lib/
│   ├── calculator.ts       # Lógica de cálculo
│   └── utils.ts           # Utilitários (formatação BR)
└── package.json
```

## 🎯 SEO

A aplicação está otimizada para SEO com:
- Meta tags completas
- Open Graph para redes sociais
- Conteúdo educacional rico ("Como Calcular")
- H1 otimizado: "Calculadora de Lucro Shopee e Mercado Livre 2026"
- Schema markup ready

## 🤝 Contribuindo

Esta é uma ferramenta educacional para ajudar vendedores brasileiros. Contribuições são bem-vindas!

## 📄 Licença

Este projeto é privado e parte do portfólio DBC Data Studio.

## ⚠️ Disclaimer

Esta calculadora é uma ferramenta educacional. Para orientações fiscais específicas, consulte sempre um contador profissional.

