#!/bin/bash
# Deployment script for CatalogHero smoke test
# Rebuilds Docker image and updates Cloud Run service

set -e  # Exit on error

PROJECT_ID="dbc-data-studio"
REGION="us-central1"
SERVICE_NAME="cataloghero-smoke-test"
IMAGE_NAME="gcr.io/${PROJECT_ID}/cataloghero:latest"
APP_DIR="catalog-hero-smoke-test"

echo "🚀 Deploying CatalogHero to Cloud Run..."
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

# Step 2: Update Cloud Run service
echo "🔄 Updating Cloud Run service..."
gcloud run services update ${SERVICE_NAME} \
    --image ${IMAGE_NAME} \
    --region ${REGION} \
    --project ${PROJECT_ID}

if [ $? -ne 0 ]; then
    echo "❌ Cloud Run update failed!"
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app is live at:"
gcloud run services describe ${SERVICE_NAME} \
    --region ${REGION} \
    --project ${PROJECT_ID} \
    --format 'value(status.url)'
echo ""
echo "📊 Admin dashboard:"
gcloud run services describe ${SERVICE_NAME} \
    --region ${REGION} \
    --project ${PROJECT_ID} \
    --format 'value(status.url)' | xargs -I {} echo "{}/admin"

