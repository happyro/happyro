# HappyRO 离线部署

本手册随 `.zip` 离线包作为 README.md 交付。目标机器无需 Git 源码、Node、PHP、Skopeo 或镜像仓库连接。需要已安装的 Docker Engine/Compose v2（macOS 使用 Docker Desktop）与 Python 3.11+。

应用、镜像、资源统一版本，以包内 VERSION 和 release-manifest.json 为准。一个完整包包含所有内容；不要替换为其它版本的资源或镜像。

## 目录与持久化

```text
happyro-版本/
├── README.md
├── VERSION
├── compose.yaml
├── .env.example
├── release-manifest.json
├── images/
│   ├── amd64/                 # gateway/server/admin/database.tar
│   └── arm64/                 # gateway/server/admin/database.tar
├── resources/
│   ├── manifest.json
│   ├── kro-20211105/          # DATA.INI、GRF、AI、BGM、System、data
│   └── catalog/               # items、monsters、npcs、maps、terrain
├── examples/custom/           # 新增脚本清单、数据库模板及说明
├── custom/                    # initialize 后创建，不属于发行文件
│   ├── npc/                   # scripts.conf、additions/、overrides/
│   ├── db/                    # rAthena db/import
│   └── resources/             # 相对于客户端 data/ 的资源
├── tools/deployment/
│   ├── manage.py
│   ├── custom.py
│   └── offline.py
└── data/
    ├── database/
    ├── admin-storage/
    ├── server-settings/
    ├── server-logs/
    ├── gateway-logs/
    └── control-socket/
```

首次初始化在本机生成保密的 .env。所有持久化使用宿主机目录 bind mount，不使用 named volume；resources/ 只读。data/control-socket 是运行状态，无需备份。升级不得删除 data/ 或 CUSTOM_DIR。custom/ 由用户维护，不参与发行文件哈希校验，正式 ZIP 禁止包含这个实际运行目录。

在 Mac 上将整个包放在 Docker Desktop 允许文件共享的本地目录。镜像归档导入后还会占用 Docker 虚拟磁盘空间，需同时容纳包、解压资源、导入镜像及数据库。不要直接把远程主机路径写作本机挂载路径；先复制完整包到本地。

## 首次部署

所有命令在解压后的包根目录执行。不运行 docker compose pull；Compose 已禁止拉取，镜像必须从包中导入。

```bash
python3 tools/deployment/manage.py verify --directory .
python3 tools/deployment/manage.py import-images --directory .
python3 tools/deployment/manage.py initialize --directory .
```

verify 要求 offline-ready 状态，检查配置、资源和两种架构的镜像归档。缺失镜像的 prepared-not-built 准备包会被拒绝。import-images 根据 Docker daemon 的 Linux 架构导入对应四个镜像，并核对镜像 ID；Apple Silicon 通常为 arm64，Intel 为 amd64。它不会启动容器。

编辑 .env：

- GAME_PUBLIC_URL：默认 `http://127.0.0.1:3338`，局域网访问时改为主机 IP。
- ADMIN_PUBLIC_URL：默认 `http://127.0.0.1:8000`，局域网访问时改为主机 IP。
- ADMIN_STATEFUL_DOMAINS：默认 `127.0.0.1:8000`，不含协议；局域网访问时同步改为主机 IP。
- SOCKET_PROXY_URL：默认留空并使用当前页面同源的 `/ws/`；WebSocket 使用独立域名时填写完整前缀，例如 `wss://happyro-ws.example.com/ws/`。
- GATEWAY_PORT、ADMIN_PORT：默认 3338、8000。修改端口时同步 URL。
- RESOURCE_DIR、DATA_DIR：默认 ./resources、./data。自定义时先复制资源、创建 data/ 中所有子目录，挂载不自动创建缺失路径。
- 本模板默认局域网 HTTP。使用 HTTPS 时设置 SESSION_SECURE_COOKIE=true，并确保反向代理传递原始协议。

默认 `127.0.0.1` 仅适用于部署机器本机浏览器，其他设备访问应填写部署机器的局域网地址。initialize 生成随机密钥；保留 APP_KEY，已有 .env 不会被覆盖。镜像变量必须保持该包 .env.example 中的值。

```bash
python3 tools/deployment/manage.py deploy --directory .
docker compose ps -a
```

部署初始化会幂等创建后台 `admin/admin` 超级管理员和游戏 `happyro/happyro` GM 账号；重复运行不会新增重复账号。deploy 校验整个包、Compose 镜像配置和已导入镜像后启动，不构建、不拉取、不覆盖 .env。首次后台初始化可能耗时，使用 docker compose logs admin-init 查看迁移、默认账号和图鉴导入。

admin-init 依次执行：数据库迁移（`migrate --force`）→ 创建默认管理员 → 导入物品（`game-data:import-items --all`）→ 导入魔物（`game-data:import-monsters --renewal`）→ 导入 NPC（`game-data:import-npcs --renewal`）。三条导入命令都以 `-d memory_limit=512M` 运行，避免大目录导入时触发内存限制。

游戏入口：GAME_PUBLIC_URL/applications/pwa/index.html，应先显示启动页。后台入口为 ADMIN_PUBLIC_URL。

## 服务与后台维护

正常运行七个服务容器和一个完成后退出的 admin-init：

Compose 已为服务设置固定容器名（如 `happyro-admin`、`happyro-gateway`、`happyro-map`），不会再追加默认的 `-1` 序号。固定容器名意味着同一台主机不能同时运行两个相同部署包实例；如需并行实例，应修改 Compose 中的容器名前缀。

| 镜像 | 服务 |
| --- | --- |
| Gateway（含全量 PWA 和中文覆盖） | gateway |
| Server（PACKETVER=20211103、Renewal） | login、char、map、web-api |
| Admin（前端、Laravel、Nginx、PHP-FPM） | admin、admin-init |
| Database（MariaDB 10.11） | database |

后台默认宿主机 8000 → 容器 8080；游戏 3338 → 3338，其余端口只在 Docker 网络内。后台资料版本固定在配置中（kro-20211105、2fe6ab3dc4d8），不是应用发布版本，不在页面修改。

Admin 容器的 PHP 运行时限制为 `memory_limit=256M` 并开启 OPcache（`deploy/docker/admin/php.ini`），nginx 对 JSON、JS、CSS 等文本响应开启 gzip；Gateway 对反代到 Admin 的 `/api/adventure-tools/*` 响应同样启用压缩。这两项都只在镜像里生效，修改配置文件后必须重新构建镜像，重启容器不够——OPcache 默认 `validate_timestamps=0`，只信任构建时的文件快照。

游戏依赖链是 database → login → char → map → web-api → gateway。Admin 等待数据库、admin-init 完成和 web-api 健康。游戏不等待 Admin；后台停机时，依赖后台能力的冒险工具标签不可用或不显示，登录、战斗和 NPC 不依赖后台。

```bash
docker compose stop admin
docker compose up -d --pull never admin
```

后台初始化失败时，整栈启动可能报错；检查 ps -a 和 logs，必要时单独启动游戏链：docker compose up -d --pull never gateway。停止 Admin 不要停止共享数据库。Admin 和 Server 共享 data/server-settings，battle_conf.txt 的运营变更须备份；不能改成单文件挂载。

## 升级

1. 保留新版完整包并执行 verify；先在旧部署目录停止写入并备份（见下节）。同一存档只能有一套游戏服务运行。
2. 在新版包根目录复制旧 .env，保留 APP_KEY、数据库密码和控制令牌；从新版 .env.example 更新 RELEASE_VERSION 和四个 IMAGE 变量。
3. 将 DATA_DIR 指向旧部署已停止写入的数据目录（建议绝对路径），CUSTOM_DIR 指向旧的自定义目录（同样建议绝对路径），RESOURCE_DIR 使用新版包内资源。不要把新的空 data/ 或 custom/ 当成旧内容。
4. 执行 `python3 tools/deployment/manage.py initialize-custom --directory .`：首次引入自定义功能时建立目录；后续仅补齐新版新增的模板文件，已有文件不覆盖，不合并。旧版本备份需使用旧版本配套工具恢复，不能直接交给新工具。
5. 导入本版镜像，再启动 database，显式执行 Admin 迁移和快照导入，成功后启动整栈。

```bash
python3 tools/deployment/manage.py import-images --directory .
docker compose up -d --pull never database
docker compose run --rm --no-deps --pull never admin-init
python3 tools/deployment/manage.py deploy --directory .
```

原有 Compose 项目名应保持一致。数据库初始化 SQL 只对空目录执行；Server schema 变化需先审查该版本升级 SQL，并在停写后显式执行。工具不盲目执行历史升级脚本。

`admin-init` 每次都会完整重跑迁移和三条导入命令，所以正常升级流程已经覆盖新增的导入步骤。只有跳过 `admin-init`、只对已有数据库单独执行 `migrate` 的场景才需要注意：新迁移建出的表（例如 `game_npcs`）不会自动有数据，必须单独补跑对应的 `artisan game-data:import-*` 命令，否则查询接口会一直返回空结果。

## 备份与恢复

先停止所有写入，仅保留 database 运行。数据库含非事务表，不能在有写入时仅凭 single-transaction 获得一致备份。

```bash
docker compose stop gateway admin web-api map char login
python3 tools/deployment/manage.py backup --directory . --output ../backups/before-upgrade
```

普通备份完成后可运行 deploy 恢复服务；准备升级时保持停写。备份包含三个数据库（happyro、happyro_log、happyro_admin）、Admin storage、server-settings、整个 CUSTOM_DIR（脚本、数据库扩展、资源）、.env 和部署清单。备份含密钥，应复制到异机；无 checksums.json 的部分备份不可恢复。完整离线包另行保存，备份不会重复复制镜像和资源。

恢复优先使用匹配版本的完整包及新的宿主机数据目录。复制备份 .env、核对 DATA_DIR、CUSTOM_DIR、资源路径和地址，保留原 APP_KEY，不重新 initialize。先执行 initialize-custom 建立容器需要的挂载目录，再恢复：

```bash
python3 tools/deployment/manage.py import-images --directory .
docker compose up -d --pull never database
python3 tools/deployment/manage.py restore --directory . --backup ../backups/before-upgrade --confirm-replace
python3 tools/deployment/manage.py deploy --directory .
```

restore 校验备份哈希，并拒绝其它服务仍运行的环境；它替换备份涉及的表和文件；CUSTOM_DIR 精确恢复到备份内容，移除备份中不存在的额外文件。不自动替换镜像、内置资源或密钥。覆盖已有数据前另做备份。跨数据库版本或不兼容 schema 回退，必须同时恢复配套备份。

从现有 systemd 环境迁移需单独安排停服，导出三个库、storage、battle_conf.txt 并保留 APP_KEY，再导入新的宿主机数据目录。工具不会自动搬迁旧主机存档。

## 验收与当前边界

首次发布仍需验证 AMD64/ARM64 镜像构建、空库初始化、已有库升级、登录选角、地图和音效、后台会话、图鉴、冒险工具、运营设置重启持久化、故障重启及备份恢复。健康检查只表明服务启动，不代替游戏验收；offline-ready 表示归档组装校验完成，不表示已通过运行验收。

每次升级后强制刷新游戏与后台，核对游戏 build-info.json，检查启动页、资源、聊天、导航和冒险工具。验证独立停止及恢复后台时游戏仍运行。默认关闭雾效无需额外配置；已有浏览器偏好仍保留，可用 /fog 切换。

当前方案仅准备工具与定义；未在本次修改中构建镜像或完成 Docker 运行验收。


## 服务端与资源自定义

推荐将 DATA_DIR 与 CUSTOM_DIR 放在版本目录外。发行包只带 examples/custom 模板；首次 initialize 创建默认 custom/。若编辑 .env 将 CUSTOM_DIR 改到其它路径，必须执行 initialize-custom 为该位置初始化。这个命令可重复执行，只补缺少的模板，不覆盖已有文件。资源不复制原始 GRF，自定义目录初始为空。

| 宿主机 | 容器 | 使用方 |
|---|---|---|
| CUSTOM_DIR/npc | /opt/happyro/custom/npc | Server，只读 |
| CUSTOM_DIR/db | /opt/rathena/db/import | Server，只读 |
| CUSTOM_DIR/resources | /opt/happyro/custom/resources | Gateway，只读 |
| CUSTOM_DIR | /opt/happyro/custom | Admin 目录刷新任务，只读 |

内置 npc、db、conf 仍由镜像提供。后台战斗设置仍存放 DATA_DIR/server-settings，不增加第二份配置来源。容器只读不妨碍在宿主机编辑。

### 新增及覆盖 NPC

新增 `custom/npc/additions/example.txt`，然后在 `custom/npc/scripts.conf` 中登记：

```text
npc: additions/example.txt
// 子清单同样以 custom/npc 为根，不以清单所在目录为根：
// import: additions/events.conf
```

只加载显式登记的 additions/*.txt，清单支持 import additions/*.conf，拒绝循环、父目录路径和符号链接。内置文件 `npc/custom/healer.txt` 对应覆盖文件 `custom/npc/overrides/custom/healer.txt`。覆盖保留原加载顺序、原逻辑文件名，启动、@reloadscript、@loadnpc 均使用同一读取规则；@unloadnpc 仍使用原内置路径。自定义新增脚本手动加载时使用容器内完整路径。仅 .txt 支持覆盖，内置 .conf 清单不支持覆盖。注释文件可停用该文件内所有定义。移除覆盖并重载即可恢复当前镜像的内置文件。

不会将覆盖文件再额外加载一遍，不自动加载已被新版取消引用的旧覆盖。目录刷新会提示未使用覆盖文件。加载错误写入 map-server 日志，不静默退回内置脚本；重载中断对话并重新初始化脚本，不是事务发布，不保证失败时保持先前 NPC 状态。

### 数据库扩展

custom/db 初始化为与当前服务端版本对应的 import-tmpl 文件。常见入口为 item_db.yml 和 mob_db.yml，可用 Footer.Imports 拆分文件，引用写作 `db/import/文件.yml`。遵循各数据库原生合并规则，不能把所有字段都视为整记录替换。物品脚本直接编辑 Script、EquipScript、UnEquipScript。

NPC 和数据库保存后仍需按类型执行 GM 重载命令，或维护时重启相关服务。无保存后自动重载；大批量修改应在停服后应用。

### 自定义资源与缓存

custom/resources 的路径相对于客户端 data/，例如 `custom/resources/texture/유저인터페이스/item/example.bmp`。不要再嵌套一层 data/。Gateway 先读用户文件，再读取内置本地文件、资源目录和 GRF；自定义文件不进入进程 LRU，配置了自定义目录的 data/ 请求使用 no-store，避免替换或删除资源后命中旧响应。已有浏览器旧缓存可能仍需强制刷新；游戏内已解码的资源需要重新进入游戏。

只支持当前客户端可读取的资源格式与相对路径，不提供任意 PNG 到 SPR/ACT 的转换。新增外观还需要相应客户端映射；新增物品的客户端名称、说明也不能仅靠服务端 YAML 完成。资源目录不提供网页代码覆盖，不自动生成后台缩略图。

### 刷新冒险工具和后台资料

```bash
python3 tools/deployment/manage.py refresh-custom-catalogs --directory .
```

需要数据库已运行且已有 Admin schema；此命令使用已导入的当前镜像、不构建镜像、不重载游戏脚本。先根据内置目录快照和实际加载清单生成 NPC、物品、魔物声明资料，全部解析成功后调用原有三条导入命令。升级的 admin-init 自动执行相同流程。快照仅用于导入，不生成或替换服务端 runtime 目录。删除覆盖或自定义条目后再次刷新，会从内置基线重建，避免残留旧的用户条目。

刷新覆盖 item_db.yml、mob_db.yml 及其 Renewal 导入、静态 NPC 定义；不执行脚本，不推断动态创建 NPC、运行时奖励或战斗倍率修正，不渲染新外观的缩略图。其它数据库仍由服务端正常加载，但不属于这三类目录资料。修改坐标的新 NPC 支持按坐标寻路；没有匹配官方导航 ID 的 NPC 不伪造 ID 开启 NPC 导航传送。原有外观可复用已发布图片，新外观需要另行准备预览资源。

### 升级与另一台机器验收

未覆盖内容自动随镜像更新；用户覆盖始终优先，不要求文本合并，也不会自动获得该文件的新修复。脚本指令、数据库结构变化仍可能需要手动适配。回退文件不会撤销脚本已经发出的奖励或更改过的任务状态。

在另一台机器按 docker-release.md 全量构建后，至少验收：空目录部署；旧存档首次引入 custom；修改原 NPC、移除覆盖恢复内置；新增脚本及重载；物品和魔物扩展及目录刷新；资源替换和删除恢复；保留用户文件升级；完整备份恢复。源码级测试不替代这组容器和游戏验收。
