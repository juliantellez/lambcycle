#!/usr/bin/env bash

GITHUB_TOKEN=$1

if [ -z "${GITHUB_TOKEN}" ]; then
    echo "ERROR: No GITHUB_TOKEN detected."
    exit 1
fi

git config --global url.https://${GITHUB_TOKEN}@github.com/.insteadOf ssh://git@github.com/
git config --global push.default simple
git config --global user.email "bot@dlabmcycle.org"
git config --global user.name "[ LAMBCYCLE BOT ]"

echo "LOG: git config has been setup"
