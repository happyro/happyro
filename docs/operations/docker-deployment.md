# HappyRO 无源码 Docker 部署

本手册面向拿到发布包的部署者，也作为部署包的 README。部署端只取得镜像、部署包及运行资源，不下载 Git 源码，不在目标机器编译。使用的版本以发布包的 `release-manifest.json` 为准。

## 交付与目录

发布目录结构如下（开发仓库中的定义位于 `deploy/docker/`，所有维护工具位于 `tools/deployment/`）：

```text
happyro-deploy/
├── compose.yaml
├── .env.example
├── .env                         # 本机生成，保密
├── release-manifest.json         # 源码提交、镜像 digest、资源清单哈希
├── README.md
├── data/                        # 所有宿主机持久化与运行目录
│   ├── database/                # MariaDB 数据
│   ├── admin-storage/           # Laravel storage
│   ├── server-settings/         # 运营配置
│   ├── server-logs/             # 游戏日志
│   ├── gateway-logs/            # Gateway 日志
│   └── control-socket/          # map 控制 socket（不备份）
├── tools/deployment/manage.py
└── resources/
    ├── manifest.json
    ├── kro-20211105/             # DATA.INI、引用的 GRF、AI、BGM、System、散装 data
    └── catalog/
        ├── items/               # icons/、illustrations/
        ├── monsters/
        ├── npcs/
        ├── maps/
        └── terrain/             # 无地图图片时的地形预览
```

资源只读挂载，所有可写数据和运行状态都使用部署包内 `data/` 下的宿主机目录挂载，不使用 Docker named volume。不能把整个 `work/`、官方素材、Windows EXE/DLL 或开发环境密钥装进资源包。中文覆盖文件在 Gateway 镜像 `/opt/overrides`，基础运行资源在宿主机 `resources/kro-20211105`；Gateway 优先使用已打包的覆盖目录。运行目录内已经编译、核验的 System 文件保留在资源包，不能从历史翻译工作区发布。

PWA 专用 NPC atlas 随 Gateway 镜像发布，后台图片在外部资源目录。镜像和资源须使用同一发布包配套的清单；不要自行替换资源文件或修改 manifest 绕过校验。

## 镜像与服务

| 镜像 | 服务 | 内容 |
| --- | --- | --- |
| happyro-gateway | gateway | 全量 `--all` PWA、Gateway、中文覆盖文件 |
| happyro-server | login、char、map、web-api | PACKETVER=20211103、Renewal，二进制、NPC、db、配置模板 |
| happyro-admin | admin、admin-init | 前端产物、Laravel、PHP 8.4 FPM、Nginx、生产依赖 |
| happyro-database | database | MariaDB 10.11、游戏初始化 SQL、后台数据库授权 |

正常运行七个服务容器和一个完成后退出的初始化任务。当前后台命令同步执行，没有使用中的业务队列任务或定时调度，暂不添加空转 worker/scheduler。以后实际引入任务再使用 Admin 同镜像独立运行。

Admin 以 Supervisor 运行 Nginx 与 PHP-FPM，任何服务进程退出将终止容器并由 Compose 重启。后台默认映射宿主机 8000 到容器 8080，FPM 不公开。游戏默认映射宿主机 3338 到容器 3338；其余端口在 Docker 网络内。浏览器使用 Gateway `/ws/`，游戏内 `/api/adventure-tools` 转发 Admin，Admin 经 web-api 访问 map 的控制 socket。

map 和 web-api 共享 `data/control-socket` 目录。Admin 与 Server 共享 `data/server-settings` 目录，后台可原子更新 `battle_conf.txt`，map 通过 import 加载；此目录必须备份，不能用单文件挂载替代。首次初始化采用仓库默认游戏配置，不把开发机倍率、GM 测试账号、密码和当前存档烘焙入镜像。

## 新机器首次启动

安装 Docker Engine、Compose v2、Python 3.11+，下载部署包和资源包。无需安装 Node、PHP、Git 或编译器。

以下命令均在解压后的 happyro-deploy/ 目录执行。确认 release-manifest.json 的状态为 published，四个镜像已有 digest；prepared-not-built 仅为准备包，不能用于正式部署。verify 只校验资源，不代替镜像发布状态检查。保留 data/ 下的空目录；自定义 DATA_DIR 时须事先创建对应目录。

```bash
python3 tools/deployment/manage.py verify --directory .
python3 tools/deployment/manage.py initialize --directory .
```

编辑 `.env` 的 GAME_PUBLIC_URL、ADMIN_PUBLIC_URL、ADMIN_STATEFUL_DOMAINS（后台主机名和端口，不含协议），确认端口与资源目录。使用 HTTPS 时设置 SESSION_SECURE_COOKIE=true，并确保反向代理正确传递协议；本模板默认局域网 HTTP，与当前部署方式一致。生成的密钥为随机值，禁止使用示例密码；不要在升级时重新生成 APP_KEY。

```bash
docker compose pull
docker compose up -d
docker compose ps -a
docker compose exec admin happyro-admin artisan gm:user:create administrator
```

最后一条交互式输入后台密码，默认 super_admin，不在命令行传密码。初始化不会创建演示用户。资源哈希验证在启动前执行；Compose 同时拒绝自动创建不存在的资源挂载路径。

administrator 是示例用户名，可替换为 admin。游戏资料版本固定在后台配置中：客户端 kro-20211105、服务端 2fe6ab3dc4d8，不通过后台页面修改；这与四类镜像统一使用的应用发布版本不同。

默认使用 `docker compose up -d` 启动全部服务，不设置 profile 或额外功能开关。启动依赖分为两条链：

- 游戏：database 健康 → login → char → map → web-api → gateway。
- 后台：database 健康 → admin-init 完成后台迁移及图鉴导入；Admin 等待 admin-init 成功及 web-api 健康后启动。

游戏服务不等待 admin-init 或 Admin 健康状态。后台初始化失败、维护或停机时，游戏服务的依赖链仍独立成立；Compose 的整栈命令可能报告后台失败，应通过 `docker compose ps -a` 检查各服务，必要时运行 `docker compose up -d gateway` 单独启动游戏链。依赖后台 API 的冒险工具操作此时不可用，登录、战斗和游戏内 NPC 不依赖后台。

后台可独立维护：`docker compose stop admin`；恢复使用 `docker compose up -d admin`。共享数据库仍须保持运行。Server 的 TCP 健康检查说明监听端口就绪，不能代替登录/战斗验收；Admin `/up` 检查 PHP 应用启动，Gateway 检查 HTTP 服务。

冒险工具按后台返回的可用能力显示标签；后台不可用时，依赖其能力的标签不会显示。恢复后台后重新打开冒险工具检查功能。

## 持久化、备份与恢复

升级先停写备份，更新 `.env` 中四个镜像 digest，确认配套资源校验通过；执行 `docker compose pull` 后，以 `docker compose run --rm --no-deps admin-init` 运行本版迁移和快照导入，成功后才 `docker compose up -d`。初始化 SQL 只在空 MariaDB 数据目录执行，不能用于已有存档升级。Server 的 SQL schema 变化需先审查本版升级 SQL，并在停写后显式执行；本工具不盲目运行全部历史升级脚本。

`data/database` 保存 happyro、happyro_log、happyro_admin 三个数据库；`data/admin-storage` 保存 Laravel 可写文件；`data/server-settings` 保存运营修改；日志目录保存在 `data/server-logs` 和 `data/gateway-logs`。备份不需要 `data/control-socket` 和应用缓存。删除容器不会删除这些宿主机目录；升级不得删除 `data/`。

备份前进入维护状态并停止所有写入；数据库含非事务表，不能仅依赖 single-transaction 在有写入时取得一致备份：

```bash
docker compose stop gateway admin web-api map char login
python3 tools/deployment/manage.py backup --directory . --output ../backups/2026-09-13
docker compose up -d
```

备份含数据库 SQL、Admin storage、游戏设置、部署清单和 `.env`，默认私有目录，需复制到异机。资源包另行保存。导出失败时保留部分目录用于排查，未生成 checksums.json 的备份不可恢复。

恢复先选择匹配版本的部署包和空环境，复制备份 `.env`（尤其 APP_KEY）并核对地址；只启动 database：

```bash
docker compose up -d database
python3 tools/deployment/manage.py restore --directory . --backup ../backups/2026-09-13 --confirm-replace
docker compose up -d
```

restore 会验证备份哈希并拒绝其他服务仍运行的环境。它替换备份涉及的数据库表和文件，不自动改密钥、资源或镜像标签，不删除备份外文件。优先恢复到新的宿主机数据目录；覆盖已有数据目录前另做备份。跨数据库版本/不兼容 schema 的回退必须恢复配套备份，不能只回退镜像。

现有 systemd 环境迁移：安排停服窗口 → 停止 Gateway、Admin 和全部游戏写入进程 → 导出上述三个库与后台 storage、battle_conf.txt → 在 Compose 挂载的全新宿主机数据目录中导入并保留 APP_KEY → 验收成功后切入口。禁止旧服务和容器同时连接同一存档库。不会自动搬迁当前机器数据。

## 验收门槛与本次交付边界

本轮只准备定义、工具和文档，可校验 Compose 解析、脚本语法、资源哈希，不构建镜像、不启动或迁移服务。

首次实际发布必须验证 AMD64/ARM64 四类镜像均构建成功、空库初始化、已有库升级、登录选角、地图/音效资源、后台会话、图鉴、冒险工具控制接口、运营设置重启后保留、容器故障重启、备份及恢复。未通过这些验证前，不能宣称该方案已经完成运行验收。

每次部署或升级后，强制刷新游戏和后台页面，核对游戏 build-info.json 的构建信息。游戏入口 /applications/pwa/index.html 应显示启动页，再进入游戏检查资源、聊天、导航和冒险工具。后台检查登录、地图/物品/魔物详情及游戏设置；独立停止和恢复 Admin 后检查游戏仍可运行及相关功能恢复。最近的界面调整与默认关闭雾效无需新增部署配置；浏览器已保存的雾效偏好仍优先，可使用 /fog 手动切换。
