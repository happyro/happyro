# 地图

## 权威来源

- 地图实体：客户端世界地图、地图信息表，以及服务端已加载地图集。
- 显示名：以 [地图显示名与搜索决策](map-display-names.md) 为准，生成 `MapTable.js`、世界地图、API 和导航中文目录；外站全称只作来源及搜索词。
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

右上角导航按需加载客户端 `map-catalog.json`。冒险工具地图图鉴调用 `/api/adventure-tools/maps`，后台地图列表调用 API 的地图查询接口；API 在启动时读取世界资源目录中的地图目录并保存在内存中，修改 JSON 后必须重启 API 才会生效。

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

## 展示与传送范围

`localization/maps/player-visibility.json` 统一登记非正常游戏入口。`new_zone01～04` 是经典训练场共享场景资源，玩家列表与搜索隐藏，正常入口使用 `new_1-1～4` 及对应分流。生成目录同时更新 Client 与 API 副本。

同一规则隐藏赛道和试炼共享场景 `alde_tt02`、`ordeal_a00`、`ordeal_a02`，当前 Renewal 未使用的 `job_sword1`、无已加载玩法入口的 `quiz_01`，以及任务脚本未启用的 `que_job02`、`que_job03`。正常赛道 `turbo_*`、试炼 `ordeal_*-1/2` 和各机场地图保留；不根据共享资源或 NPC 数量自动推断隐藏范围。

后台游戏地图范围使用相同过滤，全部服务端地图仍保留资料查询；API 返回 `player_hidden`，后台据此隐藏地图和 NPC 传送操作。此字段用于展示，不作为游戏服传送权限校验；实际位置、名称解析和底层资源映射不删除。

## 更新后的验收

重新生成地图目录后，完整构建 PWA（`npm run build -- --all`），确认 Gateway 提供新产物；同时重启使用新目录的 API。若修改了 API 代码，应先重新构建 API。仅刷新浏览器或重建 PWA 不会更新 API 内存中的目录。

在实际使用的域名登录，分别验证：

- 冒险工具搜索「初心者」不包含 `new_zone01～04`，分线关闭时保留 `new_1-1～4`；检查登录后的 `/api/adventure-tools/maps` 响应，而不是只检查静态 JSON。
- 右上角导航的地图搜索同样不包含隐藏地图；分线开关两种模式下正常入口均保留。
- 后台游戏地图范围不包含隐藏地图；全部地图范围仍能查看资料，但不显示地图及 NPC 传送按钮。
- 正常赛道、试炼和机场仍可查询；当前地图名称、图片资源与服务端权限校验保持可用。

隐藏规则只限制目录展示，不是地图服的禁止进入规则。当前位置、已有坐标目标和资源查看不因隐藏而丢失；不要把仍可解析地图名称或加载场景判为隐藏失效。
