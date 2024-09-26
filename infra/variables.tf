variable "project_id" {
  description = "The ID of the project in which to create the Cloud Run service."
  type        = string
}

variable "region" {
  description = "The region in which to deploy the Cloud Run service."
  type        = string
  default     = "us-central1"
}

variable "service_name" {
  description = "The name of the Cloud Run service."
  type        = string
}

variable "image_url" {
  description = "The URL of the Docker image to deploy."
  type        = string
}

variable "memory_limit" {
  description = "The amount of memory to allocate to the Cloud Run service."
  type        = string
  default     = "512Mi"
}
