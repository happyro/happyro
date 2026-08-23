# kRO 2021-11-05 汉化工作区

本目录是 kRO 2021-11-05 官方客户端资源的独立汉化工作区，服务于后续拆分为 `agent-xx` 并行工作。官方源文件位于 `inputs/runtime/kro-20211105/client/`，只读；本目录只保存清单、提取结果、译文切片和状态记录。

## 入口文件

- `manifest.tsv`：唯一的翻译工作单元清单。每个直接文件或切片占一行，状态只能使用 `待处理`、`进行中`、`已翻译`、`跳过`、`阻塞`。
- `progress.md`：整个 kRO 目录的汇总进度，按 `manifest.tsv` 工作单元统计。
- `inventory.md`：扫描范围、文件分类和 LUB 处理说明。
- `source-files.tsv`：全部候选源文件的分类清单，包括跳过项。
- `terms-names.csv`：本目录新增术语、人名和保留项，后续并入总术语表。
- `status/checkpoint.md`：暂停或切换 agent 前的恢复断点。
- `status/recompile.tsv`：LUB 版本、提取和回编译状态。
- `LUB-EXTRACTION.md`：Playwright LUB 提取器的重现、比较和维护说明。

## 工作区布局

```text
workspace/
├── text/source/       直接文本的只读工作切片
├── text/translated/   直接文本译文切片
└── lub/
    ├── source/        Playwright 提取的原始 JSON 和全量表
    ├── translated/    LUB 翻译切片
    └── metadata/      提取辅助清单
```

LUB 的目录名与源表名保持一致，切片范围以 `manifest.tsv` 为准。翻译只处理玩家可见字段；ID、键名、变量、奖励、导航、颜色码、占位符、脚本和控制流保持原样。

## 当前边界

- 直接 CP949 文本：3 个文件已完成工作译文，但尚未写回官方资源。
- 已用 Lua 5.1 浏览器运行时提取：8 个 LUB 文件；已建立可翻译切片。
- Lua 5.0 文件、LUB 回编译和 CP949 中文编码仍是独立的集成阻塞项。
- 当前不提交、不推送，也不修改官方源文件。

## LUB 提取工具

长期保留的 Playwright 提取器位于仓库根目录的 [`tools/extract-lub-playwright.mjs`](../../../tools/extract-lub-playwright.mjs)。它使用客户端自带的 `wasmoon-lua5.1.js` 和本地 `liblua5.1.wasm`，并复原 `itemInfo_true`、`OngoingQuestInfoList`、成就、推荐任务和提示框的客户端加载规则。提取结果写入 `work/lub-reextract/`；不得直接覆盖 `workspace/lub/source/` 中的基准结果。

完整运行和一致性比较步骤见 [`LUB-EXTRACTION.md`](LUB-EXTRACTION.md)。

后续改造成 `agent-xx` 模式时，按 `manifest.tsv` 分配不重叠的工作单元；每个 agent 只写自己的译文切片和记录，主进度在合并后统一更新。
