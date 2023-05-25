# rolling updates

create the basic deployment and service (`kubectl apply -f ../k8s-basic.yml`)

use `../utils/infinite-curl.sh <port>` to hit the service

## initial update

```
sed 's|:first|:second|' ../k8s-basic.yml | kubectl apply -f -
kubectl get pods
```

a new pod is started while the previous is running, and the old one terminates afterwards
but some of the requests fail

## invalid image

```
sed 's|:first|:invalid-image-tag|' ../k8s-basic.yml | kubectl apply -f -
kubectl get pods
```

the old pod keeps on running

reset to the initial version: `kubectl apply -f ../k8s-basic.yml`

## no rolling updates

### set up

set the rolling updates strategy to allow 1 unavailable, and 1 surge:

```
cat ../k8s-basic.yml no-rolling-updates.yml | kubectl apply -f -
```

### update once

```
sed 's|:first|:second|' ../k8s-basic.yml | kubectl apply -f -
kubectl get pods
```

service goes down while the new pod is created
