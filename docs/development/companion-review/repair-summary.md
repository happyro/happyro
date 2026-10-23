# 随行功能问题与修复总结

[返回总览](README.md) · [测试覆盖](coverage.md) · [有效待办](pending.md)

更新日期：2026-10-19。此文汇总宠物、佣兵、生命体测试发现的实际问题；“已复验”仅指对应本机操作和构建，不代表全部分支验收。后续结果取自[补测证据摘要](evidence/followup-review.json)，初测失败不覆盖更晚的修复结果。

## 首轮复现与修复依据

以下 C001—C009 的验证范围对应 2026-10-19 首轮记录。后续双端名称边界、技能控件、进化矩阵和 50 击杀结果见[覆盖表](coverage.md)；当前缺口以[有效待办](pending.md)为准。记录 ID 见[observations.json](evidence/observations.json)。

## C001：佣兵增量状态与菜单不同步

**发现：** 真实击杀后，服务端回包参数 `189` 的值已为 `1`，移动端菜单仍显示击杀数 `0`。同一处理器把 HP/SP 当成参数 `0～3`，与服务端使用的 `5～8` 不一致，也遗漏了战斗属性和忠诚度。

**解决：** 使用状态枚举映射增量字段，更新移动端状态模型和实体血蓝条；桌面合并增量数据，保留名称、契约和其他字段。

**验证：** `mercenary-kill-counter-live` 保留修复前回包与显示差异；`mobile-mercenary-fixed-live-update`、`desktop-mercenary-kill-counter-fixed` 证明实战计数更新；`desktop-mercenary-skill-cast` 证明 SP 200→188。忠诚度核对了新契约中的值，未完成 50 次击杀增量场景。

源码：[Mercenary.js](../../../repos/happyro-client/src/Engine/MapEngine/Mercenary.js)。自动化：[MobileCompanionProtocol.test.js](../../../repos/happyro-client/tests/ui/MobileCompanionProtocol.test.js)。

## C002：攻击模式不恢复，桌面写入值错误

**发现：** 整页重新登录后，AI 默认回到被动模式，没有恢复保存值；桌面开关把 `localStorage` 返回的字符串与数字 `0` 做严格比较，导致保存值和实际 AI 状态不一致。

**解决：** 页面初始化读取 `'1'`／`'0'`；桌面切换按实际 AI 布尔状态保存，移除初始化时的两次无意义切换，同步右键菜单判断。

**验证：** `mobile-final-full-page-relogin` 保留重登后的主动状态；`desktop-final-full-page-mode-persistence` 在整页重登后再次实际击杀，确认模式继续生效。

源码：[AIDriver.js](../../../repos/happyro-client/src/Core/AIDriver.js)、[EntityControl.js](../../../repos/happyro-client/src/Controls/EntityControl.js)、[生命体窗口](../../../repos/happyro-client/src/UI/Components/HomunInformations/HomunInformations.js)、[佣兵窗口](../../../repos/happyro-client/src/UI/Components/MercenaryInformations/MercenaryInformations.js)。自动化：[AIDriver.test.js](../../../repos/happyro-client/tests/core/AIDriver.test.js)、[DesktopCompanions.test.js](../../../repos/happyro-client/tests/ui/DesktopCompanions.test.js)。

## C003：部分生命体在被动模式下仍主动选怪

**发现：** 巴尼米乐斯在被动状态仍攻击中立罗达蛙。原始 AI 对部分物种自行搜索全部可见魔物，关闭客户端附加的主动选敌逻辑不足以阻止该行为。

**解决：** 被动模式下，AI 的候选实体列表排除未交战的中立魔物；保留当前交战、反击及玩家已指定的目标。

**验证：** 修复前为 `desktop-homunculus-passive-unexpected-attack`；修复后 `desktop-passive-mode-fixed` 无主动攻击请求且目标仍存在。移动端飞里乐在 `mobile-passive-species-regression` 中攻击请求为 0，切主动后的 `mobile-active-species-regression` 记录 14 次攻击请求及目标消失。反击和玩家指定目标的保留由自动化覆盖，尚未做完整双端实战矩阵。

源码：[AIDriver.js](../../../repos/happyro-client/src/Core/AIDriver.js)。自动化：[AIDriver.test.js](../../../repos/happyro-client/tests/core/AIDriver.test.js)。

## C004：无随行单位时桌面快捷键访问空窗口

**发现：** 第一次进入没有随行单位的角色，按宠物、生命体和佣兵信息快捷键均产生 `Cannot read properties of null (reading 'style')`。窗口尚未初始化，处理器已访问 `_host.style`。

**解决：** 打开信息窗前检查窗口与对应实体是否存在。

**验证：** 最初的 3 条页面异常保留在[verification.json](evidence/verification.json)；新空角色的 `desktop-empty-shortcuts-fixed` 和最终构建的 `final-build-smoke` 均无页面异常。

源码：[宠物窗口](../../../repos/happyro-client/src/UI/Components/PetInformations/PetInformations.js)、[生命体窗口](../../../repos/happyro-client/src/UI/Components/HomunInformations/HomunInformations.js)、[佣兵窗口](../../../repos/happyro-client/src/UI/Components/MercenaryInformations/MercenaryInformations.js)。自动化：[DesktopCompanions.test.js](../../../repos/happyro-client/tests/ui/DesktopCompanions.test.js)。

## C005：单位消失后留下旧信息或技能窗口

**发现：** 桌面删除生命体后，实体已消失，信息窗口仍显示原有数据和操作；消失路径原先主要停止 AI，没有统一清理所属窗口。

**解决：** 自己的宠物、佣兵、生命体消失时隐藏相应信息窗，清理随行技能窗并停止生命体喂食计时；快捷键不再重开不存在实体的旧信息。其他玩家的单位消失不关闭自己的窗口。

**验证：** `desktop-homunculus-deleted` 的修复前窗口仍可见；`desktop-homunculus-delete-cleanup-fixed` 证明删除后隐藏且不能重开。`desktop-contract-expiry-fixed` 证明 15 秒测试契约到期后信息、技能窗同时关闭。移动端的空状态和操作禁用另有记录。

源码：[Entity.js](../../../repos/happyro-client/src/Engine/MapEngine/Entity.js)及三个信息窗口。自动化：[EntityLifecycle.test.js](../../../repos/happyro-client/tests/engine/EntityLifecycle.test.js)。

## C006：技能窗口打开后被信息窗口遮挡

**发现：** 点击生命体技能按钮后，技能窗 `z-index=84`，信息窗为 `85`，升级控件被遮挡。技能窗在 `mousedown` 阶段打开，随后信息窗又获得焦点。

**解决：** 生命体和佣兵技能按钮改在 `click` 阶段打开并置前；技能窗标题改为中文。

**验证：** 修复前 `desktop-skill-window-obscured` 保留层级数据；修复后实际完成生命体升级、前置解锁和点数耗尽，并从两个技能窗分别施放“奇想”Lv.5、“双重扫射”Lv.2。技能详情、拖放快捷键、施放等级调节等控件仍待补测。

源码：[生命体窗口](../../../repos/happyro-client/src/UI/Components/HomunInformations/HomunInformations.js)、[佣兵窗口](../../../repos/happyro-client/src/UI/Components/MercenaryInformations/MercenaryInformations.js)、[SkillListMH.js](../../../repos/happyro-client/src/UI/Components/SkillListMH/SkillListMH.js)。[升级截图](evidence/desktop-homunculus-skill-upgraded.png)。

## C007：桌面宠物状态文案与进化分支错误

**发现：** 饰品状态显示成“装备穿戴失败”；进化名称直接使用未解码的宠物字符串而乱码；多个进化选项只传入原宠物种类，进化窗口总取第一个目标。

**解决：** 饰品状态按实际装备字段显示并接收增量更新；进化选项与窗口使用物品中文名，显式传递目标蛋 ID 并读取该分支材料；装备饰品时先提示卸下。

**验证：** `desktop-pet-accessory-evolution-guard`、`desktop-pet-unequip` 验证装备状态；波利→大师波利成功并扣除材料。`desktop-pet-second-evolution-branch` 显示第二分支“甜心波利之蛋”及其材料，`desktop-pet-evolution-insufficient-materials` 没有发送进化请求。第二分支成功进化尚未实测；提交正确目标 ID 的逻辑另有自动化测试。

源码：[PetInformations.js](../../../repos/happyro-client/src/UI/Components/PetInformations/PetInformations.js)、[PetEvolution.js](../../../repos/happyro-client/src/UI/Components/PetEvolution/PetEvolution.js)、[Pet.js](../../../repos/happyro-client/src/Engine/MapEngine/Pet.js)。自动化：[DesktopCompanions.test.js](../../../repos/happyro-client/tests/ui/DesktopCompanions.test.js)。[第二分支截图](evidence/desktop-pet-second-evolution-branch.png)。

## C008：桌面中文改名被静默截短

**发现：** 输入 8 个汉字“八个中文测试名字”后，宠物变成“八个中文测试名”，并消耗唯一改名机会。桌面入口发送前没有验证 UTF-8 字节上限。

**解决：** 宠物和生命体共用发送前名称校验：修剪首尾空白，拒绝空名称、控制字符以及超过 23 个 UTF-8 字节的名称。

**验证：** `desktop-pet-long-name` 保留修复前结果；`desktop-pet-long-name-rejected` 和 `desktop-homunculus-long-name-rejected` 验证超长拒绝；合法中文及一次改名限制通过实测。空名称、控制字符等校验有自动化覆盖，尚未逐项双端实测。

源码：[CompanionName.js](../../../repos/happyro-client/src/Utils/CompanionName.js)、[Pet.js](../../../repos/happyro-client/src/Engine/MapEngine/Pet.js)、[Homun.js](../../../repos/happyro-client/src/Engine/MapEngine/Homun.js)。自动化：[DesktopCompanions.test.js](../../../repos/happyro-client/tests/ui/DesktopCompanions.test.js)。

## C009：生命体改名资格、零值和场景名称不同步

**发现：** 桌面普通增量状态包没有 `bModified`，却进入完整信息更新并禁用改名；标志使用大小比较；技能点和属性的零值被真值判断跳过；窗口已显示新名称时，场景实体仍可能显示旧名称。

**解决：** 增量状态按对应字段处理；仅在收到名称标志时检查已改名位；允许 0 值更新；完整生命体信息同步场景实体名称。

**验证：** 双端技能点耗尽后显示 0 且不能继续升级；`desktop-homunculus-name-synchronized`、`mobile-final-rename-synchronized` 核对窗口、改名限制与实体名称；桌面死亡条件下用正常技能复活。其他零属性增量由自动化验证，未逐项全部实机覆盖。

源码：[Homun.js](../../../repos/happyro-client/src/Engine/MapEngine/Homun.js)、[HomunInformations.js](../../../repos/happyro-client/src/UI/Components/HomunInformations/HomunInformations.js)。自动化：[MobileCompanionProtocol.test.js](../../../repos/happyro-client/tests/ui/MobileCompanionProtocol.test.js)、[DesktopCompanions.test.js](../../../repos/happyro-client/tests/ui/DesktopCompanions.test.js)。


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

后续13个测试文件105项通过，完整 `--all` 构建为 `mveu2lju`；部分更早复验使用 `mveteds3`。覆盖整理之后已完成产品提交，并重跑105项客户端测试、5组服务端专项回归、完整PWA `mvevr9vw` 构建与Gateway清单产物哈希核对，见[提交校验记录](evidence/commit-check.json)。全部技能、真实设备和最终游戏验收尚未完成；历史提交状态不作为当前发布结论。

## 首轮自动化回归依据

原始测试输出见[首轮回归日志](evidence/regression-result.txt)。

2026-10-19 对以下 7 个文件执行了 55 项测试，全部通过：

- [AIDriver.test.js](../../../repos/happyro-client/tests/core/AIDriver.test.js)
- [DesktopCompanions.test.js](../../../repos/happyro-client/tests/ui/DesktopCompanions.test.js)
- [MobileCompanionProtocol.test.js](../../../repos/happyro-client/tests/ui/MobileCompanionProtocol.test.js)
- [MobileCompanions.test.js](../../../repos/happyro-client/tests/ui/MobileCompanions.test.js)
- [MobilePetProtocol.test.js](../../../repos/happyro-client/tests/ui/MobilePetProtocol.test.js)
- [MobilePet.test.js](../../../repos/happyro-client/tests/ui/MobilePet.test.js)
- [EntityLifecycle.test.js](../../../repos/happyro-client/tests/engine/EntityLifecycle.test.js)

完整 PWA `--all` 构建和最终入口冒烟检查也已通过。自动化、构建、实机观察分别证明各自覆盖内容，未测试项继续保留在[待补测](pending.md)。
