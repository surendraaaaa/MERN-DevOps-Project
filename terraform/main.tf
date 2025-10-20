module "vpc" {
  source = "./modules/vpc"

  env                = "dev"
  vpc_cidr           = "10.0.0.0/16"
  availability_zones = ["us-east-2a", "us-east-2b"]
  subnet_cidr        = "10.0.0.0/24"
  allowed_ports      = [22, 80, 443, 6443, 3000, 5000]
}

module "ec2" {
  source = "./modules/ec2"

  env               = "dev"
  ami_id            = "ami-0cfde0ea8edd312d4"
  instance_type     = "t3.micro"
  key_name          = "my-MERN-key"
  public_key_path   = "./modules/ec2/my_key.pub"
  subnet_ids        = module.vpc.subnet_ids
  security_group_id = module.vpc.security_group_id
  instance_name     = "MERN-instance"
}

module "eks" {
  source               = "./modules/eks"
  env                  = "dev"
  cluster_name         = "my-MERN-EKS-cluster"
  eks_version          = "1.31"
  subnet_ids           = module.vpc.subnet_ids
  node_name            = "my-MERN-node"
  desired_node_size    = 1
  max_node_size        = 2
  min_node_size        = 1
  max_unavailable_size = 1

  depends_on = [
    module.vpc,
    module.ec2,
  ]

}


