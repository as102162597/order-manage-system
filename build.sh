#!/bin/bash
DOCKER_PACKAGE_JSON="package.json"
DOCKER_IMAGE=$(grep '"name"' $DOCKER_PACKAGE_JSON | awk -F ': ' '{print $2}' | tr -d '",')
DOCKER_VERSION=$(grep '"version"' $DOCKER_PACKAGE_JSON | awk -F ': ' '{print $2}' | tr -d '",')

docker build -t $DOCKER_IMAGE:$DOCKER_VERSION .
