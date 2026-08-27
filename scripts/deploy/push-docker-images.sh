#!/usr/bin/env bash
set -euo pipefail

script_name="${0##*/}"
namespace="kugarocks"
version=""
color=true
[[ -t 1 ]] || color=false
bold_cyan=''
bold_yellow=''
bold_green=''
cyan=''
reset=''
if $color; then
	bold_cyan=$'\033[1;36m'
	bold_yellow=$'\033[1;33m'
	bold_green=$'\033[1;32m'
	cyan=$'\033[36m'
	reset=$'\033[0m'
fi

usage() {
	printf '\n%s%s - build and push HappyRO Docker images%s\n\n' "$bold_cyan" "$script_name" "$reset"
	printf '%sOptions%s\n  %s--version VERSION%s       Required image tag, for example v0.1.0\n  %s--namespace NAME%s        Docker Hub namespace (default: kugarocks)\n  %s--no-color%s              Disable ANSI colors\n  %s-h, --help%s              Show this help\n\n' "$bold_yellow" "$reset" "$bold_green" "$reset" "$bold_green" "$reset" "$bold_green" "$reset" "$bold_green" "$reset"
	printf '%sExample%s\n  %sdocker login --username kugarocks%s\n  %s%s --version v0.1.0%s\n\n' "$bold_yellow" "$reset" "$cyan" "$reset" "$cyan" "$script_name" "$reset"
}

fail() {
	printf 'error: %s\n' "$*" >&2
	exit 1
}

[[ $# -gt 0 ]] || { usage; exit 0; }
while [[ $# -gt 0 ]]; do
	case "$1" in
		--version)
			[[ $# -ge 2 ]] || fail '--version requires a value'
			version="$2"
			shift 2
			;;
		--namespace)
			[[ $# -ge 2 ]] || fail '--namespace requires a value'
			namespace="$2"
			shift 2
			;;
		--no-color)
			color=false
			bold_cyan=''
			bold_yellow=''
			bold_green=''
			cyan=''
			reset=''
			shift
			;;
		-h|--help)
			usage
			exit 0
			;;
		*)
			fail "unknown option: $1"
			;;
	esac
done
[[ -n "$version" ]] || { usage >&2; fail '--version is required'; }
[[ "$version" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] || fail 'version must match vMAJOR.MINOR.PATCH'
[[ "$namespace" =~ ^[a-z0-9]+([._-][a-z0-9]+)*$ ]] || fail 'invalid Docker Hub namespace'
command -v docker >/dev/null || fail 'missing command: docker'
docker buildx inspect >/dev/null 2>&1 || fail 'no usable Docker Buildx builder'

root="$(cd "$(dirname "$0")/../.." && pwd)"
images=("$namespace/happyro-server" "$namespace/happyro-gateway" "$namespace/happyro-database")
dockerfiles=("deploy/docker/server/Dockerfile" "deploy/docker/gateway/Dockerfile" "deploy/docker/database/Dockerfile")
printf '\n%sPushing HappyRO images%s\nnamespace: %s\nversion: %s\nplatforms: linux/amd64,linux/arm64\n' "$bold_yellow" "$reset" "$namespace" "$version"
for i in "${!images[@]}"; do
	image="${images[$i]}"
	docker buildx build --platform linux/amd64,linux/arm64 \
		--file "$root/${dockerfiles[$i]}" \
		--tag "$image:$version" --tag "$image:latest" --push "$root"
done
printf '\n%sVerifying remote manifests%s\n' "$bold_yellow" "$reset"
for image in "${images[@]}"; do
	docker buildx imagetools inspect "$image:$version" >/dev/null
	docker buildx imagetools inspect "$image:latest" >/dev/null
	printf '%sverified%s %s:%s and :latest\n' "$bold_green" "$reset" "$image" "$version"
done
printf '\n'
