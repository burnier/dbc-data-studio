# 📧 Email Setup Checklist - Resend + Cloudflare Integration

## Pre-Requisites
- [ ] Access to Cloudflare account managing `dbcdatastudio.com`
- [ ] Domain is actively managed in Cloudflare DNS
- [ ] Cloudflare account has API token access enabled

---

## Phase 1: Resend Account Setup

### Step 1: Create Account
- [ ] Go to https://resend.com/signup
- [ ] Sign up with Daniel's primary email
- [ ] Verify email address (check inbox)
- [ ] Complete onboarding flow

### Step 2: Add Subdomain with Cloudflare Integration
- [ ] Click **"Domains"** in left sidebar
- [ ] Click **"Add Domain"** button
- [ ] Enter domain: `abigail.dbcdatastudio.com`
- [ ] **CRITICAL:** Click **"Sign in to Cloudflare"** button (blue button, NOT manual setup)
- [ ] Authorize Resend app in Cloudflare OAuth screen
- [ ] Wait for automatic DNS configuration (1-2 minutes)
- [ ] Verify all records show green checkmarks:
  - [ ] SPF (TXT record)
  - [ ] DKIM 1 (CNAME)
  - [ ] DKIM 2 (CNAME)
  - [ ] DKIM 3 (CNAME)
  - [ ] DMARC (TXT record)
  - [ ] Return-Path (CNAME)

### Step 3: Domain Verification
- [ ] Domain status shows **"Verified"** with green checkmark
- [ ] Click "Send Test Email" button in Resend dashboard
- [ ] Verify test email arrives at your inbox
- [ ] Check email headers show proper DKIM signatures

### Step 4: Create API Key
- [ ] Go to **"API Keys"** tab
- [ ] Click **"Create API Key"**
- [ ] Name: `Abigail Production`
- [ ] Permission: **"Full access"** (default)
- [ ] Copy the API key (starts with `re_...`)
- [ ] **SAVE SECURELY** - you won't see it again!
- [ ] Store in password manager or secure notes

---

## Phase 2: Application Configuration

### Step 1: Update Environment Variables
- [ ] Open `.env.local` file in VS Code
- [ ] Update `RESEND_API_KEY`:
  ```
  RESEND_API_KEY=re_[paste_your_actual_key_here]
  ```
- [ ] Update `EMAIL_FROM`:
  ```
  EMAIL_FROM=Abigail <contact@abigail.dbcdatastudio.com>
  ```
- [ ] Save file

### Step 2: Restart Dev Server
- [ ] Stop current server (Ctrl+C in terminal)
- [ ] Clear terminal: `clear`
- [ ] Restart: `npm run dev`
- [ ] Verify server starts without errors
- [ ] Note the port (likely `http://localhost:3001`)

---

## Phase 3: Testing & Verification

### Test 1: Basic Email Delivery
- [ ] Go to `http://localhost:3001/en`
- [ ] Fill out form:
  - Name: `Test User`
  - Email: Daniel's primary email
  - Question: `Will this email work?`
- [ ] Submit form
- [ ] Watch terminal logs for:
  ```
  ✅ Gemini reading generated successfully with gemini-3-flash-preview
  ✅ Email sent successfully to [email]
  ```
- [ ] Check inbox (may take 1-30 seconds)
- [ ] Verify email arrives with:
  - [ ] Subject: "Abigail's Apprentice: Your Reading is Ready, Test User"
  - [ ] From: "Abigail <contact@abigail.dbcdatastudio.com>"
  - [ ] 3 card images visible
  - [ ] AI-generated reading text
  - [ ] "Full Reading" CTA button visible

### Test 2: Spam Check
- [ ] Check email did NOT go to spam folder
- [ ] If in spam, click "Not Spam" / "Move to Inbox"
- [ ] Check email headers for authentication:
  - [ ] `SPF: PASS`
  - [ ] `DKIM: PASS`
  - [ ] `DMARC: PASS`

### Test 3: Multi-Language Test
- [ ] Test German: `http://localhost:3001/de`
- [ ] Test Portuguese: `http://localhost:3001/pt`
- [ ] Test Hungarian: `http://localhost:3001/hu`
- [ ] Verify AI generates responses in correct language
- [ ] Verify email subject/content uses correct language

### Test 4: Admin Dashboard Verification
- [ ] Go to `http://localhost:3001/admin`
- [ ] Enter admin password
- [ ] Check latest submission shows:
  - [ ] `Email Sent: ✓` (green checkmark)
  - [ ] Correct email address
  - [ ] Correct timestamp

### Test 5: Database Verification
- [ ] Open terminal
- [ ] Run: `cd /Users/dburnier/Documents/my_repos/dbc-data-studio/abigail`
- [ ] Run: `sqlite3 abigail.db "SELECT name, email, email_sent, email_sent_at FROM submissions ORDER BY timestamp DESC LIMIT 1;"`
- [ ] Verify:
  - [ ] `email_sent = 1`
  - [ ] `email_sent_at` has timestamp

---

## Phase 4: Cloudflare DMARC (Optional but Recommended)

### Enable DMARC Monitoring
- [ ] Log into Cloudflare Dashboard
- [ ] Select domain: `dbcdatastudio.com`
- [ ] Go to **Email** → **DMARC Management**
- [ ] Enable DMARC for `guidance` subdomain
- [ ] Set policy: **"Quarantine"** (recommended for production)
- [ ] Add reporting email: Daniel's email
- [ ] Wait 24-48 hours for first reports

---

## Phase 5: Production Readiness

### Email Warming (Important!)
To avoid spam filters, gradually increase sending volume:
- [ ] **Week 1:** Max 10 emails/day
- [ ] **Week 2:** Max 50 emails/day
- [ ] **Week 3:** Max 100 emails/day
- [ ] **Week 4+:** Full volume (up to free tier limit: 100/day)

### Monitor Deliverability
- [ ] Check Resend dashboard daily for bounce/complaint rates
- [ ] Target: <2% bounce rate, <0.1% complaint rate
- [ ] If rates higher, investigate and fix issues

### Backup Plan
- [ ] Document API key in team password manager
- [ ] Create backup API key for emergencies
- [ ] Set up Resend webhook for bounce notifications (optional)

---

## Troubleshooting

### Issue: "Email not sent" in logs
**Solutions:**
1. Check `RESEND_API_KEY` is not "placeholder"
2. Verify domain is verified in Resend dashboard
3. Check terminal for specific error messages
4. Regenerate API key if needed

### Issue: Emails going to spam
**Solutions:**
1. Verify DMARC enabled in Cloudflare
2. Check all DNS records green in Resend
3. Send test email to https://www.mail-tester.com/ (should score 9+/10)
4. Implement email warming schedule
5. Ask recipients to add `contact@abigail.dbcdatastudio.com` to contacts

### Issue: Rate limit exceeded
**Solutions:**
1. Free tier: 100 emails/day, 3,000/month
2. Upgrade to paid plan if needed ($20/month for 50,000 emails)
3. Implement queueing system for high volume

---

## Success Criteria

✅ **Phase 1 Complete When:**
- Domain shows "Verified" in Resend
- Test email from Resend dashboard arrives

✅ **Phase 2 Complete When:**
- Dev server starts without errors
- Environment variables loaded correctly

✅ **Phase 3 Complete When:**
- Test reading email arrives in inbox (not spam)
- All authentication checks pass (SPF/DKIM/DMARC)
- Multiple languages tested successfully

✅ **Phase 4 Complete When:**
- DMARC enabled and first reports received

✅ **Production Ready When:**
- All above phases complete
- Email warming schedule started
- Deliverability metrics healthy

---

## Next Steps After Email Setup

1. **Stripe Integration** (Byron's Phase 2)
   - Payment flow for full readings
   - Stripe metadata with submission IDs
   - Post-purchase confirmation emails

2. **UI/UX Enhancements**
   - Card flip animations (1.5s stagger)
   - Glow effects on card reveal
   - Sound effects (soft "thump")

3. **Admin Enhancements**
   - Queue management for paid readings
   - Bulk email resend functionality
   - Analytics dashboard improvements

---

**Estimated Time:** 30-45 minutes for complete setup and testing
**Team Members Needed:** Daniel (Cloudflare access) + Caleb (testing)

