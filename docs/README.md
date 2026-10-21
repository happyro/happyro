# HappyRO 文档

本目录保存 HappyRO 自有的长期设计、开发和运维说明。运行时生成物放在 `work/`，可分发构建产物放在 `artifacts/`；只维护当前规则、有效待办和必要来源，不复制历史过程记录。

各应用仓库只维护自身文档，不复制根仓库内容。根仓库文档说明跨仓库边界和编排入口。

## 导航

| 分类 | 面向 | 入口 |
| --- | --- | --- |
| [架构](architecture/README.md) | 长期稳定设计 | 七仓库职责、运行时数据流、资料与本地化边界 |
| [开发](development/README.md) | 开发者 | 安装、启动、常用命令、测试、Git 规则 |
| [运维](operations/README.md) | 部署维护 | systemd、端口、环境变量、数据库、Docker 发布、故障检查 |
| [本地化](localization/README.md) | 中文资源维护 | 客户端资源链、服务端内容、校验 |
| [游戏资料](game-data/README.md) | 目录生成与消费 | 物品、魔物、地图、NPC、技能与状态 |

变更日志独立维护，不并入普通文档：

- 根仓库：[changelog/](../changelog/README.md)
- Client / Server：各自仓库的 `changelog/`
- Admin：`repos/happyro-admin/changelog/`
- Gateway：`repos/happyro-gateway/changelog/`（新记录），`CHANGELOG.md`（旧记录）

各仓库文档入口与维护职责见[文档维护](development/workflow/documentation.md#七仓库内容归属)。

根仓库及嵌套仓库的操作规则以仓库根 `AGENTS.md` 为准。

## 当前发布准备

当前正式发布版本为 [v0.5.0](../changelog/releases/v0.5.0.md)，从 v0.3.x（最近历史发布为 v0.3.2）直接跃升，跳过未发布的 v0.4.x。此次变更规模大，标志着项目达到重要里程碑，以 v0.5.0 汇总跨端体验、游戏功能和部署维护的阶段成果。日期日志记录实际变更；交付与本机验收结果见版本说明。

| 阅读目标 | 入口 |
| --- | --- |
| 玩家操作与公开安装 | [文档站](../repos/happyro-doc/README.md) |
| 客户端 UI、网络与游戏逻辑 | [Client](../repos/happyro-client/docs/README.md) |
| 服务端规则、会话与封包 | [Server](../repos/happyro-server/docs/README.md) |
| 资源、代理与会话 Cookie | [Gateway](../repos/happyro-gateway/docs/README.md) |
| 账号、资料与游戏控制 | [Admin](../repos/happyro-admin/docs/README.md) |
| 构建交付与最终验收 | [发布流程](operations/docker-release.md)、[验收清单](operations/release-checklist.md) |

## 按任务查找

- 首次安装：[本地开发](development/workflow/local-setup.md)。
- 更新并确认浏览器拿到新版本：[服务更新](operations/services.md#修改后的更新路径)。
- 游戏断线、技能不能释放、中文没生效：[故障检查](operations/troubleshooting.md)。
- 发布镜像：[强制发布规则](operations/docker-release.md)。
- 清理目录或迁移主机前：[备份与恢复](operations/backup-recovery.md)。
- 新增或修改文档：[文档维护](development/workflow/documentation.md)。
- 更换 README 地图、角色或截图：[README 图片制作](development/readme-images/README.md)。

文档中的“当前源码”依据仓库实现；带日期的主机观察和测试计数不代表当前状态。`work/runtime` 中的数据库和密钥不能当缓存清理。本文档审查不代表已发布新镜像或重新执行所有产品测试。

## 公开使用文档

面向玩家、服主和外部贡献者的使用说明统一维护在 [HappyRO 文档站](https://happyro.kugarocks.com/guide/quick-start)。本目录保留实现设计、内部维护流程与验收记录，不复制公开教程正文。

- [玩家指南](https://happyro.kugarocks.com/game/)与[转职攻略](https://happyro.kugarocks.com/strategy/job-change/)
- [安装运维](https://happyro.kugarocks.com/deploy/)与[管理后台](https://happyro.kugarocks.com/admin/)
- [公开开发指南](https://happyro.kugarocks.com/development/)

文档站新增专题后，根 README 在相关功能段落补链接；更新日志和主页宣传图片仍以根仓库为来源。站点维护规则见 [happyro-doc README](../repos/happyro-doc/README.md)。
