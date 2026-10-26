# 原生开发环境配置

本页的 profile 和端口主要适用于 Linux 本机开发栈；macOS 独立数据库见[服务管理](services.md)。Docker 离线包使用包内 `.env.example` 和[部署手册](docker-deployment.md)，不能照搬本页端口。

## 本机配置源

| 文件 | 用途 |
| --- | --- |
| `configs/Config.happyro.js` | PWA 封包版本和 HappyRO 运行开关 |
| `deploy/remote-client/.env.example` | Gateway 环境样例，安装为 `repos/happyro-gateway/.env` |
| `deploy/rathena/profile.env` | login / char / map / web 绑定地址和端口 |
| `deploy/mariadb/profile.env` | MariaDB 镜像、绑定地址、库名 |
| `configs/npc-navigation-overrides.json` | NPC 导航关联审查覆盖 |

不要把密钥提交进 Git。MariaDB 密码写在被忽略的 `work/runtime/mariadb-10.11/secrets.env`。

## Gateway 环境变量

当前样例见 `deploy/remote-client/.env.example`：

| 变量 | 当前值 | 作用 |
| --- | --- | --- |
| `PORT` | `3338` | HTTP / WebSocket 端口 |
| `ROBROWSER_PATH` | Client `dist/Web` | PWA 静态根 |
| `ROBROWSER_PUBLIC_PATH` | `/applications/pwa` | 浏览器路径前缀 |
| `WS_ALLOWED_TARGETS` | `127.0.0.1:6900,127.0.0.1:6121,127.0.0.1:5121` | 每一项必须是完整 host:port |
| `REMOTE_CLIENT_URL` / `SOCKET_PROXY_URL` | 空 | 使用当前页面同源资源和 `/ws/`；非空时覆盖对应浏览器入口 |
| `HAPPYRO_API_URL` | 代码默认 `http://127.0.0.1:18081` | `/api/adventure-tools` 同源代理目标，样例未显式设置 |
| `WS_TARGET_REDIRECTS` | 本机不设置 | Docker 将允许的客户端目标映射到容器服务名 |
| `RATHENA_WEB_API_URL` | `http://127.0.0.1:8889` | Web API 反向代理 |
| `DATA_OVERRIDE_PATH` | 运行目录 + `localization/client/data` | 散装资源覆盖 |
| `ENABLE_WSPROXY` | `true` | 内嵌 WebSocket 代理 |
| `ENABLE_STATIC_SERVE` | `true` | 内嵌 PWA 静态服务 |
| `ESRGAN_ENABLED` | `false` | 禁止外部放大插件 |

`DATA_OVERRIDE_PATH` 使用系统路径分隔符。Gateway 按列出顺序查找，先命中先返回。

以上是仓库样例/代码默认值，不代表运行进程的实际环境。`configure-gateway.sh apply` 只在 `.env` 缺失时创建，已有文件不会被新样例覆盖。修改前对照已有配置；不要把含密码的完整环境输出到日志。

## 数据库

本机 MariaDB：

- 绑定 `127.0.0.1:33062`
- 游戏库 `happyro`
- 日志库 `happyro_log`
- 用户 `happyro`
- Admin 库 `happyro_admin`，与玩家数据隔离

初始化脚本位于 `deploy/mariadb/init/`。游戏库不承载 API 的管理账号、会话、权限和资料目录表；管理库由 Go API 的 Goose 迁移维护。

## 服务端导入配置

HappyRO 覆盖写在 `repos/happyro-server/conf/import/`。本机 `make configure-server` 根据 `deploy/rathena/profile.env` 生成绑定地址。`PACKETVER` 固定 `20211103`，客户端 `packetKeys` 必须为 `false`，并与服务端 `PACKET_OBFUSCATION` 关闭状态一致。


## 地图服视野与行走

| 环境变量 | 默认值 | 允许范围 |
| --- | --- | --- |
| `HAPPYRO_AREA_SIZE` | 14 格 | 5–50，整数 |
| `HAPPYRO_MAX_WALK_PATH` | 17 格 | 1–32，整数 |

空值或未设置时使用服务端 battle 文件配置；非空环境变量在所有导入文件加载后覆盖对应值，非法值导致地图服报错退出。修改变量需要重启进程，单独重载配置不会读取已修改的外部环境文件。重载 battle 配置仍会重新应用当前进程中的环境变量。

- Linux 原生启动脚本：编辑 `deploy/rathena/profile.env` 后重启地图服。
- macOS：编辑同一个 `deploy/rathena/profile.env`，`scripts/local/macos-services.sh start` 会把这两个值同步到地图服 launchd plist；已加载服务不会自动重启，应在合适时机 stop/start。单独 kickstart 不会重新读取 profile。直接管理 launchd 时，可修改地图服 plist 的 `EnvironmentVariables` 并重新加载服务。
- Docker：编辑部署目录 `.env`，重新创建 map 容器。Compose 将这两个变量注入服务端进程。
- 独立 systemd 服务：通过 `systemctl edit happyro-map-server` 的 `[Service] Environment=` 设置并重启。

例：`HAPPYRO_AREA_SIZE=14`、`HAPPYRO_MAX_WALK_PATH=17`。留空可继续通过管理后台维护对应 battle 文件值；配置非空环境变量后，后台修改同名文件值不会在重载时覆盖环境变量。

首次使用需要更新地图服二进制。客户端默认搜怪 14、活动 30；搜怪上限随服务端实际视野同步，旧超限值按实际范围生效，活动范围及瞬移设置保持独立。更大视野不等于可无限距离追击：行走路径仍受上限约束，详细语义见[服务端说明](../../repos/happyro-server/docs/battle-environment.md)。

## 玩法与工具权限

地图服新增 10 项 `HAPPYRO_NAVIGATION_*` / `HAPPYRO_GAME_TOOLS_*` 部署覆盖，支持导航、召怪与工具权限。配置入口同上，值留空交由文件和后台管理。非空覆盖项提交修改时由 API 明确拒绝，地图服同时校验；需更新地图服和 API。完整变量表与示例见[环境变量配置参考](https://happyro.kugarocks.com/deploy/environment-variables#玩法与工具权限环境变量)。

## 后台账号改密与演示环境

`ADMIN_PASSWORD_CHANGE_ENABLED` 默认 `true`，控制后台头像菜单的自助改密。共享 admin 账号的演示环境设置为 `false`，API 会隐藏入口并拒绝改密请求；后台页面不能覆盖此限制，服务器 CLI `users password` 不受影响。

Docker 在部署 `.env` 修改后重新创建 API 容器：`docker compose up -d --no-deps --force-recreate api`。原生环境修改实际传入 API 的环境变量后重启服务。该配置属于 API，不是 Gateway 或前端构建参数。登录限流、会话失效和部署细节见 [API 部署说明](../../repos/happyro-api/docs/deployment.md#后台账号改密)。

## 注册默认权限组锁

API 环境变量 `REGISTRATION_SETTINGS_EDITABLE` 默认 `false`，锁定后台「游戏设置 → 账号注册」的默认权限组选择和保存，同时拒绝直接 API 修改。设为 `true` 并重启 API 后可保存「普通玩家 / GM」，演示部署保存后恢复 `false`；锁定保留当前策略。Compose 已透传该变量。

先执行服务端 `sql-files/happyro-admin.sql` 初始化共享策略表，再更新登录服和 API。详见 [API 部署说明](../../repos/happyro-api/docs/deployment.md#新注册账号默认权限组)。
