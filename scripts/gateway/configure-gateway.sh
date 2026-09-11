#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/../_lib/lib.sh"

action=""
color=true
for argument in "$@"; do
	case "$argument" in
		apply) action="apply" ;;
		--no-color) color=false ;;
		-h|--help) action="help" ;;
		*) echo "unknown option: $argument" >&2; exit 2 ;;
	esac
done

print_help() {
	happyro_cli_style "$color"
	printf '\n%sHappyRO Gateway 配置%s\n\n' "$HAPPYRO_C_TITLE" "$HAPPYRO_C_RESET"
	printf '%s用法%s\n  %s%s apply%s [--no-color]\n\n' "$HAPPYRO_C_SECTION" "$HAPPYRO_C_RESET" "$HAPPYRO_C_CMD" "$0" "$HAPPYRO_C_RESET"
	printf '%s常用例子%s\n  %s%s apply%s\n  %s%s apply --no-color%s\n\n' "$HAPPYRO_C_SECTION" "$HAPPYRO_C_RESET" "$HAPPYRO_C_EXAMPLE" "$0" "$HAPPYRO_C_RESET" "$HAPPYRO_C_EXAMPLE" "$0" "$HAPPYRO_C_RESET"
}

if [[ -z "$action" || "$action" == "help" ]]; then
	print_help
	exit 0
fi

if [[ -f "$GATEWAY_REPO/.env" ]]; then
	echo "kept existing: $GATEWAY_REPO/.env"
	exit 0
fi

install -m 0600 "$PROJECT_ROOT/deploy/remote-client/.env.example" "$GATEWAY_REPO/.env"
echo "configured: $GATEWAY_REPO/.env"
