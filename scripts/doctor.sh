#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/lib.sh"

for command in git node npm cmake c++ docker openssl rg ss systemctl systemd-run; do
	command -v "$command" >/dev/null || { echo "missing command: $command" >&2; exit 1; }
done
docker compose version >/dev/null

check_upstream_base roBrowserLegacy "$CLIENT_REPO" "$ROBROWSERLEGACY_UPSTREAM_COMMIT"
check_upstream_base rAthena "$SERVER_REPO" "$RATHENA_UPSTREAM_COMMIT"
check_upstream_base RemoteClient-JS "$GATEWAY_REPO" "$REMOTE_CLIENT_JS_UPSTREAM_COMMIT"

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
git -C "$GATEWAY_REPO" apply --check --reverse \
	"$PROJECT_ROOT/patches/remote-client-js/0001-disable-unavailable-esrgan-dependency.patch"
rg -q '^WS_ALLOWED_TARGETS=10\.24\.1\.1:6900,10\.24\.1\.1:6121,10\.24\.1\.1:5121$' \
	"$PROJECT_ROOT/deploy/remote-client/.env.example"
rg -q '^MARIADB_IMAGE=mariadb:10\.11@sha256:[0-9a-f]{64}$' "$MARIADB_PROFILE"
rg -q '^DB_BIND_IP=127\.0\.0\.1$' "$MARIADB_PROFILE"
rg -q '^DB_PORT=33062$' "$MARIADB_PROFILE"
rg -q '^SERVER_LAN_IP=10\.24\.1\.1$' "$RATHENA_PROFILE"
rg -q '^WEB_BIND_IP=127\.0\.0\.1$' "$RATHENA_PROFILE"
rg -q '^WEB_PORT=8889$' "$RATHENA_PROFILE"
bash -n \
	"$PROJECT_ROOT/scripts/database.sh" \
	"$PROJECT_ROOT/scripts/configure-server.sh" \
	"$PROJECT_ROOT/scripts/server.sh" \
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
