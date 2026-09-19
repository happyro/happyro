# 初始调查与证据

核查日期：2026-09-20。本页是实施前的历史快照，不代表当前实现或验收状态；当前状态见[实现进度](progress.md)，实际设计见[实现方案](implementation.md)。

初始源码基线：根仓库 `57f5fe89`，Client `dfbc3420`，Server `e437cc3c8`，Admin `228386d`。后续实现与验证应另记录实际版本。

## 已确认的问题与基础

| 项目 | 证据与结论 | 证据类型 |
| --- | --- | --- |
| 服务端四转 | `db/re/job_exp.yml`、`job_stats.yml`、`skill_tree.yml` 已定义四转；`src/map/skills/` 存在相关技能实现 | 源码核查，未逐技能实测 |
| Base 200 上限 | 三转相关分组上限为 200；四转分组为 Base 275／Job 60。用户当前角色未查询，不能把所有等级异常都归因于职业 | 源码核查 |
| 转职 NPC | `npc/custom/jobmaster.txt` 支持四转，位置为 `prontera,153,193`；`npc/scripts_custom.conf` 的加载行被注释 | 仓库配置核查，未检查运行中 NPC 列表 |
| 常规四转条件 | `Can_Change_Fourth` 要求进阶三转、存在四转对应职业且尚未四转；默认等级要求 200／70，宝宝不能四转 | 源码核查 |
| 扩展转职 | 脚本有部分扩展职业分支；不同职业需核对专用条件，不能仅凭 `.FourthExpanded = true` 判断全部路径完整 | 源码核查，待逐分支审计 |
| 冒险工具列表 | `CharacterMaintenanceTab.js` 从 `JobDisplayNameTable` 生成列表；该中文表缺少四转条目 | 源码核查 |
| 冒险工具等级 | 表单读取角色快照的 `max_base_level`、`max_job_level`；Game Control 用服务端职业规则限制数值 | 源码核查 |
| 转职与升等级同请求 | `character.progression.update` 先按当前职业上限校验 Base，再执行转职，可能拒绝合法的目标职业等级 | 源码核查，尚未发送变更请求复现 |
| 四转属性界面 | Client 存在特性属性、特性点与 AP 接收处理；WinStats 按版本选择界面，已有带特性属性的版本 | 源码核查，未浏览器验收 |
| 冒险工具特性管理 | 当前快照有 AP／最大 AP，但没有完整特性属性数据；属性修改只支持六项基础属性，Admin 请求白名单同样如此 | 源码核查 |

## 代码入口

- [服务端经验表](../../../repos/happyro-server/db/re/job_exp.yml)、[职业属性表](../../../repos/happyro-server/db/re/job_stats.yml)、[技能树](../../../repos/happyro-server/db/re/skill_tree.yml)。
- [现有转职大师](../../../repos/happyro-server/npc/custom/jobmaster.txt)、[自定义 NPC 加载表](../../../repos/happyro-server/npc/scripts_custom.conf)。
- [Game Control](../../../repos/happyro-server/src/map/game_control.cpp)：角色快照、进度修改、属性修改、重置和恢复。
- [客户端职业 ID](../../../repos/happyro-client/src/DB/Jobs/JobConst.js)、[资源名映射](../../../repos/happyro-client/src/DB/Jobs/JobNameTable.js)、[中文职业表](../../../repos/happyro-client/src/DB/Jobs/JobDisplayNameTable.js)。
- [冒险工具角色维护](../../../repos/happyro-client/src/UI/Components/GameTools/CharacterMaintenanceTab.js)、[属性界面](../../../repos/happyro-client/src/UI/Components/WinStats/WinStatsCommon.js)。
- [Admin 请求校验](../../../repos/happyro-admin/backend/app/Http/Requests/AdventureTools/RunCharacterMaintenanceRequest.php)。

以上跨仓库链接需要本地检出相关产品仓库。

## 人物资源核查

检查了 `work/grf-extract/kro-20211105/data/manifest.json` 中的身体 SPR／ACT；其来源记录为 `inputs/runtime/kro-20211105/client/data.grf`。随后通过本机 Gateway `3338` 的 `/search` 只读搜索接口复核以下全部职业的身体文件索引，并实际读取龙骑士男性身体 SPR：HTTP 200，316846 字节。

| 范围 | 职业代码与 ID | 身体资源索引 |
| --- | --- | --- |
| 常规 | DRAGON_KNIGHT 4252、MEISTER 4253、SHADOW_CROSS 4254、ARCH_MAGE 4255、CARDINAL 4256、WINDHAWK 4257、IMPERIAL_GUARD 4258、BIOLO 4259、ABYSS_CHASER 4260、ELEMENTAL_MASTER 4261、INQUISITOR 4262 | 各有男女 SPR／ACT，共 4 个基本身体文件 |
| 常规性别职业 | TROUBADOUR 4263、TROUVERE 4264 | 分别有男性、女性 SPR／ACT |
| 扩展 | SKY_EMPEROR 4302、SOUL_ASCETIC 4303、NIGHT_WATCH 4306、HYPER_NOVICE 4307、SPIRIT_HANDLER 4308 | 各有男女 SPR／ACT |
| 扩展性别职业 | SHINKIRO 4304、SHIRANUI 4305 | 分别有男性、女性 SPR／ACT |

资源名注意：当前映射及实存文件使用 `elemetal_master`，不能未经核对改成英文职业代码的拼写。Spirit Handler 身体位于多兰族路径。骑乘、狼、机甲等形态不是上述基本身体文件核查的完整覆盖范围。

这次确认的是本地实际资源内容，不凭目录名推断其完整时代版本，也不证明全部技能资源与当前服务端匹配。已有提取清单是历史生成物；正式验收必须针对届时实际运行资源重新生成报告、记录来源与哈希。

## 尚未验证

- 全部职业的前置条件与扩展职业 NPC 路径，尤其不能假定星帝与灵魂系进阶路径已经接通。
- 运行中服务是否与调查源码完全一致，数据库结构、职业与特性字段的实际持久化情况。
- 每个技能的效果、特效、图标、状态、中文文本及 20211103 封包适配。
- 275 级成长、特性点发放、AP、技能点分配、洗点、跨职业切换与重登。
- 全部装备、特殊形态、武器动作、染色和纸娃娃叠加。
- 四转成长所需装备、地图、怪物内容的可获得性；其缺口需区分为职业功能缺陷或额外内容需求。

本次未修改角色、未启用 NPC、未构建或部署产品。
