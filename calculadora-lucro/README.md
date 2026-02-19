# 🧮 Calculadora de Lucro - Marketplaces Brasileiros 2026

> Calculadora gratuita de lucro para vendedores de Shopee, Mercado Livre e Pix.  
> **Live:** https://calculadora.dbcdatastudio.com

---

## 📋 Sobre

Ferramenta profissional para calcular lucro real em vendas online, considerando:
- ✅ Taxas atualizadas dos marketplaces (Março 2026)
- ✅ Impostos MEI e Simples Nacional
- ✅ Custos operacionais (produto, embalagem, frete)
- ✅ Ponto de equilíbrio e margem de lucro

---

## 🚀 Tecnologias

- **Framework:** Next.js 15 (App Router)
- **Estilo:** Tailwind CSS v3
- **Linguagem:** TypeScript
- **Ícones:** Lucide React
- **Componentes:** Shadcn/UI (customizados)
- **Deploy:** Vercel
- **Analytics:** Google Analytics 4 (Property separada: `G-9Z0V6P2G49`)

---

## 📁 Estrutura do Projeto

```
calculadora-lucro/
├── app/
│   ├── layout.tsx          # Root layout + GA4 + SEO metadata
│   ├── page.tsx            # Página principal + FAQ
│   └── globals.css         # Estilos globais
├── components/
│   ├── ProfitCalculator.tsx  # Componente principal da calculadora
│   └── ui/                   # Componentes Shadcn/UI
│       ├── accordion.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/
│   ├── calculator.ts       # Lógica de negócio (taxas, cálculos)
│   └── utils.ts            # Utilitários (formatação, cn helper)
├── public/
│   └── dbc-calculadora.jpg # Logo/Favicon
└── README.md               # Este arquivo
```

---

## 💻 Desenvolvimento Local

### Pré-requisitos
- Node.js 20+
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (porta 3002)
npm run dev

# Build para produção
npm run build

# Rodar build de produção
npm start
```

Acesse: http://localhost:3002

---

## 📊 Lógica de Negócio (2026)

### Shopee
- **14%** comissão base
- **+6%** Frete Grátis
- **+R$ 4,00** taxa fixa por item
- **Total:** ~20% + R$ 4,00

### Mercado Livre
#### Clássico:
- **11-14%** (média ~12,5%)
- **+R$ 6,50** taxa fixa (itens < R$ 79)

#### Premium:
- **16-19%** (média ~17,5%)
- **+R$ 6,50** taxa fixa (itens < R$ 79)
- Permite parcelamento

### Pix / Venda Direta
- **0-1%** taxa de intermediação (configurável)

### Impostos
- **MEI:** R$ 81,05 fixo/mês (não afeta cálculo por unidade)
- **Simples Nacional:** 4% a 11,35% sobre venda (variável)

---

## 🎯 SEO & Performance

### Otimizações Implementadas:
- ✅ **SSG (Static Site Generation)** - Página pré-renderizada
- ✅ **Metadata otimizado** - Title, description, keywords BR
- ✅ **Open Graph + Twitter Cards** - Compartilhamento social
- ✅ **JSON-LD Schema** - SoftwareApplication markup
- ✅ **FAQ estruturado** - Accordion para SEO
- ✅ **Mobile-first** - 100% responsivo
- ✅ **Lighthouse Score:** 95+ (Performance, Accessibility, SEO)

### Keywords Principais:
- calculadora de lucro shopee 2026
- taxas mercado livre 2026
- simulador de lucro marketplace
- calculadora mei

---

## 🔧 Configuração Vercel

### Deploy Automático
- **Branch:** `main`
- **Root Directory:** `calculadora-lucro`
- **Framework:** Next.js (auto-detectado)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### Domínios
- **Produção:** https://calculadora.dbcdatastudio.com
- **Preview:** `calculadora-lucro-*.vercel.app`

### Variáveis de Ambiente
Nenhuma necessária (GA4 ID está hardcoded).

---

## 📈 Google Analytics 4

- **Property:** "Calculadora de Lucros" (separada do Smart Data Modeler)
- **Measurement ID:** `G-9Z0V6P2G49`
- **Stream ID:** `13633731253`
- **Implementação:** `next/script` com `strategy="afterInteractive"`

---

## 🌍 Localização BR

### Formatação
- **Moeda:** R$ 1.234,56 (ponto para milhares, vírgula para decimais)
- **Percentuais:** 12,34% (vírgula decimal)
- **Data:** DD/MM/AAAA

### Linguagem
- Tom profissional, mas acessível
- Evita anglicismos desnecessários
- Terminologia do mercado brasileiro (ex: "intermediador" ao invés de "gateway")

---

## 🚢 Deploy

### Via Git (Recomendado)
```bash
git add .
git commit -m "feat: descrição da mudança"
git push origin main
# Deploy automático via Vercel
```

### Via Vercel CLI
```bash
cd calculadora-lucro/
vercel --prod
```

---

## 🐛 Troubleshooting

### Build falha com "Module not found @/lib/*"
**Causa:** Pasta `lib/` não está commitada.  
**Solução:** Verificar se `.gitignore` tem exceção para `!calculadora-lucro/lib/`

### Deploy mostra "No framework detected"
**Causa:** Root Directory não configurado corretamente.  
**Solução:** Settings > General > Root Directory = `calculadora-lucro`

### 404 NOT_FOUND em produção
**Causa:** Projeto Vercel com configuração corrupta.  
**Solução:** Deletar e recriar projeto no Vercel.

---

## 📝 Licença

© 2026 DBC Data Studio. Calculadora de uso gratuito para vendedores brasileiros.

---

## 🤝 Contribuindo

Este é um projeto interno. Para reportar bugs ou sugerir melhorias, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para a comunidade de vendedores brasileiros**
