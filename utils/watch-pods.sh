#!/usr/bin/env sh

name=.metadata.name
phase=status.phase
started=".status.containerStatuses[0].started"
ready=".status.containerStatuses[0].ready"
image=".spec.containers[0].image"

kubectl get pods \
  -o custom-columns="name:$name,phase:$phase,started:$started,ready:$ready,image:$image" \
  --watch
