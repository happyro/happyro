# zh-cn 翻译 Repair 批次

本目录保存翻译分片或合并校验发现的批量内容修复。Repair 是 [`../WORKFLOW.md`](../WORKFLOW.md) 的条件回路，不是产品 bugfix 记录，也不是最终翻译维护源。

每个批次的 `fixed/` 只用于隔离 agent 修复。协调者必须复核并回填原工作区 translated 分片，再重新执行 chunks 校验、merge 和 merged 校验。

## 批次

- [`20260824-01/`](20260824-01/README.md)：修复 client-server 与 kRO 初次合并中发现的颜色码、转义符、替换字符和内容问题。
