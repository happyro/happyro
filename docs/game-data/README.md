# 游戏资料

本目录记录物品、魔物、地图和 NPC 目录的权威来源、生成命令、输出位置、消费者和校验规则。架构边界见 [游戏资料目录](../architecture/game-data-catalogs.md) 与 [世界图鉴与导航](../architecture/world-catalog-navigation.md)。

| 资料 | 文档 |
| --- | --- |
| 物品 | [items.md](items.md) |
| 魔物 | [monsters.md](monsters.md) |
| 地图 | [maps.md](maps.md) |
| NPC | [npcs.md](npcs.md) |
| 技能与状态 | [skills.md](skills.md) |

生成器入口：

```bash
python3 tools/resources/catalog/main.py
node tools/generate-npc-catalog.mjs generate
```

无参数运行只显示帮助。大体积图片写入 `work/game-data/`，不提交 Git。
