#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/../_lib/lib.sh"

action="${1:-}"
compose_env="$MARIADB_RUNTIME/compose.env"
secret_file="$MARIADB_RUNTIME/secrets.env"

fail() {
	echo "database: $*" >&2
	exit 1
}

load_profile() {
	[[ -f "$MARIADB_PROFILE" ]] || fail "missing profile: $MARIADB_PROFILE"
	set -a
	# shellcheck disable=SC1090
	source "$MARIADB_PROFILE"
	set +a

	for name in MARIADB_IMAGE DB_BIND_IP DB_PORT DB_MAIN_DATABASE DB_LOG_DATABASE DB_USER; do
		[[ -n "${!name:-}" ]] || fail "empty profile value: $name"
	done
	[[ "$DB_PORT" =~ ^[0-9]+$ ]] || fail "invalid DB_PORT: $DB_PORT"
	for identifier in "$DB_MAIN_DATABASE" "$DB_LOG_DATABASE" "$DB_USER"; do
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
			printf 'DB_PASSWORD=%s\n' "$(openssl rand -hex 24)"
			printf 'INTERSERVER_USER=happyro\n'
			printf 'INTERSERVER_PASSWORD=%s\n' "$(openssl rand -hex 10)"
		} > "$secret_file"
	fi
	chmod 0600 "$secret_file"

	set -a
	# shellcheck disable=SC1090
	source "$secret_file"
	set +a
	for name in MARIADB_ROOT_PASSWORD DB_PASSWORD INTERSERVER_USER INTERSERVER_PASSWORD; do
		[[ -n "${!name:-}" ]] || fail "empty secret value: $name"
	done

	{
		printf 'MARIADB_IMAGE=%s\n' "$MARIADB_IMAGE"
		printf 'MARIADB_ROOT_PASSWORD=%s\n' "$MARIADB_ROOT_PASSWORD"
		printf 'DB_BIND_IP=%s\n' "$DB_BIND_IP"
		printf 'DB_PORT=%s\n' "$DB_PORT"
		printf 'DB_MAIN_DATABASE=%s\n' "$DB_MAIN_DATABASE"
		printf 'DB_LOG_DATABASE=%s\n' "$DB_LOG_DATABASE"
		printf 'DB_USER=%s\n' "$DB_USER"
		printf 'DB_PASSWORD=%s\n' "$DB_PASSWORD"
		printf 'INTERSERVER_USER=%s\n' "$INTERSERVER_USER"
		printf 'INTERSERVER_PASSWORD=%s\n' "$INTERSERVER_PASSWORD"
		printf 'DB_DATA_DIR=%s\n' "$MARIADB_RUNTIME/data"
		printf 'SERVER_SQL_DIR=%s\n' "$SERVER_REPO/sql-files"
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
	result="$(compose exec --no-TTY --env "MYSQL_PWD=$DB_PASSWORD" database mariadb \
		--batch --skip-column-names --host=127.0.0.1 --user="$DB_USER" \
		--execute="SELECT VERSION(); SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DB_MAIN_DATABASE'; SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DB_LOG_DATABASE'; SELECT COUNT(*) FROM \`$DB_MAIN_DATABASE\`.login WHERE account_id=1 AND userid='$INTERSERVER_USER' AND sex='S'; SELECT COUNT(*) FROM \`$DB_MAIN_DATABASE\`.db_roulette;")"
	mapfile -t values <<< "$result"
	[[ "${#values[@]}" -eq 5 ]] || fail "unexpected verification output"
	[[ "${values[1]}" -gt 0 && "${values[2]}" -gt 0 ]] || fail "database tables are missing"
	[[ "${values[3]}" -eq 1 ]] || fail "rAthena inter-server account is missing"
	[[ "${values[4]}" -gt 0 ]] || fail "seed data is missing"
	printf 'database: healthy\n'
	printf 'version: %s\n' "${values[0]}"
	printf '%s tables: %s\n' "$DB_MAIN_DATABASE" "${values[1]}"
	printf '%s tables: %s\n' "$DB_LOG_DATABASE" "${values[2]}"
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
		fail "usage: $0 start|stop|status|verify"
		;;
esac
