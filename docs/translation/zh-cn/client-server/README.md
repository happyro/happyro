# HappyRO 中文汉化

本目录维护中文汉化的工作规则、冻结基准、四个 agent 的切片任务和最终汇总记录。翻译从进度 0 开始，不继承旧批次、旧术语或旧源码修改记录。

本工作区在端到端流程中的位置、进入条件和完成条件见 [`../WORKFLOW.md`](../WORKFLOW.md)。

## 文档导航

- [扫描基线](baseline.md)：当前代码树的扫描范围、统计和生成结果
- [翻译进度](progress.md)：从 0 开始的批次状态
- [已翻译文件](translated-files.tsv)：agent 完成翻译后登记的产品源文件
- [术语和人名表](terms-names.csv)：翻译过程中新增的稳定译名和保留原样项
- [翻译总清单](manifest.tsv)：全量候选工作单元、agent 分配和状态
- [Agent 工作目录](agents/agent-01/)：四个独立 agent 的切片、进度和术语记录
- [完整合并结果](merged/README.md)：各 agent 分片合并后的 Git 跟踪文件和回写说明

## 扫描工具

扫描工具位于：

    scripts/localization/scan-localization-inventory.py

运行：

    python3 scripts/localization/scan-localization-inventory.py

扫描器读取根仓库、server 和 client 的 Git 跟踪文件，将可疑非中文文本写入 work/localization/。这些输出属于可重建生成物，不提交到 Git。

## 工作规则

- 以 baseline.md 和 manifest.tsv 作为本轮翻译的初始基准。
- 每个 agent 只处理 docs/translation/zh-cn/client-server/agents/agent-xx/manifest.tsv 中预先分配的文件或切片。
- 超过 500 行的文件按原始行范围切成每片最多 500 行；翻译输出写入自己的 chunks/translated/。
- 翻译期间不修改正式源码、不合并切片，只更新自己的 `agents/agent-xx/` 目录（包括 chunks/source/ 和 chunks/translated/），不修改工作区总表，不提交代码。
- 完成处理后，只将实际翻译完成的文件或切片登记到自己的 translated-files.tsv，并更新 progress.md 中的已处理文件数和百分比；最终合并到本工作区根目录的 translated-files.tsv。
- 新增稳定译名、人名和保留原样项登记到自己的 terms-names.csv；最终合并到本工作区根目录的 terms-names.csv。
- 四个 agent 全部完成后，先在 `work/translation-merge/client-server/<batch>/` 中严格校验切片范围、源内容和逻辑结构，统一生成完整文件；确认后将结果复制到 `merged/files/`，更新 `merged/manifest.tsv`，再重新运行扫描器。

## 分片合并与回写

本工作区的完整合并结果不放回任何 agent 目录。临时合并目录结构如下：

```text
work/translation-merge/client-server/<batch>/
└── merged/
    ├── manifest.tsv                    # 本次运行的来源和状态清单
    ├── files/                          # 本次运行的完整文件
    └── validation/merge-warnings.tsv   # 结构和标记复核项
```

确认后的长期文件结构如下：

```text
merged/
├── README.md
├── manifest.tsv
├── files/
│   ├── client/             # client 源文件的相对路径
│   └── server/             # server 源文件的相对路径
└── validation/             # 已确认的校验记录
```

`merged/files/` 是本工作区完整翻译文件的 Git 跟踪副本。后续回写脚本以此目录为输入，按清单将文件写入独立的 `repos/happyro-client`、`repos/happyro-server` 工作树或其他明确的目标目录；回写前仍需保留源文件、检查逻辑结构，并记录回写结果。

合并工具的完整说明见 [`tools/translation/README.md`](../../../../tools/translation/README.md)。

翻译切片的物理行数默认允许变化，只要合并后的非对白结构、标记、占位符和控制逻辑不受影响。合并器会记录行数变化并标记需复核的文件；如确需固定行数，可使用 `--strict-line-count`。

## Agent 启动 Prompt

启动 agent 时使用以下统一提示词，将 agent-xx 替换为实际目录编号：

```txt
你是 HappyRO 中文翻译 Agent，独立负责 docs/translation/zh-cn/client-server/agents/agent-xx/manifest.tsv 中分配的全部工作单元。

规则：
- 只处理自己的 manifest.tsv 中列出的工作单元；unit_type=file 表示完整小文件，unit_type=chunk 表示大文件切片，不处理其他 agent 的任务。
- 对 manifest.tsv 中的所有工作单元逐一独立翻译：unit_type=file 使用 chunks/source/ 下对应的 .full 文件，unit_type=chunk 使用对应的 chunk 文件；不得使用脚本、批量翻译或预生成翻译内容。
- 翻译结果一律手动写入对应的 chunks/translated/ 文件，不要修改正式源码，不提交、不推送、不合并切片。
- unit_type=file 和 unit_type=chunk 均以不改变非对白结构、标记、占位符和控制逻辑为准；物理行数可以变化。不确定的文本保留原文，并在 notes 中记录原因。
- 代码注释、变量名、函数名、标签、协议字段和代码逻辑不翻译；agent 必须自行判断并在 manifest.tsv 的 notes 中记录跳过原因。
- text_scope=unknown 必须结合文件内容完成分类，不得以 unknown 状态结束工作单元。
- 实际完成翻译的文件或 chunk 才能写入 translated-files.tsv；只跳过代码或内部内容的工作单元不写入该表。
- 完成后更新自己的 manifest.tsv、translated-files.tsv、progress.md 和 terms-names.csv。
- progress.md 按 manifest 工作单元计数：每一行 `file` 或 `chunk` 工作单元计为 1 个文件数，同一源文件的多个切片分别计数。已处理数 = 已翻译 + 跳过 + 阻塞；待处理数 = 待处理 + 进行中；进度 = 已处理数 / 分配工作单元数。
- 中断后先读取自己的 progress.md 和 manifest.tsv，从第一个未完成工作单元继续。
- 不修改根目录 docs/translation/zh-cn/client-server/ 总表，不运行 git commit、git push、reset 或 checkout。

完成一个工作单元后立即保存进度。所有工作完成后报告：
- 已处理源文件数；
- 已翻译、跳过、阻塞的工作单元；
- 新增术语数量；
- 仍需 agent 自行处理的问题。

所有翻译必须遵守根仓库 AGENTS.md 中的仓库边界、标识符保护和分支规则。agent 必须独立完成判断和翻译，不依赖人工逐项处理。
```
