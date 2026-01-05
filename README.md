# DBC Data Studio

A Venture Lab for creating multiple streams of passive income with minimal customer interaction.

**Partners:**
- **D (Daniel)** - Product Owner & Bridge. Senior Data Engineer at commercetools
- **B (Byron/Gemini)** - AI Strategist and Architect
- **C (Caleb/Cursor)** - Lead Technical Implementer

---

## Projects

### DBC Data Studio - AI Career & Education Hub

**Status:** 🚧 Development Phase  
**Strategy:** Zero-Touch Affiliate Hub for Career & Education

A high-performance, SEO-optimized hub for comparing learning paths from Coursera, DataQuest, and Pluralsight. Designed for Impact.com affiliate network with verified domain and professional email.

**Key Features:**
- Next.js 14+ (fast, SEO-optimized)
- Affiliate redirect engine (`/go/[path]`)
- Click tracking (timestamp, learning path, source)
- Lead capture component (career resources)
- Data ingestion for learning path features/pricing
- Impact.com verification ready
- Zero external dependencies (ad-ready)

**Tech Stack:**
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Tracking: Local JSON files (clicks.json, leads.json)
- Data: Learning path features and pricing ingestion

**Target Learning Paths:**
- Coursera (Data Engineering Professional Certificates)
- DataQuest (Python for Data Engineering)
- Pluralsight (AI Infrastructure & MLOps)

**Development:**
```bash
cd career-education-hub
./setup.sh
npm run dev
```

**Status:** Ready for domain purchase (DBCDataStudio.com) and Cloud Run deployment

---

### CatalogHero Smoke Test

**Status:** ✅ Deployed and Live  
**Repository:** https://github.com/burnier/dbc-data-studio  
**GCP Project:** `dbc-data-studio`

A smoke test for a Shopify Catalog Cleaner focused on transforming commercetools JSON into clean Shopify CSVs. This is our first venture lab experiment to validate market interest before building the full MVP.

#### Features

- **Landing Page**: Professional landing page with JSON-to-CSV Flattener messaging
  - Hero: "Turn complex commercetools JSON into clean Shopify CSVs. Pick your language, flatten your attributes, and sync in seconds."
  - Tailwind CSS styling, responsive design
  - Waitlist collection modal

- **Waitlist Collection**: Email capture with CSV storage
  - Local filesystem for development
  - Cloud Storage (GCS) for production
  - Automatic fallback between storage methods

- **Analytics Tracking**: Privacy-friendly analytics
  - Tracks: Page views, Click-to-upload, Waitlist signups
  - Stored in CSV format (local or GCS)
  - No third-party tracking services

- **Admin Dashboard**: Real-time metrics at `/admin`
  - Conversion rates
  - Event logs
  - Waitlist entries
  - Clean, professional UI

- **Refinery Logic**: JSON flattening skeleton
  - `flatten_ct_json()` function ready for implementation
  - Mock structure in place for full development

#### Tech Stack

- **Backend**: FastAPI (Python 3.9+)
- **Frontend**: Tailwind CSS (via CDN)
- **Storage**: Local filesystem (dev) / Google Cloud Storage (prod)
- **Infrastructure**: Terraform + Google Cloud Platform
  - Cloud Run (serverless hosting)
  - Cloud Storage (data persistence)
  - Service accounts with proper IAM

#### Quick Start (Local Development)

```bash
cd catalog-hero-smoke-test
./setup.sh
python main.py
```

- Landing page: `http://localhost:8000`
- Admin dashboard: `http://localhost:8000/admin`

#### Testing the Live Landing Page

The smoke test is deployed and live at: **https://cataloghero-smoke-test-7ul23r45va-uc.a.run.app/**

**How to test:**
1. **Visit the landing page** - See the hero message and "Upload JSON" button
2. **Click "Upload JSON"** - Opens the waitlist modal
3. **Enter an email** - Submit to join the waitlist
4. **Check admin dashboard** - Visit `/admin` to see:
   - Page view count
   - Click-to-upload count
   - Waitlist signups
   - Conversion rates
   - Event logs

**Admin Dashboard:** https://cataloghero-smoke-test-7ul23r45va-uc.a.run.app/admin

**What gets tracked:**
- Every page visit (page_view)
- Every "Upload JSON" button click (click_to_upload)
- Every waitlist signup (waitlist_signup)
- All data stored in Cloud Storage for analysis

#### GCP Deployment

**Complete instructions:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

**Initial setup (one-time):**
1. Enable GCP APIs (Cloud Run, Cloud Storage, Cloud Build)
2. Initialize Terraform: `cd terraform && terraform init`
3. Apply infrastructure: `terraform apply`
4. Build and deploy: `./deploy.sh`

**Redeploy after code changes:**
Simply run:
```bash
./deploy.sh
```

This script will:
- Build the Docker image
- Push it to Google Container Registry
- Update the Cloud Run service with the new image
- Display your live URL

**Infrastructure Components:**
- Cloud Run service (auto-scaling, serverless)
- Cloud Storage bucket (for CSV files)
- Service account with proper IAM permissions
- Optional: Cloud Build trigger for CI/CD

#### Project Structure

```
dbc-data-studio/
├── catalog-hero-smoke-test/    # Main application
│   ├── main.py                  # FastAPI application
│   ├── storage.py               # Storage abstraction (local/GCS)
│   ├── refinery_logic.py        # JSON flattening logic
│   ├── templates/               # HTML templates
│   ├── Dockerfile               # Container definition
│   └── requirements.txt         # Python dependencies
├── terraform/                   # Infrastructure as Code
│   ├── main.tf                  # Main resources
│   ├── variables.tf             # Configuration
│   └── outputs.tf               # Output values
├── cloudbuild.yaml              # CI/CD configuration
├── DEPLOYMENT.md                # Deployment guide
└── README.md                    # This file
```

#### Next Steps

1. **Deploy to GCP** - Follow DEPLOYMENT.md
2. **Monitor Metrics** - Use `/admin` dashboard to track conversion
3. **Analyze Interest** - Review waitlist signups and conversion rates
4. **Build MVP** - Implement full `flatten_ct_json()` logic if smoke test validates interest
5. **Custom Domain** - Discuss with Byron for domain name choice

#### Metrics to Track

Once deployed, monitor via `/admin`:
- **Page Views** → Total traffic
- **Click to Upload** → Interest level
- **Waitlist Signups** → Conversion intent
- **Conversion Rate** → Overall effectiveness
- **Click Conversion** → Engagement quality

---

## Organization Protocol

Each project/test is organized in its own subfolder within this repository to maintain clear separation between different business ideas. This allows us to:
- Test multiple ideas quickly
- Keep codebases isolated
- Scale successful experiments independently
- Maintain clean organization as we iterate

---

## Contact

- **GitHub**: https://github.com/burnier/dbc-data-studio
- **GCP Project**: dbc-data-studio
- **Email**: dbc-data-studio@gmail.com

