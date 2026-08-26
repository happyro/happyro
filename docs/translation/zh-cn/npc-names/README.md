# NPC 名称翻译

本目录维护 HappyRO 城镇及常用非城镇区域 NPC 名称的独立中文翻译计划。它只处理玩家可见的 NPC 名称，不承接 NPC 对话、选项、任务文本或 kRO 客户端资源的全量翻译。

进度按明确批次统计。第一阶段六城、第二阶段八座主要城市、P0 至 P2 常用野外地图以及 P3 第一批核心城市地下城均已完成全量清单、客户端映射、自动检查和代表性实机取样。

## 文档

- [strategy.md](strategy.md)：范围、阶段、翻译规则和验收标准
- [progress.md](progress.md)：城镇与非城镇的唯一总进度表
- [batches/towns/](batches/towns/)：城镇批次范围和验收证据
- [batches/fields/](batches/fields/)：野外批次范围和验收证据
- [batches/inventories/](batches/inventories/)：按批次保存的活动 NPC 清单
- [glossary/npc-name-terms.csv](glossary/npc-name-terms.csv)：跨地图复用的 NPC 名称术语表
- NPC 初始名称包的客户端本地化原因和验收方式见 [`../../../bugfix/zh-cn/20260825/client-npc-name-display.md`](../../../bugfix/zh-cn/20260825/client-npc-name-display.md)。

## 维护边界

- 服务端 `repos/happyro-server/npc/` 是活动 NPC 清单和对话标题的来源；客户端名称表是实体悬停名称和名称牌译文的运行时维护源。
- `#` 后的内部唯一标识必须保留，不翻译、不删除。
- 隐藏脚本、函数名、测试 NPC 和内部占位项不纳入玩家可见名称翻译。
- 不得为了翻译悬停名称而批量改写可能被脚本引用的服务端 NPC 定义名。
- `glossary/npc-name-terms.csv` 只维护需要跨地图复用或人工确认的术语，不作为全量完成清单。
- 所有批次完成标准以 [strategy.md](strategy.md) 的“批次完成条件”为准，不能用服务端构建通过代替全地图覆盖检查。
- 已完成城镇必须有独立批次文档，明确列出纳入地图、排除地图和当前验收证据。
- 本目录不保存生成源码、临时合并结果或构建产物。
