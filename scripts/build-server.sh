#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/lib.sh"

build_dir="$PROJECT_ROOT/work/server-build/renewal-20211103"
cmake -S "$SERVER_REPO" -B "$build_dir" -DPACKETVER=20211103
cmake --build "$build_dir" --parallel "$(nproc)"

