# Abigail | The Hungarian Oracle - AI-Enhanced Heritage Tarot Platform

A premium, conversion-optimized tarot reading application built with Next.js 15, featuring AI-powered personalized readings by "The Apprentice," automated email delivery, and Hungarian heritage positioning for authentic lineage-based marketing.

## 🌟 Current Status

**Sprint 2D Complete** ✅ - Conversion-Optimized "Teaser" Readings

### ✅ Sprint 2D: Conversion-Optimized Teaser Readings (COMPLETE)

**Strategic Shift:**
Changed from generous free readings to brief, conversion-focused teasers that create hunger for the premium offering.

**Changes Implemented:**
- **Drastically Shortened AI Readings**: 750 words → **250-280 words** (-65%)
- **"Deliberate Interruption" Strategy**: Brief card insights that tease but don't satisfy
- **Corrected Premium Offer**: Changed from "12-card spread" → "physical spread + personalized photo + deep analysis"
- **Fixed Language Mixing**: Removed Hungarian words ("Cigánykártya") from English/German/Portuguese responses
- **Mobile-Responsive Email Layout**: Cards now stack vertically on mobile devices using table-based HTML
- **Card Reveal Simplification**: Removed long descriptions from browser view, showing only card names

**New Teaser Structure:**
| Section | Word Count | Purpose |
|---------|------------|---------|
| Opening + 3 Cards | 120-150 words | Brief insights (1-2 sentences per card) |
| Conversion Hook | 80-100 words | Emphasize premium value gap |
| P.S. Cliffhanger | 30-40 words | Card-specific mystery |
| **TOTAL** | **230-290 words** | Create hunger, not satisfaction |

**Conversion Impact:**
- -65% content given away for free
- +200-300% projected conversion rate (from 2-5% → 8-15%)
- Clear value gap between teaser and premium reading

**Files Updated:**
- `lib/ai.ts`: Rewrote system prompt with "BRIEF TEASER" instructions, explicit 300-word limit
- `lib/email.ts`: Mobile-responsive table layout for cards, multilingual subject lines
- `components/LanguagePage.tsx`: Removed card descriptions from reveal step

### ✅ Sprint 2C: Multilingual Email Headers & AI Language Fixes (COMPLETE)

**Problem Fixed:**
- Email headers were hardcoded in English for all languages
- AI (Gemini) was mixing languages mid-response (e.g., starting in Portuguese, switching to English)

**Solutions Implemented:**
- **Multilingual Email Headers**: Title, tagline, and footer now fully localized
  - 🇬🇧 EN: "Abigail | The Hungarian Oracle"
  - 🇩🇪 DE: "Abigail | Das Ungarische Orakel"
  - 🇵🇹 PT: "Abigail | A Oráculo Húngara"
  - 🇭🇺 HU: "Abigail | A Magyar Jósnő"
- **Strengthened AI Language Instructions**: Added emphatic "CRITICAL/KRITISCH/CRÍTICO/KRITIKUS" prompts
- **Fixed Email Pricing**: PT now shows R$ 59,90 (was €19.90), HU shows 6990 Ft (was €19.90)
- **Multiple Language Reminders**: AI system prompt now has 3+ reminders to prevent language mixing

**Files Updated:**
- `lib/email.ts`: Added `emailTitle`, `emailTagline`, `footerCopyright` for all languages + fixed pricing
- `lib/ai.ts`: Strengthened `LANGUAGE_INSTRUCTIONS` + added warning section in system prompt

### ✅ Sprint 2B: "The Hungarian Oracle" Rebrand (COMPLETE)

**Strategic Positioning:**
- **Brand Name**: Changed from "Abigail Arts & Oracles" → **"Abigail | The Hungarian Oracle"**
- **Heritage Narrative**: Bio sections emphasize Hungarian Gypsy Card Institute certification and "lineage of wisdom"
- **AI Persona**: The Apprentice now identifies as "Apprentice of The Hungarian Oracle"
- **Marketing Focus**: "Not an algorithm - a deck that carries the dust and wisdom of Eastern Europe"
- **Multilingual**: EN, DE, PT, HU all feature localized site name + tagline

**Files Updated:**
- `components/LanguagePage.tsx`: New site name, tagline, and "Lineage" bio for all 4 languages
- `lib/email.ts`: Email header rebranded with tagline
- `lib/ai.ts`: System prompt updated for Hungarian Oracle positioning
- `app/layout.tsx`: Page title + SEO metadata updated

**Marketing Impact:**
- +20-30% projected trust increase (Hungarian heritage removes "scam fear")
- +25-35% projected free-to-paid conversion (physical deck emphasis)
- Premium pricing justified by lineage positioning

### ✅ Sprint 2A: Heritage Narrative (COMPLETE)

- **Certification Focus**: "Hungarian Gypsy Card Institute (Cigánykártya Magyarország)" prominently displayed
- **Trust Section**: 3-icon layout (🛡️ Tradition, 🎓 Certification, ✋ Manual Spreads)
- **Email "Manual Proof"**: All emails state "Abigail is consulting her physical deck in the Hungarian tradition"

### ✅ Sprint 1: Core Experience (COMPLETE)

- **AI-Powered Readings**: Google Gemini 3 Flash integration generating personalized interpretations
- **Email Delivery**: Resend + Cloudflare with inline card image attachments
- **Multi-language Support**: Separate landing pages for EN, DE, PT, HU with fully translated UI and card names
- **Admin Dashboard**: Password-protected analytics with real-time stats
- **Conversion Flow**: Streamlined 3-step process (form → shuffling → AI reading → email)
- **Beautiful Emails**: HTML emails with embedded card images, AI interpretation, and upsell CTA
- **Database**: SQLite with indexed queries for marketing and analytics
- **Rate Limiting**: 3 submissions per hour per email
- **Localized Pricing**: €19.90 (EN/DE), R$ 59,90 (PT), 6990 Ft (HU)

### 🚧 Sprint 2: Payment & Polish (Next)

Per Byron's brief:
- **Stripe Checkout**: Payment flow for full readings with metadata tracking
- **Enhanced UI/UX**: Card flip animations (1.5s stagger + glow effects)
- **Sound Effects**: Soft "thump" or "shimmer" on card reveal
- **Admin Queue**: Track paid readings for Abigail to fulfill
- **Post-Purchase Email**: "Confirmation of Ritual" with 24-hour expectation setting

## 🚀 Quick Start

### Prerequisites

- **Node.js 18.x or 20.x** (required for better-sqlite3)
- npm or yarn
- Resend API key (get one at [resend.com](https://resend.com))

### Installation

```bash
# Navigate to project directory
cd abigail2

# Install dependencies
npm install

# Create environment variables file
cat > .env.local << EOF
# Email Configuration (Resend)
RESEND_API_KEY=re_your_resend_api_key_here
EMAIL_FROM=Abigail <abigail@guidance.dbcdatastudio.com>

# Database
DATABASE_URL=./abigail2.db

# Admin Dashboard
ADMIN_PASSWORD=your_secure_admin_password

# AI Configuration (Google Gemini - Free tier)
GOOGLE_AI_API_KEY=your_google_ai_key_here
AI_PROVIDER=gemini

# Optional: Anthropic Claude (Paid, better quality)
# ANTHROPIC_API_KEY=your_anthropic_key_here
# AI_PROVIDER=anthropic
EOF

# Initialize database
npm run db:push

# Start development server
npm run dev
```

### Access the App

- **English**: http://localhost:3000/en
- **German**: http://localhost:3000/de
- **Portuguese**: http://localhost:3000/pt
- **Hungarian**: http://localhost:3000/hu
- **Root**: http://localhost:3000 (redirects to `/en`)
- **Admin Dashboard**: http://localhost:3000/admin (password protected)

## 📁 Project Structure

```
abigail2/
├── app/
│   ├── [lang]/          # Language-specific pages (en, de, pt, hu)
│   │   └── page.tsx
│   ├── admin/           # Admin dashboard (password protected)
│   │   └── page.tsx
│   ├── api/
│   │   └── admin/       # Admin API routes
│   ├── page.tsx         # Root redirect to /en
│   ├── layout.tsx       # Root layout with fonts
│   └── globals.css      # Global styles & theme
├── components/
│   └── LanguagePage.tsx # Main landing page component
├── lib/
│   ├── actions.ts       # Server Actions (form, cards, scarcity)
│   ├── ai.ts            # AI service (Gemini/Anthropic)
│   ├── cards.ts         # Card data & logic (36 cards with translations)
│   ├── email.ts         # Email service (Resend)
│   ├── validation.ts    # Zod schemas
│   └── db/
│       ├── schema.ts    # Drizzle schema
│       └── index.ts     # Database connection
├── public/
│   ├── logo.png         # Abigail's logo
│   └── cards/           # 36 card images (.jpg)
└── abigail2.db          # SQLite database (created on first run)
```

## 🗄️ Database Schema

The `submissions` table stores all customer interactions:

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key |
| `timestamp` | TEXT | Submission time (ISO 8601) |
| `email` | TEXT | User email (indexed) |
| `name` | TEXT | User name |
| `question` | TEXT | User's question |
| `cardIdsDrawn` | TEXT | JSON array of 3 card IDs |
| `language` | TEXT | en, de, pt, hu |
| `trialCompleted` | INTEGER | Boolean flag |
| `emailSent` | INTEGER | Boolean flag |
| `emailSentAt` | TEXT | Email send timestamp |

**Use this database for marketing campaigns and remarketing.**

## 🎨 Key Features

### 1. Language-Specific Landing Pages
Each language has its own route for better marketing tracking and campaign management. No in-page language selector needed.

**All UI elements fully translated:**
- Card names (36 cards × 4 languages = 144 translations)
- Button text, form labels, error messages
- Email templates
- Testimonials and marketing copy

### 2. Localized Pricing
Premium reading prices adapted to each market:
- **English/German**: €19.90
- **Portuguese**: R$ 59,90 (Brazilian Real)
- **Hungarian**: 6990 Ft (Forint)

### 2. Simplified User Flow
- User fills form (name, email, question)
- Cards are automatically shuffled (4-second animation)
- 3 cards are revealed with card names only (no descriptions for mystery)
- Email sent with brief teaser reading

### 3. Email Service
Beautiful HTML emails include:
- Personalized greeting with user's name
- The 3 drawn cards (inline images, mobile-responsive)
- **Brief teaser reading** (250-280 words) that creates hunger for premium
- Conversion hook emphasizing premium value (photo + deep analysis)
- Card-specific P.S. cliffhanger
- Call-to-action for premium upgrade

### 4. Conversion Optimization
- Scarcity messaging (limited slots)
- Social proof (10,000+ readings, 4.9/5 rating)
- Trust signals (certification badge)
- Testimonials from satisfied customers
- Clear premium upsell with benefits

### 6. Admin Dashboard
Password-protected analytics dashboard at `/admin` provides:
- Real-time submission statistics
- Language breakdown
- Email delivery status
- Full customer data table
- Export capabilities for remarketing

Access with `ADMIN_PASSWORD` environment variable.

## 📧 Environment Variables

Create a `.env.local` file with:

```env
# Required
RESEND_API_KEY=re_xxxxx        # Get from resend.com
EMAIL_FROM=Abigail <your@email.com>

# Optional
DATABASE_URL=./abigail2.db     # SQLite database path
ADMIN_PASSWORD=your_secure_password_here  # For /admin dashboard
```

## 🛠️ Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run db:push     # Apply schema to database
npm run db:studio   # Open Drizzle Studio (database GUI)
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Note**: For production, consider migrating from SQLite to PostgreSQL (Supabase or Vercel Postgres).

### Other Platforms

The app works on any platform that supports Next.js 15 (Netlify, Railway, etc.).

## 🔧 Customization

### Adding a New Language

1. Create new translation object in `components/LanguagePage.tsx`
2. Add new route: `app/[newlang]/page.tsx`
3. Import and use `LanguagePage` component with your language code

### Changing Card Images

Replace images in `public/cards/` directory. Ensure filenames match card names in `lib/cards.ts`.

### Modifying Email Template

Edit the HTML template in `lib/email.ts` - `sendReadingEmail()` function.

### Adjusting Colors

Update CSS variables in `app/globals.css`:
- `--charcoal`: Dark background
- `--bone-white`: Light text
- `--purple-main`: Primary accent
- `--purple-dark`: Dark accent
- `--purple-light`: Light accent

## 📧 Email Configuration (Resend + Cloudflare)

The application sends AI-generated readings via email using **Resend** with **Cloudflare DNS automation**.

### Why Subdomain Strategy?

We use `guidance.dbcdatastudio.com` as the sending domain (instead of the root domain) to:
- Protect main domain reputation
- Create a boutique "Abigail's guidance" brand
- Isolate email sending from other DBC Data Studio services
- Maximize deliverability with dedicated DMARC policies

### Setup Steps (Requires Cloudflare Access)

**1. Create Resend Account**
```
Visit: https://resend.com/signup
Sign up with your email
Verify email address
```

**2. Add Domain with Cloudflare Auto-Config**
```
1. In Resend Dashboard → "Domains" → "Add Domain"
2. Enter: guidance.dbcdatastudio.com
3. Click "Sign in to Cloudflare" (NOT manual setup)
4. Authorize Resend to access Cloudflare DNS
5. Wait 1-2 minutes for automatic configuration
6. Verify domain shows "Verified" ✅
```

This automatically configures:
- ✅ SPF record (sender authentication)
- ✅ DKIM keys (email signing, 3 records)
- ✅ DMARC policy (spam prevention)
- ✅ Return-Path (bounce handling)

**3. Create API Key**
```
1. Go to "API Keys" tab in Resend
2. Click "Create API Key"
3. Name: "Abigail Production"
4. Copy the key (starts with re_...)
5. Save securely!
```

**4. Update Environment Variables**
```bash
# In .env.local
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM=Abigail <abigail@guidance.dbcdatastudio.com>
```

**5. Enable DMARC Monitoring (Optional but Recommended)**
```
1. In Cloudflare Dashboard → Email → DMARC Management
2. Enable for guidance.dbcdatastudio.com subdomain
3. Monitor reports to ensure high deliverability
```

**6. Test Email Delivery**
```bash
# Restart dev server
npm run dev

# Submit a test reading
# Check terminal for: ✅ Email sent successfully to [email]
# Verify email arrives (check spam folder first time)
```

### Email Template Customization

The email includes:
- Personalized greeting with user's name
- The 3 drawn cards with inline images (mobile-responsive table layout)
- **Brief AI-generated teaser reading** (250-280 words)
- Conversion hook emphasizing premium value (physical spread photo + deep analysis)
- Cliffhanger P.S. (conversion hook highlighting one mystery card)
- Call-to-action button for full reading upgrade
- Beautiful HTML styling matching brand colors
- Multilingual subject lines and content

Edit template in: `lib/email.ts` → `sendReadingEmail()`

### Troubleshooting

**Emails going to spam?**
- Ensure DMARC is enabled in Cloudflare
- Check SPF/DKIM are verified in Resend dashboard
- Warm up the domain by sending gradually (10/day → 50/day → 100/day)

**"Email not sent" in admin?**
- Check `RESEND_API_KEY` is valid (not "placeholder")
- Verify domain is verified in Resend
- Check terminal logs for error messages

**Rate limits?**
- Free tier: 100 emails/day, 3,000/month
- Paid tier: Starts at $20/month for 50,000 emails

## 🤖 AI Integration

The application uses AI to generate personalized "Apprentice" readings for each card draw.

**Supported Providers:**
1. **Google Gemini 3 Flash Preview** (Free tier, currently active)
2. **Anthropic Claude 3.5 Sonnet** (Paid, better quality for production)

**Setup:**

### Option 1: Google Gemini (Free)
```bash
# Get your API key from https://aistudio.google.com/app/apikey
echo "\nGOOGLE_AI_API_KEY=your_google_ai_key" >> .env.local
echo "\nAI_PROVIDER=gemini" >> .env.local
```

**Important:** Gemini free tier has rate limits:
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per day

If you hit the limit, the app will automatically use fallback templates.

### Option 2: Anthropic Claude (Paid)
```bash
# Get your API key from https://console.anthropic.com/
echo "\nANTHROPIC_API_KEY=your_anthropic_key" >> .env.local
echo "\nAI_PROVIDER=anthropic" >> .env.local
```

**Features:**
- **Conversion-Optimized**: Brief teaser readings (230-290 words) designed to create hunger
- Empathetic, mystical tone matching Abigail's brand
- Personalized 3-card interpretations (1-2 sentences per card)
- Deliberate interruption mid-insight to create FOMO
- Conversion hook emphasizing premium value (physical spread photo + deep analysis)
- Card-specific P.S. cliffhanger
- Multilingual support (EN, DE, PT, HU)
- Fallback to template readings if AI unavailable

**How it works:**
1. User completes ritual and draws 3 cards
2. AI generates **brief teaser reading** (250-280 words) based on:
   - User's name and question
   - The 3 specific cards drawn
   - Traditional card meanings
   - Selected language
3. Reading starts insightful but deliberately cuts off mid-insight
4. Conversion hook emphasizes physical spread + photo + deep analysis (NOT 12 cards)
5. Email sent with teaser reading + cliffhanger P.S.

**Token Limits:**
- Gemini: 2048 max output tokens (~1500 words capacity, using ~300)
- Claude: 2048 max output tokens (~1500 words capacity, using ~300)
- Actual output: 230-290 words (large safety margin to prevent truncation)

## 📊 Admin Dashboard

Access the analytics dashboard at `/admin` (password protected).

**Features:**
- Total submissions count
- Email delivery statistics
- Language breakdown (EN, DE, PT, HU)
- Full submissions table with all user data
- Session-based authentication
- Responsive design

**Setup:**
1. Add `ADMIN_PASSWORD=your_password` to `.env.local`
2. Visit http://localhost:3000/admin
3. Enter your password

**Security:**
- Password stored in environment variable (not in code)
- Server-side authentication
- Session-based access
- No data exposed to unauthenticated users

## 📊 Marketing Tips

1. Use different UTM parameters for each language route
2. Export email list from database for remarketing
3. A/B test different hero titles
4. Track conversion rate from form to email sent
5. Monitor premium upsell click-through rate

## 🔐 Security

- Input validation with Zod
- Rate limiting per email
- Server-side form processing
- No sensitive data in client code

## 🛠️ Development Notes

### Git Configuration

**Important**: The parent directory (`dbc-data-studio`) has a Python `.gitignore` that ignores `lib/` directories. An exception has been added for `abigail2/lib/`:

```gitignore
# In /Users/dburnier/Documents/my_repos/dbc-data-studio/.gitignore
lib/
lib64/
# Exception: autostack-bridge lib folder should be tracked
!autostack-bridge/lib/
# Exception: abigail2 lib folder should be tracked
!abigail2/lib/
```

Without this exception, all changes to `lib/actions.ts`, `lib/email.ts`, `lib/ai.ts`, etc. would be ignored by git.

## 📝 License

Private - DBC Data Studio

---

**Questions?** Check the code comments or reach out to the development team.
