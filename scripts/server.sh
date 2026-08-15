#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/lib.sh"

action="${1:-}"
services=(login-server char-server map-server web-server)

fail() {
	echo "server: $*" >&2
	exit 1
}

load_profile() {
	[[ -f "$RATHENA_PROFILE" ]] || fail "missing profile: $RATHENA_PROFILE"
	set -a
	# shellcheck disable=SC1090
	source "$RATHENA_PROFILE"
	set +a
}

service_port() {
	case "$1" in
		login-server) echo "$LOGIN_PORT" ;;
		char-server) echo "$CHAR_PORT" ;;
		map-server) echo "$MAP_PORT" ;;
		web-server) echo "$WEB_PORT" ;;
	esac
}

unit_name() {
	case "$1" in
		login-server) echo happyro-login.service ;;
		char-server) echo happyro-char.service ;;
		map-server) echo happyro-map.service ;;
		web-server) echo happyro-web-api.service ;;
	esac
}

process_is_running() {
	local service="$1"
	systemctl is-active --quiet "$(unit_name "$service")"
}

port_is_listening() {
	local port="$1"
	ss -H -ltn "sport = :$port" | rg -q ":$port[[:space:]]"
}

verify_servers() {
	local service port log_file marker found
	for service in "${services[@]}"; do
		port="$(service_port "$service")"
		process_is_running "$service" || fail "$service is not running"
		port_is_listening "$port" || fail "$service is not listening on $port"
	done

	for spec in \
		"login-server|Connection of the char-server 'HappyRO' accepted" \
		"char-server|Map-server 0 loading complete" \
		"map-server|Map Server is now online" \
		"web-server|The web-server is ready"; do
		IFS='|' read -r service marker <<< "$spec"
		log_file="$RATHENA_RUNTIME/logs/$service.log"
		found=false
		for _ in $(seq 1 100); do
			if [[ -f "$log_file" ]] && rg -Fq "$marker" "$log_file"; then
				found=true
				break
			fi
			sleep 0.1
		done
		[[ "$found" == true ]] || fail "$service did not reach its connected-ready state"
	done
	echo "server: login, char, map, and web services are healthy"
}

stop_servers() {
	local service unit
	for service in web-server map-server char-server login-server; do
		unit="$(unit_name "$service")"
		if process_is_running "$service"; then
			if ! systemctl stop "$unit" && process_is_running "$service"; then
				fail "$service could not be stopped"
			fi
			for _ in $(seq 1 100); do
				systemctl is-active --quiet "$unit" || break
				sleep 0.1
			done
			if systemctl is-active --quiet "$unit"; then
				fail "$service did not stop"
			fi
		fi
	done
}

start_servers() {
	local service port unit log_file
	"$PROJECT_ROOT/scripts/database.sh" verify
	"$PROJECT_ROOT/scripts/configure-server.sh"
	mkdir -p "$RATHENA_RUNTIME/logs"

	for service in "${services[@]}"; do
		process_is_running "$service" && fail "$service is already running"
		port="$(service_port "$service")"
		port_is_listening "$port" && fail "port $port is already in use"
		[[ -x "$SERVER_REPO/$service" ]] || fail "missing executable: $SERVER_REPO/$service"
	done

	for service in "${services[@]}"; do
		port="$(service_port "$service")"
		unit="$(unit_name "$service")"
		log_file="$RATHENA_RUNTIME/logs/$service.log"
		: > "$log_file"
		systemd-run --quiet --collect --unit="$unit" \
			--property=Type=simple \
			--property="WorkingDirectory=$SERVER_REPO" \
			--property="StandardOutput=append:$log_file" \
			--property="StandardError=append:$log_file" \
			"$SERVER_REPO/$service"
		for _ in $(seq 1 100); do
			process_is_running "$service" || {
				tail -n 30 "$RATHENA_RUNTIME/logs/$service.log" >&2 || true
				stop_servers
				fail "$service exited during startup"
			}
			port_is_listening "$port" && break
			sleep 0.1
		done
		port_is_listening "$port" || {
			stop_servers
			fail "$service did not listen on $port"
		}
	done

	verify_servers
}

status_servers() {
	local service port state
	printf '%-14s %-8s %s\n' service port state
	for service in "${services[@]}"; do
		port="$(service_port "$service")"
		state=stopped
		process_is_running "$service" && state=running
		printf '%-14s %-8s %s\n' "$service" "$port" "$state"
	done
}

command -v rg >/dev/null || fail "missing command: rg"
command -v ss >/dev/null || fail "missing command: ss"
command -v systemctl >/dev/null || fail "missing command: systemctl"
command -v systemd-run >/dev/null || fail "missing command: systemd-run"
load_profile

case "$action" in
	start) start_servers ;;
	stop) stop_servers ;;
	status) status_servers ;;
	verify) verify_servers ;;
	*) fail "usage: $0 start|stop|status|verify" ;;
esac
