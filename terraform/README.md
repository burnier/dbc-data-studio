# Terraform Infrastructure for CatalogHero

This Terraform configuration sets up the GCP infrastructure for the CatalogHero smoke test.

## Prerequisites

1. GCP Project created: `dbc-data-studio`
2. Terraform installed (>= 1.0)
3. Google Cloud SDK installed and authenticated
4. Required APIs enabled:
   - Cloud Run API
   - Cloud Storage API
   - Cloud Build API (if using CI/CD)

## Setup

1. **Enable required APIs:**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable storage.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

2. **Set up Terraform:**
   ```bash
   cd terraform
   terraform init
   ```

3. **Create terraform.tfvars (optional):**
   ```hcl
   project_id = "dbc-data-studio"
   region     = "us-central1"
   ```

4. **Plan and apply:**
   ```bash
   terraform plan
   terraform apply
   ```

## What gets created

- **Cloud Storage Bucket**: Stores waitlist and analytics CSV files
- **Cloud Run Service**: Hosts the FastAPI application
- **Service Account**: For Cloud Run to access Cloud Storage
- **IAM Bindings**: Proper permissions for service account
- **Cloud Build Trigger** (optional): Auto-deploy on git push

## Deployment

After infrastructure is created:

1. **Build and push Docker image:**
   ```bash
   gcloud builds submit --tag gcr.io/dbc-data-studio/cataloghero:latest \
     ../catalog-hero-smoke-test
   ```

2. **Update container_image in terraform.tfvars:**
   ```hcl
   container_image = "gcr.io/dbc-data-studio/cataloghero:latest"
   ```

3. **Apply Terraform:**
   ```bash
   terraform apply
   ```

## Outputs

After applying, you'll get:
- Cloud Run URL (your app URL)
- Storage bucket name
- Service account email

## Custom Domain (Future)

To add a custom domain, you'll need to:
1. Create a Cloud Run domain mapping
2. Configure DNS records
3. Discuss with Byron for domain name choice

