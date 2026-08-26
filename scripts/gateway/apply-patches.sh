#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/../_lib/lib.sh"

color=true
command_name=

for arg in "$@"; do
	case "$arg" in
		apply)
			[[ -z "$command_name" ]] || { echo "only one command may be specified" >&2; exit 2; }
			command_name="$arg"
			;;
		--no-color) color=false ;;
		-h|--help) command_name=help ;;
		*) echo "unknown argument: $arg" >&2; exit 2 ;;
	esac
done

style() {
	local code="$1"
	shift
	if $color; then printf '\033[%sm%s\033[0m' "$code" "$*"; else printf '%s' "$*"; fi
}

usage() {
	printf '\n'
	style '1;36' 'HappyRO RemoteClient-JS patches'
	printf '\n\n'
	style '1;33' 'Usage'
	printf '\n  %s %s [%s]\n\n' "$0" "$(style '1;32' 'apply')" '--no-color'
	style '1;33' 'Commands'
	printf '\n  '
	style '1;32' 'apply'
	printf '  Apply every root-owned patch to the vendor checkout.\n\n'
	style '1;33' 'Examples'
	printf '\n  '
	style '36' "$0 apply"
	printf '\n  '
	style '36' "$0 apply --no-color"
	printf '\n\n'
}

[[ -n "$command_name" ]] || { usage; exit 0; }
[[ "$command_name" != help ]] || { usage; exit 0; }

check_upstream_base RemoteClient-JS "$GATEWAY_REPO" "$REMOTE_CLIENT_JS_UPSTREAM_COMMIT"

patches=("$PROJECT_ROOT"/patches/remote-client-js/*.patch)
[[ -e "${patches[0]}" ]] || { echo "no RemoteClient-JS patches found" >&2; exit 1; }

for patch_file in "${patches[@]}"; do
	patch_name="$(basename "$patch_file")"
	if git -C "$GATEWAY_REPO" apply --check --reverse "$patch_file"; then
		echo "already applied: $patch_name"
	elif git -C "$GATEWAY_REPO" apply --check "$patch_file"; then
		git -C "$GATEWAY_REPO" apply "$patch_file"
		echo "applied: $patch_name"
	else
		echo "patch conflicts with vendor checkout: $patch_name" >&2
		exit 1
	fi
done
