#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/../_lib/lib.sh"

command_name=""
color=true
for argument in "$@"; do
	case "$argument" in
		build|verify) command_name="$argument" ;;
		--no-color) color=false ;;
		-h|--help) command_name="help" ;;
		*) echo "unknown option: $argument" >&2; exit 2 ;;
	esac
done

if [[ -z "$command_name" || "$command_name" == "help" ]]; then
	if [[ "$color" == true && -t 1 ]]; then
		bold_cyan=$'\033[1;36m'; bold_yellow=$'\033[1;33m'; bold_green=$'\033[1;32m'; cyan=$'\033[36m'; reset=$'\033[0m'
	else
		bold_cyan=''; bold_yellow=''; bold_green=''; cyan=''; reset=''
	fi
	printf '\n%sHappyRO 客户端验收刷新%s\n\n' "$bold_cyan" "$reset"
	printf '%s用法%s\n  %s%s build%s [--no-color]\n  %s%s verify%s [--no-color]\n\n' "$bold_yellow" "$reset" "$bold_green" "$0" "$reset" "$bold_green" "$0" "$reset"
	printf '%s命令%s\n  %sbuild%s    构建 PWA，并核对 3338 提供的全部关键产物\n  %sverify%s   不构建，仅核对本地产物、构建标识与远程哈希\n\n' "$bold_yellow" "$reset" "$bold_green" "$reset" "$bold_green" "$reset"
	printf '%s常用例子%s\n  %s%s build%s\n  %s%s verify --no-color%s\n\n' "$bold_yellow" "$reset" "$cyan" "$0" "$reset" "$cyan" "$0" "$reset"
	exit 0
fi

manifest="$CLIENT_REPO/dist/Web/build-info.json"
base_url="http://127.0.0.1:3338/applications/pwa"

fail() {
	echo "client refresh: $*" >&2
	exit 1
}

verify_client() {
	[[ -f "$manifest" ]] || fail "missing $manifest; run build first"
	local build_id remote_manifest remote_build_id name expected actual
	build_id="$(jq -er '.buildId' "$manifest")" || fail "invalid local build manifest"
	while IFS=$'\t' read -r name expected; do
		[[ -f "$CLIENT_REPO/dist/Web/$name" ]] || fail "missing local artifact: $name"
		actual="$(sha256sum "$CLIENT_REPO/dist/Web/$name" | cut -d' ' -f1)"
		[[ "$actual" == "$expected" ]] || fail "local artifact does not match build manifest: $name"
	done < <(jq -r '.artifacts | to_entries[] | [.key, .value] | @tsv' "$manifest")

	remote_manifest="$(curl --fail --silent --show-error --max-time 10 \
		-H 'Cache-Control: no-cache' "$base_url/build-info.json?v=$build_id")" || fail "cannot load remote build manifest"
	remote_build_id="$(jq -er '.buildId' <<<"$remote_manifest")" || fail "invalid remote build manifest"
	[[ "$remote_build_id" == "$build_id" ]] || fail "3338 serves build $remote_build_id, expected $build_id"

	while IFS=$'\t' read -r name expected; do
		actual="$(curl --fail --silent --show-error --max-time 30 \
			-H 'Cache-Control: no-cache' "$base_url/$name?v=$build_id" | sha256sum | cut -d' ' -f1)"
		[[ "$actual" == "$expected" ]] || fail "3338 artifact hash mismatch: $name"
	done < <(jq -r '.artifacts | to_entries[] | [.key, .value] | @tsv' "$manifest")

	echo "client refresh: 3338 is serving verified build $build_id"
}

if [[ "$command_name" == "build" ]]; then
	cd "$CLIENT_REPO"
	[[ -d node_modules ]] || npm install
	npm run build:pwa
fi

verify_client
