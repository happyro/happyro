# 地图

## 权威来源

- 地图实体：客户端世界地图、地图信息表，以及服务端已加载地图集。
- 显示名：`MapTable.js`、`MapNameTranslations.js`、世界地图和导航中文目录。
- 预览：Admin 预生成 PNG；游戏端按需读取地图图片或 GAT。

`mapnametable.txt` 不是当前主要中文来源，不整表翻译。缺少图片或 GAT 只影响预览和寻路，不决定地图是否存在。

## 生成命令

地图名称表随客户端维护。世界目录和导航数据：

```bash
cd repos/happyro-client
npm run catalog:world
node ../../scripts/resources/generate-navigation-data.mjs --write
```

Admin 地图名 JSON 位于 `repos/happyro-admin/backend/resources/game-data/world/map-names.zh-CN.json`。

## 输出位置

| 产物 | 路径 |
| --- | --- |
| 导航目录 / 寻路图 | `repos/happyro-client/applications/pwa/data/navigation/` |
| Admin 世界资源 | `repos/happyro-admin/backend/resources/game-data/world/` |

## 消费者

- 右上角导航与世界地图。
- 冒险工具地图图鉴。
- Admin 地图查询。
- map-server：进入、禁传、坐标合法性。

## 校验规则

- 地图传送使用封包 `0xd00` / `0xd01`，成功后客户端才开始冷却。
- 无 GAT 时禁用当前地图坐标寻路，并说明原因。
- 不要因为 GRF 中的韩文 `mapnametable.txt` 覆盖整张表。
