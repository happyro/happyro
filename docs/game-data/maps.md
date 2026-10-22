# 地图

## 权威来源

- 地图实体：客户端世界地图、地图信息表，以及服务端已加载地图集。
- 显示名：`MapTable.js`、`MapNameTranslations.js`、世界地图和导航中文目录。
- 预览：Admin 预生成 PNG；游戏端按需读取地图图片或 GAT。

`mapnametable.txt` 不是当前主要中文来源，不整表翻译。缺少图片或 GAT 只影响预览和寻路，不决定地图是否存在。

## 生成命令

地图名称表随客户端维护。世界目录和导航数据：

```bash
node tools/resources/world/generate-map-resources.mjs generate
(cd repos/happyro-client && npm run catalog:world)
node scripts/resources/generate-navigation-data.mjs --write
node tools/resources/world/generate-map-catalog.mjs generate
```

Admin 地图名 JSON 位于 `repos/happyro-api/resources/game-data/world/map-names.zh-CN.json`。`generate-map-catalog.mjs` 同时写出 Admin 副本（`resources/game-data/world/map-catalog.json`）和客户端懒加载副本（见下），两处不同步会导致地图预览或分页结果不一致。

## 输出位置

| 产物 | 路径 |
| --- | --- |
| 导航目录 / 寻路图 | `repos/happyro-client/applications/pwa/data/navigation/` |
| 地图目录（懒加载） | `repos/happyro-client/applications/pwa/data/navigation/map-catalog.json` |
| Admin 世界资源 | `repos/happyro-api/resources/game-data/world/` |

客户端不再把地图目录打进主包，冒险工具地图图鉴和右上角导航改为运行时按需请求 `map-catalog.json`。

## 消费者

- 右上角导航与世界地图。
- 冒险工具地图图鉴。
- Admin 地图查询。
- map-server：进入、禁传、坐标合法性。

## 校验规则

- 地图传送使用封包 `0xd00` / `0xd01`，成功后客户端才开始冷却。
- 无 GAT 时禁用当前地图坐标寻路，并说明原因。
- 不要因为 GRF 中的韩文 `mapnametable.txt` 覆盖整张表。

## 训练场官方资源补充

`tra_fild01/02/03` 的官方资源、真实地面引用、小地图关联和安装校验统一见[训练场资源说明](../development/trainning-ground/resources.md)。缺图、假人外观与仓库等问题见[修复记录](../development/trainning-ground/fixes.md)，实际流程覆盖见[验收记录](../development/trainning-ground/verification.md)。

## 官方共享资源映射

支持目录同时检查实体文件和 `resnametable.txt` 映射后的 RSW、GND、GAT。经典 `new_1-1` 至 `new_5-4` 共 20 张逻辑地图共用 `new_zone01～04`；不能因 GRF 中没有同名 RSW 就将其标记为不支持。当前清单生成出 1,088 张客户端资源完整且服务端启用的地图。此统计只验证三个基础文件，完整模型／贴图解析的范围见各专题验收记录。
