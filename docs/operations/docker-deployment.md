# HappyRO 离线部署

本手册随包作为 README.md 交付。目标机器无需 Git 源码、Node、PHP、Skopeo 或镜像仓库连接。需要已安装的 Docker Engine/Compose v2（macOS 使用 Docker Desktop）与 Python 3.11+。

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
├── tools/deployment/
│   ├── manage.py
│   └── offline.py
└── data/
    ├── database/
    ├── admin-storage/
    ├── server-settings/
    ├── server-logs/
    ├── gateway-logs/
    └── control-socket/
```

首次初始化在本机生成保密的 .env。所有持久化使用宿主机目录 bind mount，不使用 named volume；resources/ 只读。data/control-socket 是运行状态，无需备份。升级不得删除 data/。

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

- GAME_PUBLIC_URL：例如 http://192.168.1.20:3338。
- ADMIN_PUBLIC_URL：例如 http://192.168.1.20:8000。
- ADMIN_STATEFUL_DOMAINS：例如 192.168.1.20:8000，不含协议。
- GATEWAY_PORT、ADMIN_PORT：默认 3338、8000。修改端口时同步 URL。
- RESOURCE_DIR、DATA_DIR：默认 ./resources、./data。自定义时先复制资源、创建 data/ 中所有子目录，挂载不自动创建缺失路径。
- 本模板默认局域网 HTTP。使用 HTTPS 时设置 SESSION_SECURE_COOKIE=true，并确保反向代理传递原始协议。

默认 localhost 仅适用于本机浏览器，其他设备访问应填写 Mac 的局域网地址。initialize 生成随机密钥；保留 APP_KEY，已有 .env 不会被覆盖。镜像变量必须保持该包 .env.example 中的值。

```bash
python3 tools/deployment/manage.py deploy --directory .
docker compose ps -a
```

部署初始化会幂等创建后台 `admin/admin` 超级管理员和游戏 `happyro/happyro` GM 账号；重复运行不会新增重复账号。deploy 校验整个包、Compose 镜像配置和已导入镜像后启动，不构建、不拉取、不覆盖 .env。首次后台初始化可能耗时，使用 docker compose logs admin-init 查看迁移、默认账号和图鉴导入。

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

游戏依赖链是 database → login → char → map → web-api → gateway。Admin 等待数据库、admin-init 完成和 web-api 健康。游戏不等待 Admin；后台停机时，依赖后台能力的冒险工具标签不可用或不显示，登录、战斗和 NPC 不依赖后台。

```bash
docker compose stop admin
docker compose up -d --pull never admin
```

后台初始化失败时，整栈启动可能报错；检查 ps -a 和 logs，必要时单独启动游戏链：docker compose up -d --pull never gateway。停止 Admin 不要停止共享数据库。Admin 和 Server 共享 data/server-settings，battle_conf.txt 的运营变更须备份；不能改成单文件挂载。

## 升级

1. 保留新版完整包并执行 verify；先在旧部署目录停止写入并备份（见下节）。同一存档只能有一套游戏服务运行。
2. 在新版包根目录复制旧 .env，保留 APP_KEY、数据库密码和控制令牌；从新版 .env.example 更新 RELEASE_VERSION 和四个 IMAGE 变量。
3. 将 DATA_DIR 指向旧部署已停止写入的数据目录（建议绝对路径），RESOURCE_DIR 使用新版包内资源。不要把新的空 data/ 当成旧存档。
4. 导入本版镜像，再启动 database，显式执行 Admin 迁移和快照导入，成功后启动整栈。

```bash
python3 tools/deployment/manage.py import-images --directory .
docker compose up -d --pull never database
docker compose run --rm --no-deps --pull never admin-init
python3 tools/deployment/manage.py deploy --directory .
```

原有 Compose 项目名应保持一致。数据库初始化 SQL 只对空目录执行；Server schema 变化需先审查该版本升级 SQL，并在停写后显式执行。工具不盲目执行历史升级脚本。

## 备份与恢复

先停止所有写入，仅保留 database 运行。数据库含非事务表，不能在有写入时仅凭 single-transaction 获得一致备份。

```bash
docker compose stop gateway admin web-api map char login
python3 tools/deployment/manage.py backup --directory . --output ../backups/before-upgrade
```

普通备份完成后可运行 deploy 恢复服务；准备升级时保持停写。备份包含三个数据库（happyro、happyro_log、happyro_admin）、Admin storage、server-settings、.env 和部署清单。备份含密钥，应复制到异机；无 checksums.json 的部分备份不可恢复。完整离线包另行保存，备份不会重复复制镜像和资源。

恢复优先使用匹配版本的完整包及新的宿主机数据目录。复制备份 .env、核对路径和地址，保留原 APP_KEY，不重新 initialize：

```bash
python3 tools/deployment/manage.py import-images --directory .
docker compose up -d --pull never database
python3 tools/deployment/manage.py restore --directory . --backup ../backups/before-upgrade --confirm-replace
python3 tools/deployment/manage.py deploy --directory .
```

restore 校验备份哈希，并拒绝其它服务仍运行的环境；它替换备份涉及的表和文件，不自动替换镜像、资源或密钥。覆盖已有数据前另做备份。跨数据库版本或不兼容 schema 回退，必须同时恢复配套备份。

从现有 systemd 环境迁移需单独安排停服，导出三个库、storage、battle_conf.txt 并保留 APP_KEY，再导入新的宿主机数据目录。工具不会自动搬迁旧主机存档。

## 验收与当前边界

首次发布仍需验证 AMD64/ARM64 镜像构建、空库初始化、已有库升级、登录选角、地图和音效、后台会话、图鉴、冒险工具、运营设置重启持久化、故障重启及备份恢复。健康检查只表明服务启动，不代替游戏验收；offline-ready 表示归档组装校验完成，不表示已通过运行验收。

每次升级后强制刷新游戏与后台，核对游戏 build-info.json，检查启动页、资源、聊天、导航和冒险工具。验证独立停止及恢复后台时游戏仍运行。默认关闭雾效无需额外配置；已有浏览器偏好仍保留，可用 /fog 切换。

当前方案仅准备工具与定义；未在本次修改中构建镜像或完成 Docker 运行验收。
