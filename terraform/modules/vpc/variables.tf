variable "env" {
  type        = string
  description = "Environment name prefix (e.g., dev, prod)"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  type        = list(string)
  description = "List of availability zones for subnet creation"
  default     = ["us-east-2a", "us-east-2b"]
}

variable "subnet_cidr" {
  type        = string
  description = "CIDR block for the security group ingress rule"
  default     = "10.0.0.0/16"
}

variable "allowed_ports" {
  type        = list(number)
  description = "List of allowed ingress ports"
  default     = [22, 80, 443, 6443, 3000, 5000]
}

variable "cluster_name" {
  description = "cluster name"
  type        = string
  default     = "my-MERN-eks-cluster"
}
