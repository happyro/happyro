# 配置

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
| `ADMIN_API_URL` | 代码默认 `http://127.0.0.1:18081` | `/api/adventure-tools` 同源代理目标，样例未显式设置 |
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

初始化脚本位于 `deploy/mariadb/init/`。游戏库不承载 Laravel 框架表。

## 服务端导入配置

HappyRO 覆盖写在 `repos/happyro-server/conf/import/`。本机 `make configure-server` 根据 `deploy/rathena/profile.env` 生成绑定地址。`PACKETVER` 固定 `20211103`，客户端 `packetKeys` 必须为 `false`，并与服务端 `PACKET_OBFUSCATION` 关闭状态一致。
