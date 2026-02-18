# 🚀 Guia de Deploy no Vercel

## Calculadora de Lucro → calculadora.dbcdatastudio.com

---

## 📋 Pré-requisitos

- ✅ Conta Vercel (você já tem)
- ✅ Domínio dbcdatastudio.com configurado no Vercel
- ✅ Vercel CLI instalado (opcional)

---

## 🎯 Opção 1: Deploy via Vercel Dashboard (Recomendado)

### Passo 1: Preparar o Repositório

Se o projeto ainda não está no Git:

```bash
cd /Users/dburnier/Documents/my_repos/dbc-data-studio/calculadora-lucro

# Inicializar Git (se necessário)
git init
git add .
git commit -m "feat: Calculadora de Lucro para Marketplaces Brasileiros 2026"

# Fazer push para GitHub/GitLab
git remote add origin <seu-repositorio>
git push -u origin main
```

### Passo 2: Importar no Vercel

1. Acesse: https://vercel.com/new
2. Clique em **"Import Project"**
3. Selecione o repositório: `dbc-data-studio/calculadora-lucro`
4. Configure:

```
Framework Preset: Next.js
Root Directory: calculadora-lucro
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

5. **Environment Variables**: (nenhuma necessária neste projeto)

6. Clique em **"Deploy"**

### Passo 3: Configurar Subdomain

Após o deploy inicial:

1. Vá para **Settings** → **Domains**
2. Clique em **"Add Domain"**
3. Digite: `calculadora.dbcdatastudio.com`
4. Clique em **"Add"**

### Passo 4: Configurar DNS (se necessário)

Se o domínio já está no Vercel (como dbcdatastudio.com):

- **Vercel configurará automaticamente** o subdomain
- Aguarde alguns minutos para propagação DNS

Se o domínio está em outro provedor:

Adicione um registro CNAME no seu provedor de DNS:

```
Type: CNAME
Name: calculadora
Value: cname.vercel-dns.com
TTL: 3600
```

---

## 🎯 Opção 2: Deploy via CLI (Mais Rápido)

### Passo 1: Instalar Vercel CLI (se necessário)

```bash
npm i -g vercel
```

### Passo 2: Fazer Login

```bash
vercel login
```

### Passo 3: Deploy

```bash
cd /Users/dburnier/Documents/my_repos/dbc-data-studio/calculadora-lucro

# Primeiro deploy (irá fazer perguntas)
vercel

# Responda:
# ? Set up and deploy? [Y/n] Y
# ? Which scope? <seu-time-vercel>
# ? Link to existing project? [y/N] N
# ? What's your project's name? calculadora-lucro
# ? In which directory is your code located? ./
# ? Want to override the settings? [y/N] N
```

### Passo 4: Adicionar Domínio via CLI

```bash
vercel domains add calculadora.dbcdatastudio.com calculadora-lucro
```

### Passo 5: Deploy para Produção

```bash
vercel --prod
```

---

## ⚙️ Configurações Recomendadas no Vercel

### 1. Build & Development Settings

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

### 2. Environment Variables

Nenhuma necessária para este projeto! ✅

### 3. Git Integration

- ✅ **Auto-deploy on push to main**: ON
- ✅ **Preview deployments**: ON (para branches)
- ✅ **Comments on Pull Requests**: ON

---

## 🔍 Verificação Pós-Deploy

### 1. Testar a URL

Após o deploy, visite:

```
https://calculadora.dbcdatastudio.com
```

### 2. Checklist de Testes

- [ ] Página carrega corretamente
- [ ] Design responsivo (mobile/tablet/desktop)
- [ ] Calculadora funciona (testar todos os marketplaces)
- [ ] Botão "Copiar para WhatsApp" funciona
- [ ] SEO: verificar meta tags (View Source)
- [ ] Performance: testar velocidade (PageSpeed Insights)

### 3. Analytics (Opcional)

No Vercel Dashboard, ative:
- ✅ **Web Analytics**: Settings → Analytics → Enable
- ✅ **Speed Insights**: Settings → Speed Insights → Enable

---

## 🎨 Personalizações Pós-Deploy

### 1. Adicionar Google Analytics

Edite `app/layout.tsx`:

```tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 2. Adicionar Google Search Console

1. Acesse: https://search.google.com/search-console
2. Adicione a propriedade: `calculadora.dbcdatastudio.com`
3. Verifique via método de DNS ou HTML tag
4. Envie o sitemap: `https://calculadora.dbcdatastudio.com/sitemap.xml`

---

## 🚨 Troubleshooting

### Erro: "Build Failed"

Verifique os logs no Vercel. Causas comuns:

1. **Missing dependencies**: 
   ```bash
   npm install
   npm run build  # Testar localmente
   ```

2. **TypeScript errors**:
   ```bash
   npm run lint
   ```

3. **Environment variables**: Nenhuma necessária neste projeto

### Erro: "Domain not accessible"

1. Aguarde 5-10 minutos (propagação DNS)
2. Verifique se o CNAME está correto
3. Limpe o cache DNS:
   ```bash
   # macOS/Linux
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   ```

### Erro: "Next.js warning about outputFileTracingRoot"

Isso é só um aviso (já apareceu no dev). Para silenciar, edite `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: undefined,
};

module.exports = nextConfig;
```

---

## 📊 Performance Esperada

Após o deploy no Vercel:

- **First Load**: < 1s
- **Lighthouse Score**: 95-100
- **Time to Interactive**: < 2s
- **SEO Score**: 100

---

## 🔄 Fluxo de Atualização

### Para fazer updates depois:

```bash
# 1. Fazer mudanças no código
cd /Users/dburnier/Documents/my_repos/dbc-data-studio/calculadora-lucro

# 2. Testar localmente
npm run dev

# 3. Commit e push (se usando Git)
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# Vercel fará deploy automático! 🎉
```

Ou via CLI:

```bash
vercel --prod
```

---

## 🎯 Estrutura Final

```
dbcdatastudio.com (domínio principal)
├── abigail.dbcdatastudio.com (Abigail Cards)
└── calculadora.dbcdatastudio.com (Calculadora de Lucro) ← NOVO
```

---

## ✅ Checklist de Deploy

Antes de fazer o deploy:

- [x] Código testado localmente (`npm run dev`)
- [x] Build funciona (`npm run build`)
- [x] Testes passaram (`node test-calculator.js`)
- [x] Sem erros de linting
- [ ] Repositório Git criado
- [ ] Push para GitHub/GitLab
- [ ] Deploy no Vercel
- [ ] Subdomain configurado
- [ ] DNS propagado
- [ ] Site testado em produção
- [ ] Google Analytics configurado (opcional)
- [ ] Search Console configurado (opcional)

---

## 📞 Suporte

### Links Úteis

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- DNS Checker: https://dnschecker.org

### Comandos Úteis

```bash
# Ver status do projeto
vercel ls

# Ver logs
vercel logs <deployment-url>

# Remover deployment
vercel rm <deployment-name>

# Ver domains
vercel domains ls
```

---

## 🎉 Pronto!

Após seguir este guia, sua calculadora estará disponível em:

**https://calculadora.dbcdatastudio.com** 🚀

Com HTTPS automático, CDN global, e 99.99% uptime!

