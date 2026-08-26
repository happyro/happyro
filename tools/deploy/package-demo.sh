#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CLIENT_REPO="$PROJECT_ROOT/repos/happyro-client"
SERVER_REPO="$PROJECT_ROOT/repos/happyro-server"
GATEWAY_REPO="$PROJECT_ROOT/vendor/robrowserlegacy-remote-client-js"
DEFAULT_OUTPUT="$PROJECT_ROOT/work/deploy/happyro-demo-$(date +%Y%m%d-%H%M).tar.gz"

usage() {
	local esc=$'\033'
	[[ "${color:-true}" == true ]] || esc=''
	printf '\n%s[1;36mHappyRO demo package tool%s[0m\n\n' "$esc" "$esc"
	printf '%s[1;33mUsage%s[0m\n  %s[1;32mpackage-demo.sh%s[0m --output <archive.tar.gz> [--build] [--no-color]\n\n' "$esc" "$esc" "$esc" "$esc"
	printf '%s[1;33mOptions%s[0m\n' "$esc" "$esc"
	cat <<'EOF'
  --output <archive.tar.gz>  Output archive (default: timestamped tar.gz in work/deploy)
  --build               Build the client and server before packaging
  --no-color             Disable ANSI colors in this help and errors

EOF
	printf '%s[1;33mExamples%s[0m\n  %s[36mtools/deploy/package-demo.sh%s[0m --output work/deploy/happyro-demo-20260828-1816.tar.gz\n  %s[36mtools/deploy/package-demo.sh%s[0m --build --output work/deploy/happyro-demo-20260828-1816.tar.gz\n\n' "$esc" "$esc" "$esc" "$esc" "$esc" "$esc"
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
rsync -a --delete --exclude='.git/' --exclude='.env' --exclude='.env.example' --exclude='logs/' "$GATEWAY_REPO/" "$output/gateway/"
rsync -a --delete --exclude='.git/' --exclude='src/' --exclude='3rdparty/' --exclude='tests/' --exclude='doc/' --exclude='build/' --exclude='CMakeFiles/' --exclude='.*.pid' --exclude='log/' "$SERVER_REPO/" "$output/rathena/"
rsync -a --delete "$PROJECT_ROOT/localization/client/data/" "$output/localization/client/data/"
rsync -a "$PROJECT_ROOT/deploy/" "$output/deployment/deploy/"
rsync -a "$PROJECT_ROOT/scripts/" "$output/deployment/scripts/"
rsync -a "$PROJECT_ROOT/docs/deploy/production/" "$output/deployment/docs/deploy/production/" 2>/dev/null || true

cat > "$output/README.md" <<'EOF'
# HappyRO 中文演示环境传输包

目录可直接上传到 ECS 临时目录，再按 deployment/docs/deploy/production/README.md 部署。

本包不包含 runtime/client。kRO 资源应单独放在 ECS 的 /root/happyro/，部署时由 Gateway 配置引用。

不包含 Git 历史、.env、密钥、日志、数据库数据和运行时缓存。
EOF

(cd "$output" && find . -type f -printf '%P\n' | sort > MANIFEST.txt && sha256sum MANIFEST.txt > MANIFEST.sha256)
tar -C "$output" -czf "$archive" .
printf 'archive: %s\n' "$archive"
printf 'size: '; du -h "$archive" | cut -f1
printf 'files: '; find "$output" -type f | wc -l
