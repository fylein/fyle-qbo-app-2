#!/bin/bash

# Generating a new tag and setting it in the env, this will set latest commit hash as the tag
export NEW_TAG="v$(git rev-parse --short HEAD)";

# Print out new tag
echo "New tag: $NEW_TAG";

# build docker image
echo "Building Docker Image";

docker build -t $DOCKERHUB_USERNAME/fyle_qbo-app-2:$NEW_TAG .;

# push docker image to docker hub
echo "Pushing Docker Image to Docker Hub";

docker push $DOCKERHUB_USERNAME/fyle_qbo-app-2:$NEW_TAG;

# Replacing stuff in Yaml File for Staging deployment
sed -i "s?{{RELEASE_VERSION}}?${NEW_TAG}?" deployment/staging/controller.yml
sed -i "s?{{DOCKERHUB_USERNAME}}?${DOCKERHUB_USERNAME}?" deployment/staging/controller.yml
