output "eks_cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.eks_cluster_name
}

output "eks_cluster_endpoint" {
  description = "Endpoint for the EKS cluster"
  value       = module.eks.eks_cluster_endpoint
}

output "eks_cluster_ca_certificate" {
  description = "Certificate authority data for the EKS cluster"
  value       = module.eks.eks_cluster_ca_certificate
}
