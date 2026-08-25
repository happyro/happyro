# kRO 2021-11-05 汉化进度

## 当前状态

- 工作单元总数：177
- 已翻译：177
- 跳过：0
- 阻塞：0
- 待处理：0
- Agent 进度：100%（177 / 177 已完成校验）
- 正式 merged：本批次为 `canonical-20260825-01`，111 个原保护 token 失败的工作单元已恢复中文候选，另 1 个 `tipOfTheDay.txt.full` 已恢复 CP949 编码并完成中文简译，全部通过 chunks/merged 校验。
- LUB 回编译：Lua 5.0 的 1 个目标和 Lua 5.1 的 10 个目标已构建并通过逐值语义回环。
- 剩余工作：完成整套 kRO 翻译资源的客户端渲染验收。

## Agent 汇总

| Agent | 已翻译 | 跳过 | 阻塞 | 总计 | 状态 |
| --- | ---: | ---: | ---: | ---: | --- |
| agent-01 | 23 | 0 | 0 | 23 | 完成校验 |
| agent-02 | 22 | 0 | 0 | 22 | 完成校验 |
| agent-03 | 22 | 0 | 0 | 22 | 完成校验 |
| agent-04 | 22 | 0 | 0 | 22 | 完成校验 |
| agent-05 | 22 | 0 | 0 | 22 | 完成校验 |
| agent-06 | 22 | 0 | 0 | 22 | 完成校验 |
| agent-07 | 22 | 0 | 0 | 22 | 完成校验 |
| agent-08 | 22 | 0 | 0 | 22 | 完成校验 |
| 合计 | 177 | 0 | 0 | 177 | 完成校验 |

## 状态来源

- 工作单元状态以八个 `agents/agent-xx/manifest.tsv` 为准。
- 合并文件及来源以 `merged/manifest.tsv` 为准。
- 回编译结果以 `status/recompile.tsv` 和 `artifacts/client/lub/manifest-lua*.tsv` 为准。
- 根 `manifest.tsv` 是冻结分配基线，保留初始状态，不用作完成度统计。

完成条件和后续发布步骤见 [`../WORKFLOW.md`](../WORKFLOW.md)。
