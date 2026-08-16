#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/lib.sh"

runtime_client="$PROJECT_ROOT/inputs/runtime/kro-20211105/client"
resources_dir="$GATEWAY_REPO/resources"

[[ -d "$runtime_client" ]] || {
	echo "missing runtime client: $runtime_client" >&2
	exit 1
}
[[ -f "$runtime_client/data.grf" ]] || {
	echo "missing runtime GRF: $runtime_client/data.grf" >&2
	exit 1
}
[[ -f "$runtime_client/DATA.INI" ]] || {
	echo "missing Web DATA.INI: $runtime_client/DATA.INI" >&2
	exit 1
}
cmp -s "$runtime_client/DATA.INI" <(printf '[Data]\n1=data.grf\n') || {
	echo "unexpected Web DATA.INI content: $runtime_client/DATA.INI" >&2
	exit 1
}

mkdir -p "$resources_dir"

ensure_link() {
	local link_path="$1"
	local target="$2"

	if [[ -L "$link_path" ]]; then
		[[ "$(readlink "$link_path")" == "$target" ]] || {
			echo "refusing to replace unexpected symlink: $link_path" >&2
			exit 1
		}
	elif [[ -e "$link_path" ]]; then
		echo "refusing to replace existing resource: $link_path" >&2
		exit 1
	else
		ln -s "$target" "$link_path"
	fi
}

ensure_link "$resources_dir/data.grf" \
	"../../../inputs/runtime/kro-20211105/client/data.grf"
ensure_link "$resources_dir/DATA.INI" \
	"../../../inputs/runtime/kro-20211105/client/DATA.INI"

for loose_dir in BGM System; do
	if [[ -d "$runtime_client/$loose_dir" ]]; then
		ensure_link "$GATEWAY_REPO/$loose_dir" \
			"../../inputs/runtime/kro-20211105/client/$loose_dir"
		echo "configured: $GATEWAY_REPO/$loose_dir"
	fi
done

echo "configured: $resources_dir/data.grf"
echo "configured: $resources_dir/DATA.INI"
