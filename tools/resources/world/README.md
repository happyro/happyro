# NPC 与地图目录

在根仓库运行命令，输入与输出路径由工具文件位置确定，无参数只显示帮助。

```bash
node tools/resources/world/generate-npc-catalog.mjs check --no-color
node tools/resources/world/generate-npc-catalog.mjs generate --no-color
node tools/resources/world/generate-map-catalog.mjs generate --no-color
node --test tools/resources/world/generate-npc-catalog.test.mjs
```

NPC 生成器读取服务端脚本、客户端中文名称及导航关联，生成规范目录和 Admin 副本。check 核对现有输出，不写文件。地图生成器读取客户端地图表、服务端地图索引及已有图片/GAT，写出 Client/Admin 共用目录和需要的地形预览；运行前安装客户端依赖（包括 sharp）并准备运行资源。

资料职责、输出和后续导入分别见 [NPC](../../../docs/game-data/npcs.md) 与[地图](../../../docs/game-data/maps.md)。生成目录不等于已更新后台数据库或已构建 PWA，日常整体更新使用 scripts/client/refresh-client.sh。
