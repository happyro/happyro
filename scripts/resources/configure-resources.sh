#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/../_lib/lib.sh"

runtime_client="$PROJECT_ROOT/inputs/runtime/kro-20211105/client"
resources_dir="$GATEWAY_REPO/resources"
message_table="$PROJECT_ROOT/localization/client/data/msgstringtable.txt"
title_table="$PROJECT_ROOT/localization/client/data/titletable.json"
skill_description_table="$PROJECT_ROOT/localization/client/data/skilldesctable.txt"
# Archived itemlocalization overlay; itemInfo_true.lub is the active source.
# item_localization_table="$PROJECT_ROOT/localization/client/data/itemlocalization.json"

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
[[ -f "$message_table" ]] || {
	echo "missing localized message table: $message_table" >&2
	exit 1
}
[[ "$(wc -l < "$message_table")" -ge 3977 ]] || {
	echo "localized message table does not cover client message IDs: $message_table" >&2
	exit 1
}
[[ -f "$title_table" ]] || {
	echo "missing localized title table: $title_table" >&2
	exit 1
}
jq -e 'length == 47 and ."1000" == "生命的交汇" and ."1046" == "造王者"' \
	"$title_table" >/dev/null || {
	echo "localized title table is incomplete: $title_table" >&2
	exit 1
}
[[ -f "$skill_description_table" ]] || {
	echo "missing localized skill description table: $skill_description_table" >&2
	exit 1
}
rg -q '^NV_BASIC#' "$skill_description_table" || {
	echo "localized skill description table is incomplete: $skill_description_table" >&2
	exit 1
}
if false; then # Archived itemlocalization overlay validation.
[[ -f "$item_localization_table" ]] || {
	echo "missing item localization table: $item_localization_table" >&2
	exit 1
}
jq -e '
	length == 16127 and
	."501"[1] == "红色药水" and
	all(.[];
		length == 4 and
		(.[0] | type == "string") and
		(.[1] | type == "string") and
		(.[2] | type == "array") and
		(.[3] | type == "array")
	)
' "$item_localization_table" >/dev/null || {
	echo "item localization table is incomplete: $item_localization_table" >&2
	exit 1
}
if rg -q '[가-힣ㄱ-ㅎㅏ-ㅣ]' "$item_localization_table"; then
	echo "item localization table contains Korean text: $item_localization_table" >&2
	exit 1
fi
fi

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

for loose_dir in AI BGM System; do
	if [[ -d "$runtime_client/$loose_dir" ]]; then
		ensure_link "$GATEWAY_REPO/$loose_dir" \
			"../../inputs/runtime/kro-20211105/client/$loose_dir"
		echo "configured: $GATEWAY_REPO/$loose_dir"
	fi
done

echo "configured: $resources_dir/data.grf"
echo "configured: $resources_dir/DATA.INI"
echo "configured: $message_table"
echo "configured: $title_table"
echo "configured: $skill_description_table"
# Archived itemlocalization overlay is not configured.
