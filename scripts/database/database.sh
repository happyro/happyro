#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/../_lib/lib.sh"

action=""
color=true
for argument in "$@"; do
	case "$argument" in
		start|stop|status|verify) action="$argument" ;;
		--no-color) color=false ;;
		-h|--help) action="help" ;;
		*) echo "unknown option: $argument" >&2; exit 2 ;;
	esac
done
compose_env="$MARIADB_RUNTIME/compose.env"
secret_file="$MARIADB_RUNTIME/secrets.env"

print_help() {
	happyro_cli_style "$color"
	printf '\n%sHappyRO 数据库%s\n\n' "$HAPPYRO_C_TITLE" "$HAPPYRO_C_RESET"
	printf '%s用法%s\n  %s%s start|stop|status|verify%s [--no-color]\n\n' "$HAPPYRO_C_SECTION" "$HAPPYRO_C_RESET" "$HAPPYRO_C_CMD" "$0" "$HAPPYRO_C_RESET"
	printf '%s常用例子%s\n  %s%s start%s\n  %s%s status --no-color%s\n\n' "$HAPPYRO_C_SECTION" "$HAPPYRO_C_RESET" "$HAPPYRO_C_EXAMPLE" "$0" "$HAPPYRO_C_RESET" "$HAPPYRO_C_EXAMPLE" "$0" "$HAPPYRO_C_RESET"
}

fail() {
	echo "database: $*" >&2
	exit 1
}

if [[ -z "$action" || "$action" == "help" ]]; then
	print_help
	exit 0
fi

load_profile() {
	[[ -f "$MARIADB_PROFILE" ]] || fail "missing profile: $MARIADB_PROFILE"
	set -a
	# shellcheck disable=SC1090
	source "$MARIADB_PROFILE"
	set +a

	for name in MARIADB_IMAGE HAPPYRO_DATABASE_PUBLISH_HOST HAPPYRO_SERVER_DB_PORT HAPPYRO_SERVER_DB_NAME HAPPYRO_SERVER_LOG_DB_NAME HAPPYRO_SERVER_DB_USERNAME; do
		[[ -n "${!name:-}" ]] || fail "empty profile value: $name"
	done
	[[ "$HAPPYRO_SERVER_DB_PORT" =~ ^[0-9]+$ ]] || fail "invalid HAPPYRO_SERVER_DB_PORT: $HAPPYRO_SERVER_DB_PORT"
	for identifier in "$HAPPYRO_SERVER_DB_NAME" "$HAPPYRO_SERVER_LOG_DB_NAME" "$HAPPYRO_SERVER_DB_USERNAME"; do
		[[ "$identifier" =~ ^[a-z0-9_]+$ ]] || fail "invalid database identifier: $identifier"
	done
}

create_runtime_config() {
	command -v openssl >/dev/null || fail "missing command: openssl"
	mkdir -p "$MARIADB_RUNTIME/data"
	umask 077

	if [[ ! -f "$secret_file" ]]; then
		{
			printf 'MARIADB_ROOT_PASSWORD=%s\n' "$(openssl rand -hex 24)"
			printf 'HAPPYRO_SERVER_DB_PASSWORD=%s\n' "$(openssl rand -hex 24)"
			printf 'HAPPYRO_SERVER_INTERSERVER_USERNAME=happyro_interserver\n'
			printf 'HAPPYRO_SERVER_INTERSERVER_PASSWORD=%s\n' "$(openssl rand -hex 10)"
		} > "$secret_file"
	fi
	chmod 0600 "$secret_file"

	set -a
	# shellcheck disable=SC1090
	source "$secret_file"
	set +a
	for name in MARIADB_ROOT_PASSWORD HAPPYRO_SERVER_DB_PASSWORD HAPPYRO_SERVER_INTERSERVER_USERNAME HAPPYRO_SERVER_INTERSERVER_PASSWORD; do
		[[ -n "${!name:-}" ]] || fail "empty secret value: $name"
	done

	{
		printf 'MARIADB_IMAGE=%s\n' "$MARIADB_IMAGE"
		printf 'MARIADB_ROOT_PASSWORD=%s\n' "$MARIADB_ROOT_PASSWORD"
		printf 'HAPPYRO_DATABASE_PUBLISH_HOST=%s\n' "$HAPPYRO_DATABASE_PUBLISH_HOST"
		printf 'HAPPYRO_SERVER_DB_PORT=%s\n' "$HAPPYRO_SERVER_DB_PORT"
		printf 'HAPPYRO_SERVER_DB_NAME=%s\n' "$HAPPYRO_SERVER_DB_NAME"
		printf 'HAPPYRO_SERVER_LOG_DB_NAME=%s\n' "$HAPPYRO_SERVER_LOG_DB_NAME"
		printf 'HAPPYRO_SERVER_DB_USERNAME=%s\n' "$HAPPYRO_SERVER_DB_USERNAME"
		printf 'HAPPYRO_SERVER_DB_PASSWORD=%s\n' "$HAPPYRO_SERVER_DB_PASSWORD"
		printf 'HAPPYRO_SERVER_INTERSERVER_USERNAME=%s\n' "$HAPPYRO_SERVER_INTERSERVER_USERNAME"
		printf 'HAPPYRO_SERVER_INTERSERVER_PASSWORD=%s\n' "$HAPPYRO_SERVER_INTERSERVER_PASSWORD"
		printf 'HAPPYRO_DATABASE_DATA_DIR=%s\n' "$MARIADB_RUNTIME/data"
		printf 'HAPPYRO_SERVER_SQL_DIR=%s\n' "$SERVER_REPO/sql-files"
	} > "$compose_env"
	chmod 0600 "$compose_env"
}

require_runtime_config() {
	[[ -f "$compose_env" ]] || fail "runtime is not initialized; run make database-start"
}

compose() {
	docker compose --project-name happyro \
		--env-file "$compose_env" \
		--file "$MARIADB_COMPOSE_FILE" "$@"
}

wait_until_healthy() {
	local health
	for _ in $(seq 1 90); do
		health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' happyro-mariadb 2>/dev/null || true)"
		case "$health" in
			healthy) return 0 ;;
			unhealthy|exited|dead) fail "container entered state: $health" ;;
		esac
		sleep 2
	done
	fail "MariaDB did not become healthy"
}

verify_database() {
	require_runtime_config
	set -a
	# shellcheck disable=SC1090
	source "$compose_env"
	set +a
	wait_until_healthy

	local result
	result="$(compose exec --no-TTY --env "MYSQL_PWD=$HAPPYRO_SERVER_DB_PASSWORD" database mariadb \
		--batch --skip-column-names --host=127.0.0.1 --user="$HAPPYRO_SERVER_DB_USERNAME" \
		--execute="SELECT VERSION(); SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$HAPPYRO_SERVER_DB_NAME'; SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$HAPPYRO_SERVER_LOG_DB_NAME'; SELECT COUNT(*) FROM \`$HAPPYRO_SERVER_DB_NAME\`.login WHERE account_id=1 AND userid='$HAPPYRO_SERVER_INTERSERVER_USERNAME' AND sex='S'; SELECT COUNT(*) FROM \`$HAPPYRO_SERVER_DB_NAME\`.db_roulette;")"
	mapfile -t values <<< "$result"
	[[ "${#values[@]}" -eq 5 ]] || fail "unexpected verification output"
	[[ "${values[1]}" -gt 0 && "${values[2]}" -gt 0 ]] || fail "database tables are missing"
	[[ "${values[3]}" -eq 1 ]] || fail "rAthena inter-server account is missing"
	[[ "${values[4]}" -gt 0 ]] || fail "seed data is missing"
	printf 'database: healthy\n'
	printf 'version: %s\n' "${values[0]}"
	printf '%s tables: %s\n' "$HAPPYRO_SERVER_DB_NAME" "${values[1]}"
	printf '%s tables: %s\n' "$HAPPYRO_SERVER_LOG_DB_NAME" "${values[2]}"
}

command -v docker >/dev/null || fail "missing command: docker"
load_profile

case "$action" in
	start)
		create_runtime_config
		compose up --detach database
		verify_database
		;;
	stop)
		require_runtime_config
		compose down
		;;
	status)
		require_runtime_config
		compose ps
		;;
	verify)
		verify_database
		;;
	*)
		print_help
		exit 1
		;;
esac
