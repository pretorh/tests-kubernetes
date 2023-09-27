# rolling updates

Create the basic deployment and service (`kubectl apply -f ../k8s-basic.yml`)

Use `../utils/infinite-curl.sh <port>` to hit the service

## initial update

```
kubectl patch deployment express-server --patch-file ../k8s/images/v2.patch.yml
kubectl get pods
```

A new pod is started while the previous is running, and the old one terminates afterwards.

States:
- `Running` + `ContainerCreating`
- `Terminating` + `Running`. But because of the delay in the new pod, the server is not yet ready and requests fail
- `Running`

Some of the requests fail

## invalid image

```
kubectl patch deployment express-server --patch-file ../k8s/images/invalid-tag.patch.yml
kubectl get pods
```

The old pod keeps on running, new pods fail with `ErrImagePull`

States:
- `Running` + `ContainerCreating`
- `Running` + `ErrImagePull`/`ImagePullBackOff`

## Reset to the 2nd image

```
kubectl patch deployment express-server --patch-file ../k8s/images/v2.patch.yml
```

States:
- `Running` + `Terminating`
- `Running`

## no rolling updates

### set up

Set the rolling updates strategy to allow 1 unavailable, and 1 surge:

```
kubectl patch deployment express-server --patch-file k8s-no-rolling-updates.patch.yml
```

### update once

```
kubectl patch deployment express-server --patch-file ../k8s/images/v3.patch.yml
kubectl get pods
```

Service goes down while the new pod is created

States:
- `Terminating` + `ContainerCreating`: requests fail
- `ContainerCreating`: requests fail
- `Running`, but requests fail (startup delay in new pod)
- `Running`

## maxUnavailable

Set the rolling updates strategy to allow 0 unavailable and 1 surge

```
kubectl patch deployment express-server --patch-file k8s-rolling-updates.patch.yml
kubectl patch deployment express-server --patch-file ../k8s/images/v2.patch.yml
kubectl get pods
```

States:
- `Running` + `ContainerCreating`: requests still work
- `Terminating` + `Running`: requests fail
- `Running`: requests work

## maxUnavailable + readiness probe

Add a readiness probe that waits for the pod to serve requests

```
kubectl patch deployment express-server --patch-file k8s-readiness.yml
kubectl get pods
# wait for new pod to start (old keeps serving)
kubectl patch deployment express-server --patch-file ../k8s/images/v3.patch.yml
kubectl get pods
```

States:
- `Running` + `ContainerCreating`: requests still work
- `Running` + `Running`: requests still work (on the old pod)
- `Terminating` + `Running`: requests work (updated pod)
