# Docker 离线镜像构建与交付

本文件是发布端与 Agent 的执行入口。部署机器只需要完成的离线包，不需要源码。用户明确要求不构建时，只维护工具和文档，不运行 build、package 或部署。

当前 VERSION 为待发布的 v0.4.0，公开已发布版本仍为 v0.3.2。当前代码的最终包构建与验收仍待执行，不能沿用旧候选包的通过状态。正式交付信息见[版本说明](../../changelog/releases/v0.4.0.md)。

自定义功能见[实现与维护说明](../architecture/customization.md)，用户操作见[部署手册](docker-deployment.md#服务端与资源自定义)。

## 版本与交付规则

- 下一次发布版本只从 `deploy/docker/VERSION` 读取。已发布版本为 v0.3.2（2026-09-26 全量重建，完成 Mac arm64 完整离线包验收、现网 amd64 仅替换镜像升级及 Docker Hub 双架构标签核验）。
- 应用、资源、配置和镜像使用同一个版本，默认组成一个完整目录交付。用户明确要求拆分时，可从同一个已校验 ZIP 生成互补的资源包与镜像／部署文件包，提供合并说明，并验证合并后的全部文件与完整包一致；拆分包不能单独部署。
- 五个仓库（根仓库、Client、Gateway、Server、Admin）须处于最终、干净的提交；仅在跨机器准备和构建时，要求两台机器的五仓库提交完全一致。正式构建前同步最新 origin/main，禁止丢弃本地工作。
- 四类镜像 Gateway（含完整 --all PWA）、Server、Admin（含后台前端）、Database 全量无缓存构建，包含 linux/amd64 和 linux/arm64。不能复用旧 dist、vendor 或旧镜像。
- 全部构建成功后才允许组装离线包；全部归档校验成功才标记 offline-ready。没有镜像的准备包不可部署。
- 镜像发布目标为 docker.io/kugarocks/happyro-{gateway,server,admin,database}。用户要求推送时，全部构建及 OCI 校验成功后才从同一批归档推送双架构镜像，再组装离线包；Docker Hub 的 latest 指向同一版本，离线部署不使用 latest。Compose 使用本地版本标签且 pull_policy=never；归档 SHA-256、镜像 ID 和架构均记录到发布清单。
- 发布成功后更新已发布版本记录；下一次发版只修改 VERSION，环境模板、工具不再硬编码应用版本。

## 1. 优先在本机检查并准备资源

此步骤需要 Python 3.11+ 和完整源码，不需要 Docker。准备资源和构建镜像可以在同一台机器完成。先检查实际工作区的资源和构建能力；输入齐全且具备双架构构建能力时，在本机完成准备、校验、构建和打包，不假定宿主机系统或已有产物。

每次发布先检查本地以下输入，不得因为本文列出远端资源机就直接执行 SSH 准备或 rsync 下载：

- `inputs/runtime/kro-20211105/client/DATA.INI` 及其引用的全部 GRF 文件。
- 同一客户端目录中的 `AI/`、`BGM/`、`System/`、`data/`。
- `work/game-data/items/kro-20211105/` 和 `work/game-data/monsters/kro-20211105/`。
- `repos/happyro-admin/backend/resources/game-data/world/` 下的 `npcs/`、`maps/`、`terrain/`。

本地输入齐全时，直接运行下面的 prepare 和 verify，不从 fnrocks 重复下载。目录存在只是初步检查，准备产物必须通过 verify。只有确认本地输入缺失后，才使用资源机 `fnrocks`（`10.24.1.1`），明确缺失项并决定补齐本地输入或在资源机准备完整目录；校验失败时先查明原因，不自动用远端资源覆盖本地输入。

资源来自 inputs/runtime/kro-20211105/client；物品和魔物图片来自 work/game-data/items/kro-20211105 与 work/game-data/monsters/kro-20211105；NPC、地图、地形图片来自 Admin 的 backend/resources/game-data/world 对应目录。经过核验的运行资源只读复制，不从历史翻译工作区发布，不重新生成图片或 GRF。

如果需要把本机资源送到另一台构建电脑，可在工作区根目录生成传输归档；示例文件名已存在时换用新的输出路径：

```bash
bash scripts/resources/package-offline-resources.sh create --output artifacts/happyro-resources-transfer.tar.gz
```

脚本同时生成 `happyro-resources-transfer.tar.gz.sha256`。将两个文件传到目标电脑，先在文件所在目录运行 `sha256sum -c happyro-resources-transfer.tar.gz.sha256`（macOS 使用 `shasum -a 256 -c`），再在该电脑的 HappyRO 工作区根目录解压：`tar -xzf happyro-resources-transfer.tar.gz`。目标电脑还需有对应的五个代码仓库；Admin 的 NPC、地图和地形图片由 Admin 仓库提供。解压后在目标电脑运行下面的 `prepare` 和 `verify --prepared`。此归档只是资源传输文件，不替代最终包含双架构镜像的离线 ZIP。

在源码根目录执行：

```bash
python3 tools/deployment/manage.py prepare --workspace . --output artifacts/deployment/release
python3 tools/deployment/manage.py verify --directory artifacts/deployment/release --prepared
```

输出目录必须不存在。prepare 从 VERSION 生成包内版本、环境模板和资源清单，记录五仓库提交，并预留空 images/。资源与配置都计算 SHA-256。任何未跟踪文件也会触发脏仓库检查；截图等应放在已忽略的 work/ 或 artifacts/，不要提交无关文件。

## 2. 在本机构建镜像

构建机器需要完整源码、Python 3.11+、Docker Buildx、Skopeo，以及双架构构建能力。Linux 使用 Docker Engine，macOS 使用 OrbStack 或 Docker Desktop 的 Linux 容器。构建期间需要联网下载基础镜像和依赖；离线的是最终部署过程。

本机已完成第 1 步时，直接构建，无需复制准备目录：

```bash
python3 tools/deployment/images.py build --workspace . --output artifacts/images/release
```

仅当第 1 步因本地输入缺失而选择在资源机准备时，才将准备目录复制到构建机的 artifacts/deployment/release，保留空目录和完整结构。先确认两台机器的五仓库提交一致，再在构建机上执行（替换 SSH 用户与路径）：

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

全部目录校验通过后，package 根据 VERSION 自动生成唯一的外层交付产物 `happyro-<VERSION>.zip`，ZIP 内的根目录固定为 `happyro-版本/`，不再生成 `.tar.gz` 或外层 SHA-256 文件。工具拒绝已有目标文件、`.env`、非空 data/ 和符号链接。ZIP 必须包含 images/、resources/、tools/、examples/custom/ 模板、配置及空 data/ 目录。禁止包含实际用户 custom/；自定义目录由部署端初始化，升级保留 CUSTOM_DIR。不要在交付目录初始化密钥或运行游戏，以免把密钥和存档分发出去。built.json 和双架构 OCI 是构建端中间产物，可在 artifacts/images/ 留存，不需要重复放入最终包。

## 验收

### 包含自定义功能的版本

1. 确认 Admin 镜像带 Server npc/conf 基线及 import-tmpl 初始化出的 import 快照；否则空库迁移成功后目录刷新仍可能失败。
2. prepare/build 前保持五个构建仓库干净，使用不存在的输出路径。失败即停止后续 package/deploy，保留日志；修复源码并提交后重新准备，四类镜像再次全量无缓存构建，不只重建失败组件。
3. 核对 ZIP 的 examples/custom/npc/scripts.conf、Server 当前 db 模板和包内 custom.py。catalogs.py 在 Admin 镜像内，部署端不需要安装 PyYAML。
4. ZIP 不含用户 custom、密钥和存档。独立解压后才 initialize；定制测试文件不混入发行模板。
5. 空库验收检查七服务健康、admin-init 退出 0、三类导入；再检查 NPC、数据库目录、资源更新/删除、重复初始化及精确备份恢复。
6. 升级使用新版整包、旧持久目录及原密钥。涉及新挂载或工具时不能沿用仅换镜像的旧方式；真实跨版本验收须保留旧完整包及旧工具生成的备份。

文档修改不会回写已生成 ZIP，包内 README、模板和工具受清单校验。不要直接改包内文件或手工更新哈希冒充原包。下一次完整发布自动携带新源文档；已交付包的勘误单独说明，保留原 ZIP 摘要。

### 保持登录与会话升级

当前版本需配套更新客户端、Gateway、login-server、web-server 和 Database 镜像中的会话 SQL。确认空库初始化及保留旧库的 deploy 都执行 `upgrade_20261012_sessions.sql`，创建会话表和账号变更撤销触发器；部署工具等待数据库健康后执行该 SQL，失败停止后续整栈启动。升级前先停止旧服务，失败停止不等于自动关闭此前运行的服务。

最终包须验证 HTTP/HTTPS 的持久登录、页面内临时会话、重新打开进入选角、断线原角色与同地图镜头恢复、PIN、主动退出及账号变更撤销、会话和票据到期、服务重启与代理 Host。三端视口及 iOS/Android 真机后台冻结、页面回收分别记录；源码联调不能替代容器和真机验收。逐项标准见[当前验收清单](release-checklist.md#保持登录与断线恢复)。

### 运行验收

包内 README 来自 docker-deployment.md，部署者无需引用源码文档。部署工具根据 Docker daemon 架构选择镜像，而非根据运行 Python 的架构判断。使用 Rosetta 也不能改变目标 Docker 架构。

每次发布须针对最终包验证双架构构建与运行、空库初始化、已有库升级、登录选角、地图和音效、后台与冒险工具、重启持久化、备份恢复。自动校验不能代替运行验收，历史候选包的通过项不能直接沿用。逐项记录使用[当前验收清单](release-checklist.md)，未完成项明确列出。

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
