#!/bin/sh

# exit on failure
set -e

read -p "Enter the image tag (e.g. if the current latest tag is 1.1.0, use 1.2.0): " IMAGE_TAG

if [ -z "$IMAGE_TAG" ]; then
  echo "Image tag is required, exiting."
  exit 1
fi

echo "You entered: $IMAGE_TAG"

docker login
docker build --build-arg="CONFIGURATION=development" -t upcintua/jaqpot-frontend-dev:"${IMAGE_TAG}" .
docker push upcintua/jaqpot-frontend-dev:"${IMAGE_TAG}"
