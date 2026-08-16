#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/lib.sh"

cd "$CLIENT_REPO"
[[ -d node_modules ]] || npm install
npm test
npm run build:pwa

