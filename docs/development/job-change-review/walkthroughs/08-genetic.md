# 商人 → 炼金术师 → 创造者 → 基因学者 → 生物学者：实机转职流程

[流程索引与共用转生／四转步骤](../walkthrough.md) · [验收总览](../README.md) · [修复记录](../fixes.md)

本线已完成至四转及正常重登。本文记录实际测试路径；未覆盖的可选分支另行注明，材料准备、强化素质等测试措施不属于正常玩家转职要求。

| 阶段 | NPC 与位置 | 来源 | 状态 |
| --- | --- | --- | --- |
| 二转 | `Alchemist Guildsman#am` · `alde_alche 27,185` | [脚本](../../../../repos/happyro-server/npc/jobs/2-2/alchemist.txt) | 原生 NPC 实测通过 |
| 进阶二转 | `Biochemist#Valkyrie` · `valkyrie 53,50` | [脚本](../../../../repos/happyro-server/npc/jobs/2-2a/Creator.txt) | 原生 NPC 实测通过 |
| 三转 | `Alchemist Union Member` · `alde_alche 35,186` | [脚本](../../../../repos/happyro-server/npc/re/jobs/3-2/genetic.txt) | 原生 NPC 实测通过 |

本线已通过原生转职至四转及正常重登。以下按实际测试分配的材料、课程和随机结果记录；转生与四转共用入口见上方索引。

## macOS 实测：一转至创造者

角色 JobAudit3F，原生商人 → 炼金术师（18）→ 转生 → 高阶商人（4006）→ 创造者（4019）均通过。

1. 初心者 Job 10 找 `alberta_in 53,43` 成为商人。本次以 Base 70 / Job 40 报名，以实际参加数学考试；Job 50 的原生免考路径没有在本角色代替考试。
2. `alde_alche 27,185` 公会报名缴 50,000 Zeny，本角色抽到 7 狂暴药水材料要求。交付后完成数学考试，题目与数值输入已保存。
3. `alde_alche 13,15` 达尔文要求药臼 ×3、空瓶 ×3、红草／黄草／白草各 1。依次选择准备药臼、放入药草、捣碎、倒入清水、继续捣碎、倒进空瓶，实际获得三种药水。
4. `alde_alche 79,19` 范·赫尔蒙特：选择想成为炼金术师、请教知识；携带迪特里明和卡尔波迪尔各 1，找 `alberta_in 133,55` 路易兹「谈谈溶液」，再找 `geffen 181,114` 打听莫根斯坦；到 `geffen_in 141,140` 询问研究。回赫尔蒙特，回答中和剂不需要卡尔波迪尔、混合剂不需要迪特里明。
5. `alde_alche 145,19` 尼古拉斯的文字谜题全部答对；再次交谈领取五种送货材料。找 `yuno_in01 103,157` 贝恩，另备便携式熔炉 ×5、煤炭 ×5 和 2,000 Zeny，完成原生实验。返回尼古拉斯，再找 `alde_alche 101,184` 公会长成为炼金术师。
6. 按共用转生步骤捐赠、读书、伊米尔之心与女武神完成转生。高阶初心者 Job 10 找商人导师成为高阶商人；准备 Job 50、用完技能点后读书进英灵殿，找 `valkyrie 53,50` 选择「是」成为创造者。

等级、技能、金币与普通材料为测试准备；导师发放的送货材料与实验结果均由原生任务取得，没有改任务变量。

证据：[一转](../evidence/alchemist-merchant-macos.json)、[报名](../evidence/alchemist-register-macos.json)、[材料和数学](../evidence/alchemist-materials-math-macos.json)、[药剂实验](../evidence/alchemist-potions-macos.json)、[溶液知识](../evidence/alchemist-mixture-macos.json)、[文字谜题](../evidence/alchemist-word-macos.json)、[送货和二转](../evidence/alchemist-finish-macos.json)、[转生](../evidence/alchemist-rebirth-macos.json)、[进阶转职](../evidence/alchemist-high-jobs-macos.json)。

## 基因学者、生物学者及重登通过

1. 创造者 Base 99 / Job 70、用完技能点，找 `alde_alche 35,186` 公会成员报名；找 `job3_gen01 25,58` 德弗里斯听完介绍。
2. 经楼梯 `7,59` 上楼，到 `83,72` 箱子选择打开、取出饼干。经 `71,56` 回楼下，交给德弗里斯并表示想成为基因学者，再交谈领取隔音植物实验。
3. 阅读 `12,56` 植物指南的「植物」章节，分别从 `36,55` 比比草、`36,45` 穆卡树、`42,55` 博奇藤采集原生材料。NPC 位于装饰或不可步行格，应走到邻近可站立位置交谈，不必走到 NPC 正下方。
4. 在 `7,50` 试验台进行实验，按提示处理植物并注入试验种子；操作选项与本次随机循环保存在证据。本次成功取得种子，交德弗里斯后获推荐，去楼上见 `91,48` 德米。
5. 原生收集 10 份散落零件，本次在 `84,45` 与 `90,51` 之间轮流收集，等待节点恢复后可再次拾取。回德米对话，被原生传送进孢子围栏。
6. 普通攻击实际击败 100 只毒魔菇，任务计数达到 100/100。离开再进入 `24,32` 附近的监视区域，触发原生传送到 `21,38`。回德弗里斯先收信，再完成转职，结果基因学者（4078）。
7. 四转验证等级不足、技能点未用完、取消及最终确认；结果生物学者（4259）。正常退出选角并重进槽位 0，职业、技能与特性状态一致。

战斗准备 VIT 5000、STR 10000、DEX 10000、AGI 5000 并恢复生命；未改杀怪计数，实际记录 100 次普通攻击和原生 100/100 公告。四转前素质恢复为 99。植物、种子、零件及击杀进度均由原生任务产生。

证据：[三转报名](../evidence/genetic-entry-macos.json)、[饼干与任务](../evidence/genetic-cookie-macos.json)、[植物实验](../evidence/genetic-plants-macos.json)、[零件](../evidence/genetic-parts-macos.json)、[100 只毒魔菇](../evidence/genetic-combat-macos.json)、[三转](../evidence/genetic-finish-macos.json)、[四转](../evidence/biolo-fourth-macos.json)、[正常重登](../evidence/biolo-relog-macos.json)。本线完整通过。
