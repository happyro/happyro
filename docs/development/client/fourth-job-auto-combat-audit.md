# 12 个主流四转职业系：自动战斗代码审查

日期：2026-10-25。基线为当前工作区，包括上一轮尚未提交的自身增益实现。此次只审查，没有修改产品实现，也没有提交或推送。三个并发审查覆盖职业技能，主审复查公共调度、完整性、严重路径及误报。

## 结论

当前自动战斗尚不能视为全面支持四转职业。失败与无回执均有有界恢复，没有发现 JavaScript 线程死锁；但“成功执行却不造成战斗进展”无法触发兜底，另有技能分类、父子执行回执及前置条件方面的明确缺口。

第一版只开放七个自身增益是已确认的产品范围，不将其余四转增益未开放一概列为缺陷。真正的伤害技能被隐藏、辅助技能被当作攻击、状态机不识别真实成功，才属于本次问题。

## 覆盖范围与证据

按服务端 `SkillTreeDatabase::loadingFinished` 实际语义合并 `db/re/skill_tree.yml` 的直接 Inherit（跳过 Exclude，使用本树覆盖并移除 MaxLevel=0），包含一至四转静态技能。诗人／舞娘合算一个职业系，但男女技能树独立审查。

| 职业树 | 技能数 |
| --- | ---: |
| Dragon Knight | 59 |
| Imperial Guard | 73 |
| Arch Mage | 81 |
| Elemental Master | 96 |
| Cardinal | 80 |
| Inquisitor | 81 |
| Meister | 92 |
| Biolo | 74 |
| Shadow Cross | 60 |
| Abyss Chaser | 77 |
| Windhawk | 71 |
| Troubadour | 76 |
| Trouvere | 76 |
| 合计 | 996 |

共 804 个不同技能。逐项类型、条件及分类清单见 [覆盖表](./fourth-job-auto-combat-coverage.json)。第二轮按服务端实际继承算法重算，移除了每棵树不可继承的 NV_TRICKDEAD；第一轮递归集合多计了这13条，但没有遗漏有效技能。当前清单验证各职业集合完全一致、无重复。覆盖不代表每项技能已实机验证；静态一般条目检查目标类型与条件，异常条目继续追到 C++ 实现、入口守卫及回包。

复制／繁殖、装备临时授予、任务脚本动态给予的跨职业技能不属于静态技能树集合；这些仍可能经过同一公共候选逻辑，后续应由显式技能能力表统一约束。

详细分组证据及完整 Requires、Unit、源码引用保存在 `work/auto-combat-fourth-audit/{martial.md,magic.md,specialist.md}`；原始覆盖、独立集合校验、源码哈希及运行封包也在该目录。该目录是本机审查产物，不包含在公开文档站。

## P1：优先处理

### A1：成功无伤害动作可以持续挤占攻击

`GameAutoCombat.js:72` 把非白名单候选统一归为 attack；`AutoCombatController.js:201` 反复选择可用技能；`AutoCombatSkillState.js` 收到同 ID executed 后直接清空等待。只有失败或超时才退避。新调度器的两次增益预算只适用于自身 buff，不覆盖挑衅、敌方减益、标记或工具操作。

**实机确认**：专用龙骑士单选 SM_PROVOKE，对新生成的波利在 6.5 秒内收到 7 次成功施放；自身没有普通攻击封包，SP 从 3741 降至 3702（期间有自然恢复）。目标存活，随后清空技能改普攻即可击杀。证据 `provoke-live.json`。这不是无限时间的线程死锁；SP不足、停止或其他条件变化仍能结束，但自动SP恢复可以使这种无进展行为长期持续。

NC_DISJOINT 对普通敌对魔物的实现也仅拆指定 FAW，仍返回成功；其 YAML 无独立冷却/全局后延迟，但必须满足距离、扳手与SP且不被打断才会反复执行。该具体技能未另实测，不能将一个实测覆盖到全部技能。

**建议**：将伤害、减益／标记、准备、工具操作分开。对有用的非伤害动作设置状态/频率规则与连续预算，之后保证攻击机会；工具技能不放入攻击池。不能靠“所有 NoDamage 都删除”解决，因为部分真实攻击先发无伤害动画再执行伤害。

### A2：交互、治疗和防御地面技能误列为攻击

`GameAutoCombat.js:55` 接纳全部 PLACE，执行器统一以魔物坐标施放。已确认：

- HT_TALKIEBOX：实际需要输入留言。**实机自动弹出留言框**，没有发送技能执行请求；证据 `severe-live.json` 与 `talkie-auto-modal.png`。后续被当作待确认技能；自动攻击不应打开这种交互。
- NC_MAGICDECOY：需要第二阶段元素选择；有父地面成功回执，不能声称一定等待8秒。AL_WARP 同样需要传送地点交互，初次请求不耗蓝石，不能误报初次即消耗材料。
- CR_SLIMPITCHER：只治疗队伍／公会成员，合法落点与资源满足即可耗药；把魔物脚下当治疗落点可能空耗药水，不是治疗魔物。
- MG_SAFETYWALL、AL_PNEUMA：代码与当前配置支持它们保护魔物。`conf/battle/skill.conf:99 defunit_not_enemy:no`；`skill.cpp:15781` 的 NoEnemy 行为取决于此配置，`:6480/6494` 的入区处理不限制玩家，`battle.cpp:1439/1474` 可阻挡近战／远程伤害。此路径代码确认，未单独实测，不把保护效果标成实测结果。
- SC_DIMENSIONDOOR 可能改变玩家／配置允许的魔物位置；SC_BLOODYLUST、涂鸦等也不是普通打怪攻击。

**建议**：显式技能用途和目标策略；交互与工具技能从普通自动攻击候选中排除。地面治疗、防御、陷阱需要各自策略，不能共用“向魔物脚下放”。

### A3：父技能请求与子技能执行回包无法关联

`AutoCombatSkillState.feedback` 严格要求 pending.id 与执行事件 ID 相同。WL_CHAINLIGHTNING 2214 实际由 `skills/mage/chainlightning.cpp:14` 调度 2215 伤害；客户端原样上报。

**实机确认**：收到2214读条和2215伤害11617，没有2214执行回执。该次波利被击杀，因此运行中会因目标结束清理等待，不能声称这次现场完整观察到了超时。随后将真实读条/伤害事件按原时间回放到当前状态机，假定目标存活，确认子ID被忽略、父请求最终超时。证据 `chain-live.json`、`chain-replay.json`。

WL_TETRAVORTEX 2217→2218–2221 同类；WL_RELEASE 需区分魔法书与球分支。ABC_ABYSS_FLAME 6515 在自身周边无敌人、攻击远处目标时可能仅有6522回执（父范围2/3格，目标射程9），属有条件的同类缺口，未实测。

**建议**：经过审核的父请求→执行事件关联表，结合施法者、目标及请求生命周期；不能收到任意额外伤害就解锁，也不能把后续多段伤害都当新请求确认。

## P2：功能完整性与效率

### A4：大量自身中心伤害技能不可选择

入口把 SELF 除七个增益外全部排除。例：SHC_IMPACT_CRATER、ABC_ABYSS_DAGGER、MT_AXE_STOMP、MT_MIGHTY_SMASH、BO_EXPLOSIVE_POWDER、AG_RAIN_OF_CRYSTAL、AG_CRYSTAL_IMPACT、IQ_MASSIVE_F_BLASTER 等；继承技能还有怒爆、龙之气息之外的自身范围攻击、斧头飓风、手推车龙卷风等。IQ_MASSIVE_F_BLASTER 已有克制规则，但入口排除使其无法运行。

这不是增益白名单范围问题。需独立 self-area-attack 类型：先接近至有效范围，再以自身为施法目标；保留状态／形态分支。例如 Climax 不同等级可能将魔法改变为自身／友方增益，不能简单开放全部SELF。

### A5：前置状态、AP、装备、材料和目标资格预检不足

当前主要只查冷却、SP及七个增益特例。已学技能被错误标成可用；失败退避按魔物ID隔离，所以同一角色级资源缺失换怪就重试。

- Imperial Guard 的四个 Attack Stance 前置技能；十字影武的 Weaponblock/Rollingcutter 前置；Biolo 的 Mystery Powder；各气弹、弹药、炮弹、Mado、武器限制。
- AP消耗如 Astral Strike、Rush Quake、Hawk Boomerang 等未提前判断。
- EM_ACTIVITY_BURN 只对玩家有效，而自动目标全是魔物。
- Inquisitor 第二／第三阶段缺信仰状态时，`skill.cpp:8999–9013` 静默返回false。**实机5249无相关执行／失败回包，约9.48秒后才出现后续普通攻击触发的伤害效果**，与超时回退一致；不是永久死锁。证据 `severe-live.json`。

**建议**：独立条件求值器，区分角色级不可用与目标级失败；只预检可可靠观察的条件，服务端仍是最终裁决。暂不实现完整连招时应明确禁用未就绪阶段技能，而不是用超时充当正常路径。

### A6：陷阱与已有场地依赖未建模

11个 NoFootSet 陷阱仍固定投在魔物脚下，当前 `skill_nofootset:1` 会检查 BL_CHAR 占位，静止目标下确定被拒绝。四转陷阱的 flags 不完全相同，不可一概套用。

GN_FIRE_EXPANSION 依赖本人既有火焰领域，RA_DETONATOR 依赖陷阱；没有前置也可能有父地面成功回执，当前未检查实际效果条件。需要专门落点／场地策略，不能只检查请求成功。

### A7：明确种族克制加成遗漏

服务端已有而客户端纯评分表缺少：DK_DRAGONIC_AURA（人形／天使）、IG_GRAND_JUDGEMENT 与 IG_JUDGEMENT_CROSS（植物／昆虫）、SHC_FATAL_SHADOW_CROW（人形／龙）。应补规则及代码测试；不需要实机。

## 已排除的误报与边界

- DK_SERVANT_W_PHANTOM：局部实现无标记早退不代表入口允许。`unit.cpp:2468` 提前检查标记；实机 cause10 后普攻有效。仅保留前置条件预检不足，不列P1成功空放。
- SO_WARMER 不治疗魔物，入区明确限玩家；CR_SLIMPITCHER 也不是治疗敌人。
- WH_WIND_SIGN 有30秒独立冷却，WM_RANDOMIZESPELL有5秒独立冷却，NC_ANALYZE有1秒全局后延迟。缺状态判断仍需优化，但不能据此断言它们永远不普攻。
- Rose Blossom、Biolo四属性区域、Hawk Rush、Severe Rainstorm、Crazy Weed 有父技能确认，不能仅因存在子伤害ID就列为A3。
- 正常HP、SP、AP、材料和Zeny消耗不是禁止自动使用的理由；需呈现/检查真实条件。特殊风险技能另行审核。

## 推荐修复顺序

1. 修复P1：技能用途准入、非伤害动作预算、父子执行事件关联。
2. 补充条件求值与失败域；阶段／连招未就绪时禁用，避免空等。
3. 正式支持自身范围攻击与陷阱落点；在能力表中逐技能声明行为和前置。
4. 补齐已知克制规则，并针对所有804个技能做分类覆盖断言；普通与特殊路径分别测试。
5. 另一个独立工作再扩展四转增益白名单，不把本次审查变成“所有技能都无条件自动”。

本轮运行验证仅用于严重问题，未对12系全面实测。全部专用角色的职业、等级、属性与点数已恢复，生成的波利已击杀；对应清理证据为各 `*-fixture-cleanup.json` / `fixture-cleanup.json`。

## 第二轮交叉复查

复查新增回包代际隔离、玩家限定／静默失败技能、父子技能属性评分及种族加成遗漏，并纠正覆盖统计。详见 [第二轮报告](./fourth-job-auto-combat-second-audit.md)。
