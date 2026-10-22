# 实机验收记录

日期：2026-10-23。环境：本机 macOS 原生服务、Renewal、PACKETVER=20211103、无头 Chromium。结构化结果见 [summary.json](evidence/summary.json)。

## 准备与隔离

创建四个独立普通权限账号，全部角色通过浏览器创建界面创建。主流程未直接写入角色表、等级、任务变量、击杀计数、金币或职业；升级、任务完成和转职来自正常游戏流程。使用客户端正常封包分配角色赚取的属性／技能点、装备奖励、攻击、拾取及出售物品。辅助 NPC 和提示复验使用正常导航传送到指定区域，证据中单独注明，不作为主线步行推进证据。

## 结果

| 项目 | 实测内容 | 证据 |
| --- | --- | --- |
| 沉船出生 | UI 创建角色后出生和初始复活点为 iz_int,18,26；受伤剑士、离船到岛屿及船长对话正常 | [沉船回归](evidence/NoviceShipAudit.json) |
| 经典出生 | UI 创建角色后出生和初始复活点为 new_1-1,53,111 | [经典主线](evidence/NoviceClassicMain.json) |
| 模式切换 | classic 切回 ship 后，新创建角色回到沉船；已有经典角色能继续做任务 | [切回沉船](evidence/NoviceShipAfter.json)、[经典主线](evidence/NoviceClassicMain.json) |
| 杜兰 | classic 模式下创建仍为 lasa_fild01,48,297，职业 4218 | [杜兰回归](evidence/NoviceDoramAudit.json) |
| 初始教学 | 斯普拉基、过桥进城堡、开始训练、装备领取／检查、急救学习及使用、服务介绍任务 7117～7121 正常推进 | [经典主线](evidence/NoviceClassicMain.json) |
| 跳过教学 | 六个城市全部通过实际新角色对话选择，落点及保存点正确 | [城市分支](evidence/NoviceClassicSkip.json) |
| 首次战斗 | 自然击杀波利完成 7122 并领取奖励 | [经典主线](evidence/NoviceClassicMain.json) |
| 职业体验 | 六个导师介绍、手册发放；两次换手册间只移除手册，已装备新手防具及武器保留 | [经典主线](evidence/NoviceClassicMain.json) |
| 职业任务 | 7123 小鸡 2 只、7124 疯兔 5 只、7127 树精 5 只实际狩猎交付；7126 出售自然掉落和初始装备赚取至少 300 Zeny，收到 7 个精炼材料 | [经典主线](evidence/NoviceClassicMain.json) |
| 五档战斗区 | 1～5 档均经教官切换；取消不再尝试进入 new_6-3 | [经典主线](evidence/NoviceClassicMain.json) |
| 职业适性测验 | 30 道题及后续菜单共 34 次选择，中文选项正常，选定职业后送往魔法师公会并正常重登 | [适性测验](evidence/NoviceClassicQuiz.json) |
| 补充 NPC | 公告牌、两侧守卫、补课教官、额外职业介绍和战斗等级说明 | [主线](evidence/NoviceClassicMain.json)、[补充验收](evidence/NoviceClassicQuiz.json) |
| 任务汉化 | 回编译后的斯普拉基／珍河、小鸡等名称实际载入；自然击杀波利后显示中文完成提示 | [主线](evidence/NoviceClassicMain.json)、[补充验收](evidence/NoviceClassicQuiz.json) |
| 完成与转职 | 自然达到 Job 10、基础技能 9，经训练场导师离场，再与剑士公会 NPC 正常转职，重登后仍为剑士 | [经典主线](evidence/NoviceClassicMain.json) |
| 死亡复活 | 普通测试初心者被自然魔物击倒，点击“返回保存点”，回到训练场保存点 new_1-2,101,101，任务及已完成击杀进度保留 | [补充验收](evidence/NoviceClassicQuiz.json) |

## 资源及自动检查

- 20 个经典逻辑地图通过原始资源表引用 new_zone01～04；其 RSW、GND、GAT、模型和贴图共 131 个唯一文件全部可读取并由现有解析器解析。没有发现需另行从网上下载的必需资源。见 [resource-audit.json](evidence/resource-audit.json)。
- NPC／魔物可见源名称、旧迁移 NPC 删除、取消分支、手册装备保留逻辑已检查。见 [static-audit.json](evidence/static-audit.json)。
- 出生策略 C++ 单元测试覆盖未设置、ship、classic、空值、错误大小写及非法值。见 [config-test.json](evidence/config-test.json)。
- 两份任务 LUB 使用 Lua 5.1 工具链回编译，运行时逐字段语义校验通过，覆盖后回读目标 SHA-256。见 [quest-install.json](evidence/quest-install.json)。
- 客户端任务页签、移动任务界面、任务资源加载相关测试通过，完整 `--all` PWA 构建通过。

## 验收边界

主线由一名人类男性角色完整完成；并未穷举所有性别、职业及问卷答案组合。六职业介绍和四个职业任务已覆盖，实际最终转职验收为剑士，适性测验离场验证为魔法师公会。五个战斗区域均进入，但没有重复点击每个区域的所有同源 NPC。沉船回归验证其出生及前段教学，没有重新执行整套既有学院课程。

常规客户端仍会探测部分可选的全局资源地址并收到 404；各会话记录保留这些请求，不将其隐去或当作本次必需地图缺失。两次路径／菜单定位辅助脚本修正及 SQL 自动保存延迟不代表任务失败；最终结果依据服务端任务状态、客户端真实回包／显示和实际交付。

## 收尾

本机出生环境恢复为 `ship`，所有 11 个测试角色均已离线，四个账号都是普通权限，测试浏览器及控制端口已关闭。测试角色保留用于复验，没有删除或改动现有玩家。代码和文档仍未提交、未推送。

## 翻译审查与验证

经典训练场及九职业的名称、对白、问卷描述和关联任务文本审校见[翻译审查](translation-review.md)。

最终整体复审及新增修复见[最终复审](final-review.md)。

后续已完成[九职业原生转职实机验收](nine-jobs.md)，补齐此前未全部实测的九个一转终点；测试前置准备与原生流程边界在该文档单列。
