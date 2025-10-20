resource "aws_key_pair" "my_key" {
  key_name   = var.key_name
  public_key = file(var.public_key_path)
}

resource "aws_instance" "my_instance" {
  count         = var.instance_count 
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = aws_key_pair.my_key.key_name
  subnet_id     = element(var.subnet_ids, count.index)
  vpc_security_group_ids = [var.security_group_id]
  associate_public_ip_address = true

  user_data = templatefile("${path.module}/ec2_userdata.sh", {
    PUBLIC_KEY = file(var.public_key_path)
  })

  tags = {
    Name = "${var.instance_name}-${var.env}-${count.index}"
  }
}
