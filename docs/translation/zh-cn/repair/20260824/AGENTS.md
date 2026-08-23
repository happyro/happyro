# 合并问题修复批次规则

- 本批次包含 12 个相互独立的 agent 目录。
- agent 只能修改自己目录内的 `fixed/`、`manifest.tsv` 和 `progress.md`。
- 官方源文件、原工作区分片和其他 agent 目录均为只读。
- 不直接修改 `docs/translation/zh-cn/client-server/agents/` 或 `kro-20211105/agents/`。
- 不把完整合并文件放入 agent 目录；完整文件由最终收集阶段生成。
- 不提交、不推送；由协调者在全部修复并验证后统一处理。

