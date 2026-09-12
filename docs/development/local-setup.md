# 本地开发

本机游戏开发栈使用 systemd 管理应用进程、Compose 管理 MariaDB。根仓库启动脚本可创建临时单元，已部署主机也可能装有长期单元；先按[服务手册](../operations/services.md)识别实际单元，不同时运行两套启动方式。完整 Docker 拓扑见[Docker 部署](../operations/docker-deployment.md)。

## 依赖

| 依赖 | 要求 |
| --- | --- |
| Git、Node.js、npm | Node.js 22 或更高 |
| CMake、C++ 编译器 | 编译 rAthena |
| Docker、Docker Compose | MariaDB 10.11 |
| MariaDB 客户端工具 | 账号脚本需要 |
| systemd、systemd-run | 启动 login / char / map / web / gateway |
| rg、ss、curl、openssl、jq、sha256sum | doctor、配置与构建哈希检查 |
| Python 3 | 资料生成和翻译工具 |

`make doctor` 检查部分工具、上游提交基线、封包配置和关键环境文件，不覆盖全部依赖。它还要求 Gateway HEAD 等于 `versions/sources.lock` 的锁定提交；维护分支包含后续提交时会失败。处理方法见[故障检查](../operations/troubleshooting.md)，不要为通过检查丢弃产品提交。

## 仓库布局

在根仓库工作，四个应用仓库位于 `repos/`：

```text
happyro/
├── configs/                 客户端配置源
├── deploy/                  环境样例和 Docker 模板
├── localization/            中文覆盖与回编译源
├── inputs/runtime/          kRO 运行目录（本机准备）
├── scripts/                 启动和配置入口
└── repos/
    ├── happyro-client
    ├── happyro-server
    ├── happyro-gateway
    └── happyro-admin
```

运行资源必须放在本机 `inputs/runtime/kro-20211105/`。不要使用公共 roBrowser GRF 服务。准备步骤见 [inputs/README.md](../../inputs/README.md)。

## 启动顺序

先检出四个应用仓库（它们不是根仓库的子模块），并准备上述资源和依赖。以下命令从根仓库执行，适用于尚未运行的开发环境；已有服务先检查状态。

```bash
make database-start
make configure-server
make build-server
make server-start
make configure-client
make configure-gateway
make configure-resources
(cd repos/happyro-client && npm install && npm run build:pwa)
make doctor
make gateway-start
```

浏览器打开 <http://127.0.0.1:3338/applications/pwa/index.html>。

局域网验收入口为 `http://<主机IP>:3338/applications/pwa/index.html`，当前测试主机为 <http://10.24.1.1:3338/applications/pwa/index.html>。该页应为带“进入游戏”和查看器入口的启动页。禁止用只构建 Online 的产物覆盖本机入口。

Admin 不由根仓库 Makefile 管理。本机地址：

- 前端：<http://10.24.1.1:8000>
- Laravel：<http://10.24.1.1:18081/api/health>

Admin 启动、账号创建和验收见 `repos/happyro-admin/README.md`。

## 客户端与网关配置

- `make configure-client` 把 `configs/Config.happyro.js` 安装到 Client PWA。
- `make configure-gateway` 把 `deploy/remote-client/.env.example` 安装为 Gateway `.env`。
- `make configure-resources` 校验中文覆盖、链接 GRF，并把卡片前缀表安装到 Gateway `data/`。

修改客户端 JS、CSS、配置或生成表后需要完整 PWA 构建，运行中的 Gateway 可用 `./scripts/client/refresh-client.sh build --no-color` 构建并校验；只重启 Gateway 不会编译客户端。修改 Gateway 代码、环境或缓存资源时再重启 Gateway。分步更新见[服务手册](../operations/services.md)。

## 测试账号

数据库健康后：

```bash
make test-account
```

脚本在 `work/runtime/test-account.env` 写入本机测试账号，不提交该文件。
