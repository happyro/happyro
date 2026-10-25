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
	printf '%s命令%s\n  %sbuild%s    同步 NPC 图鉴、构建 PWA，并核对 3338 提供的全部关键产物\n  %sverify%s   不构建，仅核对本地产物、构建标识与远程哈希\n\n' "$bold_yellow" "$reset" "$bold_green" "$reset" "$bold_green" "$reset"
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

sync_npc_catalog() {
	local api_root="$PROJECT_ROOT/repos/happyro-api"
	local api_user
	api_user="$(systemctl show happyro-api.service --property=User --value)"
	[[ -n "$api_user" ]] || fail "cannot determine the API service user"
	[[ "$EUID" -eq 0 || "$(id -un)" == "$api_user" ]] || fail "run build as root or $api_user to synchronize the NPC database"

	node "$PROJECT_ROOT/tools/resources/world/generate-npc-catalog.mjs" generate --no-color
	npm --prefix "$CLIENT_REPO" run catalog:world
	local api_binary="${HAPPYRO_API_BINARY:-/usr/local/bin/happyro-api}"
	[[ -x "$api_binary" ]] || fail "missing Go API binary: $api_binary"
	[[ -f "$api_root/.env" ]] || fail "missing API environment: $api_root/.env"
	local import_command=(bash -c 'set -e; set -a; source "$1"; set +a; shift; exec "$@"' happyro-catalog-import
		"$api_root/.env" "$api_binary" catalog import
		--client-items "$api_root/resources/game-data/items/client-kro-20211105.json"
		--server-items "$api_root/resources/game-data/items/renewal.json"
		--monsters "$api_root/resources/game-data/monsters/renewal.json"
		--npcs "$api_root/resources/game-data/world/npc-catalog.json" --no-color)
	if [[ "$EUID" -eq 0 ]]; then
		runuser -u "$api_user" -- "${import_command[@]}"
	else
		"${import_command[@]}"
	fi
}

if [[ "$command_name" == "build" ]]; then
	python3 "$PROJECT_ROOT/tools/navi-review/review.py" check --root "$PROJECT_ROOT" --no-color
	cd "$CLIENT_REPO"
	[[ -d node_modules ]] || npm install
	python3 "$PROJECT_ROOT/tools/resources/catalog/generate-item-services.py" generate --no-color
	bash "$PROJECT_ROOT/tools/resources/catalog/generate-item-subtypes.sh" generate --no-color
	sync_npc_catalog
	npm run build:pwa
fi

verify_client
