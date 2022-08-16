#!/bin/bash

# Generating a new tag and setting it in the env
export NEW_TAG="v$(git rev-parse --short HEAD)";

# Print out new tag
echo "New tag: $NEW_TAG";

# build docker image
docker build -t $DOCKERHUB_USERNAME/fyle_qbo-app-2:$NEW_TAG .;

echo "Pushing Docker Image to Docker Hub";

docker push $DOCKERHUB_USERNAME/fyle_qbo-app-2:$NEW_TAG;

# Replacing stuff in Yaml File for Staging deployment
sed -i "s?{{RELEASE_VERSION}}?${NEW_TAG}?" staging-deploy.yml
sed -i "s?{{DOCKERHUB_USERNAME}}?${DOCKERHUB_USERNAME}?" staging-deploy.yml
