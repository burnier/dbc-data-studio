# Abigail Arts & Oracles - Tarot Reading Landing Page

A modern, conversion-optimized tarot reading application built with Next.js 15, featuring language-specific landing pages and automated email delivery.

## 🌟 Current Status

**Production Ready** - Clean, tested, and optimized for conversion.

### ✅ Implemented Features

- **Multi-language Support**: Separate landing pages for English, German, Portuguese, and Hungarian (`/en`, `/de`, `/pt`, `/hu`) with fully translated UI and card names
- **Conversion-Optimized Flow**: Streamlined 3-step process (form → shuffling → card reveal)
- **Automated Email Delivery**: Personalized readings sent via Resend API
- **Real Card Images**: 36 authentic Gypsy cards with multilingual names and meanings
- **Abigail Branding**: Custom logo integration throughout
- **Modern UI**: Clean, responsive design with subtle animations
- **Localized Pricing**: €19.90 (EN/DE), R$ 59,90 (PT), 6990 Ft (HU)
- **Social Proof**: Trust badges, testimonials, and scarcity signals
- **Rate Limiting**: 3 submissions per hour per email
- **Database**: SQLite with Drizzle ORM for customer data
- **Admin Dashboard**: Password-protected analytics at `/admin`

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
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=Abigail Arts & Oracles <noreply@yourdomain.com>
DATABASE_URL=./abigail2.db
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
- 3 cards are revealed with brief meanings
- Email sent with full reading

### 3. Email Service
Beautiful HTML emails include:
- Personalized greeting with user's name
- The 3 drawn cards
- Brief interpretation of each card
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

## 📝 License

Private - DBC Data Studio

---

**Questions?** Check the code comments or reach out to the development team.
