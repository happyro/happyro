# Docker 部署方案

本文记录 HappyRO 后续改为 Docker 运行时的基础方案。当前仓库仍使用本地脚本和 systemd 运行，Docker 部署属于后续运行方式。

旧路径 `docs/deploy/docker/README.md` 重定向到本文。当前强制发布规则见 [Docker 镜像发布](docker-release.md)。

## 目标架构

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
