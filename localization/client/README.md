# 客户端本地化覆盖资源

这些 UTF-8 文件用于补充官方 kRO 2021-11-05 GRF 中不存在的客户端散装资源。网关通过
`DATA_OVERRIDE_PATH` 提供这些文件；经过核验的官方运行时文件保持不变。

`data/msgstringtable.txt` 基于 OpenKore 在提交
`51de1ddfc4449ae5217f6886de702f87ca934030` 时的 cRO 消息表。该文件包含 0 至 4070
的消息 ID，其 SHA-256 为
`b0fa22e17ec01688828157b215c58d452dae389d4601a52087c1e1324be794ce`。

`data/titletable.json` 包含 2021 客户端固定称号 ID 范围 1000 至 1046 的简体中文名称。

`data/skillnametable.txt` 和 `data/skilldesctable.txt` 从固定版本服务端技能数据库生成，
覆盖全部 1635 个技能的简体中文名称和机制信息。狂击、怒爆等常用技能还包含与服务端实现
核对过的伤害、命中和范围说明。运行 `node scripts/resources/generate-skill-localization.mjs`
可从当前服务端数据库重新生成两份资源。

<!-- 已归档：data/itemlocalization.json 已由翻译后的 itemInfo_true.lub 取代，
现保留在 archive/localization/client/data/ 中。 -->

## 运行时集成

加载官方 Lua 表时，客户端会保留已翻译的静态名称：

- `DBManager.loadTitleTable` 在官方称号表之后应用 `titletable.json`，使已获得的称号不会
  回退为韩文。
- `DBManager.loadWorldMapInfo` 将官方世界地图几何数据与已翻译的 `WorldMap.js` 和
  `MapTable.js` 名称合并。旧世界地图布局中不存在的动态地图 ID 使用已翻译的地图信息快照。
- 道具显示名称保持本地化，道具资源名称则使用配置的客户端字符集解码。这样既能保持韩文
  GRF 文件名有效，也不会在界面中显示韩文道具名称。
<!-- DBManager.loadItemLocalization 已归档；itemInfo_true.lub 现已包含完整的玩家可见
道具名称和说明。 -->

资源网关会分别转换各个乱码路径片段。请求可能同时包含旧式 CP949 目录
`À¯ÀúÀÎÅÍÆäÀÌ½º` 和有效的 Unicode 文件名 `나이프.bmp`；转换整个路径会破坏文件名，
导致装备图标返回 HTTP 404。

网关启动时会验证剩余的本地化覆盖资源。客户端变更由 Vitest 测试套件覆盖。
