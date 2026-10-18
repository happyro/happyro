# 随行功能问题与修复总结

[返回总览](README.md) · [测试覆盖](coverage.md) · [有效待办](pending.md) · [首轮问题详解](fixes.md)

更新日期：2026-10-19。此文汇总宠物、佣兵、生命体测试发现的实际问题；“已复验”仅指对应本机操作和构建，不表示已提交、已发布或全部分支验收。后续结果取自[补测证据摘要](evidence/followup-review.json)，初测失败不覆盖更晚的修复结果。

## 首轮已修复问题

| 编号 | 用户可见问题 | 修复及验证 |
| --- | --- | --- |
| C001 | 佣兵 HP/SP、击杀数等增量状态不更新 | 按正确状态枚举同步双端字段；战斗／药水／技能复验。后续双端 50 击杀补齐忠诚增加路径 |
| C002 | 重登丢失攻击模式、桌面保存值与实际模式不一致 | 初始化读取保存值，按实际布尔状态切换保存；双端整页重登后实战验证 |
| C003 | 部分生命体在被动模式仍主动打中立怪 | 过滤未交战的中立候选，保留交战／指定目标；代表物种复验，全部反击矩阵继续待办 |
| C004 | 无随行单位时桌面快捷键报空引用异常 | 打开前检查实体和窗口；空角色快捷键及首轮最终冒烟无异常 |
| C005 | 删除／消失／到期后留下旧信息和技能窗 | 生命周期清理所属窗口；删除与到期实测。后续确认框问题另见 C012—C014 |
| C006 | 技能窗口被信息窗口遮挡 | 点击阶段打开并置前；技能升级和真实施法通过，后续详情／拖放／缩放补齐 |
| C007 | 饰品文案错误、进化乱码、多分支总选第一项 | 使用实际饰品字段、中文蛋名和明确目标分支；后续全部 27 条双端成功 |
| C008 | 桌面中文改名静默截短并消耗资格 | 共用 UTF-8 23 字节校验，拒绝空白／控制字符／超限；双端边界后续补齐 |
| C009 | 生命体增量包误禁改名、零值不更新、实体名称滞后 | 区分增量字段、按标志位检查、接受零值、同步实体名；技能点耗尽及改名复验 |

首轮各问题的复现和源码定位见 [fixes.md](fixes.md)。下面单独记录后续新增问题，避免把旧清单中的“未复验”继续沿用。

## C010：客户端缺少当前服务端宠物进化配方

**现象与原因：** 客户端仍以旧 LUB 提供规则，缺少沙漠幼狼→沙漠狼、巨石怪→火焰巨石怪、EP17_2_CHILD_ADMIN1→2 三条当前配方。

**修复：** 从当前 Renewal 服务端数据库生成 107 宠物／27 进化规则，记录源哈希；Lua 仅提供外观，缺插画时清空旧背景。

**复验：** 27 条×双端共 54 个组合成功，目标蛋和材料消耗核对。桌面第12／14条另有问题，使用修复后复验替代初测失败；不能把旧52次成功当作最终全集。

源码：[生成器](../../../repos/happyro-client/scripts/generate-pet-rules.mjs)、[规则加载](../../../repos/happyro-client/src/DB/DBManager.js)。证据：摘要 `petEvolution`，原始 `pet/*-evolution-results.json` 及 `desktop-evolution-fixed-12/14.json`。

## C011：其他玩家宠物饰品广播污染自己的状态

**现象与原因：** 同屏其他宠物穿脱饰品时，自己的桌面窗口和进化资格被覆盖，处理器没有限制所属实体。

**修复：** 自己的 Session／信息窗口仅接受自己的宠物 GID；保留其他实体的外观与表演更新。

**复验：** `mveteds3` 双端真实并发穿脱，自己状态保持正确，对方外观和表演继续可见。记录 `foreign-real-reequip-desktop-remains-unarmed`、`foreign-mobile-equipped-final`。

源码：[Pet.js](../../../repos/happyro-client/src/Engine/MapEngine/Pet.js)。

## C012：旧桌面确认框误作用于新单位

**现象与原因：** 旧佣兵自然到期后解除确认仍在，新召唤后点旧确认会删除新佣兵；宠物旧喂食确认也存在相同风险。回调没有绑定最初的主人和单位对象。

**修复：** 公共确认逻辑绑定主人、单位 GID 和实体引用；消失、主人死亡、切图、断线时清理，过期回调与重复确认不执行。

**复验：** `desktop-stale-feed-fixed`、`desktop-fixed-expiry-prompt-cleared`、`desktop-fixed-new-contract-after-expiry`；另有双端切图／死亡操作记录及公共确认回归。完整中断矩阵仍按有效待办收尾。

源码：[CompanionPrompt.js](../../../repos/happyro-client/src/UI/Game/CompanionPrompt.js)、[Entity.js](../../../repos/happyro-client/src/Engine/MapEngine/Entity.js)、[MapEngine.js](../../../repos/happyro-client/src/Engine/MapEngine.js)。

## C013：旧进化窗可进化新孵化宠物

**现象与原因：** A 开进化窗→收回 A→孵化 B→旧窗确认，B 被进化并消耗材料。

**修复：** 进化窗绑定主人、实体、GID、物种，执行时复核存活、亲密、饰品和材料；生命周期关闭旧窗，等待回包时锁住重复提交。

**复验：** `stale-evolution-window-cleared`、`stale-evolution-new-pet-safe` 中 B 保持波利，材料不消耗；桌面双击仅一个进化请求。双端确认期间真实材料减少后均不发进化请求。移动替换宠物的独立矩阵仍待核齐。

源码：[PetEvolution.js](../../../repos/happyro-client/src/UI/Components/PetEvolution/PetEvolution.js)。

## C014：移动宠物失效后确认框残留

**现象与原因：** 主人死亡或宠物消失后，宠物操作资格失效，但已打开的确认流程没有同步取消。

**修复：** 状态更新发现 `allowed=false` 时关闭当前确认。

**复验：** `mveu2lju` 的 `mobile-rename-pet-disappears-fixed` 和后续 `petFeed-confirm-owner-death` 通过。保留修复前失败，不将同名旧记录误当最终结果。

源码：[PetPanel.js](../../../repos/happyro-client/src/UI/Mobile/game/PetPanel.js)。

## C015：桌面重复改名发送多个请求

**现象与原因：** 真实快速双击在权威回包前发送两次宠物或生命体改名请求；生命体部分拒绝路径未回送状态，客户端不能可靠解锁。

**修复：** 宠物／生命体发送后锁定 pending，由服务器权威状态恢复；宠物重新打开时请求当前信息。服务端生命体拒绝改名时回送信息。

**复验：** `mveu2lju` 的 `desktop-rename-double-click-fixed`、`desktop-hom-rename-double-click-fixed` 均通过；宠物重登后改名资格与服务器一致。拒绝条件全矩阵仍需归并，不能只凭成功双击复验外推。

源码：[PetInformations.js](../../../repos/happyro-client/src/UI/Components/PetInformations/PetInformations.js)、[Homun.js](../../../repos/happyro-client/src/Engine/MapEngine/Homun.js)、[homunculus.cpp](../../../repos/happyro-server/src/map/homunculus.cpp)。

## C016：背包放不下佣兵卷轴仍扣费用

**现象与原因：** 满包或超重时 NPC 先扣一阶 Zeny／十阶忠诚度，发物品失败却仍显示购买成功；两个分支没有容量检查。

**修复：** 扣费前用 `checkweight` 检查卷轴可携带性，不能携带时直接提示。

**复验：** 双端满包／超重×一阶／十阶共8种拒绝条件，SQL核对费用不变；恢复正常后两种购买分别扣7000 Zeny与400忠诚并获得卷轴。摘要来源 `npc-fixed-sql-verification.json`。

源码：[mercenary_rent.txt](../../../repos/happyro-server/npc/other/mercenary_rent.txt)。

## C017：佣兵 ATK 奖励未更新实际使用的攻击字段

**现象与原因：** 桌面50击杀获得 MER_ATK，界面 ATK 未变；Renewal 重算更新 `watk`，佣兵伤害／状态包却使用右手攻击范围。初测少量伤害样本不足以单独证明效果失效。

**修复：** 佣兵重新计算右手攻击上下界，使奖励参与实际字段。

**复验：** 后续桌面奖励期间 ATK292、结束后236，期间非零伤害268–305，有状态开始／结束记录。此结论仅覆盖该复验，未宣称所有随机奖励双端通过。

源码：[status.cpp](../../../repos/happyro-server/src/map/status.cpp)。证据：`mercenary/atk-fixed-expiry-analysis.json` 的脱敏结论见摘要。

## C018：生命体 S 被动攻击加成被后续重算覆盖

**现象与原因：** 学习扣点成功但 ATK／MATK不变。固定加成先于基础重算被覆盖；首次调整顺序后，魔法加成又在 Renewal MATK 重算时丢失。

**修复：** 固定加成移到基础重算后，并在战斗 MATK重算保留已学习技能产生的固定差值。

**复验：** 物理被动已有双端增益记录；第二次修复后，双端8046 MATK479→1179、8055 ATK794→1194且MATK479→879、8052 ATK794→1294且MATK479→729。早期报告“魔法加成待部署”已被后续结果替代。

源码：[status.cpp](../../../repos/happyro-server/src/map/status.cpp)。[双端属性日志摘录](evidence/followup-matk-result.txt)。

## C019：生命体地面技能停在范围外施放

**现象与原因：** Blast Forge范围1，客户端少走一格就发请求，服务器拒绝；随行地面技能沿用了额外 `+1` 距离。

**修复：** 生命体／佣兵地面技能按实际范围移动。

**复验：** 双端后续 `skill-8044` 有移动到1格内、ACK、115SP消耗、地面单元与伤害／击杀；不能只凭请求发送记成功。

源码：[Skill.js](../../../repos/happyro-client/src/Engine/MapEngine/Skill.js)。

## C020：艾莉诺连段后续技能丢失敌人目标

**现象与原因：** 正常快捷键首段命中并产生连段窗口，后续 Self 类型技能指向自身，服务器没有解析前段敌人，连段静默失败。

**修复：** 服务端仅对生命体四个后续连段技能，从有效 `SC_COMBO` 校验前置技能并解析原敌人，继续执行存活／距离等检查。

**复验：** 双端 `eleanor-fighting-combo-fixed` 与 `eleanor-grappling-combo-fixed` 两条三段链均成功；每段有同一目标伤害与SP消耗。

源码：[unit.cpp](../../../repos/happyro-server/src/map/unit.cpp)。

## C021：艾莉诺技能目标分类

**状态：代码已修改，完整效果审计待闭环。** `MH_BLAZING_AND_FURIOUS` 从 Support改为Attack，后续双端存在 `skill-8050` 尝试记录；本次未将记录存在等同目标选择及完整技能效果通过。

源码：[skill_db.yml](../../../repos/happyro-server/db/re/skill_db.yml)。须补齐部署版本和权威效果判定，见[有效待办](pending.md)。

## 尚待实机复验的显示问题

**桌面长宠物名截断：** 1024×768、1920×1080均复现。已改名名称输入框禁用，内容宽115、可见宽74，无完整名称提示。当前提交已为名称补title和无障碍标签，尚缺完整内容可读性的实机复验；移动四个测试视口名称可读。此项保留待办，不与上述已修复项目混计。

## 验证与发布状态

后续13个测试文件105项通过，完整 `--all` 构建为 `mveu2lju`；部分更早复验使用 `mveteds3`。覆盖整理之后已完成产品提交，并重跑105项客户端测试、5组服务端专项回归、完整PWA `mvevr9vw` 构建与Gateway清单产物哈希核对，见[提交校验记录](evidence/commit-check.json)。全部技能、真实设备和最终游戏验收尚未完成；未推送或发布。
