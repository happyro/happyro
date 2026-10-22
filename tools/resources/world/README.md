# NPC 与地图目录

在根仓库运行命令，输入与输出路径由工具文件位置确定，无参数只显示帮助。

```bash
node tools/resources/world/generate-npc-catalog.mjs check --no-color
node tools/resources/world/generate-npc-catalog.mjs generate --no-color
node tools/resources/world/generate-map-resources.mjs generate --no-color
(cd repos/happyro-client && npm run catalog:world -- --no-color)
node tools/resources/world/generate-map-catalog.mjs generate --no-color
node --test tools/resources/world/generate-npc-catalog.test.mjs
```

NPC 生成器读取服务端脚本、客户端中文名称及导航关联，生成规范目录和 Admin 副本。check 核对现有输出，不写文件。地图生成器读取客户端地图表、服务端地图索引及已有图片/GAT，写出 Client/Admin 共用目录和需要的地形预览；运行前安装客户端依赖（包括 sharp）并准备运行资源。

资料职责、输出和后续导入分别见 [NPC](../../../docs/game-data/npcs.md) 与[地图](../../../docs/game-data/maps.md)。生成目录不等于已更新后台数据库或已构建 PWA，日常整体更新使用 scripts/client/refresh-client.sh。

资源清单必须解析当前官方 `resnametable.txt`，以实际 RSW 内的 GND/GAT 引用为准，包含共享场景的逻辑地图。单次映射与客户端 MapLoader 一致，不添加历史格式兼容或递归回退。生成器回归：`node --test tools/resources/world/map-resource-aliases.test.mjs`。

`configs/npc-navigation-overrides.json` 可明确关联当前服务端 NPC（含经典训练场）或纠正官方导航中的过时外观 ID。纠正必须使用当前脚本的地图、坐标及外观编号，并做地图服实时可用性验证；运行时变身、相邻实例和动态隐藏不能只凭静态不一致批量改写。
