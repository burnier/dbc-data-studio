# Abigail Arts & Oracles - Project Summary

## Current Project Status

The Abigail Arts & Oracles website is designed as a **hybrid architecture** project consisting of:
- **Frontend**: Next.js 16 (App Router) with TypeScript, Tailwind CSS, and i18next
- **Backend**: FastAPI (Python) for business logic and AI reading generation (may need to be set up)
- **Internationalization**: Multi-language support (English, German, Portuguese, Hungarian) with route-based localization (`/en`, `/de`, `/pt`, `/hu`)

**Note**: Based on the conversation history, the project was refactored to use this hybrid architecture. However, some components may need to be verified or recreated if they were removed.

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
│   │   ├── Footer.tsx              # Footer with translations
│   │   ├── CardShuffle.tsx        # 36-card shuffle animation
│   │   ├── AISynthesis.tsx        # Reading display (calls backend API)
│   │   ├── FullReadingUpsell.tsx  # Premium conversion CTA
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
└── backend/            # FastAPI backend (if exists)
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
    │       └── cards.py            # Card data (Python)
    ├── requirements.txt
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

### Backend Features (If Implemented)
- **FastAPI REST API**: `/api/generate-reading` endpoint
- **CORS Configuration**: Allows frontend to call backend locally
- **Template-based Readings**: Currently uses template synthesis (ready for LLM integration)
- **Multi-language Support**: Generates readings in EN, DE, PT, HU
- **Structured API Contract**: Pydantic models for request/response validation

## How to Start Locally

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.9+ (if backend exists)
- **npm** or **yarn** for frontend dependencies

### Step 1: Start the Backend (If Exists)

**Check if backend directory exists:**
```bash
ls -la /Users/dburnier/Documents/my_repos/dbc-data-studio/abigail/backend
```

If the `/backend` directory exists:

```bash
# Navigate to backend directory
cd /Users/dburnier/Documents/my_repos/dbc-data-studio/abigail/backend

# Create virtual environment (if not exists)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# OR
.\venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend will be available at: `http://localhost:8000`
- API endpoint: `http://localhost:8000/api/generate-reading`
- Health check: `http://localhost:8000/health`
- API docs: `http://localhost:8000/docs`

**If backend doesn't exist**, the frontend may work with mock data or you'll need to recreate it based on the architecture described in the conversation history.

### Step 2: Start the Frontend

```bash
# Navigate to website directory
cd /Users/dburnier/Documents/my_repos/dbc-data-studio/abigail/website

# Install dependencies (if not already installed)
npm install

# Note: If i18next dependencies are missing, you may need to install them:
# npm install i18next react-i18next i18next-browser-languagedetector

# Set environment variable for API URL (optional, defaults to localhost:8000)
export NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

The frontend will be available at: `http://localhost:3000`

**Note**: If you see errors about missing dependencies (like `i18next` or `react-i18next`), install them:
```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

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

### ✅ Completed
- Hybrid architecture setup (FastAPI + Next.js)
- Internationalized routing with `/en`, `/de`, `/pt`, `/hu` prefixes
- Language dropdown with flag indicators
- API integration for reading generation
- Card gallery with 36 cards
- Responsive design and dark theme
- Logo integration

### 🚧 In Progress / Pending
- Backend directory may need to be recreated if missing
- LLM integration for advanced reading generation
- Stripe/Payment integration for premium readings
- Email service for form submissions
- Production deployment configuration

## Development Notes

- **Middleware**: Automatically redirects root paths to locale-prefixed paths
- **Language Switching**: Uses full page refresh to ensure proper locale change
- **API Calls**: Frontend uses `fetch` to call Python backend
- **Card Images**: Located in `public/cards/` directory (36 JPG files)
- **Translations**: Managed via JSON files in `locales/` directory

## Reference Material

All original content, card meanings, and translations are located in:
`/abigail/ref_material/AbigailCardsWebsite/`

