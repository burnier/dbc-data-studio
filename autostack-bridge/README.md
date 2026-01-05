# AutoStack - AI Business Automation Bridge Page

**Status:** 🚧 Development Phase  
**Target Tools:** Gumloop, Make.com, AdCreative.ai  
**Framework:** Next.js (for speed and SEO)

## Architecture

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Tracking:** Local JSON file (clicks.json) or Supabase
- **Affiliate Redirects:** Server-side `/go/[tool]` routes
- **Data Source:** Scraped/API data for tool features and pricing
- **Lead Capture:** API-connected mailing list

## Project Structure

```
autostack-bridge/
├── app/                    # Next.js App Router
│   ├── go/                 # Affiliate redirect routes
│   ├── api/                # API routes (tracking, lead capture)
│   └── page.tsx            # Main bridge page
├── lib/                    # Utilities
│   ├── tracking.ts         # Click tracking logic
│   └── data-ingestion.ts   # Tool data fetching
├── data/                   # Tool data storage
│   └── tools.json          # Features and pricing data
├── public/                 # Static assets
└── package.json
```

## Features

- ✅ SEO-optimized bridge page
- ✅ Affiliate redirect engine (`/go/[tool]`)
- ✅ Click tracking (timestamp, tool, source)
- ✅ Data ingestion for tool features/pricing
- ✅ Lead capture component
- ✅ Zero external dependencies (fast loading)
- ✅ Ad-ready infrastructure

## Development

**Initial Setup:**
```bash
./setup.sh
```

This will:
- Install dependencies
- Run data ingestion
- Create .env file from template

**Local Development:**
```bash
npm run dev
```

Visit: `http://localhost:3000`

**Data Ingestion:**
```bash
npm run ingest
```

Updates tool data from sources (currently uses placeholder data structure).

**No Domain Required:** Development in local/staging environment until domain is acquired by Daniel.

## Environment Variables

Copy `env.example` to `.env` and update with:
- Actual affiliate links for Gumloop, Make.com, AdCreative.ai
- Optional: Mailing list API keys (when integrating)

## Features Implemented

✅ Next.js 14+ App Router  
✅ SEO-optimized pages  
✅ Affiliate redirect engine (`/go/[tool]`)  
✅ Click tracking (saves to `data/clicks.json`)  
✅ Lead capture (saves to `data/leads.json`)  
✅ Data ingestion script (placeholder structure)  
✅ Zero external dependencies (fast loading)  
✅ Ad-ready infrastructure  

## Next Steps

1. Update data ingestion with real tool data (scraping/APIs)
2. Add actual affiliate links to `.env`
3. Integrate mailing list API (Mailchimp/ConvertKit)
4. Deploy to staging for testing
5. Wait for domain acquisition before production

