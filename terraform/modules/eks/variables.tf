variable "env" {
  description = "Environment name"
  type        = string
}

variable "cluster_name" {
    description = "cluster name"
    type        = string
    default     = "my-MERN-eks-cluster"
}

variable "eks_version" {
    description = "EKS version"
    type        = string
    default     = "1.31"
}

variable "subnet_ids" {
    type        = list(string)
}

variable "node_name" {
    description = "Node name"
    type        = string
    default     = "my-MERN-node"
}

variable "desired_node_size" {
    description = "desired_node_size"
    type        = number
    default     = 1
}

variable "max_node_size" {
    description = "max_node_size"
    type        = number
    default     = 1
}

variable "min_node_size" {
    description = "min_node_size"
    type        = number
    default     = 1
}

variable "max_unavailable_size" {
    description = "max_unavailable_size"
    type        = number
    default     = 1
}


