# Stripe Setup Guide for Abigail

## 📋 Overview

This guide walks you through setting up Stripe for accepting payments for premium readings.

---

## Step 1: Create Stripe Account

1. Go to https://stripe.com
2. Click "Sign up"
3. Complete registration
4. Verify your email

---

## Step 2: Get API Keys

### For Testing (Do This First):

1. In Stripe Dashboard, click "Developers" → "API keys"
2. You'll see two keys in **Test mode**:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`) - Click "Reveal test key"
3. Copy both keys

### For Production (Do This When Ready to Go Live):

1. Toggle to "Production" mode in Stripe Dashboard (top right)
2. Get the production keys:
   - **Publishable key** (starts with `pk_live_...`)
   - **Secret key** (starts with `sk_live_...`)

---

## Step 3: Create Price Objects

You need to create 4 prices (one for each currency):

### In Stripe Dashboard:

1. Go to **Products** → **Create product**
2. Create product: "Abigail Premium Reading"
3. Add 4 prices:

#### Price 1: USD $29.00
- Amount: `29.00`
- Currency: `USD`
- Billing: One time
- Copy the Price ID (starts with `price_...`)

#### Price 2: EUR €24.90
- Amount: `24.90`
- Currency: `EUR`
- Billing: One time
- Copy the Price ID

#### Price 3: BRL R$ 129.00
- Amount: `129.00`
- Currency: `BRL`
- Billing: One time
- Copy the Price ID

#### Price 4: HUF 8,900 Ft
- Amount: `8900`
- Currency: `HUF`
- Billing: One time
- Copy the Price ID

---

## Step 4: Set Up Webhook

### For Local Testing (Stripe CLI):

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login:
   ```bash
   stripe login
   ```
3. Forward webhooks to local dev server:
   ```bash
   stripe listen --forward-to http://localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_...`)

### For Production:

1. In Stripe Dashboard → **Developers** → **Webhooks**
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen for: `checkout.session.completed`
5. Copy the webhook signing secret

---

## Step 5: Update Environment Variables

Add these to `/abigail/.env.local`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs (from Step 3)
STRIPE_PRICE_USD=price_your_usd_price_id
STRIPE_PRICE_EUR=price_your_eur_price_id
STRIPE_PRICE_BRL=price_your_brl_price_id
STRIPE_PRICE_HUF=price_your_huf_price_id

# Base URL (for Stripe redirects)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Production: NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

---

## Step 6: Test the Integration

### Local Testing Flow:

1. Start dev server:
   ```bash
   cd abigail
   npm run dev
   ```

2. In another terminal, start Stripe CLI webhook forwarding:
   ```bash
   stripe listen --forward-to http://localhost:3000/api/stripe/webhook
   ```

3. Complete a free reading on the site

4. Click "Unlock Premium Reading" button

5. You'll be redirected to Stripe Checkout

6. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

7. Complete payment

8. Stripe will send webhook to your local server

9. Check terminal logs for: `✅ Payment successful for submission X`

10. Check `/admin` dashboard - submission should show as paid

---

## Step 7: Going to Production

When ready to accept real payments:

1. **Activate your Stripe account**:
   - In Stripe Dashboard → Complete business verification
   - Add bank account for payouts

2. **Switch to Production keys**:
   - Update `.env.local` with `pk_live_...` and `sk_live_...`
   - Update webhook secret with production webhook secret

3. **Update Base URL**:
   - Change `NEXT_PUBLIC_BASE_URL` to your production domain

4. **Deploy your app**

5. **Set up production webhook**:
   - In Stripe Dashboard → Add webhook endpoint with your production URL

---

## 💰 Pricing Summary

| Language | Currency | Amount |
|----------|----------|--------|
| English (en) | USD | $29.00 |
| German (de) | EUR | €24.90 |
| Portuguese (pt) | BRL | R$ 129,00 |
| Hungarian (hu) | HUF | 8.900 Ft |

---

## 🔍 Testing Checklist

- [ ] Stripe account created
- [ ] API keys added to `.env.local`
- [ ] 4 price objects created
- [ ] Webhook endpoint configured
- [ ] Test payment with `4242 4242 4242 4242` successful
- [ ] Database updated with payment info
- [ ] Admin dashboard shows paid submission
- [ ] User redirected to success page

---

## 🆘 Troubleshooting

**"Missing stripe-signature header"**
- Make sure Stripe CLI is running (`stripe listen ...`)
- Webhook secret is correct in `.env.local`

**"Invalid signature"**
- Webhook secret doesn't match
- Using production secret with test mode (or vice versa)

**"No checkout URL returned"**
- Price IDs are incorrect or don't exist
- Secret key is invalid
- API version mismatch

**Payment succeeds but database not updated**
- Check webhook logs in terminal
- Verify `submissionId` is in checkout metadata
- Check console for errors in `/api/stripe/webhook`

---

## 📚 Resources

- Stripe Dashboard: https://dashboard.stripe.com
- Stripe Docs: https://stripe.com/docs
- Test Cards: https://stripe.com/docs/testing
- Stripe CLI: https://stripe.com/docs/stripe-cli

---

**Questions?** Check the code comments in:
- `app/api/stripe/checkout/route.ts`
- `app/api/stripe/webhook/route.ts`
- `lib/stripe.ts`

