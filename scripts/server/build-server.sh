#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/../_lib/lib.sh"

build_dir="$PROJECT_ROOT/work/server-build/renewal-20211103"
cmake -S "$SERVER_REPO" -B "$build_dir" -DPACKETVER=20211103
if command -v nproc >/dev/null 2>&1; then
	jobs="$(nproc)"
else
	jobs="$(getconf _NPROCESSORS_ONLN)"
fi
cmake --build "$build_dir" --parallel "$jobs"
