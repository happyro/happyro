#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/../../.." && pwd)"
color=true
args=()
for argument in "$@"; do
 if [[ "$argument" == --no-color ]]; then color=false; else args+=("$argument"); fi
done
command_name="${args[0]:-help}"
if [[ "$command_name" == help || "$command_name" == --help || "$command_name" == -h ]]; then
 cyan='' yellow='' green='' example='' reset=''
 if [[ "$color" == true ]]; then cyan=$'\033[1;36m'; yellow=$'\033[1;33m'; green=$'\033[1;32m'; example=$'\033[36m'; reset=$'\033[0m'; fi
 printf '\n%sHappyRO item subtypes%s\n\n%sUsage%s\n  %sbash tools/resources/catalog/generate-item-subtypes.sh generate|check%s [--no-color]\n\n%sExamples%s\n  %sbash tools/resources/catalog/generate-item-subtypes.sh generate --no-color%s\n\n' "$cyan" "$reset" "$yellow" "$reset" "$green" "$reset" "$yellow" "$reset" "$example" "$reset"
 exit 0
fi
[[ ${#args[@]} -eq 1 && ( "$command_name" == generate || "$command_name" == check ) ]] || { echo 'Use generate or check; see --help' >&2; exit 2; }
options=()
[[ "$command_name" != check ]] || options+=(--check)
[[ "$color" == true ]] || options+=(--no-color)
cd "$root/repos/happyro-api"
exec go run -mod=readonly ./cmd/happyro-api catalog export-subtypes \
 --server-items resources/game-data/items/renewal.json \
 --output "$root/repos/happyro-client/src/DB/Items/ItemSubtypes.generated.json" "${options[@]}"
