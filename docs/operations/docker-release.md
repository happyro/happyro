# Docker 离线镜像构建与交付

本文件是发布端与 Agent 的执行入口。部署机器只需要完成的离线包，不需要源码。用户明确要求不构建时，只维护工具和文档，不运行 build、package 或部署。

## 版本与交付规则

- 下一次发布版本只从 `deploy/docker/VERSION` 读取。已发布版本为 v0.2.0（2026-09-17 全量重建，Mac 本机从 ZIP 离线部署并完成自动验收）。
- 应用、资源、配置和镜像使用同一个版本，组成一个完整目录交付，不单独发布资源包。
- 五个仓库（根仓库、Client、Gateway、Server、Admin）须处于最终、干净的提交；仅在跨机器准备和构建时，要求两台机器的五仓库提交完全一致。正式构建前同步最新 origin/main，禁止丢弃本地工作。
- 四类镜像 Gateway（含完整 --all PWA）、Server、Admin（含后台前端）、Database 全量无缓存构建，包含 linux/amd64 和 linux/arm64。不能复用旧 dist、vendor 或旧镜像。
- 全部构建成功后才允许组装离线包；全部归档校验成功才标记 offline-ready。没有镜像的准备包不可部署。
- 镜像发布目标为 docker.io/kugarocks/happyro-{gateway,server,admin,database}。用户要求推送时，全部构建及 OCI 校验成功后才从同一批归档推送双架构镜像，再组装离线包；不使用 latest。Compose 使用本地版本标签且 pull_policy=never；归档 SHA-256、镜像 ID 和架构均记录到发布清单。
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

首次发布必须实际验证两种架构的镜像构建、空库初始化、已有库升级、登录选角、地图和音效、后台与冒险工具、重启持久化、备份恢复。自动校验不能代替这些验收。v0.2.0 已完成双架构构建及 Mac arm64 离线部署验收；amd64 运行验收尚未执行。

2026-09-17 14:54（Asia/Shanghai，UTC 06:54–07:07）从最新五个构建仓库提交全量无缓存重建 Gateway（PWA --all）、Server、Admin 和 Database 的 amd64/arm64 镜像；构建输出目录原先不存在，没有复用旧 dist、vendor 或旧 `artifacts/images/release`。镜像源码为根仓库 `075eeefe68e8a230ded0a01a871c45d79fb7df45`、Client `5d96fffde536d3bbe6060ae1393181b2ad2ae221`、Gateway `f1bd96ce4fe1a6bf4f26b721add872f02f35c814`、Server `d8bb71f35559e06040a557f1bec55d956ff6f437`、Admin `f6c4b7d14ce7e63266f380a40e6dbd5de39f6a47`。双架构 OCI 摘要见 `artifacts/images/release/built.json`（gateway `1fe440e55e529dfbb595d80f9944695cb5c9a3cf5c617e604c5bfe67179e0c06`、server `33eed06957f95494f8bc01ff61ec1021c4c23de989fec2a89a43976649b3585d`、admin `563734d6b2185a0191a9972674ec706546958991e0c88452ede2b8cbc49934e1`、database `74b0a88c3d54e05f049fa41374d815358125653167cb4ae5ade94f34d1c1fe22`）；各架构 Docker-save 归档 SHA-256、镜像 ID 见包内 `release-manifest.json`。统一离线包为 `artifacts/deployment/happyro-v0.2.0.zip`（4,581,306,655 字节，SHA-256：`74f255c730832d14196fb37253a0b7a83f0a1dd2793f446ad278400c15ce69a3`）。已用同一批 OCI 归档通过 Skopeo `copy --all` 推送到 Docker Hub：`docker.io/kugarocks/happyro-{gateway,server,admin,database}:v0.2.0` 与同内容的 `:latest`。远程 index 与本机 `artifacts/images/release/{gateway,server,admin,database}.tar` 的 linux/amd64、linux/arm64 清单摘要一致（gateway `sha256:72c69978e788cd2767359fc3f539a1f276bb1b0fea85009abbcea2111d362eae`、server `sha256:f7b230f32e8dfbba032ea4c2fc6fd721a3c888b41db540ccc8858916ad5fd95f`、admin `sha256:c0cea5cdefdcaef56bce44a7bf9e1f9707640de7b9e8ed09923ecc6b47f9d197`、database `sha256:1155d4cb51769d293115bc0612deecf7b96cc52b4a056a0e2c9eecc0e6478324`）。离线部署仍使用包内版本标签和 `--pull never`。

Mac arm64（OrbStack linux/arm64）从该 ZIP 解压到 `artifacts/deployment/install/happyro-v0.2.0`（不是构建工作目录），使用包内工具完成 `verify`、daemon 架构镜像导入（`verify_loaded` 成功）、空目录 `initialize` 生成 `.env`，以及 `deploy`（Compose `--pull never --no-build`，镜像标签 `docker.io/kugarocks/happyro-{gateway,server,admin,database}:v0.2.0`）。两次 `docker compose ps -a` 均显示七个常驻服务健康且 `admin-init` 以 0 退出。两次获取 `http://127.0.0.1:3338/applications/pwa/index.html` 均为 HTTP 200，页面含「进入游戏」和查看器入口，不是直接启动游戏的 `index.html`。两次获取 `http://127.0.0.1:8000/` 均为 HTTP 200。本机无无头浏览器，未截启动页画面。

未在本机运行 amd64 容器；未执行游戏内登录/选角、地图与 BGM 播放、冒险工具交互、重启持久化、已有库升级或备份恢复。这些项仍为已知未验证。

## Docker Hub 发布

用户已登录 Docker Hub 且明确要求推送时，将全部已校验的 OCI 归档通过 Skopeo `copy --all` 推送到上述命名空间。使用 Docker 的凭据助手，不将凭据写入日志。推送后核对远程 manifest 的双架构及配置摘要。离线包使用同样的完整标签，部署仍使用 `--pull never`。
