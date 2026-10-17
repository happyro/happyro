# tools

构建器、解析器、生成器和部署维护工具。本机开发运维入口在 `scripts/`，无源码 Docker 部署工具集中在 `deployment/`。

| 目录 | 用途 |
| --- | --- |
| [operations/](operations/README.md) | 本机 Docker 日常运维：预览、备份并清空账号角色 |
| [deployment/](deployment/README.md) | Docker 部署包、资源校验、密钥初始化、备份恢复和镜像发布 |
| [client/](client/README.md) | LUB 提取与回编译 |
| [resources/](resources/README.md) | 物品、魔物、NPC、地图目录生成与运行资源安装/审计 |
| [changelog/](../changelog/README.md#检查与同步) | 日期日志检查、文档站同步和索引生成 |

生成物写入 `work/` 或产品仓库资源目录，不把工具输出当作文档。

按职责放置工具：离线交付归 deployment，运行环境操作归 operations，Lua 提取编译归 client，资料及资源处理归 resources。不要在 tools 根目录继续堆积业务生成器。

- [技能审计工具](skill-audit/README.md)：607 项技能审计的实机脚本、环境边界与只读证据核验。
