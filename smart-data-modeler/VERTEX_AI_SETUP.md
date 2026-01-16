# Setting Up Vertex AI (GCP Project)

To use Vertex AI from your GCP project instead of AI Studio (to avoid quota limits):

## Step 1: Enable Vertex AI API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **dbc-data-studio**
3. Go to **APIs & Services** → **Library**
4. Search for "Vertex AI API"
5. Click **Enable**

## Step 2: Set Up Authentication

You have two options:

### Option A: Application Default Credentials (Recommended for Local)

```bash
gcloud auth application-default login
```

This will:
- Open a browser for authentication
- Store credentials locally
- Allow the SDK to automatically authenticate

### Option B: Service Account (For Production/Cloud Run)

1. Create a service account in GCP Console
2. Grant it "Vertex AI User" role
3. Download the JSON key
4. Set environment variable: `GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json`

## Step 3: Update .env.local

Update your `.env.local` file:

```env
# Use Vertex AI from GCP project
GOOGLE_CLOUD_PROJECT=dbc-data-studio
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_GENAI_USE_VERTEXAI=true

# Remove or comment out the AI Studio key
# GEMINI_API_KEY=...

ENABLE_TELEMETRY=true
```

## Step 4: Restart the Server

```bash
npm run dev
```

## Benefits of Vertex AI

- ✅ Higher quota limits (especially with free tier)
- ✅ Better for production workloads
- ✅ Integrated with your GCP project
- ✅ No API key needed (uses Application Default Credentials)

## Troubleshooting

### "Permission denied" or "Authentication error"
- Make sure you ran `gcloud auth application-default login`
- Verify your GCP project has Vertex AI API enabled
- Check that your account has "Vertex AI User" role

### "Model not found"
- Vertex AI might use slightly different model names
- Check available models in GCP Console → Vertex AI → Model Garden

