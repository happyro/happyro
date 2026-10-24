# 地图名称应用记录

扫描基线已提交（根仓库 `e89c1d13`）；本次应用改动尚未提交或推送。扫描阶段的 `project.json`、来源页面与 `verification.json` 保留当时状态，其中 `productApplied: false` 只描述扫描阶段；本次应用证据见 [application.json](application.json)。

## 应用范围

- 按地图内部名精确关联审计结果，应用 1,205 个地图名称，其中更新 946 个既有客户端显示名、补充 96 个服务端已存在地图的名称。20 项“初心者修炼场”保留用户指定名称。
- 同步客户端地图标题、世界地图、导航目录，以及原生 `mapInfo_true`；原生表补齐 177 个名称条目。
- 桌面／移动端冒险工具、后台共用 API 地图目录与 NPC 地图位置名称；客户端静态地图目录同步生成。
- 更新路牌、状态／技能说明中的地名、任务与推荐任务说明、成就、提示，以及 214 份 NPC 脚本对话中的地名引用。191 件物品只更新说明中的地名，物品名称、数值与图片映射不变。
- 地图 ID、坐标、世界地图布局、传送逻辑、导航图及任务数值不变。新名称条目不使原本不支持的地图变为可传送。

## 引用处理边界

地图完整名称采用两站审计决策，正文中的城市简称采用来源名称的对应地名部分；不把城市前缀或楼层机械叠加到句子中。模式后缀仍按独立地图键处理。

独立命名的 NPC、物品、魔物、技能不因含有地名就改名，例如“巴西利斯男孩”、巴西利斯克及“返回艾尔迪卡斯特”。“摩洛克”需按上下文区分城市与魔王，只有明确的城市引用改为“梦罗克”。泛指方向、组织、地点描述不一律替换成某张地图的全称。

缺少可信外部中文名时保留已有名称，不自行翻译。原始网站资料、导航提取快照和历史 changelog 不做追溯替换。

## 验证

- 19 项目录／地图名称测试通过，覆盖审计决策到客户端、原生表、API、世界地图、导航与 NPC 位置的精确名称一致性，以及既有物品、魔物和 NPC 目录关系。
- 9 项地图扫描测试通过；导航和 NPC 目录重新生成检查通过。
- 214 份 NPC 脚本的非字符串代码、定义和已检查的命名空间调用保持一致；7 份说明 JSON 的结构、数值与身份字段保持一致。
- 世界地图布局、原生地图行为字段、导航地图 ID／坐标与实体数据对比通过。
- 8 个实际变化的 LUB 完成 Lua 5.1 编译和语义回读验证，安装到本机运行资源后逐文件核对 SHA-256；原始官方资源未修改。来源与目标哈希见 application.json。
- API 的 catalog、HTTP 测试与 go vet 通过；本机 API 重新构建，资料导入为 generation 17。
- PWA 使用 `npm run build -- --all` 全量构建，本机 3338 提供构建 `mvmljik6`，关键产物哈希一致，保留含“进入游戏”的启动页。

本次未进行逐地图实机游玩。NPC 对话源文件已修改，本次未重启地图服；已运行的地图服需要重新加载脚本或在下一次正常重启后使用新对话。

复核命令：

```sh
node --test tools/resources/world/map-name-application.test.mjs tools/resources/world/catalog-names.test.mjs tools/resources/world/generate-npc-catalog.test.mjs
node scripts/resources/generate-navigation-data.mjs --check
node tools/resources/world/generate-npc-catalog.mjs check --no-color
python3 -m unittest discover -s tools/resources/maps/tests
bash scripts/client/refresh-client.sh verify --no-color
```

过程日志与完整性检查脚本位于 `work/map-name-application/`，编译产物位于 `artifacts/client/map-name-application/`。

## 二次复查

详见 [二次复查记录](review-2026-10-25.md)。后台独立映射、公告板地图标题以及城市旧别名的遗漏已补齐。

第三次复查见 [第三次复查记录](review-3-2026-10-25.md)。

第四次复查见 [第四次复查记录](review-4-2026-10-25.md)。

第五次复查见 [第五次复查记录](review-5-2026-10-25.md)，包含独立城堡数据库与入口菜单。

## 当前本机状态

后续已完整修复 4 份 NPC 脚本的混合编码，并同步图片包的 UTF-8 解码。本机客户端已全量重建、地图服已重新加载并上线，之前的地图名称、对话和城堡数据库变更同时生效。早期复查记录中的“地图服未重载”属于当时状态。编码修复结果见 [encoding-repair.json](encoding-repair.json)，当前构建与目录代次见 application.json。未提交或推送。
