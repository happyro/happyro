# Docker 离线镜像构建与交付

本文件是发布端与 Agent 的执行入口。部署机器只需要完成的离线包，不需要源码。用户明确要求不构建时，只维护工具和文档，不运行 build、package 或部署。

## 版本与交付规则

- 下一次发布版本只从 `deploy/docker/VERSION` 读取。已发布版本为 v0.2.0（2026-09-14，Mac 本机构建及离线部署）。
- 应用、资源、配置和镜像使用同一个版本，组成一个完整目录交付，不单独发布资源包。
- 五个仓库（根仓库、Client、Gateway、Server、Admin）须处于最终、干净的提交；两台机器的五仓库提交必须完全一致。正式构建前同步最新 origin/main，禁止丢弃本地工作。
- 四类镜像 Gateway（含完整 --all PWA）、Server、Admin（含后台前端）、Database 全量无缓存构建，包含 linux/amd64 和 linux/arm64。不能复用旧 dist、vendor 或旧镜像。
- 全部构建成功后才允许组装离线包；全部归档校验成功才标记 offline-ready。没有镜像的准备包不可部署。
- 镜像发布目标为 docker.io/kugarocks/happyro-{gateway,server,admin,database}。用户要求推送时，全部构建及 OCI 校验成功后才从同一批归档推送双架构镜像，再组装离线包；不使用 latest。Compose 使用本地版本标签且 pull_policy=never；归档 SHA-256、镜像 ID 和架构均记录到发布清单。
- 发布成功后更新已发布版本记录；下一次发版只修改 VERSION，环境模板、工具不再硬编码应用版本。

## 1. 在有资源的机器上准备

此步骤需要 Python 3.11+ 和完整源码，不需要 Docker。当前资源主机可使用 10.24.1.1。

资源来自 inputs/runtime/kro-20211105/client；物品和魔物图片来自 work/game-data/items/kro-20211105 与 work/game-data/monsters/kro-20211105；NPC、地图、地形图片来自 Admin 的 backend/resources/game-data/world 对应目录。经过核验的运行资源只读复制，不从历史翻译工作区发布，不重新生成图片或 GRF。

在源码根目录执行：

```bash
python3 tools/deployment/manage.py prepare --workspace . --output artifacts/deployment/release
python3 tools/deployment/manage.py verify --directory artifacts/deployment/release --prepared
```

输出目录必须不存在。prepare 从 VERSION 生成包内版本、环境模板和资源清单，记录五仓库提交，并预留空 images/。资源与配置都计算 SHA-256。任何未跟踪文件也会触发脏仓库检查；截图等应放在已忽略的 work/ 或 artifacts/，不要提交无关文件。

## 2. 在另一台机器构建

构建机器需要完整源码、Python 3.11+、Docker Buildx、Skopeo，以及双架构构建能力。macOS 使用 Docker Desktop 的 Linux 容器。构建期间需要联网下载基础镜像和依赖；离线的是最终部署过程。

将准备目录从资源机复制到构建机的 artifacts/deployment/release，保留空目录和完整结构。例如在 Mac 上执行（替换 SSH 用户与路径）：

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

全部目录校验通过后，package 根据 VERSION 自动生成唯一的外层交付产物 `happyro-v0.2.0.zip` 及 `happyro-v0.2.0.zip.sha256`，ZIP 内的根目录固定为 `happyro-版本/`，不再生成 `.tar.gz`。工具拒绝已有目标文件、`.env`、非空 data/ 和符号链接。ZIP 必须包含 images/、resources/、tools/、配置及空 data/ 目录。不要在交付目录初始化密钥或运行游戏，以免把密钥和存档分发出去。built.json 和双架构 OCI 是构建端中间产物，可在 artifacts/images/ 留存，不需要重复放入最终包。

## 验收

包内 README 来自 docker-deployment.md，部署者无需引用源码文档。目标 Mac 根据 Docker daemon 架构选择镜像，而非根据运行 Python 的架构判断。使用 Rosetta 也不能改变目标 Docker 架构。

首次发布必须实际验证两种架构的镜像构建、空库初始化、已有库升级、登录选角、地图和音效、后台与冒险工具、重启持久化、备份恢复。自动校验不能代替这些验收。v0.2.0 已完成双架构构建及 Mac arm64 离线部署验收；amd64 运行验收尚未执行。

## Docker Hub 发布

用户已登录 Docker Hub 且明确要求推送时，将全部已校验的 OCI 归档通过 Skopeo `copy --all` 推送到上述命名空间。使用 Docker 的凭据助手，不将凭据写入日志。推送后核对远程 manifest 的双架构及配置摘要。离线包使用同样的完整标签，部署仍使用 `--pull never`。
