# HappyRO zh-cn 修复归档（20260825）

本目录记录 2026-08-25 完成但尚未提交的简体中文修复，以及此前已提交但需要追溯源头的服务端数据修复。它是 `zh-cn` 专属归档：问题现象、译文、覆盖表和验收标准都针对简体中文；其中编码、资源路由和 UI 生命周期等实现方法可以复用于其他语言，但不能直接视为所有语言的共同产物。

本批次在翻译端到端流程中的位置和源头回修要求见 [`../../../translation/zh-cn/WORKFLOW.md`](../../../translation/zh-cn/WORKFLOW.md)。本目录是缺陷记录，不取代翻译分片、目标源码或部署配置。

`work/` 与 `artifacts/` 只保存中间结果和验证证据，不是维护源。官方输入 `inputs/official/`、`inputs/runtime/kro-20211105/` 保持只读。

## 文档索引

| 文档 | 内容 |
| --- | --- |
| [change-inventory.md](change-inventory.md) | 工作树边界、文件归属、生成物与待确认改动 |
| [translation-writeback.md](translation-writeback.md) | 翻译源、合并、回写以及源头同步规则 |
| [client-static-localization.md](client-static-localization.md) | 客户端静态表和界面本地化 |
| [client-mail-lifecycle.md](client-mail-lifecycle.md) | 客户端邮件窗口生命周期 |
| [client-signboard-localization.md](client-signboard-localization.md) | NPC 头顶标牌的本地化来源与覆盖规则 |
| [client-monster-name-localization.md](client-monster-name-localization.md) | 魔物悬停名称的本地化来源与回退规则 |
| [client-npc-name-display.md](client-npc-name-display.md) | NPC 初始实体名称包与对话标题不一致 |
| [server-runtime.md](server-runtime.md) | MOTD、服务端数据和数据库重建判断 |
| [resources-and-gateway.md](resources-and-gateway.md) | 装备图片、编码路径、AI 和资源网关 |
| [build-and-environment.md](build-and-environment.md) | 需要重新构建或重启的环境 |
| [validation.md](validation.md) | 单测、构建、HTTP 和浏览器审计结果 |
| [commit-plan.md](commit-plan.md) | 后续按逻辑拆分提交的建议，不代表已经提交 |

## 分类结论

| 类型 | 典型问题 | 是否属于翻译回写 | 是否需要数据库重建 |
| --- | --- | --- | --- |
| 翻译源与静态文案 | 地图名、职业名、按钮文案 | 是，需同步分块与目标源码 | 否 |
| zh-cn 运行时覆盖 | 消息、称号、技能描述 | 否，覆盖文件本身是维护源 | 否 |
| 客户端运行逻辑 | 加载顺序、UTF-8、Rodex | 否 | 否 |
| 资源与网关 | 装备图、CP949 路径、AI | 否 | 否 |
| 服务端配置/数据 | MOTD、C_Persika YAML | MOTD 否；YAML 需修规范源 | 本批不需要 |

截至本归档建立时没有执行提交或推送。
