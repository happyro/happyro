# FE 城堡管理实机验证

2026-10-29，本机 Renewal / PACKETVER=20211103，独立测试公会11、普通权限角色「攻城盟友」，城堡 `aldeg_cas02`。角色等级、资金、装备和公会技能点由测试准备提供；占城攻击、技能学习、管家选择、卡普拉服务、击破宝箱及拾取均通过普通角色的实际客户端请求完成。未通过直接修改归属或管理击杀指令代替占城。

本页只证明下表覆盖的管理流程，不替代其他 FE／SE／TE 战斗、全部边界或重启持久化验收。

## 结果

| 项目 | 实际结果 | 证据 |
| --- | --- | --- |
| 普通攻击占城 | 核心100→72→0，归属由0变11，新核心100 | [初始](evidence/war-management/core-recheck.json)、[攻击中](evidence/war-management/capture-progress.json)、[占领](evidence/war-management/capture-3.json) |
| 管家非领主访问 | 公会11访问公会10的阿尔弗雷多，明确拒绝 | [对话](evidence/war-management/non-owner-denied.json) |
| 经济投资 | 第一次5000、第二次20000，同日第三次拒绝；累计次数2 | [服务端读回](evidence/war-management/server-evidence.log) |
| 防御投资 | 第一次10000、第二次40000，第三次拒绝；累计次数2 | [对话](evidence/war-management/defense-results.json) |
| 扣款一致性 | 两类投资共75000，资金1000000→925000 | [服务端读回](evidence/war-management/server-evidence.log) |
| 取消／资金不足 | 经济投资取消及余额0时拒绝；次数与余额保持0 | [取消](evidence/war-management/economy-cancel.json)、[不足](evidence/war-management/economy-insufficient.json) |
| 守护者前置 | 未学公会技能时拒绝；普通客户端学技能后召唤成功，槽0 installed=1、alive=1 | [未学技能](evidence/war-management/guardian-False.json)、[召唤](evidence/war-management/guardian-True.json)、[状态](evidence/war-management/server-evidence.log) |
| 重复召唤 | 已召唤槽位明确拒绝再次召唤 | [对话](evidence/war-management/guardian-duplicate.json) |
| 卡普拉雇用 | 未学契约技能拒绝，学技能后雇用成功 | [对话](evidence/war-management/kafra-hire.json) |
| 卡普拉解雇 | 取消解雇保留职员，双重确认后 enabled=0；后续重新雇用 | [取消](evidence/war-management/kafra-dismiss-cancel.json)、[解雇](evidence/war-management/kafra-dismiss.json)、[状态](evidence/war-management/server-evidence.log) |
| 卡普拉仓库 | 结束 NPC 对话后仓库真实打开 | [active=true](evidence/war-management/storage-open.json) |
| 卡普拉传送 | 实际传至艾尔帕兰，200 Zeny 费用正确 | [坐标](evidence/war-management/kafra-teleport.json)、[地图及余额](evidence/war-management/server-evidence.log) |
| 手推车职业限制 | Knight 租用被拒绝；本项不代表商人成功租车路径 | [对话](evidence/war-management/cart-class-denied.json) |
| 主人房 | 管家正常选择进入主人房，传送至134,225 | [测试截图](evidence/war-management/loot-picked.png)及执行记录所述流程 |
| 日结投资 | 受控触发本城日结后经济／防御0→2，投资次数归零 | [服务端读回](evidence/war-management/server-evidence.log) |
| 宝箱生成及领取 | 生成4个宝箱；真实普攻击破，捕获12676×1掉落，拾取ACK result=0且背包存在 | [掉落、ACK、背包](evidence/war-management/loot-live-747.json) |

经济投资前两次完整对话未独立保留，因此该项采用投资次数、余额变化与源码费用共同核对，不声称具备每一步的截图。

## 计时与证据边界

日结通过管理探针调用本城原生 `Treasure#aldeg_cas02::OnClock0001`，没有等待自然午夜。第一次用于验证投资增长和4个宝箱；第二次没有新增投资，仅为实时领取复测。不得把这两次受控触发描述为自然定时调度已验证。

第一次宝箱掉落后，较晚的拾取请求未见物品进入背包，原因未定，未记为通过或产品缺陷。复测在新掉落出现后立即发送当前协议的拾取请求，收到成功ACK并读取背包，才判定实际领取通过。所有结论均以具体字段为依据，测试辅助脚本中的保存提示不等于测试断言。

## 界面截图

以下四张均已逐张目视：六个菜单选项、中文标题、关闭按钮完整可见，没有菜单内容裁切或缺图。它们使用同一启用触摸的浏览器上下文调整视口，证明对应响应式布局；不冒充四台物理设备或不同浏览器兼容性测试。

| 视口 | 截图 |
| --- | --- |
| 平板横屏1024×768 | [查看](evidence/war-management/menu-tablet-landscape.png) |
| 平板竖屏768×1024 | [查看](evidence/war-management/menu-tablet-portrait.png) |
| 手机横屏860×430 | [查看](evidence/war-management/menu-phone-landscape.png) |
| 手机竖屏430×860 | [查看](evidence/war-management/menu-phone-portrait.png) |

其他关键截图：[占城](evidence/war-management/captured.png)、[桌面仓库](evidence/war-management/storage-desktop.png)、[领取宝箱物品](evidence/war-management/loot-picked.png)。

## 重启交接

重启持久化已由全局测试完成，数据库及实际实体、权限复验通过，见[最终汇总](war-final.md)。[重启前数据库快照](evidence/war-management/db-before-restart.tsv)来自 `SELECT * FROM guild_castle WHERE guild_id=11`：castle_id=1、guild_id=11、economy=2、defense=2、两类投资次数0、卡普拉启用1、守护者槽0启用1。重启后已读回并验证实际守护者与管家权限。

重启持久化与清理最终结果见[汇总](war-final.md)。
