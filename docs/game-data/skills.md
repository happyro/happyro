# 技能说明、状态图标与冷却

这三种数据用途不同。文字描述不能决定技能能否释放，静态说明也不能替代服务器下发的实际倒计时。

## 来源与维护

| 内容 | 维护源 | 运行消费者 |
| --- | --- | --- |
| 技能名称与正文 | `localization/client/data/skill-description-prose.zh-CN.json`、`skill-description-labels.zh-CN.json`、生成器中的名称规则 | Client `SkillLocalizationTable.generated.js` |
| 技能基础参数 | Server `db/re/skill_db.yml` | Server 技能实现；根生成器用于补充显示参数 |
| 技能定义、职业继承与技能树 | `skill-runtime-source.json`，含核验过的 LUB 与基础表哈希 | `SkillInfo.generated.js`、`SkillTreeView.generated.js` |
| 状态图标与计时元数据 | `efstids.lub`、`stateiconimginfo.lub`、`stateiconinfo.lub` | `DBManager.loadStateIconInfo` |
| 状态中文描述 | Client `src/DB/Status/stateiconinfo.zh-CN.json` | `StatusDescriptionLocalization.js` 在 LUB 加载时保留中文描述 |
| 当前技能剩余冷却 | map-server `SKILL_POSTDELAY` | Client `Network/SkillCooldowns.js`，快捷栏和技能窗口共同消费 |

当前生成器输出 1767 个名称/说明条目，包含 1279 条有原始技能描述的中文正文，以及其他静态条目。计数是固定版本校验值，不证明所有译文逐句正确。生成器默认不读取 Server `db/import` 或运行中的装备修正；界面文字是参考配置，实际以服务器为准。

## 当前说明与用户要求的边界

现有已提交生成器仍组合中文正文、技能条件和服务器参数；时间标签已移除“（基础）”。因此它不是纯粹逐行翻译的 `skilldescript.lub`。

用户要求不擅自添加原文以外内容。一次尝试批量按原文重组的未提交修改已回滚；当前源码没有采用当时新增的韩文快照或条件表。不要把 stash 或 `work/` 中的审查脚本作为正式说明源，也不要声称该重组已经发布。后续若再做原文校准，应逐条对照、保留证据和译文，不根据服务端数值、技能树或推测补句。这是尚未完全满足的内容约束，而不是新的生成能力。

## 冷却与状态时间

- `Cooldown`：同一技能再次施放的间隔，毫秒；`AfterCastActDelay`：施放后动作限制。
- `CastTime` / `FixedCastTime`：吟唱参数。数值可能按等级变化，实际受角色、装备、状态及服务端实现修正。
- `Duration1` / `Duration2`：含义依具体技能实现，不能一概视为独立冷却。
- 状态 LUB 的 `haveTimeLimit` / `posTimeLimitStr` 控制效果计时描述，不提供技能独立冷却。服务端用 9999 表示无期限状态的现有协议约定，客户端需保持一致。
- `SkillCooldowns` 在当前连接内按技能 ID 保存截止时间，使用单调时钟；全局间隔单独保存，取较晚截止。服务器缩短/清零会更新状态，断线清空，重登由服务器恢复。不能依赖快捷槽位先存在。
- `type=0` 是被动技能，不得为使某个技能可用而默认转成自身主动技能。

全力推进（5014）当前数据库配置：Lv.5 增益 30 秒、后续疲劳 10 秒、独立冷却 3000000 ms（50 分钟）。这是服务端配置事实，不是韩文说明的完整译文。

## 更新与验证

从根仓库运行：

```bash
node scripts/resources/generate-skill-localization.mjs --write --no-color
node scripts/resources/generate-skill-localization.mjs --check --no-color
(cd repos/happyro-client && npm test -- --run tests/db/SkillLocalizationTable.test.js tests/db/StatusDescriptionLocalization.test.js tests/network/SkillCooldowns.test.js tests/ui/SkillUse.test.js)
./scripts/client/refresh-client.sh build --no-color
```

最后一个命令要求 Gateway 运行，构建全部 PWA 应用并比较 HTTP 哈希。检查技能窗口、F 键、重登后的冷却、效果状态图标和长说明滚动。验证施放时先保留角色状态证据；不为解释冷却而直接清空玩家数据库。历史案例见[2026-09-13 验收](../history/validation/2026-09-13-skill-cooldown.md)。
