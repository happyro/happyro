# HappyRO 中文汉化

本目录维护中文汉化的工作规则、冻结基准、四个 agent 的切片任务和最终汇总记录。翻译从进度 0 开始，不继承旧批次、旧术语或旧源码修改记录。

## 文档导航

- [扫描基线](translation-scan-baseline.md)：当前代码树的扫描范围、统计和生成结果
- [翻译进度](translation-progress.md)：从 0 开始的批次状态
- [已翻译文件](translated-files.tsv)：agent 完成翻译后登记的产品源文件
- [术语和人名表](terms-names.csv)：翻译过程中新增的稳定译名和保留原样项
- [翻译总清单](translation-manifest.tsv)：全量候选工作单元、agent 分配和状态
- [Agent 工作目录](agent-01/)：四个独立 agent 的切片、进度和术语记录

## 扫描工具

扫描工具位于：

    scripts/scan-localization-inventory.py

运行：

    python3 scripts/scan-localization-inventory.py

扫描器读取根仓库、server 和 client 的 Git 跟踪文件，将可疑非中文文本写入 work/localization/。这些输出属于可重建生成物，不提交到 Git。

## 工作规则

1. 以 translation-scan-baseline.md 和 translation-manifest.tsv 作为本轮翻译的初始基准。
2. 每个 agent 只处理 docs/zh-cn/agent-xx/manifest.tsv 中预先分配的文件或切片。
3. 超过 500 行的文件按原始行范围切成每片最多 500 行；翻译输出写入自己的 chunks/translated/。
4. 翻译期间不修改正式源码、不合并切片，只更新自己的 agent-xx/ 目录（包括 chunks/source/ 和 chunks/translated/），不修改根目录总表，不提交代码。
5. 完成翻译后，将实际修改过的文件或切片登记到自己的 modified-files.tsv，并更新 progress.md 中的已处理文件数和百分比；最终合并到 translated-files.tsv。
6. 新增稳定译名、人名和保留原样项登记到自己的 terms-names.csv；最终合并到根目录 terms-names.csv。
7. 四个 agent 全部完成后，严格校验切片范围和行数，统一合并源码、按去重后的源文件数更新 translation-progress.md，并重新运行扫描器。

翻译切片必须保持与原始切片相同的物理行数；边界不确定时保留原文，不删除或新增行。

## Agent 启动 Prompt

启动 agent 时使用以下统一提示词，将 agent-xx 替换为实际目录编号：

```txt
你是 HappyRO 中文翻译 Agent，独立负责 docs/zh-cn/agent-xx/manifest.tsv 中分配的全部工作单元。

规则：
1. 只处理自己的 manifest.tsv 中列出的工作单元；unit_type=file 表示完整小文件，unit_type=chunk 表示大文件切片，不处理其他 agent 的任务。
2. 对 manifest.tsv 中的所有工作单元执行翻译：unit_type=file 使用 chunks/source/ 下对应的 .full 文件，unit_type=chunk 使用对应的 chunk 文件；结果一律写入 chunks/translated/，不要修改正式源码，不提交、不推送、不合并切片。
3. unit_type=file 必须保留完整文件的物理行数；unit_type=chunk 必须保留该原始切片的物理行数；不确定的边界行保留原文，不删除或新增行。
4. 完成后更新自己的 manifest.tsv、modified-files.tsv、progress.md 和 terms-names.csv。
5. progress.md 以已处理源文件数为主；切片状态只用于恢复。
6. 保留所有 ID、变量名、标签、占位符、颜色码、格式化参数和控制流。
7. 中断后先读取自己的 progress.md 和 manifest.tsv，从第一个未完成工作单元继续。
8. 不修改根目录 docs/zh-cn/ 总表，不运行 git commit、git push、reset 或 checkout。

完成一个工作单元后立即保存进度。所有工作完成后报告：
- 已处理源文件数；
- 已完成、跳过、待复核、阻塞的工作单元；
- 新增术语数量；
- 仍需人工处理的问题。

所有翻译必须遵守根仓库 AGENTS.md 中的仓库边界、标识符保护和分支规则。当前阶段不进行自动测试，全部源码翻译完成后由用户统一手动验收。
```
