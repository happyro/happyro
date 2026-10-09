# HappyRO 离线部署

本手册随 `.zip` 离线包作为 README.md 交付。目标机器无需 Git 源码、Node、PHP、Skopeo 或镜像仓库连接。需要已安装的 Docker Engine/Compose v2（macOS 使用 Docker Desktop）与 Python 3.11+。

下文自定义流程适用于包含 `initialize-custom`、`refresh-custom-catalogs` 的 v0.4.0 及后续部署包。旧包不会因新增宿主机目录而自动获得该功能，须先升级配套镜像、工具及 Compose 配置。v0.4.0 已完成本机 arm64 核心验收；双架构构建不代表 amd64 运行、真机交互及真实跨版本升级均已验收。

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
- CUSTOM_DIR：默认 ./custom，建议改为版本目录外的专用绝对路径，例如 `/srv/happyro/custom`；修改后运行 `python3 tools/deployment/manage.py initialize-custom --directory .`。只填宿主机路径，不填容器内 `/opt/happyro/custom`。
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

新增 custom 支持的升级应使用完整新版包，不能沿用旧 Compose/工具而只替换镜像。运行前先完成以下准备：

- 用旧版配套工具停写备份，保留旧完整包及旧 `.env`。新旧包不得同时连接同一份存档。
- 记录 DATA_DIR、CUSTOM_DIR 的实际绝对路径及 custom 文件哈希；旧版无 custom 时使用新的专用目录。
- 新目录复制旧 `.env`，保留 `APP_KEY`、数据库密码、令牌、公开 URL 和 Compose 项目名；按新版 `.env.example` 核对新增变量，仅更新版本与四个镜像引用等明确需要变更的值。
- `DATA_DIR=./data` 等相对路径会随包目录改变，须改成原数据的绝对路径；`RESOURCE_DIR` 指向新包资源。若搬迁数据，需在停写状态复制完整结构，而非只复制数据库目录。
- 固定容器名会冲突。备份完成后在旧包目录执行 `docker compose down`，再启动新版；bind mount 数据会保留。

1. 保留新版完整包并执行 verify；先在旧部署目录停止写入并备份（见下节）。同一存档只能有一套游戏服务运行。
2. 在新版包根目录复制旧 .env，保留 APP_KEY、数据库密码和控制令牌；从新版 .env.example 更新 RELEASE_VERSION 和四个 IMAGE 变量。
3. 将 DATA_DIR 指向旧部署已停止写入的数据目录（建议绝对路径），CUSTOM_DIR 指向旧的自定义目录（同样建议绝对路径），RESOURCE_DIR 使用新版包内资源。不要把新的空 data/ 或 custom/ 当成旧内容。
4. 执行 `python3 tools/deployment/manage.py initialize-custom --directory .`：首次引入自定义功能时建立目录；后续仅补齐新版新增的模板文件，已有文件不覆盖，不合并。旧版本备份需使用旧版本配套工具恢复，不能直接交给新工具。
5. 导入本版镜像，再启动 database；如涉及 Server schema，先按发布说明审查并执行对应 SQL，再显式执行 Admin 迁移和快照导入，成功后启动整栈。

```bash
python3 tools/deployment/manage.py initialize-custom --directory .
python3 tools/deployment/manage.py import-images --directory .
docker compose up -d --pull never database
docker compose run --rm --no-deps --pull never admin-init
python3 tools/deployment/manage.py deploy --directory .
```

原有 Compose 项目名应保持一致。数据库初始化 SQL 只对空目录执行；Server schema 变化需先审查该版本升级 SQL，并在停写后显式执行。工具不盲目执行历史升级脚本。

已有环境不要重新运行 `initialize`，只运行 `initialize-custom` 补齐模板。升级后核对七服务健康、admin-init 退出 0、角色/仓库数据、后台设置及 custom 哈希，再分别检查未覆盖 NPC 随镜像更新、覆盖文件仍优先、删除覆盖后恢复新版内置文件。只重部署同一版本应记录为流程演练。

`admin-init` 每次都会完整重跑迁移和三条导入命令，所以正常升级流程已经覆盖新增的导入步骤。只有跳过 `admin-init`、只对已有数据库单独执行 `migrate` 的场景才需要注意：新迁移建出的表（例如 `game_npcs`）不会自动有数据，必须单独补跑对应的 `artisan game-data:import-*` 命令，否则查询接口会一直返回空结果。

## 备份与恢复

先确认 admin-init 已完成，再停止游戏及后台写入，并暂停宿主机 custom 文件编辑，仅保留 database 运行。数据库含非事务表，不能在有写入时仅凭 single-transaction 获得一致备份。

```bash
docker compose stop gateway admin web-api map char login
python3 tools/deployment/manage.py backup --directory . --output ../backups/before-upgrade
```

普通备份完成后可运行 deploy 恢复服务；准备升级时保持停写。备份包含三个数据库（happyro、happyro_log、happyro_admin）、Admin storage、server-settings、整个 CUSTOM_DIR（脚本、数据库扩展、资源）、.env 和部署清单。备份含密钥，应复制到异机；无 checksums.json 的部分备份不可恢复。备份输出目录必须不存在，示例路径用过后须换新目录。完整离线包另行保存，备份不会重复复制镜像和资源。

恢复优先使用匹配版本的完整包及新的宿主机数据目录。复制备份 .env、核对 DATA_DIR、CUSTOM_DIR、资源路径和地址，保留原 APP_KEY，不重新 initialize。先执行 initialize-custom 建立容器需要的挂载目录，再恢复：

```bash
python3 tools/deployment/manage.py initialize-custom --directory .
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

v0.4.0 已完成全量双架构构建及 Mac arm64 空库部署、游戏登录、后台目录、部分 NPC/数据库/资源定制、备份恢复和同版本重部署验收。amd64 实际运行、真实跨版本升级、真机操作及完整负向边界仍待验证，不能据此宣称全部验收通过。


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

以下 `custom/` 指 `.env` 的实际 CUSTOM_DIR。例如在 `npc/additions/review.txt` 写入测试脚本（声明行各字段之间必须使用 Tab）：

```text
prontera,150,180,4	script	ReviewCustom	100,{
    mes "自定义 NPC 已生效。";
    close;
}
```

该地图、坐标及外观在本轮隔离环境验证可用；正式使用前确认位置没有冲突，NPC 名称不得与其他脚本重复。


新增 `custom/npc/additions/example.txt`，然后在 `custom/npc/scripts.conf` 中登记：

```text
npc: additions/example.txt
// 子清单同样以 custom/npc 为根，不以清单所在目录为根：
// import: additions/events.conf
```

只加载显式登记的 additions/*.txt，清单支持 import additions/*.conf，拒绝循环、父目录路径和符号链接。内置文件 `npc/custom/healer.txt` 对应覆盖文件 `custom/npc/overrides/custom/healer.txt`。覆盖保留原加载顺序、原逻辑文件名，启动、@reloadscript、@loadnpc 均使用同一读取规则；@unloadnpcfile 按原内置路径卸载文件内定义，@unloadnpc 则按 NPC 名称卸载。自定义新增脚本手动加载时使用容器内完整路径。仅 .txt 支持覆盖，内置 .conf 清单不支持覆盖。注释文件可停用该文件内所有定义。移除覆盖并重载即可恢复当前镜像的内置文件。

在有权限的游戏账号中执行：

```text
@reloadscript
@unloadnpcfile npc/cities/prontera.txt
@loadnpc npc/cities/prontera.txt
```

后两条演示按原路径卸载、重载整个内置文件，会影响该文件中的全部 NPC；仅在维护或隔离验收环境操作。覆盖测试须选取当前确实启用的脚本，不能假设 `npc/custom/healer.txt` 默认被加载。

不会将覆盖文件再额外加载一遍，不自动加载已被新版取消引用的旧覆盖。目录刷新会提示未使用覆盖文件。加载错误写入 map-server 日志，不静默退回内置脚本；重载中断对话并重新初始化脚本，不是事务发布，不保证失败时保持先前 NPC 状态。

### 数据库扩展

custom/db 初始化为与当前服务端版本对应的 import-tmpl 文件。常见入口为 item_db.yml 和 mob_db.yml，可用 Footer.Imports 拆分文件，引用写作 `db/import/文件.yml`。遵循各数据库原生合并规则，不能把所有字段都视为整记录替换。物品脚本直接编辑 Script、EquipScript、UnEquipScript。

例如保留初始化得到的 `item_db.yml` Header，在已有 Body 中增加或修改已知物品（不要重复写第二个 Body）：

```yaml
Body:
  - Id: 501
    Buy: 42
```

该示例只修改服务端红色药水购买价格。客户端名称、说明和外观不由这段 YAML 改变；Header 版本以当前包模板为准。若需拆分，在主文件 Footer 中引用同一 custom/db 下的子文件：

```yaml
Footer:
  Imports:
    - Path: db/import/review-items.yml
      Mode: Renewal
```

子文件也必须有相应 Header 和 Body。修改魔物时使用 `mob_db.yml` 及当前包 Header；`Script`、`EquipScript`、`UnEquipScript` 和掉落字段仍遵循服务端原生语义，逐项在测试角色上验证。

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


### 修改后的生效顺序与撤销

| 修改内容 | 游戏侧生效 | 后台/冒险工具资料 |
| --- | --- | --- |
| NPC additions / overrides | GM `@reloadscript` 或维护重启 map | `refresh-custom-catalogs` |
| item_db / mob_db | 相应原生数据库重载或维护重启 map | `refresh-custom-catalogs` |
| resources | 后续 HTTP 请求读取新文件；游戏内已解码图片需重新进入游戏 | 不自动生成缩略图或外观映射 |
| 后台战斗设置 | 通过后台保存与现有应用流程 | 唯一持久来源为 DATA_DIR/server-settings |

重启 map 的命令是 `docker compose restart map`，会中断地图连接，应安排维护时间。`refresh-custom-catalogs` 不重载游戏，也不执行 NPC 动态脚本。先确保自定义文件合法，再分别完成游戏重载和目录刷新，最后核对结果。

撤销新增 NPC：删除清单登记；撤销内置 NPC 覆盖：删除对应 overrides 文件；撤销数据库修改：恢复原模板或移除相应 Body/Imports 条目。之后分别重载游戏、刷新目录。删除资源覆盖后恢复内置资源。撤销文件不会自动收回脚本已发放的奖励或恢复已修改的任务状态，需要匹配备份或另外处理游戏数据。

### 常见问题

- NPC 不出现：确认 additions 已登记、子清单路径相对于 custom/npc、地图/坐标合法，并检查 `docker compose logs --tail=100 map`。
- 覆盖无效：确认原脚本当前被加载，路径为去掉开头 npc/ 后的相对路径；内置 `.conf` 不支持覆盖。
- 游戏已更新但后台还是旧值：执行目录刷新；反之后台已更新不代表游戏已重载。
- 资源无效：确认没有额外一层 data/、路径大小写和编码一致、格式受客户端支持；查看 Gateway 日志并重新进入游戏。
- admin-init 提示缺少 `server-base/conf/import/script_conf.txt`：这是 v0.4.0 首轮候选镜像的缺陷，正式验收包已修复；使用完整修复包，不手工修改容器补文件。
- `verify` 失败：先检查是否混用了不同包的配置、镜像或工具，不改清单哈希来掩盖损坏。用户只应编辑 `.env`、custom 和持久化数据，不编辑受清单校验的发行文件。
