# HappyRO

HappyRO 是基于 roBrowserLegacy 和 rAthena 的 Web 游戏栈。它独立于
`happyro-desktop`，不使用 Windows 客户端、公共 GRF 服务或公共 WebSocket
代理。

HappyRO 自有修改按日期记录在 [`changelog/`](changelog/README.md)。

## 分支模型

- `main`：长期中文产品分支，也是日常维护和发布基线。
- `demo`：中文演示环境分支，只增加演示专属配置，并持续同步 `main`。

## 仓库布局

```text
happyro/
├── configs/                         # HappyRO 客户端配置
├── docs/translation/zh-cn/          # 两个独立的中文翻译工作区
├── deploy/mariadb/                  # 固定版本的开发数据库
├── deploy/rathena/                  # rAthena 运行时配置
├── deploy/remote-client/            # 网关环境
├── inputs/                          # 不可变源材料和暂存的运行时资源
├── repos/happyro-client/            # HappyRO roBrowserLegacy 派生仓库
├── repos/happyro-server/            # HappyRO rAthena 派生仓库
├── vendor/robrowserlegacy-remote-client-js/
├── versions/                        # 锁定的上游基线版本
├── scripts/                         # 可重复执行的检查和构建脚本
└── work/                            # 生成的输出
```

中文翻译工作区分别位于：

- [`docs/translation/zh-cn/client-server/`](docs/translation/zh-cn/client-server/README.md)：HappyRO client 和 server 项目的主产品翻译；
- [`docs/translation/zh-cn/kro-20211105/`](docs/translation/zh-cn/kro-20211105/README.md)：kRO 2021-11-05 官方客户端资源的独立翻译工作区。

两个工作区各自维护清单、进度、术语表、基准文件和 `agents/` 目录，不共用工作状态。

Docker 部署规划见 [`docs/deploy/docker/README.md`](docs/deploy/docker/README.md)。

网关的统一模式在 `3338` 端口提供 PWA、基于 GRF 的资源 API，以及连接
rAthena 的 WebSocket 代理。浏览器入口为：

```text
http://10.24.1.1:3338/applications/pwa/index.html
```

## 运行 HappyRO

```bash
make database-start
make server-start
make gateway-start
```

如果客户端或 server 尚未构建，或者运行时资源尚未配置，首次准备时再执行
`make configure-client`、`make configure-resources`、`make build-server`；
`make doctor`、`make test-client` 和 `make test-gateway` 属于检查和测试命令，
不属于日常启动步骤。

`make configure-resources` 会将经过核验的运行时 GRF、`DATA.INI`、BGM 和
System 文件链接到 vendor 目录中的网关，不会复制 3.4 GB 的客户端目录。
随后，`make test-gateway` 会使用这些资源运行网关检查。网关从
`repos/happyro-client/dist/Web` 发布经过测试的 PWA，路径为
`/applications/pwa/`；它在同一来源代理 rAthena HTTP API，并作为
`happyro-gateway.service` 运行。

客户端会在初始化前同步加载所需的 `Config.happyro.js`，运行时不会连接
GitHub。锁定的 RemoteClient-JS 版本引用了一个未发布的本地 ESRGAN 包。
HappyRO 不启用 ESRGAN，因此 vendor 工作树包含该依赖的可复现补丁，以及
同源的 rAthena API 代理。

`make test-account` 维护手动测试账号 `happyro1 / happyro`。
`make automation-account` 维护隔离的浏览器回归测试账号
`autotest / happyro` 及其 `AutoTest` 角色。

## 数据库和 rAthena 运行时

Web 栈使用独立的 MariaDB 10.11.18 实例。镜像通过摘要固定，数据存放在
被 Git 忽略的 `work/runtime/mariadb-10.11/` 下，并且只绑定到
`127.0.0.1:33062`。数据库模式为 `happyro` 和 `happyro_log`；密码在
本地生成，绝不提交到仓库。

```bash
make database-start
make database-verify
make server-start
make server-verify
make status
```

rAthena 的 login、char 和 map 服务监听 `10.24.1.1` 的 `6900`、`6121` 和
`5121` 端口。其 HTTP API 仅监听 `127.0.0.1:8889`；`8888` 端口仍由 NAS
上的 `tinyproxy` 服务使用。四个 rAthena 进程以临时 systemd 服务运行，
`make server-start` 返回后仍会保持活动状态。

按依赖顺序停止整个栈：

```bash
make gateway-stop
make server-stop
make database-stop
```

停止命令会保留 MariaDB 数据和生成的密钥。初始 schema 脚本只会在数据库
数据目录为空时运行。

## 更新上游

所有 HappyRO 自有仓库都以 `main` 作为主要维护分支。各派生仓库使用 `origin` 指向 HappyRO，
使用 `upstream` 指向原始项目。

```bash
make fetch-upstreams
make upstream-status

git -C repos/happyro-client merge --no-ff upstream/master
git -C repos/happyro-server merge --no-ff upstream/master
```

推送合并结果前运行相关测试。RemoteClient-JS 会保持锁定的 vendor 版本，
直到其兼容性补丁已针对更新的上游提交完成核验。
