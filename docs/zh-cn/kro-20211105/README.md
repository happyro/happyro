# kRO 2021-11-05 汉化工作区

本目录是 kRO 2021-11-05 官方客户端资源的独立汉化工作区，当前由八个专用 `agent-xx` 目录并行处理。官方源文件位于 `inputs/runtime/kro-20211105/client/`，只读；本目录只保存清单、提取结果、译文切片和状态记录。

## 入口文件

- `manifest.tsv`：唯一的翻译工作单元清单。每个直接文件或切片占一行，状态只能使用 `待处理`、`进行中`、`已翻译`、`跳过`、`阻塞`。
- `progress.md`：整个 kRO 目录的汇总进度，按专用清单统计。
- `inventory.md`：扫描范围、文件分类和 LUB 处理说明。
- `source-files.tsv`：全部候选源文件的分类清单，包括跳过项。
- `status/extracted-files.tsv`：LUB 源文件、提取输出、翻译范围和排除原因的映射。
- `terms-names.csv`：本目录新增术语、人名和保留项，后续并入总术语表。
- `status/checkpoint.md`：暂停或切换 agent 前的恢复断点。
- `status/recompile.tsv`：LUB 版本、提取和回编译状态。
- `LUB-EXTRACTION.md`：Playwright LUB 提取器的重现、比较和维护说明。

## 工作区布局

```text
workspace/
├── text/source/       直接文本基准
└── lub/source/        Playwright 提取的 JSON 基准

agent-01/ 至 agent-08/
├── manifest.tsv       本 agent 的 kRO 工作单元
├── chunks/source/     本 agent 的源切片
└── chunks/translated/ 本 agent 的译文切片
```

LUB 的目录名与源表名保持一致，切片范围以 `manifest.tsv` 为准。超过 200 行的直接文本按原始物理行切片；提取 JSON 先规范化为一条顶层记录一行，再按最多 200 个物理行切片。翻译只处理玩家可见字段；ID、键名、变量、奖励、导航、颜色码、占位符、脚本和控制流保持原样。

本轮 kRO 切片位于本目录的 `agent-01/` 至 `agent-08/`。每个 agent 只修改自己对应的 `chunks/translated/`，不得跨 agent 编辑。

## 当前边界

- 直接 CP949 文本：3 个文件，已分配为待处理工作单元，尚未写回官方资源。
- 提取器覆盖 19 个 LUB 目标；其中 11 个输出含可翻译玩家可见字段，已拆为 89 个 JSON 工作单元。
- 当前总计 92 个工作单元，分配为 agent-01 至 agent-08（12、12、12、12、11、11、11、11 个）。
- Lua 5.0 回编译和 CP949 中文编码仍是独立的集成阻塞项；翻译期间不修改官方源文件。

## LUB 提取工具

长期保留的 Playwright 提取器位于仓库根目录的 [`tools/extract-lub-playwright.mjs`](../../../tools/extract-lub-playwright.mjs)。它使用客户端自带的 `wasmoon-lua5.1.js` 和本地 `liblua5.1.wasm`，并复原任务、道具、成就、推荐任务、提示框、消息、地图、城镇等客户端加载规则。提取结果写入 `work/lub-reextract/`；不得直接覆盖 `workspace/lub/source/` 中的基准结果。

完整运行和一致性比较步骤见 [`LUB-EXTRACTION.md`](LUB-EXTRACTION.md)。

切片和清单一致性检查：

```bash
node tools/validate-kro-workspace.mjs
```

按 `manifest.tsv` 分配不重叠的工作单元；每个 agent 只写自己的译文切片和进度记录，主进度在合并后统一更新。
