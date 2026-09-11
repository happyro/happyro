# HappyRO 架构文档

本目录记录跨客户端、服务端、网关和管理后台的长期架构约束。实现发生变化时，应同步更新对应文档，避免仅依赖 changelog 或源码推断当前设计。

## 文档

- [系统概览](system-overview.md)：四仓库职责，以及浏览器到 Gateway、Server、Admin 的调用关系。
- [仓库边界](repository-boundaries.md)：官方输入、运行目录、本地化源、脚本、工具和产物目录的职责。
- [运行时数据流](runtime-data-flow.md)：PWA、资源、封包、Web API 和 Game Control 的数据路径。
- [游戏资料目录](game-data-catalogs.md)：物品、魔物、地图、NPC 的权威来源与消费者。
- [本地化运行时](localization-runtime.md)：中文资源如何进入客户端，以及静态数据与服务器权威的边界。
- [世界图鉴与导航](world-catalog-navigation.md)：NPC、魔物、地图的统一实体模型和双入口职责。
- [客户端静态运行数据与 Lua 生命周期](client-static-runtime-data.md)：技能与导航静态生成、按需加载边界、AI Lua 生命周期。
