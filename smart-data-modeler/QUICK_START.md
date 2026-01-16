# Quick Start - Run Locally

## Step 1: Install Dependencies

```bash
cd smart-data-modeler
npm install
```

## Step 2: Create Environment File

Create `.env.local` in the `smart-data-modeler` directory:

```bash
# Copy the example
cp env.example .env.local
```

Then edit `.env.local` and add your Gemini API key:

```env
# For Local Development - Use AI Studio (Easier)
GEMINI_API_KEY=your_actual_api_key_here
GOOGLE_GENAI_USE_VERTEXAI=false

ENABLE_TELEMETRY=true
```

### Get a Gemini API Key:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in `.env.local`

## Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 4: Test It!

1. Upload a CSV/JSON/XLSX file (max 4MB)
2. Wait for AI analysis (takes ~10-30 seconds)
3. Review the three-bucket verification step:
   - **Standard Fields**: name, description, slug, sku (shown for info)
   - **Product Info**: Customer-facing attributes (default ON)
   - **Technical Metadata**: Internal flags/IDs (default OFF)
4. Click "Continue to Preview"
5. Download the ProductTypeDraft JSON

## Troubleshooting

### "GEMINI_API_KEY not configured"
- Make sure `.env.local` exists in the `smart-data-modeler` directory
- Check that the API key is correct (no extra spaces)
- Restart the dev server: `npm run dev`

### "npm install" fails
- Try: `npm install --legacy-peer-deps`
- Or: `npm install --force`

### File upload not working
- Check file size (max 4MB)
- Supported formats: `.csv`, `.json`, `.xlsx`, `.xls`

## What's Ready?

✅ File upload (CSV/JSON/XLSX)  
✅ AI-powered schema analysis  
✅ Three-bucket verification UI  
✅ ProductTypeDraft JSON generation  
✅ API Playground-ready output  

## Next Steps

Once it's working locally, you can:
- Test with different product data files
- Refine the Gemini prompts if needed
- Deploy to Cloud Run when ready

