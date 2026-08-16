#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/lib.sh"

secret_file="$MARIADB_RUNTIME/secrets.env"
[[ -f "$MARIADB_PROFILE" ]] || {
	echo "missing MariaDB profile: $MARIADB_PROFILE" >&2
	exit 1
}
[[ -f "$secret_file" ]] || {
	echo "database secrets are not initialized; run make database-start" >&2
	exit 1
}
[[ -f "$RATHENA_PROFILE" ]] || {
	echo "missing rAthena profile: $RATHENA_PROFILE" >&2
	exit 1
}

set -a
# shellcheck disable=SC1090
source "$MARIADB_PROFILE"
# shellcheck disable=SC1090
source "$secret_file"
# shellcheck disable=SC1090
source "$RATHENA_PROFILE"
set +a

for name in SERVER_LAN_IP LOGIN_PORT CHAR_PORT MAP_PORT WEB_BIND_IP WEB_PORT WEB_ALLOWED_ORIGIN; do
	[[ -n "${!name:-}" ]] || {
		echo "empty rAthena profile value: $name" >&2
		exit 1
	}
done

import_dir="$SERVER_REPO/conf/import"
mkdir -p "$import_dir"
umask 077

write_database_entry() {
	local prefix="$1"
	local database="$2"
	{
		printf '%s_ip: %s\n' "$prefix" "$DB_BIND_IP"
		printf '%s_port: %s\n' "$prefix" "$DB_PORT"
		printf '%s_id: %s\n' "$prefix" "$DB_USER"
		printf '%s_pw: %s\n' "$prefix" "$DB_PASSWORD"
		printf '%s_db: %s\n' "$prefix" "$database"
	}
}

{
	write_database_entry login_server "$DB_MAIN_DATABASE"
	write_database_entry ipban_db "$DB_MAIN_DATABASE"
	write_database_entry char_server "$DB_MAIN_DATABASE"
	write_database_entry map_server "$DB_MAIN_DATABASE"
	write_database_entry web_server "$DB_MAIN_DATABASE"
	write_database_entry log_db "$DB_LOG_DATABASE"
} > "$import_dir/inter_conf.txt"

{
	printf 'bind_ip: %s\n' "$SERVER_LAN_IP"
	printf 'login_port: %s\n' "$LOGIN_PORT"
	printf 'new_account: yes\n'
	printf 'use_web_auth_token: yes\n'
} > "$import_dir/login_conf.txt"

{
	printf 'userid: %s\n' "$INTERSERVER_USER"
	printf 'passwd: %s\n' "$INTERSERVER_PASSWORD"
	printf 'login_ip: %s\n' "$SERVER_LAN_IP"
	printf 'login_port: %s\n' "$LOGIN_PORT"
	printf 'bind_ip: %s\n' "$SERVER_LAN_IP"
	printf 'char_ip: %s\n' "$SERVER_LAN_IP"
	printf 'char_port: %s\n' "$CHAR_PORT"
	printf 'server_name: HappyRO\n'
	printf 'pincode_enabled: no\n'
} > "$import_dir/char_conf.txt"

{
	printf 'userid: %s\n' "$INTERSERVER_USER"
	printf 'passwd: %s\n' "$INTERSERVER_PASSWORD"
	printf 'char_ip: %s\n' "$SERVER_LAN_IP"
	printf 'char_port: %s\n' "$CHAR_PORT"
	printf 'bind_ip: %s\n' "$SERVER_LAN_IP"
	printf 'map_ip: %s\n' "$SERVER_LAN_IP"
	printf 'map_port: %s\n' "$MAP_PORT"
} > "$import_dir/map_conf.txt"

{
	printf 'bind_ip: %s\n' "$WEB_BIND_IP"
	printf 'web_port: %s\n' "$WEB_PORT"
	printf 'allowed_origin_cors: %s\n' "$WEB_ALLOWED_ORIGIN"
} > "$import_dir/web_conf.txt"

chmod 0600 "$import_dir/inter_conf.txt" "$import_dir/char_conf.txt" "$import_dir/map_conf.txt"
chmod 0644 "$import_dir/login_conf.txt" "$import_dir/web_conf.txt"

: > "$import_dir/packet_conf.txt"
cat > "$import_dir/inter_server.yml" <<'EOF'
Header:
  Type: INTER_SERVER_DB
  Version: 1

Body: []
EOF
chmod 0644 "$import_dir/packet_conf.txt" "$import_dir/inter_server.yml"

echo "configured: $import_dir/inter_conf.txt"
echo "configured: $import_dir/login_conf.txt"
echo "configured: $import_dir/char_conf.txt"
echo "configured: $import_dir/map_conf.txt"
echo "configured: $import_dir/web_conf.txt"
