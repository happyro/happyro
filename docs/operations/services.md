# 服务

本机开发使用 systemd transient units。Admin 使用仓库内的长期 systemd 模板。

## 进程与端口

| 服务 | 入口 | 地址 |
| --- | --- | --- |
| MariaDB | `make database-start` | `127.0.0.1:33062` |
| login-server | `make server-start` | `127.0.0.1:6900` |
| char-server | 同上 | `127.0.0.1:6121` |
| map-server | 同上 | `127.0.0.1:5121` |
| web-server | 同上 | `127.0.0.1:8889` |
| Gateway | `make gateway-start` | `127.0.0.1:3338` |
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

根仓库脚本创建的 transient units：

- `happyro-login.service`
- `happyro-char.service`
- `happyro-map.service`
- `happyro-web-api.service`
- `happyro-gateway.service`

MariaDB 容器名为 `happyro-mariadb`。Admin 模板位于 `repos/happyro-admin/deploy/systemd/`。Server 物理部署模板位于 `repos/happyro-server/deploy/systemd/`，用于长期安装，不是本机 `make server-start` 使用的 transient units。

## 日志

- Gateway：`work/runtime/gateway/gateway.log`
- rAthena：`work/runtime/rathena-20211103/logs/<service>.log`
- MariaDB：Compose 容器日志
- Admin：`journalctl -u happyro-admin-backend -f` 与 `journalctl -u happyro-admin-frontend -f`
