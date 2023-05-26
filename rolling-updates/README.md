# rolling updates

Create the basic deployment and service (`kubectl apply -f ../k8s-basic.yml`)

Use `../utils/infinite-curl.sh <port>` to hit the service

## initial update

```
sed 's|:first|:second|' ../k8s-basic.yml | kubectl apply -f -
kubectl get pods
```

A new pod is started while the previous is running, and the old one terminates afterwards.

But because of the delay in the new pod, it is `Running`, but the server is not yet ready.

Some of the requests fail

## invalid image

```
sed 's|:first|:invalid-image-tag|' ../k8s-basic.yml | kubectl apply -f -
kubectl get pods
```

The old pod keeps on running, new pods fail with `ErrImagePull`

Reset to the initial version: `kubectl apply -f ../k8s-basic.yml`

## no rolling updates

### set up

Set the rolling updates strategy to allow 1 unavailable, and 1 surge:

```
cat ../k8s-basic.yml no-rolling-updates.yml | kubectl apply -f -
```

### update once

```
sed 's|:first|:second|' ../k8s-basic.yml | kubectl apply -f -
kubectl get pods
```

Service goes down while the new pod is created
