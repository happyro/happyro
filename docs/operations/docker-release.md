# Docker 离线镜像构建与交付

本文件是发布端与 Agent 的执行入口。部署机器只需要完成的离线包，不需要源码。用户明确要求不构建时，只维护工具和文档，不运行 build、package 或部署。

构建版本只读取 `deploy/docker/VERSION`。每次发布分别记录源码提交、离线包和远程镜像摘要；不能把不同日期的产物视为同一批。当前离线包与历史 Docker Hub 批次的交付记录见[版本摘要](../../changelog/README.md#版本摘要)。

自定义功能见[实现与维护说明](../architecture/customization.md)，用户操作见[部署手册](docker-deployment.md#服务端与资源自定义)。

## 版本与交付规则

- 发布版本只从 `deploy/docker/VERSION` 读取。修改目标版本时只修改此文件，历史产物和历史 Hub 推送记录不能替代当前批次的交付凭据。
- 应用、资源、配置和镜像使用同一个版本，默认组成一个完整目录交付。用户明确要求拆分时，可从同一个已校验 ZIP 生成互补的资源包与镜像／部署文件包，提供合并说明，并验证合并后的全部文件与完整包一致；拆分包不能单独部署。
- 资源复制、资源与模板校验清单、最终 ZIP 均排除任意层级的 `._*` 和 `.DS_Store`（包括同名目录及其内容），保留 `.env.example` 等业务文件。跨机器资源归档同样过滤这些文件，并禁用 macOS tar 自动生成 AppleDouble；不修改原始资源。旧发布包及其清单不会自动回写，后续重新准备的交付包使用此规则。
- 拆分包统一命名为 `happyro-<VERSION>-runtimes.zip`（resources/ 运行资源）与 `happyro-<VERSION>-images.zip`（双架构镜像及其余部署文件）。两者保留完整包的同名根目录，解压到同一目录后合并使用；版本从 `deploy/docker/VERSION` 读取。
- 允许六个构建仓库（根仓库、Client、Gateway、Server、Admin、API）带未提交改动直接打包，不自动提交、暂存或丢弃本地工作。记录每个仓库 HEAD、dirty 状态、Git 已跟踪及未被忽略的新文件的工作区内容指纹。跨机器准备和构建要求源码记录完全一致，仅 HEAD 相同不足以证明来源相同。正式构建前同步最新 origin/main。
- 五类镜像 Gateway（含完整 --all PWA）、Server、API、Admin、Database 全量无缓存构建，包含 linux/amd64 和 linux/arm64。不能复用旧 dist、vendor 或旧镜像。
- 全部构建成功后才允许组装离线包；全部归档校验成功才标记 offline-ready。没有镜像的准备包不可部署。
- 镜像发布目标为 docker.io/kugarocks/happyro-{gateway,server,api,admin,database}。用户要求推送时，全部构建、离线包及 OCI 校验成功后才从同一批归档推送双架构镜像；Docker Hub 的 latest 指向同一版本，离线部署不使用 latest。Compose 使用本地版本标签且 pull_policy=never；归档 SHA-256、镜像 ID 和架构均记录到发布清单。
- 发布成功后更新已发布版本记录；下一次发版只修改 VERSION，环境模板、工具不再硬编码应用版本。

## 一键与拆分入口

完成本文要求的源码、资源及构建能力准备后，可使用 `python3 tools/release/release.py offline create` 自动编排准备、五类双架构全量无缓存构建和完整 ZIP 校验。加 `--split` 同时从该完整包生成资源包与镜像／部署文件包，不跳过任何构建阶段。

```bash
python3 tools/release/release.py offline create --split
```

已登记的完整 ZIP 拆分，不重复构建：

```bash
python3 tools/release/release.py offline split --version "$(cat deploy/docker/VERSION)"
```

自动清理该版本的全部旧交付产物并全量重建、拆分：

```bash
python3 tools/release/release.py offline create --rebuild --version "$(cat deploy/docker/VERSION)" --split
```

一键输出位于 `artifacts/releases/<版本>/`，与下文分阶段构建共用登记、锁和状态。两份拆分 ZIP 都附带外层合并安装 README，镜像包保留完整部署 README；`happyro-<版本>-split.json` 记录批次、来源完整包及拆分 ZIP 摘要。另生成外部 `happyro-<版本>-SPLIT-README.md`，与两份 ZIP 内的合并说明逐字节一致，大小和 SHA-256 也纳入摘要报告。分发两份 ZIP、外部 README 及摘要报告；工具核对合并内容与完整包逐项一致。已有拆分输出拒绝覆盖，清理默认保留全部交付包及报告，`offline clean --version <版本> --include-package --execute` 才删除交付产物。

上述功能不自动部署或验收，默认不推送；只有 `offline create --push` 或独立 `offline push` 才发布 Docker Hub。真实发布仍须完成本文全部验收要求。详细参数、失败处理及当前验证范围见 [happyro-doc 使用说明](../../repos/happyro-doc/docs/development/offline-package.md)。

## 镜像体积维护

- 在 COPY 时设置最终文件权限和所有权，或在独立构建阶段整理后再复制到运行阶段；避免对已复制的大目录递归 chown/chmod，导致最终镜像重复存储文件。
- 包管理器缓存须在安装依赖的同一 RUN 中清理；后续层删除不会移除历史层中的内容。
- 精简不得删除运行依赖、双架构、查看器或游戏资源。权限调整后须验证非 root 初始化、目录刷新、日志挂载和健康检查。

## 1. 优先在本机检查并准备资源

此步骤需要 Python 3.11+ 和完整源码，不需要 Docker。准备资源和构建镜像可以在同一台机器完成。先检查实际工作区的资源和构建能力；输入齐全且具备双架构构建能力时，在本机完成准备、校验、构建和打包，不假定宿主机系统或已有产物。

每次发布先检查本地以下输入，不得因为本文列出远端资源机就直接执行 SSH 准备或 rsync 下载：

- `inputs/runtime/kro-20211105/client/DATA.INI` 及其引用的全部 GRF 文件。
- 同一客户端目录中的 `AI/`、`BGM/`、`System/`、`data/`。
- `work/game-data/items/kro-20211105/` 和 `work/game-data/monsters/kro-20211105/`。
- `repos/happyro-api/resources/game-data/world/` 下的 `npcs/`、`maps/`、`terrain/`。

本地输入齐全时，直接运行下面的 prepare 和 verify，不从 fnrocks 重复下载。目录存在只是初步检查，准备产物必须通过 verify。只有确认本地输入缺失后，才使用资源机 `fnrocks`（`10.24.1.1`），明确缺失项并决定补齐本地输入或在资源机准备完整目录；校验失败时先查明原因，不自动用远端资源覆盖本地输入。

资源来自 inputs/runtime/kro-20211105/client；物品和魔物图片来自 work/game-data/items/kro-20211105 与 work/game-data/monsters/kro-20211105；NPC、地图、地形图片来自 API 的 resources/game-data/world 对应目录。经过核验的运行资源只读复制，不从历史翻译工作区发布，不重新生成图片或 GRF。

如果需要把本机资源送到另一台构建电脑，可在工作区根目录生成按版本管理的传输归档；已有同版本资源包时使用 `resources create --rebuild` 重新生成：

| 资源源目录 | 跨机器同步方式 |
| --- | --- |
| `inputs/runtime/kro-20211105/` | 整个目录纳入资源归档；prepare 使用其中 `client/` 的 `DATA.INI`、其引用的 GRF，以及 `AI/`、`BGM/`、`System/`、`data/` |
| `work/game-data/items/kro-20211105/` | 资源归档；物品图片 |
| `work/game-data/monsters/kro-20211105/` | 资源归档；魔物图片 |
| `repos/happyro-api/resources/game-data/world/{npcs,maps,terrain}/` | 已纳入 API Git 仓库，随对应提交拉取 |

下面的资源归档命令完整收录前三个目录，保留相对于工作区的路径。无需同步整个 `inputs/`、`work/` 或 `artifacts/`；官方源材料 `inputs/official/`、翻译工作区、旧离线包、旧镜像、旧构建产物和运行中的数据库／存档均不属于此次资源传输输入。文件内容大小与磁盘占用可能不同，压缩包大小以实际生成结果为准。

传输前确认生成资源与当前源码一致：按 [LUB 回编译说明](../../tools/client/build/README.md) 校验当前 JSON 与运行 LUB，过期时先编译、语义验证、备份并安装，再核对目标哈希；物品和魔物图片应匹配当前资源映射，Admin 资料快照应与当前客户端／服务端来源一致。归档校验及 prepare/verify 只验证所收录内容的完整性，不证明生成产物已同步最新源码。源码或快照有更新时，构建机须同步这些代码变更，资源归档不包含 Git 仓库。

```bash
python3 tools/release/release.py resources create
```

输出位于 `artifacts/resources/<版本>/`：`happyro-<版本>-resources-transfer.tar.gz`、同名 `.sha256` 及 `resources-manifest.json`。清单记录目录、文件大小与 SHA-256；工具排除 macOS 元数据，拒绝符号链接与特殊文件，验证归档内容和打包前后的输入一致性。只需 Python 3.11+，不依赖 Bash、外部 tar 或 sha256sum。

将三个文件传到目标电脑，先在归档目录运行 `shasum -a 256 -c happyro-<版本>-resources-transfer.tar.gz.sha256`（Linux 可用 `sha256sum -c`），再在 HappyRO 工作区根目录运行 `tar -xzf /path/to/happyro-<版本>-resources-transfer.tar.gz`。目标电脑还需对应的六个代码仓库；NPC、地图和地形图片由 API 仓库提供。然后执行下面的 `prepare` 和 `verify --prepared`。资源传输包是构建输入，不是可部署离线包，也不能代替 runtimes 拆分包。

已有输出默认拒绝覆盖；`python3 tools/release/release.py resources create --rebuild` 在同一版本锁内先校验输入，再清理旧资源包并重新生成。预检失败保留旧包，清理后构建失败不恢复旧包。用 `python3 tools/release/release.py resources clean --version <版本>` 预览清理，加 `--execute` 删除资源包、摘要与清单后可重新生成。资源传输状态保存在 `work/resource-transfers/<版本>/`；该清理不影响 `artifacts/releases/` 或验收数据。`offline create / offline create --rebuild` 不会自动生成或删除资源传输包。

跨机器构建先传输资源归档和源码，再在目标工作区执行 stage prepare。版本登记绑定当前工作区，不支持直接搬移另一工作区的准备目录或状态文件。

构建前核对 `configs/Config.happyro.js` 与 Client 的 `applications/pwa/Config.happyro.js` 内容一致（可忽略 CRLF/LF）。Gateway Dockerfile 使用 Client 中的配置副本；若不同，先审查并同步配置源，重新核对六个构建仓库。prepare/build 允许未提交改动，前后核对源码指纹，但不会替你同步 origin/main 或判断配置语义一致。

预检 Admin NPC 快照时，同时核对条目内容和来源指纹。条目内容未变不代表快照来源仍与当前 Server 一致；来源校验失败时，按 Admin 的目录生成流程重新生成并审查差异，提交实际变更后再 prepare/build，不手改指纹绕过校验。

源码中的部署工具测试需要在安装了 PyYAML 的 Python 环境中运行；此要求不影响离线部署机器，镜像内已包含该依赖。

如在 macOS 运行部署工具测试遇到临时路径的符号链接拒绝，先检查临时目录是否经过 `/var` 等符号链接。为该次测试指定工作区内的真实目录，不关闭路径安全检查。在源码根目录执行：

```bash
mkdir -p work/deployment-test-tmp
```

```bash
TMPDIR="$(pwd -P)/work/deployment-test-tmp" python3 -m unittest discover -s tools/deployment -p 'test_*.py'
```

该设置只作用于这次测试；其它测试失败仍须逐项排查，不能统一归因于临时目录。

在源码根目录执行：

```bash
python3 tools/release/release.py stage prepare --version "$(cat deploy/docker/VERSION)"
```

```bash
python3 tools/deployment/manage.py verify --directory "artifacts/releases/$(cat deploy/docker/VERSION)/bundle" --prepared
```

prepare 要求版本目录不存在并显式指定与 VERSION 一致的版本，从 VERSION 生成包内版本、环境模板和资源清单，记录六个构建仓库的源码状态，并预留空 images/。资源与配置都计算 SHA-256。未被 Git 忽略的新文件也纳入源码指纹；截图、日志和生成物应放在已忽略的 work/ 或 artifacts/。

## 2. 在本机构建镜像

API 使用 Go 构建镜像和 Debian slim 运行镜像；Admin 使用 Node 构建镜像和固定摘要的 Nginx Alpine slim 运行镜像。具体版本以两仓库 `deploy/docker/Dockerfile` 为准。构建前确认基础镜像提供 amd64 和 arm64 清单；Go 二进制按目标架构交叉编译，前端在构建机架构上全量构建。变更基础镜像必须重新构建并部署，不会自动更新已有容器或离线包。

构建机器需要完整源码、Python 3.11+、Docker Buildx、Skopeo，以及双架构构建能力。Linux 使用 Docker Engine，macOS 使用 OrbStack 或 Docker Desktop 的 Linux 容器。构建期间需要联网下载基础镜像和依赖；离线的是最终部署过程。

正式构建前检查当前 Buildx builder 的 driver、可用平台及 OCI 导出能力（`docker buildx inspect`）；仅安装 Buildx 不等于能导出双架构 OCI。优先使用已配置的 docker-container builder；若尚无可用 builder，先在构建机完成创建、启动及所需的原生节点或仿真配置，再确认 amd64/arm64 均可用。预检未通过不要执行 build。

本机已完成第 1 步时，直接构建，无需复制准备目录：

```bash
python3 tools/release/release.py stage build --version "$(cat deploy/docker/VERSION)"
```

目标构建机缺少资源时，先按上节传输资源归档，再从 stage prepare 开始。三个阶段必须在同一个登记工作区依次完成。

构建输出固定为 gateway.tar、server.tar、api.tar、admin.tar、database.tar 五个双架构 OCI 归档，全部完成才写 built.json。输出目录必须不存在。构建期间不修改源码。Admin 使用已跟踪的 npm 锁文件，API 使用 go.mod/go.sum；Client/Gateway 没有跟踪 npm 锁文件，同一提交重建可能解析到更新依赖，回退须使用已保存的原始归档。

## 3. 将镜像放入统一离线包

```bash
python3 tools/release/release.py stage package --version "$(cat deploy/docker/VERSION)"
```

package 校验 built.json、五个 OCI 哈希、双架构以及与准备包的版本和提交一致性。随后使用 Skopeo 把同一批 OCI 产物转为 Docker 可加载归档，不重新构建、不访问镜像仓库：

```text
images/
├── amd64/
│   ├── gateway.tar
│   ├── server.tar
│   ├── api.tar
│   ├── admin.tar
│   └── database.tar
└── arm64/
    ├── gateway.tar
    ├── server.tar
    ├── api.tar
    ├── admin.tar
    └── database.tar
```

这些是最终指定位置，不能把双架构 OCI tar 冒充 Docker-save 归档。组装失败保留现场与日志，登记为 failed，禁止直接跳阶段重试或修改清单。使用 offline clean --include-package --execute 后从 stage prepare 开始，或 offline create --rebuild 全量重建。任何源码改变都需重新准备并全量无缓存构建五类镜像。

offline-ready 表示目录的资源和镜像已通过校验，不代表 ZIP 已生成，更不代表运行验收通过；必须等待 package 成功退出，并按下方清单验收最终 ZIP。

全部目录校验通过后，package 根据 VERSION 自动生成唯一的外层交付产物 `happyro-<VERSION>.zip`，ZIP 内的根目录固定为 `happyro-版本/`，不再生成 `.tar.gz` 或外层 SHA-256 文件。工具拒绝已有目标文件、`.env`、非空 data/ 和符号链接。ZIP 必须包含 images/、resources/、tools/、examples/custom/ 模板、配置及空 data/ 目录。禁止包含实际用户 custom/；自定义目录由部署端初始化，升级保留 CUSTOM_DIR。不要在交付目录初始化密钥或运行游戏，以免把密钥和存档分发出去。built.json 和双架构 OCI 是构建端中间产物，保留在 artifacts/releases/<版本>/images/，不需要重复放入最终包。

## 验收

### 包含自定义功能的版本

1. 确认 API 镜像带 Server npc/conf 基线及 import-tmpl 初始化出的 import 快照；否则空库迁移成功后目录刷新仍可能失败。
2. prepare/build 使用不存在的输出路径，记录六个仓库当前源码状态。失败即停止后续 package/deploy，保留日志；修复源码后重新准备，五类镜像再次全量无缓存构建，不只重建失败组件。
3. 核对 ZIP 的 examples/custom/npc/scripts.conf、Server 当前 db 模板和包内 custom.py。catalogs.py 在 API 镜像内，部署端不需要安装 PyYAML。
4. ZIP 不含用户 custom、密钥和存档。独立解压后才 initialize；定制测试文件不混入发行模板。
5. 空库验收检查八服务健康、api-init 退出 0、三类导入；再检查 NPC、数据库目录、资源更新/删除、重复初始化及精确备份恢复。
6. 升级使用新版整包、旧持久目录及原密钥。涉及新挂载或工具时不能沿用仅换镜像的旧方式；真实跨版本验收须保留旧完整包及旧工具生成的备份。

文档修改不会回写已生成 ZIP，包内 README、模板和工具受清单校验。不要直接改包内文件或手工更新哈希冒充原包。下一次完整发布自动携带新源文档；已交付包的勘误单独说明，保留原 ZIP 摘要。

### 保持登录与会话升级

当前版本需配套更新客户端、Gateway、login-server、web-server 和 Database 镜像中的会话 SQL。确认空库初始化及保留旧库的 deploy 都执行 `upgrade_20261012_sessions.sql`，创建会话表和账号变更撤销触发器；部署工具等待数据库健康后执行该 SQL，失败停止后续整栈启动。升级前先停止旧服务，失败停止不等于自动关闭此前运行的服务。

最终包须验证 HTTP/HTTPS 的持久登录、页面内临时会话、重新打开进入选角、断线原角色与同地图镜头恢复、PIN、主动退出及账号变更撤销、会话和票据到期、服务重启与代理 Host。三端视口及 iOS/Android 真机后台冻结、页面回收分别记录；源码联调不能替代容器和真机验收。逐项标准见[当前验收清单](release-checklist.md#保持登录与断线恢复)。

### 运行验收

最终完整 ZIP 的隔离启动与基础检查可使用 [offline 验收工具](../../tools/acceptance/offline/README.md)，操作步骤见 [公开文档](../../repos/happyro-doc/docs/development/offline-acceptance.md)。它只验证包完整性、服务健康、HTTP 入口及罗安登录进图和移动，不替代下列完整发布验收。

试打包也执行完整构建与包校验，但使用独立输出、解压、数据及自定义目录，测试 NPC 不加入发行模板。记录源码提交、ZIP SHA-256、实际运行架构、已验证操作及未验证边界，证据放在 `work/` 或 `artifacts/`。双架构构建成功不等于双架构运行通过，桌面测试不等于手机／平板真机通过；试打包成功不更新已发布版本、公开下载或 Docker Hub 标签，也不直接勾选正式发布清单。

包内 README 来自 docker-deployment.md，部署者无需引用源码文档。部署工具根据 Docker daemon 架构选择镜像，而非根据运行 Python 的架构判断。使用 Rosetta 也不能改变目标 Docker 架构。

每次发布须针对最终包验证双架构构建与运行、空库初始化、已有库升级、登录选角、地图和音效、后台与冒险工具、重启持久化、备份恢复。自动校验不能代替运行验收，历史候选包的通过项不能直接沿用。逐项记录使用[当前验收清单](release-checklist.md)，未完成项明确列出。

## Docker Hub 发布

用户已登录 Docker Hub 且明确要求推送时才执行本节。使用 Docker 的凭据助手，不将凭据写入日志。以下命令均在根仓库运行，版本只读取 `deploy/docker/VERSION`；需要 Skopeo 和 Python 3。离线包使用完整版本标签，部署仍使用 `--pull never`。

普通打包及拆分默认不推送。显式使用 `offline create --push`、`offline create --split --push` 或 `offline create --rebuild --push` 才在所有本地打包步骤成功后追加推送；该开关不执行游戏验收，也不表示满足全部正式交付要求。自动推送的核验记录位于 `work/releases/<版本>/logs/<批次>/dockerhub/`。

一键流程生成的产物可单独推送，无需重建：

```bash
release_version=$(cat deploy/docker/VERSION)
```

```bash
python3 tools/release/release.py offline push --version "${release_version}"
```

推送失败保留本地包和核验记录，不自动回滚远程标签；修复问题后使用独立 push 重试整批镜像。推送要求原始 OCI 与完整 bundle 均保留，不能先 clean 删除中间产物再仅凭 ZIP 推送。

完成离线包构建与校验后，可使用仓库内的 [release.py offline push](../../tools/release/release.py) 执行下述全部发布步骤：

```bash
docker login
```

```bash
python3 tools/release/release.py offline push --version "$(cat deploy/docker/VERSION)"
```

发布入口需要 Python 3.11+ 和 Skopeo，先校验 `artifacts/releases/<版本>/images/` 中五个 OCI 归档的哈希、双架构、版本与离线包来源提交，再依次推送版本标签、更新 latest、核对远程摘要；任一步失败立即停止。不带参数仅显示帮助，支持 `--no-color`，创建版本读取 VERSION，独立 push 使用显式 --version 对应的已登记产物。

### zsh 的 `atest` 仓库名问题

2026-09-25 更新 latest 时，命令中的 `happyro-$name:latest` 被 zsh 解析为 `$name:l`（将变量值转小写）加上字面量 `atest`，实际目标变成 `happyro-gatewayatest` 等错误仓库。双引号和外层子 shell `( ... )` 都不能阻止这种展开；代码块标注 bash 也不会改变粘贴命令时使用的 shell。参见 [zsh 参数修饰符文档](https://zsh.sourceforge.io/Doc/Release/Expansion.html#Modifiers)。

**拼接镜像引用时，变量一律使用 `${name}`、`${release_version}` 等花括号形式，尤其是冒号前的变量。** 正确形式是 `happyro-${name}:latest`。推送前打印完整源地址和目标地址，检查仓库名与标签；不能仅凭 copy 返回成功判断发布成功。

### 推送与远程核验顺序

使用上面的 `offline push` 命令统一执行以下步骤，任一步失败立即停止：

1. 核对已登记版本的 bundle、五类 OCI 归档 SHA-256、源码记录及 amd64/arm64 清单，整批通过后才允许远程写入。
2. 将五类原始 OCI 的全部架构推送到版本标签，保留摘要；逐一读取远程完整 index，与对应本地 index 比较。
3. 全部版本标签通过后，再将五个版本标签的全部架构复制到 latest。
4. 重新读取版本标签和 latest，分别核对完整 index 及 amd64/arm64 子 manifest 与本地内容一致，保存原始响应和 verified.json。

五类镜像全部通过后才记录 Docker Hub 发布成功。推送失败保留证据，修复后再次执行同一条 `offline push` 命令，不手工跳过批次校验或取消摘要保留。远程标签不会自动回滚。

修复错误仓库名后，`happyro-gatewayatest`、`happyro-serveratest`、`happyro-adminatest`、`happyro-databaseatest` 不会自动消失；核实没有使用者后可单独删除，删除不属于上述推送流程。

## Go Admin 独立浏览器验收

重写开发时可对本地测试镜像运行 `tools/deployment/test_api_backup.py`，使用 `HAPPYRO_GO_API_TEST_IMAGE`、`HAPPYRO_GO_DATABASE_TEST_IMAGE` 和 `HAPPYRO_ADMIN_TEST_IMAGE` 指定三类本地镜像。测试复用正式 Compose 的代理网络、地址池及信任配置，通过 Admin 登录并核对数据库记录的来源 IP，同时验证客户端伪造的转发头被覆盖。测试使用临时 Compose 项目和数据库，不替换现有服务。

设置 `HAPPYRO_GO_BROWSER_PROBE` 为 `tools/deployment/api_browser_probe.cjs` 的绝对路径，可同时检查浏览器登录、账号列表、刷新后的会话和物品列表。需要安装 `playwright-core`，并通过 `NODE_PATH` 指向其所在的 node_modules；`HAPPYRO_GO_CHROME_BINARY` 指定本机 Chrome/Chromium 可执行文件。此模式仅向回环地址开放临时端口，使用临时管理库的 admin/admin；可用 `HAPPYRO_GO_BROWSER_SCREENSHOT` 指定 work/ 下的截图路径。测试结束自动删除临时容器和数据库。组件验收不能替代正式离线包发布流程。

代理网络回归可单独运行，无需构建产品镜像：使用本机已有且包含 `sleep`、`true` 的 Linux 镜像设置 `HAPPYRO_NETWORK_TEST_IMAGE`，执行 `python3 -m unittest discover -s tools/deployment -p 'test_proxy_network.py'`。测试按正式依赖顺序启动 API 与 Admin 占位容器，并重建 API，验证动态地址不占用固定代理地址；不验证产品 HTTP 行为。两类测试均创建独立 Compose 项目并自动清理，不使用生产数据。若本机已占用默认代理网段，通过 `HAPPYRO_TEST_ADMIN_PROXY_SUBNET`、`HAPPYRO_TEST_ADMIN_PROXY_DYNAMIC_RANGE`、`HAPPYRO_TEST_ADMIN_PROXY_IP` 三项配套指定隔离测试网段。
