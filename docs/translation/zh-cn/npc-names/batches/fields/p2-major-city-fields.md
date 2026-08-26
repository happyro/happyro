# P2 主要城市周边 NPC 名称

> 本页合并管理 `field-comodo-p2`、`field-rachel-p2`、`field-veins-p2`、`field-einbroch-p2`、`field-lighthalzen-p2` 和 `field-hugel-p2` 六个批次。当前状态以 [`../../progress.md`](../../progress.md) 为准。

## 状态

六个批次的活动 NPC 清单、客户端显式映射、封包截断检查、测试、构建和代表性实机取样均已完成，当前状态均为“已实现”。连同妙勒尼山脉和朱诺周边，非城镇 P2 已全部完成。

## 纳入范围

| 批次 ID | 区域 | 地图范围 | 地图数 | 可见实例 | 唯一基础名称 |
| --- | --- | --- | ---: | ---: | ---: |
| `field-comodo-p2` | 科摩多周边 | `cmd_fild01` 至 `cmd_fild09` | 9 | 30 | 27 |
| `field-rachel-p2` | 拉赫周边 | `ra_fild01` 至 `ra_fild13` | 13 | 13 | 12 |
| `field-veins-p2` | 维因斯周边 | `ve_fild01` 至 `ve_fild07` | 7 | 12 | 12 |
| `field-einbroch-p2` | 艾因布洛克周边 | `ein_fild01` 至 `ein_fild10` | 10 | 26 | 13 |
| `field-lighthalzen-p2` | 里希塔乐镇周边 | `lhz_fild01` 至 `lhz_fild03` | 3 | 4 | 4 |
| `field-hugel-p2` | 胡戈尔周边 | `hu_fild01` 至 `hu_fild07` | 7 | 19 | 13 |
| 合计 | 六个地图族 | 49 张地图 | 49 | 104 | 77 个跨批次唯一名称 |

以下 16 张地图当前没有带玩家可见名称的活动 NPC，其完成证据是活动脚本扫描结果为零：

- 科摩多：`cmd_fild02`、`cmd_fild03`、`cmd_fild05`、`cmd_fild06`
- 拉赫：`ra_fild02`、`ra_fild07`、`ra_fild09`、`ra_fild13`
- 维因斯：`ve_fild05`、`ve_fild06`
- 艾因布洛克：`ein_fild02`、`ein_fild07`、`ein_fild10`
- 胡戈尔：`hu_fild02`、`hu_fild03`、`hu_fild07`

## 排除范围

- 冰洞、托尔火山、深渊湖、矿区、研究所、任务专图和其他关联地下城不属于本批次。
- `warp` 定义、`mapflag`、魔物生成项、函数和已注释定义不进入候选清单；带可见精灵的脚本传送实体仍按玩家可见 NPC 纳入。
- 223 条候选定义中排除 119 条：116 条基础显示名为空，3 条使用隐藏精灵。
- 各批次排除数依次为科摩多 16、拉赫 18、维因斯 20、艾因布洛克 23、里希塔乐镇 8、胡戈尔 34。
- 空显示名后的 `#...` 内部标识不属于玩家可见名称，不建立译名。

## 清单与实现

- [`../inventories/p2-comodo-fields.csv`](../inventories/p2-comodo-fields.csv)
- [`../inventories/p2-rachel-fields.csv`](../inventories/p2-rachel-fields.csv)
- [`../inventories/p2-veins-fields.csv`](../inventories/p2-veins-fields.csv)
- [`../inventories/p2-einbroch-fields.csv`](../inventories/p2-einbroch-fields.csv)
- [`../inventories/p2-lighthalzen-fields.csv`](../inventories/p2-lighthalzen-fields.csv)
- [`../inventories/p2-hugel-fields.csv`](../inventories/p2-hugel-fields.csv)

六份清单均从 Renewal 活动入口 `npc/re/scripts_main.conf` 递归展开 850 个活动脚本文件，并逐实例保留地图、坐标、完整内部名称、基础名称、译文、定义类型和服务端源文件行号。客户端 `P2MajorCityFieldNpcNameTable.js` 显式登记 77 个跨批次唯一 ASCII 基础名称；公共名称复用既有译名，人物名称优先采用当前服务端中文对话中的译名。

## 自动验收

- 六批分别得到 27、12、12、13、4 和 13 个唯一基础名称，全部命中显式映射，缺失数均为 0。
- 77 个映射值均包含中文字符；代表名称和所有超过 23 个字符的英文名称均由 `NpcNameTable.test.js` 检查截断映射。
- 客户端全量测试通过，共 49 个测试文件通过、1 个跳过，319 项测试通过；PWA 构建通过。
- 本批次未修改服务端脚本、地图键、内部标识或事件引用。

## 实机取样

每个地图族各选一个实际可见 NPC 做简单悬停取样，六处地图均成功载入，中文名称显示如下：

| 地图 | NPC 基础名称 | 悬停名称 |
| --- | --- | --- |
| `cmd_fild07` | `Kafra Employee` | 卡普拉员工 |
| `ra_fild08` | `Map Examiner Lucia` | 地图调查员露西亚 |
| `ve_fild01` | `Map Examiner Yirun Seo` | 地图调查员徐伊伦 |
| `ein_fild06` | `Map Examiner Bast` | 地图调查员巴斯特 |
| `lhz_fild01` | `Map Examiner Lipiri` | 地图调查员利皮里 |
| `hu_fild01` | `Tower Keeper` | 塔楼看守 |

实机只作简单取样，全范围完整性由逐实例清单和缺失数为 0 的自动检查保证。测试角色验收后已恢复到原地图和坐标。
