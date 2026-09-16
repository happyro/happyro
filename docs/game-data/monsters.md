# 魔物

## 权威来源

- 属性、掉落、常驻刷新：`repos/happyro-server/db/re/mob_db.yml` 与刷新配置文件（rAthena 静态配置，构建时解析，非可查询数据库）。
- 中文名称与精灵映射：`repos/happyro-client/src/DB/Monsters/`。
- 图片：GRF 中魔物 SPR 的首帧。

导航里的魔物记录只说明客户端已知分布，不代表某只魔物当前存在。召唤始终由 map-server 判断。

与 NPC（见 [NPC](npcs.md)）不同，魔物的出没地图（`spawns`）和图集坐标（`atlas`/`tile`）目前只存在于 Client 构建产物里，Admin 后端数据库不持有这两项数据。这是冒险工具魔物图鉴仍为客户端全量拉取、未改造成服务端分页的直接原因，见下方“架构决策”。

## 生成命令

```bash
python3 tools/resources/catalog/main.py monsters
cd repos/happyro-client && npm run catalog:monsters
```

根仓库命令生成 Admin 双语快照和 PNG。Client 命令生成 PWA 魔物图鉴资源。

## 输出位置

| 产物 | 路径 |
| --- | --- |
| Admin 快照 | `repos/happyro-admin/backend/resources/game-data/monsters/` |
| PNG | `work/game-data/monsters/kro-20211105/` |
| Client 图鉴列表 | `repos/happyro-client/applications/pwa/data/monsters/catalog.json`（schema `happyro-monster-catalog/v4`） |
| Client 掉落详情 | `repos/happyro-client/applications/pwa/data/monsters/drops.json`（schema `happyro-monster-drops/v1`，按魔物 ID 索引，图鉴打开详情时才请求） |
| Client 图集 | `repos/happyro-client/applications/pwa/data/monsters/atlas-*.webp`（20×20 网格打包，每张最多 400 只） |

掉落数据（`drops`/`mvpDrops`）占列表体积的大头，v3 起从 `catalog.json` 拆分到 `drops.json`；列表本身请求一次即可。v4 起列表用 `kind` 表示普通、Mini 和 MVP，不再同时携带 `boss` / `mvp` 布尔。图集按翻到的当前页整页触发下载（页内没有按可视区域的懒加载），已下载过的图集文件会被浏览器缓存，不重复请求。

## 消费者

- Admin 魔物查询与召唤表单；详情接口用当前物品目录把 `Drops` / `MvpDrops` 的 Aegis 名解析为中英文物品名。
- 冒险工具魔物图鉴。
- 右上角导航的魔物搜索（导航目录，不是实时刷新表）。

## 校验规则

- 服务端魔物 ID 与客户端名称表必须能合并出完整中文名。
- 无图片的魔物仍保留在目录中，使用占位。
- 客户端不得把图鉴记录当作召唤许可。
- 普通 / Mini / MVP 以 `kind` 存储：有 `MvpDrops` 为 `mvp`，`Class` 为 `Boss` 且无 MVP 掉落为 `mini`，其余为 `normal`。后台查询参数与客户端筛选值均为 `all` / `normal` / `mini` / `mvp`。

## 架构决策：冒险工具魔物图鉴为什么不做服务端分页

Admin 的 NPC 查询已经改为服务端分页（`game_npcs` 表 + 分页 API，见 [NPC](npcs.md)），冒险工具魔物图鉴目前仍是客户端一次性拉取 `catalog.json` 后在内存里分页，两者不对称，理由如下：

1. `catalog.json` 经 gzip 压缩后约 150KB，且已经是懒加载（只在打开图鉴 tab 时才请求），全量拉取的成本本身不高；改成分页反而会把一次请求拆成多次往返，在高延迟链路上未必更快。
2. 魔物的 `spawns`（出没地图）和 `atlas`/`tile`（图集坐标）目前完全不在 Admin 数据库里，只存在于 `repos/happyro-client/scripts/generate-monster-catalog.mjs` 解析 rAthena 服务端 spawn 配置文件生成的静态产物中。要做服务端分页，必须先把这两项数据迁移进数据库，这是尚未开始的前置工作。
3. `repos/happyro-client/src/UI/Components/WorldMap/WorldMap.js`（游戏内世界地图，不是冒险工具弹窗）同样读取 `catalog.json` 的 `spawns` 字段在地图上画怪物点位。改造服务端分页时不能只考虑冒险工具这一个消费者。

真正值得做的优化是图集懒加载（按可视区域触发，而不是整页触发），不是服务端分页。
