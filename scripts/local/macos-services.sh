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
  printf '管理独立 Docker 数据库 happyro-native-database，以及 launchd 中的原生游戏服务、Gateway、Admin 和 OpenResty。\n不会初始化数据库或重新构建程序，停止服务时保留数据库数据。\n\n'
  printf '%s常用例子%s\n  %s%s status%s\n  %s%s stop --no-color%s\n  %s%s start%s\n\n' "$section" "$reset" "$example" "$0" "$reset" "$example" "$0" "$reset" "$example" "$0" "$reset"
  exit 0
fi
[[ "$(uname -s)" == Darwin ]] || { echo 'macOS is required' >&2; exit 1; }
if [[ "$action" == start ]]; then
  python3 - "$runtime/launchd/local.happyro.api.plist" <<'PYTHON'
import plistlib
import sys
from pathlib import Path
path = Path(sys.argv[1])
if not path.is_file():
    raise SystemExit(f'Missing API service configuration: {path}')
arguments = plistlib.loads(path.read_bytes()).get('ProgramArguments', [])
if 'artisan' in arguments or any(Path(value).name.startswith('php') for value in arguments if isinstance(value, str)):
    raise SystemExit('API launchd still uses PHP. Prepare and install the Go configuration with tools/operations/native_api.py before starting services.')
PYTHON
fi
domain="gui/$(id -u)"
services=(database login char map web gateway api admin-frontend openresty)
if [[ "$action" == stop ]]; then services=(openresty admin-frontend api gateway web map char login database); fi
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
  if [[ "$service" == openresty ]]; then
    label="local.happyro.openresty"
    plist="/Library/LaunchDaemons/$label.plist"
    case "$action" in
      start)
        [[ -f "$plist" ]] || { echo "missing service configuration: $plist" >&2; exit 1; }
        if ! launchctl print "system/$label" >/dev/null 2>&1; then sudo launchctl bootstrap system "$plist"; fi
        printf 'openresty: loaded\n'
        ;;
      stop)
        if launchctl print "system/$label" >/dev/null 2>&1; then sudo launchctl bootout "system/$label"; fi
        printf 'openresty: stopped\n'
        ;;
      status)
        if details="$(launchctl print "system/$label" 2>/dev/null)"; then
          printf 'openresty: %s\n' "$(sed -n 's/^[[:space:]]*state = //p' <<< "$details" | head -1)"
        else printf 'openresty: stopped\n'; fi
        ;;
    esac
    continue
  fi
  label="local.happyro.$service"
  plist="$runtime/launchd/$label.plist"
  case "$action" in
    start)
      [[ -f "$plist" ]] || { echo "missing service configuration: $plist" >&2; exit 1; }
      if [[ "$service" == map || "$service" == char ]]; then
        (
          source "$project_root/deploy/rathena/profile.env"
          python3 - "$plist" "$service" "${HAPPYRO_GAME_ENTITY_SYNC_RANGE_CELLS:-}" "${HAPPYRO_GAME_MAX_WALK_PATH_CELLS:-}" "${HAPPYRO_GAME_NAVIGATION_TELEPORT_POLICY:-}" "${HAPPYRO_GAME_NAVIGATION_TELEPORT_CROSS_MAP_ENABLED:-}" "${HAPPYRO_GAME_NAVIGATION_TELEPORT_COOLDOWN_SECONDS:-}" "${HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_POLICY:-}" "${HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_COOLDOWN_SECONDS:-}" "${HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_DURATION_SECONDS:-}" "${HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_ALLOW_BOSS_ENABLED:-}" "${HAPPYRO_GAME_TOOLS_CHARACTER_MAINTENANCE_POLICY:-}" "${HAPPYRO_GAME_TOOLS_GAME_SETTINGS_POLICY:-}" "${HAPPYRO_GAME_TOOLS_ITEM_GRANT_POLICY:-}" "${HAPPYRO_GAME_BASE_EXP_RATE_PERCENT:-}" "${HAPPYRO_GAME_JOB_EXP_RATE_PERCENT:-}" "${HAPPYRO_GAME_ITEM_RATE_COMMON_PERCENT:-}" "${HAPPYRO_GAME_ITEM_RATE_COMMON_BOSS_PERCENT:-}" "${HAPPYRO_GAME_ITEM_RATE_COMMON_MVP_PERCENT:-}" "${HAPPYRO_GAME_ITEM_RATE_HEAL_PERCENT:-}" "${HAPPYRO_GAME_ITEM_RATE_HEAL_BOSS_PERCENT:-}" "${HAPPYRO_GAME_ITEM_RATE_HEAL_MVP_PERCENT:-}" "${HAPPYRO_GAME_ITEM_RATE_USE_PERCENT:-}" "${HAPPYRO_GAME_ITEM_RATE_USE_BOSS_PERCENT:-}" "${HAPPYRO_GAME_ITEM_RATE_USE_MVP_PERCENT:-}" "${HAPPYRO_GAME_ITEM_RATE_EQUIP_PERCENT:-}" "${HAPPYRO_GAME_ITEM_RATE_EQUIP_BOSS_PERCENT:-}" "${HAPPYRO_GAME_ITEM_RATE_EQUIP_MVP_PERCENT:-}" "${HAPPYRO_GAME_ITEM_RATE_CARD_PERCENT:-}" "${HAPPYRO_GAME_ITEM_RATE_CARD_BOSS_PERCENT:-}" "${HAPPYRO_GAME_ITEM_RATE_CARD_MVP_PERCENT:-}" "${HAPPYRO_GAME_REFINE_CHANCE_RATE_PERCENT:-}" "${HAPPYRO_GAME_GRADE_CHANCE_RATE_PERCENT:-}" "${HAPPYRO_GAME_REFINE_ALWAYS_SUCCESS_ENABLED:-}" "${HAPPYRO_GAME_GRADE_ALWAYS_SUCCESS_ENABLED:-}" "${HAPPYRO_GAME_NAVIGATION_MAP_CHANNELS_ENABLED:-}" "${HAPPYRO_CHARACTER_START_MODE:-classic}" <<'PYTHON'
import plistlib
import sys
from pathlib import Path
path = Path(sys.argv[1])
config = plistlib.loads(path.read_bytes())
environment = config.setdefault('EnvironmentVariables', {})
if sys.argv[2] == 'char':
    environment['HAPPYRO_CHARACTER_START_MODE'] = sys.argv[-1]
else:
    for key, value in zip(('HAPPYRO_GAME_ENTITY_SYNC_RANGE_CELLS', 'HAPPYRO_GAME_MAX_WALK_PATH_CELLS', 'HAPPYRO_GAME_NAVIGATION_TELEPORT_POLICY', 'HAPPYRO_GAME_NAVIGATION_TELEPORT_CROSS_MAP_ENABLED', 'HAPPYRO_GAME_NAVIGATION_TELEPORT_COOLDOWN_SECONDS', 'HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_POLICY', 'HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_COOLDOWN_SECONDS', 'HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_DURATION_SECONDS', 'HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_ALLOW_BOSS_ENABLED', 'HAPPYRO_GAME_TOOLS_CHARACTER_MAINTENANCE_POLICY', 'HAPPYRO_GAME_TOOLS_GAME_SETTINGS_POLICY', 'HAPPYRO_GAME_TOOLS_ITEM_GRANT_POLICY', 'HAPPYRO_GAME_BASE_EXP_RATE_PERCENT', 'HAPPYRO_GAME_JOB_EXP_RATE_PERCENT', 'HAPPYRO_GAME_ITEM_RATE_COMMON_PERCENT', 'HAPPYRO_GAME_ITEM_RATE_COMMON_BOSS_PERCENT', 'HAPPYRO_GAME_ITEM_RATE_COMMON_MVP_PERCENT', 'HAPPYRO_GAME_ITEM_RATE_HEAL_PERCENT', 'HAPPYRO_GAME_ITEM_RATE_HEAL_BOSS_PERCENT', 'HAPPYRO_GAME_ITEM_RATE_HEAL_MVP_PERCENT', 'HAPPYRO_GAME_ITEM_RATE_USE_PERCENT', 'HAPPYRO_GAME_ITEM_RATE_USE_BOSS_PERCENT', 'HAPPYRO_GAME_ITEM_RATE_USE_MVP_PERCENT', 'HAPPYRO_GAME_ITEM_RATE_EQUIP_PERCENT', 'HAPPYRO_GAME_ITEM_RATE_EQUIP_BOSS_PERCENT', 'HAPPYRO_GAME_ITEM_RATE_EQUIP_MVP_PERCENT', 'HAPPYRO_GAME_ITEM_RATE_CARD_PERCENT', 'HAPPYRO_GAME_ITEM_RATE_CARD_BOSS_PERCENT', 'HAPPYRO_GAME_ITEM_RATE_CARD_MVP_PERCENT', 'HAPPYRO_GAME_REFINE_CHANCE_RATE_PERCENT', 'HAPPYRO_GAME_GRADE_CHANCE_RATE_PERCENT', 'HAPPYRO_GAME_REFINE_ALWAYS_SUCCESS_ENABLED', 'HAPPYRO_GAME_GRADE_ALWAYS_SUCCESS_ENABLED', 'HAPPYRO_GAME_NAVIGATION_MAP_CHANNELS_ENABLED'), sys.argv[3:-1]):
        environment[key] = value
path.write_bytes(plistlib.dumps(config))
PYTHON
        )
      fi
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
