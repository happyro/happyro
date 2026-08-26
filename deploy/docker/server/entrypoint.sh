#!/bin/sh
set -eu

: "${DB_HOST:=database}"
: "${DB_PORT:=3306}"
: "${DB_MAIN_DATABASE:=happyro}"
: "${DB_LOG_DATABASE:=happyro_log}"
: "${DB_USER:=happyro}"
: "${DB_PASSWORD:?DB_PASSWORD is required}"
: "${INTERSERVER_USER:=happyro}"
: "${INTERSERVER_PASSWORD:?INTERSERVER_PASSWORD is required}"
: "${LOGIN_PORT:=6900}"
: "${CHAR_PORT:=6121}"
: "${MAP_PORT:=5121}"
: "${WEB_PORT:=8889}"

mkdir -p conf/import db/import
cp -n conf/import-tmpl/*.txt conf/import/ 2>/dev/null || true
cp -n db/import-tmpl/* db/import/ 2>/dev/null || true

cat > conf/import/inter_conf.txt <<EOF
login_server_ip: ${DB_HOST}
login_server_port: ${DB_PORT}
login_server_id: ${DB_USER}
login_server_pw: ${DB_PASSWORD}
login_server_db: ${DB_MAIN_DATABASE}
ipban_db_ip: ${DB_HOST}
ipban_db_port: ${DB_PORT}
ipban_db_id: ${DB_USER}
ipban_db_pw: ${DB_PASSWORD}
ipban_db_db: ${DB_MAIN_DATABASE}
char_server_ip: ${DB_HOST}
char_server_port: ${DB_PORT}
char_server_id: ${DB_USER}
char_server_pw: ${DB_PASSWORD}
char_server_db: ${DB_MAIN_DATABASE}
map_server_ip: ${DB_HOST}
map_server_port: ${DB_PORT}
map_server_id: ${DB_USER}
map_server_pw: ${DB_PASSWORD}
map_server_db: ${DB_MAIN_DATABASE}
web_server_ip: ${DB_HOST}
web_server_port: ${DB_PORT}
web_server_id: ${DB_USER}
web_server_pw: ${DB_PASSWORD}
web_server_db: ${DB_MAIN_DATABASE}
log_db_ip: ${DB_HOST}
log_db_port: ${DB_PORT}
log_db_id: ${DB_USER}
log_db_pw: ${DB_PASSWORD}
log_db_db: ${DB_LOG_DATABASE}
EOF

cat > conf/import/login_conf.txt <<EOF
bind_ip: 0.0.0.0
login_port: ${LOGIN_PORT}
new_account: yes
use_web_auth_token: yes
EOF

cat > conf/import/char_conf.txt <<EOF
userid: ${INTERSERVER_USER}
passwd: ${INTERSERVER_PASSWORD}
login_ip: login
login_port: ${LOGIN_PORT}
bind_ip: 0.0.0.0
char_ip: char
char_port: ${CHAR_PORT}
server_name: HappyRO
pincode_enabled: no
EOF

cat > conf/import/map_conf.txt <<EOF
userid: ${INTERSERVER_USER}
passwd: ${INTERSERVER_PASSWORD}
char_ip: char
char_port: ${CHAR_PORT}
bind_ip: 0.0.0.0
map_ip: 0.0.0.0
map_port: ${MAP_PORT}
EOF

cat > conf/import/web_conf.txt <<EOF
bind_ip: 0.0.0.0
web_port: ${WEB_PORT}
allowed_origin_cors: ${WEB_ALLOWED_ORIGIN:-http://localhost:3338}
EOF

exec "/opt/rathena/$1"

