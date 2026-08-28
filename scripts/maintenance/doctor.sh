#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/../_lib/lib.sh"

for command in git node npm cmake c++ docker openssl rg ss curl systemctl systemd-run; do
	command -v "$command" >/dev/null || { echo "missing command: $command" >&2; exit 1; }
done
docker compose version >/dev/null

check_upstream_base roBrowserLegacy "$CLIENT_REPO" "$ROBROWSERLEGACY_UPSTREAM_COMMIT"
check_upstream_base rAthena "$SERVER_REPO" "$RATHENA_UPSTREAM_COMMIT"
check_upstream_base HappyRO-Gateway "$GATEWAY_REPO" "$REMOTE_CLIENT_JS_UPSTREAM_COMMIT"
[[ "$(git -C "$GATEWAY_REPO" rev-parse HEAD)" == "$HAPPYRO_GATEWAY_COMMIT" ]] || {
	echo "HappyRO Gateway is not at locked commit $HAPPYRO_GATEWAY_COMMIT; run git checkout from versions/sources.lock" >&2
	exit 1
}

rg -q "packetver: 20211103" "$PROJECT_ROOT/configs/Config.happyro.js"
rg -q "packetKeys: false" "$PROJECT_ROOT/configs/Config.happyro.js"
cmp -s "$PROJECT_ROOT/configs/Config.happyro.js" \
	"$CLIENT_REPO/applications/pwa/Config.happyro.js" || {
	echo "generated Config.happyro.js is missing or stale; run make configure-client" >&2
	exit 1
}
rg -q '<script type="text/javascript" src="Config\.happyro\.js"></script>' \
	"$CLIENT_REPO/applications/pwa/index.html"
rg -q 'window\.ROConfigHappyRO' "$CLIENT_REPO/applications/pwa/index.html"
rg -q '^#undef PACKET_OBFUSCATION$' "$SERVER_REPO/src/custom/defines_post.hpp"
! rg -q '@chicowall/robrowser-esrgan' "$GATEWAY_REPO/package.json"
rg -q '^WS_ALLOWED_TARGETS=127\.0\.0\.1:6900,127\.0\.0\.1:6121,127\.0\.0\.1:5121$' \
	"$PROJECT_ROOT/deploy/remote-client/.env.example"
rg -q '^RATHENA_WEB_API_URL=http://127\.0\.0\.1:8889$' \
	"$PROJECT_ROOT/deploy/remote-client/.env.example"
rg -q '^MARIADB_IMAGE=mariadb:10\.11@sha256:[0-9a-f]{64}$' "$MARIADB_PROFILE"
rg -q '^DB_BIND_IP=127\.0\.0\.1$' "$MARIADB_PROFILE"
rg -q '^DB_PORT=33062$' "$MARIADB_PROFILE"
rg -q '^SERVER_LAN_IP=127\.0\.0\.1$' "$RATHENA_PROFILE"
rg -q '^WEB_BIND_IP=127\.0\.0\.1$' "$RATHENA_PROFILE"
rg -q '^WEB_PORT=8889$' "$RATHENA_PROFILE"
rg -q '^pincode_enabled: no$' "$SERVER_REPO/conf/import/char_conf.txt"
rg -q '^char_name_option: 0$' "$SERVER_REPO/conf/import/char_conf.txt"
bash -n \
	"$PROJECT_ROOT/scripts/database/database.sh" \
	"$PROJECT_ROOT/scripts/server/configure-server.sh" \
	"$PROJECT_ROOT/scripts/gateway/gateway.sh" \
	"$PROJECT_ROOT/scripts/account/test-account.sh" \
	"$PROJECT_ROOT/scripts/account/automation-account.sh" \
	"$PROJECT_ROOT/scripts/server/server.sh" \
	"$PROJECT_ROOT/deploy/mariadb/init/20-happyro-databases.sh"
git -C "$PROJECT_ROOT" check-ignore -q work/runtime/mariadb-10.11/secrets.env

if [[ -f "$MARIADB_RUNTIME/compose.env" ]]; then
	docker compose --project-name happyro \
		--env-file "$MARIADB_RUNTIME/compose.env" \
		--file "$MARIADB_COMPOSE_FILE" config --quiet
fi

if rg -n "grf\.robrowser\.com|connect\.robrowser\.com" \
	"$PROJECT_ROOT/configs" "$PROJECT_ROOT/deploy"; then
	echo "public runtime service found in HappyRO configuration" >&2
	exit 1
fi

echo "doctor: required checks passed"
