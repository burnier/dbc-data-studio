terraform {
  required_version = ">= 1.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Cloud Storage Bucket for CSV files
resource "google_storage_bucket" "data_bucket" {
  name          = "${var.project_id}-cataloghero-data"
  location      = var.region
  force_destroy = false

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 365
    }
    action {
      type = "Delete"
    }
  }
}

# Service Account for Cloud Run
resource "google_service_account" "cloud_run_sa" {
  account_id   = "cataloghero-cloud-run"
  display_name = "CatalogHero Cloud Run Service Account"
}

# IAM binding for Cloud Run service account to access Cloud Storage
resource "google_storage_bucket_iam_member" "cloud_run_storage_access" {
  bucket = google_storage_bucket.data_bucket.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

# Cloud Run Service
resource "google_cloud_run_v2_service" "cataloghero" {
  name     = "cataloghero-smoke-test"
  location = var.region

  template {
    service_account = google_service_account.cloud_run_sa.email

    containers {
      image = var.container_image

      ports {
        container_port = 8000
      }

      env {
        name  = "USE_GCS"
        value = "true"
      }

      env {
        name  = "GCS_BUCKET_NAME"
        value = google_storage_bucket.data_bucket.name
      }

      env {
        name  = "GCS_PROJECT_ID"
        value = var.project_id
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }
  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

# IAM policy to allow unauthenticated access (for public landing page)
resource "google_cloud_run_service_iam_member" "public_access" {
  service  = google_cloud_run_v2_service.cataloghero.name
  location = google_cloud_run_v2_service.cataloghero.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Cloud Build Trigger (optional - for CI/CD)
resource "google_cloudbuild_trigger" "deploy_trigger" {
  count = var.enable_cloud_build ? 1 : 0

  name        = "cataloghero-deploy"
  description = "Deploy CatalogHero on push to main branch"

  github {
    owner = var.github_owner
    name  = var.github_repo
    push {
      branch = "^main$"
    }
  }

  filename = "cloudbuild.yaml"

  substitutions = {
    _SERVICE_NAME = google_cloud_run_v2_service.cataloghero.name
    _REGION       = var.region
    _PROJECT_ID   = var.project_id
  }
}

