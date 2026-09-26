# 服务

Linux 本机进程由 systemd 管理，单元可能是长期安装或脚本创建的 transient unit。不要从 Makefile 的存在推断实际安装方式，也不要把停止后的临时单元当作仍可直接启动的长期单元。

## macOS 原生应用与独立数据库

macOS 应用由 launchd 管理，使用独立 Docker 容器 `happyro-native-database`，数据库仅发布到 `127.0.0.1:13306`。它与完整 Docker 游戏栈的 `happyro-database` 使用不同的数据目录、容器名和 Compose 项目，禁止互换数据或直接用完整游戏栈数据库替代。

```bash
bash scripts/local/macos-services.sh start --no-color
bash scripts/local/macos-services.sh status --no-color
bash scripts/local/macos-services.sh stop --no-color
```

启动前先停止占用 3338／8000 端口的 Docker 游戏应用。脚本只启停已准备的独立数据库容器和 launchd 服务，不初始化数据、不构建程序。数据库 Compose 配置在 `work/runtime/native/database-compose.json`，含凭据，不提交；数据目录与部署信息以 `work/runtime/native/hybrid-deployment.json` 为准。

原生服务配置与日志在 `work/runtime/native/launchd/`、`work/runtime/native/logs/`。游戏入口为 `http://127.0.0.1:3338/applications/pwa/index.html`，后台为 `http://127.0.0.1:8000`，后台内部端口为 `127.0.0.1:18081`。服务端可执行文件位于 `work/runtime/native/bin/`；编译后须在对应进程停止时更新这些文件，再启动并核对服务互联。

下文 Makefile 和 systemd 命令适用于 Linux。

## 进程与端口

| 服务 | 入口 | 地址 |
| --- | --- | --- |
| MariaDB | `make database-start` | `127.0.0.1:33062` |
| login-server | `make server-start` | `127.0.0.1:6900` |
| char-server | 同上 | `127.0.0.1:6121` |
| map-server | 同上 | `127.0.0.1:5121` |
| web-server | 同上 | `127.0.0.1:8889` |
| Gateway | `make gateway-start` / 已安装单元 | `:3338`，监听主机接口，客户端可从局域网访问 |
| Admin 前端 | `happyro-admin-frontend.service` | `:8000` |
| Admin 后端 | `happyro-admin-backend.service` | `:18081` |

Gateway 对浏览器暴露 PWA、`/data`、`/ws/` 和 rAthena Web API 代理。游戏 TCP 端口不直接对浏览器开放。

## 启停

```bash
make database-start
make server-start
make gateway-start

make status
make database-verify
make server-verify
make gateway-verify

make gateway-stop
make server-stop
make database-stop
```

Gateway 启动前会验证 Server 健康，并重新执行网关与资源配置。

## systemd 单元

根仓库脚本使用以下单元名创建 transient units；长期模板可能占用同名服务：

- `happyro-login.service`
- `happyro-char.service`
- `happyro-map.service`
- `happyro-web-api.service`
- `happyro-gateway.service`

MariaDB 容器名为 `happyro-mariadb`。Admin 模板位于 `repos/happyro-admin/deploy/systemd/`；Server 长期模板位于 `repos/happyro-server/deploy/systemd/`。实际安装来源用以下只读命令核验：

```bash
systemctl show happyro-login happyro-char happyro-map happyro-web-api happyro-gateway -p Id -p FragmentPath -p Transient -p MainPID
systemctl cat happyro-map.service
```

2026-09-13 检查时，主机上既有 `/etc/systemd/system/` 单元，也有 `/run/systemd/transient/` 单元；该观察不是新机器的安装要求。已有同名单元时使用其部署手册维护，勿再次运行 `systemd-run` 创建冲突单元。

## 修改后的更新路径

| 变更 | 生效动作 | 验证 |
| --- | --- | --- |
| Client JS / CSS / 静态生成表 / Config | Gateway 运行时执行 `./scripts/client/refresh-client.sh build --no-color` | manifest 与 HTTP 哈希一致，再浏览器刷新 |
| Gateway 代码 / `.env` | 重启 `happyro-gateway.service`，等待 HTTP 就绪 | `make gateway-verify` |
| 散装中文 / 运行 LUB | 配置、核对目标哈希，重启 Gateway 清文件缓存 | 资源端点和实际显示 |
| Server C++ | `make build-server` 后重启受影响进程；common 修改影响所有程序 | 监听、服务互联、实际业务 |
| Server db / NPC / conf | 根据对应设置采用受支持 reload 或重启 | 新实体、对话、权限和日志 |

重启会断开游戏连接。安排维护窗口，先完成构建与备份。`systemctl is-active` 只说明进程存活；`server-verify` 会检查监听并搜索累计日志中的 ready 标记，旧日志可能命中，必须同时核对本次启动后的日志和真实连接。

更改 login / char 时注意 `Requires=` 依赖可能连带停止后继服务；长期单元按 login → char → map 顺序启动，并单独检查 web-api 和 Gateway。临时单元停止后可能被回收，应通过创建它的脚本重新建立，不能假定 `systemctl start` 永远有效。

## 日志

- Gateway：`work/runtime/gateway/gateway.log`
- rAthena：`work/runtime/rathena-20211103/logs/<service>.log`
- MariaDB：Compose 容器日志
- Admin：`journalctl -u happyro-admin-backend -f` 与 `journalctl -u happyro-admin-frontend -f`
