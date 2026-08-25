# 中文汉化进度

## 当前状态

- 状态：四个 agent 的工作单元全部进入终态；repair 和临时合并验证已完成，正式 `merged/` 尚待晋级。
- 当前分支：`lang/zh-cn`
- 当前基准：[baseline.md](baseline.md)
- 扫描日期：2026-08-21
- 总源文件数：2,099
- 总原始行数：2,535,635
- 当前工作单元：6,494
- 已翻译工作单元：3,628
- 跳过工作单元：2,866
- 阻塞工作单元：0
- 待处理工作单元：0
- Agent 数量：4

工作单元总数比初始基线的 6,493 多 1，来自后续登记的 `SkillDescriptionLocalization.js` 完整文件。根 `manifest.tsv` 仍是冻结分配基线；实际最终状态以四个 agent 的 manifest 为准。

## Agent 汇总

| Agent | 已翻译 | 跳过 | 阻塞 | 总计 | 状态 |
| --- | ---: | ---: | ---: | ---: | --- |
| agent-01 | 943 | 681 | 0 | 1,624 | 完成 |
| agent-02 | 934 | 689 | 0 | 1,623 | 完成 |
| agent-03 | 816 | 808 | 0 | 1,624 | 完成 |
| agent-04 | 935 | 688 | 0 | 1,623 | 完成 |
| 合计 | 3,628 | 2,866 | 0 | 6,494 | 完成 |

## 尚未完成的协调工作

- 从 agent manifest 生成工作区根 `translated-files.tsv`，不能直接拼接不同 schema 的 agent 表。
- 合并 agent 术语表，去重并处理冲突后更新根 `terms-names.csv`。
- 从已验证临时批次晋级 `merged/files/`、`merged/manifest.tsv` 和验证记录。
- 对正式 merged 执行 dry-run writeback，并复核 client/server 目标 diff。

完成条件和命令顺序见 [`../WORKFLOW.md`](../WORKFLOW.md)。
