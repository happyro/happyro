# 诗人／舞娘职业线：实机转职流程

[流程索引与共用转生／四转步骤](../walkthrough.md) · [验收总览](../README.md) · [修复记录](../fixes.md)

本线已完成至四转及正常重登。本文记录实际测试路径；未覆盖的可选分支另行注明，材料准备、强化素质等测试措施不属于正常玩家转职要求。

## 弓箭手 → 诗人 → 搞笑艺人 → 宫廷乐师 → 天籁颂者

男性诗人分支，与舞娘分开记录。

| 阶段 | NPC 与位置 | 来源 | 状态 |
| --- | --- | --- | --- |
| 二转 | `Wandering Bard` · `comodo 226,123` | [脚本](../../../../repos/happyro-server/npc/jobs/2-2/bard.txt) | 已实测通过 |
| 进阶二转 | `Minstrel#Valkyrie` · `valkyrie 53,54` | [脚本](../../../../repos/happyro-server/npc/jobs/2-2a/Clown.txt) | 已实测通过 |
| 三转 | `Bard#job_min` · `alberta 196,133` | [脚本](../../../../repos/happyro-server/npc/re/jobs/3-2/minstrel.txt) | 原生三转、四转和正常重登全部通过 |

### 已实测步骤

1. `payon_in02 64,71` 原生转弓箭手。诗人报名在 `comodo 226,123`：首次选择「能为我唱首歌吗？」与「是的，非常好听。」；再次交谈称赞声音，并选择「当然想过！」，交付本次准备的希纳雷花 1 个。
2. 完成姜饼城雪人支线：`xmas_in 167,173` 达弗尔 → `xmas 134,112` 雪雪 → `117,304` 波泽 → `176,236` 坎塔塔（交墨汁、黏稠液体各 1）→ `xmas_in 27,103` 阿姨 → 雪雪领取盐 → 阿姨 → `xmas 146,136` 小丑询问雪雪 → `206,168` 男孩及 `208,168` 女孩 → 雪雪领取礼物。
3. 回拉洛跟唱。本次随机到「布拉基」：逐行准确输入「布拉基，布拉基，」「永远呼唤诗人的名字。」「我的歌是他的呼吸，」「我的心是他的意志，」「所有流浪诗人都是他的子民，」「一切赞美都归于他。」六行歌词。不把本次随机歌固定为唯一答案。选择「请直接帮我转职吧」，不领取可选的木材武器奖励，成为诗人。
4. 按共用流程原生转生，再找 `payon_in02 64,71` 转进阶弓箭手；经智慧之书回女武神大厅，找 `valkyrie 53,54` 成为搞笑艺人。
5. 三转前段：`alberta 196,133` 卡里安选择帮忙 → 普隆德拉 `141,97`、`140,331`、`146,218` 三位情报 NPC → 返回卡里安 → 飞艇 `airplane 222,67` → 胡格尔旅馆 `hu_in01 267,5` → 酒吧 `361,103`，选择「继续听」，再次交谈听「金属之声」→ 返回旅馆。
6. 到 `tha_scene01 140,200` 触发拾取收据，再找 `yuno 143,170` 克里克先生拿照片，领取原生击败 33 只玩偶熊任务。在 `ein_fild03` 通过普通攻击完成狩猎，去 `lighthalzen 155,119` 找女孩交付。
7. 从冰洞 `ice_dun01 157,15` 开始，逐段阅读自动传送中的十二段诗句，原生传到拉赫旅馆。先完成醒来对话，再与 `ra_in01 358,130` 老妇人交谈，获得船只线索。
8. 到 `ve_fild07 131,132` 公告牌，选择「乘独木舟」，连续十次按实际选项选择「把水舀出去」。原生漂流到克魔岛，完成上岸对话；问 `comodo 192,119` 独木舟高手，再问 `159,316` 烤肉的女人。
9. 到 `moc_fild16 206,232` 触发沙漠纸条，接受同行；到 `aldebaran 140,130` 听钟楼故事。回 `prontera 155,40`，沿 `155,42 → 155,44 → 155,46 → 155,48` 阅读自动传送剧情。
10. 原生进入 `prt_in` 后，找 `94,172` 卡里安完成三转（4075）。四转的等级不足、职业等级不足、技能点未分配、取消和确认均已验证；最终成为天籁颂者（4263），正常重登槽位1后职业、技能树和特性一致。

连续自动传送的最后一页曾出现无按钮；正常退出选角重进后，原生最后一页及入室正常完成。该现象目前保留工具／时序观察，尚未确认为产品缺陷。

证据：[雪人支线](../evidence/bard-snowman-macos.json)、[歌词首行](../evidence/bard-input-probe-macos.json)、[歌词第二行](../evidence/bard-enter-probe-macos.json)、[剩余歌词与二转](../evidence/bard-song-resume-macos.json)、[转生](../evidence/bard-rebirth-macos.json)、[进阶转职](../evidence/bard-high-jobs-macos.json)、[三转调查](../evidence/minstrel-investigation-macos.json)、[收据与照片](../evidence/minstrel-photo-macos.json)。

## 弓箭手 → 舞娘 → 冷艳舞姬 → 漫游舞者 → 乐之舞灵

女性舞娘分支，与诗人分开记录。

| 阶段 | NPC 与位置 | 来源 | 状态 |
| --- | --- | --- | --- |
| 二转 | `Bor Robin#1` · `comodo 193,151` | [脚本](../../../../repos/happyro-server/npc/jobs/2-2/dancer.txt) | 已实测通过 |
| 进阶二转 | `Gypsy#Valkyrie` · `valkyrie 53,56` | [脚本](../../../../repos/happyro-server/npc/jobs/2-2a/Gypsy.txt) | 已实测通过 |
| 三转 | `Aspiring Wanderer, Soy` · `xmas 162,209` | [脚本](../../../../repos/happyro-server/npc/re/jobs/3-2/wanderer.txt) | 已实测通过 |

### 已实测步骤

1. 女性角色在 `payon_in02 64,71` 原生转为弓箭手。找 `comodo 193,151` 博尔·罗宾，选择「前往转职考场」，原生传送进入舞蹈学校。
2. 找 `job_duncer 43,93` 艾尔填写申请表，再次交谈领取随机材料。本次要求贝壳 2、黄色药水 5、杰勒比结晶 20、长发 10、凉鞋 1 和 10,000 Zeny；这是随机组之一。NPC 核对物品并收取学费，当前脚本不扣除这些材料。
3. 找 `job_duncer 95,93` 比茹参加笔试，本次得到 100 分。完整题目、选项与答案保存在证据中。
4. 听取舞蹈规则，再选择前往考试区域，走到 `32,154` 等候室并双击聊天室入场。按原生广播方向移动，包含组合舞步、「专注」及末段「箭雨」。限时考试已通过，箭雨实际击败原生波利；返回比茹领取舞娘（20）。

证据：[弓箭手一转](../evidence/dancer-archer-macos.json)、[报名与随机材料](../evidence/dancer-register-macos.json)、[材料核对与100分笔试](../evidence/dancer-materials-quiz-macos.json)、[考试说明及入场](../evidence/dancer-stage-entry-macos.json)。
5. 卸下并丢弃测试装备及材料后，按原生转生流程成为进阶初心者；回 `payon_in02 64,71` 转进阶弓箭手，经伊米尔之书到 `valkyrie 53,56` 转冷艳舞姬（4021）。
6. 三转从 `xmas 162,209` 索伊开始，问演出地点，再找 `132,143` 演出经理；询问事件并答应寻找吉他之歌。经理的开放输入题本次输入「可能发生了误会。」。
7. 找 `comodo 140,86` 吉他之歌，先了解情况，再用已学习的「惊艳之舞」唤醒他。到 `hu_in01 305,251` 与女士交谈，听完后再次交谈，选择「嘿，别放弃」「我们一起努力」。
8. 到 `hu_fild05 342,130` 舞者金处选择开始，原生要求十分钟内击败50只黄诺博斯并回来。实测在本地图普通步行和攻击，服务器公告达到50/50，时限内找她交付成功。测试强化素质用于稳定战斗，不代表普通角色的难度或耗时。
9. 回克魔岛告知吉他之歌，走近 `xmas 148,131` 触发表演者显示，再找 `147,135` 舞者金欣赏演出，原生成为漫游舞者（4076）。
10. 四转逐项验证等级、职业等级、剩余技能点及取消；确认成为乐之舞灵（4264）。正常返回选角并重进槽位1，职业、技能树及特性一致，整条女性分支通过。

证据：[限时舞蹈](../evidence/dancer-dance-macos.json)、[二转领取](../evidence/dancer-finish-macos.json)、[转生](../evidence/dancer-rebirth-macos.json)、[进阶转职](../evidence/dancer-high-jobs-macos.json)、[三转调查](../evidence/wanderer-investigation-macos.json)、[50只限时狩猎及交付](../evidence/wanderer-novus-hunt-macos.json)、[三转](../evidence/wanderer-finish-macos.json)、[四转](../evidence/trouvere-fourth-macos.json)、[重登](../evidence/trouvere-relog-macos.json)。

诗人后段证据：[33只玩偶熊](../evidence/minstrel-teddy-hunt-macos.json)、[冰洞](../evidence/minstrel-ice-story-macos.json)、[旅行后段](../evidence/minstrel-journey-resume-macos.json)、[最后剧情重登恢复](../evidence/minstrel-final-relog-recovery-macos.json)、[三转](../evidence/minstrel-final-macos.json)、[四转](../evidence/troubadour-fourth-macos.json)、[正常重登](../evidence/troubadour-relog-macos.json)。
