# 物品

## 权威来源

- 中文名称：`localization/item-names/zh-CN.json` 保存 RO 小册子／RO321 的 ID、名称、内部标识和来源 URL；参见[来源说明与未覆盖项](../../localization/item-names/README.md)。不从魔物名称推导卡片名称，不自行翻译。
- 服务端存在性：`repos/happyro-server/db/` 物品库。
- 客户端显示名、说明、资源名、洞数、ClassNum：已审查 `itemInfo_true` JSON，回编译为运行目录 `System/itemInfo_true.lub`。
- 卡片前缀：GRF 原表结构 + 已审查中文物品名，生成 `localization/client/data/cardprefixnametable.txt`。
- 图标与详情图：GRF 解压 BMP，离线转成透明 PNG。

## 生成命令

```bash
python3 tools/resources/catalog/sync_item_names.py apply --no-color
python3 tools/resources/catalog/main.py items server
bash tools/resources/catalog/generate-item-subtypes.sh generate --no-color
python3 tools/resources/catalog/main.py items client
python3 tools/resources/catalog/main.py items images
python3 tools/resources/catalog/generate_card_prefixes.py --write
```

`items client` 读取 `localization/sources/kro-20211105/merged/files/lub/itemInfo_true.json`、GRF `manifest.json` 与后台 Renewal 快照。客户端物品 ID 必须全部命中服务端快照，中文、英文名称和说明不能为空。

背包与仓库子类通过 `generate-item-subtypes.sh` 生成，直接复用 Go Admin 的 `catalog` 分类逻辑与 Renewal 快照，覆盖武器、防具、卡片（含附魔）。更新物品快照或分类规则后需重新生成；运行需要 Go 工具链，`scripts/client/refresh-client.sh build` 已包含该步骤。映射随 PWA 构建，不在打开菜单时联网查询。

## 输出位置

| 产物 | 路径 |
| --- | --- |
| 服务端双语快照 | `repos/happyro-api/resources/game-data/items/renewal.json` 等 |
| 客户端快照与资源映射 | 同目录 `client-kro-20211105.json`、`item-assets.json`、`descriptions.json` |
| 子类映射 | `repos/happyro-client/src/DB/Items/ItemSubtypes.generated.json` |
| 有来源的名称映射 | `localization/item-names/zh-CN.json` |
| 卡片前缀 | `localization/client/data/cardprefixnametable.txt` |
| PNG 图标 / 详情 | `work/game-data/items/kro-20211105/` |

## 消费者

- Admin 物品查询与发放表单。
- 客户端背包、装备名、卡片前缀、冒险工具物品详情。
- Gateway 通过覆盖或本地 `data/` 提供 TXT；LUB 来自运行目录。

冒险工具的物品查询限定在当前客户端目录收录范围，服务端有装备定义不代表图鉴中可见或已完成效果验收。范围说明与 2026-10-16 实机抽样结果见[装备可用范围与实机抽样](equipment-availability.md)。

## 校验规则

- 客户端 ID 必须全部出现在服务端快照。
- 中文、英文名称和说明不能为空。
- 卡片前缀表保持 `ID#文本#`，当前恰好 1081 条，无韩文。
- ItemInfo、客户端图鉴、Renewal 物品库中有来源 ID 的名称必须与映射一致；客户端不再叠加名称补丁。
- 图片缺失不删除物品，但要记录资源状态；多个文件命中同一规范化路径时生成失败。

## 附魔交互约束

提交前按当前装备身份重新校验费用和材料；请求等待期间锁定装备、方式、重复提交和关闭操作，结果处理后解除锁定。服务端可能静默拒绝无效请求，不能依赖必有失败回包。客户端回归见 `tests/ui/DesktopEnchant.test.js`、`MobileEnchant.test.js`、`EquipmentSockets.test.js`。目录生成只同步规范数据，不修改服务端费用、成功率或支持装备范围。

卡片镶嵌的装备类型与职业筛选复用上述生成目录中的装备子类及 `Jobs` 规则；`equipment` 字段由同一生成命令更新，运行时不请求后台接口。
