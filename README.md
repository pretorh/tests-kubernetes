# Kubernetes tests

Kubernetes scripts to test/play around with different setups

## Setup

### docker images with node/exress server

Use `server/build-docker.sh` to build and push (need to change names) docker images used in scripts.

All "versions" use the same code, but with different environment variables in the docker image to simulate changes

### running in minikube

start:
```
minikube start
minikube dashboard
```

stop:
```
minikube stop
```

### base deployment and services

Create the basic deployment: `kubectl apply -f k8s-basic.yml`

Expose service in minikube: `minikube service express-server --url`

## examples/tests

Separate tests/scenarios are in sub directories, with their own READMEs and setup scripts
