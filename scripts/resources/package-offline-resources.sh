#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/../_lib/lib.sh"

action=""
output=""
color=true
while (($#)); do
	case "$1" in
		create) action="create" ;;
		--output)
			shift
			output="${1:-}"
			;;
		--no-color) color=false ;;
		-h|--help) action="help" ;;
		*) printf 'unknown option: %s\n' "$1" >&2; exit 2 ;;
	esac
	shift
done

print_help() {
	happyro_cli_style "$color"
	printf '\n%sHappyRO 跨机器资源归档%s\n\n' "$HAPPYRO_C_TITLE" "$HAPPYRO_C_RESET"
	printf '%s用法%s\n  %s%s create%s --output PATH.tar.gz [--no-color]\n\n' "$HAPPYRO_C_SECTION" "$HAPPYRO_C_RESET" "$HAPPYRO_C_CMD" "$0" "$HAPPYRO_C_RESET"
	printf '%s常用例子%s\n  %s%s create --output artifacts/happyro-resources-20260924.tar.gz%s\n\n' "$HAPPYRO_C_SECTION" "$HAPPYRO_C_RESET" "$HAPPYRO_C_EXAMPLE" "$0" "$HAPPYRO_C_RESET"
}

if [[ -z "$action" || "$action" == "help" ]]; then
	print_help
	exit 0
fi

[[ -n "$output" && "$output" == *.tar.gz ]] || {
	echo 'create requires --output PATH.tar.gz' >&2
	exit 2
}

sources=(
	inputs/runtime/kro-20211105/client
	work/game-data/items/kro-20211105
	work/game-data/monsters/kro-20211105
)
for source in "${sources[@]}"; do
	[[ -d "$PROJECT_ROOT/$source" ]] || {
		printf 'missing resource directory: %s\n' "$PROJECT_ROOT/$source" >&2
		exit 1
	}
done

if [[ "$output" != /* ]]; then
	output="$PROJECT_ROOT/$output"
fi
[[ ! -e "$output" && ! -L "$output" ]] || {
	printf 'output already exists: %s\n' "$output" >&2
	exit 1
}
checksum="$output.sha256"
[[ ! -e "$checksum" && ! -L "$checksum" ]] || {
	printf 'checksum already exists: %s\n' "$checksum" >&2
	exit 1
}

mkdir -p "$(dirname "$output")"
tar -C "$PROJECT_ROOT" -czf "$output" "${sources[@]}"
(
	cd "$(dirname "$output")"
	sha256sum "$(basename "$output")" > "$(basename "$checksum")"
)
printf 'Resource archive created: %s\n' "$output"
printf 'Checksum created: %s\n' "$checksum"
