# 十二职业线转职操作流程

本文独立记录「如何转职」，[审计总览](README.md)记录整体进度，[修复记录](fixes.md)记录缺陷。12条线（诗人／舞娘分别测试）已完成至四转和正常重登；刺客三小时等待使用用户授权的测试加速，详见对应文档。

## 阅读与记录方式

每条职业线单独成文（诗人／舞娘同文分节），按实际转职顺序记录前置条件、NPC 地图与坐标、对话选项、材料／考试、转职结果及实机证据。共用的转生和四转流程集中说明；诗人和舞娘分别记录。测试准备使用的强化素质、直接发放材料与正常玩法要求分开说明，不把测试便利措施写成玩家必须执行的步骤。

各文档记录实际经过的任务路径与证据；随机材料和可选支路不扩展为穷举覆盖，测试强化属性不代表正常装备难度。

## 测试口径

- 每条线覆盖初心者 → 一转 → 二转 → 转生 → 高阶一转 → 进阶二转 → 三转 → 四转。
- 诗人和舞娘是第 11 条线的两个独立分支，分别验收。
- 原生 NPC 流程：真实运行对话、选项、考试、材料扣除与转职；准备等级、技能或材料会明确记录，不修改任务进度来冒充完成。
- 冒险工具的独立功能验收已由用户取消，历史记录仅保留；本次使用它准备已授权的等级、技能点、金币和材料，不使用直接改职业代替 NPC 转职。
- 下表保留 NPC 脚本名用于精确定位；游戏中的中文名称在实测后补录。坐标指 NPC 所在格，走到相邻可通行格对话。

## 共用阶段

### 一转与高阶一转入口

普通一转按 NPC 要求准备基础技能和职业等级；转生后使用相应职业的高阶一转对话。各分支的额外材料／任务，以后面的实测步骤为准。

| 一转 | NPC 与位置 | 来源 | 本次状态 |
| --- | --- | --- | --- |
| 剑士 | `Swordman#swd` · `izlude_in 74,172` | [脚本](../../../repos/happyro-server/npc/re/jobs/1-1/swordman.txt) | 普通一转、高阶一转已实测 |
| 魔法师 | `Mage Guildsman#mage` · `geffen_in 164,124` | [脚本](../../../repos/happyro-server/npc/re/jobs/1-1/mage.txt) | 普通一转、高阶一转已实测 |
| 弓箭手 | `Archer Guildsman#archer` · `payon_in02 64,71` | [脚本](../../../repos/happyro-server/npc/re/jobs/1-1/archer.txt) | 普通一转、高阶一转已实测 |
| 服事 | `Cleric#aco` · `prt_church 184,41` | [脚本](../../../repos/happyro-server/npc/re/jobs/1-1/acolyte.txt) | 普通一转、高阶一转已实测 |
| 商人 | `Merchant#mer` · `alberta_in 53,43` | [脚本](../../../repos/happyro-server/npc/re/jobs/1-1/merchant.txt) | 普通一转、高阶一转已实测 |
| 盗贼 | `Thief Guide#thief` · `moc_prydb1 39,129` | [脚本](../../../repos/happyro-server/npc/re/jobs/1-1/thief.txt) | 普通一转、高阶一转已实测 |

### 共用转生流程

全部职业线均有原生转生证据。共用步骤如下；各线是否实际重新捐款、是否沿用先前访问资格，按各线证据分别说明：

1. 二转 Base 99 / Job 50，使用完剩余技能点，准备 1,285,000 Zeny。
2. 找 `yuno_in02 88,164` 的 `Metheus Sylphe#Library` 捐赠。
3. 阅读 `yuno_in02 93,207` 的 `Book of Ymir`。
4. 到 `yuno_in05 49,43` 的 `Heart of Ymir`，由 NPC 送入英灵殿。
5. 清空负重及剩余 Zeny，解除手推车、骑乘和猎鹰；在 `valkyrie 48,86` 与女武神对话。
6. 核对高阶初心者、Base 1 / Job 1、技能重置与重生礼物，再到对应一转导师办理高阶一转。

本次结果：高阶初心者（ID 4001）、Base 1 / Job 1、Zeny 0。准备等级、技能与金币不代表自然练级；捐赠、阅读与女武神转生均通过 NPC 完成。[骑士线实机记录](evidence/knight-rebirth.json)、[魔法师线实机记录](evidence/wizard-rebirth.json)、[猎人线实机记录](evidence/hunter-rebirth.json)、[牧师线实机记录](evidence/priest-rebirth.json)。

来源：[女武神及伊米尔之书脚本](../../../repos/happyro-server/npc/jobs/valkyrie.txt)。赶路可以使用导航，但传送本身不代替捐赠、阅读或 NPC 任务条件。

### 共用四转流程（十二条线、十三分支均已通过）

当前自定义规则：进阶三转职业，Base 至少 200、Job 至少 70、剩余技能点为 0。找普隆德拉 `prontera 153,193` 的「四转职业导师」，选择「确认四转」。13个分支均已验证目标职业、Job 重置、四转素质／AP 及重登保存。

来源：[四转职业导师](../../../repos/happyro-server/npc/custom/happyro/fourth_job.txt)。这些是当前项目规则，不推断为所有 RO 版本的通用规则。

## 各职业线独立操作文档

- [弓箭手 → 猎人 → 神射手 → 游侠 → 风鹰](walkthroughs/01-ranger.md)
- [魔法师 → 巫师 → 超魔导师 → 咒术士 → 大法师](walkthroughs/02-warlock.md)
- [服事 → 牧师 → 神官 → 大主教 → 枢机主教](walkthroughs/03-archbishop.md)
- [剑士 → 十字军 → 圣殿十字军 → 皇家卫士 → 帝国圣卫军](walkthroughs/04-royal-guard.md)
- [盗贼 → 刺客 → 十字刺客 → 十字斩首者 → 暗影十字](walkthroughs/05-guillotine-cross.md)
- [商人 → 铁匠 → 神工匠 → 机甲神匠 → 机甲大师](walkthroughs/06-mechanic.md)
- [魔法师 → 贤者 → 智者 → 妖术师 → 元素支配者](walkthroughs/07-sorcerer.md)
- [商人 → 炼金术师 → 创造者 → 基因学者 → 生物学者](walkthroughs/08-genetic.md)
- [服事 → 武僧 → 武术宗师 → 修罗 → 审判者](walkthroughs/09-sura.md)
- [盗贼 → 流氓 → 神行太保 → 魅影追踪者 → 深渊追踪者](walkthroughs/10-shadow-chaser.md)
- [诗人／舞娘职业线](walkthroughs/11-performers.md)
- [剑士 → 骑士 → 领主骑士 → 符文骑士 → 龙骑士](walkthroughs/12-rune-knight.md)
