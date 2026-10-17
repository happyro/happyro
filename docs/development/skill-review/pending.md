# 职业技能审计：尚未解决的事项

更新于 2026-10-18。针对[已修复问题来源索引](evidence/fix-source-index.json)中的 36 个历史提交、后续修复提交与当前代码重新核对。本文记录审计范围内留下的事项，不表示这些问题都是由这 36 个提交引入。

总体范围见[审查结果](README.md)，已修复项见[126 项修复清单](fixes.md)。本文不恢复轮次报告，也不把旧记录里已被后续修复的问题重新列为待办。

## 阅读与处理顺序

1. 优先统一 U001–U007 七项已确认的说明／配置差异；它们容易误导玩家，修改前确认采用的规则。
2. 定位冒险工具偶发 504；它属于实机过程中的跨系统问题，不能据此判断技能无效。
3. 确认 Gravity、涂鸦等旧功能是否纳入当前支持范围，再补实现。
4. 分批补视觉缺口和未覆盖的实机条件。未知官方系数先找版本依据，不按猜测修改。

“规则待确认”“尚未验证”不等于已确认 bug；“用户跳过”不自动重新启动。此次未修改产品、重启服务或重新测试战斗。表内来源为当前已入库文件或独立产品仓库中的代码；没有引用忽略目录里的临时记录。

## 优先处理：已确认的说明／配置差异

以下差异在当前源码和中文说明中仍存在。差异本身确定，但是否修改文案或服务器规则，需要先确定采用的版本规则；不默认以其中一方为官方标准。

| 编号 | 项目 | 当前结论 | 下一步与结项条件 | 核对来源 |
| --- | --- | --- | --- | --- |
| U001 | 半径固定吟唱说明 | 说明固定为 10/15/20%；当前实现为 (INT+BaseLevel)/15 + 5×技能等级，且只对指定巫师技能区间生效。先前“覆盖施法等级”已修复，此处是另一问题。 | 明确当前规则并同步说明；实机已验证射程，固定吟唱应单独对照。 | [skill-description-prose.zh-CN.json](../../../localization/client/data/skill-description-prose.zh-CN.json)、[skill.cpp](../../../repos/happyro-server/src/map/skill.cpp) |
| U002 | 研究新毒药持续时间说明 | 说明把 45 秒起每级加 15 秒写成致命涂毒总时长；实现是额外增加 30+15×研究等级秒。实测研究 1/10 级对应 5 级致命涂毒 165/300 秒。 | 明确写成额外延长，不因文字歧义改变已验证持续时间。 | [skill-description-prose.zh-CN.json](../../../localization/client/data/skill-description-prose.zh-CN.json)、[status.cpp](../../../repos/happyro-server/src/map/status.cpp)、[poison-research.json](evidence/revalidation/poison-research.json) |
| U003 | 皮肤锻炼火抗表 | 说明每级 4%，实现每级 5%；无属性耐性每级 1% 一致。 | 确认采用规则，更新等级表并保留火／非火对照。 | [skill-description-prose.zh-CN.json](../../../localization/client/data/skill-description-prose.zh-CN.json)、[status.cpp](../../../repos/happyro-server/src/map/status.cpp) |
| U004 | 移动 HP 恢复的比较基准 | 说明为静止效率 25%；实现行走自然恢复间隔加倍，约为站立自然恢复的 50%，不能把坐下恢复混作静止基准。 | 明确站立／坐下、自然／技能恢复的区别；连续移动实测已通过，不是移动不能回血。 | [skill-description-prose.zh-CN.json](../../../localization/client/data/skill-description-prose.zh-CN.json)、[status.cpp](../../../repos/happyro-server/src/map/status.cpp)、[moving-recovery-continuous.json](evidence/revalidation/moving-recovery-continuous.json) |
| U005 | 奥里德原研究默认关闭收益 | 说明无条件提高制造成功率；仓库配置 oridecon_research_fix=no，当时运行进程也为 0，相关额外成功率未启用。 | 决定保留默认规则还是开启收益，再同步说明；高属性锻造成功不能证明概率加成。 | [skill-description-prose.zh-CN.json](../../../localization/client/data/skill-description-prose.zh-CN.json)、[skill.cpp](../../../repos/happyro-server/src/map/skill.cpp)、[skill.conf](../../../repos/happyro-server/conf/battle/skill.conf)、[oridecon.json](evidence/revalidation/oridecon.json) |
| U006 | ABR 精通表未表达主人属性参与 | 表格看似固定 HP／攻击增量；实现 HP 乘主人 VIT，攻击含主人基础攻击，并有说明未列出的命中加成。源码明确是自定义近似公式。 | 先补清当前实现说明；是否改公式另需版本依据，HP 分支另列验证待办。 | [skill-description-prose.zh-CN.json](../../../localization/client/data/skill-description-prose.zh-CN.json)、[status.cpp](../../../repos/happyro-server/src/map/status.cpp) |
| U007 | 主力游侠的目标与抗性表述 | 攻击分支有玩家杜兰特例，防御只对魔物且为软防数值；说明没有明确这些边界，抗性容易被误读成百分比。 | 补充目标范围和数值含义，按需验证玩家／杜兰及受击分支。 | [skill-description-prose.zh-CN.json](../../../localization/client/data/skill-description-prose.zh-CN.json)、[battle.cpp](../../../repos/happyro-server/src/map/battle.cpp) |

## 功能缺口：尚未补完

这些是代码审查明确保留的旧功能缺口，不应因为整条职业线已审查而标成可完整使用。

| 编号 | 项目 | 当前结论 | 下一步与结项条件 | 核对来源 |
| --- | --- | --- | --- | --- |
| U008 | 随机技能 Gravity 无实际效果 | SA_GRAVITY 的方法明确只发无伤害技能通知，没有实际效果；属于 Hocus Pocus 随机派生入口。 | 先确定当前版本是否应支持；补实现或明确不可用，不套用另一个重力技能规则。 | [gravity.cpp](../../../repos/happyro-server/src/map/skills/mage/gravity.cpp) |
| U009 | 涂鸦／城旗涂鸦未完整实现 | 涂鸦缺完整文字输入及地面显示，城旗涂鸦缺专属服务端工厂实现；技能树中仍有相关条目。 | 逐项确定支持范围，补服务器入口与客户端交互，并测试取消、切图、生命周期。 | [skill_factory_thief.cpp](../../../repos/happyro-server/src/map/skills/thief/skill_factory_thief.cpp)、[skill_tree.yml](../../../repos/happyro-server/db/re/skill_tree.yml)、[SkillEffect.js](../../../repos/happyro-client/src/DB/Skills/SkillEffect.js) |

## 间歇故障与交互反馈

不把原因尚未确认的故障，或可以使用但提示不清的场景，混成已定位的技能公式 bug。

| 编号 | 项目 | 当前结论 | 下一步与结项条件 | 核对来源 |
| --- | --- | --- | --- | --- |
| U010 | 冒险工具偶发 504 | 实机审计发生过 504，但地图服务及原始技能回包仍正常；后续检查未稳定复现。串行开发后端、5 秒超时和浏览器负载只是可能因素，历史 7–10 秒归因已撤回。 | 增加请求分段耗时记录，再复现定位；不盲目延长生产超时。 | [knight-pierce-recovery.json](evidence/knight-pierce-recovery.json)、[benedictio-low-sp-recovered.json](evidence/benedictio-low-sp-recovered.json) |
| U011 | 部分条件技能失败原因过于笼统 | 召集等部分失败分支只能看到通用失败，玩家难以判断地图、队伍或目标条件。成功与正常拒绝已有实测，不等于功能不能使用。 | 只在服务端能可靠区分原因时增加准确反馈，避免客户端猜测；逐条确认再修改。 | [convenio.cpp](../../../repos/happyro-server/src/map/skills/acolyte/convenio.cpp)、[convenio-cross-map.json](evidence/convenio-cross-map.json) |

## 视觉与声音：仍保留的表现缺口

九个旧技能已补程序反馈，不再列为“完全没有特效”。以下不等于服务端没有伤害／状态；未取得参考资源的部分不能宣称官方复刻。

| 编号 | 项目 | 当前结论 | 下一步与结项条件 | 核对来源 |
| --- | --- | --- | --- | --- |
| U012 | 九项程序特效的原版完整表现 | 探测、狙杀瞄准、风之步及六个大主教技能现在有成功回包与绘制证据；原版完整主体、持续光环和音画细节未逐帧验收。 | 取得参考画面后按技能完善，不重做已通过的基础反馈。 | [support-effects-live.json](evidence/support-effects-live.json) |
| U013 | 炼金／生命体旧程序效果 | 疯狂野草、恶魔火焰及扩张、地狱植物、Silent Breeze、Magma Flow 等仍有旧效果引用缺定义或不完整；荆棘墙已补施放，持续墙体未补齐。 | 核对服务端真实生命周期与资源，再补对应渲染；不能用一次施放动画代替持续单位。 | [SkillEffect.js](../../../repos/happyro-client/src/DB/Skills/SkillEffect.js)、[EffectTable.js](../../../repos/happyro-client/src/DB/Effects/EffectTable.js)、[SkillUnit.js](../../../repos/happyro-client/src/DB/Skills/SkillUnit.js) |
| U014 | 毒雾／熔岩滑动／火山灰持续阶段 | 已有一次性地面动画，不足以证明整个持续阶段正确。 | 逐项核对创建、持续、重叠、提前结束及离图清理。 | [SkillEffect.js](../../../repos/happyro-client/src/DB/Skills/SkillEffect.js)、[GeneticEffects.js](../../../repos/happyro-client/src/DB/Skills/GeneticEffects.js) |
| U015 | 机匠旧效果与 ABR 独立召唤反馈 | 手推车终结仍指向无完整定义的旧效果，部分二转技能以音效为主，三种 ABR 缺独立施放 STR 配置；实际伤害和召唤不能据此判失败。 | 按使用频率补可验证的原生或程序反馈。 | [SkillEffect.js](../../../repos/happyro-client/src/DB/Skills/SkillEffect.js)、[EffectTable.js](../../../repos/happyro-client/src/DB/Effects/EffectTable.js) |
| U016 | 刺客毒烟／毒液印记与早期精灵效果 | 旧三转持续表现仍简化，部分早期精灵缺独立动画。 | 结合状态和地面单位生命周期逐项验收，区分程序反馈与原版效果。 | [SkillEffect.js](../../../repos/happyro-client/src/DB/Skills/SkillEffect.js)、[SkillUnit.js](../../../repos/happyro-client/src/DB/Skills/SkillUnit.js) |
| U017 | 人工听音及跨端实际画面 | 资源可读取、路由测试、图层 draws>0 都不是人工听音或全部三端画面通过。 | 按常用技能抽样听音并观察时机、位置、叠加；记录实际验收端和未验范围。 | [support-effects-live.json](evidence/support-effects-live.json) |

## 规则待确认：保留的上游未知／近似实现

下面列的是本次审查已经指出、当前实现仍保留的不确定规则，不是已证实伤害算错。确认对应 Renewal 版本和可靠依据后，才能决定更改；不能把源码中所有 TODO 都当成缺陷。

| 编号 | 项目 | 当前结论 | 下一步与结项条件 | 核对来源 |
| --- | --- | --- | --- | --- |
| U018 | 猎人：荒野疾行系数 | CON、亲近自然、钢铁之鸦的系数仍标未知。 | 核对同版本公式与实战，再决定改动。 | [wildwalk.cpp](../../../repos/happyro-server/src/map/skills/archer/wildwalk.cpp) |
| U019 | 巫师：石化扩散抗性 | 目标属性应如何降低成功率仍未确定。 | 验证目标抗性模型，先取得规则依据。 | [siennaexecrate.cpp](../../../repos/happyro-server/src/map/skills/mage/siennaexecrate.cpp) |
| U020 | 牧师：治疗来源、静寂与四转倍率 | Dilectio／Mediale 仍按受益者中心／状态驱动；治疗来源、Silentium 等级规则、部分 SPL 系数未完成官方一致性确认。 | 逐项确认，不把现有成功施放当作公式完全一致。 | [dilectioheal.cpp](../../../repos/happyro-server/src/map/skills/acolyte/dilectioheal.cpp)、[medialevotum.cpp](../../../repos/happyro-server/src/map/skills/acolyte/medialevotum.cpp)、[silentium.cpp](../../../repos/happyro-server/src/map/skills/acolyte/silentium.cpp)、[arbitrium.cpp](../../../repos/happyro-server/src/map/skills/acolyte/arbitrium.cpp) |
| U021 | 十字军：STR／VIT／POW 系数 | 大地毁灭、支配烙印以及部分四转技能的属性系数仍有待确认注释。 | 分别确认各技能，保留已经修复的护盾／继承／倍率累加行为。 | [earthdrive.cpp](../../../repos/happyro-server/src/map/skills/swordman/earthdrive.cpp)、[hesperuslit.cpp](../../../repos/happyro-server/src/map/skills/swordman/hesperuslit.cpp)、[imperialcross.cpp](../../../repos/happyro-server/src/map/skills/swordman/imperialcross.cpp)、[radiantspear.cpp](../../../repos/happyro-server/src/map/skills/swordman/radiantspear.cpp) |
| U022 | 刺客：灵魂破坏与四转属性系数 | 灵魂破坏 STR/INT 和部分四转 POW 等仍待核定；不影响已修复的毒药和伤痕生命周期结论。 | 按版本校对公式，不推测改平衡。 | [souldestroyer.cpp](../../../repos/happyro-server/src/map/skills/thief/souldestroyer.cpp)、[shadowstab.cpp](../../../repos/happyro-server/src/map/skills/thief/shadowstab.cpp) |
| U023 | 机匠：攻击装置、制造与 ABR 公式 | 攻击装置采用替代公式；制造装置成功率及 ABR 主人属性影响保留上游暂定／自定义规则。 | 分别核对配方成功率与召唤公式；不要把已修复大 ID 制作链重新列成未修。 | [attackmachine.cpp](../../../repos/happyro-server/src/map/skills/merchant/attackmachine.cpp)、[skill.cpp](../../../repos/happyro-server/src/map/skill.cpp)、[status.cpp](../../../repos/happyro-server/src/map/status.cpp) |
| U024 | 贤者：部分精灵技能规则 | 既有精灵技能概率等仍有上游未确认项；远距离不扣资源和召唤负属性已修复。 | 按具体技能与资源条件核对，不笼统宣称精灵系统失效。 | [elemental](../../../repos/happyro-server/src/map/skills/elemental)、[elemental.cpp](../../../repos/happyro-server/src/map/elemental.cpp) |
| U025 | 炼金：仿生植物与仿生制药 | 植物属性是近似公式；仿生制药难度未知，当前代码临时按 100% 成功处理。 | 明确产品是否接受暂定规则，或取得公式后实现并验证。 | [status.cpp](../../../repos/happyro-server/src/map/status.cpp)、[skill.cpp](../../../repos/happyro-server/src/map/skill.cpp) |
| U026 | 生命体：部分新技能属性倍率 | 多种生命体技能的 BaseLevel、STR、INT、DEX、VIT 增量仍标待确认。 | 分技能核定，气弹／冷却／SP 等值拒绝问题已经修复，不重复计算。 | [homunculus_erasercutter.cpp](../../../repos/happyro-server/src/map/skills/homunculus/homunculus_erasercutter.cpp)、[homunculus_heiligepferd.cpp](../../../repos/happyro-server/src/map/skills/homunculus/homunculus_heiligepferd.cpp)、[homunculus_toxinofmandara.cpp](../../../repos/happyro-server/src/map/skills/homunculus/homunculus_toxinofmandara.cpp) |
| U027 | 武僧：力量注入及伤害属性系数 | 力量注入当前给目标补至五气弹并清施法者，与“转移全部”在高气弹场景可能不一致；若干 STR/AGI/POW 系数未核定。 | 先确认高于五气弹时的产品规则，再做双方数量对照。 | [powervelocity.cpp](../../../repos/happyro-server/src/map/skills/acolyte/powervelocity.cpp)、[ragingthrust.cpp](../../../repos/happyro-server/src/map/skills/acolyte/ragingthrust.cpp)、[skynetblow.cpp](../../../repos/happyro-server/src/map/skills/acolyte/skynetblow.cpp)、[blazingflameblast.cpp](../../../repos/happyro-server/src/map/skills/acolyte/blazingflameblast.cpp) |
| U028 | 流氓：命中、AGI 与自动触发 | 背刺命中增益、致命威胁 AGI 和部分深渊自动触发系数仍未确认。 | 核对技能公式／概率，不改已验证的状态清理和远程标记。 | [backstab.cpp](../../../repos/happyro-server/src/map/skills/thief/backstab.cpp)、[fatalmenace.cpp](../../../repos/happyro-server/src/map/skills/thief/fatalmenace.cpp)、[status.cpp](../../../repos/happyro-server/src/map/status.cpp) |
| U029 | 诗人／舞娘：课程、异常与四转属性 | 课程加成、若干异常成功率、四转 SPL／抗性等仍有未知项；人偶控制保留现有 8 位属性片段，不扩展。 | 先确认规则及协议上限，不能将数值扩展当作普通 UI 修复。 | [saturdaynightfever.cpp](../../../repos/happyro-server/src/map/skills/archer/saturdaynightfever.cpp)、[rhythmicalwave.cpp](../../../repos/happyro-server/src/map/skills/archer/rhythmicalwave.cpp)、[greatecho.cpp](../../../repos/happyro-server/src/map/skills/archer/greatecho.cpp)、[status.cpp](../../../repos/happyro-server/src/map/status.cpp) |
| U030 | 骑士：音波、符文与部分新技能系数 | 音波命中、符文战意及光环剑等平衡细节尚未核定，龙之穿刺 POW 注释仍为未知。 | 有依据后逐项校对；龙息溢出、仆从标记和攻击数量快照已修复。 | [sonicwave.cpp](../../../repos/happyro-server/src/map/skills/swordman/sonicwave.cpp)、[fightingspirit.cpp](../../../repos/happyro-server/src/map/skills/swordman/fightingspirit.cpp)、[dragonicpierce.cpp](../../../repos/happyro-server/src/map/skills/swordman/dragonicpierce.cpp)、[battle.cpp](../../../repos/happyro-server/src/map/battle.cpp) |

## 验证待办与用户跳过

此节不是未修复 bug 清单；仅防止将“有处理记录”当作所有条件都通过。

| 编号 | 项目 | 当前结论 | 下一步与结项条件 | 核对来源 |
| --- | --- | --- | --- | --- |
| U031 | 其余三条线的整线实机 | 炼金／生命体、流氓、诗人／舞娘有代码审查与回归，但不在本次九条线 607 项实机收口范围。 | 按整线建立新清单、操作与资源闭环后验收。 | [skill-review.md](README.md) |
| U032 | 九条已处理线的条件分支 | 部分技能只测主要路径，玩家／魔物、种族、装备、死亡／离图、失败扣料等未全部覆盖。 | 按风险选择缺口，不无差别重跑 607 项。 | [audited-inventory.json](evidence/audited-inventory.json) |
| U033 | ABR HP 与主人属性 | 精通等级改变实际攻击已有证据，HP 观察为 -1，未核实真实 HP。 | 从可靠服务端／实体数据验证 HP，再对照主人属性；不拿伤害变化代替 HP 验证。 | [abr-mastery.json](evidence/revalidation/abr-mastery.json) |
| U034 | 高阶精灵、龙训练、精通附带效果 | 精灵已测特定种类 HP/SP、龙训练已测负重；不等于所有精灵、攻速、龙息和各类触发分支均测完。 | 只补明确缺少的分支，逐项保存对照证据。 | [elemental-mastery.json](evidence/revalidation/elemental-mastery.json)、[dragon-training.json](evidence/revalidation/dragon-training.json) |
| U035 | 矿石发现按用户要求停止 | 560 只波利未观察额外矿石，不能证明失效，也不能标记通过。 | 保持用户跳过，不自动继续耗时随机测试。 | [finding-ore-retry.json](evidence/revalidation/finding-ore-retry.json) |

## 已从待处理名单移除／不按缺陷处理

- 话匣子封包长度和隐藏单位留言、精灵召唤负属性、机甲上下车重算、材料转换、制作大 ID、武器精炼／修理、制作列表重复、队员信息同步：均已有后续修复及定向实机证据。
- 九个旧技能已新增程序特效，只保留完整原版表现与音画验收待办；不再描述成完全无反馈。
- 半径射程、冻结魔法容量、双手修炼、音速加速、致命攻击和移动恢复等已取得后续补测证据；只保留实际未验分支或说明差异。
- 武僧气弹通过数量同步；爆气在当前官方资源缺状态栏映射，不直接认定技能无效。新增图标是可选体验需求。
- 收购商店客户端元数据 2 级／服务端 1 级、致盲迷雾数据库 5 级／技能树 1 级，以及部分内部命名差异：已核对正常使用由服务端／技能树限制，不因元数据不同就列为必须修复。
- 缺武器材料、目标死亡／离场、连招超时、动作间隔、观察字段或采样时机错误，不当作当前产品缺陷；已经排除的丰饶提前结束也不重新列入。

## 下一批执行计划

按上方处理顺序推进；各项详细结项条件以 U 编号条目为准，不另建第二份问题清单。

- [ ] U001–U007：确认采用规则，统一七项说明／配置差异。
- [ ] U010：记录 Gateway、后端和地图服务分段耗时，复现后定位 504，区分开发环境与生产部署。
- [ ] U008–U009：确定 Gravity、涂鸦／城旗涂鸦的支持范围后再实现。
- [ ] U031：新实机批次依次安排第 8 条炼金／生命体、第 10 条流氓、第 11 条诗人／舞娘；从当前技能树重新确定范围，生命体与双分支单独列明，不与 607 项旧统计混算。
- [ ] U032–U034：按风险补九条线的未验分支、ABR HP／主人属性和精灵／骑乘附带效果，不无差别重跑全部技能。
- [ ] U012–U017：按可用资源安排视觉与声音验收，区分可加载、实际绘制、画面及听音结论。
- [ ] 每条职业线一至四转审查结束后再安排该线提交；提交／推送仍需用户明确要求。U035 继续保持用户跳过，不启动耗时随机采样。

未知公式 U018–U030 先取得对应版本依据，不因排期而猜测修改。

## 维护方式

每项结案需写明采用规则、改动和对应验证，再从本页移至已修复清单或标记明确不处理。保留编号，避免反复把已解决问题加入新批次。

本次源文件位置与核对摘要见[未解决事项来源索引](evidence/pending-source-index.json)。哈希用于识别本次查看版本，不要求后续修复仍与旧哈希相同；独立产品仓库需要相应检出。没有凭源码 TODO 宣称所有未知公式都错误，也没有声称已经重新验收所有实机分支。
