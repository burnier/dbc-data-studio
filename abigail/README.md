# Abigail Arts & Oracles - Project Summary

## Quick Start

**⚠️ Important**: This project has two separate directories. Make sure you're in the correct directory when running commands.

### Start Backend (Terminal 1)
```bash
cd /Users/dburnier/Documents/my_repos/dbc-data-studio/abigail/backend
source venv/bin/activate
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Start Frontend (Terminal 2)
```bash
cd /Users/dburnier/Documents/my_repos/dbc-data-studio/abigail/website
npm run dev
```

Then open `http://localhost:3000` in your browser.

---

## Current Project Status

✅ **Fully Implemented and Functional**

The Abigail Arts & Oracles website is a **hybrid architecture** project consisting of:
- **Frontend**: Next.js 16 (App Router) with TypeScript, Tailwind CSS, and i18next
- **Backend**: FastAPI (Python) for business logic and AI reading generation - **Fully implemented**
- **Internationalization**: Multi-language support (English, German, Portuguese, Hungarian) with route-based localization (`/en`, `/de`, `/pt`, `/hu`)

**Status**: The application is fully functional and ready for development. Both frontend and backend are implemented and working together.

## Project Structure

```
abigail/
├── website/              # Next.js frontend
│   ├── app/
│   │   ├── [locale]/    # Internationalized routes
│   │   │   ├── page.tsx           # Main oracle page
│   │   │   ├── layout.tsx         # Locale-specific layout
│   │   │   ├── abigail/page.tsx   # Abigail's bio page
│   │   │   ├── cards/page.tsx     # Card gallery
│   │   │   ├── contact/page.tsx   # Contact page
│   │   │   ├── shop/page.tsx      # Shop page
│   │   │   └── checkout/page.tsx  # Checkout page
│   │   ├── layout.tsx   # Root layout
│   │   └── globals.css  # Global styles
│   ├── components/
│   │   ├── Header.tsx              # Navigation with language dropdown
│   │   ├── CardDraw.tsx            # 36-card shuffle and selection
│   │   ├── LeadMagnetForm.tsx     # User question form
│   │   ├── ReadingResult.tsx      # Reading display (calls backend API)
│   │   ├── PremiumConversion.tsx  # Premium conversion CTA
│   │   └── I18nProvider.tsx       # i18next provider
│   ├── lib/
│   │   ├── api.ts                  # API client for backend calls
│   │   └── i18n.ts                 # i18next configuration
│   ├── locales/                    # Translation files
│   │   ├── en.json
│   │   ├── de.json
│   │   ├── pt.json
│   │   └── hu.json
│   ├── constants/
│   │   └── cardMeanings.ts         # Card data (36 cards)
│   ├── contexts/
│   │   └── ReadingContext.tsx      # Reading state management
│   ├── middleware.ts              # Locale detection & routing
│   └── public/
│       ├── abigail_logo.png        # Logo files
│       ├── abigail_logo2.png
│       ├── logo_text.png
│       └── cards/                  # 36 card images
│
└── backend/            # FastAPI backend ✅ Fully implemented
    ├── main.py                     # FastAPI app entry point
    ├── app/
    │   ├── api/
    │   │   └── readings.py          # /api/generate-reading endpoint
    │   ├── core/
    │   │   └── config.py           # Settings & CORS configuration
    │   ├── models/
    │   │   └── schemas.py          # Pydantic request/response models
    │   ├── services/
    │   │   └── reading_service.py  # Reading generation logic
    │   └── data/
    │       └── cards.py            # Card data (Python - all 36 cards)
    ├── requirements.txt            # Python dependencies
    ├── README.md                   # Backend-specific documentation
    └── venv/                       # Python virtual environment
```

## Key Features

### Frontend Features
- **Internationalized Routing**: All pages accessible via `/en`, `/de`, `/pt`, `/hu` prefixes
- **Language Dropdown**: Header includes dropdown with flag emojis (🇺🇸 🇩🇪 🇧🇷 🇭🇺)
- **3-Card Oracle Reading**: Interactive card selection with shuffle animation
- **AI Reading Generation**: Calls Python backend API for reading synthesis
- **Premium Upsell**: Full deck reading conversion section
- **Dark Theme**: Charcoal background (#121212) with bone-white text
- **Responsive Design**: Mobile and desktop optimized

### Backend Features ✅ Implemented
- **FastAPI REST API**: `/api/generate-reading` endpoint
- **CORS Configuration**: Configured to allow frontend calls from `localhost:3000`
- **Template-based Readings**: Currently uses template synthesis (ready for LLM integration)
- **Multi-language Support**: Generates readings in EN, DE, PT, HU
- **Structured API Contract**: Pydantic models for request/response validation
- **All 36 Cards Populated**: Complete card data with meanings in all 4 languages

## How to Start Locally

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.9+ (if backend exists)
- **npm** or **yarn** for frontend dependencies

### Step 1: Start the Backend

```bash
# Navigate to backend directory
cd /Users/dburnier/Documents/my_repos/dbc-data-studio/abigail/backend

# Activate virtual environment (already created)
source venv/bin/activate  # On macOS/Linux
# OR
.\venv\Scripts\activate  # On Windows

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend will be available at: `http://localhost:8000`
- API endpoint: `http://localhost:8000/api/generate-reading`
- Health check: `http://localhost:8000/health`
- API docs: `http://localhost:8000/docs` (Interactive Swagger UI)

### Step 2: Start the Frontend

```bash
# Navigate to website directory (IMPORTANT: Must be in website/ directory)
cd /Users/dburnier/Documents/my_repos/dbc-data-studio/abigail/website

# Install dependencies (if not already installed)
npm install

# Set environment variable for API URL (optional, defaults to localhost:8000)
export NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

The frontend will be available at: `http://localhost:3000`

**⚠️ Important**: Make sure you're in the `abigail/website/` directory when running `npm run dev`. Running it from the root `dbc-data-studio/` directory will fail because there's no `package.json` there.

### Step 3: Access the Application

1. **Homepage**: `http://localhost:3000` (will redirect to `/en` by default)
2. **Language-specific routes**:
   - English: `http://localhost:3000/en`
   - German: `http://localhost:3000/de`
   - Portuguese: `http://localhost:3000/pt`
   - Hungarian: `http://localhost:3000/hu`
3. **Other pages**:
   - Abigail's Bio: `http://localhost:3000/en/abigail`
   - Card Gallery: `http://localhost:3000/en/cards`
   - Contact: `http://localhost:3000/en/contact`
   - Shop: `http://localhost:3000/en/shop`

## Environment Variables

### Frontend (.env.local)
```bash
# API URL for backend (defaults to http://localhost:8000)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```bash
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# CORS Origins (comma-separated or list)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000

# LLM Configuration (for future use)
LLM_PROVIDER=openai
LLM_MODEL=gpt-4
LLM_API_KEY=
LLM_ENABLED=false

# Environment
ENVIRONMENT=development
```

## API Contract

### Request: `POST /api/generate-reading`

```json
{
  "card_ids": [0, 15, 32],
  "language": "en",
  "question": "What does my future hold?"
}
```

### Response: `GenerateReadingResponse`

```json
{
  "reading_text": "The cards have spoken. The first card reveals that...",
  "cards": [
    {
      "id": 0,
      "name_key": "constancy",
      "meaning": "\"Eye of God\", means work and obligations..."
    },
    {
      "id": 15,
      "name_key": "love",
      "meaning": "Love, romance and deep emotional connection."
    },
    {
      "id": 32,
      "name_key": "hope",
      "meaning": "Hope, optimism and positive expectations."
    }
  ],
  "language": "en",
  "metadata": {
    "generation_method": "template",
    "generation_time_ms": 5,
    "llm_enabled": false
  }
}
```

## Troubleshooting

### Backend Not Starting
- **Issue**: `ModuleNotFoundError: No module named 'pydantic_settings'`
- **Solution**: Ensure virtual environment is activated and run `pip install -r requirements.txt`

### Frontend Can't Connect to Backend
- **Issue**: CORS errors or connection refused
- **Solution**: 
  1. Verify backend is running on `http://localhost:8000`
  2. Check `CORS_ORIGINS` in backend `.env` includes `http://localhost:3000`
  3. Verify `NEXT_PUBLIC_API_URL` environment variable is set correctly

### Translation Issues
- **Issue**: Card names showing as translation keys (e.g., `cards.enemy`)
- **Solution**: Ensure i18n is properly initialized and locale matches route parameter

### Hydration Errors
- **Issue**: Server-rendered HTML doesn't match client
- **Solution**: Ensure i18n language matches route locale, use `suppressHydrationWarning` where appropriate

## Current Status & Next Steps

### ✅ Completed & Functional
- ✅ Hybrid architecture setup (FastAPI + Next.js)
- ✅ Backend fully implemented with all 36 cards populated
- ✅ Internationalized routing with `/en`, `/de`, `/pt`, `/hu` prefixes
- ✅ Language dropdown with flag indicators (🇺🇸 🇩🇪 🇧🇷 🇭🇺)
- ✅ API integration for reading generation
- ✅ Card gallery with 36 cards
- ✅ Responsive design and dark theme
- ✅ Logo integration (`abigail_logo2.png` and `logo_text.png`)
- ✅ Reading context management
- ✅ All translation files (EN, DE, PT, HU)
- ✅ CORS configuration for local development
- ✅ Template-based reading generation (ready for LLM)

### 🚧 Future Enhancements
- LLM integration for advanced reading generation (infrastructure ready)
- Stripe/Payment integration for premium readings
- Email service for form submissions
- Production deployment configuration
- Full deck reading feature

## Development Notes

- **Middleware**: Automatically redirects root paths to locale-prefixed paths (e.g., `/` → `/en`)
- **Language Switching**: Uses full page refresh to ensure proper locale change
- **API Calls**: Frontend uses `fetch` to call Python backend via `lib/api.ts`
- **Card Images**: Located in `public/cards/` directory (36 JPG files, named `card_0.jpg` through `card_35.jpg`)
- **Translations**: Managed via JSON files in `locales/` directory (en.json, de.json, pt.json, hu.json)
- **Card Data**: Duplicated in both frontend (`constants/cardMeanings.ts`) and backend (`app/data/cards.py`) - backend is source of truth for API
- **Environment Variables**: Frontend uses `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`)
- **Backend Virtual Environment**: Already created at `backend/venv/` - activate before running

## Reference Material

All original content, card meanings, and translations are located in:
`/abigail/ref_material/AbigailCardsWebsite/`

