# HappyRO

HappyRO 是基于 roBrowserLegacy、rAthena 和 RemoteClient-JS 的中文 Web
游戏栈，不依赖 Windows 客户端、公共 GRF 服务或公共 WebSocket 代理。

运行基线固定为 kRO 2021-11-05、`PACKETVER=20211103`、Renewal，客户端与
服务端必须使用一致的封包配置。

## 仓库结构

```text
happyro/
├── configs/                         # 本地 HappyRO 客户端配置
├── deploy/                          # 本地及生产运行时配置
├── docs/                            # 部署、翻译历史和故障记录
├── inputs/                          # 只读官方源材料与运行时资源
├── localization/client/data/        # 中文 loose-data 运行时覆盖层
├── repos/happyro-client/            # roBrowserLegacy 派生仓库
├── repos/happyro-server/            # rAthena 派生仓库
├── scripts/                         # 本地检查、构建和服务管理脚本
├── tools/                           # 发布、翻译和工作区工具
├── vendor/robrowserlegacy-remote-client-js/
├── versions/                        # 锁定的依赖版本
├── artifacts/                       # 可重建或经验证的生成产物
└── work/                            # 被 Git 忽略的临时输出和运行状态
```

根仓库、`repos/happyro-client` 和 `repos/happyro-server` 是三个独立 Git
仓库，各自提交并只推送到自己的 `origin`。`vendor/` 中的网关保持锁定版本，
包含 HappyRO 所需的可复现补丁。

## 分支模型

- `main`：长期中文产品分支，也是日常维护和发布基线。
- `demo`：中文演示环境分支，只增加演示专属配置，并持续同步 `main`。

## 中文资源边界

`docs/translation/zh-cn/` 保存已经关闭的翻译批次、清单和历史验证记录，
不再作为客户端或服务端产品源码的发布源。后续产品翻译直接修改：

```text
repos/happyro-client
repos/happyro-server
```

kRO 资源翻译和回编译历史仍可从
[`docs/translation/zh-cn/kro-20211105/`](docs/translation/zh-cn/kro-20211105/README.md)
复现。运行时 loose-data 覆盖位于 `localization/client/data/`。

以下目录中的核验文件视为不可修改的官方源材料：

```text
inputs/official/
inputs/runtime/kro-20211105/
```

新生成的文件写入 `work/` 或 `artifacts/`，不得覆盖官方源材料。HappyRO
自有变更按日期汇总在 [`changelog/`](changelog/README.md)；客户端和服务端
同时维护各自仓库内、与产品提交同行的 changelog。

## 本地准备

先检查依赖和工作区状态：

```bash
make doctor
make status
```

首次运行或源码更新后，按需准备客户端、资源和服务端：

```bash
make configure-client
make configure-resources
make test-client
make build-server
```

`make test-client` 会运行客户端测试并重新生成
`repos/happyro-client/dist/Web`。`make configure-resources` 只把核验过的 GRF、
`DATA.INI`、BGM、AI 和 System 资源链接到网关，不复制完整的 3.4 GB 客户端
目录。

## 本地运行

按依赖顺序启动数据库、rAthena 和网关：

```bash
make database-start
make server-start
make gateway-start
```

浏览器入口：

```text
http://10.24.1.1:3338/applications/pwa/index.html
```

验证整个运行栈：

```bash
make database-verify
make server-verify
make gateway-verify
make status
```

`make test-account` 维护手动测试账号 `happyro1 / happyro`；
`make automation-account` 维护隔离的浏览器回归测试账号
`autotest / happyro` 及其 `AutoTest` 角色。

按反向依赖顺序停止：

```bash
make gateway-stop
make server-stop
make database-stop
```

停止服务不会删除数据库数据、运行时资源或本地生成的密钥。

## 本地运行架构

网关监听 `3338`，在同一来源提供 PWA、客户端资源、GRF 资源 API、rAthena
Web API 代理和 WebSocket 代理。它以 `happyro-gateway.service` 运行，并从
`repos/happyro-client/dist/Web` 发布 `/applications/pwa/`。

rAthena 的 login、char 和 map 服务监听 `10.24.1.1` 的 `6900`、`6121` 和
`5121` 端口；Web API 只监听 `127.0.0.1:8889`。四个进程通过临时 systemd
服务运行。MariaDB 10.11.18 只绑定 `127.0.0.1:33062`，数据保存在被 Git
忽略的 `work/runtime/mariadb-10.11/`。

网关不会在客户端初始化时访问 GitHub。HappyRO 不启用 RemoteClient-JS
中的 ESRGAN 功能。

## 中文演示部署

生产演示站点为：

```text
https://happyro-demo.kugarocks.com/applications/pwa/index.html
```

在开发机生成包含客户端、服务端、网关和部署配置的发布包：

```bash
tools/deploy/package-demo.sh --build
```

归档默认写入 `work/deploy/`，不会包含 Git 历史、密钥、日志、数据库数据或
kRO 运行时资源。生产环境使用系统 MariaDB、systemd 和 OpenResty，不使用
Docker。完整发布、数据库初始化、每日重置和验收步骤见
[`docs/deploy/production/README.md`](docs/deploy/production/README.md)。

Docker 文档目前只是后续方案，不是现行运行手册，见
[`docs/deploy/docker/README.md`](docs/deploy/docker/README.md)。
