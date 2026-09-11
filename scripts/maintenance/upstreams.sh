#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/../_lib/lib.sh"

color=true
action=""
for argument in "$@"; do
	case "$argument" in
		fetch|status) action="$argument" ;;
		--no-color) color=false ;;
		-h|--help) action="help" ;;
		*) echo "unknown option: $argument" >&2; exit 2 ;;
	esac
done

print_help() {
	happyro_cli_style "$color"
	printf '\n%sHappyRO 上游同步%s\n\n' "$HAPPYRO_C_TITLE" "$HAPPYRO_C_RESET"
	printf '%s用法%s\n  %s%s fetch|status%s [--no-color]\n\n' "$HAPPYRO_C_SECTION" "$HAPPYRO_C_RESET" "$HAPPYRO_C_CMD" "$0" "$HAPPYRO_C_RESET"
	printf '%s常用例子%s\n  %s%s status%s\n  %s%s fetch --no-color%s\n\n' "$HAPPYRO_C_SECTION" "$HAPPYRO_C_RESET" "$HAPPYRO_C_EXAMPLE" "$0" "$HAPPYRO_C_RESET" "$HAPPYRO_C_EXAMPLE" "$0" "$HAPPYRO_C_RESET"
}

if [[ -z "$action" || "$action" == "help" ]]; then
	print_help
	exit 0
fi

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
		"happyro-gateway|$GATEWAY_REPO|$REMOTE_CLIENT_JS_BRANCH"; do
		IFS='|' read -r label repo branch <<<"$spec"
		if git -C "$repo" rev-parse --verify --quiet "upstream/$branch" >/dev/null; then
			read -r ahead behind < <(git -C "$repo" rev-list --left-right --count "HEAD...upstream/$branch")
		else
			ahead="?"; behind="?"
		fi
		printf '%-28s %-8s %-8s upstream/%s\n' "$label" "$ahead" "$behind" "$branch"
	done
}

case "$action" in
	fetch)
		fetch_upstreams
		;;
	status)
		show_status
		;;
	*)
		print_help
		exit 1
		;;
esac
