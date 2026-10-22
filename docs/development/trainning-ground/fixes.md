# 修复问题

以下问题均来自本次训练场资源检查或实机验收。测试环境与具体覆盖范围见[验收记录](verification.md)。

## 1. 教官传送到缺失地图，角色重登后仍无法加载

**现象：** 在普隆德拉训练教官处选择基础训练场，客户端提示找不到 `tra_fild01.rsw`。另外两个菜单分别指向 `tra_fild02`、`tra_fild03`，也存在资源缺口。

**根因：** 服务端启用了新版训练场脚本，当前 2021-11-05 客户端资源只包含旧的 `tra_fild`。检查时三张新地图的同名 `.rsw/.gat/.gnd` 请求均返回 404。服务器保存传送后的角色位置，重登仍会尝试加载缺失地图；这是位置所在地图无法加载，不等于角色数据损坏。

**修复：** 从官方 kRO 补丁提取三张地图及模型、贴图依赖，按来源清单和 SHA-256 安装到运行目录，保留官方输入和原 `data.grf`。没有把旧地图伪装成新地图，也没有修改受影响角色的位置。

**相关文件：** [安装器](../../../tools/resources/install-training-maps.mjs)、[资源清单](../../../inputs/manifests/training-maps.json)、[教官脚本](../../../repos/happyro-server/npc/re/warps/other/TrainingZone123.txt)。

**复验：** 实际角色分别通过教官三个菜单进入地图；三场均完成浏览器退出、登录和重新选角入场，地图与角色位置正确。见 [live.json](evidence/live.json) 和[重登摘要](evidence/verification.json)。

## 2. 地图支持判断误要求地面文件与地图同名

**现象：** 即使补充官方文件，原有支持清单生成逻辑仍无法正确识别全部三张地图，小地图也需要关联共享图像。

**根因：** 原逻辑要求同一名称同时存在 `.rsw/.gat/.gnd`。实际三个官方 RSW 都引用 `tra_fild02.gnd` 和 `tra_fild02.gat`，并共享同一张小地图。

**修复：** 从运行 GRF 和散装覆盖文件生成地图资源清单，按 RSW 的真实引用检查地面与碰撞文件；补齐三张地图的中文名称、官方共享小地图关联和后台预览。

**相关文件：** [运行地图清单生成器](../../../tools/resources/world/generate-map-resources.mjs)、[客户端目录生成器](../../../repos/happyro-client/scripts/generate-world-catalog-assets.mjs)、[地图目录生成器](../../../tools/resources/world/generate-map-catalog.mjs)、[小地图关联](../../../repos/happyro-client/src/DB/Map/MiniMapTable.js)、[地图名称](../../../repos/happyro-client/src/DB/Map/MapTable.js)。

**复验：** 支持清单仅新增 `tra_fild01/02/03`，原有地图未被移除。三张地图完成无头加载和渲染，游戏内小地图正常，后台三张预览均返回成功。共享文件关系是官方资源结构，不是旧版本兼容分支。

## 3. 新版训练假人显示成错误怪物

**现象：** 进入地图后，部分假人显示成其他怪物，无法仅凭“地图加载成功”确认训练场内容正确。

**根因：** 旧客户端缺少新版假人的外观映射，落入未知魔物的默认外观；旧映射也未反映部分假人的新版官方形象。

**修复：** 从官方 `NPCIdentity.lub`、`jobName.lub` 核对训练场使用的 143 个魔物 ID，补齐明确的 `S_DUMMY_*` 外观映射和 13 套 SPR/ACT，共 26 个文件。假人中文名称以服务端魔物定义为准。

**相关文件：** [外观映射](../../../repos/happyro-client/src/DB/Monsters/MonsterTable.js)、[中文名称](../../../repos/happyro-client/src/DB/Monsters/MonsterNameTable.js)、[官方映射来源](../../../inputs/manifests/training-dummy-identity.json)、[映射回归测试](../../../repos/happyro-client/tests/db/TrainingDummies.test.js)。

**复验：** 143 个 ID 均有明确映射和中文名称；26 个 SPR/ACT 通过当前客户端解析器。实机攻击时外观和物理／魔法抗性图标正确，24 组战斗组合得到 72 次有效伤害回包。

| 修复前 | 修复后 |
| --- | --- |
| [错误外观截图](evidence/screenshots/dummy-before.png) | [官方假人外观及伤害截图](evidence/screenshots/tra_fild02-physical-dummy.png) |

## 4. 个人仓库打开后仍保留 NPC 对话框

**现象：** 个人仓库打开后，对话框留在仓库窗口背后，关闭按钮被遮挡。

**根因：** 脚本直接执行 `openstorage`，没有先结束对话显示；菜单还保留了未使用的仓库空槽。

**修复：** 通过技能和金币检查、扣费后执行 `close2`，再打开个人仓库。菜单只保留“个人仓库”“公会仓库”“取消”，同步调整分支编号。

**相关文件：** [训练场服务 NPC](../../../repos/happyro-server/npc/re/other/TrainingZone123.txt)。

**复验：** 三场均能打开并关闭个人仓库，NPC 对话框已关闭，每次成功使用扣除 1000 Zeny。实际存入、取出红色药水成功；取消、技能不足、金币不足时不扣费。见 [storage.json](evidence/storage.json)。

| 修复前 | 修复后 |
| --- | --- |
| [对话框留在仓库背后](evidence/screenshots/current.png) | [个人仓库正常打开](evidence/screenshots/tra_fild01-storage.png) |

## 5. NPC 源名称及公会仓库标题存在英文

**现象：** 教官和管理员在服务端仍使用英文源名称；公会仓库窗口实测显示 `Guild Storage`。

**修复：** 教官及管理员源名称改为中文，同步 NPC 目录；桌面与移动端使用同一个仓库标题翻译函数，将标准个人／公会仓库标题显示为“仓库”“公会仓库”。保留玩家或服务端自定义仓库名称本身。

**相关文件：** [教官与管理员脚本](../../../repos/happyro-server/npc/re/warps/other/TrainingZone123.txt)、[仓库标题](../../../repos/happyro-client/src/UI/Components/Storage/StorageLabels.js)、[仓库处理](../../../repos/happyro-client/src/Engine/MapEngine/Storage.js)、[本地化测试](../../../repos/happyro-client/tests/ui/StorageLocalization.test.js)。

**复验：** 12 处闲聊 NPC 对白完成检查，143 个假人中文名称无缺失。修复后重新登录并实际打开公会仓库，标题显示为“公会仓库”；共享翻译函数的测试覆盖标准标题和自定义标题。见 [guild-final.json](evidence/guild-final.json) 与[中文标题截图](evidence/screenshots/tra_fild01-guild-storage-translated.png)。移动端标题使用同一函数，本轮未另做移动端实机流程验收。
