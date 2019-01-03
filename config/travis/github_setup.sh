#!/usr/bin/env bash

if [ ! -f ~/.ssh/id_rsa ]; then
    echo "ERROR: No ID_RSA file detected."
    exit 1
fi

chmod 0600  ~/.ssh/id_rsa

# Accept github domain
touch ~/.ssh/known_hosts
ssh-keyscan github.com >> ~/.ssh/known_hosts

# Global configuration
git config --global url.ssh://git@github.com/.insteadOf https://github.com/

git config --global push.default simple
git config --global user.email "bot.travis@lambcycle.org"
git config --global user.name "[ TRAVIS-BOT ]"
