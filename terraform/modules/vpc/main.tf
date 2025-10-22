# VPC
resource "aws_vpc" "my_vpc" {
  cidr_block       = var.vpc_cidr
  instance_tenancy = "default"

  tags = {
    Name = "${var.env}-vpc"
  }
}

# Subnets (Multiple AZs)
resource "aws_subnet" "my_subnet" {
  for_each = toset(var.availability_zones)

  vpc_id                  = aws_vpc.my_vpc.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, index(var.availability_zones, each.value))
  availability_zone       = each.value
  map_public_ip_on_launch = true

  tags = {
    Name                                        = "${var.env}-subnet-${each.value}"
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
    "kubernetes.io/role/elb"                    = "1" # for public subnet
    "kubernetes.io/role/internal-elb"           = "1" # also safe to include
  }
}

# Security Group
resource "aws_security_group" "my_sg" {
  name   = "${var.env}-sg"
  vpc_id = aws_vpc.my_vpc.id

  tags = {
    Name = "${var.env}-sg"
  }

  dynamic "ingress" {
    for_each = var.allowed_ports
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = [var.subnet_cidr]
      description = "Allow inbound traffic on port ${ingress.value}"
    }
  }

  ingress {
    from_port   = 30000
    to_port     = 32767
    protocol    = "tcp"
    cidr_blocks = [var.subnet_cidr]
    description = "Allow Kubernetes NodePort range"
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Change to specific IP range if needed
    description = "Allow inbound SSH traffic"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Internet Gateway
resource "aws_internet_gateway" "my_igw" {
  vpc_id = aws_vpc.my_vpc.id

  tags = {
    Name = "${var.env}-igw"
  }
}

# Route Table
resource "aws_route_table" "my_rt" {
  vpc_id = aws_vpc.my_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my_igw.id
  }

  tags = {
    Name = "${var.env}-rt"
  }
}

# Route Table Association
resource "aws_route_table_association" "subnet_rt" {
  for_each       = aws_subnet.my_subnet
  subnet_id      = each.value.id
  route_table_id = aws_route_table.my_rt.id
}
