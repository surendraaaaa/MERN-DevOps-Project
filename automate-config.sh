#!/bin/bash

# Step 1: Run Terraform to create infrastructure
echo "Provisioning infrastructure with Terraform..."
cd terraform
terraform init
terraform apply -auto-approve

# Step 2: Get EC2 Instance IPs from Terraform Output
JENKINS_SONAR_IP=$(terraform output -raw jenkins_sonar_ip)
ARTIFACTORY_IP=$(terraform output -raw artifactory_ip)

echo "Jenkins/Sonar IP: $JENKINS_SONAR_IP"
echo "Artifactory IP: $ARTIFACTORY_IP"

# Step 3: Create an Ansible inventory dynamically
cd ../ansible  # Assuming ansible is one level up from terraform directory
cat > inventory.ini <<EOL
[jenkins_sonar]
$JENKINS_SONAR_IP ansible_user=ubuntu ansible_ssh_private_key_file=/home/ubuntu/.ssh/my_key.pem

[artifactory]
$ARTIFACTORY_IP ansible_user=ubuntu ansible_ssh_private_key_file=/home/ubuntu/.ssh/my_key.pem
EOL

# Step 4: Run Ansible playbook to configure EC2 instances
echo "Configuring EC2 instances with Ansible..."
ansible-playbook -i inventory.ini setup.yml

# pipeline {
#     agent any

#     environment {
#         AWS_PROFILE = 'my-aws-profile'
#         IMAGE_TAG = 'latest'
#         AWS_REGION = 'us-east-2'
#     }

#     stages {
#         stage('Provision Infrastructure') {
#             steps {
#                 script {
#                     // Step 1: Run Terraform to provision infrastructure
#                     sh '''
#                     terraform init
#                     terraform apply -auto-approve
#                     '''
#                 }
#             }
#         }

#         stage('Configure EC2 Instances') {
#             steps {
#                 script {
#                     // Step 2: Get IPs from Terraform output
#                     def jenkinsSonarIp = sh(script: "terraform output -raw jenkins_sonar_ip", returnStdout: true).trim()
#                     def artifactoryIp = sh(script: "terraform output -raw artifactory_ip", returnStdout: true).trim()

#                     echo "Jenkins/Sonar IP: ${jenkinsSonarIp}"
#                     echo "Artifactory IP: ${artifactoryIp}"

#                     // Step 3: Create Ansible inventory dynamically
#                     writeFile file: 'inventory.ini', text: """
#                     [jenkins_sonar]
#                     ${jenkinsSonarIp} ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/my_key.pem

#                     [artifactory]
#                     ${artifactoryIp} ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/my_key.pem
#                     """

#                     // Step 4: Run Ansible playbook to configure EC2 instances
#                     sh 'ansible-playbook -i inventory.ini setup.yml'
#                 }
#             }
#         }
#     }

#     post {
#         always {
#             echo "Pipeline complete!"
#         }
#     }
# }