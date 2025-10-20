terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.17.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.38.0"
    }
  }

  cloud {
    organization = "my-remote-backend" # Replace with your actual org

    workspaces {
      name = "dev" # Replace with your actual workspace name
    }
  }
}
