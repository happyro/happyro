# 自动恢复架构

## 边界

客户端 `GameAutoCombatRuntime` 是桌面与移动端共同的生命周期协调器，仅保留一个有效实例和一条 200 ms 调度计时器。每轮先运行恢复策略，再运行原有战斗控制器；恢复不依赖目标、移动暂停或技能等待状态，技能择优、拾取与瞬移的原有行为仍由各自控制器管理。

`RecoveryController` 是注入时钟、角色状态、背包、可用条件与使用道具执行器的纯策略。HP/SP 使用独立滞回区间，HP 优先；失败按物品退避，其他候选可继续执行。恢复设置加入角色级 `AutoCombatSettings`，通过同一次配置保存提交；运行状态、失败计数和等待请求不持久化。

`GameAutoRecovery` 适配实时角色与背包，屏蔽 NPC 对话、切图请求、瞬移等待等禁止条件。正常施法或移动不占用物品执行通道。`RecoveryPanel` 负责共享表单，两端容器提供各自现有 Tab 外观和生命周期。

## 执行和回执

所有物品使用经 `MapEngine.onUseItem` 进入 `ItemUseExecution`，同一时刻只有一个未确认物品请求。以角色实体、背包索引与物品 ID 关联服务器回执，不添加协议中不存在的请求编号。成功回执先更新背包，再通知执行器；HP/SP 变化由服务端状态更新驱动，不能从血量暂时不变推断失败。

自动恢复在回执之后至少等待 800 ms，手动使用道具不受这个自动恢复间隔限制。已知的物品独立冷却和状态组冷却由资料映射提供，手动与自动使用道具成功都更新相同冷却信息。

请求超过 3 秒未确认时，释放执行通道并隔离该背包索引，不盲目重发。其他索引的道具仍可使用；迟到回执只能解除对应隔离，不能确认后发请求。断线清空执行器状态。停止自动战斗不抹掉尚未确认的网络请求；恢复控制器的代次与请求对象校验阻止旧回调改变新一轮规则状态。

失败不会锁住战斗：当前道具暂避后可尝试后续选定道具，缺少 HP 道具不妨碍 SP 恢复。普通攻击和技能兜底不等待恢复策略完成。

## 道具资料

客户端 `scripts/generate-recovery-items.mjs` 读取当前服务端 Renewal 可用物品及 import 覆盖。仅接受完整脚本为单条 `itemheal` 或 `percentheal`、参数为非负常量或 `rand` 的即时消耗品；不解析本地化说明，不执行服务器脚本，不自动放行复杂脚本。绿色药水等单纯解除状态物品不会纳入。

源文件 SHA-256 和筛选后的恢复对象、方式、参数、冷却毫秒及冷却组保存在 `src/DB/Items/RecoveryItems.json`。目前 254 项。扩展复杂消耗品时应增加明确、可测试的规则，不能扩大正则使未审查脚本默认通过。

```sh
cd repos/happyro-client
node scripts/generate-recovery-items.mjs generate --output ../../work/auto-recovery/items.json --no-color
cp ../../work/auto-recovery/items.json src/DB/Items/RecoveryItems.json
node scripts/generate-recovery-items.mjs check --output src/DB/Items/RecoveryItems.json --no-color
```

不带参数只输出帮助。数据更新后运行恢复与战斗测试，再完整构建 PWA：`npm run build -- --all`。

## 验证

单元测试覆盖滞回阈值、HP/SP 优先级、复合道具、失败退避、库存耗尽、未选择道具、未知状态、迟到回执、共享冷却、会话重建和 UI 保存；适配层测试覆盖施法与移动共存、NPC 与切图阻断。

本机实测使用已有验收角色罗安，通过实际服务器回执确认红药、蓝药消耗及 HP/SP 增加，并恢复测试消耗与配置；桌面、手机竖屏和平板检查标签切换、道具选择、库存及溢出。工作证据位于 `work/auto-recovery/`，不作为文档宣传截图发布。

专用验收角色 JobAudit4F 额外验证缺 SP 后使用蓝药、火箭术（19）和冰箭术（14）正常完成。两次服务器分别确认 1200、1230 点技能伤害，读条回执与伤害回执之间仍收到蓝药成功回执；随后恢复职业、等级、属性、点数与配置。证据为 `work/auto-recovery/mage-results.json` 和 `mage-cleanup.json`。

恢复与拾取共同使用 `ItemSelectionDialog`，搜索数据由各自适配器提供；恢复仅返回当前背包中符合对应 HP/SP 恢复条件的物品。勾选保持为弹窗草稿，确认后才写入设置，取消不保存。`ItemImageLoader` 管理恢复列表及弹窗的图标对象 URL，关闭和重绘时回收，迟到图片不会污染下一次列表。
