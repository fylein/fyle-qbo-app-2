#!/bin/bash

# Getting the old tag from GitHub
old_tag=$(git describe --tags $(git rev-list --tags --max-count=1));

# Splitting the string into an array
IFS='.' read -ra versions <<< "$old_tag";

# Bumping up the minor version
minor_version=$((${versions[1]} + 1));

# Generating a new tag and setting it in the env
export NEW_TAG="${versions[0]}.${minor_version}.0";

# Generate Docker Version
IFS='-' read -ra docker_tag_string <<< "$NEW_TAG";
export DOCKER_VERSION=${docker_tag_string[${#docker_tag_string[@]} - 1]};

# Print out new Docker Version
echo "Docker version: $DOCKER_VERSION";

# Print out new tag
echo "New tag: $NEW_TAG";

# build docker image
# docker build -t $DOCKERHUB_USERNAME/fyle_qbo-app-2:$DOCKER_VERSION .;

# push the new tag to GitHub
git pull;
git remote set-url origin https://$GITHUB_USERNAME:$GITHUB_PASSWORD@github.com/fylein/fyle-qbo-app-2.git
git tag -a $NEW_TAG -m "New tag for qbo-app-2 $NEW_TAG";
git push origin $NEW_TAG;

echo "Pushing Docker Image to Docker Hub";

# docker push $DOCKERHUB_USERNAME/fyle_qbo-app-2:$DOCKER_VERSION;

# Replacing stuff in Yaml File for Staging deployment
# sed -i "s?{{RELEASE_VERSION}}?${DOCKER_VERSION}?" staging-deploy.yml
# sed -i "s?{{DOCKERHUB_USERNAME}}?${DOCKERHUB_USERNAME}?" staging-deploy.yml
