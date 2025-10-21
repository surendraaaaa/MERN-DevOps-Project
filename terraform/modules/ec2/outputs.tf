output "instance_ids" {
  value = [for instance in aws_instance.my_instance : instance.id]
}

output "public_ips" {
  value = [for instance in aws_instance.my_instance : instance.public_ip]
}
