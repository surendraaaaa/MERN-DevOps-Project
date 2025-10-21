#!/bin/bash

set -euo pipefail  # Exit on error, undefined variable, or failed pipe

# Update system packages
echo "Updating system packages..."
apt-get update -y && apt-get upgrade -y

# Define user and home directory
USER="ubuntu"
USER_HOME="/home/$USER"
SSH_DIR="$USER_HOME/.ssh"
AUTHORIZED_KEYS="$SSH_DIR/authorized_keys"

# Ensure .ssh directory exists with correct permissions
echo "Setting up SSH directory..."
mkdir -p "$SSH_DIR"
chmod 700 "$SSH_DIR"
chown "$USER:$USER" "$SSH_DIR"

# Add public key if not already present
echo "Configuring authorized_keys..."
if ! grep -qxF "${PUBLIC_KEY}" "$AUTHORIZED_KEYS"; then
  echo "${PUBLIC_KEY}" >> "$AUTHORIZED_KEYS"
  echo "Public key added to authorized_keys."
else
  echo "Public key already present in authorized_keys."
fi

# Set secure permissions
chmod 600 "$AUTHORIZED_KEYS"
chown "$USER:$USER" "$AUTHORIZED_KEYS"

echo "User data script completed successfully."

















# #!/bin/bash
# # Update system
# apt-get update -y
# apt-get upgrade -y

# # Ensure the ubuntu user exists (default on Ubuntu AMIs)
# USER_HOME="/home/ubuntu"

# # Make sure .ssh folder exists
# mkdir -p $USER_HOME/.ssh

# # Add your public key
# echo "${PUBLIC_KEY}" >> $USER_HOME/.ssh/authorized_keys

# # Set correct permissions
# chown -R ubuntu:ubuntu $USER_HOME/.ssh
# chmod 700 $USER_HOME/.ssh
# chmod 600 $USER_HOME/.ssh/authorized_keys
