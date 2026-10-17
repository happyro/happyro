# 盗贼 → 流氓 → 神行太保 → 魅影追踪者 → 深渊追踪者：实机转职流程

[流程索引与共用转生／四转步骤](../walkthrough.md) · [验收总览](../README.md) · [修复记录](../fixes.md)

本线已完成至四转及正常重登。本文记录实际测试路径；未覆盖的可选分支另行注明，材料准备、强化素质等测试措施不属于正常玩家转职要求。

| 阶段 | NPC 与位置 | 来源 | 状态 |
| --- | --- | --- | --- |
| 二转 | `Rogue Guildsman#rg` · `in_rogue 363,122` | [脚本](../../../../repos/happyro-server/npc/jobs/2-2/rogue.txt) | 已实测通过 |
| 进阶二转 | `Stalker#Valkyrie` · `valkyrie 53,58` | [脚本](../../../../repos/happyro-server/npc/jobs/2-2a/Stalker.txt) | 已实测通过 |
| 三转 | `Girl#sc00` · `morocc 156,70` | [脚本](../../../../repos/happyro-server/npc/re/jobs/3-2/shadow_chaser.txt) | 原生实测通过（4079） |

## macOS 实测步骤

1. 在梦罗克金字塔地下盗贼公会完成原生一转。前往 `in_rogue 363,122` 找流氓公会成员，笔试得到 100 分。
2. 找 `in_rogue 376,23` 史密斯领取随机材料。本次为蓝色药草 6、亡者遗骨 10、兽人指甲 10、亡者牙齿 10，以及 10,000 Zeny；不要把本次随机组当作唯一要求。
3. 本次分配阿拉甘路线。到 `cmd_fild09 106,195` 门口，依次选择「阿拉甘／从未／囤积过／升级物品。」。进入后找 `in_rogue 244,39`，选择出发，徒步通过地下通道并战斗。原生出口返回公会，再找最初的公会成员成为流氓。
4. 按共用原生转生流程成为进阶初心者；到 `moc_prydb1 39,129` 成为进阶盗贼，职业等级达到 50 后，经智慧之书回到女武神大厅，找 `valkyrie 53,58` 成为神行太保。
5. 三转：找 `morocc 156,70` 女孩，再找公会 `in_rogue 376,100` 成员，选择「我吗？」，接着与 `379,101` 乌鲁帕交谈领取密码。
6. 到普隆德拉画廊 `s_atelier 65,123`，展示解读结果，输入 `shadows atelier in prontera`。再次交谈，选择「我试试看！」领取第二段密码。数字需减去当次给出的钥匙，再按字母表解码。
7. 本次第二段解为 `blue fire in turtle island third floor`。到 `tur_dun03 38,209` 蓝色火焰输入完整英文，依次选「捡起来」「你是谁」，领取狩猎欺骗之影任务。

8. 在乌龟岛第三层实际击杀欺骗之影（2076），回蓝色火焰进入密室。调查箱子，将提示中的凯撒移位应用到 `HONESTY` 并输入，取得第一把钥匙；通过箱子出口返回，再向普隆德拉画廊经理报告。
9. 到拉赫画廊 `s_atelier 168,65` 找保罗，选择格雷厄姆派来的相关选项，领取单词谜题。去 `ice_dun02 206,223` 火焰接任务，实际击杀幻影之影（2077），再由火焰进入密室。
10. 调查 `job3_sha01 25,28` 箱子；本次保罗给出的单词是 `FOOT`，输入 `25` 成功取得幻影之钥（6267）。通过箱子出口返回，再找保罗交谈，得到朱诺线索。其他随机单词的答案尚未逐一实测，不能将本次答案通用于所有分支。
11. 到朱诺画廊 `s_atelier 167,129` 找哈雷德；在输入框填写「我知道你去年夏天做了什么！」。结束后再次交谈取得诗句，再调查 `niflheim 230,276` 火焰，选择「是谁在演奏？」接到愉悦之影狩猎任务。本次通过普通搜寻和攻击完成目标（2078），原生公告确认 1/1。

12. 回尼弗海姆火焰进入密室，调查 `job3_sha01 73,80` 箱子，输入 `turn and shake`，依次选择「转动房子」「把它倒过来滚动」，取得第三把钥匙（6268）。再次调查箱子，通过原生出口离开；回朱诺画廊报告，再到里希塔乐镇画廊 `s_atelier 25,75` 找文森特。
13. 到 `tha_t01 149,228` 触发原生入口，进入密室后调查 `job3_sha01 71,27`。选择放入三把钥匙，原生消耗三把钥匙并获得名匠之笔（6269）；走 `71,19` 出口返回。
14. 回文森特处选择「放下画笔」，再从画廊 `32,65` 内部门口进入，找 `70,66` 导师。听完说明后再次交谈，选择「把我变成影子追踪者」，成为转生三转职业（4079）。

15. 导师转职后还有尾声选项「关于这把刷子……」，需正常选择并关闭，才能进行下一阶段准备。未关闭时，冒险工具修改等级返回 409，是预期保护。
16. 四转入口逐一验证 Base 不足 200、Job 不足 70、未用完技能点、取消均保持原职业；满足条件后确认成为深渊追踪者（4260、Base 200、Job 1）。正常退出到选角再进入，职业、技能与特性状态一致。全线通过。测试准备过等级、技能、材料及强化素质以确保通道战斗稳定；强化素质不属于玩家转职要求。

证据：[笔试](../evidence/rogue-register-macos.json)、[材料与分配](../evidence/rogue-materials-macos.json)、[门口暗号](../evidence/rogue-password-entry-macos.json)、[地下通道与二转](../evidence/rogue-corridor-macos.json)、[转生](../evidence/rogue-rebirth-macos.json)、[进阶转职](../evidence/rogue-high-jobs-macos.json)、[画廊解谜](../evidence/shadow-chaser-register-macos.json)、[蓝色火焰](../evidence/shadow-blue-flame-macos.json)。

三转阶段证据：[欺骗之影狩猎](../evidence/shadow-deception-hunt-macos.json)、[第一把钥匙](../evidence/shadow-first-key-macos.json)、[拉赫线索与火焰](../evidence/shadow-rachel-flame-macos.json)、[幻影之影狩猎](../evidence/shadow-illusion-hunt-macos.json)、[第二把钥匙](../evidence/shadow-second-key-macos.json)、[朱诺线索与尼弗海姆火焰](../evidence/shadow-yuno-flame-macos.json)。

后半段证据：[第三任务怪原生完成公告](../evidence/shadow-pleasure-hunt-macos.json)、[第三把钥匙](../evidence/shadow-third-key-macos.json)、[三钥匙机关与最终三转](../evidence/shadow-tower-finish-macos.json)。

最终证据：[导师尾声关闭](../evidence/shadow-final-dialogue-close-macos.json)、[四转五项检查](../evidence/abyss-chaser-fourth-macos.json)、[正常重登](../evidence/abyss-chaser-relog-macos.json)。
