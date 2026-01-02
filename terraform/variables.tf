variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "dbc-data-studio"
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "container_image" {
  description = "Container image URL for Cloud Run (e.g., gcr.io/PROJECT_ID/cataloghero:latest)"
  type        = string
  default     = "gcr.io/cloudrun/hello" # Placeholder image - will be updated after building actual image
}

variable "enable_cloud_build" {
  description = "Enable Cloud Build trigger for automatic deployments"
  type        = bool
  default     = false
}

variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
  default     = "burnier"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "dbc-data-studio"
}

