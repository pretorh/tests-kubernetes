#!/usr/bin/env sh
set -e
cd "$(dirname "$0")"

docker build --target first -t "$ROOT"pretorh/testk8s:first .
docker build --target second -t "$ROOT"pretorh/testk8s:second .
docker build --target third -t "$ROOT"pretorh/testk8s:third .

docker push "$ROOT"pretorh/testk8s:first
docker push "$ROOT"pretorh/testk8s:second
docker push "$ROOT"pretorh/testk8s:third
