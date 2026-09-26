#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "$0")/../.." && pwd)"
runtime="$project_root/work/runtime/native"
database_container="happyro-native-database"
action=""
color=true
for argument in "$@"; do
  case "$argument" in
    start|stop|status) action="$argument" ;;
    --no-color) color=false ;;
    -h|--help) action=help ;;
    *) echo "unknown option: $argument" >&2; exit 2 ;;
  esac
done
title='' section='' command_color='' example='' reset=''
if [[ "$color" == true ]]; then
  title=$'\033[1;36m'; section=$'\033[1;33m'; command_color=$'\033[1;32m'; example=$'\033[36m'; reset=$'\033[0m'
fi
if [[ -z "$action" || "$action" == help ]]; then
  printf '\n%sHappyRO Mac 本机服务%s\n\n' "$title" "$reset"
  printf '%s用法%s\n  %s%s start|stop|status%s [--no-color]\n\n' "$section" "$reset" "$command_color" "$0" "$reset"
  printf '管理独立 Docker 数据库 happyro-native-database，以及 launchd 中的原生游戏服务、Gateway 和 Admin。\n不会初始化数据库或重新构建程序，停止服务时保留数据库数据。\n\n'
  printf '%s常用例子%s\n  %s%s status%s\n  %s%s stop --no-color%s\n  %s%s start%s\n\n' "$section" "$reset" "$example" "$0" "$reset" "$example" "$0" "$reset" "$example" "$0" "$reset"
  exit 0
fi
[[ "$(uname -s)" == Darwin ]] || { echo 'macOS is required' >&2; exit 1; }
domain="gui/$(id -u)"
services=(database login char map web gateway admin-backend admin-frontend)
if [[ "$action" == stop ]]; then services=(admin-frontend admin-backend gateway web map char login database); fi
for service in "${services[@]}"; do
  if [[ "$service" == database ]]; then
    case "$action" in
      start)
        docker start "$database_container" >/dev/null
        ready=false
        for attempt in {1..30}; do
          health="$(docker inspect --format '{{.State.Health.Status}}' "$database_container")"
          if [[ "$health" == healthy ]]; then ready=true; break; fi
          sleep 1
        done
        [[ "$ready" == true ]] || { echo 'database: Docker health check did not pass; applications were not started' >&2; exit 1; }
        printf 'database: Docker healthy\n'
        ;;
      stop)
        docker stop --timeout 30 "$database_container" >/dev/null
        printf 'database: Docker stopped\n'
        ;;
      status)
        if details="$(docker inspect --format '{{.State.Status}} ({{.State.Health.Status}})' "$database_container" 2>/dev/null)"; then
          printf 'database: Docker %s\n' "$details"
        else printf 'database: Docker unavailable\n'; fi
        ;;
    esac
    continue
  fi
  label="local.happyro.$service"
  plist="$runtime/launchd/$label.plist"
  case "$action" in
    start)
      [[ -f "$plist" ]] || { echo "missing service configuration: $plist" >&2; exit 1; }
      if ! launchctl print "$domain/$label" >/dev/null 2>&1; then launchctl bootstrap "$domain" "$plist"; fi
      printf '%s: loaded\n' "$service"
      ;;
    stop)
      if launchctl print "$domain/$label" >/dev/null 2>&1; then launchctl bootout "$domain/$label"; fi
      printf '%s: stopped\n' "$service"
      ;;
    status)
      if details="$(launchctl print "$domain/$label" 2>/dev/null)"; then
        printf '%s: %s\n' "$service" "$(sed -n 's/^[[:space:]]*state = //p' <<< "$details" | head -1)"
      else printf '%s: stopped\n' "$service"; fi
      ;;
  esac
done
