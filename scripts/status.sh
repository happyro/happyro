#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/lib.sh"

printf '%-28s %-8s %-12s %s\n' repository branch commit state
for spec in \
	"happyro-web-client|$CLIENT_REPO" \
	"happyro-web-server|$SERVER_REPO" \
	"remote-client-js|$GATEWAY_REPO"; do
	IFS='|' read -r label repo <<<"$spec"
	branch="$(git -C "$repo" branch --show-current)"
	commit="$(git -C "$repo" rev-parse --short=12 HEAD)"
	state=clean
	[[ -n "$(git -C "$repo" status --porcelain)" ]] && state=dirty
	printf '%-28s %-8s %-12s %s\n' "$label" "$branch" "$commit" "$state"
done

