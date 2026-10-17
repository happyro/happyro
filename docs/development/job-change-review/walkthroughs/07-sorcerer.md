# 魔法师 → 贤者 → 智者 → 妖术师 → 元素支配者：实机转职流程

[流程索引与共用转生／四转步骤](../walkthrough.md) · [验收总览](../README.md) · [修复记录](../fixes.md)

本线已完成至四转及正常重登。本文记录实际测试路径；未覆盖的可选分支另行注明，材料准备、强化素质等测试措施不属于正常玩家转职要求。

| 阶段 | NPC 与位置 | 来源 | 状态 |
| --- | --- | --- | --- |
| 二转 | `Dean of the Academy#sa` · `yuno_in02 38,61` | [脚本](../../../../repos/happyro-server/npc/jobs/2-2/sage.txt) | 原生 NPC 实测通过 |
| 进阶二转 | `Scholar#Valkyrie` · `valkyrie 53,47` | [脚本](../../../../repos/happyro-server/npc/jobs/2-2a/Professor.txt) | 原生 NPC 实测通过 |
| 三转 | `Merito` · `gef_tower 102,34` | [脚本](../../../../repos/happyro-server/npc/re/jobs/3-2/sorcerer.txt) | 原生 NPC 实测通过 |

本线已通过原生转职至四转及正常重登。以下按实际测试分配的材料、课程和随机结果记录；转生与四转共用入口见上方索引。

## macOS 实测：一转至智者

角色 JobAudit3M，原生魔法师 → 贤者（16）→ 转生 → 高阶魔法师（4003）→ 智者（4017）均通过。

1. 初心者 Base 10 / Job 10、基础技能学完后，找 `geffen_in 164,124` 选择成为魔法师。
2. 本次以 Base 70 / Job 50 向 `yuno_in03 154,35` 报名，因 Job 50 获原生免报名费；笔试 20 题全部答对。题目与选项保存在证据，不应将随机题序写死。
3. 找 `yuno_in03 169,180` 赫尔墨斯，选择「是的。」进入等候区；步行到 `job_sage 50,163` 并进入聊天室考试。依次清理第一、第二波怪物及最终目标，三段实战通过后由原生脚本传回教授。
4. 本角色随机分到属性魔法课程。找 `yuno_in03 244,31` 阿贝西，交 30 石头，再交水晶箭、岩石箭、风箭各 50，最后交 1 圣水。导师讲授属性克制关系。
5. 准备鸟羽毛、动物皮、木片、墨汁、空瓶各 1，完成论文选择后取得书。找 `yuno_in02 38,61` 院长提交论文，原生成为贤者。
6. 按共用流程捐赠 1,285,000 Zeny、阅读伊米尔之书、经伊米尔之心和女武神完成转生；Job 10 高阶初心者找原魔法师导师成为高阶魔法师。准备 Job 50、用完技能点，阅读伊米尔之书进入英灵殿，找 `valkyrie 53,47` 选择「是」成为智者。

测试准备：等级、技能点、材料与金币由工具准备；实战使用 INT 1000、DEX 500、VIT 1000、AGI 500 和原生灵魂打击。第一次实战工具使用错误封包导致断线，第二次正常完成，不算产品考试失败。未改变任务变量或直接改职业。

证据：[一转](../evidence/sage-mage-macos.json)、[报名笔试](../evidence/sage-register-quiz-macos.json)、[实战通过](../evidence/sage-practical-macos-attempt2.json)、[学科分配](../evidence/sage-subject-macos.json)、[属性课程](../evidence/sage-physics-macos.json)、[论文和二转](../evidence/sage-thesis-macos.json)、[转生](../evidence/sage-rebirth-macos.json)、[进阶转职](../evidence/sage-high-jobs-macos.json)。

## 妖术师、元素支配者及重登通过

1. 智者准备 Base 99 / Job 70、用完技能点。找 `gef_tower 102,34` 梅里托，选择了解元素使、火精灵指引、写下名字；再次交谈选择会使用魔法、能对付精灵、现在参加测试。
2. 找 `gef_tower 113,161` 卡拉卡斯；先听说明，再带红色血液、水晶蓝、翠绿之风、绿色活力各至少 3 颗，完成考试方法对话。每次探测消耗对应属性石 3 颗，成功随机取得试剂，建议多备。
3. 本次先在 `ice_dun01 274,274` 原生探测杖取得黑色、透明试剂，再在 `mjo_dun03 200,141` 取得红色试剂。总共 14 条尝试记录，含一次未出现结果对话的接触超时；没有直接发放试剂。
4. 带三种试剂回卡拉卡斯，交付后再次交谈，原生转为妖术师（4074）。
5. 四转导师验证等级不足、技能点未用完、取消均不转职；满足 Base 200 / Job 70 后确认成为元素支配者（4261）。正常退出选角并重进，职业、技能与特性状态一致。

测试额外准备水晶蓝、绿色活力各 150，VIT 1000、AGI 5000 用于生存；四转前六项素质恢复为 99。试剂通过实际 5 秒进度条取得，使用修复计时后的完整客户端产物。

证据：[报名](../evidence/sorcerer-entry-macos.json)、[材料和说明](../evidence/sorcerer-materials-macos.json)、[探测试剂](../evidence/sorcerer-reagents-macos.json)、[三转](../evidence/sorcerer-finish-macos.json)、[四转条件](../evidence/elemental-master-fourth-macos.json)、[正常重登](../evidence/elemental-master-relog-macos.json)。本线完整通过。
