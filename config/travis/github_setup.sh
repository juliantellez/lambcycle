#!/usr/bin/env bash

if [ -z "${GITHUB_SSH_KEY}" ]; then
    echo "ERROR: No GITHUB_SSH_KEY file detected."
    exit 1
fi

# GitHub access
mkdir -p ~/.ssh/
echo "$GITHUB_SSH_KEY" > ~/.ssh/id_rsa

chmod 0600  ~/.ssh/id_rsa

# Accept github domain
touch ~/.ssh/known_hosts
ssh-keyscan github.com >> ~/.ssh/known_hosts

# Global configuration
git config --global url.ssh://git@github.com/.insteadOf https://github.com/

git config --global push.default simple
git config --global user.email "bot@dlabmcycle.com"
git config --global user.name "[ LAMBCYCLE BOT ]"
