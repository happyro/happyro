# kRO 翻译断点

状态：agent 阶段和正式合并已完成，等待运行资源发布与整体验收（2026-08-25）。

- 清单：`docs/translation/zh-cn/kro-20211105/manifest.tsv`（冻结分配基线）
- 实际状态：八个 agent manifest 共 177 个终态工作单元，176 个已翻译、1 个跳过
- 正式合并：`docs/translation/zh-cn/kro-20211105/merged/`
- 回编译：Lua 5.0/5.1 共 11 个 LUB 已通过语义回环
- 当前工作：明确 LUB 和直接文本的运行覆盖目录，发布后完成客户端渲染验收
- 官方 kRO 源文件：未修改

恢复工作时先读取 `progress.md`、`merged/manifest.tsv`、`status/recompile.tsv` 和 [`../../WORKFLOW.md`](../../WORKFLOW.md)，不要重新分配已完成的 agent 工作单元。
