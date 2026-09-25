# Docker 离线镜像构建与交付

本文件是发布端与 Agent 的执行入口。部署机器只需要完成的离线包，不需要源码。用户明确要求不构建时，只维护工具和文档，不运行 build、package 或部署。

## 版本与交付规则

- 下一次发布版本只从 `deploy/docker/VERSION` 读取。已发布版本为 v0.3.2（2026-09-26 全量重建，完成 Mac arm64 完整离线包验收、现网 amd64 仅替换镜像升级及 Docker Hub 双架构标签核验）。
- 应用、资源、配置和镜像使用同一个版本，默认组成一个完整目录交付。用户明确要求拆分时，可从同一个已校验 ZIP 生成互补的资源包与镜像／部署文件包，提供合并说明，并验证合并后的全部文件与完整包一致；拆分包不能单独部署。
- 五个仓库（根仓库、Client、Gateway、Server、Admin）须处于最终、干净的提交；仅在跨机器准备和构建时，要求两台机器的五仓库提交完全一致。正式构建前同步最新 origin/main，禁止丢弃本地工作。
- 四类镜像 Gateway（含完整 --all PWA）、Server、Admin（含后台前端）、Database 全量无缓存构建，包含 linux/amd64 和 linux/arm64。不能复用旧 dist、vendor 或旧镜像。
- 全部构建成功后才允许组装离线包；全部归档校验成功才标记 offline-ready。没有镜像的准备包不可部署。
- 镜像发布目标为 docker.io/kugarocks/happyro-{gateway,server,admin,database}。用户要求推送时，全部构建及 OCI 校验成功后才从同一批归档推送双架构镜像，再组装离线包；Docker Hub 的 latest 指向同一版本，离线部署不使用 latest。Compose 使用本地版本标签且 pull_policy=never；归档 SHA-256、镜像 ID 和架构均记录到发布清单。
- 发布成功后更新已发布版本记录；下一次发版只修改 VERSION，环境模板、工具不再硬编码应用版本。

## 1. 优先在本机检查并准备资源

此步骤需要 Python 3.11+ 和完整源码，不需要 Docker。准备资源和构建镜像可以在同一台机器完成。当前 Mac 工作区已有完整资源，默认在本机完成准备、校验、构建和打包。

每次发布先检查本地以下输入，不得因为本文列出远端资源机就直接执行 SSH 准备或 rsync 下载：

- `inputs/runtime/kro-20211105/client/DATA.INI` 及其引用的全部 GRF 文件。
- 同一客户端目录中的 `AI/`、`BGM/`、`System/`、`data/`。
- `work/game-data/items/kro-20211105/` 和 `work/game-data/monsters/kro-20211105/`。
- `repos/happyro-admin/backend/resources/game-data/world/` 下的 `npcs/`、`maps/`、`terrain/`。

本地输入齐全时，直接运行下面的 prepare 和 verify，不从 fnrocks 重复下载。目录存在只是初步检查，准备产物必须通过 verify。只有确认本地输入缺失后，才使用资源机 `fnrocks`（`10.24.1.1`），明确缺失项并决定补齐本地输入或在资源机准备完整目录；校验失败时先查明原因，不自动用远端资源覆盖本地输入。

资源来自 inputs/runtime/kro-20211105/client；物品和魔物图片来自 work/game-data/items/kro-20211105 与 work/game-data/monsters/kro-20211105；NPC、地图、地形图片来自 Admin 的 backend/resources/game-data/world 对应目录。经过核验的运行资源只读复制，不从历史翻译工作区发布，不重新生成图片或 GRF。

如果需要把本机资源送到另一台构建电脑，可在工作区根目录生成传输归档：

```bash
bash scripts/resources/package-offline-resources.sh create --output artifacts/happyro-resources-20260924.tar.gz
```

脚本同时生成 `happyro-resources-20260924.tar.gz.sha256`。将两个文件传到目标电脑，先在文件所在目录运行 `sha256sum -c happyro-resources-20260924.tar.gz.sha256`（macOS 使用 `shasum -a 256 -c`），再在该电脑的 HappyRO 工作区根目录解压：`tar -xzf happyro-resources-20260924.tar.gz`。目标电脑还需有对应的五个代码仓库；Admin 的 NPC、地图和地形图片由 Admin 仓库提供。解压后在目标电脑运行下面的 `prepare` 和 `verify --prepared`。此归档只是资源传输文件，不替代最终包含双架构镜像的离线 ZIP。

在源码根目录执行：

```bash
python3 tools/deployment/manage.py prepare --workspace . --output artifacts/deployment/release
python3 tools/deployment/manage.py verify --directory artifacts/deployment/release --prepared
```

输出目录必须不存在。prepare 从 VERSION 生成包内版本、环境模板和资源清单，记录五仓库提交，并预留空 images/。资源与配置都计算 SHA-256。任何未跟踪文件也会触发脏仓库检查；截图等应放在已忽略的 work/ 或 artifacts/，不要提交无关文件。

## 2. 在本机构建镜像

构建机器需要完整源码、Python 3.11+、Docker Buildx、Skopeo，以及双架构构建能力。macOS 使用 Docker Desktop 的 Linux 容器。构建期间需要联网下载基础镜像和依赖；离线的是最终部署过程。

本机已完成第 1 步时，直接构建，无需复制准备目录：

```bash
python3 tools/deployment/images.py build --workspace . --output artifacts/images/release
```

仅当第 1 步因本地输入缺失而选择在资源机准备时，才将准备目录复制到构建机的 artifacts/deployment/release，保留空目录和完整结构。先确认两台机器的五仓库提交一致，再在 Mac 上执行（替换 SSH 用户与路径）：

```bash
rsync -a SSH_USER@10.24.1.1:/vol2/1000/kugarocks/happyro/artifacts/deployment/release/ artifacts/deployment/release/
python3 tools/deployment/manage.py verify --directory artifacts/deployment/release --prepared
python3 tools/deployment/images.py build --workspace . --output artifacts/images/release
```

构建输出固定为 gateway.tar、server.tar、admin.tar、database.tar 四个双架构 OCI 归档，全部完成才写 built.json。输出目录必须不存在。构建期间不修改源码。Admin 使用已跟踪的 npm/composer 锁文件；Client/Gateway 没有跟踪 npm 锁文件，同一提交重建可能解析到更新依赖，回退须使用已保存的原始归档。

## 3. 将镜像放入统一离线包

```bash
python3 tools/deployment/images.py package --output artifacts/images/release --bundle artifacts/deployment/release
```

package 校验 built.json、四个 OCI 哈希、双架构以及与准备包的版本和提交一致性。随后使用 Skopeo 把同一批 OCI 产物转为 Docker 可加载归档，不重新构建、不访问镜像仓库：

```text
images/
├── amd64/
│   ├── gateway.tar
│   ├── server.tar
│   ├── admin.tar
│   └── database.tar
└── arm64/
    ├── gateway.tar
    ├── server.tar
    ├── admin.tar
    └── database.tar
```

这些是最终指定位置，不能直接把双架构 OCI tar 放进去冒充 Docker-save 归档。组装失败会保留部分产物供检查，包仍不就绪；重试前将整个部分 images/ 内容移到包外保留，避免覆盖未知文件。

全部目录校验通过后，package 根据 VERSION 自动生成唯一的外层交付产物 `happyro-v<VERSION>.zip`，ZIP 内的根目录固定为 `happyro-版本/`，不再生成 `.tar.gz` 或外层 SHA-256 文件。工具拒绝已有目标文件、`.env`、非空 data/ 和符号链接。ZIP 必须包含 images/、resources/、tools/、配置及空 data/ 目录。不要在交付目录初始化密钥或运行游戏，以免把密钥和存档分发出去。built.json 和双架构 OCI 是构建端中间产物，可在 artifacts/images/ 留存，不需要重复放入最终包。

## 验收

包内 README 来自 docker-deployment.md，部署者无需引用源码文档。目标 Mac 根据 Docker daemon 架构选择镜像，而非根据运行 Python 的架构判断。使用 Rosetta 也不能改变目标 Docker 架构。

首次发布必须实际验证两种架构的镜像构建、空库初始化、已有库升级、登录选角、地图和音效、后台与冒险工具、重启持久化、备份恢复。自动校验不能代替这些验收。v0.2.1 已完成双架构构建及 Mac arm64 离线部署验收；amd64 运行验收尚未执行。

2026-09-18 15:50（Asia/Shanghai）删除旧的 v0.2.1 镜像归档、ZIP 和安装目录后，从最新五个构建仓库提交全量无缓存重建 Gateway（PWA --all）、Server、Admin 和 Database 的 amd64/arm64 镜像；构建输出目录原先不存在，没有复用旧 dist、vendor 或旧 `artifacts/images/release`。镜像源码为根仓库 `ab5ce15ee400aae34e868ae6876f95e6cfc0ab60`、Client `9cb1377765786846d2a457ea709bc6d4168e3c82`、Gateway `0f4da6b754bf2ee3409526dfa779165a640d2bb6`、Server `d8bb71f35559e06040a557f1bec55d956ff6f437`、Admin `f6c4b7d14ce7e63266f380a40e6dbd5de39f6a47`。双架构 OCI 摘要见 `artifacts/images/release/built.json`（gateway `1780406b7d05574b37521e134393def2ec3ea12721e4f2b4a523539cf08765c1`、server `5b8dcb271684d99c2cc5ee35d14f0303776e934d7dc36f3e30dea2ce1cd8fa49`、admin `b3737dd84573c7ed58b7f701e7accd0fddb8acaca7eb084f450697301765220d`、database `8f00cf6f69513d9d22685bdebdab10ea2c54e40b5f824fb63d9c9628a16ece16`）；各架构 Docker-save 归档 SHA-256、镜像 ID 见包内 `release-manifest.json`。统一离线包为 `artifacts/deployment/happyro-v0.2.1.zip`（4,580,293,673 字节，SHA-256：`763f13ad73f2baeb0f9926a54e4cb86d968e70891641b30917474212f69caea7`）。已用同一批 OCI 归档通过 Skopeo `copy --all` 推送到 Docker Hub：`docker.io/kugarocks/happyro-{gateway,server,admin,database}:v0.2.1` 与同内容的 `:latest`。远程 index 与本机 `artifacts/images/release/{gateway,server,admin,database}.tar` 一致（gateway `sha256:d767e33e5e69884748d1e4c3bf5bd09ea4bfdfdc3c4292e73c7b5edfd888f6bd`、server `sha256:c57b6979e8c1a1c283897d613da762436afe6509da535a57fa10eeb3b1693735`、admin `sha256:1ea16823c6a985f496c74732a5919c14b15916dffbcf3309758c43e2fcbe8b60`、database `sha256:10be546778728adb0eace5f07f24037c5ddcbb7f64c23b3ad03922001828385b`）。离线部署仍使用包内版本标签和 `--pull never`。

Mac arm64（OrbStack linux/arm64）从该 ZIP 解压到 `artifacts/deployment/install/happyro-v0.2.1`（不是构建工作目录），使用包内工具完成 `verify`、daemon 架构镜像导入（`verify_loaded` 成功）、空目录 `initialize` 生成 `.env`，以及 `deploy`（Compose `--pull never`，镜像标签 `docker.io/kugarocks/happyro-{gateway,server,admin,database}:v0.2.1`）。`docker compose ps -a` 显示七个常驻服务健康且 `admin-init` 以 0 退出。两次获取 `http://127.0.0.1:3338/applications/pwa/index.html` 均为 HTTP 200，页面含「进入游戏」和查看器入口，不是直接启动游戏的 `index.html`。两次获取 `http://127.0.0.1:8000/` 均为 HTTP 200。本机无无头浏览器，未截启动页画面。

未在本机运行 amd64 容器；未执行游戏内登录/选角、地图与 BGM 播放、冒险工具交互、重启持久化、已有库升级或备份恢复。这些项仍为已知未验证。

2026-09-24 14:12（Asia/Shanghai）删除旧的 v0.3.0 镜像归档、ZIP 和安装目录后，从最新五个构建仓库提交全量无缓存重建 Gateway（PWA --all）、Server、Admin 和 Database 的 amd64/arm64 镜像；构建输出目录原先不存在，没有复用旧 dist、vendor 或旧 `artifacts/images/release`。镜像源码为根仓库 `1f2a0183abf37a8e60217f644af260fd76866755`、Client `f95f357e4374aa99e1c864a3dfc40bdfd3327937`、Gateway `5df43e173f13aa44b1a58e8c2a9395803d4f555e`、Server `760930014598fedcdf5f258f594bfb438a7eca89`、Admin `d76f895d0f7fb6eb8be323a9a25ae9bb553fa934`。双架构 OCI 摘要见 `artifacts/images/release/built.json`（gateway `e2e640a07dd22e51f7d4970682f6d8efd72245e18cb69b24d9ebe700224a21d9`、server `b9fb1bd5b985f85f8c70ec6b0fd5479579b35423d8c5ff5518bf0d68d95689ef`、admin `efe29162239ffb7a4ae99f561b37b8e8fb1a4e2e3a5a7829f388dbfcc9b68498`、database `3e4c7563cd92baecaebdf1f9130cdb908d2d36b38124d93731b351a2f53fefac`）。各架构 Docker-save 归档 SHA-256 与镜像 ID：amd64 gateway `dc0560a10dd537c022e83c6d1b68343fc605e84655077bc6b88ad70ab7ef80b2` / `sha256:500bf07f3f156c5613376cddc64d83a027d1e05682c128704170bf70ec6faf0c`，server `c298dd13ab4a46e3689bc1ab5a9d53805afb6a4b9ec567d4b389d95f271c6cfa` / `sha256:b8aad667ec4385804fd7c7ebc6d78265401d7a9d7fd0b7ede2dd528726ee9cae`，admin `fae5eb8cd8d4c44e4246e6a797d16d1bfc014b2bd346d3c8743ef94277f9168d` / `sha256:daec1521ff2caca13ed3ba05616350ed1ba5281f93b35da59b620367b6b2928c`，database `510a5c187e4a45064b6207c98cdd4e92d09c4d1e39ee4e1c7bfc8e0c05ffb013` / `sha256:536855f29864cc7c766e1c6aeded161e842fc0ddea1a530f70bcc4eefe492edd`；arm64 gateway `4cee04fc286f86d9f4ea99890ab9ca8c20c9256fc1c230a2cf78bed0e7dcf28d` / `sha256:013682c4f6cf418936295adf36bd1b400a7862e9893840fef94df61e7cc9728c`，server `819e33cd6a567504dac7b75e47476e7a3064428e1a9e6e38a3c4da6b1cf09cae` / `sha256:f5e74491761a3b69134db48e443118f2e103d4799946923caa08706520a0afb2`，admin `48aff4cb99d4ac1927240b87ad4063a06fea21d42cd3fa3c7c6aab56012f9244` / `sha256:85b1a91d3470252f16dbc14cabf80f0b7f68167f47711214bea1f85e6c7afb35`，database `c1dd3dca08b1b8dffc05d49dcdc4e12d9973315b9f74a055118284637afe9043` / `sha256:2904cef9f8dd9a4623d7227facb41bffaba148307c2f6dc9cc49f59e29f19519`。同一组值也在包内 `release-manifest.json`。统一离线包为 `artifacts/deployment/happyro-v0.3.0.zip`（4,603,907,965 字节，SHA-256：`442e0e66b91b264d3a38d90ea35d8e923f37e793e13b1dd07bdd9c83dc5163a2`）。已用同一批 OCI 归档通过 Skopeo `copy --all` 推送到 Docker Hub：`docker.io/kugarocks/happyro-{gateway,server,admin,database}:v0.3.0` 与同内容的 `:latest`。远程 index 与本机 `artifacts/images/release/{gateway,server,admin,database}.tar` 一致（gateway `sha256:e571eefd6f5c19c5d0a64181de6959c8d231f704cecf1ff387fbdea57c2a4346`、server `sha256:8e79b8c95dacbbf2efacf1a2d7862997d0e0032c1da3e6a2dc1adc6c4a831fab`、admin `sha256:410c431ed66cc0dce294f6f839907a822800981ae6241f939f635f7613990e90`、database `sha256:bd5520141babcc66f06e07f1596b9731bbbbb8fce3a52f7c1718d49f482650b9`）。离线部署仍使用包内版本标签和 `--pull never`。

Mac arm64（OrbStack linux/arm64）从该 ZIP 解压到 `artifacts/deployment/install/happyro-v0.3.0`（不是构建工作目录），使用包内工具完成 `verify`、daemon 架构镜像导入（`verify_loaded` 成功）、空目录 `initialize` 生成 `.env`，以及 `deploy`（Compose `--pull never`，镜像标签 `docker.io/kugarocks/happyro-{gateway,server,admin,database}:v0.3.0`）。`docker compose ps -a` 显示七个常驻服务健康且 `admin-init` 以 0 退出。两次获取 `http://127.0.0.1:3338/applications/pwa/index.html` 均为 HTTP 200，页面含「进入游戏」和查看器入口，不是直接启动游戏的 `index.html`。两次获取 `http://127.0.0.1:8000/` 均为 HTTP 200。本机无无头浏览器，未截启动页画面。

未在本机运行 amd64 容器；未执行游戏内登录/选角、地图与 BGM 播放、冒险工具交互、重启持久化、已有库升级或备份恢复。这些项仍为已知未验证。

## Docker Hub 发布

用户已登录 Docker Hub 且明确要求推送时才执行本节。使用 Docker 的凭据助手，不将凭据写入日志。以下命令均在根仓库运行，版本只读取 `deploy/docker/VERSION`；需要 Skopeo 和 Python 3。离线包使用完整版本标签，部署仍使用 `--pull never`。

### zsh 的 `atest` 仓库名问题

2026-09-25 更新 latest 时，命令中的 `happyro-$name:latest` 被 zsh 解析为 `$name:l`（将变量值转小写）加上字面量 `atest`，实际目标变成 `happyro-gatewayatest` 等错误仓库。双引号和外层子 shell `( ... )` 都不能阻止这种展开；代码块标注 bash 也不会改变粘贴命令时使用的 shell。参见 [zsh 参数修饰符文档](https://zsh.sourceforge.io/Doc/Release/Expansion.html#Modifiers)。

**拼接镜像引用时，变量一律使用 `${name}`、`${release_version}` 等花括号形式，尤其是冒号前的变量。** 正确形式是 `happyro-${name}:latest`。推送前打印完整源地址和目标地址，检查仓库名与标签；不能仅凭 copy 返回成功判断发布成功。

### 1. 从已校验的双架构 OCI 归档推送版本标签

先确认全部构建完成、`built.json` 的版本与 VERSION 一致、四个 OCI 归档 SHA-256 与 built.json 一致，并且每个归档同时包含 `linux/amd64` 和 `linux/arm64`。使用同一批最终产物；不得用 Docker 本地单架构镜像替代。下列命令保存本地和远程原始 index，并逐字节比较，任意失败立即停止，不能继续更新 latest。

```sh
(
  set -eu
  release_version=$(cat deploy/docker/VERSION)
  check_dir="work/dockerhub/${release_version}"
  mkdir -p "${check_dir}"
  for name in gateway server admin database; do
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
```

### 2. 将全部已核验的版本标签复制为 latest

四个版本标签全部通过上一步核验后执行。版本标签已经正确上传、只需要修复 latest 时，从本步开始，无需重建或重新上传 OCI 归档。`--all` 保留所有架构，`--preserve-digests` 要求保留摘要；失败时查明原因，不通过去掉这些选项绕过。

```sh
(
  set -eu
  release_version=$(cat deploy/docker/VERSION)
  for name in gateway server admin database; do
    source_ref="docker://docker.io/kugarocks/happyro-${name}:${release_version}"
    target_ref="docker://docker.io/kugarocks/happyro-${name}:latest"
    printf '%s -> %s\n' "${source_ref}" "${target_ref}"
    skopeo copy --all --preserve-digests \
      --retry-times 5 --retry-delay 5s \
      "${source_ref}" "${target_ref}"
  done
)
```

### 3. 从 Docker Hub 重新读取并核验两个标签

以下命令只读远程仓库。它比较完整 index 的 SHA-256，确认两个标签指向同一份多架构内容，并逐项比较子 manifest 摘要及平台，同时要求存在 amd64 和 arm64。不能仅比较默认架构、镜像大小或标签显示时间。原始响应保存在 `work/dockerhub/版本/`，供复核。

```sh
python3 - <<'PYTHON'
import hashlib
import json
from pathlib import Path
import subprocess

version = Path("deploy/docker/VERSION").read_text().strip()
output = Path("work/dockerhub") / version
output.mkdir(parents=True, exist_ok=True)
for name in ("gateway", "server", "admin", "database"):
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
```

四个仓库全部输出 OK 后才记录 Docker Hub 发布成功。修复错误仓库名后，`happyro-gatewayatest`、`happyro-serveratest`、`happyro-adminatest`、`happyro-databaseatest` 不会自动消失；核实没有使用者后可单独删除，删除不属于上述推送流程。

### v0.3.1 标签修复核验记录（2026-09-25）

已通过 Skopeo 从 Docker Hub 实时读取四个仓库的 `v0.3.1` 和 `latest`：每对标签的完整 index 摘要、所有子 manifest 摘要与平台均一致，包含 `linux/amd64` 和 `linux/arm64`。本次核验确认远程两个标签一致，未重新比较本地 OCI 归档，也未检查或删除错误的 `atest` 仓库。

| 仓库（`docker.io/kugarocks/`） | v0.3.1 与 latest 的共同 index 摘要 |
| --- | --- |
| happyro-gateway | `sha256:440425bd24111cb3e3249f1c2496305b914f00dfccec62fdb99a6ca9c7cd326b` |
| happyro-server | `sha256:90c3b982b98816666f65bd7b31b47151bbbe8f4ceb48ca331c51f9f02d8186f4` |
| happyro-admin | `sha256:c6f74965a404127ee72253f93cd5c967ba9fce4e0314da4aff42fc327393c6fd` |
| happyro-database | `sha256:b8d927e9dc5cce4ff48dba45a6bc480337cbc718bcdf997b230624530113fd62` |

## v0.3.1（2026-09-25）

从最终干净提交全量无缓存构建 Gateway（PWA `--all`）、Server、Admin 和 Database 的 `linux/amd64`、`linux/arm64` 镜像。验收发现并修复后台子路由跳转内部 8080 端口的问题后，废弃首轮候选包，再次全量重建四类镜像；最终包只使用第二轮产物。

构建来源：

- `.`：`38cc26fc86dad0d1d57dd3a1ba7a90f88e578188`
- `repos/happyro-client`：`b1cc816e90149603138cd44a1755c5aa75beee3b`
- `repos/happyro-gateway`：`ebfdc5ea1dacfd6b07b4aa5b7b0a19359d4b14e4`
- `repos/happyro-server`：`760930014598fedcdf5f258f594bfb438a7eca89`
- `repos/happyro-admin`：`f92cfe4a9831c2f3e57e8258b142fe5fe0ad9bd8`

完整包：`artifacts/deployment/happyro-v0.3.1.zip`，4,604,184,227 字节，SHA-256 `251acbf7dceece481193d3d454f6c394bc103f6c22b408b84301962fd2df6c12`。39,149 个资源文件、双架构归档与 ZIP CRC 全部通过校验。离线包完成时尚未推送 Docker Hub；后续已完成推送及标签修复，核验记录见上文。

| 架构 | 镜像 | 配置 ID | 归档 SHA-256 |
| --- | --- | --- | --- |
| amd64 | gateway | `sha256:1d67c50fcd2e9ccb3cb42f95471cb3ee8fe1ff531d3a7afa1b64f90ae331e9bd` | `654f27f0fd14ad563e222d5754f2363268b26a1ea685e17cab2af36db089b280` |
| amd64 | server | `sha256:9230d4e80341463f303bb02a736c9af6bc2b9db825a80207f5a13145adaa490c` | `a53f6d9bb6b59ccf2c026ebf538b5238167d46d8cd15ae484b63cb5e3dbd0dcb` |
| amd64 | admin | `sha256:6ace8d328f4534313fa12910893bc6298f8b9abde74a281315b521a7c8586335` | `428cd9a3898f1e9860a7ace98c9ee22d400de0ba20f12922d3b26309aff8684e` |
| amd64 | database | `sha256:d178e837ec466980b7dcd235a43facff42ce416ffa277ea7f34a7e9b4095ed20` | `c66fc73a1a51352531b904495acc6850e5f9516ceaa8057a17a7a64529c8ff5c` |
| arm64 | gateway | `sha256:e598009da6820b7618fe820b9e1ea61b28cfe8f214de5b21a8998d43f88c3a40` | `761009d6f3de38704f415b0d4ddc4dafd0ed27c070115b0cb3809c8977e5dee3` |
| arm64 | server | `sha256:ac32cd652e25ddd090517513fe707a1f5381cc1c28eb72ebdb315ce54d905231` | `b3ee972cf470806740875dd616ecdd764d532f8ff53557f886d12e4f39a9aaa6` |
| arm64 | admin | `sha256:ad2c754e1200324d46f3c4884b4fe14c50e0c7ce11acc6289bef2ecdde747dd8` | `325ab398b9e0f7cb5594210a09293e8e5bb45a192b06a91b68e5e7f485faa7ac` |
| arm64 | database | `sha256:67078b0ace2ea2917fdc99460e5bfbdeebca7473d589b93a82fc4b38ec742ae8` | `9098aae4a3c43b8214cd9b2a504fe645aef53e500b872ea186618b8a5222220b` |

本机从最终 ZIP 解压到 `artifacts/deployment/install/happyro-v0.3.1`，按 OrbStack `linux/arm64` 架构导入镜像并核对配置 ID，使用全新数据库与独立端口 `4338` / `48000` 部署。七个常驻服务健康，`admin-init` 退出码为 0。浏览器完成启动页、登录、创建角色、选角进地图、移动端设置、后台登录、魔物中文地图与位置操作、NPC 图鉴及游戏设置保存验收；后台子路由直接访问和带尾斜杠访问均返回 200。

本机实际验证备份恢复：停写后备份，再修改测试角色 Zeny，恢复备份后账号、角色、背包和仓库摘要恢复一致；完整停止并重启后摘要仍一致，保存的 `base_exp_rate=123` 文件与后台 API 值保持不变。音频自动验收确认 BGM 资源返回 200、Web Audio 上下文处于 running / 48kHz；该检查不代替实机听音。

完整 ZIP 经 fnrocks 中转到 Backend，三处 SHA-256 一致。在 Backend 上先校验并导入最终 amd64 镜像，再停止写入并备份，将备份复制到 fnrocks 后逐项核对其中 5 个文件的摘要。升级保留原 `.env` 密钥、公开 URL、端口、数据库及持久化目录，旧 v0.3.0 目录留作回退。备份压缩包为 7,509,073 字节，SHA-256 `b24b10770643166cdee1ae0e88d42ad6e2c01a79be580e1a52257580e72aa2e8`；备份含密钥，仅保存在受限目录，不作为交付物公开。

现网 `/root/happyro` 已运行最终 v0.3.1 amd64 镜像，七个常驻服务健康，`admin-init` 退出码为 0。升级前后 4 个账号、3 个角色、11 条背包记录和仓库摘要一致，运营设置文件 SHA-256 一致；升级前的后台会话仍返回 200。公网浏览器完成原账号登录、选角进地图、音频上下文、移动设置、后台登录、中文魔物地图、位置操作、NPC 图鉴及运营设置读取验收，没有页面脚本异常。公网与容器内 PWA build-info 一致（amd64 `mufvndrz`，本机 arm64 `mufvmuyo`）。

公网健康检查、启动页、后台子路由直接访问与 WebSocket 配置均通过；WebSocket 握手为 OpenResty `101`，未经过 ESA。文档样式、后台脚本、BGM 的第二次请求均为 ESA `HIT`。

按用户要求从同一个完整 ZIP 生成以下两个互补包：

- `happyro-v0.3.1-runtimes.zip`：3,552,218,355 字节，SHA-256 `1079a2be07353d94d09d3c586ea86973855d427df5dbb44bef22c6aa2c43da48`。
- `happyro-v0.3.1-images.zip`：1,052,749,362 字节，SHA-256 `55877b6b978a59fe662ddbc037b5c015c010b5d8a806aee5656c59f24056443e`。

资源包保存 `resources/`；镜像包保存双架构镜像、部署工具、配置、版本清单及空数据目录。两者解压到同一父目录后还原 `happyro-v0.3.1/`。逐文件核对合并后的 39,165 个文件 SHA-256、205 个目录与完整包一致，未遗漏任何部署文件。使用说明位于 `artifacts/deployment/happyro-v0.3.1-split-README.txt`。

文档站同步根仓库 changelog，并更新当前版本、离线安装和拆分包说明。v0.3.1 未上传公开网盘，文档保留原 v0.3.0 公开下载链接并明确标注版本；不将旧链接冒充新版。Docker Hub 镜像后续已推送，四个仓库的 v0.3.1 与 latest 一致，见上文核验记录。

## v0.3.2（2026-09-26）

正式构建前已 fetch 并核对五仓库最新 origin/main。提交统一版本变更后，从干净提交全量执行 `--no-cache --pull` 构建 Gateway（PWA `--all`）、Server、Admin 和 Database 的 amd64 / arm64 镜像；未复用旧 dist、vendor 或应用镜像。四类 OCI 全部完成并核验后，从同一批归档推送 Docker Hub 并组装离线包。

构建来源：

- 根仓库：`4c396536e1b06086241f730a1bda11c981819b43`
- Client：`efcd7e808dfb7b0ffe15205a083c922bee0a63b0`
- Gateway：`ebfdc5ea1dacfd6b07b4aa5b7b0a19359d4b14e4`
- Server：`eb05d9b4ddbb950d9286cf79408e4e93c8c55639`
- Admin：`f92cfe4a9831c2f3e57e8258b142fe5fe0ad9bd8`

交付物位于 `artifacts/deployment/`：

| 文件 | 字节数 | SHA-256 |
| --- | ---: | --- |
| `happyro-v0.3.2.zip` | 4604397479 | `72a757c07c8fa0a9c092c5e12186f1adca98b302ffed2f0a5bec4524ac549669` |
| `happyro-v0.3.2-runtimes.zip` | 3552218355 | `3d1a56fcccad536b6f05fda153c21ba07df2e0834d1a0610ba6af7dbad397c9d` |
| `happyro-v0.3.2-images.zip` | 1052962614 | `db279ec56708fee89f73e0818329fb6e8fa548ed4a3e61e660e8d0aae3b1dc0e` |

完整包包含 39,149 个资源文件和八个 Docker-save 镜像归档，资源、镜像 SHA-256 与 ZIP CRC 均通过校验。两个拆分包来自同一完整 ZIP；逐文件比较合并结果的 39,165 个文件 SHA-256 和 205 个目录，全部一致。合并说明为 `happyro-v0.3.2-split-README.txt`。OCI 源归档及 `built.json` 保存在 `artifacts/images/v0.3.2/`。

Docker Hub 四个仓库的 `v0.3.2` 与 `latest` 均已从远程读取并核验完整 index、所有子 manifest 和平台，包含 amd64 / arm64，且与本地 OCI 一致：

| 仓库（`docker.io/kugarocks/`） | 两个标签共同的 index 摘要 |
| --- | --- |
| happyro-gateway | `sha256:70a1079885f3e267a7ed3e3c32f773b93f90e767f892a61cee87137c388522d9` |
| happyro-server | `sha256:5b96d2b078373dec60c3766f27e3bf15b9e85f92b8a39ae6d352e58f4f084a55` |
| happyro-admin | `sha256:c913b20634634603a5924bc5f9371025232c0f15210681bd5d8f8150ebf0d3bb` |
| happyro-database | `sha256:79080d545f9ea0fa35993febc4ded1c28c7cb6be4e70a50ea4109a5d915341ce` |

本机从完整 ZIP 解压到 `artifacts/deployment/install/happyro-v0.3.2`，按 OrbStack arm64 导入镜像、初始化全新数据库并离线部署。为让 3338 / 8000 指向 Docker，停止了占用端口的 HappyRO 原生 launchd 服务；原生配置及旧安装数据保留。七个常驻容器健康，admin-init 退出码为 0。Docker containerd 存储的 image ID 与配置 ID 不同，验收通过导出实际加载镜像核对配置摘要，未直接把两种 ID 混为一谈。

本机浏览器完成启动页、登录、创建角色、进地图、素质与技能菜单、导航搜索、镜头控制、后台登录、中文魔物地图、位置操作、NPC 图鉴及运营设置保存。实际备份后修改测试角色 Zeny，再恢复备份，账号、角色、背包和仓库摘要恢复一致；完整停止重启后摘要仍一致，保存的 `base_exp_rate=123` 文件和后台值保持不变。重启后的浏览器验收再次通过。

镜像包经 `root@fnrocks` 转送 Backend（10.24.42.2），两处 SHA-256 均与本机一致。升级前确认 Compose、部署工具及资源清单中的全部资源文件与新包一致，只替换镜像和对应版本校验文件，保留 `/root/happyro/data/`、资源文件、公开 URL、端口和密钥。`.env` 仅更新 RELEASE_VERSION 及四个镜像引用。旧镜像归档保存在 `/root/happyro-images-v0.3.1-before-v0.3.2`。

现网停写后备份到 `/root/happyro-backups/before-v0.3.2`，受限备份归档同时保存到 fnrocks 的 `/vol2/1000/kugarocks/happyro/backups/v0.3.2/before-v0.3.2.tar.gz`，两处 SHA-256 为 `fc2fd9f42609b670ff400da351f97dfcd287730f7ee76ba5a05a08a82ec78b4a`。备份含密钥，不属于公开交付物。Backend 临时镜像 ZIP 已删除以释放空间，原包保留在本机及 fnrocks。

升级前后 6 个账号、5 个角色、21 条背包记录及仓库摘要完全一致，运营设置文件哈希一致，原后台会话仍返回 200。现网七个常驻服务健康，admin-init 退出码为 0，实际 amd64 配置摘要与离线包一致。公网浏览器完成原账号登录、选角进地图、素质与技能菜单、导航搜索、声音上下文、镜头设置、后台登录、图鉴及运营设置读取，页面脚本错误为零。公网 PWA 与容器构建信息一致（amd64 `muh8bfcn`，本机 arm64 `muh8bf50`）；WebSocket 握手为 OpenResty 101。

音频验收确认 BGM 返回 200、Web Audio 上下文 running / 48kHz，未进行人工听音。Gateway 自动检查仍报告可选 data/ 目录和 GRF 非 UTF-8 文件名提示；资源完整校验、游戏加载及浏览器功能检查通过。本轮未发布文档站或公开网盘下载。

详细证据保存在 `work/releases/v0.3.2/`，包含构建与发布日志、拆分校验、两端容器配置核验、浏览器截图、备份恢复及数据摘要；Docker Hub 原始响应位于 `work/dockerhub/v0.3.2/`。
