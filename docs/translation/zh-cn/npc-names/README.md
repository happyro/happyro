# NPC 名称翻译

本目录维护 HappyRO 常用城镇 NPC 名称的独立中文翻译计划。它只处理玩家可见的 NPC 名称，不承接 NPC 对话、选项、任务文本或 kRO 客户端资源的全量翻译。

## 文档

- [plan.md](plan.md)：范围、阶段和翻译规则
- [progress.md](progress.md)：地图批次和验收进度
- [terms-names.csv](terms-names.csv)：NPC 名称术语表
- [batches/core-towns.md](batches/core-towns.md)：核心六城第一批范围
- NPC 初始名称包的客户端本地化原因和验收方式见 [`../../../bugfix/zh-cn/20260825/client-npc-name-display.md`](../../../bugfix/zh-cn/20260825/client-npc-name-display.md)。

## 维护边界

- 服务端 NPC 名称的真实维护源是 `repos/happyro-server/npc/`。
- `#` 后的内部唯一标识必须保留，不翻译、不删除。
- 隐藏脚本、函数名、测试 NPC 和内部占位项不纳入玩家可见名称翻译。
- 翻译完成后必须编译服务端，并在对应地图检查名称、导航和 NPC 对话入口。
- 本目录不保存生成源码、临时合并结果或构建产物。
