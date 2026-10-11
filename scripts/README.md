# scripts

面向运维和开发者的业务入口。底层生成器在 `tools/`，不要把本目录改成工具实现层。

路径被 Makefile、systemd 启动流程和文档引用，不要在未更新全部引用前移动这些脚本。

| 目录 | 用途 |
| --- | --- |
| [account/](account/README.md) | 测试账号与自动化账号 |
| [client/](client/README.md) | 安装 PWA 配置并运行客户端测试 |
| [database/](database/README.md) | MariaDB Compose 启停 |
| [gateway/](gateway/README.md) | 网关配置、启动和健康检查 |
| [resources/](resources/README.md) | 运行资源配置与技能 / 导航生成 |
| [server/](server/README.md) | rAthena 配置、编译和启停 |
| `local/` | macOS 原生服务启停；入口见[服务管理](../docs/operations/services.md) |
| `maintenance/` | doctor、status、upstream |
| `localization/` | 只读本地化清单扫描 |
| `_lib/` | 共享路径和上游检查 |

常用入口见 [docs/development/common-commands.md](../docs/development/common-commands.md)。

Docker 镜像构建与离线交付统一使用 [tools/deployment](../tools/deployment/README.md)，本目录不维护第二套发布脚本。
