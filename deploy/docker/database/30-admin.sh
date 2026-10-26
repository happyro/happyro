#!/bin/bash
set -euo pipefail
: "${HAPPYRO_API_ADMIN_DB_PASSWORD:?required}"
[[ "$HAPPYRO_API_ADMIN_DB_PASSWORD" =~ ^[A-Za-z0-9_-]+$ ]] || { echo 'Use a generated alphanumeric password' >&2; exit 2; }
mariadb --protocol=socket --user=root --password="$MARIADB_ROOT_PASSWORD" <<SQL
CREATE DATABASE happyro_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'happyro_admin'@'%' IDENTIFIED BY '$HAPPYRO_API_ADMIN_DB_PASSWORD';
GRANT ALL PRIVILEGES ON happyro_admin.* TO 'happyro_admin'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON happyro.* TO 'happyro_admin'@'%';
GRANT SELECT ON happyro_log.* TO 'happyro_admin'@'%';
SQL

# This script runs only when initializing a new database volume.
mariadb --protocol=socket --user=root --password="$MARIADB_ROOT_PASSWORD" happyro < /opt/rathena/sql/happyro-accounts.sql
mariadb --protocol=socket --user=root --password="$MARIADB_ROOT_PASSWORD" happyro < /opt/rathena/sql/happyro-mail.sql
mariadb --protocol=socket --user=root --password="$MARIADB_ROOT_PASSWORD" happyro < /opt/rathena/sql/happyro-admin.sql
