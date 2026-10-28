# SE 防御设施、占城与修复实机记录

2026-10-29，在 `schg_cas01` 使用普通权限攻方公会10与守方公会9。测试准备使用管理工具提供合法职业装备、材料和测试位置；设施与核心均通过客户端普通攻击或合法技能击破，修复通过实际 NPC 对话选择完成，没有用直接改归属、改设施血量或管理击杀代替被测行为。

## 已验证链路

| 项目 | 结果与证据 |
| --- | --- |
| 三道门击破 | 16个实际路障普通攻击耗尽HP；每道结束断言对应wall=0、状态flag=1。[第一道](evidence/war-se/se-verified-stage-1.json)、[第二道](evidence/war-se/se-verified-stage-2.json)、[第三道](evidence/war-se/se-verified-stage-3.json) |
| 核心占领 | 普通攻击核心100→0，归属9→10；原生10秒延迟后新核心生成。[初始](evidence/war-se/se-final-core-before.json)、[归属切换](evidence/war-se/se-final-core-9.json)、[重生](evidence/war-se/se-final-respawned-core.json) |
| 己方核心 | 攻击新归属的己方核心，HP保持100。[读回](evidence/war-se/se-final-own-core.json) |
| 错误维修材料 | 对第三道控制装置选择错误材料，立即中止，材料不消耗，符合该立即退出分支。[对话及背包对比](evidence/war-se/se-repair-wrong-material.json)；不冒充最终失败扣部分材料分支 |
| 三道门重建 | 实际按03→02→01修复，依据提示选择树干／神之金属／钢铁／强化武器金属；每道成功后断言wall=1、flag=0，并保存材料背包。[03](evidence/war-se/se-repair-barrier-state-3.json)、[02](evidence/war-se/se-repair-barrier-state-2.json)、[01](evidence/war-se/se-repair-barrier-state-1.json) |
| 新领主守护石 | 占城重置后重新通过普通角色修复两石，先石头→铝→神之金属，再8轮宝石选择。[1号](evidence/war-se/se-new-owner-stone-1.json)、[2号](evidence/war-se/se-new-owner-stone-2.json) |
| 守护者召唤 | 艾夫在公会未学技能时拒绝；普通客户端学技能后开启，服务端实际1899数量4、enabled=1。[无技能](evidence/war-se/se-guardian-command-False.json)、[开启](evidence/war-se/se-guardian-command-True.json)、[实体计数](evidence/war-se/final-state.log) |
| 非会长权限 | 公会10普通成员向艾夫请求，明确只听命于会长。[交互状态](evidence/war-se/se-guardian-member-denied.json) |
| 己方守护者保护 | 公会10攻击己方1899，HP70000保持不变。[前后](evidence/war-se/se-guardian-damage-attacker.json) |
| 领主旗帜传送 | 普通选择希敏旗帜，从入口附近传到120,290。[落点](evidence/war-se/se-owner-flag-transfer.json) |
| 最终设施 | 关战前全部石／门状态0，召兵状态1，四道wall均1，owner10。[实体快照](evidence/war-se/se-final-restored.json)、[状态](evidence/war-se/final-state.log) |

三道门实战过程中，另一项修石测试已经恢复了入口守护石与RL0，攻方此前已位于内部。该轮证明设施击破及解锁、占城和修复，不声称一次连续从城外步行穿越所有屏障。各阶段使用管理传送准备位置，入口普通步行另有独立记录。

守护石自动化按实际收到的特效封包选择56→黄、54→蓝、225→红；它验证服务端步骤与完成，不替代人眼对客户端特效颜色的验证。225特效显示另由客户端专项记录覆盖。

邀请公会时曾对城堡内目标失败；将目标移到普隆德拉后普通邀请成功，符合当前服务端禁止邀请城堡内目标的规则。[加入后状态](evidence/war-se/se-member-outside-invite.json)。控制装置02测试当时角色未入会，因此只证明无公会无响应，不应写成同公会非会长控制装置权限已通过。

## 补充复验

- 敌方守护者伤害已补齐：使用完整技能树的普通 Rune Knight 施放龙之气息，1899 HP 从70000降至38713，角色保持存活；[结果](evidence/war-se/se-guardian-enemy-final-result.json)、[截图](evidence/war-se/se-guardian-enemy-final.png)。早期低血近战尝试不作为结论。
- 同公会非会长控制装置权限已补齐，见下方隔离用例。
- 关战、重新开战及重启持久化已由主测试完成，见[最终汇总](war-final.md)。

## 截图

[实际占城](evidence/war-se/se-final-captured.png)、[第一道击破](evidence/war-se/se-verified-stage-1.png)、[第二道击破](evidence/war-se/se-verified-stage-2.png)、[第三道击破](evidence/war-se/se-verified-stage-3.png)、[第三道修复](evidence/war-se/se-repair-barrier-3.png)。

移动端非会长拒绝对话四视口已逐张目视：中文标题、正文、关闭及结束对话按钮完整，没有对话内容裁切。截图使用同一触摸上下文调整视口，截图像素受DPR影响，不代表四台物理设备测试。现场有环境魔物攻击，但不影响权限返回与对话布局判断。

| 视口 | 截图 |
| --- | --- |
| 手机竖屏430×860 | [查看](evidence/war-se/se-member-denied-phone-portrait.png) |
| 手机横屏860×430 | [查看](evidence/war-se/se-member-denied-phone-landscape.png) |
| 平板竖屏768×1024 | [查看](evidence/war-se/se-member-denied-tablet-portrait.png) |
| 平板横屏1024×768 | [查看](evidence/war-se/se-member-denied-tablet-landscape.png) |

## 控制装置权限隔离补测

重新开战、全部门状态0时，受控将03修复状态临时置2并启用NPC，仅隔离访问权限，不声称新占城或真实破坏。会长公会10正常进入材料说明，随后关闭对话；同公会10普通成员接触同一NPC无交互响应，背包材料前后完全一致，服务端修复状态保持2。完成后恢复flag0并关闭该NPC，不改变归属及实际门实体。

证据：[会长正对照](evidence/war-se/se-control-leader-positive.json)、[同会非会长拒绝与背包对比](evidence/war-se/se-control-member-denied.json)、[状态及恢复](evidence/war-se/se-control-permission-state.json)。该结果补齐此前无公会角色不能代表同会非会长的证据缺口。

占城驱离补测：守方成员从城内207,76返回保存点，HP前后均12046，没有自身死亡通知。[前](evidence/war-se/se-expulsion-ready.json)、[后](evidence/war-se/se-expulsion-after.json)。最后关战已确认归属10保留且核心与结构清除：[读回](evidence/war-se/final-se-ended.json)。

重启持久化与清理最终结果见[汇总](war-final.md)。
