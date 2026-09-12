#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CLIENT_REPO="$PROJECT_ROOT/repos/happyro-client"
SERVER_REPO="$PROJECT_ROOT/repos/happyro-server"
GATEWAY_REPO="$PROJECT_ROOT/repos/happyro-gateway"
MARIADB_PROFILE="$PROJECT_ROOT/deploy/mariadb/profile.env"
MARIADB_COMPOSE_FILE="$PROJECT_ROOT/deploy/mariadb/compose.yml"
MARIADB_RUNTIME="$PROJECT_ROOT/work/runtime/mariadb-10.11"
RATHENA_PROFILE="$PROJECT_ROOT/deploy/rathena/profile.env"
RATHENA_RUNTIME="$PROJECT_ROOT/work/runtime/rathena-20211103"

# shellcheck disable=SC1091
source "$PROJECT_ROOT/versions/sources.lock"

happyro_cli_style() {
	local color="${1:-true}"
	if [[ "$color" == true && -t 1 ]]; then
		HAPPYRO_C_TITLE=$'\033[1;36m'
		HAPPYRO_C_SECTION=$'\033[1;33m'
		HAPPYRO_C_CMD=$'\033[1;32m'
		HAPPYRO_C_EXAMPLE=$'\033[36m'
		HAPPYRO_C_RESET=$'\033[0m'
	else
		HAPPYRO_C_TITLE=''
		HAPPYRO_C_SECTION=''
		HAPPYRO_C_CMD=''
		HAPPYRO_C_EXAMPLE=''
		HAPPYRO_C_RESET=''
	fi
}

check_upstream_base() {
	local label="$1"
	local repo="$2"
	local expected="$3"
	if ! git -C "$repo" merge-base --is-ancestor "$expected" HEAD; then
		echo "$label does not descend from locked upstream base $expected" >&2
		return 1
	fi
}
