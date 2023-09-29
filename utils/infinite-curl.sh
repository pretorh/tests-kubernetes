#!/usr/bin/env bash
set -e

server=http://localhost:${1?'missing port to run on'}
timeout=10

while true ; do
  curl --max-time $timeout "$server/slow?t=0.1" || sleep 1
  echo ""
done
