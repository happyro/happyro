#!/bin/bash
set -euo pipefail
: "${HAPPYRO_ADMIN_PASSWORD:?required}"
[[ "$HAPPYRO_ADMIN_PASSWORD" =~ ^[A-Za-z0-9_-]+$ ]] || { echo 'Use a generated alphanumeric password' >&2; exit 2; }
mariadb --protocol=socket --user=root --password="$MARIADB_ROOT_PASSWORD" <<SQL
CREATE DATABASE happyro_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'happyro_admin'@'%' IDENTIFIED BY '$HAPPYRO_ADMIN_PASSWORD';
GRANT ALL PRIVILEGES ON happyro_admin.* TO 'happyro_admin'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON happyro.* TO 'happyro_admin'@'%';
GRANT SELECT ON happyro_log.* TO 'happyro_admin'@'%';
SQL
