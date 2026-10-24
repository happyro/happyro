# 自动战斗自身增益

第一版只维持自身状态。战斗设置沿用单列表展示所有可选技能；勾选增益即启用，随自动战斗启停。普通攻击按钮只清除攻击技能选择，保留增益选择。不开设队长目标、独立开关或优先级参数。

## 运行结构

- `Network/PlayerStatuses.js` 保存服务端同步的自身状态，不依赖图标、DOM 或 UI 可见性。状态刷新与移除从 `MSG_STATE_CHANGE*` 进入；断线、回选角及重新登录清理，正常同连接切图遵循服务端状态刷新／移除。
- `CombatBuffRules.js` 是审核过的技能与客户端状态映射及限制条件。`chooseCombatBuff` 只选候选，不发送请求。
- `AutoCombatScheduler.js` 协调自身增益与攻击机会，连续补两个增益后，有目标时让出攻击机会；同一增益两次请求至少相隔 10 秒，避免持续驱散造成循环补状态。
- `AutoCombatSkillState.js` 保存请求自身的目标与类型。有明确目标的失败按魔物隔离，无目标失败按技能退避；自身增益以自身为目标，不因魔物消失而丢失确认。
- `GameAutoCombat.js` 读取实时技能、SP、HP、冷却和状态，最终向自身 GID 施放。服务器继续执行技能资格、材料与状态限制。
- `GameAutoCombatRuntime.js` 保留独立的物品回执通道，每轮先检查自动恢复，再运行战斗调度。等待技能回执不阻止自动恢复。

## 状态确认和调度

已有状态直接跳过，包括队友施加的状态；不覆盖已有等级，不提前续接。缺失状态在自动战斗开启、非手动移动、非施法／动作占用时补充；附近没有魔物也可补充。只操作自身，群体技能自然作用于附近队友，但不检查和维护队友状态。

补增益需同时取得执行回执和目标状态。先收到状态或先收到执行回执均可；执行后等待状态最多 1.5 秒，没有执行回执最多 8 秒，读条按服务端时长加 8 秒。重复群体动画回执不延长状态确认期限。失败和超时暂避该自身技能 10 秒，其他攻击和增益可继续。只有攻击请求超时启用现有 3 秒普攻恢复策略。

## 已审核技能

| 技能 | 服务端状态 | 客户端状态 |
| --- | --- | --- |
| AL_BLESSING | Blessing | BLESSING |
| AL_INCAGI | IncreaseAgi | INC_AGI |
| AL_ANGELUS | Angelus | ANGELUS |
| PR_IMPOSITIO | Impositio | IMPOSITIO |
| PR_MAGNIFICAT | Magnificat | MAGNIFICAT |
| PR_GLORIA | Gloria | GLORIA |
| AC_CONCENTRATION | Concentrate | CONCENTRATION |

依据 `repos/happyro-server/db/re/skill_db.yml`、`db/re/status.yml` 与 `src/map/skills/acolyte/`、`src/map/skills/archer/concentration.cpp` 核对。Renewal 的神威祈福为群体技能，仍仅请求一次自身目标。

赐福和加速术在服务端 `Changeundead` 状态下可能伤害目标，因此在对应 `PROPERTYUNDEAD` 状态存在时禁止自动施放；加速术额外检查 15 点 HP 消耗。材料不足、沉默等服务端拒绝沿用失败退避。

暂不开放开关型、互斥属性赋予、次数护盾、地面领域和特殊副作用技能。扩展时必须核对实际效果、状态封包、前置条件和互斥关系，不能只凭技能的 Self／Support 类型推断。

能力准入、施放条件、陷阱和自身范围攻击由独立模块处理，详见客户端[移动与自动战斗](../../../repos/happyro-client/docs/gameplay/combat.md)。七项自身增益规则保持独立，不与减益／伤害看门狗混用。
