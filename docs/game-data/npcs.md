# NPC

## 权威来源

NPC 图鉴以 `repos/happyro-server/npc/**/*.txt` 中的服务器实例为完整来源。官方 `navi_npc_krpri.lub` 只补充导航 ID、Class、官方名称、别名和路线位置。

中文显示名来自 `repos/happyro-client/src/DB/NpcNameTranslations.zh-CN.json`。审查过的近坐标导航关联覆盖在 `configs/npc-navigation-overrides.json`。

## 生成命令

```bash
node tools/generate-npc-catalog.mjs
cd repos/happyro-client && npm run catalog:world
```

根仓库生成器写出版本化目录；Client 构建脚本再生成名称索引和 WebP 图集。

## 输出位置

| 产物 | 路径 |
| --- | --- |
| 规范目录 | `artifacts/game-data/world/npc-catalog.json` |
| Client 目录 | `repos/happyro-client/src/DB/Navigation/NpcCatalog.json` |
| Admin 目录 | `repos/happyro-admin/backend/resources/game-data/world/npc-catalog.json` |
| NPC 图集 | `repos/happyro-client/applications/pwa/data/world/` |
| Admin PNG | `repos/happyro-admin/backend/resources/game-data/world/npcs/` |

## 消费者

- 冒险工具 NPC 图鉴：当前只展示有形象且可发起 NPC 传送的条目。
- 右上角导航：范围更广，可包含服务节点；纯 Warp 不进入 NPC 图鉴。
- Admin NPC 查询：默认与游戏内可见范围一致，可切换全部目录。

没有匹配官方导航记录的服务器实例仍保留在完整目录中，显示为静态资料，在取得可验证的实时身份前不开放“传送到 NPC 附近”。

## 校验规则

- 生成结果必须包含启用脚本、实例 ID、中文名称、显示 Sprite、传送 class 和来源审计字段。
- 无图片 NPC 在完整目录中保留；游戏内图鉴可以按产品规则过滤。
- NPC 传送由服务器按地图、坐标容差和 Class 再次校验，并排除隐藏或不可见 NPC。
- 修改脚本或名称表后重新生成目录，并跑 `tools/generate-npc-catalog.test.mjs`。
