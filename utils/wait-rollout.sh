#!/usr/bin/env sh
set -e

kubectl rollout status deployment/express-server
