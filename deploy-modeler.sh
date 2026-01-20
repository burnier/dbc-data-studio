#!/bin/bash

# Deploy Smart Data Modeler to Google Cloud Run
# Usage: ./deploy-modeler.sh
#
# This script uses Cloud Build to build and deploy the application.
# No local Docker installation required!

set -e

PROJECT_ID="dbc-data-studio"
SERVICE_NAME="smart-data-modeler"
REGION="us-central1"

echo "🚀 Deploying Smart Data Modeler to Cloud Run..."
echo ""

# Get GA4 ID from Secret Manager for build-time injection
echo "📊 Fetching GA4 ID from Secret Manager..."
GA4_ID=$(gcloud secrets versions access latest --secret="NEXT_PUBLIC_GA4_ID" --project=${PROJECT_ID} 2>/dev/null || echo "")

# Generate a timestamp-based image tag
IMAGE_TAG=$(date +%Y%m%d-%H%M%S)

if [ -z "$GA4_ID" ]; then
  echo "⚠️  Warning: NEXT_PUBLIC_GA4_ID secret not found. GA4 tracking will be disabled."
  echo "   Create the secret with:"
  echo "   echo 'G-NMF51G1TX7' | gcloud secrets create NEXT_PUBLIC_GA4_ID --data-file=- --project=${PROJECT_ID}"
  echo ""
  SUBSTITUTIONS="_IMAGE_TAG=${IMAGE_TAG}"
else
  echo "✅ GA4 ID found. Building with analytics enabled..."
  echo ""
  SUBSTITUTIONS="_IMAGE_TAG=${IMAGE_TAG},_GA4_ID=${GA4_ID}"
fi

# Build and deploy using Cloud Build
echo "☁️  Building and deploying with Cloud Build..."
cd smart-data-modeler

gcloud builds submit \
  --config=cloudbuild.yaml \
  --project=${PROJECT_ID} \
  --substitutions="${SUBSTITUTIONS}"

if [ $? -ne 0 ]; then
  echo "❌ Build/deployment failed!"
  exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔗 Service URL:"
gcloud run services describe ${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --project ${PROJECT_ID} \
  --format 'value(status.url)'
echo ""
echo "🌐 Custom domain: https://modeler.dbcdatastudio.com"

