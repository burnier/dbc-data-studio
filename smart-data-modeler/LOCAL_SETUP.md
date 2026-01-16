# Local Development Setup

## Quick Start

### 1. Install Dependencies
```bash
cd smart-data-modeler
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file:

**Option A: Use AI Studio (Easier for Local Development)**
```bash
cp env.example .env.local
```

Then edit `.env.local`:
```
# Use AI Studio for local development (easier setup)
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_GENAI_USE_VERTEXAI=false

ENABLE_TELEMETRY=true
```

**Option B: Use Vertex AI (Requires GCP Auth)**
```bash
# Set up Application Default Credentials
gcloud auth application-default login

# Then use:
GOOGLE_CLOUD_PROJECT=dbc-data-studio
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_GENAI_USE_VERTEXAI=true
ENABLE_TELEMETRY=true
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Getting a Gemini API Key (AI Studio)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to `.env.local`

## Testing

1. Upload a CSV/JSON/XLSX file (max 4MB)
2. Wait for AI analysis
3. Review the three-bucket verification step
4. Download the ProductTypeDraft JSON

## Troubleshooting

### "Gemini API key not configured"
- Make sure `.env.local` exists and has `GEMINI_API_KEY` set
- Restart the dev server after changing `.env.local`

### "Google Cloud Project ID not configured"
- If using Vertex AI, make sure `GOOGLE_CLOUD_PROJECT` is set
- Or switch to AI Studio mode by setting `GOOGLE_GENAI_USE_VERTEXAI=false`

### File Upload Issues
- Check file size (max 4MB)
- Supported formats: CSV, JSON, XLSX

