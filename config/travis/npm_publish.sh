#!/usr/bin/env bash

##
# See https://docs.travis-ci.com/user/environment-variables/#default-environment-variables
#
# - Checks current branch is master
# - Creates semver based on commit message
# - npm version
# - updates repo
# - npm publish
##

echo "TRAVIS_COMMIT_MESSAGE: $TRAVIS_COMMIT_MESSAGE"
echo "TRAVIS_PULL_REQUEST_BRANCH: $TRAVIS_PULL_REQUEST_BRANCH"
echo "TRAVIS_BRANCH: $TRAVIS_BRANCH"

GIT_COMMIT_MESSAGE=$(git log --oneline --format=%B -n 1 HEAD | head -n 1)
echo "GIT_COMMIT_MESSAGE: $GIT_COMMIT_MESSAGE"

COMMIT_MESSAGE=$($TRAVIS_COMMIT_MESSAGE | head -n 1)
CURRENT_BRANCH=$TRAVIS_PULL_REQUEST_BRANCH

# CHECK CURRENT BRANCH
if [ -z "$CURRENT_BRANCH" ]
then
  CURRENT_BRANCH=$TRAVIS_BRANCH
fi

echo "CURRENT_BRANCH: $CURRENT_BRANCH"
echo "COMMIT_MESSAGE: $COMMIT_MESSAGE"

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
