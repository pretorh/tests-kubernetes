#!/usr/bin/env bash
set -e

server=http://localhost:${1?'missing port to run on'}

while true ; do
  curl "$server/slow?t=0.1" || sleep 1
  echo ""
done
