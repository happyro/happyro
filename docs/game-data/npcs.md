# NPC

## 权威来源

NPC 图鉴以 `repos/happyro-server/npc/**/*.txt` 中的服务器实例为完整来源。官方 `navi_npc_krpri.lub` 只补充导航 ID、Class、官方名称、别名和路线位置。

中文显示名来自 `repos/happyro-client/src/DB/NpcNameTranslations.zh-CN.json`。符号 Sprite 名称通过客户端 `MonsterTable.js` 解析为数值 Class。审查过的近坐标导航关联，以及没有官方导航记录但可由服务端按地图、坐标和 Class 实时校验的 NPC 身份，维护在 `configs/npc-navigation-overrides.json`。

## 生成命令

本机更新 NPC 后，使用根目录的 `./scripts/client/refresh-client.sh build`。它会依次生成完整 NPC 目录、更新客户端名称索引与图集、以 Admin 服务用户导入数据库、完整构建 PWA 并校验 3338 产物。任一步失败即停止；以 root 或 Admin 服务用户运行。只执行 `npm run build:pwa` 不会更新数据库，不能替代这一步。

分步操作如下：

```bash
node tools/resources/world/generate-npc-catalog.mjs generate
(cd repos/happyro-client && npm run catalog:world)
(cd repos/happyro-api && happyro-api catalog import \
  --client-items resources/game-data/items/client-kro-20211105.json \
  --server-items resources/game-data/items/renewal.json \
  --monsters resources/game-data/monsters/renewal.json \
  --npcs resources/game-data/world/npc-catalog.json)
```

根仓库生成器写出版本化目录；Client 构建脚本再生成导航名称索引和 WebP 图集；Admin 导入命令把目录写入 `catalog_npcs` 表，供查询接口使用。目录内容变化后必须重新执行导入，否则查询接口返回旧数据。

## 输出位置

| 产物 | 路径 |
| --- | --- |
| 规范目录 | `artifacts/game-data/world/npc-catalog.json` |
| Admin 目录 | `repos/happyro-api/resources/game-data/world/npc-catalog.json` |
| Admin 数据库 | `catalog_npcs` 表（MySQL），由上面的 `catalog import` 命令从 Admin 目录导入 |
| NPC 图集 | `repos/happyro-client/applications/pwa/data/world/` |
| Admin PNG | `repos/happyro-api/resources/game-data/world/npcs/` |
| 导航名称索引 | `repos/happyro-client/applications/pwa/data/navigation/npc-instances.json`（仅地图、坐标和中文名，供右上角导航搜索按需加载，不是完整目录） |

客户端不再把完整 NPC 目录打进主包；冒险工具图鉴改为运行时向 Admin 分页接口取数。

## 消费者

- 冒险工具 NPC 图鉴：`GET /api/adventure-tools/npcs`（服务端分页）和 `GET /api/adventure-tools/maps/{map}/npcs`（单张地图整图查询，不分页，用于地图预览标记），数据来自 `catalog_npcs` 表，展示有形象的服务器 NPC；有官方导航身份时按 NPC 身份传送，没有导航身份但有坐标时按坐标传送。
- 右上角导航：范围更广，可包含服务节点；纯 Warp 不进入 NPC 图鉴。
- Admin NPC 查询：`GET /api/game-data/npcs`，服务端分页，默认与游戏内可见范围一致，可切换全部目录。

没有匹配官方导航记录的服务器实例仍保留在完整目录中，有坐标时可以使用通用坐标传送；没有坐标的条目仅显示静态资料。

## 校验规则

- 生成结果必须包含启用脚本、实例 ID、中文名称、显示 Sprite、传送 class 和来源审计字段。
- 无图片 NPC 在完整目录中保留；游戏内图鉴展示有形象的 NPC，传送能力单独按导航身份判断。
- NPC 身份传送由服务器按地图、坐标容差和 Class 再次校验，并排除隐藏或不可见 NPC；无导航身份的条目使用坐标传送的地图权限、安全落点和对话状态校验。
- 修改脚本或名称表后重新生成目录，并跑 `tools/resources/world/generate-npc-catalog.test.mjs`。
