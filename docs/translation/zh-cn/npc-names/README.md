# NPC 名称翻译

本目录维护 HappyRO 常用城镇 NPC 名称的独立中文翻译计划。它只处理玩家可见的 NPC 名称，不承接 NPC 对话、选项、任务文本或 kRO 客户端资源的全量翻译。

进度按“单个城镇全地图覆盖”统计。目前只有普隆德拉达到全地图已实现标准；其他核心城市已有部分名称译文，但仍属于部分覆盖。

## 文档

- [plan.md](plan.md)：范围、阶段和翻译规则
- [progress.md](progress.md)：地图批次和验收进度
- [terms-names.csv](terms-names.csv)：NPC 名称术语表
- [batches/core-towns.md](batches/core-towns.md)：核心六城第一批范围
- [batches/prontera.md](batches/prontera.md)：普隆德拉全地图范围和验收基准
- NPC 初始名称包的客户端本地化原因和验收方式见 [`../../../bugfix/zh-cn/20260825/client-npc-name-display.md`](../../../bugfix/zh-cn/20260825/client-npc-name-display.md)。

## 维护边界

- 服务端 `repos/happyro-server/npc/` 是活动 NPC 清单和对话标题的来源；客户端名称表是实体悬停名称和名称牌译文的运行时维护源。
- `#` 后的内部唯一标识必须保留，不翻译、不删除。
- 隐藏脚本、函数名、测试 NPC 和内部占位项不纳入玩家可见名称翻译。
- 不得为了翻译悬停名称而批量改写可能被脚本引用的服务端 NPC 定义名。
- `terms-names.csv` 只维护需要跨地图复用或人工确认的术语，不作为全量完成清单。
- 完成标准以 [plan.md](plan.md) 的“单城完成条件”为准，不能用服务端构建通过代替全地图覆盖检查。
- 已完成城镇必须有独立批次文档，明确列出纳入地图、排除地图和当前验收证据。
- 本目录不保存生成源码、临时合并结果或构建产物。
