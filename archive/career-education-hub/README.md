# DBC Data Studio - AI Career & Education Hub

**Status:** ✅ Live at [dbcdatastudio.com](https://dbcdatastudio.com)  
**Target Learning Paths:** Coursera, DataQuest, Pluralsight  
**Framework:** Next.js (for speed and SEO)  
**Affiliate Network:** PartnerStack

## Architecture

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Tracking:** Local JSON file (clicks.json) or Supabase
- **Affiliate Redirects:** Server-side `/go/[path]` routes (coursera, dataquest, pluralsight)
- **Data Source:** Learning path data (features, pricing, focus areas)
- **Lead Capture:** API-connected mailing list with waitlist functionality
- **Deployment:** Google Cloud Run with custom domain (dbcdatastudio.com)

## Project Structure

```
career-education-hub/
├── app/                    # Next.js App Router
│   ├── go/                 # Affiliate redirect routes
│   ├── api/                # API routes (tracking, lead capture)
│   ├── privacy-policy/    # Privacy policy page
│   ├── terms-of-service/  # Terms of service page
│   └── page.tsx            # Main bridge page
├── components/             # React components
│   ├── LeadCapture.tsx     # Email capture form
│   ├── LearningPathCard.tsx # Learning path card with waitlist
│   ├── ComparisonTable.tsx # Responsive comparison table
│   └── WaitlistModal.tsx   # Waitlist popup modal
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
- ✅ Waitlist modal for early access to learning paths
- ✅ Mobile-responsive comparison table (horizontal scroll on desktop, stacked cards on mobile)
- ✅ Legal compliance (FTC disclosure, Privacy Policy, Terms of Service)
- ✅ Social proof (LinkedIn profile links in header and footer)
- ✅ PartnerStack-ready infrastructure
- ✅ Zero external dependencies (fast loading)
- ✅ Deployed to Google Cloud Run with custom domain

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
- PartnerStack affiliate links for Coursera, DataQuest, Pluralsight
- Optional: Mailing list API keys (Mailchimp, ConvertKit, etc.)

## Features Implemented

✅ Next.js 14+ App Router  
✅ SEO-optimized pages  
✅ Affiliate redirect engine (`/go/[tool]`)  
✅ Click tracking (saves to `data/clicks.json`)  
✅ Lead capture with waitlist modal (saves to `data/leads.json`)  
✅ Mobile-responsive comparison table  
✅ Privacy Policy and Terms of Service pages  
✅ FTC-compliant affiliate disclosure in footer  
✅ LinkedIn social proof links  
✅ Data ingestion script  
✅ Zero external dependencies (fast loading)  
✅ Deployed to Google Cloud Run  
✅ Custom domain (dbcdatastudio.com) with SSL  

## Deployment

**Deploy to Cloud Run:**
```bash
cd dbc-data-studio
./deploy-career-hub.sh
```

This script:
- Builds and pushes Docker image to Google Container Registry
- Deploys/updates Cloud Run service
- Displays the live URL

**Custom Domain:**
- Domain: `dbcdatastudio.com`
- SSL: Automatically provisioned by Google Cloud
- DNS: Configured via Cloudflare

## Next Steps

1. ✅ Domain purchase: dbcdatastudio.com
2. ✅ Update data ingestion with learning path data
3. ✅ Deploy to Cloud Run with custom domain
4. ✅ Legal compliance (Privacy Policy, Terms, Disclosure)
5. ✅ Mobile-responsive design
6. ✅ Waitlist functionality
7. ⏳ Add PartnerStack affiliate links to `.env` (after approval)
8. ⏳ Set up professional email forwarding (daniel@dbcdatastudio.com)
9. ⏳ Integrate email provider (Mailchimp/ConvertKit) for lead capture
10. ⏳ Complete PartnerStack Network Profile to 100%

## PartnerStack Requirements

- ✅ Verified .com domain (dbcdatastudio.com)
- ✅ Live site with learning path content
- ✅ Legal compliance (Privacy Policy, Terms, FTC Disclosure)
- ✅ Mobile-responsive design
- ✅ Professional appearance
- ⏳ Professional email forwarding (daniel@dbcdatastudio.com)
- ⏳ PartnerStack Network Profile completion

