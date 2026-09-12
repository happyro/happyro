# HappyRO 文档

本目录保存 HappyRO 自有的长期设计、开发和运维说明。运行时生成物放在 `work/`，可分发构建产物放在 `artifacts/`，历史翻译批次放在 `archive/`，不以文档目录替代源码或官方输入。

各应用仓库只维护自身文档，不复制根仓库内容。根仓库文档说明跨仓库边界和编排入口。

## 导航

| 分类 | 面向 | 入口 |
| --- | --- | --- |
| [架构](architecture/README.md) | 长期稳定设计 | 四仓库职责、运行时数据流、资料与本地化边界 |
| [开发](development/README.md) | 开发者 | 安装、启动、常用命令、测试、Git 规则 |
| [运维](operations/README.md) | 部署维护 | systemd、端口、环境变量、数据库、Docker 发布、故障检查 |
| [本地化](localization/README.md) | 中文资源维护 | 客户端资源链、服务端内容、校验 |
| [游戏资料](game-data/README.md) | 目录生成与消费 | 物品、魔物、地图、NPC、技能与状态 |
| [历史记录](history/README.md) | 批次与缺陷追踪 | Bugfix 记录（含 [2026-09-12 审查修复](history/bugfix/zh-cn/20260912-01/README.md)）、已归档翻译工作区 |

变更日志独立维护，不并入普通文档：

- 根仓库：[changelog/](../changelog/README.md)
- Client / Server：各自仓库的 `changelog/`
- Admin：`repos/happyro-admin/changelog/`
- Gateway：`repos/happyro-gateway/changelog/`（新记录），`CHANGELOG.md`（旧记录）

根仓库及嵌套仓库的操作规则以仓库根 `AGENTS.md` 为准。

## 按任务查找

- 首次安装：[本地开发](development/local-setup.md)。
- 更新并确认浏览器拿到新版本：[服务更新](operations/services.md#修改后的更新路径)。
- 游戏断线、技能不能释放、中文没生效：[故障检查](operations/troubleshooting.md)。
- 发布镜像：[强制发布规则](operations/docker-release.md)。
- 清理目录或迁移主机前：[备份与恢复](operations/backup-recovery.md)。
- 新增或修改文档：[文档维护](development/documentation.md)。

文档中的“当前源码”依据仓库实现；带日期的主机观察和测试计数只属于[历史快照](history/validation/README.md)。`work/runtime` 中的数据库和密钥不能当缓存清理。本文档审查不代表已发布新镜像或重新执行所有产品测试。
