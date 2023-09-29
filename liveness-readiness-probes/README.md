# Liveness, readiness probes

Create the basic deployment and service (`kubectl apply -f ../k8s-basic.yml`)

set the `PORT` env for tests below

Use `../utils/infinite-curl.sh <port>` to hit the service

Use `../utils/watch-pods.sh` to watch for pod statuses (instead of `kubectl get pods` below)

## crash the server

```sh
curl -X POST "http://localhost:$PORT/crash"
kubectl events deployments testk8s
```

- `Running`, `started=true`: responses returned
- `Running`, `started=false`: no responses
- `Running`, `started=true`: responses returned

Same pod is used when starting again.

## Stop responses

```sh
curl -X POST "http://localhost:$PORT/stop"
```

No changes in state, but the responses timeout.

crash the server to recover: `curl -X POST "http://localhost:$PORT/crash?t=0"`
