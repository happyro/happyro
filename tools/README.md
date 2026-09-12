# tools

构建器、解析器、生成器和底层工具。运维入口在 `scripts/`。

| 目录 | 用途 |
| --- | --- |
| [client/](client/README.md) | LUB 提取与回编译 |
| [resources/](resources/README.md) | 物品 / 魔物目录生成 |
| [translation/](translation/README.md) | 历史翻译分片的合并、校验和回写 |
| `workspace/` | kRO 工作区清单校验 |
| `generate-npc-catalog.mjs` | 版本化 NPC 目录 |

生成物写入 `work/` 或产品仓库资源目录，不把工具输出当作文档。
