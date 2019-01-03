#!/usr/bin/env bash

CURRENT_BRANCH=$1 # git rev-parse --abbrev-ref HEAD
COMMIT_MESSAGE=$2 # git log --oneline --format=%B -n 1 HEAD | head -n 1

if [ "$CURRENT_BRANCH" != "master" ] ; then
    echo "LOG: skipping npm publish for branch: ${CURRENT_BRANCH}"
    exit 0
fi

# SEMVER
SEMVER=$(echo ${COMMIT_MESSAGE} | awk 'match(tolower($0),/(minor|major)/) {print substr(tolower($0),RSTART,RLENGTH)}')

if [ $SEMVER ]; then
    RELEASE_VERSION=$SEMVER; else
    RELEASE_VERSION=patch
fi

# VERSION
echo "LOG: Npm Release : ${RELEASE_VERSION}"
npm version $RELEASE_VERSION -m "[ci skip] Update package to v%s"

git push origin master --no-verify
git push origin --tags --no-verify

# PUBLISH
npm publish
