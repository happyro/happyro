#!/usr/bin/env bash
set -euo pipefail

release=/opt/happyro-demo/current
runtime=/root/happyro/kro-20211105/client
config_dir=/etc/happyro

usage() {
	local title=$'\033[1;36m' section=$'\033[1;33m' command=$'\033[1;32m' example=$'\033[36m' reset=$'\033[0m'
	[[ "${NO_COLOR:-}" ]] && title='' section='' command='' example='' reset=''
	printf '\n%sHappyRO runtime configuration%s\n\n' "$title" "$reset"
	printf '%sUsage%s\n  %sconfigure-runtime.sh%s configure [--no-color]\n\n' "$section" "$reset" "$command" "$reset"
	printf '%sExample%s\n  %sconfigure-runtime.sh%s configure\n\n' "$section" "$reset" "$example" "$reset"
}

[[ "${2:-}" == --no-color ]] && NO_COLOR=1
[[ "${1:-}" == configure ]] || { usage; [[ $# -eq 0 ]] && exit 0 || exit 2; }

for path in \
	"$release/rathena/login-server" \
	"$release/gateway/start-prod.js" \
	"$release/client/index.html" \
	"$runtime/data.grf" \
	"$runtime/DATA.INI"; do
	[[ -e "$path" ]] || { echo "configure-runtime: missing $path" >&2; exit 1; }
done

install -d -m 0700 "$config_dir"
umask 077
if [[ ! -f "$config_dir/secrets.env" ]]; then
	{
		printf 'DB_PASSWORD=%s\n' "$(openssl rand -hex 24)"
		printf 'INTERSERVER_USER=happyro\n'
		# The inter-server packet reserves 24 bytes including the terminator.
		printf 'INTERSERVER_PASSWORD=%s\n' "$(openssl rand -hex 10)"
	} > "$config_dir/secrets.env"
fi

set -a
# shellcheck disable=SC1090
source "$config_dir/secrets.env"
set +a

cat > "$config_dir/database.env" <<EOF
DB_PORT=33062
DB_MAIN_DATABASE=happyro
DB_LOG_DATABASE=happyro_log
DB_USER=happyro
DB_PASSWORD=$DB_PASSWORD
INTERSERVER_USER=$INTERSERVER_USER
INTERSERVER_PASSWORD=$INTERSERVER_PASSWORD
SERVER_SQL_DIR=$release/rathena/sql-files
EOF

import_dir="$release/rathena/conf/import"
install -d "$import_dir" "$release/rathena/db/import"

cat > "$import_dir/inter_conf.txt" <<EOF
login_server_ip: 127.0.0.1
login_server_port: 33062
login_server_id: happyro
login_server_pw: $DB_PASSWORD
login_server_db: happyro
ipban_db_ip: 127.0.0.1
ipban_db_port: 33062
ipban_db_id: happyro
ipban_db_pw: $DB_PASSWORD
ipban_db_db: happyro
char_server_ip: 127.0.0.1
char_server_port: 33062
char_server_id: happyro
char_server_pw: $DB_PASSWORD
char_server_db: happyro
map_server_ip: 127.0.0.1
map_server_port: 33062
map_server_id: happyro
map_server_pw: $DB_PASSWORD
map_server_db: happyro
web_server_ip: 127.0.0.1
web_server_port: 33062
web_server_id: happyro
web_server_pw: $DB_PASSWORD
web_server_db: happyro
log_db_ip: 127.0.0.1
log_db_port: 33062
log_db_id: happyro
log_db_pw: $DB_PASSWORD
log_db_db: happyro_log
EOF

cat > "$import_dir/login_conf.txt" <<'EOF'
bind_ip: 127.0.0.1
login_port: 6900
new_account: no
chars_per_account: 15
use_web_auth_token: yes
EOF

cat > "$import_dir/char_conf.txt" <<EOF
userid: $INTERSERVER_USER
passwd: $INTERSERVER_PASSWORD
login_ip: 127.0.0.1
login_port: 6900
bind_ip: 127.0.0.1
char_ip: 127.0.0.1
char_port: 6121
server_name: HappyRO Demo
pincode_enabled: no
EOF

cat > "$import_dir/map_conf.txt" <<EOF
userid: $INTERSERVER_USER
passwd: $INTERSERVER_PASSWORD
char_ip: 127.0.0.1
char_port: 6121
bind_ip: 127.0.0.1
map_ip: 127.0.0.1
map_port: 5121
EOF

cat > "$import_dir/web_conf.txt" <<'EOF'
bind_ip: 127.0.0.1
web_port: 8889
allowed_origin_cors: https://happyro-demo.kugarocks.com
EOF
: > "$import_dir/packet_conf.txt"
chmod 0600 "$import_dir/inter_conf.txt" "$import_dir/char_conf.txt" "$import_dir/map_conf.txt"

if [[ ! -e "$release/rathena/db/import/map_cache.dat" ]]; then
	ln -s ../re/map_cache.dat "$release/rathena/db/import/map_cache.dat"
fi

install -d "$release/gateway/resources"
ln -sfn "$runtime/data.grf" "$release/gateway/resources/data.grf"
ln -sfn "$runtime/DATA.INI" "$release/gateway/resources/DATA.INI"
for directory in AI BGM System; do
	[[ -d "$runtime/$directory" ]] && ln -sfn "$runtime/$directory" "$release/gateway/$directory"
done

cat > "$config_dir/gateway.env" <<EOF
PORT=3338
HOST=127.0.0.1
CLIENT_PUBLIC_URL=https://happyro-demo.kugarocks.com
NODE_ENV=production
CACHE_MAX_FILES=5000
CACHE_MAX_MEMORY_MB=384
CACHE_WARM_UP=false
ENABLE_WSPROXY=true
ENABLE_STATIC_SERVE=true
ROBROWSER_PATH=$release/client
ROBROWSER_PUBLIC_PATH=/applications/pwa
WS_ALLOWED_TARGETS=127.0.0.1:6900,127.0.0.1:6121,127.0.0.1:5121
RATHENA_WEB_API_URL=http://127.0.0.1:8889
ESRGAN_ENABLED=false
DATA_OVERRIDE_PATH=$release/localization/client/data
EOF
chmod 0600 "$config_dir"/*.env
echo 'configure-runtime: complete'
