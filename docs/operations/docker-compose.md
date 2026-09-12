# Docker 部署方案

仓库已提供 `deploy/docker/compose.yml` 和三个 Dockerfile。它是独立部署拓扑，不是当前开发主机的实际运行状态：本机游戏进程由 systemd 管理，开发数据库使用另一份 `deploy/mariadb/compose.yml`。发布规则见[镜像发布](docker-release.md)。

## 镜像架构

运行时使用三个镜像：

```text
kugarocks/happyro-gateway  ──┐
kugarocks/happyro-server    ──┼── Docker Compose
kugarocks/happyro-database ──┘
```

三个镜像均由 HappyRO 构建和发布。数据库镜像以官方 MariaDB 镜像为基础，补充服务端 SQL 和 HappyRO 初始化脚本。

## 容器和镜像职责

### `kugarocks/happyro-gateway`

技术栈为 Node.js、Express 和 WebSocket。容器负责：

- 提供构建后的 PWA 页面；
- 提供客户端资源和 GRF 资源 API；
- 将浏览器 WebSocket 连接代理到 rAthena；
- 代理 rAthena HTTP API；
- 提供网关健康检查接口。

客户端源码位于 `repos/happyro-client/`，构建产物 `dist/Web` 可以在构建镜像时写入网关镜像。kRO 运行时资源不写入镜像。

### `kugarocks/happyro-server`

镜像内包含编译后的 rAthena 服务端程序。使用同一个镜像启动四类容器：

```text
login
char
map
web-api
```

各容器通过不同的启动命令和配置文件运行对应服务。服务端源码位于 `repos/happyro-server/`。

### `kugarocks/happyro-database`

数据库镜像基于 MariaDB 官方镜像，包含服务端 SQL 和 HappyRO 数据库初始化脚本。数据库数据仍通过运行时卷挂载提供：

```text
数据库数据目录  -> /var/lib/mysql
服务端 SQL      -> 镜像内 /opt/rathena/sql/
```

完整 Compose 定义见 `deploy/docker/compose.yml`。Admin 不进入这三个镜像。

## 配置与运行边界

- Compose 默认镜像标签是 `latest`；部署已验证版本时用部署专用 override 将三个 image 全部固定为同一版本，不能仅修改一项。
- `KRO_CLIENT_DIR` 必须指向含 `DATA.INI`、GRF、AI、BGM、System 的运行客户端目录；默认 `./kro-client` 不是自动下载地址。
- 按 Compose 所列变量设置数据库和 interserver 密码；默认示例密码不是生产凭据。
- Gateway 默认只映射 HTTP/WS 3338，游戏 TCP 使用容器内网络。`WS_TARGET_REDIRECTS` 将浏览器包中的回环地址映射到 login/char/map 服务。
- 数据库卷与本机 `happyro-mariadb` 不同。初始化脚本只在空数据目录首次启动时执行，不会给已有库自动做迁移。
- Admin 未在此 Compose 中定义，因此依赖 Admin 的冒险工具 API 需要另行提供可达的 Admin 服务和 `ADMIN_API_URL`。容器里的 127.0.0.1 不指向主机 Admin。

可先只验证配置语法（不启动服务、不构建）：

```bash
docker compose -f deploy/docker/compose.yml config --quiet
```

该命令不验证资源内容、数据库凭据或镜像是否存在。不要用 `docker compose up --build` 替代正式版本的无缓存双架构发布流程。
