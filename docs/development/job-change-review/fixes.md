# 转职缺陷修复记录

截至2026-10-18，以下六项已确认缺陷均已修复并通过针对性回归。整线验收结果见[总览](README.md)。

## NPC 对话与冒险工具转职互相覆盖

- 复现：初心者在剑士转职对话的最后一页暂停，用冒险工具转为服事，再点击 NPC 的「继续」，职业被旧对话覆盖为剑士。
- 影响：两条转职流程并发执行；修改等级也可能使已经通过的 NPC 前置条件失效。
- 修复：地图服务在 NPC 对话期间拒绝 `character.progression.update`，修改前返回冲突；后端返回 HTTP 409 和「请先结束 NPC 对话，再修改职业或等级」。结束对话后允许正常修改。
- 修复前证据：[实机复现](evidence/npc-job-change-concurrency-before.json)。
- 自动验证：地图服务构建通过；AdventureToolControllerTest 29 项、236 个断言通过，Pint 通过。
- 实机回归通过：[证据](evidence/npc-progression-regression.json)。真实 UI 转职及 Base／Job 修改均返回 409，职业和等级保持不变；继续 NPC 对话正常转为剑士，关闭后可正常使用冒险工具转为服事。

## 猎人考试怪物专用名称被覆盖

- 实机复现：服务端名称回复为「职业测试员怪物」「虎蜥人」「职业转换怪物」，客户端却显示「腐尸」「木乃伊」，使目标辨认失去可靠依据。[修复前证据](evidence/hunter-name-before.json)。
- 原因：客户端 `localizeEntityName` 无条件按外观职业编号查中文怪物表，覆盖服务器提供的任务名称。
- 修改：显式服务端名称优先，跨缺少名称的外观刷新保留已收到的名称；尚无服务端名称时继续使用中文表。覆盖出生、身份回复及后续改名。
- 验证：名称及 NPC 封包相关 12 项测试通过；全量 PWA 构建成功，Gateway 校验新产物通过（mvd6sop2）。新构建实机回归通过，同一考试中服务端回复与客户端实体显示的名称逐条一致：[修复后证据](evidence/hunter-name-after.json)。猎人转职及后续游侠三项实践考试均已通过，狼考试最终为12/20，见游侠攻略及对应证据。

## 大主教试炼入场监控提前清空任务

- 复现：神官完成巡礼，与 `job3_arch01 29,34` 女武神对话，确认后到达 `job3_arch02`，却无法领到必需的古代语言卷轴；离开再进入起点触发区也无效。
- 原因：入场脚本在 `close2` 前启动监控；`close2` 会等待客户端关闭确认，监控发现角色仍在前厅，于是清空考场归属和阶段。随后才执行传送，角色进入失效试炼。[原生重试](evidence/archbishop-trial-reentry.json)、[诊断日志](evidence/archbishop-entry-before.log)。
- 修复：先完成关闭确认，再复核等级、任务、负重及考场空闲状态；同一段连续执行占用、传送与启动监控，避免在已占用状态等待客户端。
- 实机回归：地图服务成功加载新脚本，卷轴领取、使用及女武神召唤已恢复。慢速关闭对话的独立回归已通过：停留 3.5 秒后正常入场、领卷轴和召唤化身，[回归证据](evidence/archbishop-entry-after.json)。后续完整大主教转职、枢机主教四转及正常重登均已通过，见[大主教流程与证据](walkthroughs/03-archbishop.md)。

## 游侠炸弹考试的爆炸范围提示错误

- 实机考试公告声称爆炸范围为「5×5 格」，与当前技能定义不符；第二轮角色在炸弹关死亡，死亡原因需结合落点进一步核对，不单凭死亡断定提示是唯一原因。
- 代码证据：`db/re/skill_db.yml` 中技能 173 `NPC_SELFDESTRUCTION` 的 `SplashArea` 为 5；`src/map/skills/npc/suicidebombing.cpp` 把该值作为 `map_foreachinshootrange` 的范围参数。物品 12258 召唤的怪物 1904 使用该技能，施放时间为 3000 ms。
- 修复：考试公告改为「周围 5 格」并提示与炸弹拉开至少 6 格；不修改技能范围、伤害或计时。
- 实机回归通过：加载脚本后，下一轮原生考试实际广播「周围 5 格」及「至少拉开 6 格」，并按该范围正常使用完 10 个胶囊、通过第二关。[修复后公告](evidence/ranger-blast-warning-after.json)、[实践考试](evidence/ranger-practical-tests.json)。

## 已回归：十字军已通过后计时结束返回错误地点

Mac 实测 JobDirectF 击败四波怪物后，数据库只读核对 `CRUS_Q=10`；角色尚在最终怪物位置时，241 秒计时器把角色送回 `job_cru 24,169`。再次进入等候室又因任务阶段不是 9 被退回，无法走正常考试出口。原始证据见 `crusader-combat-macos.json`、`crusader-final-target-macos.json`；本地运行日志在 `work/job-change-audit/crusader-finish.log`。

已修改 server 共用十字军脚本：计时到达时区分通过与未通过，已通过者送回 `prt_cas 238,94`；等候室同样允许已通过者返回。未修改击杀数、怪物、任务通过条件或时限。**已在 macOS 单独重载共用与 Renewal NPC 文件，独立回归通过**。重载共用文件会连带卸载 Renewal duplicate，必须随后重载 `npc/re/jobs/2-2/crusader.txt`；已核验两个文件加载成功。普通新角色 JobCruRegM 已验证未通过超时返回等候室（采样244674ms，`job_cru 24,169`），[证据](evidence/crusader-failed-timeout-macos.json)。成功分支同样通过：新角色普通攻击完成四波，在场内等待原生 241 秒计时；248312ms 轮询采样确认返回 `prt_cas 238,94`，随后正常与导师交谈成为十字军（14，Job 1）。[成功分支证据](evidence/crusader-passed-timeout-macos.json)。两条分支均未修改任务变量、计时或通过条件。

## 已回归：NPC 进度条四舍五入导致提前完成

皇家卫士教堂挖掘 5 秒后没有对话或产物。只读数据库确认任务阶段为 4；实际捕获 `CZ.PROGRESS` 在 4980ms 发出，早于 5000ms。客户端 `EntityCast.render` 将比例四舍五入至两位小数后判断完成；服务端严格检查截止时间并将提前通知视为取消。证据：[修复前计时](evidence/royal-guard-progress-timing-before.json)。

修复改为直接比较实际毫秒与持续时间。5 秒和 7 秒的边界单测均通过；完整 `--all` PWA 构建完成，Gateway 全部关键产物哈希核验通过，buildId 为 `mvdeye43`。重开浏览器后 6 次原生挖掘完成通知均在 5003–5016ms 发出，正常获得挖掘结果和后续对话：[修复后计时](evidence/royal-guard-progress-timing-after.json)、[原生挖掘](evidence/royal-guard-dig-after-macos.json)。没有修改服务端时限或直接发放任务布料。
