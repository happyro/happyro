#!/usr/bin/env bash
set -euo pipefail
plain=false
push=false
for argument in "$@"; do
  case "${argument}" in
    --no-color) plain=true ;;
    --push) push=true ;;
    --help|-h) push=false; break ;;
    *) printf 'Unknown argument: %s\n' "${argument}" >&2; exit 2 ;;
  esac
done
if [[ "${push}" != true ]]; then
  cyan='' yellow='' green='' example='' reset=''
  if [[ "${plain}" != true ]]; then cyan=$'\033[1;36m'; yellow=$'\033[1;33m'; green=$'\033[1;32m'; example=$'\033[36m'; reset=$'\033[0m'; fi
  printf '\n%sHappyRO Docker Hub release%s\n\n%sUsage%s\n  %sbash tools/deployment/push-dockerhub.sh --push%s [--no-color]\n\n%sExample%s\n  %sdocker login && bash tools/deployment/push-dockerhub.sh --push%s\n\n' "${cyan}" "${reset}" "${yellow}" "${reset}" "${green}" "${reset}" "${yellow}" "${reset}" "${example}" "${reset}"
  exit 0
fi
release_root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "${release_root}"
python3 - <<'CHECK'
import hashlib,json,subprocess
from pathlib import Path
version=Path('deploy/docker/VERSION').read_text().strip()
state=json.loads(Path('artifacts/images/release/built.json').read_text())
bundle=json.loads(Path('artifacts/deployment/release/release-manifest.json').read_text())
assert state['version']==bundle['version']==version
assert state['commits']==bundle['commits']
assert bundle['status']=='offline-ready'
assert set(state['images'])=={'gateway','server','api','database'}
for name,expected in state['images'].items():
    path=Path('artifacts/images/release')/(name+'.tar')
    with path.open('rb') as stream: actual=hashlib.file_digest(stream,'sha256').hexdigest()
    assert actual==expected,(name,'OCI checksum mismatch')
    raw=subprocess.check_output(['skopeo','inspect','--raw','oci-archive:'+str(path)])
    platforms={(m.get('platform',{}).get('os'),m.get('platform',{}).get('architecture')) for m in json.loads(raw).get('manifests',[])}
    assert {('linux','amd64'),('linux','arm64')}<=platforms,(name,'missing architecture')
print('Verified all four OCI archives, both architectures, version and source commits')
CHECK
(
  set -eu
  release_version=$(cat deploy/docker/VERSION)
  check_dir="work/dockerhub/${release_version}"
  mkdir -p "${check_dir}"
  for name in gateway server api database; do
    source_ref="oci-archive:artifacts/images/release/${name}.tar"
    target_ref="docker://docker.io/kugarocks/happyro-${name}:${release_version}"
    printf '%s -> %s\n' "${source_ref}" "${target_ref}"
    skopeo copy --all --preserve-digests \
      --retry-times 5 --retry-delay 5s \
      "${source_ref}" "${target_ref}"
    skopeo inspect --raw "${source_ref}" > "${check_dir}/${name}-local.json"
    skopeo inspect --raw "${target_ref}" > "${check_dir}/${name}-version.json"
    cmp "${check_dir}/${name}-local.json" "${check_dir}/${name}-version.json"
  done
)

(
  set -eu
  release_version=$(cat deploy/docker/VERSION)
  for name in gateway server api database; do
    source_ref="docker://docker.io/kugarocks/happyro-${name}:${release_version}"
    target_ref="docker://docker.io/kugarocks/happyro-${name}:latest"
    printf '%s -> %s\n' "${source_ref}" "${target_ref}"
    skopeo copy --all --preserve-digests \
      --retry-times 5 --retry-delay 5s \
      "${source_ref}" "${target_ref}"
  done
)

python3 - <<'PYTHON'
import hashlib
import json
from pathlib import Path
import subprocess

version = Path("deploy/docker/VERSION").read_text().strip()
output = Path("work/dockerhub") / version
output.mkdir(parents=True, exist_ok=True)
for name in ("gateway", "server", "api", "database"):
    results = []
    for tag in (version, "latest"):
        reference = f"docker://docker.io/kugarocks/happyro-{name}:{tag}"
        raw = subprocess.check_output([
            "skopeo", "inspect", "--raw", "--retry-times", "5", reference,
        ])
        (output / f"{name}-{tag}.json").write_bytes(raw)
        manifests = json.loads(raw).get("manifests", [])
        platforms = {
            (m.get("platform", {}).get("os"), m.get("platform", {}).get("architecture"))
            for m in manifests
        }
        if not {("linux", "amd64"), ("linux", "arm64")} <= platforms:
            raise SystemExit(f"FAIL: {reference} 缺少双架构")
        results.append(("sha256:" + hashlib.sha256(raw).hexdigest(), manifests))
    if results[0] != results[1]:
        raise SystemExit(f"FAIL: happyro-{name} 的 {version} 与 latest 不一致")
    print(f"OK happyro-{name}: {version} == latest  {results[0][0]}")
PYTHON
