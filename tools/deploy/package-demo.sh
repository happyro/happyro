#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CLIENT_REPO="$PROJECT_ROOT/repos/happyro-client"
SERVER_REPO="$PROJECT_ROOT/repos/happyro-server"
GATEWAY_REPO="$PROJECT_ROOT/vendor/robrowserlegacy-remote-client-js"
DEFAULT_OUTPUT="$PROJECT_ROOT/work/deploy/happyro-demo-$(date +%Y%m%d-%H%M).tar.gz"

usage() {
	local title=$'\033[1;36m' section=$'\033[1;33m' command=$'\033[1;32m' example=$'\033[36m' reset=$'\033[0m'
	[[ "${color:-true}" == true ]] || title='' section='' command='' example='' reset=''
	printf '\n%sHappyRO demo package tool%s\n\n' "$title" "$reset"
	printf '%sUsage%s\n  %spackage-demo.sh%s --output <archive.tar.gz> [--build] [--no-color]\n\n' "$section" "$reset" "$command" "$reset"
	printf '%sOptions%s\n' "$section" "$reset"
	cat <<'EOF'
  --output <archive.tar.gz>  Output archive (default: timestamped tar.gz in work/deploy)
  --build               Build the client and server before packaging
  --no-color             Disable ANSI colors in this help and errors

EOF
	printf '%sExamples%s\n  %stools/deploy/package-demo.sh%s --output work/deploy/happyro-demo-20260828-1816.tar.gz\n  %stools/deploy/package-demo.sh%s --build --output work/deploy/happyro-demo-20260828-1816.tar.gz\n\n' "$section" "$reset" "$example" "$reset" "$example" "$reset"
}

build=false
color=true
archive="$DEFAULT_OUTPUT"

if [[ $# -eq 0 ]]; then
	usage
	exit 0
fi

while [[ $# -gt 0 ]]; do
	case "$1" in
		--output)
			[[ $# -ge 2 ]] || { echo "package-demo: --output requires an archive path" >&2; exit 2; }
			archive="$2"
			shift 2
			;;
		--build)
			build=true
			shift
			;;
		--no-color)
			color=false
			shift
			;;
		-h|--help)
			usage
			exit 0
			;;
		*)
			echo "package-demo: unknown option: $1" >&2
			usage >&2
			exit 2
			;;
	esac
done

fail() {
	echo "package-demo: $*" >&2
	exit 1
}

repository_version() {
	local repository="$1" version
	version="$(git -C "$repository" rev-parse HEAD)"
	[[ -z "$(git -C "$repository" status --porcelain --untracked-files=normal)" ]] || version+='-dirty'
	printf '%s\n' "$version"
}

[[ "$archive" == *.tar.gz ]] || fail "output must end with .tar.gz"
output="$(mktemp -d "${TMPDIR:-/tmp}/happyro-demo-package.XXXXXX")"
trap 'rm -rf "$output"' EXIT
mkdir -p "$(dirname "$archive")"
[[ -d "$CLIENT_REPO" ]] || fail "missing client repository: $CLIENT_REPO"
[[ -d "$SERVER_REPO" ]] || fail "missing server repository: $SERVER_REPO"
[[ -d "$GATEWAY_REPO" ]] || fail "missing gateway repository: $GATEWAY_REPO"
[[ -f "$PROJECT_ROOT/configs/Config.happyro.js" ]] || fail "missing HappyRO client configuration"

if [[ "$build" == true ]]; then
	command -v npm >/dev/null || fail "missing npm"
	command -v cmake >/dev/null || fail "missing cmake"
	(cd "$CLIENT_REPO" && npm run build:pwa)
	cmake -S "$SERVER_REPO" -B "$SERVER_REPO/build" -DPACKETVER=20211103
	cmake --build "$SERVER_REPO/build" --parallel 2
fi

[[ -f "$CLIENT_REPO/dist/Web/index.html" ]] || fail "missing client build; run with --build"
for executable in login-server char-server map-server web-server; do
	[[ -x "$SERVER_REPO/$executable" ]] || fail "missing server executable: $SERVER_REPO/$executable"
done

mkdir -p "$output"
rm -rf "$output/client" "$output/gateway" "$output/rathena" "$output/runtime" "$output/localization" "$output/deployment"
mkdir -p "$output/client" "$output/gateway" "$output/rathena" "$output/localization/client" "$output/deployment"

rsync -a --delete "$CLIENT_REPO/dist/Web/" "$output/client/"
cat > "$output/client/Config.happyro.js" <<'EOF'
window.ROConfigHappyRO = {
	development: false,
	remoteClient: `${window.location.origin}/`,
	servers: [
		{
			display: 'HappyRO 演示服',
			desc: 'Renewal 2021-11-03',
			address: '127.0.0.1',
			port: 6900,
			version: 25,
			langtype: 0xf0,
			packetver: 20211103,
			renewal: true,
			worldMapSettings: { episode: 18 },
			packetKeys: false,
			socketProxy: `wss://${window.location.host}/ws/`,
			forceUseAddress: true,
			adminList: []
		}
	],
	packetDump: false,
	loadLua: true,
	enableMapName: true,
	enableAchievements: true,
	skipServerList: true,
	skipIntro: false,
	registrationweb: '',
	registrationNotice: '此站点仅作 HappyRO 中文演示。测试账号：happyro1 至 happyro9，密码均为 happyro。数据库每天 7:00 自动重置，所有角色和游戏进度届时会被清除。',
	autoLogin: []
};
EOF
rsync -a --delete --exclude='.git/' --exclude='.env' --exclude='.env.example' --exclude='logs/' "$GATEWAY_REPO/" "$output/gateway/"
patch --directory="$output/gateway" --strip=1 < "$PROJECT_ROOT/deploy/production/gateway-bind-loopback.patch"
rsync -a --delete --exclude='.git/' --exclude='src/' --exclude='3rdparty/' --exclude='tests/' --exclude='doc/' --exclude='build/' --exclude='CMakeFiles/' --exclude='.*.pid' --exclude='log/' "$SERVER_REPO/" "$output/rathena/"
rsync -a --delete "$PROJECT_ROOT/localization/client/data/" "$output/localization/client/data/"
rsync -a --exclude='/mariadb/' "$PROJECT_ROOT/deploy/" "$output/deployment/deploy/"
rsync -a "$PROJECT_ROOT/scripts/" "$output/deployment/scripts/"
rsync -a "$PROJECT_ROOT/docs/deploy/production/" "$output/deployment/docs/deploy/production/" 2>/dev/null || true

cat > "$output/README.md" <<'EOF'
# HappyRO 中文演示环境传输包

目录可直接上传到 ECS 临时目录，再按 deployment/docs/deploy/production/README.md 部署。

本包不包含 runtime/client。kRO 资源应单独放在 ECS 的 /root/happyro/，部署时由 Gateway 配置引用。

不包含 Git 历史、.env、密钥、日志、数据库数据和运行时缓存。
EOF

{
	printf 'root=%s\n' "$(repository_version "$PROJECT_ROOT")"
	printf 'client=%s\n' "$(repository_version "$CLIENT_REPO")"
	printf 'server=%s\n' "$(repository_version "$SERVER_REPO")"
} > "$output/VERSION"
(cd "$output" && find . -type f -printf '%P\n' | sort > MANIFEST.txt && sha256sum MANIFEST.txt > MANIFEST.sha256)
tar -C "$output" -czf "$archive" .
printf 'archive: %s\n' "$archive"
printf 'size: '; du -h "$archive" | cut -f1
printf 'files: '; find "$output" -type f | wc -l
