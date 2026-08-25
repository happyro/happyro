# 普隆德拉全地图 NPC 名称

## 状态

全地图已实现。

## 纳入范围

| 类型 | 地图键 |
| --- | --- |
| 主城区 | `prontera` |
| 常规室内与教堂 | `prt_in`、`prt_church`、`prt_castle` |
| 王宫与任务房间 | `prt_cas`、`prt_cas_q`、`prt_q` |
| 图书馆与监狱 | `prt_elib`、`prt_lib`、`prt_lib_q`、`prt_pri00`、`prt_prison` |
| 竞技场 | `prt_are01`、`prt_are_in` |
| 公会区域 | `prt_gld`、`prtg_cas01`、`prtg_cas02`、`prtg_cas03`、`prtg_cas04`、`prtg_cas05` |

## 排除范围

- `prt_fild*`：普隆德拉周边野外。
- `prt_maze*`：迷藏森林。
- `prt_sewb*`：普隆德拉地下水道。
- `prt_monk`：圣卡毕利那修道院，不属于普隆德拉城区。
- 测试目录、已注释 NPC、纯事件控制器和无玩家可见名称的内部占位项。

## 名称来源

- 服务端 `repos/happyro-server/npc/`：活动 NPC 定义清单和对话标题来源。
- 客户端 `src/DB/PronteraNpcNameTable.js`：普隆德拉实体名称的专用中文映射。
- 客户端 `src/DB/NpcNameTable.js`：公共 NPC 名称、23 字符截断别名及跨地图复用映射。
- `terms-names.csv`：人工确认并需要跨地图复用的术语，不作为全量清单。

## 验收基准

- `PronteraNpcNameTable.js` 包含 487 项专用映射。
- 从纳入范围内的服务端活动 NPC 定义提取英文基础名称后，客户端映射缺失数为 0。
- 超过 23 个字符的英文名称能命中 24 字节名称封包的截断别名，且不存在截断冲突。
- `NpcNameTable.test.js`、客户端全量测试和 PWA 构建通过。
- 已验收 NPC 初始悬停名称、名称牌、首次对话和点击“继续”后的多页对话标题。

后续服务端脚本或地图范围发生变化时，必须重新生成名称清单并执行缺失检查；新增英文基础名称后，进度临时降为“部分覆盖”，直到映射和验收重新通过。
