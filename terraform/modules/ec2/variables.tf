variable "env" {
  type        = string
  description = "Environment name (e.g., dev, prod)"
}

variable "ami_id" {
  type        = string
  description = "AMI ID to use for EC2 instance"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
}

variable "key_name" {
  type        = string
  description = "Name for the EC2 key pair"
  default     = "aws-mern-key"
}

variable "public_key_path" {
  type        = string
  description = "Path to the public key file"
  default     = "my_key.pub"
}

variable "subnet_ids" {
  type        = list(string)
  description = "List of subnet IDs to deploy EC2 instances into"
}

variable "security_group_id" {
  type        = string
  description = "Security group ID to attach to the EC2 instances"
}

variable "instance_name" {
  type        = string
  description = "Base name for EC2 instances"
  default     = "mern-instance"
}

variable "instance_count" {
  type        = number
  default     = 3
}
