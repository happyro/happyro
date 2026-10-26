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

: "${HAPPYRO_SERVER_DB_HOST:=database}"
: "${HAPPYRO_SERVER_DB_PORT:=3306}"
: "${HAPPYRO_SERVER_DB_NAME:=happyro}"
: "${HAPPYRO_SERVER_LOG_DB_NAME:=happyro_log}"
: "${HAPPYRO_SERVER_DB_USERNAME:=happyro}"
: "${HAPPYRO_SERVER_DB_PASSWORD:?HAPPYRO_SERVER_DB_PASSWORD is required}"
: "${HAPPYRO_SERVER_INTERSERVER_USERNAME:=happyro_interserver}"
: "${HAPPYRO_SERVER_INTERSERVER_PASSWORD:?HAPPYRO_SERVER_INTERSERVER_PASSWORD is required}"
: "${HAPPYRO_SERVER_PUBLIC_HOST:=127.0.0.1}"
: "${HAPPYRO_SERVER_LOGIN_PORT:=6900}"
: "${HAPPYRO_SERVER_CHAR_PORT:=6121}"
: "${HAPPYRO_SERVER_MAP_PORT:=5121}"
: "${HAPPYRO_SERVER_WEB_PORT:=8889}"
: "${HAPPYRO_GAME_CONTROL_TOKEN:?HAPPYRO_GAME_CONTROL_TOKEN is required}"
case "$HAPPYRO_GAME_CONTROL_TOKEN$HAPPYRO_SERVER_DB_PASSWORD$HAPPYRO_SERVER_INTERSERVER_PASSWORD" in *[!A-Za-z0-9_-]*) echo 'Use generated alphanumeric secrets' >&2; exit 2 ;; esac
[ "${#HAPPYRO_SERVER_INTERSERVER_PASSWORD}" -le 23 ] || { echo 'HAPPYRO_SERVER_INTERSERVER_PASSWORD must be at most 23 characters' >&2; exit 2; }

for directory in conf/import conf/msg_conf/import; do
    mkdir -p "$directory"
    for template in "$directory-tmpl"/*; do
        target="$directory/${template##*/}"
        if [ ! -e "$target" ]; then
            cp "$template" "$target"
        fi
    done
done

cat > conf/import/inter_conf.txt <<EOF
login_server_ip: ${HAPPYRO_SERVER_DB_HOST}
login_server_port: ${HAPPYRO_SERVER_DB_PORT}
login_server_id: ${HAPPYRO_SERVER_DB_USERNAME}
login_server_pw: ${HAPPYRO_SERVER_DB_PASSWORD}
login_server_db: ${HAPPYRO_SERVER_DB_NAME}
ipban_db_ip: ${HAPPYRO_SERVER_DB_HOST}
ipban_db_port: ${HAPPYRO_SERVER_DB_PORT}
ipban_db_id: ${HAPPYRO_SERVER_DB_USERNAME}
ipban_db_pw: ${HAPPYRO_SERVER_DB_PASSWORD}
ipban_db_db: ${HAPPYRO_SERVER_DB_NAME}
char_server_ip: ${HAPPYRO_SERVER_DB_HOST}
char_server_port: ${HAPPYRO_SERVER_DB_PORT}
char_server_id: ${HAPPYRO_SERVER_DB_USERNAME}
char_server_pw: ${HAPPYRO_SERVER_DB_PASSWORD}
char_server_db: ${HAPPYRO_SERVER_DB_NAME}
map_server_ip: ${HAPPYRO_SERVER_DB_HOST}
map_server_port: ${HAPPYRO_SERVER_DB_PORT}
map_server_id: ${HAPPYRO_SERVER_DB_USERNAME}
map_server_pw: ${HAPPYRO_SERVER_DB_PASSWORD}
map_server_db: ${HAPPYRO_SERVER_DB_NAME}
web_server_ip: ${HAPPYRO_SERVER_DB_HOST}
web_server_port: ${HAPPYRO_SERVER_DB_PORT}
web_server_id: ${HAPPYRO_SERVER_DB_USERNAME}
web_server_pw: ${HAPPYRO_SERVER_DB_PASSWORD}
web_server_db: ${HAPPYRO_SERVER_DB_NAME}
log_db_ip: ${HAPPYRO_SERVER_DB_HOST}
log_db_port: ${HAPPYRO_SERVER_DB_PORT}
log_db_id: ${HAPPYRO_SERVER_DB_USERNAME}
log_db_pw: ${HAPPYRO_SERVER_DB_PASSWORD}
log_db_db: ${HAPPYRO_SERVER_LOG_DB_NAME}
EOF

cat > conf/import/login_conf.txt <<EOF
bind_ip: 0.0.0.0
login_port: ${HAPPYRO_SERVER_LOGIN_PORT}
new_account: yes
use_web_auth_token: yes
EOF

cat > conf/import/char_conf.txt <<EOF
userid: ${HAPPYRO_SERVER_INTERSERVER_USERNAME}
passwd: ${HAPPYRO_SERVER_INTERSERVER_PASSWORD}
login_ip: login
login_port: ${HAPPYRO_SERVER_LOGIN_PORT}
bind_ip: 0.0.0.0
char_ip: ${HAPPYRO_SERVER_PUBLIC_HOST}
char_port: ${HAPPYRO_SERVER_CHAR_PORT}
server_name: HappyRO
pincode_enabled: no
char_name_option: 0
EOF

cat > conf/import/map_conf.txt <<EOF
userid: ${HAPPYRO_SERVER_INTERSERVER_USERNAME}
passwd: ${HAPPYRO_SERVER_INTERSERVER_PASSWORD}
char_ip: char
char_port: ${HAPPYRO_SERVER_CHAR_PORT}
bind_ip: 0.0.0.0
map_ip: ${HAPPYRO_SERVER_PUBLIC_HOST}
map_port: ${HAPPYRO_SERVER_MAP_PORT}
game_control_socket: /run/happyro/map-control.sock
EOF

cat > conf/import/web_conf.txt <<EOF
bind_ip: 0.0.0.0
web_port: ${HAPPYRO_SERVER_WEB_PORT}
allowed_origin_cors: ${HAPPYRO_GAME_PUBLIC_URL:-http://127.0.0.1:3338}
game_control_enabled: yes
game_control_allow_remote: yes
game_control_secret: ${HAPPYRO_GAME_CONTROL_TOKEN}
game_control_socket: /run/happyro/map-control.sock
EOF

# Admin replaces this file atomically, so share its directory rather than a file mount.
if [ ! -f /run/happyro-settings/battle_conf.txt ]; then
    cp conf/import-tmpl/battle_conf.txt /run/happyro-settings/battle_conf.txt
fi
printf 'import: /run/happyro-settings/battle_conf.txt\n' > conf/import/battle_conf.txt
chown 33:33 /run/happyro-settings /run/happyro-settings/battle_conf.txt

exec "/opt/rathena/$1"
