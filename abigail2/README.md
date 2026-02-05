# Abigail Arts & Oracles v2 - Serverless Monolith

## Architecture

**Serverless Monolith** - All logic within Next.js 15 using Server Actions and Route Handlers. No separate backend needed.

- **Database**: SQLite with Drizzle ORM (easily switchable to Supabase/PostgreSQL)
- **Email**: Resend API
- **Deployment**: Vercel-ready (or any Next.js host)

## Features

✅ Single-page conversion funnel  
✅ Form submission with Server Actions  
✅ 5-second shuffling animation  
✅ Manual card selection (3 cards)  
✅ Database persistence (Customer Databank)  
✅ Automated email with beautiful formatting  
✅ Scarcity counter (live updates)  
✅ Social proof ticker  
✅ i18n support (EN, DE, PT, HU)  
✅ Premium upsell section  
✅ Physical evidence gallery  

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd abigail2

# Install dependencies
npm install

# Set up environment variables
cat > .env.local << EOF
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=Abigail Arts & Oracles <abigail@abigailartsoracles.com>
DATABASE_URL=./abigail2.db
EOF

# Generate database schema
npm run db:generate

# Run migrations (creates database)
npm run db:migrate

# Copy assets from abigail/website/public
# - back5.png
# - abigail_logo2.png
# - abigail_logo.png
# - cards/ directory (36 card images)

# Start development server
npm run dev
```

### Access
- Frontend: http://localhost:3000

## Project Structure

```
abigail2/
├── app/
│   ├── page.tsx          # Main single-page component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Styles
├── lib/
│   ├── actions.ts        # Server Actions (form, cards, email)
│   ├── db/
│   │   ├── schema.ts     # Drizzle schema
│   │   └── index.ts      # Database connection
│   ├── cards.ts          # Card data (36 cards)
│   └── email.ts          # Email service (Resend)
├── public/               # Static assets
│   ├── back5.png
│   ├── abigail_logo2.png
│   ├── abigail_logo.png
│   └── cards/           # 36 card images
└── package.json
```

## Database Schema

The `submissions` table stores every form entry:

- `id`: Primary key
- `timestamp`: Submission time
- `email`: User email (indexed for remarketing)
- `name`: User name
- `question`: User's question
- `cardIdsDrawn`: JSON array of 3 card IDs
- `language`: en, de, pt, hu
- `trialCompleted`: Boolean
- `paidUpgrade`: Boolean
- `readingText`: Full reading text
- `previewText`: Limited preview
- `emailSent`: Boolean
- `emailSentAt`: Timestamp

**This is your Customer Databank for marketing and remarketing.**

## Server Actions

### `submitRitual(name, email, question, language)`
- Creates submission record
- Randomly selects 3 cards
- Returns submission ID and card IDs

### `selectCards(submissionId, selectedCardIds)`
- Generates preview and full reading
- Sends email automatically
- Updates submission record

### `getScarcity()`
- Returns available readings today
- Updates every minute on frontend

## Email Service

Uses Resend API to send beautifully formatted HTML emails.

**Subject**: "Abigail's Apprentice: Your cards are ready, [Name]."

**Features**:
- Personalized greeting
- Full reading text
- Card names
- **Cliffhanger P.S.** for conversion

## Conversion Features

1. **Scarcity Counter**: "Abigail is in the studio. X/5 slots remaining today."
2. **Social Proof Ticker**: Rotating messages at bottom
3. **Visual Comparison**: Digital vs. Physical spread
4. **Physical Evidence**: Gallery of real spreads (blurred)
5. **Language Toggle**: Global i18n support

## Next Steps

1. Add Resend API key to `.env.local`
2. Copy card images from `/abigail/website/public/cards/`
3. Copy `back5.png` from `/abigail/ref_material/AbigailCardsWebsite/en/Other Images/`
4. Add real physical spread photos to upsell section
5. Integrate Stripe for payment (€19.90)
6. Set up production database (Supabase recommended)

## License

Private - DBC Data Studio
