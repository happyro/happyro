# 公会常用功能再次复查

[返回公会审查](README.md)

日期：2026-10-29。本轮使用独立的普通测试角色、公会及 GM 控制角色，在本机实际客户端、Gateway 和原生服务端之间执行请求。仓库日志最终截图及成员提示复测使用客户端构建 `mvt34veo`；攻城截图摄于本轮前半段，早于成员提示修复，不将它们标为同一构建。手机和平板为 Chromium 触屏视口模拟。

## 本轮修复

| 问题 | 修复与验证 |
| --- | --- |
| 桌面仓库记录分页上方留白叠加 | 内容区取消底部 padding，保留底栏顶部 8px；标题栏底部至记录框也是 8px。标题栏复用公共样式，这两处留白由仓库记录独立样式控制。实测见 [间距数据](evidence/reaudit/desktop-spacing.json)。 |
| 成员上下线提示显示 `%S` 或缺少名称 | 使用成员数据生成中文提示，不依赖已渲染的成员列表行；实际注销、登录均显示正确名称。见 [提示证据](evidence/reaudit/member-status-notification.json)。 |
| 重新加入公会或转交会长后，重登丢失公会身份 | 原实现覆盖新成员待保存标记，并在移除成员时未同步角色保存比较缓存。修复标记更新与缓存同步；分别验证新会长重登、已缓存成员退会／被移除后重新加入同一公会再重登。 |

公会持久化修复前，角色表的 `guild_id` 为 0，但公会成员表仍保留会长记录；见 [修复前证据](evidence/reaudit/persistence-before-fix.json)。修复后，[新会长重登](evidence/reaudit/persistence-first-relogin.json)和[同公会重新加入后重登](evidence/reaudit/persistence-cached-rejoin.json)均保留正确身份与权限。只修复当前流程，未实现历史数据迁移。

## 常用功能覆盖

| 功能 | 结果与证据 |
| --- | --- |
| 创建公会、材料扣除、等级与技能 | 创建消耗一个华丽金属，初始等级为 1；普通客户端学习技能及公会仓库前置链成功。技能点由控制账号为测试公会准备，未将此作为自然升级验收。[创建](evidence/reaudit/creation.json)、[技能](evidence/reaudit/guild-skill-chain.json) |
| 公告、职位、权限与税率 | 会长修改可读回，普通成员伪造公告请求被拒绝；职位权限和税率保存正确。[公告](evidence/reaudit/notice-permission.json)、[职位](evidence/reaudit/positions.json) |
| 邀请、离会、驱逐、会长转交、解散 | 普通成员离会／驱逐／重新邀请通过；会长直接离会、尚有成员时解散被拒绝；会长转交成功，24 小时内再次转交被正常限制；最后按正常流程解散测试公会。[成员](evidence/reaudit/leave-expel-reinvite.json)、[转交限制](evidence/reaudit/leadership-cooldown.json)、[解散](evidence/reaudit/disband.json) |
| 联盟、敌对与解除 | 联盟双方同步，敌对为单向，解除后清除。[关系](evidence/reaudit/relations.json) |
| 徽章上传与权限 | 当前会长成功上传并持久化；普通成员、无公会账号及无效令牌被拒绝。[接口结果](evidence/reaudit/emblem-http-results.json) |
| 公会仓库存取、互斥与权限撤销 | 苹果存入 5 个、取出 2 个，背包与仓库数量一致；占用时第二成员不能开启，释放后可开，撤销权限立即关闭。[存取与权限](evidence/reaudit/storage-transfer-lock-revoke.json) |
| 仓库记录与物品图标 | 使用真实存取记录，桌面、手机和平板横竖屏均显示图标与数量；分页固定在底栏，移动端不再套内框。分页与异步图标逻辑另有回归测试。 |

## 攻城覆盖

| 模式 | 验证路径 |
| --- | --- |
| FE | 开始／结束切换 GVG 状态；未学习正式公会认可时攻击不能伤害华丽金属；学习后由普通权限骑士发送实际攻击请求击破并占城，守方不能伤害自己的华丽金属，结束后清除已占城的华丽金属。[占城结果](evidence/reaudit/fe-capture.json) |
| SE | 开始／结束状态、两颗守护石与第一道屏障的联动、第一道门楼毁坏后开放而第二道仍保留；拥有城堡的公会可使用旗帜传送，外部公会不能使用。[旗帜传送](evidence/reaudit/se-owner-flag.json)、[外部公会](evidence/reaudit/se-outsider-flag.json) |
| TE | 骑士可进入，临时改为三转职业后被入口拒绝，提示为“当前职业无法进入攻城战 TE。”；随后恢复测试职业。 |

服务端事件见 [攻城记录](evidence/reaudit/siege-events.log)。SE 防御结构通过脚本触发真实死亡事件验证，不代表普通玩家伤害／完整攻城战斗测试。FE 的占城使用实际普通角色攻击，未使用脚本击杀华丽金属。未穷举所有城堡、职业、技能及多人压力场景。

## 最新截图

| 场景 | 截图 |
| --- | --- |
| 桌面仓库记录与 8px 间距 | [查看](evidence/reaudit/desktop-storage-log.png) |
| 手机仓库记录 | [竖屏](evidence/reaudit/phone-storage-log-portrait.png) · [横屏](evidence/reaudit/phone-storage-log-landscape.png) |
| 平板仓库记录 | [竖屏](evidence/reaudit/tablet-storage-log-portrait.png) · [横屏](evidence/reaudit/tablet-storage-log-landscape.png) |
| 成员上线／离线提示 | [查看](evidence/reaudit/desktop-member-status.png) |
| FE 攻击与占城 | [攻击](evidence/reaudit/fe-attack.png) · [占城](evidence/reaudit/fe-captured.png) |
| SE 旗帜传送 | [选择目标](evidence/reaudit/se-owner-flag-menu.png) · [抵达](evidence/reaudit/se-owner-flag-arrival.png) |
| TE 职业限制 | [查看](evidence/reaudit/te-job-blocked.png) |

## 自动化验证与清理

- 客户端相关 9 个测试文件、55 项测试通过，覆盖公会状态、封包、移动端社交／仓库、日志图标及通知。[结果](evidence/reaudit/client-tests-final.log)
- 服务端 6 组编译执行的实际函数回归通过，覆盖创建、权限刷新、仓库锁定、管理授权、离会状态及成员持久化；SE 时段 2 项测试通过。[函数回归](evidence/reaudit/server-functional-tests.log)、[时段](evidence/reaudit/se-schedule-tests.log)
- 客户端完整 `--all` 构建通过，Gateway 3338 校验正在提供 `mvt34veo`。char-server 编译通过并安装到本机运行目录。[安装哈希](evidence/reaudit/installed-char.json)
- 本轮测试期间 OrbStack 数据库虚拟机曾休眠且未正常唤醒，恢复 OrbStack 后继续验证；这次基础环境中断不计为公会功能缺陷。
- 测试公会按正常流程解散；停止 map／char 后清理四个测试账号、角色、测试公会相关数据与日志，城堡表恢复到测试前的空表状态；重新启动服务。[清理结果](evidence/reaudit/cleanup.json)

未提交、未推送。截图与结果的哈希收录在 [证据清单](evidence/manifest.json)。

## NPC 标题汉化补充

后续扩大审查及隐藏后缀修正见[名称扩大审查](localization-expanded.md)。

- SE 的 96 个 `LF-01～LF-10` 显示为「传送旗帜 01～10」。
- TE 第五座艾尔帕兰城堡的 19 个 `W` 旗帜显示为「城堡旗帜」。
- `Investment_total` 显示为「公会投资管理」，`DJ` 显示为「城堡管家」。
- TE 任务两处正文中的 `Gloria`、`Kafragarten` 统一为「荣耀之地」「卡普拉花园」。

使用脚本原生的显示名与唯一名分离语法，117 个 NPC 的内部唯一名及事件引用保持一致；显示名称均符合封包长度限制。重载本机地图服务验证脚本加载。上述 SE 旗帜截图拍摄于此次汉化之前，图中的 LF-01 为旧标题，并非当前显示名称。
