# NPC

## 权威来源

NPC 图鉴以 `repos/happyro-server/npc/**/*.txt` 中的服务器实例为完整来源。官方 `navi_npc_krpri.lub` 只补充导航 ID、Class、官方名称、别名和路线位置。

中文显示名来自 `repos/happyro-client/src/DB/NpcNameTranslations.zh-CN.json`。符号 Sprite 名称通过客户端 `MonsterTable.js` 解析为数值 Class。审查过的近坐标导航关联，以及没有官方导航记录但可由服务端按地图、坐标和 Class 实时校验的 NPC 身份，维护在 `configs/npc-navigation-overrides.json`。

## 生成命令

```bash
node tools/generate-npc-catalog.mjs generate
cd repos/happyro-client && npm run catalog:world
cd repos/happyro-admin/backend && php artisan game-data:import-npcs --renewal
```

根仓库生成器写出版本化目录；Client 构建脚本再生成导航名称索引和 WebP 图集；Admin 导入命令把目录写入 `game_npcs` 表，供查询接口使用。目录内容变化后必须重新执行导入，否则查询接口返回旧数据。

## 输出位置

| 产物 | 路径 |
| --- | --- |
| 规范目录 | `artifacts/game-data/world/npc-catalog.json` |
| Admin 目录 | `repos/happyro-admin/backend/resources/game-data/world/npc-catalog.json` |
| Admin 数据库 | `game_npcs` 表（MySQL），由上面的 `import-npcs` 命令从 Admin 目录导入 |
| NPC 图集 | `repos/happyro-client/applications/pwa/data/world/` |
| Admin PNG | `repos/happyro-admin/backend/resources/game-data/world/npcs/` |
| 导航名称索引 | `repos/happyro-client/applications/pwa/data/navigation/npc-instances.json`（仅地图、坐标和中文名，供右上角导航搜索按需加载，不是完整目录） |

客户端不再把完整 NPC 目录打进主包；冒险工具图鉴改为运行时向 Admin 分页接口取数。

## 消费者

- 冒险工具 NPC 图鉴：`GET /api/adventure-tools/npcs`（服务端分页）和 `GET /api/adventure-tools/maps/{map}/npcs`（单张地图整图查询，不分页，用于地图预览标记），数据来自 `game_npcs` 表，只展示有形象且可发起 NPC 传送的条目。
- 右上角导航：范围更广，可包含服务节点；纯 Warp 不进入 NPC 图鉴。
- Admin NPC 查询：`GET /api/game-data/npcs`，服务端分页，默认与游戏内可见范围一致，可切换全部目录。

没有匹配官方导航记录的服务器实例仍保留在完整目录中，显示为静态资料，在取得可验证的实时身份前不开放“传送到 NPC 附近”。

## 校验规则

- 生成结果必须包含启用脚本、实例 ID、中文名称、显示 Sprite、传送 class 和来源审计字段。
- 无图片 NPC 在完整目录中保留；游戏内图鉴可以按产品规则过滤。
- NPC 传送由服务器按地图、坐标容差和 Class 再次校验，并排除隐藏或不可见 NPC。
- 修改脚本或名称表后重新生成目录，并跑 `tools/generate-npc-catalog.test.mjs`。
