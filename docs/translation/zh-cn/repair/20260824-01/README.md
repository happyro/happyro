# 合并问题修复批次

本目录用于修复 `batch-20260824` 合并结果中发现的分片问题。12 个 agent 目录相互独立；每个 agent 只修改自己的 `fixed/`，完成后更新自己的 `manifest.tsv` 和 `progress.md`。

本批次是 [`../../WORKFLOW.md`](../../WORKFLOW.md) 中的条件 repair 回路。`fixed/` 不是最终维护源；协调者必须把已确认结果回填对应工作区 translated 分片，再从 chunks 校验阶段重新执行。

## 最终状态

- 263 个工作单元全部终态：152 个“已修复”、110 个“已完成”、1 个“确认无误”。
- 12 个 agent 共生成 262 个 fixed 文件；“确认无误”项不生成替换文件。
- 修复结果已收集到 `work/translation-merge/repair-20260824-01-run3/` 并重新合并。
- run3 的 client-server 合并后检查四组均为 `Errors: 0`；最终 kRO merged 检查八组均为 `Errors: 0`。
- 当前规范 translated 分片在后续 bugfix 中继续演进，不能再用 fixed 副本哈希判断当前内容；后续运行以原工作区 agent 分片为维护源。

分片源文件和当前译文仍从原工作区只读引用，不修改原有 `agents/agent-xx/`。所有 agent 完成后，再统一收集 `fixed/`、重新运行校验和合并。

## Agent 规则

- 只处理自己的目录和 `manifest.tsv` 中列出的分片。
- `source_file`、`current_file` 和原工作区文件只读。
- 修复结果写入 `fixed_file`，不得直接覆盖原译文分片。
- 同一分片不得产生第二份修复结果；无法判断时将状态设为 `阻塞`。
- `U+FFFD`、真实占位符、非法颜色码和 JSON 结构问题不能用删除校验的方式规避。
- 行数变化本身不是错误，除非改变了结构或逻辑。

## 状态

```text
待处理  进行中  已修复  确认无误  阻塞
```

`manifest.tsv` 是每个 agent 的独立任务清单；没有运行中的总调度器。最终合并前只需确认 12 份清单中的任务都处于终态，且 `target_file` 没有重复。

## 最终收集

本批协调者将所有 `fixed/` 收集并应用到 run3 临时译文基线，依次执行：

```text
validate chunks
merge --dry-run
merge
validate merged / validate-kro
```

确认通过后，修复内容回到原工作区 translated 分片；正式 merged 的晋级状态分别见两个工作区的 `merged/README.md`。

## 本次静态分配

- 内容问题工作单元：263
- 总工作量权重：2200.82
- 分配算法：按权重从大到小，依次放入当前总权重最低的 agent。
- 行数变化、清单重复登记和合并后结构候选未放入本批次内容修复清单，待内容修复后重新生成报告。

| Agent | 工作单元 | 权重 | client-server | kRO |
| --- | ---: | ---: | ---: | ---: |
| agent-01 | 22 | 183.23 | 14 | 8 |
| agent-02 | 22 | 183.69 | 15 | 7 |
| agent-03 | 22 | 183.30 | 14 | 8 |
| agent-04 | 22 | 184.11 | 13 | 9 |
| agent-05 | 22 | 184.19 | 14 | 8 |
| agent-06 | 21 | 180.23 | 14 | 7 |
| agent-07 | 22 | 183.22 | 14 | 8 |
| agent-08 | 22 | 183.23 | 14 | 8 |
| agent-09 | 22 | 183.22 | 13 | 9 |
| agent-10 | 22 | 184.18 | 14 | 8 |
| agent-11 | 22 | 184.19 | 14 | 8 |
| agent-12 | 22 | 184.03 | 13 | 9 |
