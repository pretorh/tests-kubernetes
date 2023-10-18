# init containers

## setup

Create the basic deployment and service (`kubectl apply -f ../k8s-basic.yml`)

Drop the service: `kubectl delete services express-server`

## init containers must finish

Create a basic pod: `kubectl apply -f curl.yml`

Watch the pod status in a separate terminal: `kubectl get -f curl.yml --watch`

### basic sleep

The pod's first `initContainers` waits for 30 seconds. The pod's status will cahnge from `Init:0/3` to `Init:1/3`

### waiting for a service

The 2nd `initContainers` waits for the `express-server` service to start (which will block)

Running `kubectl logs simple-curl -c wait-for-service --follow` shows that it fails to load the `express-server` service:

```
waiting for express-server
nslookup: can't resolve 'express-server.default.svc.cluster.local'
nslookup: can't resolve 'express-server.default.svc.cluster.local'
Server:    10.96.0.10
Address 1: 10.96.0.10 kube-dns.kube-system.svc.cluster.local

waiting for express-server
...
```

Create the service (`kubectl apply -f ../k8s-basic.yml`) and wait for the init container to find the service

### fetching data from a service

The 3rd `initContainers` runs a `curl` command to the express server

Get the logs: `kubectl logs simple-curl -c fetch-data --follow`:

```
fetch https://dl-cdn.alpinelinux.org/alpine/v3.18/main/x86_64/APKINDEX.tar.gz
fetch https://dl-cdn.alpinelinux.org/alpine/v3.18/community/x86_64/APKINDEX.tar.gz
(1/7) Installing ca-certificates (20230506-r0)
(2/7) Installing brotli-libs (1.0.9-r14)
(3/7) Installing libunistring (1.1-r1)
(4/7) Installing libidn2 (2.3.4-r1)
(5/7) Installing nghttp2-libs (1.57.0-r0)
(6/7) Installing libcurl (8.4.0-r0)
(7/7) Installing curl (8.4.0-r0)
Executing busybox-1.36.1-r2.trigger
Executing ca-certificates-20230506-r0.trigger
OK: 12 MiB in 22 packages
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   107  100   107    0     0      3      0  0:00:35  0:00:30  0:00:05    27
```

### pod is running

The pod's status is now `Running`. Get the logs of the main container: `kubectl logs simple-curl`.
This shows the downloaded file from `fetch-data`:

```
...
The app is running!
  File: /opt/express-server.json
  Size: 107             Blocks: 8          IO Block: 4096   regular file
Device: fe01h/65025d    Inode: 3282785     Links: 1
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
Access: 2023-10-18 15:49:38.000000000
Modify: 2023-10-18 15:50:08.000000000
Change: 2023-10-18 15:50:08.000000000

{"host":"express-server-78d5d74d6c-2qslh","message":"slow (30000 delay)","date":"2023-10-18T15:50:08.132Z"}
```

### pod crashes every 2 minutes

The main container sleeps for 2 minutes before it's command finishes (status `Completed`), causing the
container to crash. It is restarted, but only the main container runs on subsequent starts.

## cleanup

remove the pod: `kubectl delete pod simple-curl`
