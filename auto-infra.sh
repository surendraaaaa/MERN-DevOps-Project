#!/bin/bash
set -e

# Terraform
cd terraform
terraform init
terraform plan -out=tfplan
terraform apply -auto-approve tfplan

# Extract outputs
terraform output -json > tf_outputs.json

EKS_CLUSTER_NAME=$(jq -r '.eks_cluster_name.value' tf_outputs.json)
JENKINS_SONAR_IP=$(jq -r '.jenkins_sonar_ip.value' tf_outputs.json)
ARTIFACTORY_IP=$(jq -r '.artifactory_ip.value' tf_outputs.json)

echo "EKS_CLUSTER_NAME=$EKS_CLUSTER_NAME"
echo "JENKINS_SONAR_IP=$JENKINS_SONAR_IP"
echo "ARTIFACTORY_IP=$ARTIFACTORY_IP"

# Replace placeholders in inventory
sed -i "s/{{ eks_cluster_name }}/$EKS_CLUSTER_NAME/g" ./ansible/inventories/production.ini
sed -i "s/{{ jenkins_sonar_ip }}/$JENKINS_SONAR_IP/g" ./ansible/inventories/production.ini
sed -i "s/{{ artifactory_ip }}/$ARTIFACTORY_IP/g" ./ansible/inventories/production.ini

# Run Ansible
cd ../ansible
ansible-playbook -i ./ansible/inventories/production.ini ./ansible/playbooks/setup.yml
