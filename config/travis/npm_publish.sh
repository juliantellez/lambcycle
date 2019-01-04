#!/usr/bin/env bash

##
# See https://docs.travis-ci.com/user/environment-variables/#default-environment-variables
#
# Steps:
# - Check current branch is master
# - Create semver based on commit message
# - Npm version
# - Npm publish
##

set -eo pipefail

GIT_COMMIT_MESSAGE=$(git log --oneline --format=%B -n 1 HEAD | head -n 1)

COMMIT_MESSAGE=$GIT_COMMIT_MESSAGE
CURRENT_BRANCH=$TRAVIS_PULL_REQUEST_BRANCH

# CHECK CURRENT BRANCH
if [ -z "$CURRENT_BRANCH" ]
then
  CURRENT_BRANCH=$TRAVIS_BRANCH
fi

echo "[ LOG ] CURRENT_BRANCH: $CURRENT_BRANCH"
echo "[ LOG ] COMMIT_MESSAGE: $COMMIT_MESSAGE"

# if [ "$CURRENT_BRANCH" != "master" ] ; then
#     echo "[ LOG ] skipping npm publish for branch: ${CURRENT_BRANCH}"
#     exit 0
# fi

# SEMVER
SEMVER=$(echo ${COMMIT_MESSAGE} | awk 'match(tolower($0),/(minor|major)/) {print substr(tolower($0),RSTART,RLENGTH)}')

if [ $SEMVER ]; then
    RELEASE_VERSION=$SEMVER; else
    RELEASE_VERSION=patch
fi

# VERSION
echo "[ LOG ] Npm Release : ${RELEASE_VERSION}"
npm version $RELEASE_VERSION -m "[ci skip] Update package to v%s"

echo "[ LOG] parse HEAD:"
git rev-parse --abbrev-ref HEAD
echo "[ LOG] commit message:"
git log --oneline --format=%B -n 1 HEAD | head -n 1

UPDATE_NPM_BRANCH=task/update_npm_version_$(git log --pretty=format:'%h' -n 1)
echo "[ LOG ] CHECKOUT ${UPDATE_NPM_BRANCH}:"
git checkout -b $UPDATE_NPM_BRANCH

echo "[ LOG ] git PUSH:"
git push origin $UPDATE_NPM_BRANCH

# git push origin --tags --no-verify

# PUBLISH
# npm publish
