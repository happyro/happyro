# TE 训练攻城战实机验证

2026-10-29，客户端构建 `mvt6t3kq`，本机 Renewal、PACKETVER=20211103，普通权限测试角色「攻城队员」，Knight 99，测试公会 9。下表只报告对应证据覆盖的项目；重启持久化和城堡管理由总验收另行记录。

| 项目 | 结果 | 证据 |
| --- | --- | --- |
| 无主城普通攻击占领 | 通过，核心实际扣血后归属从 0 变为 9 | [归属读回](evidence/war-te/te-real-capture-21.json)、[占领截图](evidence/war-te/te-live-captured.png) |
| 己方核心保护 | 通过，重复普通攻击不扣血 | [前](evidence/war-te/te-owner-before.json)、[后](evidence/war-te/te-owner-after.json) |
| 结束攻城 | 通过，核心消失，归属保留 | [读回](evidence/war-te/te-ended.json) |
| 霸体技能限制 | 通过，城外状态成立，TE 内不成立，服务端拒绝原因 4 | [技能响应](evidence/war-te/te-endure-acks.json) |
| 旗帜回城职业限制 | 通过，Rune Knight 被中文提示拒绝，Knight 可进入 | [拒绝](evidence/war-te/te-third-flag-blocked.json)、[允许](evidence/war-te/te-second-flag-allowed.json) |
| 黄金虫卡片效果限制 | 通过，同一黄金虫盾下狂击城外消耗 30 SP，TE 消耗 15 SP | `te-card-sp-*-before/after.json` |
| 手机、平板横竖屏对话 | 已检查限制提示及正常菜单，标题、文案、关闭和选项按钮完整，无文本裁切或互相遮挡 | 下方截图 |

## 场景准备与边界

无主城 `te_aldecas1` 的脚本会生成黑暗之王等环境怪物。初次测试角色在核心附近被杀回城；为了隔离验证公会战核心和占领规则，本次精确清除了 `Manager_TE#Glaris::OnMyMobDead` 事件生成的环境怪。没有清除核心、没有直接修改核心血量或城堡归属，也没有把这个准备动作当作玩家完成 PVE 清场。攻击、装备与消耗品使用均通过普通角色客户端请求；准备装备见[清单](evidence/war-te/te-defense-loadout.json)。

黄金虫盾可保持穿戴，但其卡片脚本效果在 TE 被忽略。这是当前服务端规则，不应以“装备仍显示已穿戴”判断禁卡失效。

管理员脚本 `warp` 可以直接放置不合资格的职业，不能用它代替普通玩家入口校验。本轮实机验证的是旗帜 NPC 对话入口；普通地图传送点的职业检查另有服务端实现，本页不冒充已实走全部入口。

职业矩阵的 104 项规则检查在总验收记录中；本页的实际角色对照覆盖 Knight 和 Rune Knight，不代表逐个职业都进行了真人流程操作。移动截图采用触屏浏览器模拟、同一移动 UA，按四种视口检查响应布局，并非四台物理设备。

## 关键截图

| 视口 | 职业限制提示 | 正常回城菜单 |
| --- | --- | --- |
| 手机竖屏 430 × 860 | [查看](evidence/war-te/te-phone-portrait-restriction.png) | [查看](evidence/war-te/te-phone-portrait-menu.png) |
| 手机横屏 860 × 430 | [查看](evidence/war-te/te-phone-landscape-restriction.png) | [查看](evidence/war-te/te-phone-landscape-menu.png) |
| 平板竖屏 768 × 1024 | [查看](evidence/war-te/te-tablet-portrait-restriction.png) | [查看](evidence/war-te/te-tablet-portrait-menu.png) |
| 平板横屏 1024 × 768 | [查看](evidence/war-te/te-tablet-landscape-restriction.png) | [查看](evidence/war-te/te-tablet-landscape-menu.png) |

## TE 独立管家脚本

追加测试在完整构建 `mvt9uw1q`、TE 关战状态下进行，由城主公会会长「攻城守方」通过实际 NPC 菜单操作 `克洛德`，覆盖 `agit_main_te.txt` 的独立实现，不借用 FE 的结果。

| 操作 | 结果 | 证据 |
| --- | --- | --- |
| 投资商业发展一次 | 成功，投资次数从 0 变为 1，提示次日提升 | [对话](evidence/war-te/te-invested.json)、[截图](evidence/war-te/te-invested.png) |
| 召唤第 0 号守护者 | 成功，启用状态从 0 变为 1 | [对话](evidence/war-te/te-guardian-summoned.json) |
| 重复召唤同一守护者 | 拒绝，提示已经召唤，不能再召唤一个 | [对话](evidence/war-te/te-guardian-duplicate.json) |
| 无卡普拉契约技能时雇用 | 拒绝，明确要求先学习公会技能 | [对话](evidence/war-te/te-kafra-first.json) |
| 补齐契约技能后雇用 | 成功，卡普拉启用状态从 0 变为 1 | [对话](evidence/war-te/te-kafra-hired.json)、[截图](evidence/war-te/te-kafra-hired.png) |

准备阶段提供测试 Zeny，并通过管理脚本为公会补齐卡普拉契约技能；投资、雇用、召唤及重复请求均通过普通权限会长的客户端对话完成。未修改城堡字段冒充成功。

[操作前](evidence/war-te/TE_MANAGE_BEFORE.json)和[操作后](evidence/war-te/TE_MANAGE_AFTER.json)读回字段顺序为：公会归属、当日经济投资次数、第 0 号守护者启用、卡普拉启用。操作后为 `9 / 1 / 1 / 1`，留给总验收做重启持久化检查；本节不提前宣称重启通过。
