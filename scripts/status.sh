#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/lib.sh"

printf '%-28s %-8s %-12s %s\n' repository branch commit state
for spec in \
	"happyro-client|$CLIENT_REPO" \
	"happyro-server|$SERVER_REPO" \
	"remote-client-js|$GATEWAY_REPO"; do
	IFS='|' read -r label repo <<<"$spec"
	branch="$(git -C "$repo" branch --show-current)"
	commit="$(git -C "$repo" rev-parse --short=12 HEAD)"
	state=clean
	[[ -n "$(git -C "$repo" status --porcelain)" ]] && state=dirty
	printf '%-28s %-8s %-12s %s\n' "$label" "$branch" "$commit" "$state"
done

printf '\n%-28s %s\n' runtime state
database_state="$(docker inspect --format '{{.State.Status}}/{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' happyro-mariadb 2>/dev/null || true)"
printf '%-28s %s\n' mariadb "${database_state:-stopped}"

for spec in \
	"login-server|happyro-login.service" \
	"char-server|happyro-char.service" \
	"map-server|happyro-map.service" \
	"web-server|happyro-web-api.service"; do
	IFS='|' read -r service unit <<<"$spec"
	state=stopped
	systemctl is-active --quiet "$unit" 2>/dev/null && state=running
	printf '%-28s %s\n' "$service" "$state"
done
