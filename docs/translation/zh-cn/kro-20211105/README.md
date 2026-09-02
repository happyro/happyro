# kRO 2021-11-05 汉化工作区

本目录是 kRO 2021-11-05 官方客户端资源的独立汉化工作区。八个专用 `agent-xx` 已完成全部工作单元；不可变官方源文件位于 `inputs/official/`，`inputs/runtime/kro-20211105/client/` 是允许发布已校验翻译产物的运行目录。本目录保存清单、提取结果、译文切片、完整合并结果和状态记录。

本工作区在端到端流程中的位置、repair 回路、正式产物晋级和回编译要求见 [`../WORKFLOW.md`](../WORKFLOW.md)。

## 入口文件

- `manifest.tsv`：冻结的翻译工作单元分配基线。每个直接文件或切片占一行，根清单状态保持 `待处理`；实际进度记录在对应 `agents/agent-xx/manifest.tsv`，状态只能使用 `待处理`、`进行中`、`已翻译`、`跳过`、`阻塞`。
- `progress.md`：整个 kRO 目录的汇总进度，按专用清单统计。
- `inventory.md`：扫描范围、文件分类和 LUB 处理说明。
- `source-files.tsv`：全部候选源文件的分类清单，包括跳过项。
- `status/extracted-files.tsv`：LUB 源文件、提取输出、翻译范围和排除原因的映射。
- `terms-names.csv`：本目录新增术语、人名和保留项，后续并入总术语表。
- `status/checkpoint.md`：暂停或切换 agent 前的恢复断点。
- `status/recompile.tsv`：LUB 版本、提取和回编译状态。
- `artifacts.md`：当前客户端编译产物、哈希、语义校验和运行时发布状态。
- `LUB-EXTRACTION.md`：Playwright LUB 提取器的重现、比较和维护说明。
- `merged/`：各 agent 译文切片合并后的完整文件，经过确认后纳入 Git 管理。

## 工作区布局

```text
baseline/
├── text/source/       直接文本基准
└── lub/source/        Playwright 提取的 JSON 基准

agents/agent-01/ 至 agents/agent-08/
├── manifest.tsv       本 agent 的 kRO 工作单元
├── chunks/source/     本 agent 的源切片
└── chunks/translated/ 本 agent 的译文切片

merged/
├── README.md          合并文件和回写约定
├── manifest.tsv       完整文件与分片来源的对应关系
├── files/             按目标源文件相对路径保存的完整合并文件
└── validation/        已确认的合并和格式校验记录
```

LUB 的目录名与源表名保持一致，切片范围以 `manifest.tsv` 为准。超过 200 行的直接文本按原始物理行切片；提取 JSON 先规范化为一条顶层记录一行，再按最多 200 个物理行切片。翻译只处理玩家可见字段；ID、键名、变量、奖励、导航、颜色码、占位符、脚本和控制流保持原样。

本轮 kRO 切片位于本目录的 `agents/agent-01/` 至 `agents/agent-08/`。每个 agent 只修改自己对应的 `chunks/translated/`，不得跨 agent 编辑。

## 当前状态

- 直接 CP949 文本：3 个候选均已处理并进入正式 merged，其中 `tipOfTheDay.txt.full` 已恢复编码并完成中文简译。
- 提取器覆盖 19 个 LUB 目标；其中 11 个输出含可翻译玩家可见字段，已拆为 174 个 JSON 工作单元。
- 177 个工作单元全部终态：177 个已翻译，0 个跳过，0 个阻塞。
- Lua 5.0 和 Lua 5.1 回编译已经通过语义回环，产物已写入运行目录；仍需完成客户端渲染验收。翻译和构建期间不修改官方源材料。

## 分片合并与回写

合并前的临时结果写入 `work/translation-release/kro-20211105/<batch>/`，其中的 `merged/files/`、`manifest.tsv`、`validation/` 和 Lua 编译产物由发布工具生成。校验通过后，使用 `--promote-merged --write` 将完整文件、manifest、BATCH_STATE 和验证记录晋级到本目录的 `merged/`；该目录是整个 kRO 工作区的 Git 跟踪合并结果，不再按 agent 拆分。

后续回写或回编译脚本以 `merged/files/` 为输入，生成到批次 `artifacts/` 或通过发布工具明确写入运行时资源目录。运行时发布使用 `--runtime-root inputs/runtime/kro-20211105/client`，只允许写入已通过编译和语义校验的产物，并由批次备份、日志和目标哈希记录；`inputs/official/` 始终保持只读。

本批次已完成晋级并标记为关闭，状态见 [`merged/BATCH_STATE`](merged/BATCH_STATE)。关闭批次只作为历史翻译快照；后续修复应创建新的 canonical 批次。

Lua 5.0 和 Lua 5.1 回编译工具及目标 ABI 说明见 [`tools/client/build/README.md`](../../../../tools/client/build/README.md)。

合并工具的完整说明见 [`tools/translation/README.md`](../../../../tools/translation/README.md)。

## LUB 提取工具

长期保留的 Playwright 提取器位于 [`tools/client/extract/lua51/playwright/main.mjs`](../../../../tools/client/extract/lua51/playwright/main.mjs)。它使用客户端自带的 `wasmoon-lua5.1.js` 和本地 `liblua5.1.wasm`，并复原任务、道具、成就、推荐任务、提示框、消息、地图、城镇等客户端加载规则。提取结果写入 `work/lub-reextract/`；不得直接覆盖 `baseline/lub/source/` 中的基准结果。

完整运行和一致性比较步骤见 [`LUB-EXTRACTION.md`](LUB-EXTRACTION.md)。

切片和清单一致性检查：

```bash
node tools/workspace/validate-kro/main.mjs
```

按 `manifest.tsv` 分配不重叠的工作单元；每个 agent 只写自己的译文切片和进度记录，主进度在合并后统一更新。
