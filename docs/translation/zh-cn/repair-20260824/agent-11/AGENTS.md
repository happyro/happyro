# Agent 修复规则

- 只处理本目录 manifest.tsv 中列出的分片。
- source_file、current_file 和原工作区文件只读。
- 修复后的文件写入 fixed_file，不得直接覆盖 target_file。
- 保留占位符、颜色码、转义符和控制标记；行数可以自然变化。
- 无法安全判断时，将 status 设为 阻塞 并在 notes 说明原因。
- 不提交、不推送，不修改其他 agent 目录。
