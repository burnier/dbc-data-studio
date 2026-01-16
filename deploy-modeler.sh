#!/bin/bash

# Deploy Smart Data Modeler to Google Cloud Run
# Usage: ./deploy-modeler.sh

set -e

PROJECT_ID="dbc-data-studio"
SERVICE_NAME="smart-data-modeler"
REGION="us-central1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 Building Docker image..."
cd smart-data-modeler
docker build -t ${IMAGE_NAME} .

echo "📤 Pushing image to Google Container Registry..."
docker push ${IMAGE_NAME}

echo "☁️  Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --project ${PROJECT_ID} \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --set-env-vars "ENABLE_TELEMETRY=true" \
  --set-secrets "GEMINI_API_KEY=GEMINI_API_KEY:latest"

echo "✅ Deployment complete!"
echo "🔗 Service URL:"
gcloud run services describe ${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --project ${PROJECT_ID} \
  --format 'value(status.url)'

