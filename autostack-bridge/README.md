# DBC Data Studio - AI Career & Education Hub

**Status:** 🚧 Development Phase  
**Target Learning Paths:** Coursera, DataQuest, Pluralsight  
**Framework:** Next.js (for speed and SEO)  
**Affiliate Network:** Impact.com

## Architecture

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Tracking:** Local JSON file (clicks.json) or Supabase
- **Affiliate Redirects:** Server-side `/go/[path]` routes (coursera, dataquest, pluralsight)
- **Data Source:** Learning path data (features, pricing, focus areas)
- **Lead Capture:** API-connected mailing list
- **Impact.com Verification:** Ready for site verification file

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
├── data/                   # Learning path data storage
│   └── learning-paths.json # Features, pricing, and focus areas
├── public/                 # Static assets
└── package.json
```

## Features

- ✅ SEO-optimized career & education hub
- ✅ Affiliate redirect engine (`/go/[path]`)
- ✅ Click tracking (timestamp, learning path, source)
- ✅ Data ingestion for learning path features/pricing
- ✅ Lead capture component (career resources)
- ✅ Impact.com verification file ready
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
- Impact.com affiliate links for Coursera, DataQuest, Pluralsight
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

1. ✅ Domain purchase: DBCDataStudio.com (verified available)
2. ✅ Update data ingestion with learning path data (Coursera, DataQuest, Pluralsight)
3. ⏳ Add Impact.com affiliate links to `.env` (after approval)
4. ⏳ Add Impact.com verification file to `public/` folder
5. ⏳ Set up professional email (daniel@dbcdatastudio.com)
6. ⏳ Deploy to Cloud Run with custom domain
7. ⏳ Re-apply to Impact.com with verified domain + professional email

## Impact.com Requirements

- ✅ Verified .com domain (DBCDataStudio.com available)
- ⏳ Professional email forwarding (daniel@dbcdatastudio.com)
- ⏳ Site verification file in public/ folder
- ✅ Live site with learning path content

