# 九职业原生转职实机验收

2026-10-23，本机 Renewal、PACKETVER=20211103、无头 Chromium。按用户要求使用独立普通账号并发，逐项完成 NPC 原生转职与实际重登；不以资格拒绝、静态代码检查或直接修改职业替代成功转职。

## 测试前置与边界

本轮专门验证一转任务。用普通冒险工具准备 Job 10、基础技能及必要材料，准备操作在各份证据中单独记录；没有设置任务变量、直接改职业或伪造任务完成。材料获取和前置练级不属于本轮通关覆盖。剑士与跆拳使用新建数据库初心者夹具，其余角色由浏览器建角；全部账号为 group 0。

跆拳保留 Base 1，接受“升一级”任务后实际攻击自然波利升到 Base 2，再由 NPC 判定通过，没有用等级工具代替该任务。赶路使用当前普通导航能力，忍者天津隐藏房间使用原生入口穿越；不把导航赶路记作全程步行验收。

此前从经典出生、训练课程、自然升级直到剑士转职的完整主线证据仍见[主线验收](verification.md)。本轮补齐九职业一转终点，不代表重新跑了九遍全部新手课程，也不覆盖二转、三转或四转。

## 九职业结果

| 职业 | 角色 | 重登职业 ID / Job 等级 | 原生流程与补充覆盖 | 证据 |
| --- | --- | --- | --- | --- |
| 剑士 | JobAuditNineTKF | 1 / 1 | 公会资格拒绝、最终取消、同意转职、奖励 13415 | [记录](evidence/nine-jobs-swordman.json) |
| 魔法师 | JobNineMage | 2 / 1 | 公会报名与确认、奖励 1639 | [记录](evidence/nine-jobs-mage.json) |
| 弓箭手 | JobNineArcher | 3 / 1 | 公会转职、弓与三类箭筒奖励 | [记录](evidence/nine-jobs-archer.json) |
| 服事 | NineAcolyte | 4 / 1 | 要求说明、资格拒绝、取消、转职及已转职再访；奖励 1545 | [记录](evidence/nine-jobs-acolyte.json) |
| 商人 | JobNineMerchant | 5 / 1 | 公会转职、不要求旧版本送货考试；奖励 1381 | [记录](evidence/nine-jobs-merchant.json) |
| 盗贼 | NineThief | 6 / 1 | 申请后重登、布拉德办理、申请清除、重复不发奖；奖励 13041 | [记录](evidence/nine-jobs-thief.json) |
| 跆拳 | JobAuditNineTKM | 4046 / 1 | 实际升一级、两题分别答错后重试、正确回答、最终拒绝及同意；6002 完成、奖励 2101 | [记录](evidence/nine-jobs-taekwon.json) |
| 神枪手 | JobNineGun | 24 / 1 | 米勒与睿智牛角、材料及牛奶交付、GUNS_Q 0～6、6024 完成；奖励 13180、12149×2、12151 | [记录](evidence/nine-jobs-gunslinger.json) |
| 忍者 | JobNineNinja | 25 / 1 | 赤木传送、天津隐藏入口、空牙凯／可疑男子、两次材料交付、NINJ_Q 0～5、6018 完成；奖励 13010 | [记录](evidence/nine-jobs-ninja.json) |

九项均核对转职后职业、Job 1、实际重登、奖励与数据库持久化。每个角色只完成其分配的职业，不来回重置职业复用角色。普通可选资源探测 404 和登录前恢复请求 401 仍保留在原始证据，未发现阻断这些转职流程的地图缺失或页面脚本错误。

## 实测发现：转职后的职业等级显示回退

盗贼申请后重登使实体保存 Job 10；转职时服务端先发送 Job 1，再发送外观变更。客户端职业等级处理器更新了界面，却没有同步实体的 `joblevel`，后续外观重建又从实体取出旧的 Job 10。服务端实际职业及等级正确，但玩家看到的等级可能错误。

修复为职业等级回包同时更新实体 `joblevel`。基础等级处理器原本已同步实体，无须同类修改。两项新增回归直接执行生产封包处理器，覆盖等级重置后外观重建、后续正常升级后再次重建；连同相关测试共 11 项通过。

[修复前实机记录](evidence/nine-jobs-hud-before.json)中，转职后等待 6 秒，API 为 Job 1、实体及两处界面仍为 10；[修复后实机记录](evidence/nine-jobs-hud-after.json)使用新角色重复相同步骤，实体及两处界面均为 1，实际重登后仍一致。完整 `--all` PWA 已重建，构建编号 `mvknxfpi`；[Gateway 产物哈希](evidence/nine-jobs-hud-build.json)确认启动页、构建信息和 Online.js 与本机产物一致。

## 最终核对

[九职业汇总](evidence/nine-jobs-summary.json)逐项比对真实重登记录与预期职业 ID；[数据库核验](evidence/nine-jobs-database.json)确认九个主测试角色全部为预期职业、Job 1、普通权限且已离线。修复前后复现角色独立保留，不重置已完成的九职业角色。[附加回归清理记录](evidence/nine-jobs-acothief-cleanup.json)确认复现角色亦全部离线，测试浏览器已关闭。

未提交、未推送；没有重做离线包。
