# 中文汉化进度

## 当前状态

- 状态：四个 agent 的工作单元全部进入终态；repair 和合并验证已完成，正式 `merged/` 已晋级并完成 writeback。
- 当前分支：`main`
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

## 已完成的协调工作

- 从 agent manifest 生成工作区根 `translated-files.tsv`，不能直接拼接不同 schema 的 agent 表。
- 合并 agent 术语表，去重并处理冲突后更新根 `terms-names.csv`。
- 当前正式基准为 `canonical-20260825-01`，重新合并 838 个文件，使用冻结基线完成 validate，并回写 client/server 与正式 merged；同时恢复 `fc9503e5` 当前提交中的 DBManager、地图和技能本地化逻辑，避免旧基线覆盖 bugfix。
- 回写后的三仓库抽样与全量 manifest 对照已完成：当前 client/server/vendor 中的 bugfix 维护源已恢复；正式 merged 的 836 个可对照文件与当前 client/server 一致，另有 1 个技能本地化文件仅存在换行/格式差异。旧 agent 分片仍保存回写前快照，下一轮翻译必须从当前仓库重新分片，不能继续把旧分片作为新基线。
- 已保存 chunks validate 和 merged validate；merged validate 为 `Errors: 0`，结构复核 finding 保留在 `merged/validation/merged-validate.log`。

## 保留的复核项

- `merged/validation/merge-warnings.tsv` 保留 587 条结构提示；这些提示来自合并器的非对白结构或保护标记检查，需按文件人工确认，不等同于合并失败。

完成条件和命令顺序见 [`../WORKFLOW.md`](../WORKFLOW.md)。
