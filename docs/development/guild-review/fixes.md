# 修复记录

[返回公会审查](README.md)

- 公会创建初始化等级/经验持久化；背包第一格华丽金属扣除。
- 当前 20211103 离会、驱逐及驱逐历史封包解析，按角色 ID 同步桌面/移动端成员与自身状态。
- 职位保存、仓库权限位、原生复选框开关/显示；实时权限刷新与会长转交后权限收回。
- 成员职位范围校验、仓库锁定时手推车存取保护、撤销权限立即关库。
- 会长直接离会拒绝；联盟精确邀请人、现任权限、攻城状态校验及待处理请求清理。
- 公会仓库记录封包与三端窗口；窗口宽度、模态层级及滚动；非空仓库标题时序。
- 公会总人数与在线人数区分，首次打开请求完整成员列表，加载期间显示占位。
- SE 周二/周四结束时间与18—20时段一致；TE职业提示及移动端传送入口标题。
- 徽章上传错误反馈。

## 实现入口

路径相对于各自产品仓库。

| 范围 | 仓库 | 主要文件 |
| --- | --- | --- |
| 创建、职位、会长、联盟授权 | happyro-server | `src/char/int_guild.cpp`、`src/map/guild.cpp` |
| 仓库锁及存取 | happyro-server | `src/map/storage.cpp` |
| SE 时间、TE 提示 | happyro-server | `npc/guild2/agit_start_se.txt`、`npc/re/warps/guildcastles.txt` |
| 离会、驱逐、仓库日志、城堡列表封包 | happyro-client | `src/Network/PacketStructure.js`、`src/Network/PacketRegister.js` |
| 公会状态、徽章错误反馈 | happyro-client | `src/Engine/MapEngine/Guild.js` |
| 桌面职位复选框、首次人数 | happyro-client | `src/UI/Components/Guild/Guild.js`、`Guild.html`、`Guild.css` |
| 移动端转交会长、总人数 | happyro-client | `src/UI/Mobile/game/SocialPanel.js`、`src/UI/Game/GameSocial.js` |
| 仓库标题、日志窗口与层级 | happyro-client | `src/Engine/MapEngine/Storage.js`、`src/UI/Components/GuildStorageLog/` |
| 传送入口对话标题 | happyro-client | `src/Engine/MapEngine/MobileNPC.js`、`NPCDialogueTitle.js` |

## 实机发现的关键原因

- 当前离会通知 `0x0a83` 为角色 ID 后接原因，驱逐通知 `0x0a82` 为原因后接角色 ID；两者字段顺序不同。以服务端实际 packed 结构生成回归字节，避免只按旧注释实现。
- 职位权限图片会被异步加载的未选中背景覆盖，原点击逻辑也不能正确取消；改用原生复选框，保存邀请、驱逐和仓库三个权限位。
- 基本信息中的 `userNum` 是在线人数，总人数来自完整成员列表。首次打开补取成员列表，尚未返回时显示加载占位。
- 非空仓库的物品列表会提前打开窗口，旧代码因此跳过后续标题赋值；现在容量信息返回时统一更新标题，背包和手推车列表不覆盖仓库名称。
- 仓库日志窗口使用完整内部容器尺寸，并接入现有窗口管理和输入冻结，避免窄列布局及 HUD 抢占层级。
