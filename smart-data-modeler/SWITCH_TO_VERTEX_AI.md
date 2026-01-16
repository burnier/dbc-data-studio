# Switch to Vertex AI - Quick Guide

## Why Switch?
- ✅ Higher quota limits (free tier has more generous limits)
- ✅ No API key needed (uses GCP authentication)
- ✅ Better for production
- ✅ Integrated with your GCP project billing

## Quick Setup (3 Steps)

### Step 1: Enable Vertex AI API
```bash
gcloud services enable aiplatform.googleapis.com --project=dbc-data-studio
```

### Step 2: Authenticate
```bash
gcloud auth application-default login
```
This opens a browser - sign in with your Google account.

### Step 3: Update .env.local

Update your `.env.local` file to:

```env
# Vertex AI Configuration (GCP Project)
GOOGLE_CLOUD_PROJECT=dbc-data-studio
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_GENAI_USE_VERTEXAI=true

# Remove or comment out GEMINI_API_KEY
# GEMINI_API_KEY=...

ENABLE_TELEMETRY=true
```

### Step 4: Restart Server
```bash
npm run dev
```

## Or Use the Setup Script

I've created a script that does steps 1-3 automatically:

```bash
cd smart-data-modeler
./VERTEX_AI_QUICK_SETUP.sh
```

Then restart your server.

## Verify It's Working

After restarting, upload a file. You should see:
- No quota errors
- Faster responses (Vertex AI has better infrastructure)
- Uses your GCP project's quota instead of AI Studio's free tier

## Troubleshooting

**"Permission denied"**
- Make sure you ran `gcloud auth application-default login`
- Check that Vertex AI API is enabled in your project

**"Model not found"**
- Vertex AI might use different model names
- The code uses `gemini-1.5-pro` which should be available

**"Project not found"**
- Verify your project ID: `gcloud config get-value project`
- Should be `dbc-data-studio`

