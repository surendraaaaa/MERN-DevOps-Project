output "eks_cluster_role_arn" {
  value = aws_iam_role.eks_cluster_role.arn
}

output "eks_node_role_arn" {
  value = aws_iam_role.eks_node_role.arn
}

output "eks_cluster_name" {
  value = aws_eks_cluster.my_eks.name
}

output "eks_cluster_endpoint" {
  value = aws_eks_cluster.my_eks.endpoint
}

output "eks_cluster_ca_certificate" {
  value = aws_eks_cluster.my_eks.certificate_authority[0].data
}