#!/bin/bash
# Deployment script for DBC Data Studio - Career & Education Hub
# Deploys Next.js app to Cloud Run

set -e  # Exit on error

PROJECT_ID="dbc-data-studio"
REGION="us-central1"
SERVICE_NAME="career-education-hub"
IMAGE_NAME="gcr.io/${PROJECT_ID}/career-hub:latest"
APP_DIR="career-education-hub"

echo "🚀 Deploying DBC Data Studio - Career & Education Hub to Cloud Run..."
echo ""

# Step 1: Build and push Docker image
echo "📦 Building and pushing Docker image..."
gcloud builds submit --tag ${IMAGE_NAME} ./${APP_DIR}

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

echo ""
echo "✅ Docker image built and pushed successfully"
echo ""

# Step 2: Deploy or update Cloud Run service
echo "🔄 Deploying/updating Cloud Run service..."
gcloud run deploy ${SERVICE_NAME} \
    --image ${IMAGE_NAME} \
    --region ${REGION} \
    --project ${PROJECT_ID} \
    --platform managed \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --port 3000

if [ $? -ne 0 ]; then
    echo "❌ Cloud Run deployment failed!"
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app is live at:"
LIVE_URL=$(gcloud run services describe ${SERVICE_NAME} \
    --region ${REGION} \
    --project ${PROJECT_ID} \
    --format 'value(status.url)')
echo "${LIVE_URL}"
echo ""
echo "📋 Next steps:"
echo "1. Map custom domain (run this command):"
echo "   gcloud beta run domain-mappings create \\"
echo "     --service=career-education-hub \\"
echo "     --domain=dbcdatastudio.com \\"
echo "     --platform=managed \\"
echo "     --project=dbc-data-studio"
echo ""
echo "2. Add DNS records at your registrar (from output above)"
echo "3. Set up email forwarding"
echo "4. Add Impact.com verification file"

