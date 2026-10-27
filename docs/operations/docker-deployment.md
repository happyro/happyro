# HappyRO 离线部署

每次部署准备独立的空数据库和新数据目录；数据库结构由当次镜像和初始化工具创建。备份仅用于同一完整包的运行环境恢复，不用于跨版本迁移。

本手册随 `.zip` 离线包作为 README.md 交付。目标机器无需 Git 源码、Node、Skopeo 或镜像仓库连接。需要已安装的 Docker Engine/Compose v2（macOS 使用 Docker Desktop）与 Python 3.11+。

本手册使用包内配套的 `initialize-custom`、`refresh-custom-catalogs` 与五镜像部署配置。下载链接、文件大小和 SHA-256 见[资源下载](https://happyro.kugarocks.com/guide/downloads)，具体功能见 [v0.6.0 版本说明](https://happyro.kugarocks.com/changelog/releases/v0.6.0)。

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
│   ├── amd64/                 # gateway/server/api/admin/database.tar
│   └── arm64/                 # gateway/server/api/admin/database.tar
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
    ├── server-settings/
    ├── server-logs/
    ├── gateway-logs/
    └── control-socket/
```

首次初始化在本机生成保密的 .env。所有持久化使用宿主机目录 bind mount，不使用 named volume；resources/ 只读。data/control-socket 是运行状态，无需备份。日常维护不得删除 data/ 或 HAPPYRO_CUSTOM_DIR。custom/ 由用户维护，不参与发行文件哈希校验，正式 ZIP 禁止包含这个实际运行目录。

在 Mac 上将整个包放在 Docker Desktop 允许文件共享的本地目录。镜像归档导入后还会占用 Docker 虚拟磁盘空间，需同时容纳包、解压资源、导入镜像及数据库。不要直接把远程主机路径写作本机挂载路径；先复制完整包到本地。

Gateway 日志权限：v0.5.0 镜像会以 root 初始化 `data/gateway-logs` 及已有日志的属主和所有者读写权限，再降权为 node（UID/GID 1000）运行应用；不要求宿主机用户 UID 与容器一致。该目录必须允许写入和修改权限，不能只读挂载；初始化失败会打印目录及原因并停止启动。仅处理日志目录，不跟随其中的符号链接修改外部文件，不修改游戏资源或其他持久化目录。

## 首次部署

所有命令在解压后的包根目录执行。不运行 docker compose pull；Compose 已禁止拉取，镜像必须从包中导入。

```bash
python3 tools/deployment/manage.py verify --directory .
```

```bash
python3 tools/deployment/manage.py import-images --directory .
```

```bash
python3 tools/deployment/manage.py initialize --directory .
```

verify 要求 offline-ready 状态，检查配置、资源和两种架构的镜像归档。缺失镜像的 prepared-not-built 准备包会被拒绝。import-images 根据 Docker daemon 的 Linux 架构导入对应五个镜像，并核对镜像 ID；Apple Silicon 通常为 arm64，Intel 为 amd64。它不会启动容器。

编辑 .env：

- HAPPYRO_GAME_PUBLIC_URL：默认 `http://127.0.0.1:3338`，局域网访问时改为主机 IP。
- HAPPYRO_ADMIN_CSRF_ORIGIN_CHECK_ENABLED：默认 `false`，关闭来源校验但保留 CSRF Token 校验；设为 `true` 时仅信任 HAPPYRO_ADMIN_PUBLIC_URL 对应来源。
- HAPPYRO_ADMIN_PUBLIC_URL：默认 `http://127.0.0.1:8000`，局域网访问时改为主机 IP。
- HAPPYRO_CLIENT_SOCKET_PROXY_URL：默认留空并使用当前页面同源的 `/ws/`；WebSocket 使用独立域名时填写完整前缀，例如 `wss://happyro-ws.example.com/ws/`。
- HAPPYRO_GATEWAY_PUBLISH_ADDRESS、HAPPYRO_ADMIN_PUBLISH_ADDRESS：默认 3338、8000，在宿主机所有接口发布端口。支持 `宿主机地址:端口`；仅本机访问时，在 `.env` 设置 `HAPPYRO_GATEWAY_PUBLISH_ADDRESS=127.0.0.1:3338`、`HAPPYRO_ADMIN_PUBLISH_ADDRESS=127.0.0.1:8000`，然后重新创建对应容器。公开 URL 不限制监听范围；修改端口时同步 URL。不要直接修改受哈希校验的 `compose.yaml`。
- HAPPYRO_RESOURCE_DIR、HAPPYRO_DATA_DIR：默认 ./resources、./data。自定义时先复制资源、创建 data/ 中所有子目录，挂载不自动创建缺失路径。
- HAPPYRO_CUSTOM_DIR：默认 ./custom，建议改为版本目录外的专用绝对路径，例如 `/srv/happyro/custom`；修改后运行 `python3 tools/deployment/manage.py initialize-custom --directory .`。只填宿主机路径，不填容器内 `/opt/happyro/custom`。
- 本模板默认局域网 HTTP。Admin 后台使用 HTTPS 时设置 HAPPYRO_ADMIN_SESSION_SECURE_COOKIE_ENABLED=true，并确保反向代理传递原始协议。

游戏的“保持登录”在 HTTP 与 HTTPS 均可使用，不由 `HAPPYRO_ADMIN_SESSION_SECURE_COOKIE_ENABLED` 控制。该变量仅用于 Admin 后台；游戏由 Gateway 根据请求 Origin 的协议选择 Cookie，HTTPS 设置 Secure，HTTP 使用独立名称且不设置 Secure。HTTP 与 HTTPS、不同主机入口需要分别首次登录。

反向代理须将 `/api/game-session/*` 原路径转发到 Gateway，保留浏览器的 Host（包括非默认端口）、Origin、Cookie 和 Set-Cookie，不缓存该接口响应；Gateway 会返回 `Cache-Control: no-store`。Nginx 可用 `proxy_set_header Host $http_host;` 保留 Host，并传递原始协议供后台使用。仅设置 X-Forwarded-Host、把 Host 改成内部容器名，会使游戏会话接口因 Origin/Host 不匹配返回 403。独立 WebSocket 域名只影响 `/ws/`，游戏会话 API 仍走页面同源入口。

默认 `127.0.0.1` 仅适用于部署机器本机浏览器，其他设备访问应填写部署机器的局域网地址。initialize 生成随机密钥；保留生成的数据库密码和控制令牌，已有 .env 不会被覆盖。镜像变量必须保持该包 .env.example 中的值。

```bash
python3 tools/deployment/manage.py deploy --directory .
```

```bash
docker compose ps -a
```

部署初始化会幂等创建后台 `admin/admin` 超级管理员和游戏 `happyro/happyro` GM 账号；重复运行不会新增重复账号。deploy 校验整个包、Compose 镜像配置和已导入镜像后，先等待数据库健康，执行登录会话 SQL，再启动整栈；SQL 失败停止后续启动。它不构建、不拉取、不覆盖 .env，全新安装要求见下文“全新环境安装”。首次后台初始化可能耗时，使用 docker compose logs api-init 查看迁移、默认账号和图鉴导入。

v0.5.0 首次空库初始化还会为 `happyro` 创建第一角色位“罗安”（男剑士 Base 99 / Job 50、10,000 Zeny），配置技能、普通剑、各 100 瓶红／蓝药水、收回的波利蛋与前六个快捷栏。完整属性见[默认角色配置](https://happyro.kugarocks.com/deploy/docker)。已有数据库不补建、不覆盖角色。

当前初始化脚本另创建普通玩家账号 `happyro2/happyro2`，第一角色「玛雅」为女性铁匠 Base 99 / Job 50，位于罗安附近；基本技能 Lv.9，配置合法商人／铁匠技能、已装备斧、药水、手推车测试商品及六格快捷栏。手推车通过正常游戏入口租用。该配置随 Database 镜像构建进入下一次完整离线包，不回写已发布 ZIP，也不更新现有数据库。

api-init 依次执行 Go 管理库迁移（`migrate`）、初始账号创建（`init`）、自定义资料刷新及四份目录的原子导入（`catalog import`）。任一步骤失败即停止，不启动 API 服务。

游戏入口：HAPPYRO_GAME_PUBLIC_URL/applications/pwa/index.html，应先显示启动页。后台入口为 HAPPYRO_ADMIN_PUBLIC_URL。

## 服务与后台维护

正常运行八个服务容器和一个完成后退出的 api-init：

Compose 已为服务设置固定容器名（如 `happyro-api`、`happyro-gateway`、`happyro-map`），不会再追加默认的 `-1` 序号。固定容器名意味着同一台主机不能同时运行两个相同部署包实例；如需并行实例，应修改 Compose 中的容器名前缀。

| 镜像 | 服务 |
| --- | --- |
| Gateway（含全量 PWA 和中文覆盖） | gateway |
| Server（PACKETVER=20211103、Renewal） | login、char、map、web-api |
| API（Go 接口与初始化） | api、api-init |
| Admin（Nginx 后台前端与同源代理） | admin |
| Database（MariaDB 10.11） | database |

后台默认宿主机 8000 → Admin 容器 8080；游戏 3338 → 3338，其余端口只在 Docker 网络内。后台资料版本固定在配置中（kro-20211105、2fe6ab3dc4d8），不是应用发布版本，不在页面修改。

Admin 容器以非 root Nginx 提供后台页面及同源 `/api` 代理，根文件系统只读，临时文件位于 `/tmp`，健康检查使用 `/healthz`。API 容器仅运行 Go 接口与初始化，进程以 www-data 身份运行，健康检查使用 `/api/health`；API 不映射宿主机端口。Gateway 继续转发冒险工具响应，Admin 与游戏入口独立。

游戏依赖链是 database → login → char → map → web-api → gateway。API 等待数据库、api-init 完成和 web-api 健康，Admin 等待 API 健康。游戏不等待 API；后台停机时，依赖后台能力的冒险工具标签不可用或不显示，登录、战斗和 NPC 不依赖后台。

```bash
docker compose stop api
```

```bash
docker compose up -d --pull never api
```

后台初始化失败时，整栈启动可能报错；检查 ps -a 和 logs，只有确认本轮 deploy 已成功执行会话 SQL 后，才可单独启动游戏链：docker compose up -d --pull never --no-build gateway；会话 SQL 失败时先修复并重新运行 deploy。停止 Admin 不要停止共享数据库。API 和 Server 共享 data/server-settings，battle_conf.txt 的运营变更须备份；不能改成单文件挂载。

Docker 为 Admin 与 API 建立专用 `admin-proxy` 网络；`HAPPYRO_ADMIN_PROXY_SUBNET` 默认 `172.30.81.0/29`，`HAPPYRO_ADMIN_PROXY_DYNAMIC_RANGE` 默认 `172.30.81.4/30`，`HAPPYRO_ADMIN_PROXY_IP` 默认 `172.30.81.2`。动态地址池用于 API 等临时端点，不包含 Admin 固定地址，避免 API 先启动时占用该地址。API 的 `HAPPYRO_API_TRUSTED_PROXIES` 只信任该 Admin 地址，Nginx 覆盖客户端传入的转发头，使登录限流、登录记录和操作审计使用代理收到的来源 IP。若与宿主机路由或已有 Docker 网段冲突，须同时调整子网、子网内的动态地址池和池外可用的 Admin 固定地址，并重新创建网络和容器。外层反向代理的真实 IP 信任链须另行配置，默认不会信任外部传入的转发头。

## 全新环境安装

每次发布均使用独立的新目录、空数据库和新配置，按本手册首次初始化与部署步骤安装。不复用旧 `.env`、旧数据库、旧存档或旧 custom 目录，不提供兼容升级及历史数据迁移。

同一完整包内的日常重启、设置持久化和备份恢复属于运行维护。安装另一批次完整包时重新建立环境；操作前核对端口和 Compose 项目名，避免影响仍在运行的环境。

## 备份与恢复

先确认 api-init 已完成，再停止游戏及后台写入，并暂停宿主机 custom 文件编辑，仅保留 database 运行。数据库含非事务表，不能在有写入时仅凭 single-transaction 获得一致备份。

```bash
docker compose stop gateway admin api web-api map char login
```

```bash
python3 tools/deployment/manage.py backup --directory . --output ../backups/before-upgrade
```

普通备份完成后可运行 deploy 恢复服务；执行恢复时保持停写。备份包含三个数据库（happyro、happyro_log、happyro_admin）、server-settings、整个 HAPPYRO_CUSTOM_DIR（脚本、数据库扩展、资源）、.env 和部署清单。备份含密钥，应复制到异机；无 checksums.json 的部分备份不可恢复。备份输出目录必须不存在，示例路径用过后须换新目录。完整离线包另行保存，备份不会重复复制镜像和资源。

恢复优先使用匹配版本的完整包及新的宿主机数据目录。复制备份 .env、核对 HAPPYRO_DATA_DIR、HAPPYRO_CUSTOM_DIR、资源路径和地址，保留原数据库密码和控制令牌，不重新 initialize。`initialize-custom` 只准备 `HAPPYRO_CUSTOM_DIR`，不会创建 `HAPPYRO_DATA_DIR`。若使用新建的外部数据目录，先在 `.env` 设置其实际路径，再创建全部五个数据子目录；Compose 的 bind mount 不会自动创建缺失路径。

以下示例中的 `/srv/happyro/restore-data` 必须替换为 `.env` 中 `HAPPYRO_DATA_DIR` 指定的同一目录。使用全新解压包自带的 `./data` 时，这五个空子目录已包含在包中。

```bash
restore_data_dir=/srv/happyro/restore-data
```

```bash
mkdir -p "${restore_data_dir}/database" "${restore_data_dir}/control-socket"  "${restore_data_dir}/server-settings" "${restore_data_dir}/server-logs"  "${restore_data_dir}/gateway-logs"
```

目录准备完成后，初始化自定义目录、导入镜像并恢复：

```bash
python3 tools/deployment/manage.py initialize-custom --directory .
```

```bash
python3 tools/deployment/manage.py import-images --directory .
```

```bash
docker compose up -d --wait --pull never --no-build database
```

```bash
python3 tools/deployment/manage.py restore --directory . --backup ../backups/before-upgrade --confirm-replace
```

```bash
python3 tools/deployment/manage.py deploy --directory .
```

restore 校验备份哈希，并拒绝其它服务仍运行的环境；它替换备份涉及的表和文件；HAPPYRO_CUSTOM_DIR 精确恢复到备份内容，移除备份中不存在的额外文件。不自动替换镜像、内置资源或密钥。覆盖已有数据前另做备份。只使用同一完整包及其配套备份恢复，不跨版本导入。


## 验收与当前边界

首次发布仍需验证 AMD64/ARM64 镜像构建、空库初始化、登录选角、地图和音效、后台会话、图鉴、冒险工具、运营设置重启持久化、故障重启及备份恢复。健康检查只表明服务启动，不代替游戏验收；offline-ready 表示归档组装校验完成，不表示已通过运行验收。

每次安装后强制刷新游戏与后台，核对游戏 build-info.json，检查启动页、资源、聊天、导航和冒险工具。验证独立停止及恢复后台时游戏仍运行。默认关闭雾效无需额外配置；已有浏览器偏好仍保留，可用 /fog 切换。

每次发布均记录最终包的实际运行架构、空库安装、三端交互及未验证范围。amd64 仿真运行与原生 x86 主机分别记录，源码联调和旧包同版本重部署不能替代本次验收。历史结果见对应版本摘要。

保持登录验收应分别覆盖 HTTP/HTTPS、手机/平板/桌面：勾选后重新打开进入选角；不勾选时刷新需要重新登录；页面内断线恢复原角色及同地图镜头；主动退出、修改密码、封禁与到期使会话失效。检查全新数据库具备会话表及撤销触发器，在隔离环境验证 SQL 失败时不会继续启动新服务。另用 iOS/Android 真机分别验证后台冻结和页面回收；页面回收后按重新打开处理，不能承诺直接恢复原游戏画面。

## 服务端与资源自定义

推荐将 HAPPYRO_DATA_DIR 与 HAPPYRO_CUSTOM_DIR 放在版本目录外。发行包只带 examples/custom 模板；首次 initialize 创建默认 custom/。若编辑 .env 将 HAPPYRO_CUSTOM_DIR 改到其它路径，必须执行 initialize-custom 为该位置初始化。这个命令可重复执行，只补缺少的模板，不覆盖已有文件。资源不复制原始 GRF，自定义目录初始为空。

| 宿主机 | 容器 | 使用方 |
|---|---|---|
| HAPPYRO_CUSTOM_DIR/npc | /opt/happyro/custom/npc | Server，只读 |
| HAPPYRO_CUSTOM_DIR/db | /opt/rathena/db/import | Server，只读 |
| HAPPYRO_CUSTOM_DIR/resources | /opt/happyro/custom/resources | Gateway，只读 |
| HAPPYRO_CUSTOM_DIR | /opt/happyro/custom | API 目录刷新任务，只读 |

内置 npc、db、conf 仍由镜像提供。后台战斗设置仍存放 HAPPYRO_DATA_DIR/server-settings，不增加第二份配置来源。容器只读不妨碍在宿主机编辑。

### 新增及覆盖 NPC

已部署配套镜像、工具和挂载配置后，修改 `HAPPYRO_CUSTOM_DIR/npc` 中的脚本不需要重新构建镜像或离线包。使用现有脚本指令、数据库内容和客户端资源即可新增对话、商店、兑换、治疗、仓库等 NPC；如果需要新增服务端脚本指令或修改引擎代码，则需要更新 Server 镜像，正式版本仍按完整发布流程构建。

操作顺序：在宿主机编辑脚本 → 新增脚本登记清单 → 执行 `@reloadscript` 或维护时重启 map → 在游戏中验证。需要后台或冒险工具同步名称、坐标等资料时，再执行 `refresh-custom-catalogs`；目录刷新不能代替游戏重载。保存文件本身不会自动重载。

以下 `custom/` 指 `.env` 的实际 HAPPYRO_CUSTOM_DIR。例如在 `npc/additions/review.txt` 写入测试脚本（声明行各字段之间必须使用 Tab）：

```text
prontera,150,176,4	script	ReviewCustom	100,{
    mes "自定义 NPC 已生效。";
    close;
}
```

该地图、坐标及外观在隔离测试环境验证可用；正式使用前确认位置没有冲突、精灵未被场景遮挡且能够点击，NPC 名称不得与其他脚本重复。

在 `custom/npc/scripts.conf` 中登记上述文件：

```text
npc: additions/review.txt
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

需要数据库已运行且已完成 Go 管理库迁移；此命令使用已导入的当前镜像、不构建镜像、不重载游戏脚本。先根据内置目录快照和实际加载清单生成 NPC、物品、魔物声明资料，全部解析成功后通过 `catalog import` 原子导入四份目录（客户端物品、服务端物品、魔物、NPC）。首次安装的 api-init 自动执行相同流程。快照仅用于导入，不生成或替换服务端 runtime 目录。删除覆盖或自定义条目后再次刷新，会从内置基线重建，避免残留旧的用户条目。

刷新覆盖 item_db.yml、mob_db.yml 及其 Renewal 导入、静态 NPC 定义；不执行脚本，不推断动态创建 NPC、运行时奖励或战斗倍率修正，不渲染新外观的缩略图。其它数据库仍由服务端正常加载，但不属于这三类目录资料。修改坐标的新 NPC 支持按坐标寻路；没有匹配官方导航 ID 的 NPC 不伪造 ID 开启 NPC 导航传送。原有外观可复用已发布图片，新外观需要另行准备预览资源。

### 自定义与另一台机器验收

当次完整包的内置内容作为基线，用户覆盖优先。自定义脚本和数据库扩展须使用当次程序支持的语法与结构。回退文件不会撤销脚本已经发出的奖励或更改过的任务状态。

在另一台机器按 docker-release.md 全量构建后，至少验收：空目录部署；新环境初始化 custom；修改原 NPC、移除覆盖恢复内置；新增脚本及重载；物品和魔物扩展及目录刷新；资源替换和删除恢复；同一完整包重启持久化；完整备份恢复。源码级测试不替代这组容器和游戏验收。

### 修改后的生效顺序与撤销

| 修改内容 | 游戏侧生效 | 后台/冒险工具资料 |
| --- | --- | --- |
| NPC additions / overrides | GM `@reloadscript` 或维护重启 map | `refresh-custom-catalogs` |
| item_db / mob_db | 相应原生数据库重载或维护重启 map | `refresh-custom-catalogs` |
| resources | 后续 HTTP 请求读取新文件；游戏内已解码图片需重新进入游戏 | 不自动生成缩略图或外观映射 |
| 后台战斗设置 | 通过后台保存与现有应用流程 | 唯一持久来源为 HAPPYRO_DATA_DIR/server-settings |

重启 map 的命令是 `docker compose restart map`，会中断地图连接，应安排维护时间。`refresh-custom-catalogs` 不重载游戏，也不执行 NPC 动态脚本。先确保自定义文件合法，再分别完成游戏重载和目录刷新，最后核对结果。

撤销新增 NPC：删除清单登记；撤销内置 NPC 覆盖：删除对应 overrides 文件；撤销数据库修改：恢复原模板或移除相应 Body/Imports 条目。之后分别重载游戏、刷新目录。删除资源覆盖后恢复内置资源。撤销文件不会自动收回脚本已发放的奖励或恢复已修改的任务状态，需要匹配备份或另外处理游戏数据。

### 常见问题

- NPC 不出现：确认 additions 已登记、子清单路径相对于 custom/npc、地图/坐标合法，并检查 `docker compose logs --tail=100 map`。
- 覆盖无效：确认原脚本当前被加载，路径为去掉开头 npc/ 后的相对路径；内置 `.conf` 不支持覆盖。
- 游戏已更新但后台还是旧值：执行目录刷新；反之后台已更新不代表游戏已重载。
- 资源无效：确认没有额外一层 data/、路径大小写和编码一致、格式受客户端支持；查看 Gateway 日志并重新进入游戏。
- api-init 提示缺少 `server-base/conf/import/script_conf.txt`：确认 API 镜像已包含 Server import 模板快照；使用完整新版包，不手工修改容器补文件。
- `verify` 失败：先检查是否混用了不同包的配置、镜像或工具，不改清单哈希来掩盖损坏。用户只应编辑 `.env`、custom 和持久化数据，不编辑受清单校验的发行文件。

### 登录页初始凭据提示

在部署目录 `.env` 设置 `HAPPYRO_ADMIN_DEFAULT_CREDENTIALS_HINT_ENABLED=true` 后运行 `docker compose up -d --no-deps --force-recreate api`，登录页显示初始账号密码 `admin/admin`。默认关闭，设为 `false` 隐藏。切换无需重新构建镜像；此开关不修改账号密码。

### 初始管理员账号

部署目录 `.env` 中的 `HAPPYRO_ADMIN_INITIAL_USERNAME` 和 `HAPPYRO_ADMIN_INITIAL_PASSWORD` 指定初始管理员，默认均为 `admin`。首次初始化只在管理库没有任何账号时创建超级管理员；已有账号时直接跳过，不覆盖密码、角色或状态。修改变量不会重置已有账号。用户名沿用小写字母、数字、下划线、点及短横线规则，密码为 5–255 个字符。

使用自定义账号或密码时，登录页隐藏默认凭据提示，即使 `HAPPYRO_ADMIN_DEFAULT_CREDENTIALS_HINT_ENABLED=true`；公开配置接口不返回自定义凭据。直接部署使用 `happyro-api init --no-color`。

提示是固定的 `admin/admin` 文案，不读取真实密码。初始化配置仍为默认值但实际密码已经修改时，应设置 `HAPPYRO_ADMIN_DEFAULT_CREDENTIALS_HINT_ENABLED=false` 隐藏提示。
