#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/lib.sh"

usage() {
	echo "usage: $0 fetch|status" >&2
	exit 2
}

fetch_upstreams() {
	git -C "$CLIENT_REPO" fetch --prune upstream "$ROBROWSERLEGACY_BRANCH"
	git -C "$SERVER_REPO" fetch --prune upstream "$RATHENA_BRANCH"
	git -C "$GATEWAY_REPO" fetch --prune upstream "$REMOTE_CLIENT_JS_BRANCH"
}

show_status() {
	printf '%-28s %-8s %-8s %s\n' repository ahead behind upstream
	for spec in \
		"happyro-client|$CLIENT_REPO|$ROBROWSERLEGACY_BRANCH" \
		"happyro-server|$SERVER_REPO|$RATHENA_BRANCH" \
		"remote-client-js|$GATEWAY_REPO|$REMOTE_CLIENT_JS_BRANCH"; do
		IFS='|' read -r label repo branch <<<"$spec"
		read -r ahead behind < <(git -C "$repo" rev-list --left-right --count "HEAD...upstream/$branch")
		printf '%-28s %-8s %-8s upstream/%s\n' "$label" "$ahead" "$behind" "$branch"
	done
}

case "${1:-}" in
	fetch)
		fetch_upstreams
		;;
	status)
		fetch_upstreams
		show_status
		;;
	*)
		usage
		;;
esac
