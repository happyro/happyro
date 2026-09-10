# 历史翻译工作区

本目录保存 2026-08 汉化批次的 Agent 分片、清单、进度和校验日志。它们不再作为 Client / Server 的回写源，也不再作为文档入口。

当前说明：

- 产品本地化：[docs/localization/](../../docs/localization/README.md)
- kRO 回编译输入：[localization/sources/kro-20211105/](../../localization/sources/kro-20211105/README.md)
- 工具命令：[tools/translation/README.md](../../tools/translation/README.md)

## 内容

| 路径 | 内容 |
| --- | --- |
| `zh-cn/client-server/` | 客户端与服务端源码翻译分片和当时的 merged |
| `zh-cn/kro-20211105/` | kRO 提取基准、Agent 分片和状态记录；正式 merged JSON 已迁出 |
| `zh-cn/npc-names/` | 城镇 NPC 名称批次记录 |
| `zh-cn/WORKFLOW.md` | 当时的端到端流程，路径以归档时为准 |

后续产品翻译直接修改对应仓库。需要重放历史批次时，把工具 `--root` 指到本目录。
