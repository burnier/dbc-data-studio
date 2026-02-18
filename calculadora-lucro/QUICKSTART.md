# 🚀 Guia de Início Rápido

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

## ⚡ Instalação Rápida

### Opção 1: Script Automatizado (Recomendado)

```bash
cd /Users/dburnier/Documents/my_repos/dbc-data-studio/calculadora-lucro
./setup.sh
```

### Opção 2: Manual

```bash
cd /Users/dburnier/Documents/my_repos/dbc-data-studio/calculadora-lucro
npm install
npm run dev
```

## 🌐 Acesso

Abra seu navegador em: **http://localhost:3002**

---

## 📁 Estrutura do Projeto

```
calculadora-lucro/
│
├── 📄 README.md                    # Documentação principal
├── 📄 QUICKSTART.md               # Este arquivo
├── 📄 setup.sh                    # Script de instalação
├── 📄 package.json                # Dependências
│
├── 📂 app/                        # Next.js App Router
│   ├── layout.tsx                 # Layout + SEO metadata
│   ├── page.tsx                   # Página principal (Hero + Conteúdo SEO)
│   └── globals.css                # Estilos globais
│
├── 📂 components/                 # Componentes React
│   ├── ProfitCalculator.tsx      # Calculadora principal (client component)
│   └── ui/                        # Componentes UI (Shadcn-inspired)
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
│
├── 📂 lib/                        # Lógica de negócio
│   ├── calculator.ts              # Cálculos de lucro e taxas 2026
│   └── utils.ts                   # Formatação brasileira + utilitários
│
└── ⚙️ Configuração
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── .eslintrc.json
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Calculadora de Lucro
- [x] Suporte a 4 canais: Shopee, ML Clássico, ML Premium, Pix
- [x] Inputs para preço, custos (produto, embalagem, frete)
- [x] Cálculo automático em tempo real
- [x] Impostos: MEI (DAS R$ 81,05) ou Simples Nacional (% customizável)

### ✅ Taxas 2026 Atualizadas
- [x] **Shopee**: 20% (14% + 6% frete) + R$ 4,00
- [x] **ML Clássico**: ~12,5% + R$ 6,50 (se < R$ 79)
- [x] **ML Premium**: ~17,5% + R$ 6,50 (se < R$ 79)
- [x] **Pix**: 0-1% gateway (customizável)

### ✅ Dashboard de Resultados
- [x] Lucro Líquido (verde se positivo, vermelho se negativo)
- [x] Margem de Lucro %
- [x] Ponto de Equilíbrio
- [x] Breakdown detalhado de custos

### ✅ UX/UI Moderna
- [x] Design mobile-first
- [x] Tailwind CSS com gradientes
- [x] Ícones Lucide React
- [x] Formatação brasileira (R$ 1.234,56)
- [x] Botão "Copiar para WhatsApp"

### ✅ SEO Otimizado
- [x] Meta tags completas (title, description, keywords)
- [x] Open Graph para redes sociais
- [x] H1: "Calculadora de Lucro Shopee e Mercado Livre 2026"
- [x] Seção "Como Calcular" com 1500+ palavras de conteúdo educacional
- [x] Schema-ready para rich snippets

---

## 🧪 Testando Localmente

1. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Teste com valores exemplo:**
   - Preço de Venda: R$ 100,00
   - Custo Produto: R$ 40,00
   - Custo Embalagem: R$ 5,00
   - Frete: R$ 15,00
   - Marketplace: Shopee
   - MEI: ✓

   **Resultado esperado:**
   - Lucro Líquido: ~R$ 16,00
   - Margem: ~16%

3. **Teste o botão "Copiar para WhatsApp"**
   - Clique e cole em um editor de texto
   - Verifique a formatação brasileira

---

## 🚀 Deploy (Produção)

### Vercel (Recomendado para Next.js)

```bash
# Instale Vercel CLI
npm i -g vercel

# Faça o deploy
vercel
```

### Build Manual

```bash
npm run build
npm start
```

O build otimizado estará na pasta `.next/`

---

## 🎨 Customização

### Alterar Cores (Brand)

Edite `app/globals.css` e `tailwind.config.ts`:

```css
/* Trocar verde por azul, por exemplo */
bg-green-600 → bg-blue-600
text-green-700 → text-blue-700
```

### Adicionar Novo Marketplace

1. Abra `lib/calculator.ts`
2. Adicione o tipo em `MarketplaceType`
3. Implemente as taxas em `getMarketplaceFees()`
4. Adicione a opção em `app/page.tsx` (array `marketplaceOptions`)

### Ajustar Taxas

Edite as taxas em `lib/calculator.ts` na função `getMarketplaceFees()`.

---

## 📊 Analytics (Opcional)

Para adicionar Google Analytics:

1. Crie uma conta no Google Analytics 4
2. Obtenha o Measurement ID (ex: G-XXXXXXXXXX)
3. Adicione ao `app/layout.tsx`:

```tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
```

---

## 🐛 Troubleshooting

### Erro: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro de Port (3002 já em uso)
Altere a porta em `package.json`:
```json
"dev": "next dev -p 3003"
```

### Tailwind não carrega
```bash
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
```

---

## 📞 Suporte

Para dúvidas sobre o código:
- Leia o README.md principal
- Confira os comentários no código
- Consulte a documentação do Next.js: https://nextjs.org/docs

---

## ✨ Próximos Passos Sugeridos

- [ ] Adicionar histórico de cálculos (localStorage)
- [ ] Exportar para PDF
- [ ] Comparação lado a lado de marketplaces
- [ ] Calculadora de ticket médio
- [ ] Gráficos de margem
- [ ] Integração com APIs dos marketplaces (futuro)

---

**Desenvolvido com ❤️ por DBC Data Studio | 2026**

