#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/lib.sh"

compose_env="$MARIADB_RUNTIME/compose.env"
account_file="$PROJECT_ROOT/work/runtime/test-account.env"

fail() {
	echo "test-account: $*" >&2
	exit 1
}

[[ -f "$compose_env" ]] || fail "database runtime is not initialized"
docker inspect --format '{{.State.Health.Status}}' happyro-mariadb 2>/dev/null | rg -qx healthy || \
	fail "MariaDB is not healthy"

umask 077
if [[ ! -f "$account_file" ]]; then
	mkdir -p "$(dirname "$account_file")"
	{
		printf 'TEST_ACCOUNT_USER=happyro1\n'
		printf 'TEST_ACCOUNT_PASSWORD=happyro\n'
		printf 'TEST_ACCOUNT_SEX=M\n'
	} > "$account_file"
fi
chmod 0600 "$account_file"

set -a
# shellcheck disable=SC1090
source "$compose_env"
# shellcheck disable=SC1090
source "$account_file"
set +a

[[ "$TEST_ACCOUNT_USER" =~ ^[a-z0-9]{6,23}$ ]] || fail "invalid test account name"
[[ "$TEST_ACCOUNT_SEX" == M || "$TEST_ACCOUNT_SEX" == F ]] || fail "invalid test account sex"

if [[ ! "$TEST_ACCOUNT_PASSWORD" =~ ^[A-Za-z0-9]{6,23}$ ]]; then
	TEST_ACCOUNT_PASSWORD="$(openssl rand -hex 10)"
	{
		printf 'TEST_ACCOUNT_USER=%s\n' "$TEST_ACCOUNT_USER"
		printf 'TEST_ACCOUNT_PASSWORD=%s\n' "$TEST_ACCOUNT_PASSWORD"
		printf 'TEST_ACCOUNT_SEX=%s\n' "$TEST_ACCOUNT_SEX"
	} > "$account_file"
	chmod 0600 "$account_file"
fi

sql="
INSERT INTO \`$DB_MAIN_DATABASE\`.login (userid, user_pass, sex, email)
SELECT '$TEST_ACCOUNT_USER', '$TEST_ACCOUNT_PASSWORD', '$TEST_ACCOUNT_SEX', 'happytest@localhost'
WHERE NOT EXISTS (
  SELECT 1 FROM \`$DB_MAIN_DATABASE\`.login WHERE userid='$TEST_ACCOUNT_USER'
);
UPDATE \`$DB_MAIN_DATABASE\`.login
SET user_pass='$TEST_ACCOUNT_PASSWORD', sex='$TEST_ACCOUNT_SEX', state=0, unban_time=0, expiration_time=0
WHERE userid='$TEST_ACCOUNT_USER';
SELECT account_id, userid, sex, group_id, state
FROM \`$DB_MAIN_DATABASE\`.login
WHERE userid='$TEST_ACCOUNT_USER';
"

result="$(docker exec --env "MYSQL_PWD=$DB_PASSWORD" happyro-mariadb \
	mariadb --batch --skip-column-names --user="$DB_USER" --execute="$sql")"
[[ "$(wc -l <<<"$result")" -eq 1 ]] || fail "expected exactly one test account"

printf 'test-account: %s\n' "$result"
printf 'credentials: %s\n' "$account_file"
