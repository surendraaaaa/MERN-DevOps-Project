#!/bin/bash
# Update system
apt-get update -y
apt-get upgrade -y

# Ensure the ubuntu user exists (default on Ubuntu AMIs)
USER_HOME="/home/ubuntu"

# Make sure .ssh folder exists
mkdir -p $USER_HOME/.ssh

# Add your public key
echo "${PUBLIC_KEY}" >> $USER_HOME/.ssh/authorized_keys

# Set correct permissions
chown -R ubuntu:ubuntu $USER_HOME/.ssh
chmod 700 $USER_HOME/.ssh
chmod 600 $USER_HOME/.ssh/authorized_keys
