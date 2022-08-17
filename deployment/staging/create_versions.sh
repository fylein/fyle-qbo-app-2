#!/bin/bash

# Get old docker tag
export OLD_TAG="v$(git rev-parse --short @~)";

# Pull last docker image
docker pull  $DOCKERHUB_USERNAME/fyle_qbo-app-2:$OLD_TAG || true;

# Generating a new tag and setting it in the env, this will set latest commit hash as the tag
export NEW_TAG="v$(git rev-parse --short HEAD)";

# Print out new tag
echo "New tag: $NEW_TAG";

# build docker image
echo "Building Docker Image";

DOCKER_BUILDKIT=1 docker build --build-arg BUILDKIT_INLINE_CACHE=1 --tag $DOCKERHUB_USERNAME/fyle_qbo-app-2:$NEW_TAG --cache-from $DOCKERHUB_USERNAME/fyle_qbo-app-2:$OLD_TAG .;

# push docker image to docker hub
echo "Pushing Docker Image to Docker Hub";

docker push $DOCKERHUB_USERNAME/fyle_qbo-app-2:$NEW_TAG;

# Replacing stuff in Yaml File for Staging deployment
sed -i "s?{{RELEASE_VERSION}}?${NEW_TAG}?" deployment/staging/controller.yml
sed -i "s?{{DOCKERHUB_USERNAME}}?${DOCKERHUB_USERNAME}?" deployment/staging/controller.yml
