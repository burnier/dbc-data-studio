#!/bin/bash
# Script to check available Gemini models in Vertex AI

echo "🔍 Checking available Gemini models in Vertex AI..."
echo ""

# Check if authenticated
if ! gcloud auth print-access-token > /dev/null 2>&1; then
    echo "❌ Not authenticated. Run: gcloud auth application-default login"
    exit 1
fi

echo "✅ Authenticated as: $(gcloud config get-value account)"
echo "📋 Project: $(gcloud config get-value project)"
echo ""

# Try to list models via REST API
echo "Attempting to list available models..."
echo ""

# Note: Model Garden models are typically accessed via the console or API
# The @google/generative-ai SDK should automatically use the correct models
# when GOOGLE_GENAI_USE_VERTEXAI=true is set

echo "💡 To check available models:"
echo "   1. Go to: https://console.cloud.google.com/vertex-ai/model-garden"
echo "   2. Look for 'Gemini' models"
echo "   3. Ensure the model you want is enabled for your project"
echo ""
echo "💡 Common working model names:"
echo "   - gemini-1.5-flash (most stable)"
echo "   - gemini-2.5-flash (newer)"
echo "   - gemini-1.5-flash-002 (versioned)"
echo ""
echo "💡 If models return 404, try:"
echo "   1. Check your project has Vertex AI API enabled"
echo "   2. Verify billing is enabled"
echo "   3. Check IAM roles (aiplatform.user)"
echo "   4. Try a different region (us-east1, us-west1, etc.)"

