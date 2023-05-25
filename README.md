# Kubernetes tests

Kubernetes scripts to test/play around with different setups

## server

basic setup:

`server/build-docker.sh` to build and push docker images used in scripts

## deployments

create the basic deployment: `kubectl apply -f k8s-service.yml`

## tests

separate tests/scenarios are in sub directories, with the own READMEs and setup scripts
