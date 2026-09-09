# 客户端静态运行数据与 Lua 生命周期

## 目的

HappyRO 客户端将只读、版本固定的数据从运行时 LUB 执行迁移为构建时生成产物。目标是减少进入游戏前的请求、Lua 字节码执行和 WASM 实例数量，同时保证技能、导航和冒险工具使用同一份经过校验的数据。

本文记录 2026-09-09 完成的技能静态化、导航资源拆分和 AI Lua 延迟初始化。适用基线固定为 `PACKETVER=20211103`、Renewal 和 kRO 2021-11-05 客户端资源。

## 构建时数据链

官方 LUB 仍是只读输入，不在 `inputs/official/` 或 Gateway 运行目录中直接修改。提取工具通过 Lua 5.1 WASM 执行经过核验的字节码，将结果序列化为带源文件大小和 SHA-256 的快照：

- `localization/client/data/skill-runtime-source.json`：技能定义、职业技能树和职业继承关系；
- `localization/client/data/navigation-catalog-source.json`：地图、NPC、魔物名称和坐标目录；
- `localization/client/data/navigation-graph-source.json`：地图连接、连接距离和 NPC 距离。

提取入口为 `tools/client/extract/lua51/playwright/runtime-data.mjs --write`。它要求客户端 Vite 工具页可访问，并通过真实 Chromium 中的 Wasmoon Lua 5.1 执行 LUB。技能提取还以客户端的 `JobConst.js`、`SkillInfo.js` 和 `SkillTreeView.js` 为基础表，这三个文件同样记录大小和 SHA-256。任一输入内容发生变化后，必须重新提取并审查快照；生成器发现输入集合、大小、哈希或固定版本记录数量不一致时直接失败，不使用旧快照继续生成。

技能生成器 `scripts/resources/generate-skill-localization.mjs` 合并服务器技能数据库、完整中文目录和技能运行快照，生成：

- `SkillLocalizationTable.generated.js`：1767 条中文名称和说明；
- `SkillInfo.generated.js`：1572 条客户端运行时技能定义；
- `SkillTreeView.generated.js`：251 个职业技能树。

运行时所有技能消费者只导入生成模块，不再请求或执行 `skillinfolist.lub`、`skilltreeview.lub` 和 `jobinheritlist.lub`。中文条目缺失会在生成阶段失败；客户端不再保留把韩文替换成通用文案的兜底路径。

导航生成器 `scripts/resources/generate-navigation-data.mjs` 生成两个互相独立的 PWA JSON：

- `applications/pwa/data/navigation/catalog.json`；
- `applications/pwa/data/navigation/graph.json`。

两个生成器无参数运行时只显示帮助。写入和一致性检查必须显式执行：

```bash
node scripts/resources/generate-skill-localization.mjs --write
node scripts/resources/generate-skill-localization.mjs --check --no-color
node scripts/resources/generate-navigation-data.mjs --write
node scripts/resources/generate-navigation-data.mjs --check --no-color
```

## 运行时加载边界

### 普通角色启动

进入游戏时只创建一个数据库 Lua WASM 实例。技能和导航不再执行上述 9 个 LUB，也不会创建生命体或佣兵 AI VM。

### 导航目录

NavigationCatalog 在右上角导航真正显示，或 NPC、魔物、地图图鉴首次挂载时加载。客户端缓存同一个 Promise，右上角导航和冒险工具通过 `DBManager` 的统一查询接口共享规范化结果；失败请求会移出缓存，允许后续操作重试。

只打开导航、浏览图鉴或执行搜索不会加载 NavigationGraph。

### 寻路图

NavigationGraph 只在开始计算路线时加载并缓存。跨地图 Dijkstra 路线使用地图连接和距离；当前地图坐标寻路读取连接数据以标记和规避地图内 Warp。魔物导航记录只有出现地图而没有实时坐标，因此点击魔物只预览地图，不应触发 Graph；在当前地图选择坐标后才开始寻路。

### AI Lua

生命体与佣兵分别维护独立的初始化状态：

- 首次执行生命体 AI 时创建默认和自定义生命体 VM；
- 首次执行佣兵 AI 时创建默认和自定义佣兵 VM；
- 同类型的后续执行复用已经初始化的两个 VM；
- 初始化失败时释放已创建实例并保留失败状态，避免每个 AI tick 重复创建 WASM 和请求脚本；
- 生命体和佣兵可以独立重置，不会销毁另一类仍在运行的 VM；
- 重置会递增对应类型的生命周期代次，已取消的异步初始化即使稍后完成，也只会关闭自身实例，不会重新发布为可用状态；
- 全量重置 AI Driver 时关闭实例并清空两类状态。

因此普通角色为 1 个 VM；只出现一种 AI 实体时为 3 个；生命体和佣兵同时使用时最多恢复到 5 个。

## 性能基准

基准以改造前 Client `HEAD=a1de3c90` 和同一工作区构建配置比较。gzip 数值使用相同 `gzip -c` 方式计算，表示可压缩传输规模，不替代浏览器 Performance Trace。

| 指标 | 改造前 | 改造后 | 变化 |
| --- | ---: | ---: | ---: |
| `Online.js` 原始大小 | 13,988,923 B | 14,027,587 B | +38,664 B（+0.28%） |
| `Online.js` gzip | 2,814,359 B | 2,806,627 B | -7,732 B（-0.27%） |
| 启动阶段技能与导航 LUB | 9 个，5,380,121 B | 0 | 全部移除 |
| 上述 LUB gzip 合计 | 约 1,295,625 B | 0 | 全部移除 |
| 启动 Lua WASM 实例 | 5 | 1 | 减少 80% |
| NavigationCatalog gzip | 启动时包含在全量导航 LUB | 142,966 B，打开入口时加载 | 延迟加载 |
| Catalog + Graph gzip | 约 1,175,726 B | 455,728 B | 减少约 61% |

静态技能数据没有增加压缩首包。主要收益来自取消启动阶段的 9 次数据 LUB 请求和执行、普通角色少创建 4 个 Lua WASM 实例，以及将导航图推迟到真正寻路时加载。

本次没有保存改造前的浏览器 CPU Profile 和 JS Heap Snapshot，因此不能据此声明精确的首屏耗时或内存下降值。后续需要比较毫秒和 MiB 时，应在同一浏览器、冷缓存、同一角色和同一服务状态下分别录制改造前后 Performance Trace，而不是使用构建时间代替运行时指标。

## 验收基准

2026-09-09 的最终验证结果：

- Client 测试 452/452 通过，1 个测试文件跳过；
- Client lint、静态资源一致性检查和正式 PWA 构建通过；
- 真实 Chromium 使用 `happyro/happyro` 登录并进入地图；
- 当前角色技能窗读取 50 个技能，韩文技能名为 0；
- 导航搜索“波利”返回 50 条结果；
- NavigationCatalog 和 NavigationGraph 各请求 1 次；
- 技能与导航运行时 LUB 请求为 0，普通角色 AI Lua 请求为 0；
- 搜索、地图坐标选择和当前地图寻路线条均正常显示。

浏览器验收结果保存在 `artifacts/browser/static-runtime/result.json`，对应截图位于同目录。`artifacts/` 是本地验收产物，不作为运行时数据源。

## 修改约束

1. 不允许重新引入技能或导航 LUB 的运行时加载路径；
2. 不允许视图组件直接维护第二份导航目录或技能定义；
3. Catalog 与 Graph 必须保持独立请求和缓存，不能因打开导航提前加载 Graph；
4. 新增技能、修改技能基础表或升级官方资源后，先重新提取快照并审查全部输入哈希，再运行生成器；
5. 修改静态数据结构必须同步更新 schema 校验、生成一致性测试和客户端消费者；
6. 修改 AI 生命周期必须验证普通角色为零 AI VM，并分别覆盖生命体和佣兵首次初始化；
7. 每次修改完成后必须执行 Client 全量测试、正式 PWA 构建和真实浏览器资源时序验收。
