# 🌐 **Domain Migration Plan**

**From:** `guidance.dbcdatastudio.com`  
**To:** `abigail.dbcdatastudio.com`

**Email From:** `contact@abigail.dbcdatastudio.com` (multilingual variations)

---

## **📋 Where to Make Changes**

### **1. Cloudflare DNS** ⚠️ **START HERE FIRST**

**Action Required:** Create DNS records for the new subdomain

**Steps:**
1. Go to: Cloudflare Dashboard → `dbcdatastudio.com` → DNS
2. Add the following records that Resend will require:
   - Wait until step 2 (Resend) to get the exact records
   - Or copy the existing records from `guidance.dbcdatastudio.com` and update them

**Note:** You'll configure the exact records after adding the domain to Resend (step 2)

---

### **2. Resend Email Service** ⚠️ **REQUIRED**

**Action Required:** Add new domain and remove old one

#### **Steps:**

**A. Add New Domain:**
1. Go to: https://resend.com/domains
2. Click "Add Domain"
3. Enter: `abigail.dbcdatastudio.com`
4. Choose "Sign in to Cloudflare" (auto-config)
5. Authorize Resend to configure DNS
6. Wait 1-2 minutes for verification

**B. Remove Old Domain (Optional):**
1. Go to: https://resend.com/domains
2. Find `guidance.dbcdatastudio.com`
3. Click "Delete" (only after new domain is verified)

**Important:** Keep the same API key - no need to regenerate!

---

### **3. Code Changes** ⚠️ **REQUIRED**

**Files to Update:**

#### **A. Core Configuration (`lib/constants.ts`):**

```typescript
export const EMAIL_CONFIG = {
  fromName: 'Abigail',
  fromDomain: 'abigail.dbcdatastudio.com', // ← CHANGE THIS
} as const;
```

#### **B. Environment Variable Template:**

Update your `.env.local` (and document it):

```bash
# Email Configuration (Resend)
RESEND_API_KEY=re_YOUR_KEY_HERE  # ← SAME KEY, no change needed
EMAIL_FROM=Abigail <contact@abigail.dbcdatastudio.com>  # ← CHANGE THIS

# OR with multilingual sender names:
# English: EMAIL_FROM=Abigail <contact@abigail.dbcdatastudio.com>
# German: EMAIL_FROM=Abigail <kontakt@abigail.dbcdatastudio.com>
# Portuguese: EMAIL_FROM=Abigail <contato@abigail.dbcdatastudio.com>
# Hungarian: EMAIL_FROM=Abigail <kapcsolat@abigail.dbcdatastudio.com>
```

**Note:** For multilingual senders, you'd need logic to choose the right email per language. See section 5 below.

---

### **4. Documentation Updates** ℹ️ **RECOMMENDED**

Update these documentation files:

**Files:**
- `README.md`
- `EMAIL_SETUP_CHECKLIST.md`
- `CODE_QUALITY_REVIEW.md`
- `PROJECT_STATUS.md`

**Find/Replace:**
- `guidance.dbcdatastudio.com` → `abigail.dbcdatastudio.com`
- `abigail@guidance` → `contact@abigail`

---

### **5. Stripe Configuration** ✅ **NO CHANGE NEEDED**

**Good News:** Stripe doesn't care about your email domain!

**What Stripe Uses:**
- Metadata passed during checkout
- Webhook notifications
- Customer email addresses

**No action required in Stripe Dashboard.** ✅

---

## **🌍 Multilingual Email Senders (Optional Enhancement)**

If you want language-specific sender emails:

### **Option A: Multiple Subdomains (Complex)**

Configure separate email addresses:
- `contact@abigail.dbcdatastudio.com` (English)
- `kontakt@abigail.dbcdatastudio.com` (German)
- `contato@abigail.dbcdatastudio.com` (Portuguese)
- `kapcsolat@abigail.dbcdatastudio.com` (Hungarian)

**Resend Setup:**
- All use the same verified domain: `abigail.dbcdatastudio.com`
- Just change the local part (before @)

**Code Changes Needed:**

Update `lib/email.ts`:

```typescript
import { EMAIL_CONFIG, type Language } from './constants';

// Multilingual sender mapping
const SENDER_LOCALES = {
  en: 'contact',
  de: 'kontakt',
  pt: 'contato',
  hu: 'kapcsolat',
} as const;

// Build email sender based on language
function getEmailSender(language: Language): string {
  const locale = SENDER_LOCALES[language];
  return process.env.EMAIL_FROM || 
    `${EMAIL_CONFIG.fromName} <${locale}@${EMAIL_CONFIG.fromDomain}>`;
}

// Then in sendReadingEmail():
const emailData = {
  from: getEmailSender(language as Language),  // Dynamic based on language
  to: toEmail,
  // ...
};
```

### **Option B: Single Email (Simpler - RECOMMENDED)**

Just use: `contact@abigail.dbcdatastudio.com` for all languages

**Pros:**
- Simple configuration
- One email to monitor
- Easier for replies
- Standard practice

**This is what most services do.** ✅

---

## **📝 Step-by-Step Migration Checklist**

### **Phase 1: DNS & Email (15 minutes)**

- [ ] 1. Go to Resend → Add domain: `abigail.dbcdatastudio.com`
- [ ] 2. Choose "Sign in to Cloudflare" for auto-config
- [ ] 3. Wait for domain verification (1-2 minutes)
- [ ] 4. Verify all DNS records are green ✓
- [ ] 5. Test by sending a test email from Resend dashboard

### **Phase 2: Code Changes (5 minutes)**

- [ ] 6. Update `lib/constants.ts` → change `fromDomain`
- [ ] 7. Update your local `.env.local` → change `EMAIL_FROM`
- [ ] 8. Decide: Single email or multilingual senders?
- [ ] 9. If multilingual: implement Option A above

### **Phase 3: Documentation (5 minutes)**

- [ ] 10. Update `README.md` (find/replace domain)
- [ ] 11. Update `EMAIL_SETUP_CHECKLIST.md`
- [ ] 12. Update `CODE_QUALITY_REVIEW.md`

### **Phase 4: Testing (10 minutes)**

- [ ] 13. Run `npm run dev`
- [ ] 14. Submit a test reading
- [ ] 15. Verify email arrives from `contact@abigail.dbcdatastudio.com`
- [ ] 16. Check email headers confirm new domain

### **Phase 5: Cleanup (Optional)**

- [ ] 17. Remove old domain from Resend (after 24h of testing)
- [ ] 18. Remove old DNS records from Cloudflare (after confirming)

---

## **⚡ Quick Commands**

### **Code Changes:**

```bash
cd /Users/dburnier/Documents/my_repos/dbc-data-studio/abigail

# Update constants
# Edit lib/constants.ts manually (line 73)

# Update your local env
# Edit .env.local manually

# Test build
npm run build

# Test dev server
npm run dev
```

### **Documentation Updates:**

```bash
# Find all references (for manual review)
grep -r "guidance.dbcdatastudio.com" *.md

# After manual updates, commit
git add -A
git commit -m "config: migrate from guidance to abigail subdomain"
git push origin main
```

---

## **🎯 Recommendation**

### **Simplest Approach:**

1. ✅ Use single email: `contact@abigail.dbcdatastudio.com`
2. ✅ Same for all languages (standard practice)
3. ✅ Update only 2 files:
   - `lib/constants.ts` (fromDomain)
   - `.env.local` (EMAIL_FROM)

### **Why Single Email is Better:**

- ✅ Simpler configuration
- ✅ One inbox to monitor for replies
- ✅ Easier to maintain
- ✅ Standard industry practice
- ✅ Users expect `contact@` or `hello@`

**Most companies (even multilingual ones) use a single contact email.** This is the professional standard.

---

## **⏱️ Total Migration Time**

- **DNS/Resend:** 15 minutes
- **Code:** 5 minutes
- **Documentation:** 5 minutes
- **Testing:** 10 minutes

**Total:** ~35 minutes

---

## **🚨 Important Notes**

1. **Keep your RESEND_API_KEY** - No need to regenerate
2. **Verify domain before changing code** - Test email sending first
3. **Test thoroughly** - Send test readings before going live
4. **Monitor for 24h** - Check deliverability on new domain

---

**Ready to start? Begin with Resend → Cloudflare, then code!** 🚀

