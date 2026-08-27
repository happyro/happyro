# Docker 部署方案

本文记录 HappyRO 后续改为 Docker 运行时的基础方案。当前仓库仍使用本地脚本和 systemd 运行，Docker 部署属于后续运行方式。

## 目标架构

运行时使用三个镜像：

```text
kugarocks/happyro-gateway  ──┐
kugarocks/happyro-server    ──┼── Docker Compose
mariadb 官方镜像  ──┘
```

其中只有前两个镜像由 HappyRO 自己构建和发布。MariaDB 直接使用官方镜像，并固定版本或镜像 digest。

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

### MariaDB 官方镜像

数据库使用 MariaDB 官方镜像，不制作专用 HappyRO 数据库镜像。数据库数据、初始化脚本和服务端 SQL 通过挂载提供：

```text
数据库数据目录  -> /var/lib/mysql
服务端 SQL      -> /opt/rathena/sql:ro
初始化脚本      -> /docker-entrypoint-initdb.d/:ro
```

现有数据库配置入口为 `deploy/mariadb/compose.yml`，后续可以将其服务定义合并到 Docker 总编排文件中。

## 运行时资源挂载

`inputs/runtime/kro-20211105/` 不参与镜像构建，只在运行时以只读目录挂载给网关。中文 loose-data 和回编译资源属于独立覆盖层，不能写入该官方目录。

建议只挂载客户端子目录，而不是整个输入目录：

```yaml
services:
  gateway:
    volumes:
      - ./inputs/runtime/kro-20211105/client:/runtime/kro-client:ro
```

网关从 `/runtime/kro-client` 使用以下资源：

```text
data.grf
DATA.INI
BGM/
AI/
System/
```

覆盖资源应使用独立只读挂载：

```text
localization/client/data/  -> zh-cn loose-data 覆盖
artifacts/client/lub/      -> 已验证的回编译 LUB 产物
```

具体容器路径和覆盖优先级要在 Compose 实现时显式配置。不得为了简化挂载而把覆盖文件复制回 `inputs/runtime/kro-20211105/client/`。

服务端和 MariaDB 不需要挂载这套 kRO 客户端资源。

## 镜像边界

镜像构建时只包含运行所需的程序、Node.js 依赖、配置模板和构建产物。以下内容不得进入镜像层或构建上下文：

```text
inputs/runtime/
inputs/official/
work/
artifacts/
数据库数据目录
运行时密钥和本地密码
```

根目录 `.dockerignore` 应明确排除这些路径。Dockerfile 不应使用 `COPY inputs/ ...` 之类的指令。

## 网络关系

```text
浏览器
   │ HTTP / WebSocket
   ▼
gateway:3338
   ├── rAthena login:6900
   ├── rAthena char:6121
   ├── rAthena map:5121
   └── rAthena web-api:8889

rAthena login/char/map/web-api
   │
   ▼
MariaDB:3306
```

推荐只暴露网关端口 `3338`。rAthena 和 MariaDB 端口应使用 Compose 内部网络连接；如果需要宿主机调试，再单独配置绑定地址和端口。

运行时继续使用固定的 `PACKETVER=20211103`、Renewal 以及客户端和服务端一致的封包设置。

## 目录建议

后续 Docker 文件可以按以下方式组织：

```text
deploy/docker/
├── compose.yml
├── .env.example
├── gateway/
│   └── Dockerfile
└── server/
    └── Dockerfile
```

Docker 相关操作脚本放在现有的 `scripts/` 分类目录中；镜像构建输出、数据库数据和运行时生成文件继续放在 `work/` 或其他被 Git 忽略的目录中。

## 构建和启动流程

目标流程如下：

```text
构建 happyro-client
        │
        ▼
构建 happyro-gateway

构建 happyro-server

准备宿主机运行时目录和密钥
        │
        ▼
docker compose up -d
        │
        ▼
检查 gateway、rAthena 和 MariaDB 健康状态
```

首次启动时：

1. 准备 `inputs/runtime/kro-20211105/client/`；
2. 准备数据库数据目录、配置文件和运行时密钥；
3. 构建或拉取 `happyro-gateway` 和 `happyro-server`；
4. 启动 MariaDB，等待健康检查通过；
5. 启动 rAthena 服务；
6. 启动 Gateway 并访问 `http://<服务器地址>:3338/`。

停止 Compose 栈时只停止容器，不删除数据库数据卷、运行时资源和密钥目录。

## 当前实现与后续工作

本文仍是未实施的目标方案，不是当前运行手册。当前仓库中的 `deploy/mariadb/compose.yml` 已经提供 MariaDB 的基础容器定义；Gateway、rAthena 和完整栈的 Compose 文件尚未落地，后续实现顺序建议为：

1. 固定 gateway 和 server 的构建上下文及启动命令；
2. 为两类自有镜像分别添加 Dockerfile；
3. 将四个 rAthena 服务定义加入 Compose；
4. 添加只读客户端资源挂载和 `.dockerignore`；
5. 增加健康检查、日志目录和优雅停止配置；
6. 在目标部署环境完成完整启动、登录和资源加载验证。
