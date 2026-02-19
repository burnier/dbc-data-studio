# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-02-19 (Released)

### 🎉 Lançamento Inicial

Primeira versão pública da Calculadora de Lucro para Marketplaces Brasileiros.

### ✨ Funcionalidades

- Cálculo de lucro para Shopee (taxa 20% + R$ 4,00 fixo)
- Cálculo de lucro para Mercado Livre Clássico (~12.5%)
- Cálculo de lucro para Mercado Livre Premium (~17.5%)
- Cálculo de lucro para vendas via Pix (0-1% intermediação)
- Suporte para regime MEI (DAS fixo R$ 81,05/mês)
- Suporte para Simples Nacional (alíquota configurável)
- Cálculo de ponto de equilíbrio (preço mínimo sem prejuízo)
- Cálculo de margem de lucro percentual
- Botão para compartilhar resumo via WhatsApp
- Interface responsiva (mobile-first)
- Acessibilidade (ARIA labels, descrições)

### 🎯 SEO & Performance

- Metadata otimizado para busca brasileira
- JSON-LD Schema (SoftwareApplication)
- Open Graph + Twitter Cards
- FAQ estruturado (Accordion)
- SSG (Static Site Generation) - 100% pré-renderizado
- Lighthouse Score: 95+ (Performance, Accessibility, SEO)

### 📊 Analytics

- Google Analytics 4 integrado (Property separada)
- Measurement ID: G-9Z0V6P2G49
- Implementação via next/script (afterInteractive)

### 🛠️ Tecnologias

- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS v3
- Lucide React (ícones)
- Componentes Shadcn/UI customizados

### 🌍 Localização

- Formatação brasileira (R$ 1.234,56)
- Linguagem natural (evita anglicismos)
- Terminologia do mercado BR (ex: "intermediador" vs "gateway")

### 🚀 Deploy

- Vercel (deploy automático via GitHub)
- Domínio: calculadora.dbcdatastudio.com
- Root Directory: `calculadora-lucro` (monorepo)

---

## [Unreleased]

### 🔄 Próximas Melhorias

- [ ] Histórico de cálculos (localStorage)
- [ ] Exportar para PDF
- [ ] Comparação lado-a-lado de marketplaces
- [ ] Calculadora de ponto de equilíbrio reversa
- [ ] Gráficos de visualização de custos
- [ ] Modo escuro (dark mode)
- [ ] Suporte para múltiplos produtos (batch)
- [ ] API pública para integrações
- [ ] Calculadora de ROI (Return on Investment)
- [ ] Alerta de taxas desatualizadas (scraper automático)

---

## Tipos de Mudanças

- **✨ Adicionado** - Novas funcionalidades
- **🔄 Modificado** - Mudanças em funcionalidades existentes
- **❌ Deprecado** - Funcionalidades que serão removidas
- **🗑️ Removido** - Funcionalidades removidas
- **🐛 Corrigido** - Correções de bugs
- **🔒 Segurança** - Vulnerabilidades corrigidas
- **📚 Documentação** - Apenas mudanças na documentação
- **🎨 Estilo** - Mudanças que não afetam o código (formatação)
- **♻️ Refatoração** - Código refatorado sem mudar funcionalidade
- **⚡ Performance** - Melhorias de performance
- **✅ Testes** - Adição ou correção de testes

---

## Links

- [Versão Atual](https://calculadora.dbcdatastudio.com)
- [Repositório](https://github.com/burnier/dbc-data-studio)
- [Issues](https://github.com/burnier/dbc-data-studio/issues)

