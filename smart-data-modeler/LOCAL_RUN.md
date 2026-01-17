# Running Smart Data Modeler Locally

## Prerequisites

1. **Node.js 18+** installed
2. **Google Cloud SDK** installed and authenticated
3. **Vertex AI access** configured for your GCP project

## Setup Steps

### 1. Install Dependencies

```bash
cd smart-data-modeler
npm install
```

### 2. Configure Environment Variables

Create or update `.env.local` file in the `smart-data-modeler` directory:

```bash
# Vertex AI Configuration (recommended)
GOOGLE_CLOUD_PROJECT=dbc-data-studio
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_GENAI_USE_VERTEXAI=true

# Optional: Analytics/Telemetry
ENABLE_TELEMETRY=true

# Optional: Google Analytics 4 (for production tracking)
# NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```

**For Vertex AI (Recommended):**
- Make sure you're authenticated: `gcloud auth application-default login`
- Verify IAM roles: You need `roles/aiplatform.user` on the project

**Alternative: AI Studio Mode**
If you want to use AI Studio instead (requires API key):
```bash
GEMINI_API_KEY=your_api_key_here
GOOGLE_GENAI_USE_VERTEXAI=false
```

### 3. Start the Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### 4. Test the Application

1. Open `http://localhost:3000` in your browser
2. Upload a test file (CSV, JSON, or XLSX):
   - Use `test-data.csv` from the project root
   - Or upload your own product data file (max 4MB)
3. Wait for AI analysis (may take 10-30 seconds)
4. Review and customize attribute mappings
5. Download the commercetools schema JSON

## Troubleshooting

### "Model not available" error
- Make sure you're using `gemini-2.0-flash` (already configured)
- Verify your GCP project has Vertex AI API enabled
- Check IAM permissions: `gcloud projects get-iam-policy dbc-data-studio`

### "Authentication failed" error
- Run: `gcloud auth application-default login`
- Verify: `gcloud config get-value project` shows `dbc-data-studio`

### Port 3000 already in use
- Kill the existing process: `lsof -ti:3000 | xargs kill`
- Or use a different port: `PORT=3001 npm run dev`

### Build errors
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Test Data

A sample `test-data.csv` file is included in the project with:
- Product attributes: name, description, sku, price, color, brand, size, material, category
- Technical metadata: is_active, internal_id, legacy_code
- Multiple product variants

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

