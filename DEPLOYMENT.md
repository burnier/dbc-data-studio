# Deployment Guide - CatalogHero to GCP

## Prerequisites

1. GCP Project: `dbc-data-studio` (already created)
2. Google Cloud SDK installed and authenticated
3. Terraform installed (>= 1.0)
4. Docker installed (for local testing)

## Step 1: Enable Required APIs

```bash
gcloud config set project dbc-data-studio
gcloud services enable run.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## Step 2: Set Up Terraform Infrastructure

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

This creates:
- Cloud Storage bucket for CSV files
- Cloud Run service (will be updated after image is built)
- Service account with proper permissions
- IAM bindings

## Step 3: Build and Push Docker Image

```bash
# From project root
gcloud builds submit --tag gcr.io/dbc-data-studio/cataloghero:latest \
  ./catalog-hero-smoke-test
```

Or build locally and push:

```bash
cd catalog-hero-smoke-test
docker build -t gcr.io/dbc-data-studio/cataloghero:latest .
docker push gcr.io/dbc-data-studio/cataloghero:latest
```

## Step 4: Update Terraform with Image URL

Edit `terraform/terraform.tfvars` (create if doesn't exist):

```hcl
project_id      = "dbc-data-studio"
region          = "us-central1"
container_image = "gcr.io/dbc-data-studio/cataloghero:latest"
```

Then apply:

```bash
cd terraform
terraform apply
```

## Step 5: Get Your URL

After deployment, get your Cloud Run URL:

```bash
terraform output cloud_run_url
```

Or:

```bash
gcloud run services describe cataloghero-smoke-test \
  --region us-central1 \
  --format 'value(status.url)'
```

## Local Development

For local development (using local filesystem):

```bash
cd catalog-hero-smoke-test
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

The app will use local CSV files by default (no GCS needed for local dev).

## Environment Variables

The app automatically detects GCS usage via environment variables:

- `USE_GCS=true` - Enable Cloud Storage (set by Terraform)
- `GCS_BUCKET_NAME` - Bucket name (set by Terraform)
- `GCS_PROJECT_ID` - Project ID (set by Terraform)

If these are not set, the app falls back to local filesystem.

## Custom Domain (Future)

Once Byron decides on a domain:

1. Add domain mapping in Terraform
2. Configure DNS records
3. Update Cloud Run service

## Monitoring

- Cloud Run logs: `gcloud logging read "resource.type=cloud_run_revision" --limit 50`
- Cloud Storage: Check bucket in GCP Console
- Admin dashboard: `https://YOUR-URL/admin`

