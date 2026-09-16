# 游戏资料目录

物品、魔物、地图和 NPC 使用各自的权威来源生成快照，再提供给 Client 冒险工具和 Admin 查询页。生成逻辑在根仓库，Admin 保存运行时 JSON 副本，Client 保存需要打进 PWA 的子集。

详细命令、输出位置和校验规则见 [游戏资料](../game-data/README.md)。世界实体模型和导航边界见 [世界图鉴与导航](world-catalog-navigation.md)。

## 权威边界

| 资料 | 存在性权威 | 显示名与资源 | 运行时操作权威 |
| --- | --- | --- | --- |
| 物品 | 服务端 `db/` 物品库 | 已审查 `itemInfo_true` 与客户端目录 | map-server 发放、鉴定、背包 |
| 魔物 | 服务端 `mob_db` 与刷新配置 | 客户端名称表和 SPR | map-server 召唤与地图规则 |
| 地图 | 客户端地图表 + 服务端地图加载集 | 世界地图、图片、GAT | map-server 进入与传送限制 |
| NPC | 服务端 `npc/**/*.txt` 实例 | 中文名称表、Sprite、官方导航增强 | map-server 可见性与 NPC 传送 |

官方 `navi_npc_krpri.lub` 只补充导航身份，不是 NPC 是否存在的依据。缺少图片或 GAT 只影响预览，不删除实体。

## 运行时查询模式

四类资料的“生成方式”相同（离线工具生成版本化产物），但冒险工具在运行时如何取数并不统一：

| 资料 | 是否有 Admin 数据库副本 | 冒险工具取数方式 |
| --- | --- | --- |
| 物品 | 有（`game_items` 等表） | 服务端分页 |
| NPC | 有（`game_npcs` 表） | 服务端分页；单张地图另有整图查询接口，不分页 |
| 地图 | 无，Admin 内存合并后按请求分页 | 服务端分页 |
| 魔物 | 无，数据只存在于 Client 构建产物 | 客户端一次性拉取，本地分页 |

魔物之所以是例外，是因为它的出没地图和图集坐标目前完全不经过 Admin 数据库，具体依据见 [魔物·架构决策](../game-data/monsters.md#架构决策冒险工具魔物图鉴为什么不做服务端分页)。

## 生成与消费

```text
官方 GRF / 服务端 db、npc / 已审查中文源
        ↓ tools/resources、tools/generate-npc-catalog.mjs、Client 构建脚本
Admin backend/resources/game-data/...
Client src/DB 与 applications/pwa/data/...
        ↓
Admin 查询页、冒险工具、右上角导航
```

大体积 PNG 写到 `work/game-data/`，不提交 Git。Admin 按物品 ID 或 NPC Sprite 读取预生成图片；游戏端 NPC 使用 WebP 图集，不在请求期间转换 BMP。
