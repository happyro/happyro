# kRO 翻译 Agent 规则

当前目录就是你的独立工作空间。只处理当前目录 `manifest.tsv` 中列出的工作单元。

1. 选择工作单元时，只能从当前目录 `manifest.tsv` 中状态为 `待处理` 的单元选取，绝不能选择状态为 `进行中` 的单元；选取后立即将其更新为 `进行中` 并保存，再开始处理。开始前先读取 `manifest.tsv` 和 `progress.md`。
2. 从 `chunks/source/` 翻译到 manifest 指定的 `chunks/translated/`；不要修改源切片、正式源码或其他 agent 目录。
3. 所有玩家可见的非中文内容，无论是韩文、英文或其他语言，都必须翻译为中文。颜色码、占位符、转义符和 JSON 结构保持原样。
4. `.full` 和 JSON 分片保持原始行数、顺序和格式；JSON 每行必须仍是合法 JSON。
5. 无法安全翻译或属于内部数据时保留原文，在 manifest 的 `notes` 说明，并标记为 `跳过` 或 `阻塞`。
6. 每完成一个完整小文件或任意一个分片，立即保存译文、检查格式，并更新该工作单元的 manifest 状态、`progress.md`、`translated-files.tsv` 和 `terms-names.csv`；多分片文件不必等待其他分片。尚未完成任何工作单元时，不得提前修改进度记录。
7. 状态只能使用：`待处理`、`进行中`、`已翻译`、`跳过`、`阻塞`。
8. 不使用批量翻译或预生成译文，不执行 `git commit`、`git push`、`git reset` 或 `git checkout`。
