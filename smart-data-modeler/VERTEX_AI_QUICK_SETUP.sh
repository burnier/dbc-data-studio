#!/bin/bash
# Quick setup script for Vertex AI

echo "🔧 Setting up Vertex AI for Smart Data Modeler..."

# Step 1: Enable Vertex AI API
echo "📋 Step 1: Enabling Vertex AI API..."
gcloud services enable aiplatform.googleapis.com --project=dbc-data-studio

# Step 2: Set up Application Default Credentials
echo "🔐 Step 2: Setting up authentication..."
gcloud auth application-default login

# Step 3: Update .env.local
echo "📝 Step 3: Updating .env.local..."
cat > .env.local << 'ENVEOF'
# Vertex AI Configuration (GCP Project)
GOOGLE_CLOUD_PROJECT=dbc-data-studio
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_GENAI_USE_VERTEXAI=true

# Optional: Analytics/Telemetry
ENABLE_TELEMETRY=true
ENVEOF

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Restart your dev server: npm run dev"
echo "2. Try uploading a file again"
