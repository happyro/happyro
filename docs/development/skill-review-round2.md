# 职业线技能第二轮审查

本轮重新审查当前代码，按职业线完成一至四转、继承技能及派生入口，再提交该线的修复与记录。第一轮依据见 [主要职业线技能审查](skill-review.md)。代码审查和定向回归不等同于逐技能实机战斗验收。

## 进度

| 顺序 | 职业线 | 本轮状态 |
| --- | --- | --- |
| 1 | 弓箭手／猎人／神射手／游侠／风鹰 | 68 个技能代码复查完成，回归与编译通过 |
| 2 | 魔法师／巫师／大法师／至高法师 | 78 个技能及派生入口复查完成，修复与验证通过 |
| 3 | 服事／牧师／大主教／枢机主教 | 77 个技能及派生入口复查完成，修复与验证通过 |
| 4 | 剑士／十字军／皇家卫士／帝国卫士 | 70 个技能及共享路径复查完成，修复与验证通过 |
| 5 | 盗贼／刺客／十字斩首者／暗影十字 | 57 个技能及共享路径复查完成，修复与验证通过 |
| 6 | 商人／铁匠／机甲神匠／机甲大师 | 89 个技能及派生路径复查完成，修复与验证通过 |
| 7 | 魔法师／贤者／妖术师／元素大师 | 93 个技能及随机／精灵派生入口复查完成，修复与验证通过 |
| 8 | 商人／炼金术师／基因学者／生物学者 | 71 个主技能、58 个生命体技能及派生路径复查完成，修复与验证通过 |
| 9 | 服事／武僧／修罗／审判官 | 78 个技能及连招／反击派生路径复查完成，修复与验证通过 |
| 10 | 盗贼／流氓／魅影追踪者／深渊追踪者 | 74 个主技能及复制／地面／自动触发路径复查完成，修复与验证通过 |
| 11 | 弓箭手／诗人、舞娘及对应三、四转 | 85 个主技能及合奏／重唱／派生路径复查完成，修复与验证通过 |
| 12 | 剑士／骑士、领主骑士／符文骑士／龙骑士 | 56 个主技能及 12 个符文石／派生入口再次复查完成，修复与验证通过 |

## 骑士线工作记录

用户确认第 12 条为骑士线后，再次核查一至四转、继承技能、符文石与派生入口，重点追踪状态关联、施法前后资源快照及范围攻击中的资源变化；以下改动作为整线审查结果一并提交。

- 仆从武器标记：`pc_dead` 只查询玩家目标，死亡时漏掉魔物标记；清空记录后，旧魔物标记到期可能清掉复活后新目标占用的记录。改为查询通用地图对象，死亡时一并结束玩家与魔物标记。`tests/knight-servant.test.mjs` 提取实际死亡清理和状态结束分支，覆盖玩家、魔物、已不存在的目标、重复清理和复活后重新标记；旧代码断言失败，修改后通过 UBSan 回归。
- 风刃：长矛分支追加远程标记时未清除原近程标记，可能同时触发两类伤害防御判断。改为切换到单一远程类别。`tests/knight-range.test.mjs` 提取实际距离分类和技能修正函数，覆盖 1–5 级、按距离分类配置、近远目标、单双手矛、双手剑、其它武器及非玩家施放；旧代码断言失败，修改后通过 UBSan 回归，双手剑段数保持不变。
- 已完成剑士、骑士、领主骑士、符文骑士及龙骑士的独立实现、通用状态和被动路径复核。覆盖武器及骑乘限制、吟唱与冷却、SP/AP／仆从消耗、暴击与攻击段数、精通及体型修正、反击／反射、位移、异常状态、增益叠加与解除、符文制造及道具施放。
- 数据库核对包含目标类型、武器／骑乘要求、范围、段数、持续时间、状态及资源消耗。客户端核对技能信息、目标选择、点选／地面施放、动作与成功／命中效果路由、仆从数量及千年神盾封包更新；死亡离图时清理仆从环绕效果。
- 服务端四项新增回归与最终 `map-server` 编译通过；没有重启在线服务。客户端未修改，不重建相同产物。音波命中、符文战意及光环剑仍有上游待确认的平衡系数，本轮不凭猜测调整。
- 仆从标记施加失败占用名额、施法者重新登录后旧标记误清新目标记录，也已分别复现并修复：只在状态施加成功后记录目标，结束时核对名额当前仍属于该目标。上述标记测试覆盖这两种情形及重复刷新。
- 龙息伤害改用 64 位中间值；符文「恢复」的 25% HP 回复与「狂怒」的 5% HP 扣除同样先提升精度。`tests/knight-resource.test.mjs` 提取当前实际公式，覆盖技能等级、基础等级、POW、龙之气息状态和 HP/SP 边界。旧龙息公式触发 UBSan 有符号溢出，修复后通过。
- 再次复查发现仆从「幻影／毁灭」混用施法前与当前仆从数量：零仆从幻影可能使用默认的五段，施法中补充仆从及毁灭命中后的补充又可能改变攻击段数。改为资源消耗阶段记录本次可用数量，整次范围攻击只使用该快照，保留零仆从幻影的位移。`tests/knight-ammunition.test.mjs` 提取实际开始检查、数量记录、消耗和两种攻击的段数分支，覆盖 0–5 个仆从、施法期间数量变化、消耗豁免及多个目标间补充；旧代码断言失败，修改后通过 UBSan 回归。
- 已排除「丰饶第一次回复后提前结束」的怀疑：续期后计时器编号改变，`status_change_end` 会拒绝旧计时器结束新状态；无需修改。
- 56 个技能树条目及 12 个符文石／派生技能的 ID、名称及等级上限与客户端一致；骑士／龙骑士的 32 个 STR 和 316 个依赖资源通过 Gateway 读取校验。客户端 5 个文件、24 项定向测试通过。资源读取不等同于实机画面、声音验收。

### 骑士线逐技能覆盖

范围来自当前技能树的 56 项与技能数据库额外的 10 个符文石技能、2 个派生攻击。下表的独立入口与上述共享路径共同构成本轮覆盖；不代表逐技能实机战斗、画面或听音验收。

| ID | 技能 | 服务端复查入口 |
| --- | --- | --- |
| 2 | `SM_SWORD` | battle 剑术精通 |
| 3 | `SM_TWOHAND` | battle 双手剑精通 |
| 4 | `SM_RECOVERY` | status 自然恢复／pc 药品恢复 |
| 5 | `SM_BASH` | bash.cpp |
| 6 | `SM_PROVOKE` | provoke.cpp |
| 7 | `SM_MAGNUM` | magnum.cpp |
| 8 | `SM_ENDURE` | StatusSkillImpl |
| 55 | `KN_SPEARMASTERY` | battle 枪术精通 |
| 56 | `KN_PIERCE` | pierce.cpp |
| 57 | `KN_BRANDISHSPEAR` | brandishspear.cpp |
| 58 | `KN_SPEARSTAB` | spearstab.cpp |
| 59 | `KN_SPEARBOOMERANG` | spearboomerang.cpp |
| 60 | `KN_TWOHANDQUICKEN` | StatusSkillImpl |
| 61 | `KN_AUTOCOUNTER` | counterattack.cpp |
| 62 | `KN_BOWLINGBASH` | bowlingbash.cpp |
| 63 | `KN_RIDING` | pc 骑乘及 status 负重 |
| 64 | `KN_CAVALIERMASTERY` | status 骑乘攻速 |
| 144 | `SM_MOVINGRECOVERY` | status 行走恢复 |
| 145 | `SM_FATALBLOW` | bash.cpp 晕眩附加 |
| 146 | `SM_AUTOBERSERK` | autoberserk.cpp |
| 355 | `LK_AURABLADE` | StatusSkillImpl |
| 356 | `LK_PARRYING` | StatusSkillImpl |
| 357 | `LK_CONCENTRATION` | StatusSkillImpl |
| 358 | `LK_TENSIONRELAX` | relax.cpp |
| 359 | `LK_BERSERK` | StatusSkillImpl |
| 397 | `LK_SPIRALPIERCE` | spiralpierce.cpp |
| 398 | `LK_HEADCRUSH` | traumaticblow.cpp |
| 399 | `LK_JOINTBEAT` | vitalstrike.cpp |
| 495 | `KN_ONEHAND` | StatusSkillImpl |
| 1001 | `KN_CHARGEATK` | chargeattack.cpp |
| 2001 | `RK_ENCHANTBLADE` | enchantblade.cpp |
| 2002 | `RK_SONICWAVE` | sonicwave.cpp |
| 2003 | `RK_DEATHBOUND` | StatusSkillImpl |
| 2004 | `RK_HUNDREDSPEAR` | hundredspear.cpp |
| 2005 | `RK_WINDCUTTER` | windcutter.cpp |
| 2006 | `RK_IGNITIONBREAK` | ignitionbreak.cpp |
| 2007 | `RK_DRAGONTRAINING` | status 龙骑攻速／负重及 battle 龙息 |
| 2008 | `RK_DRAGONBREATH` | dragonbreath.cpp |
| 2009 | `RK_DRAGONHOWLING` | dragonhowling.cpp |
| 2010 | `RK_RUNEMASTERY` | skill 符文制造及符文石道具入口 |
| 2011 | `RK_MILLENNIUMSHIELD` | milleniumshield.cpp |
| 2012 | `RK_CRUSHSTRIKE` | crushstrike.cpp |
| 2013 | `RK_REFRESH` | refresh.cpp |
| 2014 | `RK_GIANTGROWTH` | giantgrowth.cpp |
| 2015 | `RK_STONEHARDSKIN` | stonehardskin.cpp |
| 2016 | `RK_VITALITYACTIVATION` | vitalityactivation.cpp |
| 2017 | `RK_STORMBLAST` | stormblast.cpp |
| 2018 | `RK_FIGHTINGSPIRIT` | fightingspirit.cpp |
| 2019 | `RK_ABUNDANCE` | abundance.cpp |
| 2020 | `RK_PHANTOMTHRUST` | phantomthrust.cpp |
| 5004 | `RK_DRAGONBREATH_WATER` | dragonbreath.cpp |
| 5005 | `RK_LUXANIMA` | luxanima.cpp |
| 5014 | `ALL_FULL_THROTTLE` | StatusSkillImpl／status 属性与周期消耗 |
| 5201 | `DK_SERVANTWEAPON` | servantweapon.cpp |
| 5202 | `DK_SERVANTWEAPON_ATK` | servantweapon.cpp |
| 5203 | `DK_SERVANT_W_SIGN` | servantweaponsign.cpp |
| 5204 | `DK_SERVANT_W_PHANTOM` | servantweaponphantom.cpp |
| 5205 | `DK_SERVANT_W_DEMOL` | servantweapondemolition.cpp |
| 5206 | `DK_CHARGINGPIERCE` | StatusSkillImpl |
| 5207 | `DK_TWOHANDDEF` | status 体型减伤 |
| 5208 | `DK_HACKANDSLASHER` | hackandslasher.cpp |
| 5209 | `DK_HACKANDSLASHER_ATK` | hackandslasher.cpp |
| 5210 | `DK_DRAGONIC_AURA` | dragonicaura.cpp |
| 5211 | `DK_MADNESS_CRUSHER` | madnesscrusher.cpp |
| 5212 | `DK_VIGOR` | StatusSkillImpl |
| 5213 | `DK_STORMSLASH` | stormslash.cpp |
| 6001 | `DK_DRAGONIC_BREATH` | dragonicbreath.cpp |
| 6502 | `DK_DRAGONIC_PIERCE` | dragonicpierce.cpp |

## 猎人线工作记录

### 已核对的服务端路径

- 随行状态切换：战狼召唤、骑乘、冲刺及猎鹰召唤；施放前状态要求和攻击时路径检查。
- 主动攻击：箭矢、猎鹰、战狼、三转弓箭与四转弓箭的独立实现；恐惧微风连射与额外箭矢扣除；普通攻击自动触发随行攻击。
- 陷阱：独立施放类、地面单位触发、范围攻击、使用后变形、到期回收及拆除返还路径；四转陷阱的被动延时与 AP 获取。
- 增益与减益：专注、风之步、伪装、全力推进、电击陷阱的状态初始化与定时路径；风之符分别在普通攻击与技能攻击中的 AP 恢复入口。`status_heal` 的五参数调用中第四项是 AP，不能误判为无效回复。

已补齐 68 个技能的数据库、工厂、独立实现和共享路径复查，以及客户端目标选择、施放封包、动作、效果、地面单位与随行动作路由。被动技能继续核对属性、射程、精通伤害和技能前置条件，未将无主动特效视为缺陷。

### 当前验证

- 服务端 `map-server` 增量编译通过，未重启在线服务。
- 客户端随行动作、话匣子、技能目标、技能使用和四转映射共 5 个测试文件、25 项测试通过。这里只覆盖对应契约，不作为 68 个技能全部完成审查的证明。
- 重新从当前技能树和数据库提取 68 个技能，与客户端常量及生成信息逐项比较，ID、名称键、等级上限均一致。
- 31 个风鹰原生 STR 及 338 个依赖贴图通过 Gateway 读取与结构验证。客户端本轮没有修改，不重复构建相同产物。
- 本轮未做逐技能实机战斗或人工听音；荒野疾行未知系数的上游 TODO 保持不变，未凭猜测调整平衡数值。

### 已复现并修复：电击陷阱 SP 百分比溢出

`status.cpp` 的电击陷阱定时扣除先将最大 SP 与等级百分比做 32 位乘法，再除以 100。以 5 级技能和 200,000,000 最大 SP 为例，旧代码得到 7,050,327，正确结果是 50,000,000。该值高于当前默认最大 SP 配置，但在配置允许的最大值范围内，属于高数值边界问题。

改为先提升至 `int64` 再计算，保持原有比例、整数舍入和持续时间。没有改动 SP 不足时 `status_charge` 的既有行为。

新增服务端 `tests/hunter-status.test.mjs`，提取实际定时器分支编译执行，覆盖 1–5 级、零值、小值、当前默认上限、高 SP、32 位边界以及到期后不再扣除。旧实现断言失败，修复后通过；启用未定义行为检测。

运行方式（在服务端仓库）：

```sh
node tests/hunter-status.test.mjs ../../work/skill-review/hunter-status-test --no-color
```

### 本轮逐技能覆盖

下表记录本轮复查入口；共享施放、目标验证、资源要求及客户端路由同时覆盖对应主动技能。

| ID | 技能 | 服务端复查入口 |
| --- | --- | --- |
| 43 | Owl's Eye `AC_OWL` | status／battle 被动与前置条件 |
| 44 | Vulture's Eye `AC_VULTURE` | status／battle 被动与前置条件 |
| 45 | Improve Concentration `AC_CONCENTRATION` | SkillConcentration |
| 46 | Double Strafe `AC_DOUBLE` | SkillDoubleStrafe |
| 47 | Arrow Shower `AC_SHOWER` | SkillArrowShower |
| 115 | 滑动陷阱 `HT_SKIDTRAP` | SkillSkidTrap；地面单位 Skidtrap |
| 116 | 地雷 `HT_LANDMINE` | SkillLandMine；地面单位 Landmine |
| 117 | 定身陷阱 `HT_ANKLESNARE` | SkillAnkleSnare；地面单位 Anklesnare |
| 118 | 冲击波陷阱 `HT_SHOCKWAVE` | SkillShockwaveTrap；地面单位 Shockwave |
| 119 | 睡魔 `HT_SANDMAN` | SkillSandman；地面单位 Sandman |
| 120 | 闪光陷阱 `HT_FLASHER` | SkillFlasher；地面单位 Flasher |
| 121 | 冰冻陷阱 `HT_FREEZINGTRAP` | SkillFreezingTrap；地面单位 Freezingtrap |
| 122 | 爆破地雷 `HT_BLASTMINE` | SkillBlastMine；地面单位 Blastmine |
| 123 | 克雷莫陷阱 `HT_CLAYMORETRAP` | SkillClaymoreTrap；地面单位 Claymoretrap |
| 124 | 拆除陷阱 `HT_REMOVETRAP` | SkillRemoveTrap |
| 125 | 话匣子 `HT_TALKIEBOX` | SkillTalkieBox；地面单位 Talkiebox |
| 126 | 兽物驱除 `HT_BEASTBANE` | status／battle 被动与前置条件 |
| 127 | 猎鹰精通 `HT_FALCON` | status／battle 被动与前置条件 |
| 128 | 钢铁之鸦 `HT_STEELCROW` | status／battle 被动与前置条件 |
| 129 | 闪电冲击 `HT_BLITZBEAT` | SkillBlitzBeat |
| 130 | 探测 `HT_DETECTING` | SkillDetect |
| 131 | 弹簧陷阱 `HT_SPRINGTRAP` | SkillSpringTrap |
| 147 | 制作箭矢 `AC_MAKINGARROW` | SkillMakingArrow |
| 148 | 箭矢击退 `AC_CHARGEARROW` | SkillChargeArrow |
| 380 | 鹰眼 `SN_SIGHT` | StatusSkillImpl |
| 381 | 猎鹰突击 `SN_FALCONASSAULT` | SkillFalconAssault |
| 382 | 集中射击 `SN_SHARPSHOOTING` | SkillFocusedArrowStrike |
| 383 | 风之步 `SN_WINDWALK` | SkillWindWalker |
| 499 | Beast Strafing `HT_POWER` | SkillBeastStrafing |
| 1009 | 幻影之箭 `HT_PHANTASMIC` | SkillPhantasmicArrow |
| 2233 | Arrow Storm `RA_ARROWSTORM` | SkillArrowStorm |
| 2234 | Fear Breeze `RA_FEARBREEZE` | SkillFearBreeze |
| 2235 | Ranger Main `RA_RANGERMAIN` | status／battle 被动与前置条件 |
| 2236 | Aimed Bolt `RA_AIMEDBOLT` | SkillAimedBolt |
| 2237 | Detonator `RA_DETONATOR` | SkillDetonator |
| 2238 | Electric Shocker `RA_ELECTRICSHOCKER` | SkillElectricShocker；地面单位 Electricshocker；修复定时 SP 计算 |
| 2239 | Cluster Bomb `RA_CLUSTERBOMB` | SkillClusterBomb；地面单位 Clusterbomb |
| 2240 | Warg Mastery `RA_WUGMASTERY` | SkillWargMastery |
| 2241 | Warg Rider `RA_WUGRIDER` | SkillWargRider |
| 2242 | Warg Dash `RA_WUGDASH` | SkillWargDash |
| 2243 | Warg Strike `RA_WUGSTRIKE` | SkillWargStrike |
| 2244 | Warg Bite `RA_WUGBITE` | SkillWargBite |
| 2245 | Tooth of Warg `RA_TOOTHOFWUG` | status／battle 被动与前置条件 |
| 2246 | Sensitive Keen `RA_SENSITIVEKEEN` | SkillSensitiveKeen |
| 2247 | Camouflage `RA_CAMOUFLAGE` | SkillCamouflage |
| 2248 | Research Trap `RA_RESEARCHTRAP` | status／battle 被动与前置条件 |
| 2249 | Magenta Trap `RA_MAGENTATRAP` | SkillMagentaTrap；地面单位 Magentatrap |
| 2250 | 钴陷阱 `RA_COBALTTRAP` | SkillCobaltTrap；地面单位 Cobalttrap |
| 2251 | 玉米陷阱 `RA_MAIZETRAP` | SkillMaizeTrap；地面单位 Maizetrap |
| 2252 | 翠绿陷阱 `RA_VERDURETRAP` | SkillVerdureTrap；地面单位 Verduretrap |
| 2253 | 火焰陷阱 `RA_FIRINGTRAP` | SkillFiringTrap；地面单位 Firingtrap |
| 2254 | 冰封陷阱 `RA_ICEBOUNDTRAP` | SkillIceboundTrap；地面单位 Iceboundtrap |
| 5002 | 无限 `RA_UNLIMIT` | StatusSkillImpl |
| 5014 | 全力推进 `ALL_FULL_THROTTLE` | 通用状态 Full_Throttle |
| 5323 | 高级陷阱 `WH_ADVANCED_TRAP` | status／battle 被动与前置条件 |
| 5324 | 风之符 `WH_WIND_SIGN` | StatusSkillImpl |
| 5325 | 亲近自然 `WH_NATUREFRIENDLY` | status／battle 被动与前置条件 |
| 5326 | 猎鹰冲锋 `WH_HAWKRUSH` | SkillHawkRush |
| 5327 | 猎鹰精通 `WH_HAWK_M` | SkillHawkMastery |
| 5328 | 灾厄狂风 `WH_CALAMITYGALE` | StatusSkillImpl |
| 5329 | 猎鹰回旋镖 `WH_HAWKBOOMERANG` | SkillHawkBoomerang |
| 5330 | 狂风暴雨 `WH_GALESTORM` | SkillGaleStorm |
| 5331 | 深度失明陷阱 `WH_DEEPBLINDTRAP` | SkillDeepBlindTrap；地面单位 Deepblindtrap |
| 5332 | 坚固陷阱 `WH_SOLIDTRAP` | SkillSolidTrap；地面单位 Solidtrap |
| 5333 | 迅捷陷阱 `WH_SWIFTTRAP` | SkillSwiftTrap；地面单位 Swifttrap |
| 5334 | 成长箭矢 `WH_CRESCIVE_BOLT` | SkillCresciveBolt |
| 5335 | 火焰陷阱 `WH_FLAMETRAP` | SkillFlameTrap；地面单位 Flametrap |
| 6520 | Wild Walk `WH_WILD_WALK` | SkillWildWalk |

## 巫师线复查结果

从当前 Mage、Wizard、High_Wizard、Warlock、Warlock_T、Arch_Mage 技能树重新提取 78 个去重技能，逐项检查定义、工厂、主动实现或共享被动；另外覆盖读取魔法书、四种元素球攻击、四属性漩涡与四转派生攻击。客户端检查技能与地面单位映射、封包播放阶段、白色监狱身体状态和球体快照更新。

### 已复现并修复：四属性漩涡命中序号

- 原实现用元素球槽位相对位置作为命中序号。四球位于 1–4 槽时得到 1–4，而定时器将序号大于等于 3 视为末段，导致末段异常状态尝试两次。
- 只检查第 5 槽是否存在就删除第 1 槽；如果中间有球先到期，剩余四球可能因此只释放三次。
- 六级以上范围版的四种派生攻击固定传入序号 0，导致末段异常状态不触发。

修复为先统计球数，只有五球齐全才舍弃第 1 槽；实际攻击连续编号 0–3，并传入范围版派生定时器。保留元素顺序和 200 毫秒间隔。

`tests/tetra-sequence.test.mjs` 提取实际主技能与四种派生方法编译执行，覆盖四球的全部空槽位置、五球、1／5／6／10 级、单体／双目标范围和怪物施放；旧代码失败，修复后通过。既有火属性封包回归也通过。这些定向测试验证具体缺陷，整条线的代码复查覆盖见下表。

### 已复现并修复：魔法半径覆盖施法等级

共享固定咏唱计算把 `pc_checkskill(WL_RADIUS)` 赋给当前施法等级，且在技能范围检查之前就执行赋值。未学习半径的玩家也会将当前等级置零，后续状态修正读取错误等级。改为独立的 `radius_lv`，仅在巫师技能范围内读取；半径原来的减免公式保持不变。

`tests/wizard-cast.test.mjs` 提取生产固定咏唱分支，覆盖玩家／非玩家、未学／各级半径、范围内外技能和 1–10 级施法。旧代码失败，修复后通过，施法等级保持不变。

### 验证与限制

- 六组服务端回归通过：四属性漩涡命中顺序、火属性封包、魔法半径、吸取生命、能量外套、魔法书容量与失败保留；执行实际代码并启用未定义行为检测。
- 服务端 `map-server` 编译通过，未重启在线服务。
- 客户端 9 个测试文件、46 项测试通过，覆盖球体、身体状态、效果路由、四转地面效果和共用施放入口；测试环境有不支持 canvas 的提示，不将其视为实际 WebGL 渲染验收。
- 78 个技能的 ID、名称键和等级上限与客户端一致；55 个 STR 与 642 个贴图／音频等依赖通过 Gateway 读取检查。
- 本轮没有客户端代码修改，没有重复构建相同 PWA。没有逐技能实机战斗、人工听音或官方逐帧比对；石化扩散抵抗等未定上游平衡项保持原状。

### 本轮逐技能覆盖

| ID | 技能 | 服务端复查入口 |
| --- | --- | --- |
| 9 | 增加SP恢复 `MG_SRECOVERY` | 共享属性／被动／资源前置 |
| 10 | 火狩 `MG_SIGHT` | SkillSight |
| 11 | 圣灵召唤 `MG_NAPALMBEAT` | SkillNapalmBeat |
| 12 | 暗之障壁 `MG_SAFETYWALL` | SkillSafetyWall；地面单位 Safetywall |
| 13 | 灵魂打击 `MG_SOULSTRIKE` | SkillSoulStrike |
| 14 | 冰箭术 `MG_COLDBOLT` | SkillColdBolt |
| 15 | 冰冻术 `MG_FROSTDIVER` | SkillFrostDiver |
| 16 | 石化术 `MG_STONECURSE` | SkillStoneCurse |
| 17 | 火球术 `MG_FIREBALL` | SkillFireBall |
| 18 | 火墙术 `MG_FIREWALL` | SkillFireWall；地面单位 Firewall |
| 19 | 火箭术 `MG_FIREBOLT` | SkillFireBolt |
| 20 | 雷击术 `MG_LIGHTNINGBOLT` | SkillLightningBolt |
| 21 | 雷暴术 `MG_THUNDERSTORM` | SkillThunderStorm；地面单位 Dummyskill |
| 80 | 火柱术 `WZ_FIREPILLAR` | SkillFirePillar；地面单位 Firepillar_Waiting |
| 81 | 火狩 `WZ_SIGHTRASHER` | SkillSightRasher |
| 83 | 陨石术 `WZ_METEOR` | SkillMeteorStorm；地面单位 Dummyskill |
| 84 | 雷鸣术 `WZ_JUPITEL` | SkillJupitelThunder |
| 85 | 雷鸣风暴 `WZ_VERMILION` | SkillLordOfVermilion；地面单位 Dummyskill |
| 86 | 水球术 `WZ_WATERBALL` | SkillWaterBall；地面单位 Dummyskill |
| 87 | 冰墙术 `WZ_ICEWALL` | SkillIceWall；地面单位 Icewall |
| 88 | Frost Nova `WZ_FROSTNOVA` | SkillFrostNova |
| 89 | Storm Gust `WZ_STORMGUST` | SkillStormGust；地面单位 Dummyskill |
| 90 | Earth Spike `WZ_EARTHSPIKE` | SkillEarthSpike |
| 91 | Heaven's Drive `WZ_HEAVENDRIVE` | SkillHeavensDrive；地面单位 Dummyskill |
| 92 | Quagmire `WZ_QUAGMIRE` | SkillQuagmire；地面单位 Quagmire |
| 93 | Sense `WZ_ESTIMATION` | SkillSense |
| 157 | Energy Coat `MG_ENERGYCOAT` | SkillEnergyCoat |
| 364 | Soul Drain `HW_SOULDRAIN` | 共享属性／被动／资源前置 |
| 365 | Stave Crasher `HW_MAGICCRASHER` | WeaponSkillImpl |
| 366 | Mystical Amplification `HW_MAGICPOWER` | StatusSkillImpl |
| 400 | 凝固汽油火神炮 `HW_NAPALMVULCAN` | SkillNapalmVulcan |
| 483 | 岩碎术 `HW_GANBANTEIN` | SkillGanbantein |
| 484 | 重力场 `HW_GRAVITATION` | SkillGravitationField；地面单位 Gravitation |
| 1006 | 视线爆破 `WZ_SIGHTBLASTER` | SkillSightBlaster |
| 2201 | 白色监禁 `WL_WHITEIMPRISON` | SkillWhiteImprison |
| 2202 | 灵魂扩张 `WL_SOULEXPANSION` | SkillSoulExpansion |
| 2203 | 冰霜迷雾 `WL_FROSTMISTY` | SkillFrostyMisty |
| 2204 | 杰克霜冻 `WL_JACKFROST` | SkillJackFrost |
| 2205 | Marsh of Abyss `WL_MARSHOFABYSS` | StatusSkillImpl |
| 2206 | Recognized Spell `WL_RECOGNIZEDSPELL` | StatusSkillImpl |
| 2207 | Sienna Execrate `WL_SIENNAEXECRATE` | SkillSiennaExecrate |
| 2208 | Radius `WL_RADIUS` | 共享属性／被动／资源前置；修复覆盖施法等级 |
| 2209 | Stasis `WL_STASIS` | SkillStasis |
| 2210 | Drain Life `WL_DRAINLIFE` | SkillDrainLife |
| 2211 | Crimson Rock `WL_CRIMSONROCK` | SkillCrimsonRock |
| 2212 | Hell Inferno `WL_HELLINFERNO` | SkillHellInferno |
| 2213 | Comet `WL_COMET` | SkillComet；地面单位 Dummyskill |
| 2214 | Chain Lightning `WL_CHAINLIGHTNING` | SkillChainLightning |
| 2216 | Earth Strain `WL_EARTHSTRAIN` | SkillEarthStrain；地面单位 Earthstrain |
| 2217 | Tetra Vortex `WL_TETRAVORTEX` | SkillTetraVortex；修复命中序号与球数判定 |
| 2222 | 召唤火球 `WL_SUMMONFB` | SkillSummonFireBall |
| 2223 | 召唤雷球 `WL_SUMMONBL` | SkillSummonLightningBall |
| 2224 | 召唤水球 `WL_SUMMONWB` | SkillSummonWaterBall |
| 2229 | 召唤石块 `WL_SUMMONSTONE` | SkillSummonStone |
| 2230 | 释放 `WL_RELEASE` | SkillRelease |
| 2231 | 阅读魔法书 `WL_READING_SB` | 共享属性／被动／资源前置 |
| 2232 | 冻结魔法 `WL_FREEZE_SP` | 共享属性／被动／资源前置 |
| 5012 | 强力念力 `WL_TELEKINESIS_INTENSE` | StatusSkillImpl |
| 5014 | 全力推进 `ALL_FULL_THROTTLE` | StatusSkillImpl |
| 5214 | 致命投影 `AG_DEADLY_PROJECTION` | SkillDeadlyProjection |
| 5215 | 毁灭飓风 `AG_DESTRUCTIVE_HURRICANE` | SkillDestructiveHurricane |
| 5216 | 水晶之雨 `AG_RAIN_OF_CRYSTAL` | SkillRainOfCrystal；地面单位 Rain_Of_Crystal |
| 5217 | 神秘幻象 `AG_MYSTERY_ILLUSION` | SkillMysteryIllusion；地面单位 Mystery_Illusion |
| 5218 | 暴烈地震 `AG_VIOLENT_QUAKE` | SkillViolentQuake；地面单位 Violent_Quake |
| 5220 | 灵魂火神击 `AG_SOUL_VC_STRIKE` | SkillSoulVulcanStrike |
| 5221 | 地层震颤 `AG_STRANTUM_TREMOR` | SkillStrantumTremor；地面单位 Strantum_Tremor |
| 5222 | 全花绽放 `AG_ALL_BLOOM` | SkillAllBloom；地面单位 All_Bloom |
| 5225 | Crystal Impact `AG_CRYSTAL_IMPACT` | SkillCrystalImpact |
| 5227 | Tornado Storm `AG_TORNADO_STORM` | SkillTornadoStorm；地面单位 Tornado_Storm |
| 5228 | Two Hand Staff Mastery `AG_TWOHANDSTAFF` | 共享属性／被动／资源前置 |
| 5229 | Floral Flare Road `AG_FLORAL_FLARE_ROAD` | SkillFloralFlareRoad；地面单位 Floral_Flare_Road |
| 5230 | Astral Strike `AG_ASTRAL_STRIKE` | SkillAstralStrike；地面单位 Astral_Strike |
| 5232 | Climax `AG_CLIMAX` | StatusSkillImpl |
| 5233 | Rock Down `AG_ROCK_DOWN` | SkillRockDown |
| 5234 | Storm Cannon `AG_STORM_CANNON` | SkillStormCannon |
| 5235 | Crimson Arrow `AG_CRIMSON_ARROW` | SkillCrimsonArrow |
| 5237 | Frozen Slash `AG_FROZEN_SLASH` | SkillFrozenSlash |
| 6516 | Energy Conversion `AG_ENERGY_CONVERSION` | SkillEnergyConversion |

## 牧师线复查结果

重新核对 Acolyte、Priest、High_Priest、Arch_Bishop、Arch_Bishop_T、Cardinal 的 77 个去重技能，覆盖独立实现、通用状态、被动属性、治疗与复活、协助者条件、地面单位、双重圣光和 Arbitrium 派生入口。客户端同时复查技能选择、传送菜单、受益者特效、状态图标及四转地面效果路径。

### 已复现并修复：传送之阵丢失本次等级

选点菜单将 `menuskill_val` 用于保存地面坐标，但没有保存本次技能等级；确认选点时又使用已学习的最高等级创建传送门，并将坐标误作等级查询最大数量。已学四级、选用一级时，生成的门仍按四级处理。

将本次等级保存到现有 `menuskill_val2`，确认时用该等级检查可选目的地、数量、需求和创建技能单位，并重新确认当前仍有对应技能／道具等级。成功、取消及失败统一清除三个菜单字段。未修改封包长度或客户端协议。

`tests/warp-menu.test.mjs` 执行生产选点完成函数及菜单保存代码，覆盖 1–4 级、越级目的地、窗口打开后技能重置、死亡／禁施法／需求不足、取消、道具传送阵和瞬间移动。旧代码失败，修复后通过。

### 已复现并修复：霸邪护盾容量溢出

霸邪之阵和群体霸邪在计算最大 HP 百分比时先做 32 位乘法。例如最大 HP 为 200,000,000、10 级时，原基础容量只有 17,050,327，正确值应为 60,000,000。改用 `int64` 中间值，保留比例、人数增量和可抵挡次数。

`tests/priest-shield.test.mjs` 提取实际状态初始化分支执行，覆盖 1–10 级、无队伍及 1／2／12 人、普通 HP、首次回绕附近、20 亿和无符号 32 位上界。旧代码失败，修复后通过；启用未定义行为检测。

### 验证与限制

- 服务端四组回归通过：传送选点、两种霸邪护盾、治疗／反射／经验／复活、圣树多人周期。前一轮修复的实时协助者 SP、净化成功率、治疗百分比和复活失败计数继续通过。
- `map-server` 编译通过，未重启在线服务。
- 客户端 6 个测试文件、30 项测试通过，覆盖技能使用／目标、牧师效果路由与四转动作／效果／地面单位。
- 77 个技能的 ID、名称键和等级上限与客户端逐项一致；31 个 STR、250 个依赖经 Gateway 读取检查无缺失。
- 本轮没有客户端修改，不重复构建相同 PWA。未逐技能实机战斗或人工听音，不将代码复查等同于官方数值与动画完全一致。
- Dilectio 的范围中心和治疗来源仍沿用受益者；Mediale 仍由受益者的状态定时器驱动。已追踪到实际计算入口，但官方治疗来源／公式证据不足，不据此猜测修改。Silentium 等级和部分四转倍率的上游 TODO 也保持原状。
- 传送目的地 vector 前面的空字符串会被当前版本封包构造跳过，并非空菜单缺陷；Renewal 圣殿使用增益状态，不当作旧版地面领域。

### 本轮逐技能覆盖

| ID | 技能 | 服务端复查入口 |
| --- | --- | --- |
| 9 | 增加SP恢复 `MG_SRECOVERY` | status／battle／skill 共享被动与前置条件 |
| 12 | 暗之障壁 `MG_SAFETYWALL` | SkillSafetyWall；地面单位 Safetywall |
| 22 | 天使之护 `AL_DP` | status／battle／skill 共享被动与前置条件 |
| 23 | 恶魔克星 `AL_DEMONBANE` | status／battle／skill 共享被动与前置条件 |
| 24 | 光猎 `AL_RUWACH` | SkillRuwach |
| 25 | 光之障壁 `AL_PNEUMA` | SkillPneuma；地面单位 Pneuma |
| 26 | 瞬间移动 `AL_TELEPORT` | SkillTeleport |
| 27 | 传送之阵 `AL_WARP` | SkillWarpPortal；地面单位 Warp_Active；修复选点等级保存与校验 |
| 28 | 治愈术 `AL_HEAL` | SkillHeal |
| 29 | 敏捷提升 `AL_INCAGI` | SkillIncreaseAgi |
| 30 | 敏捷下降 `AL_DECAGI` | SkillDecreaseAgi |
| 31 | Aqua Benedicta `AL_HOLYWATER` | SkillHolyWater |
| 32 | Signum Crucis `AL_CRUCIS` | SkillCrucis |
| 33 | Angelus `AL_ANGELUS` | SkillAngelus |
| 34 | Blessing `AL_BLESSING` | SkillBlessing |
| 35 | Cure `AL_CURE` | SkillCure |
| 54 | 复活术 `ALL_RESURRECTION` | SkillResurrection |
| 65 | 钝器修炼 `PR_MACEMASTERY` | status／battle／skill 共享被动与前置条件 |
| 66 | 牺牲祈福 `PR_IMPOSITIO` | SkillImpositioManus |
| 67 | 牺牲祈福 `PR_SUFFRAGIUM` | SkillSuffragium |
| 68 | 圣水洗礼 `PR_ASPERSIO` | SkillAspersio |
| 69 | 圣体降福 `PR_BENEDICTIO` | SkillBenedictioSanctissimiSacramenti |
| 70 | 光耀之堂 `PR_SANCTUARY` | SkillSanctuary；地面单位 Sanctuary |
| 71 | 缓慢中毒 `PR_SLOWPOISON` | StatusSkillImpl |
| 72 | 状态恢复 `PR_STRECOVERY` | SkillStatusRecovery |
| 73 | 凯里艾勒松 `PR_KYRIE` | SkillKyrieEleison；修复共享护盾容量溢出 |
| 74 | 赞美诗 `PR_MAGNIFICAT` | SkillMagnificat |
| 75 | 荣耀 `PR_GLORIA` | SkillGloria |
| 76 | 神圣法典 `PR_LEXDIVINA` | SkillLexDivina |
| 77 | 退散不死 `PR_TURNUNDEAD` | SkillTurnUndead |
| 78 | 永恒法典 `PR_LEXAETERNA` | StatusSkillImpl |
| 79 | 大驱魔术 `PR_MAGNUS` | SkillMagnusExorcismus；地面单位 Magnus |
| 156 | Holy Light `AL_HOLYLIGHT` | SkillHolyLight |
| 361 | Assumptio `HP_ASSUMPTIO` | SkillAssumptio |
| 362 | Basilica `HP_BASILICA` | SkillBasilica |
| 363 | Meditatio `HP_MEDITATIO` | status／battle／skill 共享被动与前置条件 |
| 481 | 魔力充能 `HP_MANARECHARGE` | status／battle／skill 共享被动与前置条件 |
| 1014 | 牺牲祈福 `PR_REDEMPTIO` | SkillRedemptio |
| 2038 | 朱迪克斯 `AB_JUDEX` | SkillJudex |
| 2039 | 安琪拉 `AB_ANCILLA` | SkillAncilla |
| 2040 | 阿多拉穆斯 `AB_ADORAMUS` | SkillAdoramus |
| 2041 | 克莱门提亚 `AB_CLEMENTIA` | SkillCrementia |
| 2042 | 坎托·坎迪杜斯 `AB_CANTO` | SkillCantoCandidus |
| 2043 | 群体治愈 `AB_CHEAL` | SkillColuceoHeal |
| 2044 | 圣灵降临 `AB_EPICLESIS` | SkillEpiclesis；地面单位 Epiclesis |
| 2045 | 祷告 `AB_PRAEFATIO` | SkillPraefatio；修复共享护盾容量溢出 |
| 2046 | 祈祷 `AB_ORATIO` | SkillOratio |
| 2047 | 羔羊赞歌 `AB_LAUDAAGNUS` | SkillLaudaAgnus |
| 2048 | 枝条赞歌 `AB_LAUDARAMUS` | SkillLaudaRamus |
| 2050 | 新生 `AB_RENOVATIO` | SkillRenovatio |
| 2051 | 高级治愈 `AB_HIGHNESSHEAL` | SkillHighnessHeal |
| 2052 | 清除 `AB_CLEARANCE` | SkillClearance |
| 2053 | 赎罪 `AB_EXPIATIO` | StatusSkillImpl |
| 2054 | 双重光 `AB_DUPLELIGHT` | StatusSkillImpl；MELEE／MAGIC 派生与普攻触发 |
| 2057 | Silentium `AB_SILENTIUM` | SkillSilentium |
| 2515 | Secrament `AB_SECRAMENT` | StatusSkillImpl |
| 5011 | 奉献礼 `AB_OFFERTORIUM` | StatusSkillImpl |
| 5014 | 全力推进 `ALL_FULL_THROTTLE` | StatusSkillImpl |
| 5072 | 责骂 `AB_VITUPERATUM` | SkillVituperatum |
| 5073 | 契约 `AB_CONVENIO` | SkillConvenio |
| 5268 | 修复 `CD_REPARATIO` | SkillReparatio |
| 5269 | 中级祷言 `CD_MEDIALE_VOTUM` | SkillMedialeVotum |
| 5270 | 钝器书精通 `CD_MACE_BOOK_M` | status／battle／skill 共享被动与前置条件 |
| 5271 | 锐利生命 `CD_ARGUTUS_VITA` | StatusSkillImpl |
| 5272 | 锐利武器 `CD_ARGUTUS_TELUM` | StatusSkillImpl |
| 5273 | 裁决 `CD_ARBITRIUM` | SkillArbitrium；ATK 派生 |
| 5275 | 临在之锋 `CD_PRESENS_ACIES` | StatusSkillImpl |
| 5276 | 忠诚之魂 `CD_FIDUS_ANIMUS` | status／battle／skill 共享被动与前置条件 |
| 5277 | 释放 `CD_EFFLIGO` | SkillEffligo |
| 5278 | 能力 `CD_COMPETENTIA` | SkillCompetentia |
| 5279 | 气流风暴 `CD_PNEUMATICUS_PROCELLA` | SkillPneumaticusProcella；地面单位 Pneumaticus_Procella |
| 5280 | 恩爱治愈 `CD_DILECTIO_HEAL` | SkillDilectioHeal |
| 5281 | 信仰 `CD_RELIGIO` | StatusSkillImpl |
| 5282 | 祝福 `CD_BENEDICTUM` | StatusSkillImpl |
| 5283 | 请求 `CD_PETITIO` | SkillPetitio |
| 5284 | 框架 `CD_FRAMEN` | SkillFramen |
| 6518 | Divinus Flos `CD_DIVINUS_FLOS` | SkillDivinusFlos |

## 十字军线复查结果

从当前 Swordman、Crusader、Paladin、Royal_Guard、Royal_Guard_T、Imperial_Guard 技能树重新提取 70 个技能。复查全部独立实现、通用状态、被动、盾牌／武器／姿态／AP 条件、保护继承与伤害转移、反射、地面周期和状态清理；一转与继承的服事技能同时覆盖。旧 Overbrand 派生入口已经不在当前主技能调用链，未重新启用旧实现。

### 已复现并修复：先开防御再施放保护时失效

牺牲保护（`CR_DEVOTION`）继承已有防御状态时，原代码传入零值的 `val2`，同时设置 `SCSTART_NOAVOID`。自动防御和防御光环在该标志下跳过重新计算，因此被保护者的格挡概率／远程物理减伤变成零；防御光环的攻速修正也未继承。若先施放保护再开启防御技能，另一条分派路径会传入正确数值，导致操作顺序影响结果。

现在继承已计算的 `val2`，防御光环同时继承攻速修正 `val4`。保留反射盾的继承标记、钢铁之心的有限次数语义，以及城战／战场不继承钢铁之心的限制。

`tests/devotion-inheritance.test.mjs` 执行生产代码中的保护、自动防御、防御光环初始化分支，覆盖两种施放顺序、所有等级、正常地图／城战／战场、无已有防御状态、减伤／攻速数值和反射继承标记。旧代码失败，修复后通过。

### 已复现并修复：盾牌连击覆盖已有倍率

共享物理伤害流程先累计基础倍率和额外加成，然后调用各技能的倍率方法。盾牌连击却用 `=` 覆盖输入值，同时还减去了本应抵消输入基础值的 100。改为 `+=`，恢复基础倍率并保留先前累计的加成。原盾牌重量、精炼、盾牌力量、修炼及等级公式保持不变。

`tests/shield-chain.test.mjs` 提取实际倍率方法与等级缩放宏，覆盖技能 1–5 级、三种输入倍率、角色 99／100／250 级、有无盾牌额外加成、盾牌力量开启／关闭及非玩家。旧代码失败，修复后通过。

### 验证与限制

- 两组新增回归和既有 `crusader-barrier.test.mjs` 通过，均启用未定义行为检测；继续覆盖守护者屏障容量／超大伤害、盾牌法术恢复、灵感消耗、舍命攻击自损、终极牺牲和攻击姿态刷新。
- `map-server` 编译通过，未重启在线服务。
- 客户端 6 个测试文件、26 项测试通过，覆盖十字军特效分派、技能使用／目标、四转动作／效果／地面单位。
- 70 个技能的 ID、名称键和等级上限与客户端一致；39 个 STR 和 474 个依赖经 Gateway 读取检查无缺失。
- 客户端没有修改，不重复构建相同 PWA。未逐技能实机战斗，不宣称官方数值及动画完全一致；上游未确认的四转系数保持原状。
- 同时纠正首轮表格中的入口名称：自定义狂击示例在 `#if 0` 内禁用，实际使用 `SkillBash`，不存在启用每级增加 300% 倍率的自定义狂击。

### 本轮逐技能覆盖

| ID | 技能 | 服务端复查入口 |
| --- | --- | --- |
| 2 | 剑术修炼 `SM_SWORD` | status／battle／pc 共享被动与前置条件 |
| 3 | 双手剑修炼 `SM_TWOHAND` | status／battle／pc 共享被动与前置条件 |
| 4 | 增加HP恢复 `SM_RECOVERY` | status／battle／pc 共享被动与前置条件 |
| 5 | 狂击 `SM_BASH` | SkillBash |
| 6 | 挑衅 `SM_PROVOKE` | SkillProvoke |
| 7 | 怒爆 `SM_MAGNUM` | SkillMagnumBreak |
| 8 | 钢铁之心 `SM_ENDURE` | StatusSkillImpl |
| 22 | 天使之护 `AL_DP` | status／battle／pc 共享被动与前置条件 |
| 23 | 恶魔克星 `AL_DEMONBANE` | status／battle／pc 共享被动与前置条件 |
| 28 | 治愈术 `AL_HEAL` | SkillHeal |
| 35 | Cure `AL_CURE` | SkillCure |
| 55 | 矛术修炼 `KN_SPEARMASTERY` | status／battle／pc 共享被动与前置条件 |
| 63 | 骑乘大嘴鸟 `KN_RIDING` | status／battle／pc 共享被动与前置条件 |
| 64 | 骑兵修炼 `KN_CAVALIERMASTERY` | status／battle／pc 共享被动与前置条件 |
| 144 | 移动 HP 恢复 `SM_MOVINGRECOVERY` | status／battle／pc 共享被动与前置条件 |
| 145 | 致命一击 `SM_FATALBLOW` | status／battle／pc 共享被动与前置条件 |
| 146 | 自动狂暴 `SM_AUTOBERSERK` | SkillAutoBerserk |
| 248 | 信仰 `CR_TRUST` | status／battle／pc 共享被动与前置条件 |
| 249 | 防御 `CR_AUTOGUARD` | StatusSkillImpl；修复已有防御状态继承 |
| 250 | 惩击 `CR_SHIELDCHARGE` | SkillSmite |
| 251 | 盾牌回旋 `CR_SHIELDBOOMERANG` | SkillShieldBoomerang |
| 252 | 盾牌反射 `CR_REFLECTSHIELD` | SkillShieldReflect |
| 253 | 圣十字攻击 `CR_HOLYCROSS` | SkillHolyCross |
| 254 | 圣十字审判 `CR_GRANDCROSS` | SkillGrandCross；地面单位 Dummyskill |
| 255 | 舍命攻击 `CR_DEVOTION` | SkillSacrifice；修复已有防御状态继承 |
| 256 | 灵魂坚韧 `CR_PROVIDENCE` | SkillResistantSouls |
| 257 | 防御光环 `CR_DEFENDER` | StatusSkillImpl；修复已有防御状态继承 |
| 258 | 长枪加速术 `CR_SPEARQUICKEN` | StatusSkillImpl |
| 367 | Gloria Domini `PA_PRESSURE` | SkillGloriaDomini |
| 368 | Martyr's Reckoning `PA_SACRIFICE` | SkillMartyrsReckoning |
| 369 | Battle Chant `PA_GOSPEL` | SkillBattleChant；地面单位 Gospel |
| 480 | 盾牌连击 `PA_SHIELDCHAIN` | SkillShieldChain；修复覆盖共享伤害倍率 |
| 1002 | 缩小 `CR_SHRINK` | StatusSkillImpl |
| 2307 | 加农矛 `LG_CANNONSPEAR` | SkillCannonSpear |
| 2308 | 驱逐点 `LG_BANISHINGPOINT` | SkillBanishingPoint |
| 2309 | 踩踏 `LG_TRAMPLE` | SkillTrample |
| 2310 | 盾牌猛击 `LG_SHIELDPRESS` | SkillShieldPress |
| 2311 | 反射伤害减免 `LG_REFLECTDAMAGE` | StatusSkillImpl |
| 2312 | 精准攻击 `LG_PINPOINTATTACK` | SkillPinpointAttack |
| 2313 | 先锋之力 `LG_FORCEOFVANGUARD` | SkillForceOfVanguard |
| 2314 | 狂怒爆发 `LG_RAGEBURST` | SkillRageBurst |
| 2315 | 盾牌法术 `LG_SHIELDSPELL` | SkillShieldSpell |
| 2316 | 超越突破 `LG_EXEEDBREAK` | StatusSkillImpl |
| 2317 | 超级烙印 `LG_OVERBRAND` | SkillOverBrand |
| 2318 | 威望 `LG_PRESTIGE` | StatusSkillImpl |
| 2319 | 结盟 `LG_BANDING` | SkillBanding；地面单位 Banding |
| 2320 | 月斩 `LG_MOONSLASHER` | SkillMoonSlasher |
| 2321 | 创世之光 `LG_RAYOFGENESIS` | SkillRayOfGenesis |
| 2322 | 虔诚 `LG_PIETY` | SkillPiety |
| 2323 | 大地驱动 `LG_EARTHDRIVE` | SkillEarthDrive |
| 2324 | 赫斯珀洛斯之光 `LG_HESPERUSLIT` | SkillHesperusLit |
| 2325 | 灵感 `LG_INSPIRATION` | StatusSkillImpl |
| 5013 | 王者恩典 `LG_KINGS_GRACE` | SkillKingsGrace；地面单位 Kings_Grace |
| 5014 | 全力推进 `ALL_FULL_THROTTLE` | StatusSkillImpl |
| 5255 | 防御姿态 `IG_GUARD_STANCE` | StatusSkillImpl |
| 5256 | 守护者之盾 `IG_GUARDIAN_SHIELD` | SkillGuardianShield |
| 5257 | 反弹之盾 `IG_REBOUND_SHIELD` | StatusSkillImpl |
| 5258 | 盾牌修炼 `IG_SHIELD_MASTERY` | status／battle／pc 共享被动与前置条件 |
| 5259 | 矛剑修炼 `IG_SPEAR_SWORD_M` | status／battle／pc 共享被动与前置条件 |
| 5260 | 攻击姿态 `IG_ATTACK_STANCE` | StatusSkillImpl |
| 5261 | 终极牺牲 `IG_ULTIMATE_SACRIFICE` | SkillUltimateSacrifice |
| 5262 | 神圣盾牌 `IG_HOLY_SHIELD` | StatusSkillImpl |
| 5263 | 大审判 `IG_GRAND_JUDGEMENT` | SkillGrandJudgement |
| 5264 | 审判十字 `IG_JUDGEMENT_CROSS` | SkillJudgementCross |
| 5265 | 盾牌射击 `IG_SHIELD_SHOOTING` | SkillShieldShooting |
| 5266 | 过度斩击 `IG_OVERSLASH` | SkillOverSlash |
| 5267 | 十字雨 `IG_CROSS_RAIN` | SkillCrossRain；地面单位 Cross_Rain |
| 6503 | 光辉长矛 `IG_RADIANT_SPEAR` | SkillRadiantSpear |
| 6504 | 帝国十字 `IG_IMPERIAL_CROSS` | SkillImperialCross |
| 6505 | 帝国压力 `IG_IMPERIAL_PRESSURE` | SkillImperialPressure |

## 刺客线复查结果

从当前 Thief、Thief_High、Assassin、Assassin_Cross、Guillotine_Cross、Guillotine_Cross_T、Shadow_Cross 技能树重新提取 57 个去重技能。复查独立实现、双持／拳刃／回避被动、隐身与破隐、毒药制作和涂毒菜单、状态周期、地面毒烟、反击／连击条件、资源消耗及四转伤痕；客户端复查目标选择、施放、通知阶段和效果资源。

### 已复现并修复：暗影伤痕到期仍保留旧层数

暗影武器产生的伤痕每层都有独立计时器。旧代码删除到期计时器后，只有全部到期才解除状态；部分到期时没有更新状态层数与同步封包，伤害仍使用旧层数。状态提前解除后也没有取消剩余计时器，再次施加时会混入旧层数。

修复为每层到期同步剩余层数，状态结束时取消全部残留计时器并发送零层。新状态申请失败不再建立计时器；登出前清除该状态，避免把依赖内存计时器的无限状态保存后恢复成永久伤痕。保留现有每层增伤公式、概率和层数上限，不猜测调整上游未确认系数。

`tests/shadow-scar.test.mjs` 提取生产计时、添加、清理方法及状态结束分支编译执行，覆盖交错到期、最后一层到期、提前解除、再次施加、100 层上限、状态拒绝和对象不存在。旧代码在三层减少到两层时断言失败，修复后通过，启用未定义行为检测。

### 验证与限制

- 服务端 `map-server` 与文档站构建通过，状态数据库解析与登出清理标志检查通过；未重启在线服务。
- 新增伤痕生命周期回归及既有 `assassin-poison.test.mjs` 通过；继续覆盖毒药 HP／SP 边界、武器格挡攻击类型、八种涂毒选择与失效菜单、幻觉行走单次 HP 消耗。
- 客户端 6 个测试文件、26 项测试通过，覆盖刺客效果通知、技能使用／目标和四转动作／效果／地面单位。
- 57 个技能的 ID、名称键和等级上限与客户端逐项一致；18 个 STR 和 280 个依赖经 Gateway 读取检查无缺失。
- 客户端本轮没有修改，不重复构建相同 PWA。未逐技能实机战斗或人工听音；毒烟／毒液印记旧视觉仍简化，伤痕层数封包同步不等于已完成人工视觉验收。
- 新毒产量取模前由配方需求重新检查新毒研究等级，不会因菜单期间重置技能而直接除零；野蛮冲击的隐匿附加段数由共享范围入口先清零后设置，施法入口也保留其超越隐匿，不作为缺陷修改。

### 本轮逐技能覆盖

| ID | 技能 | 服务端复查入口 |
| --- | --- | --- |
| 48 | Double Attack `TF_DOUBLE` | SkillDoubleAttack |
| 49 | Improve Dodge `TF_MISS` | status／battle／skill 共享被动、状态与前置条件 |
| 50 | Steal `TF_STEAL` | SkillSteal |
| 51 | Hiding `TF_HIDING` | SkillHiding |
| 52 | Envenom `TF_POISON` | SkillEnvenom |
| 53 | Detoxify `TF_DETOXIFY` | SkillDetoxify |
| 132 | 右手修炼 `AS_RIGHT` | status／battle／skill 共享被动、状态与前置条件 |
| 133 | 左手修炼 `AS_LEFT` | status／battle／skill 共享被动、状态与前置条件 |
| 134 | 拳刃修炼 `AS_KATAR` | status／battle／skill 共享被动、状态与前置条件 |
| 135 | 隐匿 `AS_CLOAKING` | SkillCloaking |
| 136 | 音速投掷 `AS_SONICBLOW` | SkillSonicBlow |
| 137 | 爪痕 `AS_GRIMTOOTH` | SkillGrimtooth |
| 138 | 毒性附加 `AS_ENCHANTPOISON` | SkillEnchantPoison |
| 139 | 毒性反弹 `AS_POISONREACT` | StatusSkillImpl |
| 140 | 毒尘 `AS_VENOMDUST` | SkillVenomDust |
| 141 | 毒液散播 `AS_SPLASHER` | SkillVenomSplasher |
| 149 | 沙尘攻击 `TF_SPRINKLESAND` | SkillSandAttack |
| 150 | 后滑 `TF_BACKSLIDING` | SkillBackSlide |
| 151 | 寻找石头 `TF_PICKSTONE` | SkillFindStone |
| 152 | Stone Fling `TF_THROWSTONE` | SkillStoneFling |
| 376 | 高级拳刃修炼 `ASC_KATAR` | status／battle／skill 共享被动、状态与前置条件 |
| 378 | 致命毒药附加 `ASC_EDP` | SkillEnchantDeadlyPoison |
| 379 | 灵魂破坏 `ASC_BREAKER` | SkillSoulDestroyer |
| 406 | 陨石突袭 `ASC_METEORASSAULT` | SkillMeteorAssault |
| 407 | 制作致命毒药 `ASC_CDP` | SkillCreateDeadlyPoison |
| 1003 | 音速加速 `AS_SONICACCEL` | status／battle／skill 共享被动、状态与前置条件 |
| 1004 | 投掷毒刃 `AS_VENOMKNIFE` | SkillThrowVenomKnife |
| 2021 | 毒液印记 `GC_VENOMIMPRESS` | StatusSkillImpl |
| 2022 | 十字冲击 `GC_CROSSIMPACT` | SkillCrossImpact |
| 2023 | 黑暗幻影 `GC_DARKILLUSION` | SkillDarkIllusion |
| 2024 | 研究新毒药 `GC_RESEARCHNEWPOISON` | status／battle／skill 共享被动、状态与前置条件 |
| 2025 | 制作新毒药 `GC_CREATENEWPOISON` | SkillCreateNewPoison |
| 2026 | 解毒剂 `GC_ANTIDOTE` | SkillAntidote |
| 2027 | 武器涂毒 `GC_POISONINGWEAPON` | SkillPoisoningWeapon |
| 2028 | 武器格挡 `GC_WEAPONBLOCKING` | StatusSkillImpl |
| 2029 | 反击斩 `GC_COUNTERSLASH` | SkillCounterSlash |
| 2030 | 武器粉碎 `GC_WEAPONCRUSH` | SkillWeaponCrush |
| 2031 | 毒液压力 `GC_VENOMPRESSURE` | SkillVenomPressure |
| 2032 | 毒烟 `GC_POISONSMOKE` | SkillPoisonSmoke |
| 2033 | 超越隐匿 `GC_CLOAKINGEXCEED` | SkillCloakingExceed |
| 2034 | 幽灵威胁 `GC_PHANTOMMENACE` | SkillPhantomMenace |
| 2035 | 幻觉行走 `GC_HALLUCINATIONWALK` | SkillHallucinationWalk |
| 2036 | 滚动切割 `GC_ROLLINGCUTTER` | SkillRollingCutter |
| 2037 | 十字撕裂斩 `GC_CROSSRIPPERSLASHER` | SkillCrossRipperSlasher |
| 5001 | 暗黑之爪 `GC_DARKCROW` | SkillDarkClaw |
| 5014 | 全力推进 `ALL_FULL_THROTTLE` | status／battle／skill 共享被动、状态与前置条件 |
| 5285 | 暗影超越 `SHC_SHADOW_EXCEED` | StatusSkillImpl |
| 5286 | 舞动之刃 `SHC_DANCING_KNIFE` | SkillDancingKnife |
| 5287 | Savage Impact `SHC_SAVAGE_IMPACT` | SkillSavageImpact |
| 5288 | Shadow Sense `SHC_SHADOW_SENSE` | status／battle／skill 共享被动、状态与前置条件 |
| 5289 | Eternal Slash `SHC_ETERNAL_SLASH` | SkillEternalSlash |
| 5290 | Potent Venom `SHC_POTENT_VENOM` | StatusSkillImpl |
| 5291 | Shadow Stab `SHC_SHADOW_STAB` | SkillShadowStab |
| 5292 | Impact Crater `SHC_IMPACT_CRATER` | SkillImpactCrater |
| 5293 | Enchanting Shadow `SHC_ENCHANTING_SHADOW` | StatusSkillImpl；修复伤痕层数与计时器生命周期 |
| 5294 | Fatal Shadow Crow `SHC_FATAL_SHADOW_CROW` | SkillFatalShadowCrow |
| 6511 | Cross Slash `SHC_CROSS_SLASH` | SkillCrossSlash |

## 铁匠／机匠线复查结果

从当前商人、铁匠、超转、机匠及机甲大师技能树（含机甲／进阶／宝宝变体）提取 89 个去重技能，复查独立主动实现与岩浆喷发 DOT 派生路径；同时核对负重、交易折扣、武器制作／精炼／维修、手推车、机甲／工具／燃料／弹药要求、过热、被动属性、地面力场与 FAW／ABR 召唤、跟随及主人死亡清理。客户端复查技能使用、制作与维修／精炼选择、特效通知阶段及地面单位。

### 已复现并修复：魔法诱饵丢失召唤等级

确认属性石时，`skill_magicdecoy` 清空菜单等级后才生成召唤物，而属性计算仍读取主人的菜单等级。按当前公式，五级诱饵的基础魔攻应为 500，原代码却得到 250；HP 也缺少等级对应增量。原入口还会用菜单 ID 改写主人的当前施法技能。

现在由召唤物保存创建它的技能与等级，属性计算读取该上下文，不修改主人当前技能。银色狙击手及四类 ABR 同时保存各自上下文，主人改施其他技能后重算召唤物属性也不会走错分支。魔法诱饵 HP 使用宽整数计算并钳制到字段上限，避免高 SP 乘法回绕。材料扣除、召唤期限和既有公式系数保持不变。

### 已复现并修复：隐形力场高 SP 周期扣除回绕

隐形力场的最大 SP × 3 原先先做 32 位乘法，高于 1,431,655,765 时发生回绕。改为 `int64` 中间值，仍按最大 SP 的 3% 扣除；不足时结束、到期后不再扣除的规则不变。这是高数值配置边界问题，并非默认 SP 下的普遍异常。

### 验证与限制

- 扩展 `tests/mechanic-resources.test.mjs`，执行真实魔法诱饵方法、五种直接召唤方法及实际属性计算分支：四种属性、五级诱饵、1–5 级银色狙击手、1–4 级四类 ABR、菜单清空、主人施法变化后重算、零／普通／高 SP／UINT_MAX、材料不足和删除失败均通过；旧代码在诱饵属性断言失败。
- 同一回归执行隐形力场真实计时分支，覆盖溢出临界、SP 不足与到期；旧实现扣除断言失败。既有修复／自爆／ABR 高属性／手推车终结／岩浆单次 DOT 回归继续通过，启用未定义行为检测。
- 精炼成功率回归通过；共享属性入口涉及的既有炼金／生物召唤回归也通过。
- 服务端 `map-server` 编译通过。客户端 8 个测试文件、48 项测试通过，覆盖四转通知阶段、使用／目标、四转映射、摆摊和精炼菜单；canvas 提示不作为实际渲染验收。
- 89 个技能的 ID 与名称键一致；88 个等级上限一致，收购商店仍保留官方客户端元数据 MaxLv=2／服务端 1 的已知差异，可选施放等级由服务端技能字段约束。
- 38 个 STR 和 582 个依赖经 Gateway 读取检查无缺失。没有客户端代码改动，不重复构建 PWA；未重启在线服务，未做 89 个技能逐项实机战斗或人工听音。
- 攻击装置、ABR 和制造装置的上游未知／自定义公式仍保留；不把现有简化动画当作官方完整还原。维修支持道具触发，未错误增加必须学会技能的限制；手推车攻击的计算也按实际配置上限核对，未把不可达的假设容量当作本轮缺陷。

### 本轮逐技能覆盖

| ID | 技能 | 服务端复查入口 |
| --- | --- | --- |
| 36 | Enlarge Weight Limit `MC_INCCARRY` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 37 | Discount `MC_DISCOUNT` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 38 | Overcharge `MC_OVERCHARGE` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 39 | Pushcart `MC_PUSHCART` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 40 | Item Appraisal `MC_IDENTIFY` | SkillItemAppraisal |
| 41 | Vending `MC_VENDING` | SkillVending |
| 42 | Mammonite `MC_MAMMONITE` | SkillMammonite |
| 94 | Iron Tempering `BS_IRON` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 95 | Steel Tempering `BS_STEEL` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 96 | Enchanted Stone Craft `BS_ENCHANTEDSTONE` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 97 | Oridecon Research `BS_ORIDEOCON` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 98 | Smith Dagger `BS_DAGGER` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 99 | Smith Sword `BS_SWORD` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 100 | Smith Two-handed Sword `BS_TWOHANDSWORD` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 101 | Smith Axe `BS_AXE` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 102 | Smith Mace `BS_MACE` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 103 | Smith Knucklebrace `BS_KNUCKLE` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 104 | Smith Spear `BS_SPEAR` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 105 | Hilt Binding `BS_HILTBINDING` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 106 | Ore Discovery `BS_FINDINGORE` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 107 | Weaponry Research `BS_WEAPONRESEARCH` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 108 | Weapon Repair `BS_REPAIRWEAPON` | SkillWeaponRepair |
| 109 | Skin Tempering `BS_SKINTEMPER` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 110 | Hammer Fall `BS_HAMMERFALL` | SkillHammerFall |
| 111 | Adrenaline Rush `BS_ADRENALINE` | SkillAdrenalineRush |
| 112 | 武器修炼 `BS_WEAPONPERFECT` | SkillWeaponPerfection |
| 113 | 武器值最大化 `BS_OVERTHRUST` | SkillPowerThrust |
| 114 | 最大力量 `BS_MAXIMIZE` | StatusSkillImpl |
| 153 | Cart Revolution `MC_CARTREVOLUTION` | SkillCartRevolution |
| 154 | Change Cart `MC_CHANGECART` | SkillChangeCart |
| 155 | Crazy Uproar `MC_LOUD` | SkillCrazyUproar |
| 384 | 碎裂打击 `WS_MELTDOWN` | StatusSkillImpl |
| 387 | 手推车加速 `WS_CARTBOOST` | StatusSkillImpl |
| 459 | 高级速度激发 `BS_ADRENALINE2` | SkillAdvancedAdrenalineRush |
| 477 | 武器升级 `WS_WEAPONREFINE` | SkillUpgradeWeapon |
| 485 | 手推车终结 `WS_CARTTERMINATION` | SkillCartTermination |
| 486 | 最大力量挥击 `WS_OVERTHRUSTMAX` | StatusSkillImpl |
| 1012 | 不公平的诡计 `BS_UNFAIRLYTRICK` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 1013 | 贪婪 `BS_GREED` | SkillGreed |
| 2255 | 魔导机甲执照 `NC_MADOLICENCE` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 2256 | 强化拳 `NC_BOOSTKNUCKLE` | SkillBoostKnuckle |
| 2257 | 桩锚 `NC_PILEBUNKER` | SkillPileBunker |
| 2258 | 火神炮 `NC_VULCANARM` | SkillVulcanArm |
| 2259 | 火焰发射器 `NC_FLAMELAUNCHER` | SkillFlameLauncher |
| 2260 | 寒冷减速器 `NC_COLDSLOWER` | SkillColdSlower |
| 2261 | 手臂加农炮 `NC_ARMSCANNON` | SkillArmCannon |
| 2262 | 加速 `NC_ACCELERATION` | StatusSkillImpl |
| 2263 | 悬浮 `NC_HOVERING` | StatusSkillImpl |
| 2264 | 前侧滑行 `NC_F_SIDESLIDE` | SkillFrontSideSlide |
| 2265 | 后侧滑行 `NC_B_SIDESLIDE` | SkillBackSideSlide |
| 2266 | 主机重构 `NC_MAINFRAME` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 2267 | 自毁 `NC_SELFDESTRUCTION` | SkillSelfDestruction |
| 2268 | 形态转换 `NC_SHAPESHIFT` | StatusSkillImpl |
| 2269 | 紧急冷却 `NC_EMERGENCYCOOL` | SkillEmergencyCool |
| 2270 | 红外扫描 `NC_INFRAREDSCAN` | SkillInfraredScan |
| 2271 | 分析 `NC_ANALYZE` | SkillAnalyze |
| 2272 | 磁场 `NC_MAGNETICFIELD` | SkillMagneticField |
| 2273 | 中性屏障 `NC_NEUTRALBARRIER` | SkillNeutralBarrier |
| 2274 | 隐形力场 `NC_STEALTHFIELD` | SkillStealthField；修复高 SP 周期计算 |
| 2275 | 修理 `NC_REPAIR` | SkillRepair |
| 2276 | 斧训练 `NC_TRAININGAXE` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 2277 | 火/土研究 `NC_RESEARCHFE` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 2278 | 斧回旋镖 `NC_AXEBOOMERANG` | SkillAxeBoomerang |
| 2279 | 强力挥击 `NC_POWERSWING` | SkillPowerSwing |
| 2280 | 斧旋风 `NC_AXETORNADO` | SkillAxeTornado |
| 2281 | FAW - 银色狙击手 `NC_SILVERSNIPER` | SkillFawSilverSniper；修复召唤上下文保存与属性重算 |
| 2282 | FAW - 魔法诱饵 `NC_MAGICDECOY` | SkillFawMagicDecoy；修复召唤上下文保存与属性重算 |
| 2283 | FAW 消除 `NC_DISJOINT` | SkillFawRemoval |
| 2535 | Open Buying Store `ALL_BUYING_STORE` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 2544 | Decorate Cart `MC_CARTDECORATE` | SkillDecorateCart |
| 5006 | 岩浆喷发 `NC_MAGMA_ERUPTION` | SkillMagmaEruption；DOT 派生、地面周期与销毁 |
| 5014 | 全力推进 `ALL_FULL_THROTTLE` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 5295 | Axe Stomp `MT_AXE_STOMP` | SkillAxeStomp |
| 5296 | Rush Quake `MT_RUSH_QUAKE` | SkillRushQuake |
| 5297 | Manufacture Machine `MT_M_MACHINE` | SkillManufactureMachine |
| 5298 | Attack Machine `MT_A_MACHINE` | SkillAttackMachine |
| 5299 | Defense Machine `MT_D_MACHINE` | StatusSkillImpl |
| 5300 | Two Hand Axe Def `MT_TWOAXEDEF` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 5301 | ABR Mastery `MT_ABR_M` | status／battle／skill／pc 共享被动、菜单及前置条件 |
| 5302 | ABR Battle Warior `MT_SUMMON_ABR_BATTLE_WARIOR` | SkillAbrBattleWarrior；修复召唤上下文保存与属性重算 |
| 5303 | ABR 双炮 `MT_SUMMON_ABR_DUAL_CANNON` | SkillAbrDualCannon；修复召唤上下文保存与属性重算 |
| 5304 | ABR 母网 `MT_SUMMON_ABR_MOTHER_NET` | SkillAbrMotherNet；修复召唤上下文保存与属性重算 |
| 5305 | ABR 无限 `MT_SUMMON_ABR_INFINITY` | SkillAbrInfinity；修复召唤上下文保存与属性重算 |
| 6002 | 火花爆破 `MT_SPARK_BLASTER` | SkillSparkBlaster |
| 6003 | 三重激光 `MT_TRIPLE_LASER` | SkillTripleLaser |
| 6004 | 强力粉碎 `MT_MIGHTY_SMASH` | SkillMightySmash |
| 6506 | 冲锋打击 `MT_RUSH_STRIKE` | SkillRushStrike |
| 6507 | Powerful Swing `MT_POWERFUL_SWING` | SkillPowerfulSwing |
| 6508 | Energy Cannonade `MT_ENERGY_CANNONADE` | SkillEnergyCannonade |


## 贤者线工作记录

完成 Mage、Mage_High、Sage、Professor、Sorcerer、Sorcerer_T、Elemental_Master 的 93 个去重技能，以及随机技能、五属性元素爆破与精灵自身技能的复查。

### 已复查的路径

- 当前技能树重新提取 93 个技能；复读二至四转独立实现、五属性元素爆破、随机技能派生实现，以及元素精灵目录全部独立实现。继承法师技能结合本轮巫师线记录复核自动念咒、魔法拳、高级精灵增益及能量外套反射联动。
- 精灵创建、持久化与接收、模式切换、攻击／跟随 AI、资源维持、到期与移除；精灵攻击的近距离和追踪施放存在资源结算差异，已复现并修复。
- 自动念咒解锁与提交、普攻触发、双重咏唱延时、魔法拳施放条件与普攻替换、法术解除读取原技能消耗的时序。
- 属性领域重放与剩余时长、元素领域叠加和抵消、离开范围后的清理，三／四转持续伤害地面单位、极限空虚延迟拉取、属性徽章和结晶状态的初始化与定时处理。

### 已复现并修复

- 结晶状态的每秒 2% 最大 HP 扣除先进行 32 位无符号乘法，最大 HP 达 2,147,483,648 时错误变成零。改为先转为 `int64` 再乘除，保留资源不足和到期行为。
- 精神耗弱将当前 SP 乘二时发生同类回绕；改为 64 位乘法后交给原有伤害结算。两项均覆盖正常值、零、小值和 32 位边界，并分别验证旧代码失败、修复后通过。
- 继承技能能量外套的普通伤害分支已修复，但魔法反射分支仍使用旧的 32 位 SP 百分比和消耗算法。同步采用宽整数；扩充既有回归，同时执行普通伤害和反射分支，覆盖 SP 分档边界和消耗失败。旧反射分支失败，修复后通过。
- 扩充 `sorcerer-resources.test.mjs` 和 `energy-coat.test.mjs`，直接提取当前生产分支编译执行，启用 UBSan；30 个精灵辅助技能的既有状态开关回归亦通过。

### 当前验证

- `map-server` 编译通过，未重启在线服务。
- 客户端 7 个文件、36 项测试通过：妖术师效果路由、四转封包阶段、效果／地面单位／动作映射、技能目标与施放入口。
- 60 个 STR 和 889 个依赖纹理／音效通过 Gateway 读取及结构检查。
- 当前 93 个技能的客户端 ID／名称键一致；致盲迷雾仍为服务端数据库上限 5、客户端 1，已确认 Professor 职业技能树仅允许学习 1 级，有效上限一致，不修改生成源。

### 精灵追踪施法修复

旧代码在射程外先移动，再按估算步程直接调用 `skill_castend_id/pos`，跳过资源检查和扣除，也绕过正常施法起手。提取旧函数验证：近距离攻击消耗 20 SP，远距离完成攻击后仍保留原来的 100 SP。

改为记录待执行目标和本次命令是否强制施放，由已有精灵 AI 在进入射程后重新经过同一 `elemental_action` 路径。等待期间不预扣资源；执行时重新检查目标、地图、资源、状态和施法限制。目标失效、模式切换、返回主人或移除地图时清理待执行命令。移除假冒施法计时器和未使用的旧 `skill_timer` 字段。

强制施放状态从主人共享的 `skill_id_old` 移到精灵本次命令上下文，保留既有九种精灵技能的即时施放规则，不再把主人指针写入 `unit_skilluse_id2` 的玩家施法变量，避免精灵施法混入玩家后续处理。命令完成后清除标记，不改变其他精灵技能的咏唱规则。

新增 `tests/elemental-action.test.mjs`，执行实际行动、恢复追踪、取消函数和即时施放判断，覆盖近／远距离、目标／地面技能、普通／强制命令、行走中 SP 耗尽、目标消失／死亡／跨地图／非敌对、禁止施法、走路失败、施法占用、动作延迟及取消后不再施放。旧路径资源断言失败，修复回归与 `map-server` 编译通过。

### 覆盖边界

- 书籍熟练、龙知识、自由施法、精灵共鸣和魔法书精通核对对应属性／攻击／施法／召唤路径；被动技能不要求主动特效。
- 全部 93 项数据库目标类型、消耗、状态及技能树上限与独立实现和共享施放路径核对；客户端自动念咒选单按服务端列表返回技能 ID，移动端和桌面端共用选择回调。
- 延续已知限制：随机技能 Gravity 没有实质效果，部分早期精灵技能缺独立原生动画，风刃出血概率存在上游未确认注释；未按推测修改官方平衡数值。
- 本轮是完整职业线代码审查和定向回归，未进行逐技能实机战斗／人工听音验收。客户端没有修改，不重建相同 PWA；未重启在线地图服务。

### 本轮逐技能覆盖

| ID | 技能 | 服务端复查入口 |
| --- | --- | --- |
| 9 | 增加SP恢复 `MG_SRECOVERY` | status／battle／skill／pc 共享被动与前置条件 |
| 10 | 火狩 `MG_SIGHT` | SkillSight |
| 11 | 圣灵召唤 `MG_NAPALMBEAT` | SkillNapalmBeat |
| 12 | 暗之障壁 `MG_SAFETYWALL` | SkillSafetyWall |
| 13 | 灵魂打击 `MG_SOULSTRIKE` | SkillSoulStrike |
| 14 | 冰箭术 `MG_COLDBOLT` | SkillColdBolt |
| 15 | 冰冻术 `MG_FROSTDIVER` | SkillFrostDiver |
| 16 | 石化术 `MG_STONECURSE` | SkillStoneCurse |
| 17 | 火球术 `MG_FIREBALL` | SkillFireBall |
| 18 | 火墙术 `MG_FIREWALL` | SkillFireWall |
| 19 | 火箭术 `MG_FIREBOLT` | SkillFireBolt |
| 20 | 雷击术 `MG_LIGHTNINGBOLT` | SkillLightningBolt |
| 21 | 雷暴术 `MG_THUNDERSTORM` | SkillThunderStorm |
| 90 | Earth Spike `WZ_EARTHSPIKE` | SkillEarthSpike |
| 91 | Heaven's Drive `WZ_HEAVENDRIVE` | SkillHeavensDrive |
| 93 | Sense `WZ_ESTIMATION` | SkillSense |
| 157 | Energy Coat `MG_ENERGYCOAT` | SkillEnergyCoat |
| 274 | Study `SA_ADVANCEDBOOK` | status／battle／skill／pc 共享被动与前置条件 |
| 275 | Cast Cancel `SA_CASTCANCEL` | SkillCastCancel |
| 276 | Magic Rod `SA_MAGICROD` | SkillMagicRod |
| 277 | Spell Breaker `SA_SPELLBREAKER` | SkillSpellBreaker |
| 278 | Free Cast `SA_FREECAST` | status／battle／skill／pc 共享被动与前置条件 |
| 279 | Hindsight `SA_AUTOSPELL` | SkillHindsight |
| 280 | Endow Blaze `SA_FLAMELAUNCHER` | SkillEndowBlaze |
| 281 | Endow Tsunami `SA_FROSTWEAPON` | SkillEndowTsunami |
| 282 | Endow Tornado `SA_LIGHTNINGLOADER` | SkillEndowTornado |
| 283 | Endow Quake `SA_SEISMICWEAPON` | SkillEndowQuake |
| 284 | Dragonology `SA_DRAGONOLOGY` | status／battle／skill／pc 共享被动与前置条件 |
| 285 | Volcano `SA_VOLCANO` | SkillVolcano |
| 286 | Deluge `SA_DELUGE` | SkillDeluge |
| 287 | 旋风 `SA_VIOLENTGALE` | SkillWhirlwind |
| 288 | 磁场大地 `SA_LANDPROTECTOR` | SkillMagneticEarth |
| 289 | 解除魔法 `SA_DISPELL` | SkillDispell |
| 290 | 戏法 `SA_ABRACADABRA` | SkillHocusPocus |
| 373 | 享乐 `PF_HPCONVERSION` | SkillIndulge |
| 374 | 灵魂吐息 `PF_SOULCHANGE` | SkillSoulExhale |
| 375 | 灵魂虹吸 `PF_SOULBURN` | SkillSoulSiphon |
| 402 | 心灵破坏者 `PF_MINDBREAKER` | SkillMindBreaker |
| 403 | 预知 `PF_MEMORIZE` | StatusSkillImpl |
| 404 | 致盲迷雾 `PF_FOGWALL` | SkillBlindingMist |
| 405 | 藤蔓束缚 `PF_SPIDERWEB` | SkillFiberLock |
| 482 | 双重施法 `PF_DOUBLECASTING` | StatusSkillImpl |
| 1007 | 制作属性转换器 `SA_CREATECON` | SkillCreateElementalConverter |
| 1008 | 属性转换·水 `SA_ELEMENTWATER` | SkillElementalChangeWater |
| 1017 | 土属性转换 `SA_ELEMENTGROUND` | SkillElementalChangeEarth |
| 1018 | 火属性转换 `SA_ELEMENTFIRE` | SkillElementalChangeFire |
| 1019 | 风属性转换 `SA_ELEMENTWIND` | SkillElementalChangeWind |
| 2443 | 火焰步 `SO_FIREWALK` | SkillFireWalk |
| 2444 | 电流步 `SO_ELECTRICWALK` | SkillElectricWalk |
| 2445 | 法术拳 `SO_SPELLFIST` | SkillSpellFist |
| 2446 | 大地坟墓 `SO_EARTHGRAVE` | SkillEarthGrave |
| 2447 | 钻石星尘 `SO_DIAMONDDUST` | SkillDiamondDust |
| 2448 | 毒爆 `SO_POISON_BUSTER` | SkillPoisonBuster |
| 2449 | 念力波 `SO_PSYCHIC_WAVE` | SkillPsychicWave |
| 2450 | Cloud Kill `SO_CLOUD_KILL` | SkillCloudKill |
| 2451 | Striking `SO_STRIKING` | SkillStriking |
| 2452 | Warmer `SO_WARMER` | SkillWarmer |
| 2453 | Vacuum Extreme `SO_VACUUM_EXTREME` | SkillVacuumExtreme |
| 2454 | Varetyr Spear `SO_VARETYR_SPEAR` | SkillVaretyrSpear |
| 2455 | Arrullo `SO_ARRULLO` | SkillArrullo |
| 2456 | Spirit Control `SO_EL_CONTROL` | SkillSpiritControl |
| 2457 | 召唤火精灵阿格尼 `SO_SUMMON_AGNI` | SkillSummonFireSpiritAgni |
| 2458 | 召唤水精灵阿夸 `SO_SUMMON_AQUA` | SkillSummonWaterSpiritAqua |
| 2459 | 召唤风精灵文图斯 `SO_SUMMON_VENTUS` | SkillSummonWindSpiritVentus |
| 2460 | 召唤地精灵特拉 `SO_SUMMON_TERA` | SkillSummonEarthSpiritTera |
| 2461 | 元素行动 `SO_EL_ACTION` | SkillElementalAction |
| 2462 | 四精灵分析 `SO_EL_ANALYSIS` | SkillFourSpiritAnalysis |
| 2463 | 精灵共鸣 `SO_EL_SYMPATHY` | status／battle／skill／pc 共享被动与前置条件 |
| 2464 | 精灵恢复 `SO_EL_CURE` | SkillSpiritRecovery |
| 2465 | 火之徽记 `SO_FIRE_INSIGNIA` | SkillFireInsignia |
| 2466 | 水之徽记 `SO_WATER_INSIGNIA` | SkillWaterInsignia |
| 2467 | 风之徽记 `SO_WIND_INSIGNIA` | SkillWindInsignia |
| 2468 | 地之徽记 `SO_EARTH_INSIGNIA` | SkillEarthInsignia |
| 5008 | 元素护盾 `SO_ELEMENTAL_SHIELD` | SkillElementalShield |
| 5014 | 全力推进 `ALL_FULL_THROTTLE` | StatusSkillImpl |
| 5365 | 魔法书修炼 `EM_MAGIC_BOOK_M` | status／battle／skill／pc 共享被动与前置条件 |
| 5366 | 法术附魔 `EM_SPELL_ENCHANTING` | StatusSkillImpl |
| 5367 | 活动燃烧 `EM_ACTIVITY_BURN` | SkillActivityBurn |
| 5368 | 活动提升 `EM_INCREASING_ACTIVITY` | SkillIncreasingActivity |
| 5369 | 钻石风暴 `EM_DIAMOND_STORM` | SkillDiamondStorm |
| 5370 | 雷电之地 `EM_LIGHTNING_LAND` | SkillLightningLand |
| 5371 | 毒液沼泽 `EM_VENOM_SWAMP` | SkillVenomSwamp |
| 5372 | 大火灾 `EM_CONFLAGRATION` | SkillConflagration |
| 5373 | 大地驱动 `EM_TERRA_DRIVE` | SkillTerraDrive |
| 5374 | 元素精灵精通 `EM_ELEMENTAL_SPIRIT_M` | status／battle／skill／pc 共享被动与前置条件 |
| 5375 | 召唤阿多尔 `EM_SUMMON_ELEMENTAL_ARDOR` | SkillSummonElementalArdor |
| 5376 | 召唤迪鲁维奥 `EM_SUMMON_ELEMENTAL_DILUVIO` | SkillSummonElementalDiluvio |
| 5377 | 召唤普罗塞拉 `EM_SUMMON_ELEMENTAL_PROCELLA` | SkillSummonElementalProcella |
| 5378 | 召唤泰雷莫图斯 `EM_SUMMON_ELEMENTAL_TERREMOTUS` | SkillSummonElementalTerremotus |
| 5379 | 召唤塞彭斯 `EM_SUMMON_ELEMENTAL_SERPENS` | SkillSummonElementalSerpens |
| 5380 | 元素破坏 `EM_ELEMENTAL_BUSTER` | SkillElementalBuster |
| 5381 | 元素帷幕 `EM_ELEMENTAL_VEIL` | SkillElementalVeil |
| 6517 | Psychic Stream `EM_PSYCHIC_STREAM` | SkillPsychicStream |


## 炼金／基因线工作记录

### 范围和已核对路径

重新提取 Merchant、Merchant_High、Alchemist、Creator、Genetic、Genetic_T、Biolo 当前技能树的 71 个去重主技能，并复查全部 58 个生命体技能。商人继承部分与本轮第 6 线共用；独立技能核对工厂、目标类型、施放／伤害／状态方法，派生技能继续追踪四属性酸化、疯狂野草、地狱植物、恶魔火焰与扩张。

- 攻击与保护：酸性攻击／强酸火烟、手推车两种攻击、荆棘陷阱／墙、孢子、地狱植物、曼陀罗、四属性酸化及新技能；装备保护、全身与全体保护、影子装备保护、研究报告的材料减免和伤害增益。
- 制作与治疗：药水辅助／浓缩药水、药水学习及剑斧被动、暮光炼金、料理、特殊药剂、材料转换、仿生制药；配方选择、库存验证、扣除与批量产出。当前技能树已注释植物栽培、投掷物品、炸弹制作；复读其遗留实现用于边界判断，不将其当作当前可学习主技能。
- 召唤与生命体：植物、海洋球、四种仿生植物及召唤军团的创建、数量限制、删除计时器、主人关系和属性重算；生命体休息、召回、复活及冷却同步；被动属性、亲密度、气弹、两种模式、六段连招、范围攻击、增益、持续扣除和状态结束处理。
- 客户端：当前技能 ID／等级映射，主人与生命体分别选取施法实体，远距离命令队列与地面选点，制作菜单及材料转换桌面／触屏入口，成功／伤害／地面效果路由及原生资源依赖。

### 本轮修复

1. **召唤物重算读错技能。** 植物、海洋球、四种仿生植物和召唤军团在生成时保存自己的召唤技能与等级。属性重算使用这些值，避免主人施放其他技能后，数据库重载等重算路径丢失召唤 HP／攻击修正或混用地狱树加成。复用第 6 线引入的字段，不另建平行状态。
2. **催泪瓦斯高 HP 扣除回绕。** 最大 HP 的 5% 先用 `int64` 计算，修复 10 亿 HP 等有效配置下的乘法回绕；没有改变比例或周期。
3. **施放被拒绝仍扣生命体气弹。** 请求前置检查只验证，气弹改在施放结束且 HP／SP／物品条件通过后扣除，并重新检查剩余数量。未学习或请求等级超过已学等级时先归一化。Blazing And Furious 仍在计算命中数后清空气弹。
4. **地面生命体技能漏掉独立冷却。** 补齐与目标技能相同的生命体冷却登记，Blast Forge 的 3 秒配置现在生效；无冷却技能仍由原函数忽略零值。
5. **岩浆流重复概率判定。** 受击入口按 `3 × 技能等级` 的百分比判定一次；删除范围递归中每个目标再次判定概率的覆盖方法，并修正 `<=` 导致的额外 1%。不修改伤害公式。
6. **SP 恰好足够却不能施放。** 生命体／佣兵共用需求检查将 SP 不足条件改为严格小于消耗值，允许正常耗尽 SP；HP 的保命条件不变。

### 验证和边界

- `tests/genetic-resources.test.mjs` 执行真实召唤方法与属性选择分支，覆盖主人切换技能后的重算、地狱树区别、召唤军团等级和数量、催泪瓦斯高 HP，以及此前治疗、材料、生命体状态与冷却回归。召唤与催泪瓦斯旧实现分别断言失败，修复后通过。
- `tests/homunculus-casting.test.mjs` 提取实际请求方法、前置检查、资源扣除及冷却分支，覆盖禁用地图、正在施法、动作延迟、未学习、SP 不足、缺少物品、无效目标、技能冷却、气弹不足、正常扣除、Blazing 保留气弹、恰好足够的 SP。岩浆流穷举 0–99 随机结果并验证一次发动命中三个目标，不再逐目标随机跳过。旧气弹、地面冷却、岩浆流实现均复现失败。
- 上述 C++ 提取测试启用 UBSan；共享召唤路径的 `mechanic-resources.test.mjs` 回归通过。`map-server` 编译通过，未重启在线服务。
- 7 个客户端测试文件共 55 项通过，覆盖基因／生命体效果、材料菜单、四转映射、伙伴动作与冷却；63 个 STR 和 704 个关联资源通过本机 Gateway 读取及结构校验。客户端未修改，不重建相同 PWA 产物。
- 129 个数据库条目与客户端常量／等级核对，只有既有通用开店 `ALL_BUYING_STORE` 的服务端 1／客户端 2 级显示差异；生命体 58 项一致。原始清单和运行日志保存在忽略目录 `work/skill-review/genetic-round2-*`。
- 本轮是代码审查与定向回归，没有逐技能实机战斗或人工听音。第一轮记录的旧程序式动画、持续墙体表现缺口，以及仿生植物／部分生命体新技能／仿生制药未知公式仍然存在，未用猜测替换。

复现命令（服务端仓库）：

```sh
node tests/genetic-resources.test.mjs ../../work/skill-review/genetic-round2-resources --no-color
node tests/homunculus-casting.test.mjs ../../work/skill-review/genetic-round2-casting --no-color
node tests/mechanic-resources.test.mjs ../../work/skill-review/genetic-round2-mechanic-resources --no-color
```

### 本轮主技能逐项覆盖

| ID | 技能 | 实现入口 |
| --- | --- | --- |
| 36 | Enlarge Weight Limit `MC_INCCARRY` | shared/passive |
| 37 | Discount `MC_DISCOUNT` | shared/passive |
| 38 | Overcharge `MC_OVERCHARGE` | shared/passive |
| 39 | Pushcart `MC_PUSHCART` | shared/passive |
| 40 | Item Appraisal `MC_IDENTIFY` | itemappraisal.cpp |
| 41 | Vending `MC_VENDING` | skill_vending.cpp |
| 42 | Mammonite `MC_MAMMONITE` | mammonite.cpp |
| 153 | Cart Revolution `MC_CARTREVOLUTION` | cartrevolution.cpp |
| 154 | Change Cart `MC_CHANGECART` | changecart.cpp |
| 155 | Crazy Uproar `MC_LOUD` | crazyuproar.cpp |
| 226 | 斧修炼 `AM_AXEMASTERY` | shared/passive |
| 227 | 药水研究 `AM_LEARNINGPOTION` | shared/passive |
| 228 | 制作药水 `AM_PHARMACY` | preparepotion.cpp |
| 229 | 炸弹 `AM_DEMONSTRATION` | bomb.cpp |
| 230 | 酸性恐惧 `AM_ACIDTERROR` | acidterror.cpp |
| 231 | 辅助药水 `AM_POTIONPITCHER` | aidpotion.cpp |
| 232 | 召唤植物 `AM_CANNIBALIZE` | summonflora.cpp |
| 233 | 召唤海洋球 `AM_SPHEREMINE` | summonmarinesphere.cpp |
| 234 | 炼金武器 `AM_CP_WEAPON` | alchemicalweapon.cpp |
| 235 | 合成盾牌 `AM_CP_SHIELD` | synthesizedshield.cpp |
| 236 | 合成铠甲 `AM_CP_ARMOR` | syntheticarmor.cpp |
| 237 | 生化头盔 `AM_CP_HELM` | biochemicalhelm.cpp |
| 238 | 生物伦理 `AM_BIOETHICS` | shared/passive |
| 243 | 召唤人工生命体 `AM_CALLHOMUN` | callhomunculus.cpp |
| 244 | 蒸发 `AM_REST` | vaporize.cpp |
| 247 | 人工生命体复活 `AM_RESURRECTHOMUN` | homunculusresurrection.cpp |
| 446 | Aid Berserk Potion `AM_BERSERKPITCHER` | aidberserkpotion.cpp |
| 478 | 浓缩药水辅助 `CR_SLIMPITCHER` | aidcondensedpotion.cpp |
| 479 | 全面保护 `CR_FULLPROTECTION` | fullprotection.cpp |
| 490 | 强酸攻击 `CR_ACIDDEMONSTRATION` | aciddemonstration.cpp |
| 496 | Twilight Alchemy 1 `AM_TWILIGHT1` | twilightalchemy1.cpp |
| 497 | Twilight Alchemy 2 `AM_TWILIGHT2` | twilightalchemy2.cpp |
| 498 | Twilight Alchemy 3 `AM_TWILIGHT3` | twilightalchemy3.cpp |
| 2474 | 剑术训练 `GN_TRAINING_SWORD` | shared/passive |
| 2475 | 手推车改造 `GN_REMODELING_CART` | shared/passive |
| 2476 | 手推车龙卷风 `GN_CART_TORNADO` | carttornado.cpp |
| 2477 | 手推车加农炮 `GN_CARTCANNON` | cartcannon.cpp |
| 2478 | 手推车加速 `GN_CARTBOOST` | StatusSkillImpl |
| 2479 | 荆棘陷阱 `GN_THORNS_TRAP` | thorntrap.cpp |
| 2480 | 吸血 `GN_BLOOD_SUCKER` | StatusSkillImpl |
| 2481 | 孢子爆炸 `GN_SPORE_EXPLOSION` | sporeexplosion.cpp |
| 2482 | 荆棘之墙 `GN_WALLOFTHORN` | wallofthorns.cpp |
| 2483 | 狂野杂草 `GN_CRAZYWEED` | crazyweed.cpp |
| 2485 | 恶魔之火 `GN_DEMONIC_FIRE` | demonicfire.cpp |
| 2486 | 火焰扩散 `GN_FIRE_EXPANSION` | fireexpansion.cpp |
| 2490 | 地狱之花 `GN_HELLS_PLANT` | hellsplant.cpp |
| 2492 | 曼陀罗嚎叫 `GN_MANDRAGORA` | howlingofmandragora.cpp |
| 2494 | 材料转换 `GN_CHANGEMATERIAL` | changematerial.cpp |
| 2495 | 混合烹饪 `GN_MIX_COOKING` | mixcooking.cpp |
| 2497 | 特殊药剂 `GN_S_PHARMACY` | specialpharmacy.cpp |
| 2535 | Open Buying Store `ALL_BUYING_STORE` | shared/passive |
| 2544 | Decorate Cart `MC_CARTDECORATE` | decoratecart.cpp |
| 5003 | 幻影兴奋剂 `GN_ILLUSIONDOPING` | illusiondoping.cpp |
| 5014 | 全力推进 `ALL_FULL_THROTTLE` | shared/passive |
| 5336 | 仿生药剂学 `BO_BIONIC_PHARMACY` | bionicpharmacy.cpp |
| 5337 | 仿生学精通 `BO_BIONICS_M` | shared/passive |
| 5338 | 全面保护 `BO_THE_WHOLE_PROTECTION` | thewholeprotection.cpp |
| 5339 | 高级保护 `BO_ADVANCE_PROTECTION` | advanceprotection.cpp |
| 5340 | 水属性酸化区域 `BO_ACIDIFIED_ZONE_WATER` | acidifiedzonewater.cpp |
| 5341 | 地属性酸化区域 `BO_ACIDIFIED_ZONE_GROUND` | acidifiedzoneground.cpp |
| 5342 | 风属性酸化区域 `BO_ACIDIFIED_ZONE_WIND` | acidifiedzonewind.cpp |
| 5343 | 火属性酸化区域 `BO_ACIDIFIED_ZONE_FIRE` | acidifiedzonefire.cpp |
| 5344 | Wooden Warrior `BO_WOODENWARRIOR` | woodenwarrior.cpp |
| 5345 | Wooden Fairy `BO_WOODEN_FAIRY` | woodenfairy.cpp |
| 5346 | Creeper `BO_CREEPER` | creeper.cpp |
| 5347 | Research Report `BO_RESEARCHREPORT` | StatusSkillImpl |
| 5348 | Hell Tree `BO_HELLTREE` | helltree.cpp |
| 6005 | 爆炸粉末 `BO_EXPLOSIVE_POWDER` | explosivepowder.cpp |
| 6006 | 混乱荆棘 `BO_MAYHEMIC_THORNS` | mayhemicthorns.cpp |
| 6509 | Mystery Powder `BO_MYSTERY_POWDER` | mysterypowder.cpp |
| 6510 | Dust Explosion `BO_DUST_EXPLOSION` | dustexplosion.cpp |

### 本轮生命体逐项覆盖

| ID | 技能 | 实现入口 |
| --- | --- | --- |
| 8001 | 治愈之触 `HLIF_HEAL` | SkillHealingTouch |
| 8002 | 闪避 `HLIF_AVOID` | SkillAvoid |
| 8003 | 脑部手术 `HLIF_BRAIN` | 共享被动属性／技能前置 |
| 8004 | 变更 `HLIF_CHANGE` | SkillChange |
| 8005 | 王车易位 `HAMI_CASTLE` | SkillCastling |
| 8006 | 防御 `HAMI_DEFENCE` | SkillDefense |
| 8007 | 精钢皮肤 `HAMI_SKIN` | 共享被动属性／技能前置 |
| 8008 | 嗜血 `HAMI_BLOODLUST` | StatusSkillImpl |
| 8009 | 月光 `HFLI_MOON` | SkillMoonlight |
| 8010 | 瞬移 `HFLI_FLEET` | StatusSkillImpl |
| 8011 | 速度 `HFLI_SPEED` | StatusSkillImpl |
| 8012 | S.B.R.44 `HFLI_SBR44` | SkillSBR44 |
| 8013 | 奇想 `HVAN_CAPRICE` | SkillCaprice |
| 8014 | 混沌祝福 `HVAN_CHAOTIC` | SkillBenedictionOfChaos |
| 8015 | 指导 `HVAN_INSTRUCT` | 共享被动属性／技能前置 |
| 8016 | 生化爆炸 `HVAN_EXPLOSION` | SkillBioExplosion |
| 8018 | 召唤军团 `MH_SUMMON_LEGION` | SkillSummonLegion |
| 8019 | 麻痹针 `MH_NEEDLE_OF_PARALYZE` | SkillNeedleOfParalyze |
| 8020 | 毒雾 `MH_POISON_MIST` | SkillPoisonMist |
| 8021 | 止痛药 `MH_PAIN_KILLER` | SkillPainKiller |
| 8022 | 再生之光 `MH_LIGHT_OF_REGENE` | SkillLightOfRegene |
| 8023 | 过载提升 `MH_OVERED_BOOST` | SkillOveredBoost |
| 8024 | 橡皮擦切割 `MH_ERASER_CUTTER` | SkillEraserCutter |
| 8025 | 异种斩 `MH_XENO_SLASHER` | SkillXenoSlasher |
| 8026 | 寂静微风 `MH_SILENT_BREEZE` | SkillSilentBreeze |
| 8027 | 风格变换 `MH_STYLE_CHANGE` | SkillStyleChange |
| 8028 | 音速爪 `MH_SONIC_CRAW` | SkillSonicClaw |
| 8029 | 银色贝恩冲锋 `MH_SILVERVEIN_RUSH` | SkillSilverVeinRush |
| 8030 | 午夜狂乱 `MH_MIDNIGHT_FRENZY` | SkillMidnightFrenzy |
| 8031 | 钢铁之角 `MH_STAHL_HORN` | SkillSteelHorn |
| 8032 | 黄金脚跟 `MH_GOLDENE_FERSE` | StatusSkillImpl |
| 8033 | 石墙 `MH_STEINWAND` | SkillStoneWall |
| 8034 | 圣柱 `MH_HEILIGE_STANGE` | SkillHolyPole |
| 8035 | 攻击模式 `MH_ANGRIFFS_MODUS` | StatusSkillImpl |
| 8036 | 火种破坏 `MH_TINDER_BREAKER` | SkillTinderBreaker |
| 8037 | 连续破坏连击 `MH_CBC` | SkillContinualBreakCombo |
| 8038 | 永恒迅捷连击 `MH_EQC` | SkillEternalQuickCombo |
| 8039 | 岩浆流 `MH_MAGMA_FLOW` | SkillMagmaFlow |
| 8040 | Granitic Armor `MH_GRANITIC_ARMOR` | SkillGraniticArmor |
| 8041 | Lava Slide `MH_LAVA_SLIDE` | SkillLavaSlide |
| 8042 | Pyroclastic `MH_PYROCLASTIC` | SkillPyroclastic |
| 8043 | Volcanic Ash `MH_VOLCANIC_ASH` | SkillVolcanicAsh |
| 8044 | Blast Forge `MH_BLAST_FORGE` | SkillBlastForge |
| 8045 | Tempering `MH_TEMPERING` | SkillTempering |
| 8046 | Classy Flutter `MH_CLASSY_FLUTTER` | 共享被动属性／技能前置 |
| 8047 | Twister Cutter `MH_TWISTER_CUTTER` | SkillTwisterCutter |
| 8048 | Absolute Zephyr `MH_ABSOLUTE_ZEPHYR` | SkillAbsoluteZephyr |
| 8049 | Brushup Claw `MH_BRUSHUP_CLAW` | 共享被动属性／技能前置 |
| 8050 | Blazing And Furious `MH_BLAZING_AND_FURIOUS` | SkillBlazingAndFurious |
| 8051 | The One Fighter Rises `MH_THE_ONE_FIGHTER_RISES` | SkillTheOneFighterRises |
| 8052 | 抛光针 `MH_POLISHING_NEEDLE` | 共享被动属性／技能前置 |
| 8053 | 曼陀罗毒素 `MH_TOXIN_OF_MANDARA` | SkillToxinOfMandara |
| 8054 | 针刺 `MH_NEEDLE_STINGER` | SkillNeedleStinger |
| 8055 | 光角 `MH_LICHT_GEHORN` | 共享被动属性／技能前置 |
| 8056 | 闪耀长矛 `MH_GLANZEN_SPIES` | SkillGlanzenSpies |
| 8057 | 神圣之马 `MH_HEILIGE_PFERD` | SkillHeiligePferd |
| 8058 | 黄金音调 `MH_GOLDENE_TONE` | SkillGoldeneTone |
| 8059 | 炽热熔岩 `MH_BLAZING_LAVA` | 共享被动属性／技能前置 |


## 武僧／修罗线工作记录

### 范围和共享路径

重新从 Acolyte、Acolyte_High、Monk、Champion、Sura、Sura_T、Inquisitor 当前技能树提取 78 个主技能，逐项复读独立实现与工厂入口。服事继承部分沿用本轮第 3 线，额外复查武僧至四转的以下共享路径：

- 气弹创建、按时间排序、到期与消耗，吸收气弹／灵符、传递、潜龙升天扩容与结束时恢复五气弹上限；点穴攻击与受击补充气弹。
- 三连击至阿修罗、双龙脚至虎炮／地狱之门的技能前置、连招目标与状态通知、AGI／DEX 延迟修正、阿修罗 SP 清空及爆气结束。
- 闪光连击三个定时阶段、已学等级读取、目标距离／消失判断，以及拳套箭的延迟击退方向、撞墙追加；新月肘击派生反击、闪电步、真剑百破的双方状态解除。
- 诅咒圆环的成功目标计数、气弹上限与扣除、施法者关联计数及目标结束通知；同步核对同实现来源的魔物版。
- 虎炮 HP／SP 倍率、地狱之门额外伤害、治疗与坐下恢复、武器和拳套被动；审判官三种信念互斥、三个阶段前置、目标印记替换／移除和气弹免耗条件。
- 客户端选点／目标施法、动作、伤害与成功通知、地面效果、球体／束缚通知和原生 STR 依赖。范围动画标志经过 `flag & 0xFFF` 才进入伤害计算，不会被第三式火焰弹误计为额外段数；未根据单个局部变量误改此路径。

### 已复现并修复：诅咒圆环的计数契约丢失

`map_forcountinrange` 累加回调返回值，并据此停止遍历；原实现通过 `skill_area_sub` 调用通用无伤害分派，但成功分派返回 0。结果是成功束缚仍不增加计数，可以越过气弹数量限制束缚更多目标，随后按零人数扣气弹并建立错误的施法者关联状态。

改为技能专用的计数回调：只有成功束缚才返回 1；死亡、Boss、非敌对、免疫或已有束缚等失败目标不占人数。人数上限同时受本次记录的气弹数和当前实际剩余气弹约束，零气弹不进入“零代表无限制”的地图遍历模式。实际成功人数决定气弹消耗和施法者状态，没有目标时不建立自我束缚。

魔物版复用相同实现，保留对每个目标原有的 50% 成功率及非玩家最多 15 个目标。已经存在成功目标时，施法者关联状态不再额外作一次 50% 随机判定，避免受害者已束缚但施法者没有关联状态而无法及时解除。两种技能 ID、持续时间和范围继续分别从数据库读取。

### 验证与保留边界

- 新增 `tests/monk-bindings.test.mjs`，提取真实圆环实现编译执行，覆盖 0／1／2／5／15 气弹，夹杂 Boss、免疫、死亡和非敌对目标，仅一个有效目标、全部失败、当前气弹少于施放时记录，以及魔物版 15 人上限和 50% 传参。旧实现断言失败，修复后 UBSan 通过。
- `tests/monk-combat.test.mjs` 回归通过：地狱之门逐级 SP 加成、交错延迟击退、圆环逐目标释放及施法者消失、虎炮普通／连招启动与范围通知。
- 服务端 `map-server` 编译通过，未重启在线服务；客户端 5 个测试文件共 34 项通过。48 个 STR 和 663 个关联资源通过本机 Gateway 读取及结构校验；78 个技能的 ID、名称键和等级与客户端全部一致。
- 本轮客户端未改动，不重复构建相同 PWA。没有宣称逐技能真人战斗、人工听音或全部旧程序式效果已还原。
- 第一轮记录的未知 STR／AGI／POW 系数和 Power Velocity 高于五气弹时的产品规则继续保留，不凭猜测更改平衡。测试与原始清单存于忽略目录 `work/skill-review/monk-round2-*`。

复现命令（服务端仓库）：

```sh
node tests/monk-bindings.test.mjs ../../work/skill-review/monk-round2-bindings --no-color
node tests/monk-combat.test.mjs ../../work/skill-review/monk-round2-combat --no-color
```

### 本轮逐技能覆盖

| ID | 技能 | 实现入口 |
| --- | --- | --- |
| 22 | 天使之护 `AL_DP` | shared/passive |
| 23 | 恶魔克星 `AL_DEMONBANE` | shared/passive |
| 24 | 光猎 `AL_RUWACH` | ruwach.cpp |
| 25 | 光之障壁 `AL_PNEUMA` | pneuma.cpp |
| 26 | 瞬间移动 `AL_TELEPORT` | teleport.cpp |
| 27 | 传送之阵 `AL_WARP` | warpportal.cpp |
| 28 | 治愈术 `AL_HEAL` | heal.cpp |
| 29 | 敏捷提升 `AL_INCAGI` | incagi.cpp |
| 30 | 敏捷下降 `AL_DECAGI` | decagi.cpp |
| 31 | Aqua Benedicta `AL_HOLYWATER` | holywater.cpp |
| 32 | Signum Crucis `AL_CRUCIS` | crucis.cpp |
| 33 | Angelus `AL_ANGELUS` | angelus.cpp |
| 34 | Blessing `AL_BLESSING` | blessing.cpp |
| 35 | Cure `AL_CURE` | cure.cpp |
| 156 | Holy Light `AL_HOLYLIGHT` | holylight.cpp |
| 259 | 铁砂掌 `MO_IRONHAND` | shared/passive |
| 260 | 心灵震波 `MO_SPIRITSRECOVERY` | shared/passive |
| 261 | 气弹召唤 `MO_CALLSPIRITS` | summonspiritsphere.cpp |
| 262 | 气弹吸收 `MO_ABSORBSPIRITS` | absorbspiritsphere.cpp |
| 263 | 三连击 `MO_TRIPLEATTACK` | ragingtrifectablow.cpp |
| 264 | 残影 `MO_BODYRELOCATION` | snap.cpp |
| 265 | Dodge `MO_DODGE` | shared/passive |
| 266 | Occult Impaction `MO_INVESTIGATE` | occultimpaction.cpp |
| 267 | Throw Spirit Sphere `MO_FINGEROFFENSIVE` | throwspiritsphere.cpp |
| 268 | Mental Strength `MO_STEELBODY` | StatusSkillImpl |
| 269 | Root `MO_BLADESTOP` | StatusSkillImpl |
| 270 | Fury `MO_EXPLOSIONSPIRITS` | StatusSkillImpl |
| 271 | Asura Strike `MO_EXTREMITYFIST` | asurastrike.cpp |
| 272 | Raging Quadruple Blow `MO_CHAINCOMBO` | ragingquadrupleblow.cpp |
| 273 | Raging Thrust `MO_COMBOFINISH` | ragingthrust.cpp |
| 370 | 罗刹破凰拳 `CH_PALMSTRIKE` | ragingpalmstrike.cpp |
| 371 | 冰川拳 `CH_TIGERFIST` | glacierfist.cpp |
| 372 | 连环全身掌 `CH_CHAINCRUSH` | chaincrushcombo.cpp |
| 401 | 禅 `CH_SOULCOLLECT` | zen.cpp |
| 1015 | 气功转化 `MO_KITRANSLATION` | kitranslation.cpp |
| 1016 | 气功爆破 `MO_BALKYOUNG` | kiexplosion.cpp |
| 2326 | 龙连击 `SR_DRAGONCOMBO` | dragoncombo.cpp |
| 2327 | 天网击 `SR_SKYNETBLOW` | skynetblow.cpp |
| 2328 | 大地震撼 `SR_EARTHSHAKER` | earthshaker.cpp |
| 2329 | 堕落帝国 `SR_FALLENEMPIRE` | fallenempire.cpp |
| 2330 | 虎炮 `SR_TIGERCANNON` | tigercannon.cpp |
| 2332 | 狂暴爆破 `SR_RAMPAGEBLASTER` | rampageblaster.cpp |
| 2333 | 新月肘击 `SR_CRESCENTELBOW` | StatusSkillImpl |
| 2334 | 诅咒圆环 `SR_CURSEDCIRCLE` | cursedcircle.cpp |
| 2335 | 闪电步 `SR_LIGHTNINGWALK` | StatusSkillImpl |
| 2336 | 拳套箭 `SR_KNUCKLEARROW` | knucklearrow.cpp |
| 2337 | 风车 `SR_WINDMILL` | windmill.cpp |
| 2338 | 升龙 `SR_RAISINGDRAGON` | raisingdragon.cpp |
| 2340 | 力量同化 `SR_ASSIMILATEPOWER` | assimilatepower.cpp |
| 2341 | Power Velocity `SR_POWERVELOCITY` | powervelocity.cpp |
| 2343 | Gate of Hell `SR_GATEOFHELL` | gateofhell.cpp |
| 2344 | Gentle Touch - Quiet `SR_GENTLETOUCH_QUIET` | gentletouchquiet.cpp |
| 2345 | Gentle Touch - Cure `SR_GENTLETOUCH_CURE` | gentletouchcure.cpp |
| 2346 | Gentle Touch - Energy Gain `SR_GENTLETOUCH_ENERGYGAIN` | StatusSkillImpl |
| 2347 | Gentle Touch - Change `SR_GENTLETOUCH_CHANGE` | StatusSkillImpl |
| 2348 | Gentle Touch - Revitalize `SR_GENTLETOUCH_REVITALIZE` | StatusSkillImpl |
| 2517 | Howling of Lion `SR_HOWLINGOFLION` | howlingoflion.cpp |
| 2518 | Ride In Lightening `SR_RIDEINLIGHTNING` | rideinlightening.cpp |
| 5009 | 闪光连击 `SR_FLASHCOMBO` | flashcombo.cpp |
| 5014 | 全力推进 `ALL_FULL_THROTTLE` | shared/passive |
| 5238 | Powerful Faith `IQ_POWERFUL_FAITH` | StatusSkillImpl |
| 5239 | Firm Faith `IQ_FIRM_FAITH` | StatusSkillImpl |
| 5240 | Will Of Faith `IQ_WILL_OF_FAITH` | shared/passive |
| 5241 | Oleum Sanctum `IQ_OLEUM_SANCTUM` | oleumsanctum.cpp |
| 5242 | 真诚信仰 `IQ_SINCERE_FAITH` | StatusSkillImpl |
| 5243 | 巨大火焰爆破 `IQ_MASSIVE_F_BLASTER` | massiveflameblaster.cpp |
| 5244 | 爆炸爆破 `IQ_EXPOSION_BLASTER` | explosionblaster.cpp |
| 5245 | 第一烙印 `IQ_FIRST_BRAND` | firstbrand.cpp |
| 5246 | 第一信仰之力 `IQ_FIRST_FAITH_POWER` | StatusSkillImpl |
| 5247 | 审判 `IQ_JUDGE` | StatusSkillImpl |
| 5248 | 第二火焰 `IQ_SECOND_FLAME` | secondflame.cpp |
| 5249 | 第二信仰 `IQ_SECOND_FAITH` | secondfaith.cpp |
| 5250 | 第二审判 `IQ_SECOND_JUDGEMENT` | secondjudgement.cpp |
| 5251 | 第三惩罚 `IQ_THIRD_PUNISH` | thirdpunish.cpp |
| 5252 | 第三火焰炸弹 `IQ_THIRD_FLAME_BOMB` | thirdflamebomb.cpp |
| 5253 | 第三奉献 `IQ_THIRD_CONSECRATION` | thirdconsecration.cpp |
| 5254 | 第三驱魔之火 `IQ_THIRD_EXOR_FLAME` | StatusSkillImpl |
| 6519 | Blazing Flame Blast `IQ_BLAZING_FLAME_BLAST` | blazingflameblast.cpp |

## 流氓／魅影追踪者线工作记录

### 范围与共享路径

从当前 Thief、Thief_High、Rogue、Stalker、Shadow_Chaser、Shadow_Chaser_T、Abyss_Chaser 技能树重新提取 74 个主技能，核对定义、前置、材料、SP／AP、武器及箭矢要求与工厂入口。一转盗贼及剑术／弓箭／拆陷阱继承能力结合本轮前述职业线核对；再次阅读流氓至四转独立实现，连锁反应射击、来自深渊和深渊火焰的派生入口一并覆盖。

- 二转／进阶：抢夺的普攻触发与偷窃检查、抢劫的魔物及重复限制、背刺位移与方向、潜击的隐匿前置和范围标记、脱装概率／持续时间／化学保护、挟持的延迟传送与目标失效、商店折扣及多人同坐逻辑。
- 复制／繁殖：可复制资格、保持状态、等级上限、两个复制槽去重、替换、持久化恢复；自动暗影法术的列表、取消、交易／死亡／重置失效清理和自动施放入口。
- 状态：近身禁锢的目标计数及双侧解除、暗影形态的地图／死亡／敌对检查和转伤次数、隐身术与潜行的周期消耗、面具的成功率／Boss 限制／重复限制、气弹及随行清理、传染的状态白名单和剩余计时。
- 地面：人孔的目标关联与结束、次元门的地图限制、混乱恐慌的重复状态、漩涡的吸收及地图格清理、血腥欲望的离开清理、虚击炸弹的诱饵与到时爆炸、紧急逃脱的陷阱材料和击退。
- 四转：匕首／弓和魔法剑修炼的武器及体型数组、追击状态与多段变化、各攻击的范围／移动／派生调用、深渊球生成／周期补充／消耗／结束、深渊广场的范围内双倍段数、欧米伽深渊打击的种族倍率。
- 客户端：自动施法选择的桌面／移动入口与取消封包，目标与地面施法，四转启动／命中／地面效果的挂接及资源依赖；没有改动封包版本。

### 已复现并修复：弓的攻击距离标记冲突

Hit And Sliding（`ABC_HIT_AND_SLIDING`）数据库范围为 2。通用伤害初始化先设置近战标记；技能使用弓时原本只追加远程标记，造成一次攻击同时带有 `BF_SHORT` 和 `BF_LONG`。近战防御／减伤与远程防御／减伤因此可能同时匹配。

弓分支现在先清除近战标记，再设置远程标记；保留武器和技能攻击标记，非弓及非玩家分支不变。没有调整倍率、射程、位移距离或消耗。

### 验证与保留边界

- 新增 `tests/rogue-range.test.mjs`，提取真实 `battle_range_type` 与 `modifyDamageData` 编译执行。旧实现断言失败；修复后覆盖 1–5 级、按技能范围／按距离配置、近／远距离、弓／匕首／长枪和非玩家来源，UBSan 通过。
- `tests/rogue-state.test.mjs` 回归通过，覆盖选择取消和失效清理、多个禁锢目标、敌对判断和高 SP 消耗。
- 当前 74 个技能的 ID、名称键及最大等级与客户端一致；客户端 5 个文件共 34 项回归通过。38 个 STR、592 个贴图依赖均通过 Gateway 获取及结构检查。
- 服务端 `map-server` 编译通过，未重启在线地图服务。客户端无代码改动，不重复构建相同 PWA；没有做逐技能实机战斗或人工听音，不能据此宣称官方数值与视觉完全一致。
- 涂鸦／城旗涂鸦遗留功能缺口仍保留：缺少完整文字输入／地面显示，城旗涂鸦没有专属服务端施放实现。本轮未擅自定义这些旧功能的规则。背刺命中率、致命威胁 AGI 和部分深渊自动触发概率的上游 TODO 也没有凭猜测调整。

复现命令（服务端仓库）：

```sh
node tests/rogue-range.test.mjs ../../work/skill-review/rogue-round2-range --no-color
node tests/rogue-state.test.mjs ../../work/skill-review/rogue-round2-state --no-color
```

当前清单、比对和构建输出位于忽略目录 `work/skill-review/rogue-round2-*`。

### 逐技能清单

| ID | 技能 | 实现入口 |
| --- | --- | --- |
| 2 | `SM_SWORD` | shared/passive |
| 44 | `AC_VULTURE` | shared/passive |
| 46 | `AC_DOUBLE` | shared/passive |
| 48 | `TF_DOUBLE` | doubleattack.cpp |
| 49 | `TF_MISS` | shared/passive |
| 50 | `TF_STEAL` | steal.cpp |
| 51 | `TF_HIDING` | hiding.cpp |
| 52 | `TF_POISON` | envenom.cpp |
| 53 | `TF_DETOXIFY` | detoxify.cpp |
| 124 | `HT_REMOVETRAP` | shared/passive |
| 149 | `TF_SPRINKLESAND` | sandattack.cpp |
| 150 | `TF_BACKSLIDING` | backslide.cpp |
| 151 | `TF_PICKSTONE` | findstone.cpp |
| 152 | `TF_THROWSTONE` | stonefling.cpp |
| 210 | `RG_SNATCHER` | shared/passive |
| 211 | `RG_STEALCOIN` | mug.cpp |
| 212 | `RG_BACKSTAP` | backstab.cpp |
| 213 | `RG_TUNNELDRIVE` | shared/passive |
| 214 | `RG_RAID` | sightlessmind.cpp |
| 215 | `RG_STRIPWEAPON` | divestweapon.cpp |
| 216 | `RG_STRIPSHIELD` | divestshield.cpp |
| 217 | `RG_STRIPARMOR` | divestarmor.cpp |
| 218 | `RG_STRIPHELM` | divesthelm.cpp |
| 219 | `RG_INTIMIDATE` | snatch.cpp |
| 220 | `RG_GRAFFITI` | scribble.cpp |
| 221 | `RG_FLAGGRAFFITI` | 遗留缺口：无专属施放实现 |
| 222 | `RG_CLEANER` | remover.cpp |
| 223 | `RG_GANGSTER` | shared/passive |
| 224 | `RG_COMPULSION` | shared/passive |
| 225 | `RG_PLAGIARISM` | shared/passive |
| 389 | `ST_CHASEWALK` | stealth.cpp |
| 390 | `ST_REJECTSWORD` | counterinstinct.cpp |
| 475 | `ST_PRESERVE` | StatusSkillImpl |
| 476 | `ST_FULLSTRIP` | divestall.cpp |
| 1005 | `RG_CLOSECONFINE` | closeconfine.cpp |
| 2284 | `SC_FATALMENACE` | fatalmenace.cpp |
| 2285 | `SC_REPRODUCE` | reproduce.cpp |
| 2286 | `SC_AUTOSHADOWSPELL` | autoshadowspell.cpp |
| 2287 | `SC_SHADOWFORM` | shadowform.cpp |
| 2288 | `SC_TRIANGLESHOT` | triangleshot.cpp |
| 2289 | `SC_BODYPAINT` | bodypainting.cpp |
| 2290 | `SC_INVISIBILITY` | invisibility.cpp |
| 2291 | `SC_DEADLYINFECT` | StatusSkillImpl |
| 2292 | `SC_ENERVATION` | masqueradeenervation.cpp |
| 2293 | `SC_GROOMY` | masqueradegloomy.cpp |
| 2294 | `SC_IGNORANCE` | masqueradeignorance.cpp |
| 2295 | `SC_LAZINESS` | masqueradelaziness.cpp |
| 2296 | `SC_UNLUCKY` | masqueradeunlucky.cpp |
| 2297 | `SC_WEAKNESS` | masqueradeweakness.cpp |
| 2298 | `SC_STRIPACCESSARY` | stripaccessory.cpp |
| 2299 | `SC_MANHOLE` | manhole.cpp |
| 2300 | `SC_DIMENSIONDOOR` | dimensiondoor.cpp |
| 2301 | `SC_CHAOSPANIC` | chaospanic.cpp |
| 2302 | `SC_MAELSTROM` | maelstrom.cpp |
| 2303 | `SC_BLOODYLUST` | bloodylust.cpp |
| 2304 | `SC_FEINTBOMB` | feintbomb.cpp |
| 5010 | `SC_ESCAPE` | emergencyescape.cpp |
| 5014 | `ALL_FULL_THROTTLE` | shared/passive |
| 5311 | `ABC_DAGGER_AND_BOW_M` | shared/passive |
| 5312 | `ABC_MAGIC_SWORD_M` | shared/passive |
| 5313 | `ABC_STRIP_SHADOW` | stripshadow.cpp |
| 5314 | `ABC_ABYSS_DAGGER` | abyssdagger.cpp |
| 5315 | `ABC_UNLUCKY_RUSH` | unluckyrush.cpp |
| 5316 | `ABC_CHAIN_REACTION_SHOT` | chainreactionshot.cpp |
| 5317 | `ABC_FROM_THE_ABYSS` | fromtheabyss.cpp |
| 5318 | `ABC_ABYSS_SLAYER` | StatusSkillImpl |
| 5319 | `ABC_ABYSS_STRIKE` | omegaabyssstrike.cpp |
| 5320 | `ABC_DEFT_STAB` | deftstab.cpp |
| 5321 | `ABC_ABYSS_SQUARE` | abysssquare.cpp |
| 5322 | `ABC_FRENZY_SHOT` | frenzyshot.cpp |
| 6512 | `ABC_HIT_AND_SLIDING` | hitandsliding.cpp |
| 6513 | `ABC_CHASING_BREAK` | chasingbreak.cpp |
| 6514 | `ABC_CHASING_SHOT` | chasingshot.cpp |
| 6515 | `ABC_ABYSS_FLAME` | abyssflame.cpp |

## 诗人／舞娘双分支工作记录

### 范围与依据

重新从当前 Archer、Archer_High、Bard、Dancer、Clown、Gypsy、Minstrel、Wanderer、Minstrel_T、Wanderer_T、Troubadour、Trouvere 技能树提取 85 个去重主技能，逐项核对数据库、工厂分派、独立实现及共享状态。继承弓箭手结合本轮第 1 线检查；派生覆盖严重暴雨周期、玫瑰绽放后续范围攻击、混音自然结束攻击，以及旧残响／支配烙印对应的现存魔物地面路径。

- 二转歌曲与合奏：Renewal 的统一歌曲分派、敌我／队伍／公会范围、最后歌曲记录、搭档职业／性别／队伍／武器／存活／行动限制、合奏疲劳和月光水车双方舞蹈关联。
- 进阶：箭雨风暴倍率、人偶控制的双方属性片段／距离／解除、塔罗概率和各牌效果、冷笑话／惊声尖叫的延迟及队友概率、任务技能的目标限制。
- 三转：单人／队伍增益、课程加成与互斥状态、魔力之歌一次恢复、沉睡恢复周期、狂热之夜消耗、弗丽嘉之歌周期、冥界诗歌地面触发、残响／节奏波动的箭矢属性和消耗、严重暴雨装备冻结与周期伤害。
- 四转：舞台礼仪的武器及 P.ATK／S.MATK 条件、交响乐与克瓦希尔奏鸣曲、七种歌曲的搭档增益和重唱记录、玫瑰／混音状态的自然结束与提前解除、各伤害倍率／AP／箭矢入口。
- 重新核对当前技能 ID、最大等级、目标类型、武器限制、状态和地面单位。客户端仍只有已知内部命名差异：318 的 `BA_FROSTJOKER`／`BA_FROSTJOKE`，5068 的 `CG_SPECIALSINGER`／`SKID_CG_SPECIALSINGER`；没有添加兼容别名。

### 已复现并修复

1. 严重暴雨：乐器／鞭子的额外倍率原本依赖 `miscflag & 4`，但当前地面周期入口传入 0，后续初始化也不再设置该标记。改为依据施法者的实际武器类型计算，保留弓及非玩家行为。
2. 合奏搭档：`skill_check_pc_partner` 用静态计数和 ID 数组保存上一次查询，两个角色交错施法会使后施法者覆盖前者的搭档；大回音直接进入执行分支也可能使用旧结果。改为每次调用使用本地结果并重新查找当前搭档，疲劳、舞蹈关联和搭档 SP 消耗都只作用于本次有效对象；一并验证共享牧师调用。
3. 安可／回顾：内部重唱直接传入历史等级，而入口只检查该歌曲当前是否已学。重置后重新学习低等级仍可重唱旧高等级。现在施放时取历史等级与当前已学等级的较低值，没有有效等级则失败。

### 验证与边界

- `tests/bard-rainstorm.test.mjs` 提取真实伤害公式：旧实现乐器且标记为 0 时失败；新实现覆盖技能 1–5 级、角色等级 100／175／250、乐器／鞭子／弓／匕首、无关标记及非玩家，UBSan 通过。
- `tests/bard-partner.test.mjs` 提取真实搭档查询／执行函数：旧实现交错查询后对错误搭档施加疲劳；新实现覆盖两对搭档、离开后的重新查询、大回音直接执行、月光水车已建立施法者状态的时序，以及共享牧师扣 SP 路径。地图枚举由测试提供，未冒充多人实战。
- `tests/bard-recall.test.mjs` 提取两个真实重唱方法：旧实现重唱 10 级而当前只学 1 级时失败；新实现覆盖历史等级 1／5／10 与当前等级 0／1／3／10 的组合，验证失败通知及实际调用等级。
- 既有 `tests/bard-song.test.mjs` 回归通过；客户端 4 个文件 20 项测试通过；42 个 STR、420 个贴图依赖均通过本机 Gateway 获取与结构检查。服务端 `map-server` 编译通过，未重启在线服务。
- 客户端没有修改，不重复构建相同 PWA。未进行逐技能多人实战、人工听音或官方逐帧比对；旧程序效果、课程／四转概率等未定规则仍按第一轮限制记录，人偶控制维持现有属性片段规则。

复现命令（服务端仓库）：

```sh
node tests/bard-rainstorm.test.mjs ../../work/skill-review/bard-round2-rainstorm --no-color
node tests/bard-partner.test.mjs ../../work/skill-review/bard-round2-partner --no-color
node tests/bard-recall.test.mjs ../../work/skill-review/bard-round2-recall --no-color
node tests/bard-song.test.mjs ../../work/skill-review/bard-round2-song --no-color
```

原始清单与验证输出位于忽略目录 `work/skill-review/bard-round2-*`。

### 逐技能清单

| ID | 技能 | 实现入口 |
| --- | --- | --- |
| 43 | `AC_OWL` | shared/passive |
| 44 | `AC_VULTURE` | shared/passive |
| 45 | `AC_CONCENTRATION` | concentration.cpp |
| 46 | `AC_DOUBLE` | doublestrafe.cpp |
| 47 | `AC_SHOWER` | arrowshower.cpp |
| 147 | `AC_MAKINGARROW` | makingarrow.cpp |
| 148 | `AC_CHARGEARROW` | chargearrow.cpp |
| 304 | `BD_ADAPTATION` | amp.cpp |
| 305 | `BD_ENCORE` | encore.cpp |
| 306 | `BD_LULLABY` | lullaby.cpp |
| 307 | `BD_RICHMANKIM` | mentalsensing.cpp |
| 308 | `BD_ETERNALCHAOS` | downtempo.cpp |
| 309 | `BD_DRUMBATTLEFIELD` | battletheme.cpp |
| 310 | `BD_RINGNIBELUNGEN` | harmoniclick.cpp |
| 311 | `BD_ROKISWEIL` | classicalpluck.cpp |
| 312 | `BD_INTOABYSS` | powerchord.cpp |
| 313 | `BD_SIEGFRIED` | acousticrhythm.cpp |
| 315 | `BA_MUSICALLESSON` | shared/passive |
| 316 | `BA_MUSICALSTRIKE` | melodystrike.cpp |
| 317 | `BA_DISSONANCE` | unchainedserenade.cpp |
| 318 | `BA_FROSTJOKER` | unbarringoctave.cpp |
| 319 | `BA_WHISTLE` | perfecttablature.cpp |
| 320 | `BA_ASSASSINCROSS` | impressiveriff.cpp |
| 321 | `BA_POEMBRAGI` | magicstrings.cpp |
| 322 | `BA_APPLEIDUN` | songoflutie.cpp |
| 323 | `DC_DANCINGLESSON` | shared/passive |
| 324 | `DC_THROWARROW` | slingingarrow.cpp |
| 325 | `DC_UGLYDANCE` | hipshaker.cpp |
| 326 | `DC_SCREAM` | dazzler.cpp |
| 327 | `DC_HUMMING` | focusballet.cpp |
| 328 | `DC_DONTFORGETME` | slowgrace.cpp |
| 329 | `DC_FORTUNEKISS` | ladyluck.cpp |
| 330 | `DC_SERVICEFORYOU` | gypsyskiss.cpp |
| 394 | `CG_ARROWVULCAN` | vulcanarrow.cpp |
| 395 | `CG_MOONLIT` | shelteringbliss.cpp |
| 396 | `CG_MARIONETTE` | marionettecontrol.cpp |
| 488 | `CG_HERMODE` | wandofhermode.cpp |
| 489 | `CG_TAROTCARD` | tarotcardoffate.cpp |
| 1010 | `BA_PANGVOICE` | pangvoice.cpp |
| 1011 | `DC_WINKCHARM` | winkofcharm.cpp |
| 2350 | `WA_SWING_DANCE` | swingdance.cpp |
| 2351 | `WA_SYMPHONY_OF_LOVER` | symphonyoflovers.cpp |
| 2352 | `WA_MOONLIT_SERENADE` | moonlitserenade.cpp |
| 2381 | `MI_RUSH_WINDMILL` | windmillrushattack.cpp |
| 2382 | `MI_ECHOSONG` | echosong.cpp |
| 2383 | `MI_HARMONIZE` | harmonize.cpp |
| 2412 | `WM_LESSON` | shared/passive |
| 2413 | `WM_METALICSOUND` | metallicsound.cpp |
| 2414 | `WM_REVERBERATION` | reverberation.cpp |
| 2418 | `WM_SEVERE_RAINSTORM` | severerainstorm.cpp |
| 2419 | `WM_POEMOFNETHERWORLD` | poemofthenetherworld.cpp |
| 2420 | `WM_VOICEOFSIREN` | voiceofsiren.cpp |
| 2421 | `WM_DEADHILLHERE` | valleyofdeath.cpp |
| 2422 | `WM_LULLABY_DEEPSLEEP` | deepsleeplullaby.cpp |
| 2423 | `WM_SIRCLEOFNATURE` | circleofnaturessound.cpp |
| 2424 | `WM_RANDOMIZESPELL` | improvisedsong.cpp |
| 2425 | `WM_GLOOMYDAY` | gloomyday.cpp |
| 2426 | `WM_GREAT_ECHO` | greatecho.cpp |
| 2427 | `WM_SONG_OF_MANA` | songofmana.cpp |
| 2428 | `WM_DANCE_WITH_WUG` | dancewithawarg.cpp |
| 2429 | `WM_SOUND_OF_DESTRUCTION` | soundofdestruction.cpp |
| 2430 | `WM_SATURDAY_NIGHT_FEVER` | saturdaynightfever.cpp |
| 2431 | `WM_LERADS_DEW` | leradsdew.cpp |
| 2432 | `WM_MELODYOFSINK` | melodyofsink.cpp |
| 2433 | `WM_BEYOND_OF_WARCRY` | warcryofbeyond.cpp |
| 2434 | `WM_UNLIMITED_HUMMING_VOICE` | unlimitedhummingvoice.cpp |
| 5007 | `WM_FRIGG_SONG` | friggssong.cpp |
| 5014 | `ALL_FULL_THROTTLE` | shared/passive |
| 5068 | `CG_SPECIALSINGER` | skilledspecialsinger.cpp |
| 5349 | `TR_STAGE_MANNER` | shared/passive |
| 5350 | `TR_RETROSPECTION` | retrospection.cpp |
| 5351 | `TR_MYSTIC_SYMPHONY` | StatusSkillImpl |
| 5352 | `TR_KVASIR_SONATA` | StatusSkillImpl |
| 5353 | `TR_ROSEBLOSSOM` | roseblossom.cpp |
| 5355 | `TR_RHYTHMSHOOTING` | rhythmshooting.cpp |
| 5356 | `TR_METALIC_FURY` | metallicfury.cpp |
| 5357 | `TR_SOUNDBLEND` | soundblend.cpp |
| 5358 | `TR_GEF_NOCTURN` | geffenianocturn.cpp |
| 5359 | `TR_ROKI_CAPRICCIO` | rokicapriccio.cpp |
| 5360 | `TR_AIN_RHAPSODY` | ainrhapsody.cpp |
| 5361 | `TR_MUSICAL_INTERLUDE` | musicalinterlude.cpp |
| 5362 | `TR_JAWAII_SERENADE` | jawaiiserenade.cpp |
| 5363 | `TR_NIPELHEIM_REQUIEM` | nipelheimrequiem.cpp |
| 5364 | `TR_PRON_MARCH` | pronmarch.cpp |
| 6521 | `TR_RHYTHMICAL_WAVE` | rhythmicalwave.cpp |
