#!/bin/sh
set -eu

if [ "$#" -eq 0 ] || [ "$1" = '--help' ] || [ "$1" = '--no-color' ]; then
    if [ "${1:-}" = '--no-color' ]; then
        printf '\nHappyRO Server\n\nCommands: login-server | char-server | map-server | web-server\nExample: happyro-server map-server\n\n'
    else
        printf '\n\033[1;36mHappyRO Server\033[0m\n\n\033[1;33mCommands\033[0m\n\033[1;32mlogin-server | char-server | map-server | web-server\033[0m\n\033[36mExample: happyro-server map-server\033[0m\nUse --no-color for plain help.\n\n'
    fi
    exit 0
fi
case "$1" in login-server|char-server|map-server|web-server) ;; *) exit 2 ;; esac
printf '%s\n' "$1" > /run/happyro-service
umask 007
mkdir -p /run/happyro /run/happyro-settings

: "${DB_HOST:=database}"
: "${DB_PORT:=3306}"
: "${DB_MAIN_DATABASE:=happyro}"
: "${DB_LOG_DATABASE:=happyro_log}"
: "${DB_USER:=happyro}"
: "${DB_PASSWORD:?DB_PASSWORD is required}"
: "${INTERSERVER_USER:=happyro_interserver}"
: "${INTERSERVER_PASSWORD:?INTERSERVER_PASSWORD is required}"
: "${GAME_SERVER_IP:=127.0.0.1}"
: "${LOGIN_PORT:=6900}"
: "${CHAR_PORT:=6121}"
: "${MAP_PORT:=5121}"
: "${WEB_PORT:=8889}"
: "${GAME_CONTROL_TOKEN:?GAME_CONTROL_TOKEN is required}"
case "$GAME_CONTROL_TOKEN$DB_PASSWORD$INTERSERVER_PASSWORD" in *[!A-Za-z0-9_-]*) echo 'Use generated alphanumeric secrets' >&2; exit 2 ;; esac
[ "${#INTERSERVER_PASSWORD}" -le 23 ] || { echo 'INTERSERVER_PASSWORD must be at most 23 characters' >&2; exit 2; }

for directory in conf/import conf/msg_conf/import db/import; do
    mkdir -p "$directory"
    for template in "$directory-tmpl"/*; do
        target="$directory/${template##*/}"
        if [ ! -e "$target" ]; then
            cp "$template" "$target"
        fi
    done
done

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
char_ip: ${GAME_SERVER_IP}
char_port: ${CHAR_PORT}
server_name: HappyRO
pincode_enabled: no
char_name_option: 0
EOF

cat > conf/import/map_conf.txt <<EOF
userid: ${INTERSERVER_USER}
passwd: ${INTERSERVER_PASSWORD}
char_ip: char
char_port: ${CHAR_PORT}
bind_ip: 0.0.0.0
map_ip: ${GAME_SERVER_IP}
map_port: ${MAP_PORT}
game_control_socket: /run/happyro/map-control.sock
EOF

cat > conf/import/web_conf.txt <<EOF
bind_ip: 0.0.0.0
web_port: ${WEB_PORT}
allowed_origin_cors: ${WEB_ALLOWED_ORIGIN:-http://127.0.0.1:3338}
game_control_enabled: yes
game_control_allow_remote: yes
game_control_secret: ${GAME_CONTROL_TOKEN}
game_control_socket: /run/happyro/map-control.sock
EOF

# Admin replaces this file atomically, so share its directory rather than a file mount.
if [ ! -f /run/happyro-settings/battle_conf.txt ]; then
    cp conf/import-tmpl/battle_conf.txt /run/happyro-settings/battle_conf.txt
fi
printf 'import: /run/happyro-settings/battle_conf.txt\n' > conf/import/battle_conf.txt
chown 33:33 /run/happyro-settings /run/happyro-settings/battle_conf.txt

exec "/opt/rathena/$1"
