#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/../_lib/lib.sh"

compose_env="$MARIADB_RUNTIME/compose.env"
account_file="$PROJECT_ROOT/work/runtime/automation-account.env"

fail() {
	echo "automation-account: $*" >&2
	exit 1
}

[[ -f "$compose_env" ]] || fail "database runtime is not initialized"
docker inspect --format '{{.State.Health.Status}}' happyro-mariadb 2>/dev/null | rg -qx healthy || \
	fail "MariaDB is not healthy"

umask 077
mkdir -p "$(dirname "$account_file")"
{
	printf 'AUTOMATION_ACCOUNT_USER=autotest\n'
	printf 'AUTOMATION_ACCOUNT_PASSWORD=happyro\n'
	printf 'AUTOMATION_CHARACTER=AutoTest\n'
} > "$account_file"
chmod 0600 "$account_file"

set -a
# shellcheck disable=SC1090
source "$compose_env"
# shellcheck disable=SC1090
source "$account_file"
set +a

sql="
INSERT INTO \`$DB_MAIN_DATABASE\`.login (userid, user_pass, sex, email)
SELECT '$AUTOMATION_ACCOUNT_USER', '$AUTOMATION_ACCOUNT_PASSWORD', 'M', 'autotest@localhost'
WHERE NOT EXISTS (
  SELECT 1 FROM \`$DB_MAIN_DATABASE\`.login WHERE userid='$AUTOMATION_ACCOUNT_USER'
);
UPDATE \`$DB_MAIN_DATABASE\`.login
SET user_pass='$AUTOMATION_ACCOUNT_PASSWORD', sex='M', state=0, unban_time=0, expiration_time=0
WHERE userid='$AUTOMATION_ACCOUNT_USER';
SET @automation_account_id = (
  SELECT account_id FROM \`$DB_MAIN_DATABASE\`.login WHERE userid='$AUTOMATION_ACCOUNT_USER'
);
INSERT INTO \`$DB_MAIN_DATABASE\`.\`char\`
  (account_id, char_num, name, class, base_level, job_level, max_hp, hp, max_sp, sp,
   last_map, last_x, last_y, save_map, save_x, save_y, sex)
SELECT @automation_account_id, 0, '$AUTOMATION_CHARACTER', 0, 1, 1, 40, 40, 11, 11,
       'int_land03', 84, 107, 'int_land03', 84, 107, 'M'
WHERE NOT EXISTS (
  SELECT 1 FROM \`$DB_MAIN_DATABASE\`.\`char\` WHERE name='$AUTOMATION_CHARACTER'
);
SELECT l.account_id, l.userid, l.sex, l.state, c.char_id, c.name, c.last_map
FROM \`$DB_MAIN_DATABASE\`.login l
JOIN \`$DB_MAIN_DATABASE\`.\`char\` c ON c.account_id=l.account_id
WHERE l.userid='$AUTOMATION_ACCOUNT_USER' AND c.name='$AUTOMATION_CHARACTER';
"

result="$(docker exec --env "MYSQL_PWD=$DB_PASSWORD" happyro-mariadb \
	mariadb --batch --skip-column-names --user="$DB_USER" --execute="$sql")"
[[ "$(wc -l <<<"$result")" -eq 1 ]] || fail "expected exactly one automation account and character"

printf 'automation-account: %s\n' "$result"
printf 'credentials: %s\n' "$account_file"
