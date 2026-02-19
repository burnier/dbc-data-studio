# 📊 Guia Completo: Google Analytics 4 na Calculadora

## 🔍 Status Atual da Implementação

### ✅ O que está implementado:
- **Measurement ID**: `G-9Z0V6P2G49` (Property separada: "Calculadora de Lucros")
- **Stream ID**: `13633731253`
- **Localização**: `app/layout.tsx` (linhas 119-131)
- **Estratégia de carregamento**: `afterInteractive` (otimizado para Next.js)
- **Implementação**: Correta via `next/script`

---

## 🚨 Por que não está aparecendo no GA4?

### Possíveis causas:

#### 1. **Delay Natural do GA4** ⏱️
- GA4 pode levar **24 a 48 horas** para começar a indexar um novo domínio
- Se você fez deploy hoje/ontem, é normal não aparecer ainda

#### 2. **Property Configuration** ⚙️
- O GA4 `G-3TDM0F1QX8` precisa estar configurado para aceitar dados de:
  - ✅ `calculadora.dbcdatastudio.com` (produção)
  - ✅ `localhost:3002` (desenvolvimento - opcional)

**Como verificar:**
1. Acesse [Google Analytics](https://analytics.google.com)
2. Vá em **Admin** > **Data Streams**
3. Verifique se há um stream configurado para `calculadora.dbcdatastudio.com`
4. Se não existe, **crie um novo Web Stream** para este domínio

#### 3. **Usando a mesma Property para múltiplos sites** 🔗
Se você está usando `G-3TDM0F1QX8` para **ambos**:
- `modeler.dbcdatastudio.com` ✅ (aparece)
- `calculadora.dbcdatastudio.com` ❌ (não aparece)

**Soluções:**
- **Opção A (Recomendada)**: Criar uma **Property separada** para a calculadora
  - Vantagens: Relatórios independentes, métricas mais limpas
  - Você terá um novo ID tipo `G-XXXXXXXXX`
  
- **Opção B**: Usar a mesma Property e filtrar por `hostname`
  - Vantagens: Centralizado em um único dashboard
  - Desvantagens: Pode misturar métricas

#### 4. **Build em Produção** 🚀
O GA4 no Next.js só é injetado corretamente após:
```bash
npm run build
vercel --prod
```

Se você só fez `vercel` (preview deploy), pode não estar capturando corretamente.

---

## 🧪 Como Testar AGORA

### Opção 1: Realtime Reports (Melhor para teste imediato)

1. Acesse https://calculadora.dbcdatastudio.com
2. No GA4, vá em **Reports** > **Realtime**
3. Você deve ver:
   - **Users in last 30 minutes**: 1+ (você mesmo)
   - **Top pages**: `/` (página inicial)
   - **Event count**: `page_view`, `first_visit`, etc.

**Se não aparecer nada em Realtime após 2-3 minutos:**
- ❌ O GA4 não está enviando dados (problema na configuração)

### Opção 2: DevTools (Teste Técnico)

Acesse https://calculadora.dbcdatastudio.com e:

1. Abra **DevTools** (F12)
2. Vá para a aba **Network**
3. Filtre por `collect` ou `google-analytics`
4. Recarregue a página
5. Você deve ver requisições para:
   ```
   https://www.google-analytics.com/g/collect?...
   ```
   Com parâmetros tipo:
   - `tid=G-3TDM0F1QX8` (seu Measurement ID)
   - `t=pageview`
   - `dl=https://calculadora.dbcdatastudio.com/`

**Se as requisições aparecem:**
- ✅ O código está enviando corretamente
- ⏱️ Aguarde 24-48h para aparecer nos relatórios

**Se NÃO aparecem requisições:**
- ❌ Problema no código ou build
- Veja "Solução de Problemas" abaixo

### Opção 3: Página de Teste Dedicada

Criei uma página de teste em: `/public/test-ga4.html`

**Para testar:**
1. Faça deploy ou rode localmente:
   ```bash
   cd /Users/dburnier/Documents/my_repos/dbc-data-studio/calculadora-lucro
   npm run build
   npm start
   ```
2. Acesse: `http://localhost:3002/test-ga4.html`
3. Abra o Console (F12) - você verá logs do GA4
4. Clique no botão "Enviar Evento de Teste"
5. Verifique na aba Network se a requisição foi enviada

---

## 🔧 Solução de Problemas

### Se o GA4 não está enviando requisições:

#### 1. Verificar o Build de Produção
```bash
cd /Users/dburnier/Documents/my_repos/dbc-data-studio/calculadora-lucro
npm run build
npm start
# Acesse localhost:3002 e teste no DevTools
```

#### 2. Verificar se o Script está no HTML final
```bash
# Ver o HTML renderizado
curl https://calculadora.dbcdatastudio.com | grep "gtag"
```

Você deve ver algo como:
```html
<script src="https://www.googletagmanager.com/gtag/js?id=G-3TDM0F1QX8"></script>
```

#### 3. Ad Blockers / Privacy Extensions
- Extensões como uBlock Origin, Privacy Badger bloqueiam GA4
- Teste em modo anônimo/privado SEM extensões

#### 4. Content Security Policy (CSP)
Se você configurou CSP headers, pode estar bloqueando o gtag.js
- Verifique no Console se há erros tipo "Blocked by CSP"

---

## 🎯 Configuração Ideal (Recomendação)

### Criar Property Separada para Calculadora

**Por quê?**
- Métricas independentes e mais claras
- Facilita análise de conversões específicas (ex: "cliques no botão WhatsApp")
- Não mistura tráfego de ferramentas diferentes

**Como fazer:**
1. No GA4, vá em **Admin**
2. Clique em **Create Property**
3. Nome: "Calculadora de Lucro"
4. Timezone: Brazil (GMT-3)
5. Currency: BRL
6. Crie um **Web Data Stream** para `calculadora.dbcdatastudio.com`
7. Copie o novo **Measurement ID** (ex: `G-YYYYYYYY`)
8. Atualize `app/layout.tsx`:

```typescript
// Linha 121
src="https://www.googletagmanager.com/gtag/js?id=G-YYYYYYYY"

// Linha 129
gtag('config', 'G-YYYYYYYY');
```

9. Faça build e deploy:
```bash
npm run build
vercel --prod
```

---

## 🚀 Eventos Customizados (Recomendação)

Para rastrear interações específicas da calculadora, adicione eventos customizados:

### Eventos sugeridos:

#### 1. Cálculo Realizado
```typescript
gtag('event', 'calculo_realizado', {
  'marketplace': 'shopee', // ou 'mercado_livre', 'pix'
  'lucro_liquido': 150.50,
  'margem_percentual': 15.5,
});
```

#### 2. Botão WhatsApp Clicado
```typescript
gtag('event', 'compartilhar_whatsapp', {
  'marketplace': 'shopee',
  'lucro': 150.50,
});
```

#### 3. Troca de Marketplace
```typescript
gtag('event', 'marketplace_mudou', {
  'de': 'shopee',
  'para': 'mercado_livre_classico',
});
```

#### 4. Checkbox MEI Ativado
```typescript
gtag('event', 'mei_checkbox', {
  'status': 'ativado', // ou 'desativado'
});
```

### Como implementar:

Adicione no `ProfitCalculator.tsx`:

```typescript
import { useEffect } from 'react';

// Quando o cálculo for feito:
useEffect(() => {
  if (result) {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.gtag) {
      // @ts-ignore
      window.gtag('event', 'calculo_realizado', {
        marketplace: inputs.marketplace,
        lucro_liquido: result.lucro.toFixed(2),
        margem_percentual: result.margem.toFixed(2),
      });
    }
  }
}, [result, inputs.marketplace]);
```

---

## 📈 Acessar GA4 via API - Sim, é possível!

### APIs Disponíveis:

#### 1. **Google Analytics Data API v1**
- **Uso**: Buscar dados de relatórios (pageviews, usuários, eventos, etc.)
- **Documentação**: https://developers.google.com/analytics/devguides/reporting/data/v1
- **Biblioteca Python**: `google-analytics-data`

#### 2. **Google Analytics Admin API**
- **Uso**: Gerenciar configurações (criar streams, properties, etc.)
- **Documentação**: https://developers.google.com/analytics/devguides/config/admin/v1

#### 3. **Measurement Protocol (GA4)**
- **Uso**: Enviar eventos server-side (backend tracking)
- **Documentação**: https://developers.google.com/analytics/devguides/collection/protocol/ga4

### Setup Rápido (Data API):

```bash
pip install google-analytics-data google-auth
```

**Script de exemplo:**
- Criei um exemplo completo em: `ga4-api-example.py`
- Inclui:
  - Relatório de Realtime
  - Top páginas (últimos 7 dias)
  - Fontes de tráfego
  - Eventos customizados
  - Exportar para CSV/Pandas

**Requisitos:**
1. Criar Service Account no Google Cloud
2. Baixar JSON de credenciais
3. No GA4: Admin > Property Access Management > Add Service Account email como "Viewer"
4. Aguardar 24h para sincronização

---

## 📊 Dashboards Úteis para a Calculadora

### Métricas Principais:

1. **Usuários Únicos** (por dia/semana/mês)
2. **Pageviews** (total de acessos)
3. **Engagement Rate** (% de sessões engajadas)
4. **Eventos "calculo_realizado"** (quantos cálculos foram feitos)
5. **Eventos "compartilhar_whatsapp"** (taxa de conversão)
6. **Fontes de Tráfego**:
   - google / organic (SEO)
   - google / cpc (anúncios)
   - direct / none (digitado direto)
   - referral (links de outros sites)

### Relatórios Customizados (Exploration):

**"Funil de Conversão":**
```
Página Carregada → Cálculo Realizado → WhatsApp Clicado
```

**"Marketplaces Mais Usados":**
- Event: `calculo_realizado`
- Dimension: `marketplace`
- Metric: `event_count`

---

## ✅ Checklist Final

- [ ] GA4 script está em `app/layout.tsx` (✅ JÁ ESTÁ)
- [ ] Measurement ID correto: `G-3TDM0F1QX8`
- [ ] Build de produção feito: `npm run build`
- [ ] Deploy em produção: `vercel --prod`
- [ ] Aguardar 24-48h para dados aparecerem
- [ ] Verificar Realtime Reports no GA4
- [ ] Testar com DevTools (Network tab - requisições para `collect`)
- [ ] (Opcional) Criar Property separada para calculadora
- [ ] (Opcional) Adicionar eventos customizados
- [ ] (Opcional) Configurar acesso via API

---

## 🆘 Precisa de Ajuda?

**Se após 48h ainda não aparecer:**
1. Verifique se a Property aceita dados de `calculadora.dbcdatastudio.com`
2. Confirme que não há Ad Blockers ativos
3. Teste com `curl` se o script está no HTML
4. Use a página de teste: `/test-ga4.html`

**Para acesso via API:**
1. Siga o guia em `ga4-api-example.py`
2. Documente o Property ID correto (formato `properties/123456789`)
3. Configure Service Account com permissões

---

**Criado por:** DBC Data Studio  
**Última atualização:** 19 de Fevereiro de 2026  
**Calculadora:** https://calculadora.dbcdatastudio.com

