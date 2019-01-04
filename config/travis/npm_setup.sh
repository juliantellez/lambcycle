#!/usr/bin/env bash

set -eo pipefail

NPM_TOKEN=$1

if [ -z "${NPM_TOKEN}" ]; then
    echo "[ ERROR ] No NPM_TOKEN detected."
    exit 1
fi

echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc

echo "[ LOG ] npm config has been setup"
