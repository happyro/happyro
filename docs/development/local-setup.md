# 本地开发

本机默认使用根仓库脚本和 systemd transient units，不把完整 Docker Compose 当作当前运行方式。MariaDB 是唯一通过 Compose 启动的本机依赖。

## 依赖

| 依赖 | 要求 |
| --- | --- |
| Git、Node.js、npm | Node.js 22 或更高 |
| CMake、C++ 编译器 | 编译 rAthena |
| Docker、Docker Compose | MariaDB 10.11 |
| MariaDB 客户端工具 | 账号脚本需要 |
| systemd、systemd-run | 启动 login / char / map / web / gateway |
| rg、ss、curl、openssl | doctor 与健康检查 |
| Python 3 | 资料生成和翻译工具 |

`make doctor` 会检查上述命令、上游提交基线、封包配置和关键环境文件。

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

```bash
make doctor
make database-start
make configure-server
make build-server
make server-start
make configure-client
make configure-gateway
make configure-resources
make gateway-start
```

浏览器打开 <http://127.0.0.1:3338/applications/pwa/index.html>。

Admin 不由根仓库 Makefile 管理。本机地址：

- 前端：<http://10.24.1.1:8000>
- Laravel：<http://10.24.1.1:18081/api/health>

Admin 启动、账号创建和验收见 `repos/happyro-admin/README.md`。

## 客户端与网关配置

- `make configure-client` 把 `configs/Config.happyro.js` 安装到 Client PWA。
- `make configure-gateway` 把 `deploy/remote-client/.env.example` 安装为 Gateway `.env`。
- `make configure-resources` 校验中文覆盖、链接 GRF，并把卡片前缀表安装到 Gateway `data/`。

修改覆盖资源或客户端配置后，重新执行对应 configure 命令并重启 Gateway。

## 测试账号

数据库健康后：

```bash
make test-account
```

脚本在 `work/runtime/test-account.env` 写入本机测试账号，不提交该文件。
