#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/lib.sh"

install -m 0644 "$PROJECT_ROOT/configs/Config.happyro.js" \
	"$CLIENT_REPO/applications/pwa/Config.happyro.js"
echo "configured: $CLIENT_REPO/applications/pwa/Config.happyro.js"
