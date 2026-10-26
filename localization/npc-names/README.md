# NPC 名称归一化规则

`normalization.json` 记录首轮经过上下文审核的精确修改规则。`path`、`surface` 和内部名称／行号限定修改范围；`old`／`new` 用于检测源漂移与重复应用；`reason`／`evidence` 保存裁决依据。它不是运行时旧译别名层。

客户端完整名称的唯一运行来源是 `repos/happyro-client/src/DB/NpcNameTranslations.zh-CN.json`；通用职务使用中性译名，需要身份区别的实例在服务端使用显式显示名与稳定内部名。任务、导航资源按对应实体和任务 ID 同步，不能全局替换短人名。

根目录执行 `python3 tools/localization/npcs/normalize.py preview --no-color` 可检查规则是否仍匹配。明确使用 `apply` 才修改文件；先计算所有目标的变更并检查身份与可执行代码不变，再写回。仅允许规则中明确审核的两种表达式修复：复制 NPC 的对白标题读取当前显示名，以及身份比较改读稳定内部名；其余代码不可改变。规则不自动提交代码。

背景、范围和验证见 [NPC 名称审计计划](../../docs/development/npc-name-audit/README.md)与[执行记录](../../docs/development/npc-name-audit/execution.md)。

`resource-normalization.json` 记录任务、卡片和提示 JSON 的精确字段修改。卡片装备前缀按相同物品 ID 从已更新目录同步；已编译资源的源／目标哈希与安装备份保存在 `work/npc-name-audit/`，不修改官方输入材料。

`comprehensive-normalization.json` 保存后续全面复核的首批精确裁决；它和其他规则文件是对应阶段的修改依据，不是当前源码所有后续修改的完整重放脚本。源漂移报告需结合当前实体与后续审校记录核实，不应为通过旧规则检查而恢复旧译。当前范围、验证结果和保留问题以[全面复核](../../docs/development/npc-name-audit/comprehensive-review.md)为准。
