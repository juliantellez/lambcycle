#!/usr/bin/env bash

if [ -z "${NPM_TOKEN}" ]; then
    echo "ERROR: No NPM_TOKEN detected."
    exit 1
fi

echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
