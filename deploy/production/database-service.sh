#!/usr/bin/env bash
set -euo pipefail

release=/opt/happyro-demo/current
env_file=/etc/happyro/database.env
demo_accounts_sql="$release/deployment/deploy/production/mariadb/demo-accounts.sql"

usage() {
	local title=$'\033[1;36m' section=$'\033[1;33m' command=$'\033[1;32m' example=$'\033[36m' reset=$'\033[0m'
	[[ "${NO_COLOR:-}" ]] && title='' section='' command='' example='' reset=''
	printf '\n%sHappyRO database service%s\n\n' "$title" "$reset"
	printf '%sUsage%s\n  %sdatabase-service.sh%s initialize|reset [--no-color]\n\n' "$section" "$reset" "$command" "$reset"
	printf '%sExamples%s\n  %sdatabase-service.sh%s initialize\n  %sdatabase-service.sh%s reset\n\n' "$section" "$reset" "$example" "$reset" "$example" "$reset"
}

load_environment() {
	[[ -r "$env_file" ]] || { echo "database-service: missing $env_file" >&2; exit 1; }
	[[ -r "$demo_accounts_sql" ]] || { echo "database-service: missing $demo_accounts_sql" >&2; exit 1; }
	set -a
	# shellcheck disable=SC1090
	source "$env_file"
	set +a
	for value in "$DB_PASSWORD" "$INTERSERVER_PASSWORD"; do
		[[ "$value" =~ ^[0-9a-f]+$ ]] || { echo 'database-service: invalid generated secret' >&2; exit 1; }
	done
}

initialize_database() {
	mariadb --protocol=socket --user=root <<SQL
CREATE DATABASE IF NOT EXISTS \`$DB_MAIN_DATABASE\`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS \`$DB_LOG_DATABASE\`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'127.0.0.1' IDENTIFIED BY '$DB_PASSWORD';
ALTER USER '$DB_USER'@'127.0.0.1' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON \`$DB_MAIN_DATABASE\`.* TO '$DB_USER'@'127.0.0.1';
GRANT ALL PRIVILEGES ON \`$DB_LOG_DATABASE\`.* TO '$DB_USER'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL

	main_table_count="$(mariadb --protocol=socket --user=root --batch --skip-column-names \
		-e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DB_MAIN_DATABASE'")"
	if [[ "$main_table_count" == 0 ]]; then
		mariadb --protocol=socket --user=root "$DB_MAIN_DATABASE" < "$SERVER_SQL_DIR/main.sql"
		mariadb --protocol=socket --user=root "$DB_MAIN_DATABASE" < "$SERVER_SQL_DIR/web.sql"
		mariadb --protocol=socket --user=root "$DB_MAIN_DATABASE" < "$SERVER_SQL_DIR/roulette_default_data.sql"
	fi

	log_table_count="$(mariadb --protocol=socket --user=root --batch --skip-column-names \
		-e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DB_LOG_DATABASE'")"
	if [[ "$log_table_count" == 0 ]]; then
		mariadb --protocol=socket --user=root "$DB_LOG_DATABASE" < "$SERVER_SQL_DIR/logs.sql"
	fi

	mariadb --protocol=socket --user=root "$DB_MAIN_DATABASE" <<SQL
UPDATE login
SET userid = '$INTERSERVER_USER',
    user_pass = '$INTERSERVER_PASSWORD',
    sex = 'S'
WHERE account_id = 1;
SQL
	mariadb --protocol=socket --user=root "$DB_MAIN_DATABASE" < "$demo_accounts_sql"
}

reset_database() {
	systemctl stop happyro-gateway.service happyro-map.service happyro-web-api.service happyro-char.service happyro-login.service
	mariadb --protocol=socket --user=root <<SQL
DROP DATABASE IF EXISTS \`$DB_MAIN_DATABASE\`;
DROP DATABASE IF EXISTS \`$DB_LOG_DATABASE\`;
SQL
	initialize_database
	systemctl start happyro-gateway.service
}

[[ "${2:-}" == --no-color ]] && NO_COLOR=1
case "${1:-}" in
	initialize)
		load_environment
		initialize_database
		;;
	reset)
		load_environment
		reset_database
		;;
	*) usage; [[ $# -eq 0 ]] && exit 0 || exit 2 ;;
esac
