#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/lib.sh"

unit=happyro-gateway.service
port=3338
log_file="$PROJECT_ROOT/work/runtime/gateway/gateway.log"

fail() {
	echo "gateway: $*" >&2
	exit 1
}

is_running() {
	systemctl is-active --quiet "$unit"
}

verify_gateway() {
	is_running || fail "service is not running"
	curl --fail --silent --show-error --max-time 10 \
		"http://127.0.0.1:$port/api/health" >/dev/null || fail "health endpoint failed"
	curl --fail --silent --show-error --max-time 10 \
		"http://127.0.0.1:$port/applications/pwa/index.html" >/dev/null || fail "PWA endpoint failed"

	status="$(curl --silent --output /dev/null --write-out '%{http_code}' --max-time 10 \
		-X POST "http://127.0.0.1:$port/userconfig/load")"
	[[ "$status" == 400 ]] || fail "rAthena Web API proxy returned HTTP $status, expected 400"
	echo "gateway: health, PWA, and rAthena Web API proxy are healthy"
}

start_gateway() {
	is_running && fail "service is already running"
	ss -H -ltn "sport = :$port" | rg -q ":$port[[:space:]]" && fail "port $port is already in use"
	"$PROJECT_ROOT/scripts/server.sh" verify
	"$PROJECT_ROOT/scripts/configure-gateway.sh"
	"$PROJECT_ROOT/scripts/configure-resources.sh"
	[[ -d "$GATEWAY_REPO/node_modules" ]] || (cd "$GATEWAY_REPO" && npm install --ignore-scripts)
	mkdir -p "$(dirname "$log_file")"
	: > "$log_file"
	systemd-run --quiet --collect --unit="$unit" \
		--property=Type=simple \
		--property="WorkingDirectory=$GATEWAY_REPO" \
		--property="StandardOutput=append:$log_file" \
		--property="StandardError=append:$log_file" \
		/usr/bin/node start-prod.js

	for _ in $(seq 1 200); do
		is_running || {
			tail -n 40 "$log_file" >&2 || true
			fail "service exited during startup"
		}
		curl --fail --silent --max-time 1 "http://127.0.0.1:$port/api/health" >/dev/null 2>&1 && break
		sleep 0.1
	done
	verify_gateway
}

stop_gateway() {
	if is_running; then
		if ! systemctl stop "$unit" && is_running; then
			fail "service could not be stopped"
		fi
	fi
	for _ in $(seq 1 100); do
		is_running || break
		sleep 0.1
	done
	if is_running; then
		fail "service did not stop"
	fi
}

case "${1:-}" in
	start) start_gateway ;;
	stop) stop_gateway ;;
	status)
		if is_running; then echo "gateway: running"; else echo "gateway: stopped"; fi
		;;
	verify) verify_gateway ;;
	*) fail "usage: $0 start|stop|status|verify" ;;
esac
