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

output "jenkins_sonar_ip" {
  value = module.ec2.public_ips[0]
}

output "artifactory_ip" {
  value = module.ec2.public_ips[1]
}


