#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/lib.sh"

install -m 0600 "$PROJECT_ROOT/deploy/remote-client/.env.example" "$GATEWAY_REPO/.env"
echo "configured: $GATEWAY_REPO/.env"

