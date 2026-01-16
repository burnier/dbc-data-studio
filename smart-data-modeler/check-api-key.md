# API Key Troubleshooting

The "fetch failed" errors suggest there might be an issue with:
1. API key validity
2. API key permissions
3. Network connectivity

## Quick Check

1. **Verify your API key is active:**
   - Go to https://makersuite.google.com/app/apikey
   - Make sure the key is enabled and not restricted

2. **Check API key restrictions:**
   - If you set IP restrictions, make sure localhost is allowed
   - If you set API restrictions, make sure "Generative Language API" is enabled

3. **Try creating a new API key:**
   - Sometimes keys need to be regenerated
   - Create a new one and update `.env.local`

## Test the API Key Directly

You can test if the API key works by running this in your terminal:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY"
```

This should return a list of available models.

## Alternative: Use Vertex AI

If AI Studio continues to have issues, you can switch to Vertex AI:
1. Set up Application Default Credentials: `gcloud auth application-default login`
2. Update `.env.local`:
   ```
   GOOGLE_CLOUD_PROJECT=dbc-data-studio
   GOOGLE_CLOUD_LOCATION=us-central1
   GOOGLE_GENAI_USE_VERTEXAI=true
   ```

