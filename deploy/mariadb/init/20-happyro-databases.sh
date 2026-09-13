#!/usr/bin/env bash
set -euo pipefail

mariadb_root=(mariadb --protocol=socket --user=root "--password=$MARIADB_ROOT_PASSWORD")

"${mariadb_root[@]}" <<SQL
CREATE DATABASE IF NOT EXISTS \`$HAPPYRO_LOG_DATABASE\`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON \`$HAPPYRO_LOG_DATABASE\`.* TO '$MARIADB_USER'@'%';
FLUSH PRIVILEGES;
SQL

"${mariadb_root[@]}" "$MARIADB_DATABASE" < /opt/rathena/sql/main.sql
"${mariadb_root[@]}" "$MARIADB_DATABASE" < /opt/rathena/sql/web.sql
"${mariadb_root[@]}" "$MARIADB_DATABASE" < /opt/rathena/sql/roulette_default_data.sql
"${mariadb_root[@]}" "$HAPPYRO_LOG_DATABASE" < /opt/rathena/sql/logs.sql

"${mariadb_root[@]}" "$MARIADB_DATABASE" <<SQL
UPDATE login
SET userid = '$HAPPYRO_INTERSERVER_USER',
    user_pass = '$HAPPYRO_INTERSERVER_PASSWORD',
    sex = 'S'
WHERE account_id = 1;
SQL

# Seed the documented GM account while keeping the inter-server account separate.
"${mariadb_root[@]}" "$MARIADB_DATABASE" <<SQL
INSERT INTO login (userid, user_pass, sex, email, group_id)
SELECT 'happyro', 'happyro', 'M', 'happyro@localhost', 99
WHERE NOT EXISTS (SELECT 1 FROM login WHERE userid = 'happyro');
UPDATE login SET user_pass = 'happyro', sex = 'M', group_id = 99
WHERE userid = 'happyro';
SQL
