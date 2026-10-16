# 主要职业线技能审查

本轮按用户指定的 1–11 顺序审查，每条线独立提交。范围包括基础职业、进阶二转、三转、四转及其继承技能。以当前 Renewal 服务端、PACKETVER=20211103 和本机运行资源为依据；代码审查不等同于逐技能实机验收，也不以空特效配置直接判定技能失效。

## 进度

| 顺序 | 职业线 | 状态 |
| --- | --- | --- |
| 1 | 弓箭手／猎人／神射手／游侠／风鹰 | 代码审查完成，修复并完成自动验证 |
| 2 | 魔法师／巫师／大法师／至高法师 | 78 个技能代码审查完成，修复并完成自动验证 |
| 3 | 服事／牧师／大主教／枢机主教 | 77 个技能代码审查完成，修复并完成自动验证 |
| 4 | 剑士／十字军／皇家卫士／帝国卫士 | 70 个技能代码审查完成，修复并完成自动验证 |
| 5 | 盗贼／刺客／十字斩首者／暗影十字 | 57 个技能代码审查完成，修复并完成自动验证 |
| 6 | 商人／铁匠／机甲神匠／机甲大师 | 89 个技能代码审查完成，修复并完成自动验证 |
| 7 | 魔法师／贤者／妖术师／元素大师 | 93 个技能代码审查完成，修复并完成自动验证 |
| 8 | 商人／炼金术师／基因学者／生物学者 | 71 个主技能及 58 个生命体技能代码审查完成，修复并完成自动验证 |
| 9 | 服事／武僧／修罗／审判官 | 78 个主技能代码审查完成，修复并完成自动验证 |
| 10 | 盗贼／流氓／魅影追踪者／深渊追踪者 | 74 个主技能代码审查完成，含遗留涂鸦功能缺口 |
| 11 | 弓箭手／诗人、舞娘／宫廷乐师、漫游舞者／吟游诗人、咏唱舞姬 | 85 个主技能代码审查完成，修复并完成自动验证 |

## 1. 猎人线

### 范围与依据

从服务端 `db/re/skill_tree.yml` 提取 Archer、Hunter、Sniper、Ranger、Ranger_T、Windhawk 的非零等级技能，共 68 个去重技能（不重复计入初心者通用技能）。全部名称、ID 与客户端 SkillConst／SkillInfo.generated 对应一致。

逐项核对 `db/re/skill_db.yml` 的目标类型、资源和状态条件，以及 `src/map/skills/archer/` 的实现和工厂分派。被动技能继续核对 `status.cpp`／`battle.cpp` 的属性及伤害路径；通用增益核对 StatusSkillImpl 和状态初始化。客户端核对 SkillUse／SkillTargets、技能封包处理、SkillAction、SkillEffect、SkillUnit、FourthJobEffects 和随行实体状态处理。

### 明确问题与修复

- 猎鹰／鹰和战狼攻击目标已不在可见实体集合时，客户端原本直接读取目标坐标，导致技能封包处理报错。提取共用随行动作函数：无目标时跳过移动，保留可见目标的飞行／奔跑方式。
- 话匣子只有封包结构，没有留言输入和触发消息处理。补充共用确认弹窗输入，使用已有带留言的地面技能封包；触发消息按 UTF-8 解码并显示在对应实体上。按 80 字节字段保留结束符，拒绝空留言、嵌入 NUL 和超过 79 字节的输入。取消、断线或切图后不继续发送旧位置的请求。

### 验证与限制

- 19 项定向测试通过：随行攻击目标消失、原移动参数保留、话匣子中文封包往返、字节边界、断线取消、共用技能目标／施放及四转地面单位映射。
- 风鹰显式特效及四种陷阱的 31 个 STR、338 个依赖贴图经 Gateway 读取与结构检查，无缺失。
- ESLint、完整 PWA 构建与 Gateway 产物检查。
- 尚未逐技能进行浏览器战斗或人工听音；本轮不宣称所有倍率与官方版本完全一致。Wild Walk 服务端仍标有未知 CON／被动系数的上游 TODO，本轮不凭猜测改平衡数值。
- 扩展运行 FourthJobEffects 测试时发现一条旧骑士用例仍要求侍从武器由状态重复播放，与此前改为剩余数量驱动的实现冲突。此项属于骑士回归，不计入猎人线通过的 19 项测试；已在巫师线回归中更新该旧用例。

### 逐技能清单

“代码核验”表示已检查定义、入口及对应实现，不表示逐技能实机通过。被动技能不要求主动施放特效；陷阱由地面单位承担放置与清理，不能只检查 SkillEffect。

| ID | 技能 | 目标类型 | 核验路径／结果 |
| --- | --- | --- | --- |
| 43 | 猫头鹰之眼 `AC_OWL` | 被动 | 代码核验；服务端属性／伤害或技能前置条件 |
| 44 | 兀鹰之眼 `AC_VULTURE` | 被动 | 代码核验；服务端属性／伤害或技能前置条件 |
| 45 | 专注 `AC_CONCENTRATION` | 自身 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 46 | 二连矢 `AC_DOUBLE` | 目标 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 47 | 箭雨 `AC_SHOWER` | 地面 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 115 | 滑动陷阱 `HT_SKIDTRAP` | 地面 | 代码核验；地面单位 Skidtrap |
| 116 | 地雷 `HT_LANDMINE` | 地面 | 代码核验；地面单位 Landmine |
| 117 | 定身陷阱 `HT_ANKLESNARE` | 地面 | 代码核验；地面单位 Anklesnare |
| 118 | 冲击波陷阱 `HT_SHOCKWAVE` | 地面 | 代码核验；地面单位 Shockwave |
| 119 | 睡魔 `HT_SANDMAN` | 地面 | 代码核验；地面单位 Sandman |
| 120 | 闪光陷阱 `HT_FLASHER` | 地面 | 代码核验；地面单位 Flasher |
| 121 | 冰冻陷阱 `HT_FREEZINGTRAP` | 地面 | 代码核验；地面单位 Freezingtrap |
| 122 | 爆破地雷 `HT_BLASTMINE` | 地面 | 代码核验；地面单位 Blastmine |
| 123 | 克雷莫陷阱 `HT_CLAYMORETRAP` | 地面 | 代码核验；地面单位 Claymoretrap |
| 124 | 拆除陷阱 `HT_REMOVETRAP` | 陷阱 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 125 | 话匣子 `HT_TALKIEBOX` | 地面 | 修复留言输入、封包编码和触发显示 |
| 126 | 兽物驱除 `HT_BEASTBANE` | 被动 | 代码核验；服务端属性／伤害或技能前置条件 |
| 127 | 猎鹰精通 `HT_FALCON` | 被动 | 代码核验；服务端属性／伤害或技能前置条件 |
| 128 | 钢铁之鸦 `HT_STEELCROW` | 被动 | 代码核验；服务端属性／伤害或技能前置条件 |
| 129 | 闪电冲击 `HT_BLITZBEAT` | 目标 | 代码核验；修复目标消失时随行动作报错 |
| 130 | 探测 `HT_DETECTING` | 地面 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 131 | 弹簧陷阱 `HT_SPRINGTRAP` | 陷阱 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 147 | 制作箭矢 `AC_MAKINGARROW` | 自身 | 代码核验；服务端材料列表、三端选择入口及制作封包 |
| 148 | 箭矢击退 `AC_CHARGEARROW` | 目标 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 380 | 狙杀瞄准 `SN_SIGHT` | 自身 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 381 | 猎鹰突击 `SN_FALCONASSAULT` | 目标 | 代码核验；修复目标消失时随行动作报错 |
| 382 | 集中射击 `SN_SHARPSHOOTING` | 目标 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 383 | 风之步 `SN_WINDWALK` | 自身 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 499 | 野兽扫射 `HT_POWER` | 目标 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 1009 | 幻影之箭 `HT_PHANTASMIC` | 目标 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 2233 | 箭雨风暴 `RA_ARROWSTORM` | 目标 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 2234 | 恐惧微风 `RA_FEARBREEZE` | 自身 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 2235 | 主力游侠 `RA_RANGERMAIN` | 被动 | 代码核验；服务端属性／伤害或技能前置条件 |
| 2236 | 瞄准射击 `RA_AIMEDBOLT` | 目标 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 2237 | 引爆器 `RA_DETONATOR` | 地面 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 2238 | 电击陷阱 `RA_ELECTRICSHOCKER` | 地面 | 代码核验；地面单位 Electricshocker |
| 2239 | 集束炸弹 `RA_CLUSTERBOMB` | 地面 | 代码核验；地面单位 Clusterbomb |
| 2240 | 狼群精通 `RA_WUGMASTERY` | 自身 | 代码核验；原技能状态切换、所需道具与随行实体同步 |
| 2241 | 骑乘狼 `RA_WUGRIDER` | 自身 | 代码核验；原技能状态切换、所需道具与随行实体同步 |
| 2242 | 座狼冲刺 `RA_WUGDASH` | 自身 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 2243 | 狼突击 `RA_WUGSTRIKE` | 目标 | 代码核验；修复目标消失时随行动作报错 |
| 2244 | 狼咬 `RA_WUGBITE` | 目标 | 代码核验；修复目标消失时随行动作报错 |
| 2245 | 座狼之牙 `RA_TOOTHOFWUG` | 被动 | 代码核验；服务端属性／伤害或技能前置条件 |
| 2246 | 敏锐嗅觉 `RA_SENSITIVEKEEN` | 自身 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 2247 | 伪装 `RA_CAMOUFLAGE` | 自身 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 2248 | 陷阱研究 `RA_RESEARCHTRAP` | 被动 | 代码核验；服务端属性／伤害或技能前置条件 |
| 2249 | 洋红陷阱 `RA_MAGENTATRAP` | 地面 | 代码核验；地面单位 Magentatrap |
| 2250 | 钴陷阱 `RA_COBALTTRAP` | 地面 | 代码核验；地面单位 Cobalttrap |
| 2251 | 淡黄陷阱 `RA_MAIZETRAP` | 地面 | 代码核验；地面单位 Maizetrap |
| 2252 | 翠绿陷阱 `RA_VERDURETRAP` | 地面 | 代码核验；地面单位 Verduretrap |
| 2253 | 火焰陷阱 `RA_FIRINGTRAP` | 地面 | 代码核验；地面单位 Firingtrap |
| 2254 | 冰封陷阱 `RA_ICEBOUNDTRAP` | 地面 | 代码核验；地面单位 Iceboundtrap |
| 5002 | 无限 `RA_UNLIMIT` | 自身 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 5014 | 全力推进 `ALL_FULL_THROTTLE` | 自身 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 5323 | 高级陷阱 `WH_ADVANCED_TRAP` | 被动 | 代码核验；服务端属性／伤害或技能前置条件 |
| 5324 | 风之符 `WH_WIND_SIGN` | 目标 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 5325 | 亲近自然 `WH_NATUREFRIENDLY` | 被动 | 代码核验；服务端属性／伤害或技能前置条件 |
| 5326 | 猎鹰冲锋 `WH_HAWKRUSH` | 目标 | 代码核验；修复目标消失时随行动作报错 |
| 5327 | 猎鹰精通 `WH_HAWK_M` | 自身 | 代码核验；原技能状态切换、所需道具与随行实体同步 |
| 5328 | 灾厄狂风 `WH_CALAMITYGALE` | 自身 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 5329 | 猎鹰回旋镖 `WH_HAWKBOOMERANG` | 目标 | 代码核验；修复目标消失时随行动作报错 |
| 5330 | 狂风暴雨 `WH_GALESTORM` | 目标 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 5331 | 深度失明陷阱 `WH_DEEPBLINDTRAP` | 地面 | 代码核验；地面单位 Deepblindtrap |
| 5332 | 坚固陷阱 `WH_SOLIDTRAP` | 地面 | 代码核验；地面单位 Solidtrap |
| 5333 | 迅捷陷阱 `WH_SWIFTTRAP` | 地面 | 代码核验；地面单位 Swifttrap |
| 5334 | 成长箭矢 `WH_CRESCIVE_BOLT` | 目标 | 代码核验；技能实现／通用状态及客户端封包路径 |
| 5335 | 火焰陷阱 `WH_FLAMETRAP` | 地面 | 代码核验；地面单位 Flametrap |
| 6520 | 荒野疾行 `WH_WILD_WALK` | 目标 | 代码核验；修复目标消失时随行动作报错 |

## 2. 巫师线

### 范围与依据

完成 Mage、Wizard、High_Wizard、Warlock、Warlock_T、Arch_Mage 的 78 个去重技能代码审查，包含一转、进阶二转、三转、四转及继承技能。其中 6 个为被动，72 个为主动；另核对读取魔法书和元素球、四属性漩涡、四转派生伤害入口。技能名称与 ID 已逐项对照服务端数据库和客户端常量／生成信息。

审查覆盖 `skill_tree.yml`、`skill_db.yml`、`status.yml`、mage／other 技能工厂及对应实现，以及 `skill.cpp` 的施放条件／消耗／地面单位／定时攻击、`status.cpp` 的状态与被动、`battle.cpp` 的减伤和魔法加成。客户端覆盖三端共用技能目标与施放路径、封包处理、技能与地面单位映射、身体状态及球体渲染。

### 修复

- 召唤球更新先清除旧实例，元素球按服务端元素使用火／风／水／地的原生图片，异步资源在渲染器销毁后不再创建纹理。
- 白色监狱由身体状态驱动，重新进入视野恢复显示，提前解除立即清理；取消固定技能成功动画造成的残留。
- 雷爆、陨石术、崩裂术与四转区域动画按地面坐标播放；地狱火按成功通知播放，逐目标命中不再重复创建区域主体。
- 补齐彗星、灵魂膨胀、寒冰浓雾、杰克霜冻、吸取生命、元素球释放与四属性漩涡的反馈，以及全花绽放、剧烈震动、星体打击、绯红箭矢、水晶冲击、毁灭飓风的派生 ID 和地面单位入口。
- 火属性四属性漩涡不再伪装成风属性攻击 ID。客户端和服务端应配套更新，封包结构及 `PACKETVER=20211103` 不变。
- 吸取生命保留宽位伤害，计算百分比后钳制回血值；能量外套的 SP 比例与消耗使用宽位计算，修复高数值溢出，保持原有档位与舍入规则。
- 首本魔法书也校验保存点数容量；释放失败不再删除已保存法术和点数，无保存法术时返回失败提示。

### 验证与限制

- 客户端 45 项定向测试通过：真实效果路由方法、身体状态生命周期、召唤球快照／元素纹理／异步清理、四转映射、技能目标和施放路径。
- 服务端 4 组回归执行生产代码，覆盖高伤害吸血、SP 档位与溢出、首本／后续魔法书容量及释放事务、火属性四属性漩涡封包字段；均通过未定义行为检测。
- 资源、完整 PWA、服务端编译与 Gateway 产物验证见本节末尾的最终验证记录。
- 原 FourthJobEffects 骑士旧用例已改为验证当前“武器数量驱动轨道、施放动画一次”的契约，不再要求重复状态循环。
- 本次为完整代码审查及定向自动验证，未声称 78 个技能逐一实机战斗、人工听音或官方倍率一致。石化扩散的上游未定抵抗系数保持不变；寒冰浓雾／吸取生命使用已有原生纹理组合，火焰之路复用火焰格渲染器，不声称与官方逐帧一致。

### 逐技能清单

| ID | 技能 | 服务端主要实现 | 核验／处理 |
| --- | --- | --- | --- |
| 9 | 增加SP恢复 `MG_SRECOVERY` | `status.cpp／battle.cpp／skill.cpp` | 核对 SP 恢复公式及高数值钳制 |
| 10 | 火狩 `MG_SIGHT` | `sight.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 11 | 圣灵召唤 `MG_NAPALMBEAT` | `napalmbeat.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 12 | 暗之障壁 `MG_SAFETYWALL` | `safetywall.cpp` | 核对地面单位创建、周期作用、清理与客户端映射 |
| 13 | 灵魂打击 `MG_SOULSTRIKE` | `soulstrike.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 14 | 冰箭术 `MG_COLDBOLT` | `coldbolt.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 15 | 冰冻术 `MG_FROSTDIVER` | `frostdiver.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 16 | 石化术 `MG_STONECURSE` | `stonecurse.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 17 | 火球术 `MG_FIREBALL` | `fireball.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 18 | 火墙术 `MG_FIREWALL` | `firewall.cpp` | 核对地面单位创建、周期作用、清理与客户端映射 |
| 19 | 火箭术 `MG_FIREBOLT` | `firebolt.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 20 | 雷击术 `MG_LIGHTNINGBOLT` | `lightningbolt.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 21 | 雷暴术 `MG_THUNDERSTORM` | `thunderstorm.cpp` | 区域动画仅由坐标通知触发 |
| 157 | Energy Coat `MG_ENERGYCOAT` | `energycoat.cpp` | 修复大 SP 的百分比及消耗溢出，保留减伤档位 |
| 80 | 火柱术 `WZ_FIREPILLAR` | `firepillar.cpp` | 核对地面单位创建、周期作用、清理与客户端映射 |
| 81 | 火狩 `WZ_SIGHTRASHER` | `sightrasher.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 83 | 陨石术 `WZ_METEOR` | `meteorstorm.cpp` | 区域动画仅由各陨石坐标通知触发 |
| 84 | 雷鸣术 `WZ_JUPITEL` | `jupitelthunder.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 85 | 雷鸣风暴 `WZ_VERMILION` | `lordofvermilion.cpp` | 核对地面单位创建、周期作用、清理与客户端映射 |
| 86 | 水球术 `WZ_WATERBALL` | `waterball.cpp` | 核对地面单位创建、周期作用、清理与客户端映射 |
| 87 | 冰墙术 `WZ_ICEWALL` | `icewall.cpp` | 核对地面单位创建、周期作用、清理与客户端映射 |
| 88 | Frost Nova `WZ_FROSTNOVA` | `frostnova.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 89 | Storm Gust `WZ_STORMGUST` | `stormgust.cpp` | 核对地面单位创建、周期作用、清理与客户端映射 |
| 90 | Earth Spike `WZ_EARTHSPIKE` | `earthspike.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 91 | Heaven's Drive `WZ_HEAVENDRIVE` | `heavensdrive.cpp` | 区域地刺仅由坐标通知触发，避免命中阶段缺失坐标 |
| 92 | Quagmire `WZ_QUAGMIRE` | `quagmire.cpp` | 核对地面单位创建、周期作用、清理与客户端映射 |
| 93 | Sense `WZ_ESTIMATION` | `sense.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 1006 | 视线爆破 `WZ_SIGHTBLASTER` | `sightblaster.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 364 | Soul Drain `HW_SOULDRAIN` | `status.cpp／battle.cpp／skill.cpp` | 核对最大 SP 加成及定点魔法击杀恢复 |
| 365 | Stave Crasher `HW_MAGICCRASHER` | `WeaponSkillImpl` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 366 | Mystical Amplification `HW_MAGICPOWER` | `StatusSkillImpl` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 400 | 凝固汽油火神炮 `HW_NAPALMVULCAN` | `napalmvulcan.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 483 | 岩碎术 `HW_GANBANTEIN` | `ganbantein.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 484 | 重力场 `HW_GRAVITATION` | `gravitationfield.cpp` | 核对地面单位创建、周期作用、清理与客户端映射 |
| 2201 | 白色监禁 `WL_WHITEIMPRISON` | `whiteimprison.cpp` | 核对自身／敌人及 Boss 限制，视觉改由身体状态创建和解除 |
| 2202 | 灵魂扩张 `WL_SOULEXPANSION` | `soulexpansion.cpp` | 补齐施法与目标命中特效 |
| 2203 | 冰霜迷雾 `WL_FROSTMISTY` | `frostymisty.cpp` | 核对隔墙状态与伤害区分，补齐地面雾效 |
| 2204 | 杰克霜冻 `WL_JACKFROST` | `jackfrost.cpp` | 核对霜冻增伤条件，补齐命中冰效 |
| 2205 | Marsh of Abyss `WL_MARSHOFABYSS` | `StatusSkillImpl` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 2206 | Recognized Spell `WL_RECOGNIZEDSPELL` | `StatusSkillImpl` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 2207 | Sienna Execrate `WL_SIENNAEXECRATE` | `siennaexecrate.cpp` | 核对主目标成功后扩散与失败通知；上游未定抵抗系数保留 |
| 2208 | Radius `WL_RADIUS` | `status.cpp／battle.cpp／skill.cpp` | 核对射程标记与固定咏唱减免 |
| 2209 | Stasis `WL_STASIS` | `stasis.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 2210 | Drain Life `WL_DRAINLIFE` | `drainlife.cpp` | 修复伤害窄化及回血比例溢出，补齐命中反馈 |
| 2211 | Crimson Rock `WL_CRIMSONROCK` | `crimsonrock.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 2212 | Hell Inferno `WL_HELLINFERNO` | `hellinferno.cpp` | 成功通知播放一次，保留火／暗伤害时序 |
| 2213 | Comet `WL_COMET` | `comet.cpp` | 补齐坐标通知动画，核对地面单位伤害与魔法毒状态 |
| 2214 | Chain Lightning `WL_CHAINLIGHTNING` | `chainlightning.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 2216 | Earth Strain `WL_EARTHSTRAIN` | `earthstrain.cpp` | 核对地面单位创建、周期作用、清理与客户端映射 |
| 2217 | Tetra Vortex `WL_TETRAVORTEX` | `tetravortex.cpp` | 核对四球消耗与派生攻击；保留火属性攻击实际 ID，补齐元素命中动画 |
| 2222 | 召唤火球 `WL_SUMMONFB` | `summonfireball.cpp` | 核对空槽／整组召唤及消耗；修复旧球体残留，按元素选择原生图片 |
| 2223 | 召唤雷球 `WL_SUMMONBL` | `summonlightningball.cpp` | 核对空槽／整组召唤及消耗；修复旧球体残留，按元素选择原生图片 |
| 2224 | 召唤水球 `WL_SUMMONWB` | `summonwaterball.cpp` | 核对空槽／整组召唤及消耗；修复旧球体残留，按元素选择原生图片 |
| 2229 | 召唤石块 `WL_SUMMONSTONE` | `summonstone.cpp` | 核对空槽／整组召唤及消耗；修复旧球体残留，按元素选择原生图片 |
| 2230 | 释放 `WL_RELEASE` | `release.cpp` | 修复施放条件不满足仍删除保存法术；无保存法术返回失败通知 |
| 2231 | 阅读魔法书 `WL_READING_SB` | `status.cpp／battle.cpp／skill.cpp` | 被动由道具读取入口调用；核对未学、满槽与容量失败提示 |
| 2232 | 冻结魔法 `WL_FREEZE_SP` | `status.cpp／battle.cpp／skill.cpp` | 核对保存点数、周期 SP 消耗；修复首本容量校验 |
| 5012 | 强力念力 `WL_TELEKINESIS_INTENSE` | `StatusSkillImpl` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 5014 | 全力推进 `ALL_FULL_THROTTLE` | `StatusSkillImpl` | 核对通用状态实现、属性加成、周期消耗与结束反作用 |
| 5214 | 致命投影 `AG_DEADLY_PROJECTION` | `deadlyprojection.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 5215 | 毁灭飓风 `AG_DESTRUCTIVE_HURRICANE` | `destructivehurricane.cpp` | 补齐 Climax 追加伤害常量 5306 与反馈 |
| 5216 | 水晶之雨 `AG_RAIN_OF_CRYSTAL` | `rainofcrystal.cpp` | 核对地面单位创建、周期作用、清理与客户端映射 |
| 5217 | 神秘幻象 `AG_MYSTERY_ILLUSION` | `mysteryillusion.cpp` | 核对地面单位创建、周期作用、清理与客户端映射 |
| 5218 | 暴烈地震 `AG_VIOLENT_QUAKE` | `violentquake.cpp` | 核对 Climax 分支；补齐地面层与派生地刺／命中动画 |
| 5220 | 灵魂火神击 `AG_SOUL_VC_STRIKE` | `soulvulcanstrike.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 5221 | 地层震颤 `AG_STRANTUM_TREMOR` | `strantumtremor.cpp` | 核对地面单位创建、周期作用、清理与客户端映射 |
| 5222 | 全花绽放 `AG_ALL_BLOOM` | `allbloom.cpp` | 核对 Climax 分支；爆炸与命中使用派生 ID，花园由单位管理 |
| 5225 | Crystal Impact `AG_CRYSTAL_IMPACT` | `crystalimpact.cpp` | 核对 Climax 的增益／伤害分支及二段伤害反馈 |
| 5227 | Tornado Storm `AG_TORNADO_STORM` | `tornadostorm.cpp` | 核对地面单位创建、周期作用、清理与客户端映射 |
| 5228 | Two Hand Staff Mastery `AG_TWOHANDSTAFF` | `status.cpp／battle.cpp／skill.cpp` | 核对双手杖条件、S.MATK 与魔法伤害加成 |
| 5229 | Floral Flare Road `AG_FLORAL_FLARE_ROAD` | `floralflareroad.cpp` | 补齐服务端地面单位映射，使用已有火焰格渲染器 |
| 5230 | Astral Strike `AG_ASTRAL_STRIKE` | `astralstrike.cpp` | 整块陨石仅在地面坐标播放，补齐地面层和持续攻击命中 |
| 5232 | Climax `AG_CLIMAX` | `StatusSkillImpl` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 5233 | Rock Down `AG_ROCK_DOWN` | `rockdown.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 5234 | Storm Cannon `AG_STORM_CANNON` | `stormcannon.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 5235 | Crimson Arrow `AG_CRIMSON_ARROW` | `crimsonarrow.cpp` | 核对直线与溅射分派，补齐派生伤害 ID 的命中反馈 |
| 5237 | Frozen Slash `AG_FROZEN_SLASH` | `frozenslash.cpp` | 核对目标、资源消耗、伤害／状态与客户端反馈 |
| 6516 | Energy Conversion `AG_ENERGY_CONVERSION` | `energyconversion.cpp` | 核对满 SP 失败及 SP 恢复 |

最终验证：55 个 STR、640 张纹理及 2 个音效通过 Gateway 读取校验；修改源码 ESLint、完整 PWA、map-server 与文档站构建通过，Gateway 已提供 `mvazsyos`。服务端仅编译，未重启在线地图服务；本轮没有逐技能实机战斗验收。


## 3. 牧师线

### 范围与依据

完成 Acolyte、Priest、High_Priest、Arch_Bishop、Arch_Bishop_T、Cardinal 的 77 个去重技能代码审查，包含一转、进阶二转、三转、四转、继承技能及双重圣光／Arbitrium 派生入口。77 项客户端常量、生成名称及最高等级与当前服务端数据库全部一致。

核对技能树、目标／资源／武器／队伍条件、技能工厂与独立实现、通用状态实现，以及 skill.cpp／battle.cpp／status.cpp 的被动、状态周期、地面单位、消耗及伤害路径；客户端核对共用目标／封包／状态图标／技能效果和地面单位路径。

### 修复

- 普通治愈术正确识别玩家受益者，恢复配置开启后的治疗职业经验；治愈术及高阶治愈术反射后读取实际受益者的赤月状态。
- 复活术与牺牲祈福按职业等级差计算职业经验，经验乘法先转换为浮点；牺牲祈福仅累计实际复活成功的人数，全部失败不再错误降施法者生命值为 1。
- 群体治疗人数加成、Renovatio 持续恢复、圣树 HP／SP 百分比及不死目标即死概率使用宽整数计算，避免高数值溢出。
- 圣树按地面技能时间计算三秒恢复／五秒显隐周期，不再由目标人数推进共享计数。
- Lauda Agnus／Ramus 概率边界由实际 71%／81%／91% 修正为配置的 70%／80%／90%，四级仍为 100%。
- 圣体降福检查协助者的实时 SP，而非施法者的存档 SP。
- 补齐群体祝福、加速、霸邪、两种净化增益和圣典的受益者效果，Dilectio 的施法／受益者分层效果，以及气流风暴的地面单位和命中效果；修正 Renovatio 音效文件名。

### 验证与限制

- `priest-healing.test.mjs` 执行生产 C++ 方法／表达式，覆盖治疗经验、反射、复活等级差、全失败与部分成功、群体治疗上限、持续恢复、100 个随机取值逐级概率、实时协助者 SP 及不死目标概率；UBSan 通过。
- `epiclesis.test.mjs` 执行生产地面作用分支，验证 1／2／3／5／12 人、中途进入／离开、非玩家／不死目标、HP／SP 上界和赤月反转；模拟外围每目标一秒节流，UBSan 通过。
- 客户端效果路由、四转技能与地面单位 19 项测试通过；31 个 STR、250 个依赖文件经 Gateway 读取验证无缺失。
- 修改源码 ESLint、完整 PWA（mvb0etnr）及 Gateway 检查通过；map-server 与文档站编译通过。未重启在线服务，也未逐技能进行真实浏览器战斗验收。
- 群体祝福／加速／霸邪复用对应基础技能视觉；Renewal 圣殿依赖新状态图标反馈，不误当旧地面无敌领域。部分旧技能特效仍简化，不宣称完整复刻官方动画。
- Dilectio／Mediale 的受益者中心治疗、Silentium 等级规则和部分四转系数保留当前服务端实现；上游 TODO 与官方数值一致性不凭猜测改动。尚未声称逐技能官方数值验收。

### 逐技能清单

| ID | 技能 | 实现 | 核验结果 |
| --- | --- | --- | --- |
| 9 | 增加SP恢复 `MG_SRECOVERY` | `status.cpp／battle.cpp／skill.cpp` | SP 恢复、坐姿及高数值钳制；继承巫师线共用路径 |
| 12 | 暗之障壁 `MG_SAFETYWALL` | `safetywall.cpp` | 蓝矿消耗、格子互斥、近战拦截及单位清理；继承共用路径 |
| 22 | 天使之护 `AL_DP` | `status.cpp／battle.cpp／skill.cpp` | 只对魔物的不死／恶魔伤害减免 |
| 23 | 恶魔克星 `AL_DEMONBANE` | `status.cpp／battle.cpp／skill.cpp` | 不死／恶魔魔物的攻击修炼加成 |
| 24 | 光猎 `AL_RUWACH` | `ruwach.cpp` | 自身侦测状态、周期显隐及周围敌人攻击 |
| 25 | 光之障壁 `AL_PNEUMA` | `pneuma.cpp` | 远程物理拦截、地面互斥与离开范围清理 |
| 26 | 瞬间移动 `AL_TELEPORT` | `teleport.cpp` | 地图／决斗限制、随机或存档点选择、取消封包 |
| 27 | 传送之阵 `AL_WARP` | `warpportal.cpp` | 记忆点、选择菜单、蓝矿消耗与传送门人数／寿命；菜单跳过空地图槽 |
| 28 | 治愈术 `AL_HEAL` | `heal.cpp` | 修复玩家治疗经验及反射后的赤月目标；不死攻击、机甲与狂暴限制 |
| 29 | 敏捷提升 `AL_INCAGI` | `incagi.cpp` | HP／SP 消耗、机甲限制、变不死目标的攻击分支 |
| 30 | 敏捷下降 `AL_DECAGI` | `decagi.cpp` | 敌对目标、成功率、状态覆盖及成功封包 |
| 31 | Aqua Benedicta `AL_HOLYWATER` | `holywater.cpp` | 水域／空瓶、圣水制作与成功／失败反馈 |
| 32 | Signum Crucis `AL_CRUCIS` | `crucis.cpp` | 范围敌人及不死／恶魔状态限制 |
| 33 | Angelus `AL_ANGELUS` | `angelus.cpp` | 自身／同图范围内队伍增益分派 |
| 34 | Blessing `AL_BLESSING` | `blessing.cpp` | 属性增益、不死／恶魔及玩家变不死分支 |
| 35 | Cure `AL_CURE` | `cure.cpp` | 沉默、黑暗、混乱和伤口状态解除及免疫反馈 |
| 54 | 复活术 `ALL_RESURRECTION` | `resurrection.cpp` | 死亡／禁复活／地图限制；修复职业经验及不死即死概率溢出 |
| 65 | 钝器修炼 `PR_MACEMASTERY` | `status.cpp／battle.cpp／skill.cpp` | 钝器攻击与 Renewal 暴击加成的武器限制 |
| 66 | 牺牲祈福 `PR_IMPOSITIO` | `impositiomanus.cpp` | Renewal 自身／队伍状态与攻击增益 |
| 67 | 牺牲祈福 `PR_SUFFRAGIUM` | `suffragium.cpp` | Renewal 自身／队伍状态、咏唱减免 |
| 68 | 圣水洗礼 `PR_ASPERSIO` | `aspersio.cpp` | 圣水消耗、武器属性及不死目标攻击分支 |
| 69 | 圣体降福 `PR_BENEDICTIO` | `bssacramenti.cpp` | 相邻协助者、圣属性护甲及不死攻击；修复协助者实时 SP 检查 |
| 70 | 光耀之堂 `PR_SANCTUARY` | `sanctuary.cpp` | 地面持续治疗／不死攻击、目标上限与赤月反转 |
| 71 | 缓慢中毒 `PR_SLOWPOISON` | `StatusSkillImpl` | 通用状态入口、缓毒状态与毒状态周期路径 |
| 72 | 状态恢复 `PR_STRECOVERY` | `statusrecovery.cpp` | 身体异常解除、不死致盲与魔物目标重置 |
| 73 | 凯里艾勒松 `PR_KYRIE` | `kyrieeleison.cpp` | 盾容量、攻击次数和状态覆盖 |
| 74 | 赞美诗 `PR_MAGNIFICAT` | `magnificat.cpp` | 同图队伍范围及 SP 恢复状态 |
| 75 | 荣耀 `PR_GLORIA` | `gloria.cpp` | 同图队伍范围及 LUK 增益 |
| 76 | 神圣法典 `PR_LEXDIVINA` | `lexdivina.cpp` | 沉默切换、已沉默友军与延时状态入口 |
| 77 | 退散不死 `PR_TURNUNDEAD` | `turnundead.cpp` | 不死与 Boss 免疫、失败伤害；修复高生命值概率乘法溢出 |
| 78 | 永恒法典 `PR_LEXAETERNA` | `StatusSkillImpl` | 通用状态施加及下一次伤害放大／消耗 |
| 79 | 大驱魔术 `PR_MAGNUS` | `magnusexorcismus.cpp` | 蓝矿、地面周期伤害、不死／恶魔加成及单位效果 |
| 156 | Holy Light `AL_HOLYLIGHT` | `holylight.cpp` | 魔法攻击、灵魂状态伤害与 SP 消耗联动 |
| 361 | Assumptio `HP_ASSUMPTIO` | `assumptio.cpp` | 禁止对魔物施加、通用状态及防御修正 |
| 362 | Basilica `HP_BASILICA` | `basilica.cpp` | Renewal 为自身增益，非旧地面无敌领域；核对新状态图标与攻击加成 |
| 363 | Meditatio `HP_MEDITATIO` | `status.cpp／battle.cpp／skill.cpp` | 最大 SP、自然恢复与治疗加成 |
| 481 | 魔力充能 `HP_MANARECHARGE` | `status.cpp／battle.cpp／skill.cpp` | SP 消耗减免及下限钳制 |
| 1014 | 牺牲祈福 `PR_REDEMPTIO` | `redemptio.cpp` | 同图死者复活、失败目标排除、成功计数及职业经验 |
| 2038 | 朱迪克斯 `AB_JUDEX` | `judex.cpp` | 范围魔法伤害、等级倍率与目标反馈 |
| 2039 | 安琪拉 `AB_ANCILLA` | `ancilla.cpp` | 携带数量上限、SP 百分比及制造物品反馈 |
| 2040 | 阿多拉穆斯 `AB_ADORAMUS` | `adoramus.cpp` | 协助者／蓝矿、圣属性及圣子中性转换、地领格伤害限制 |
| 2041 | 克莱门提亚 `AB_CLEMENTIA` | `crementia.cpp` | 已学祝福与职业等级派生状态等级；补齐群体受益者效果 |
| 2042 | 坎托·坎迪杜斯 `AB_CANTO` | `cantocandidus.cpp` | 已学加速与职业等级派生状态等级；补齐群体受益者效果 |
| 2043 | 群体治愈 `AB_CHEAL` | `coluceoheal.cpp` | 队伍范围、机甲／狂暴限制；修复人数增益溢出 |
| 2044 | 圣灵降临 `AB_EPICLESIS` | `epiclesis.cpp` | 初次复活、周期恢复与显隐；修复多人计时及 HP／SP 乘法溢出 |
| 2045 | 祷告 `AB_PRAEFATIO` | `praefatio.cpp` | 队伍人数参与护盾状态，补齐受益者效果 |
| 2046 | 祈祷 `AB_ORATIO` | `oratio.cpp` | 周围敌人概率减圣抗及施放反馈 |
| 2047 | 羔羊赞歌 `AB_LAUDAAGNUS` | `laudaagnus.cpp` | 清除异常与未感染者增益；修复概率边界并补齐增益效果 |
| 2048 | 枝条赞歌 `AB_LAUDARAMUS` | `laudaramus.cpp` | 清除异常与未感染者增益；修复概率边界并补齐增益效果 |
| 2050 | 新生 `AB_RENOVATIO` | `renovatio.cpp` | 队伍状态、五秒恢复及赤月；修复高生命值溢出与音效路径 |
| 2051 | 高级治愈 `AB_HIGHNESSHEAL` | `highnessheal.cpp` | 治疗系数、反射、不死攻击；修复反射后的状态目标 |
| 2052 | 清除 `AB_CLEARANCE` | `clearance.cpp` | 队伍／魔物、成功率、免疫、不可清除状态及脚本效果清理 |
| 2053 | 赎罪 `AB_EXPIATIO` | `StatusSkillImpl` | 物理／魔法防御忽略状态，状态图标反馈 |
| 2054 | 双重光 `AB_DUPLELIGHT` | `StatusSkillImpl` | 普通近战双独立触发，核对 MELEE／MAGIC 派生方法与倍率 |
| 2057 | Silentium `AB_SILENTIUM` | `silentium.cpp` | 范围敌人复用沉默分派，不自行猜测上游未定等级规则 |
| 2515 | Secrament `AB_SECRAMENT` | `StatusSkillImpl` | 固定咏唱减免及原生圣典效果 |
| 5011 | 奉献礼 `AB_OFFERTORIUM` | `StatusSkillImpl` | 治疗增益、额外 SP 消耗和异常清理 |
| 5014 | 全力推进 `ALL_FULL_THROTTLE` | `StatusSkillImpl` | 共用属性／恢复、周期消耗及结束副作用，继承前线核验 |
| 5072 | 责骂 `AB_VITUPERATUM` | `vituperatum.cpp` | 蓝矿、范围敌人及天使之怒状态分派 |
| 5073 | 契约 `AB_CONVENIO` | `convenio.cpp` | 队长权限、同图存活队员、拒绝召唤设置与禁传送地图 |
| 5268 | 修复 `CD_REPARATIO` | `reparatio.cpp` | 仅玩家目标、免疫及当前最大生命值恢复 |
| 5269 | 中级祷言 `CD_MEDIALE_VOTUM` | `medialevotum.cpp` | 队伍目标状态、两秒周期及受益者范围治疗调用 |
| 5270 | 钝器书精通 `CD_MACE_BOOK_M` | `status.cpp／battle.cpp／skill.cpp` | 钝器／书的体型加成和主动技能倍率关联 |
| 5271 | 锐利生命 `CD_ARGUTUS_VITA` | `StatusSkillImpl` | 队伍目标、MRES 忽略状态 |
| 5272 | 锐利武器 `CD_ARGUTUS_TELUM` | `StatusSkillImpl` | 队伍目标、RES 忽略状态 |
| 5273 | 裁决 `CD_ARBITRIUM` | `arbitrium.cpp` | 范围魔法倍率和圣属性修炼；同时检查保留的 ATK 派生实现 |
| 5275 | 临在之锋 `CD_PRESENS_ACIES` | `StatusSkillImpl` | 队伍目标及暴击伤害属性增益 |
| 5276 | 忠诚之魂 `CD_FIDUS_ANIMUS` | `status.cpp／battle.cpp／skill.cpp` | 圣魔法属性与四转主动技能的被动加成 |
| 5277 | 释放 `CD_EFFLIGO` | `effligo.cpp` | AP／武器限制、不死／恶魔加成及命中效果 |
| 5278 | 能力 `CD_COMPETENTIA` | `competentia.cpp` | AP 消耗、队伍 HP／SP 恢复及攻击属性增益 |
| 5279 | 气流风暴 `CD_PNEUMATICUS_PROCELLA` | `pneumaticusprocella.cpp` | AP、地面周期和伤害；补齐单位与受击原生效果 |
| 5280 | 恩爱治愈 `CD_DILECTIO_HEAL` | `dilectioheal.cpp` | 队伍受益者中心治疗、施法与受益者分层特效 |
| 5281 | 信仰 `CD_RELIGIO` | `StatusSkillImpl` | STA／WIS／SPL 三项属性状态 |
| 5282 | 祝福 `CD_BENEDICTUM` | `StatusSkillImpl` | POW／CON／CRT 三项属性状态 |
| 5283 | 请求 `CD_PETITIO` | `petitio.cpp` | 钝器／书限制、范围攻击及修炼倍率 |
| 5284 | 框架 `CD_FRAMEN` | `framen.cpp` | 范围魔法、不死／恶魔加成及施放／命中分派 |
| 6518 | Divinus Flos `CD_DIVINUS_FLOS` | `divinusflos.cpp` | 范围魔法、圣子属性转换与原生分层效果 |


## 4. 十字军线

### 范围与依据

完成 Swordman、Crusader、Paladin、Royal_Guard、Royal_Guard_T、Imperial_Guard 的 70 个去重技能代码审查，涵盖一至四转、进阶二转及继承技能。70 项客户端 ID、名称与最高等级均与当前服务端一致。核对技能树和数据库的目标、武器、盾牌、资源、姿态条件，技能工厂、独立方法、通用状态，以及伤害、被动、周期、地面单位、保护继承与反射路径。旧版 Overbrand 派生攻击已非当前主技能调用，不恢复已移除的旧流程。

### 修复

- 守护者之盾容量改用宽整数；超大物理伤害击破屏障后保留实际剩余伤害，避免原始伤害先截断导致减伤过量。保留原有魔法攻击消耗屏障但不吸收魔法伤害的语义。
- 盾牌法术 HP／SP 恢复、灵感周期消耗和舍命攻击 9% 自损使用宽整数，保留原百分比及取整次序。
- 终极牺牲单人施法也将施法者剩余 HP 降至 1，与当前技能说明及组队分支一致；队友不承担施法者的扣血。
- 攻击姿态的状态刷新标记改为 P.ATK／S.MATK／DEF，使开启与结束立即更新对应属性。
- 补齐放逐攻击、烙印、创世之光、大地毁灭和守护者之盾对应原生效果；范围成功动画与每个目标命中动画分离，范围动画固定在施放位置。

### 验证与限制

- `crusader-barrier.test.mjs` 提取生产 C++ 方法验证屏障容量、连续攻击、超 INT_MAX 破盾伤害、魔法伤害语义、资源百分比、单人／组队终极牺牲和反复切换攻击姿态；UBSan 通过。
- 客户端技能通知路由测试及共用四转效果／地面效果测试通过。39 个 STR 和 474 个依赖经 Gateway 读取验证，无缺失。
- 完整 PWA 构建及 Gateway 核验通过（`mvb15a7c`），map-server 构建通过；没有重启在线地图服务。
- 这是完整职业线的代码审查，不是 70 个技能逐个实机战斗验收。部分旧三转动画仍简化；未把未知方向素材全部叠加，也不宣称完整复刻官方动画。四转公式中上游未确认的 POW 系数等保留现有规则，不凭猜测修改。

### 逐技能清单

| ID | 技能 | 实现 | 核验结果 |
| --- | --- | --- | --- |
| 2 | 剑术修炼 `SM_SWORD` | `status.cpp／battle.cpp／skill.cpp` | 短剑／单手剑武器限制及修炼伤害 |
| 3 | 双手剑修炼 `SM_TWOHAND` | `status.cpp／battle.cpp／skill.cpp` | 双手剑修炼伤害及武器限制 |
| 4 | 增加HP恢复 `SM_RECOVERY` | `status.cpp／battle.cpp／skill.cpp` | 自然恢复、生命值比例及恢复量钳制 |
| 5 | 狂击 `SM_BASH` | `SkillBash` | 武器限制、命中修正、伤害及致命攻击联动 |
| 6 | 挑衅 `SM_PROVOKE` | `provoke.cpp` | 目标免疫、成功率、攻击／防御状态 |
| 7 | 怒爆 `SM_MAGNUM` | `magnum.cpp` | 自身范围火属性、击退及攻击状态；沿用已修复固定位置动画 |
| 8 | 钢铁之心 `SM_ENDURE` | `StatusSkillImpl` | 次数／持续时间、地图限制及牺牲保护继承 |
| 22 | 天使之护 `AL_DP` | `status.cpp／battle.cpp／skill.cpp` | 继承服事线：不死／恶魔减伤 |
| 23 | 恶魔克星 `AL_DEMONBANE` | `status.cpp／battle.cpp／skill.cpp` | 继承服事线：不死／恶魔伤害修炼 |
| 28 | 治愈术 `AL_HEAL` | `heal.cpp` | 继承牧师线修复：治疗、反射、不死攻击及经验 |
| 35 | Cure `AL_CURE` | `cure.cpp` | 继承服事线：异常清除及成功反馈 |
| 55 | 矛术修炼 `KN_SPEARMASTERY` | `status.cpp／battle.cpp／skill.cpp` | 长矛限制、骑乘与未骑乘修炼差异 |
| 63 | 骑乘大嘴鸟 `KN_RIDING` | `status.cpp／battle.cpp／skill.cpp` | 继承骑士共用骑乘检查及骑乘管理入口 |
| 64 | 骑兵修炼 `KN_CAVALIERMASTERY` | `status.cpp／battle.cpp／skill.cpp` | 骑乘攻速惩罚及技能等级修正 |
| 144 | 移动 HP 恢复 `SM_MOVINGRECOVERY` | `status.cpp／battle.cpp／skill.cpp` | 行走恢复标记和恢复调度 |
| 145 | 致命一击 `SM_FATALBLOW` | `status.cpp／battle.cpp／skill.cpp` | 狂击命中后的眩晕等级条件 |
| 146 | 自动狂暴 `SM_AUTOBERSERK` | `autoberserk.cpp` | 低生命值触发及自动挑衅清理 |
| 248 | 信仰 `CR_TRUST` | `status.cpp／battle.cpp／skill.cpp` | 最大 HP 及圣属性抗性被动 |
| 249 | 防御 `CR_AUTOGUARD` | `StatusSkillImpl` | 盾牌限制、格挡概率、牺牲保护继承及状态结束 |
| 250 | 惩击 `CR_SHIELDCHARGE` | `smite.cpp` | 盾牌、击退及眩晕附加效果 |
| 251 | 盾牌回旋 `CR_SHIELDBOOMERANG` | `shieldboomerang.cpp` | 盾牌重量／精炼、远程攻击及命中 |
| 252 | 盾牌反射 `CR_REFLECTSHIELD` | `shieldreflect.cpp` | 盾牌、反射伤害限制与保护继承 |
| 253 | 圣十字攻击 `CR_HOLYCROSS` | `holycross.cpp` | 双手矛倍率分支、圣属性及致盲 |
| 254 | 圣十字审判 `CR_GRANDCROSS` | `grandcross.cpp` | 地面布局、施法期间移动限制、伤害及自损 |
| 255 | 舍命攻击 `CR_DEVOTION` | `sacrifice.cpp` | 目标职业／等级／数量、距离断开与防御状态继承 |
| 256 | 灵魂坚韧 `CR_PROVIDENCE` | `resistantsouls.cpp` | 目标职业限制、恶魔／圣属性减伤 |
| 257 | 防御光环 `CR_DEFENDER` | `StatusSkillImpl` | 盾牌、远程物理减伤、攻速及保护继承 |
| 258 | 长枪加速术 `CR_SPEARQUICKEN` | `StatusSkillImpl` | 长矛条件、攻速／暴击／回避状态 |
| 367 | Gloria Domini `PA_PRESSURE` | `gloriadomini.cpp` | 目标魔法伤害与成功反馈 |
| 368 | Martyr's Reckoning `PA_SACRIFICE` | `martyrsreckoning.cpp` | 攻击次数与最大生命值伤害；修复 9% 自损溢出 |
| 369 | Battle Chant `PA_GOSPEL` | `battlechant.cpp` | 领域切换、受益／敌对分派、周期消耗及清理 |
| 480 | 盾牌连击 `PA_SHIELDCHAIN` | `shieldchain.cpp` | 盾牌、五段伤害和命中倍率 |
| 1002 | 缩小 `CR_SHRINK` | `StatusSkillImpl` | 自动防御联动、击退及免疫检查 |
| 2307 | 加农矛 `LG_CANNONSPEAR` | `cannonspear.cpp` | 长矛、范围伤害和暴击倍率；现有效果仍简化 |
| 2308 | 驱逐点 `LG_BANISHINGPOINT` | `banishingpoint.cpp` | 长矛和狂击加成；补齐原生命中效果 |
| 2309 | 踩踏 `LG_TRAMPLE` | `trample.cpp` | 陷阱范围搜索、解除及触发分支 |
| 2310 | 盾牌猛击 `LG_SHIELDPRESS` | `shieldpress.cpp` | 盾牌条件、重量／精炼及伤害 |
| 2311 | 反射伤害减免 `LG_REFLECTDAMAGE` | `StatusSkillImpl` | 当前版本反射减伤、盾牌与周期 SP 消耗 |
| 2312 | 精准攻击 `LG_PINPOINTATTACK` | `pinpointattack.cpp` | 突进位置、地图限制、破坏／异常分支 |
| 2313 | 先锋之力 `LG_FORCEOFVANGUARD` | `forceofvanguard.cpp` | 开关、周期消耗、受击能量球及上限 |
| 2314 | 狂怒爆发 `LG_RAGEBURST` | `rageburst.cpp` | 要求已有能量球，记录并消耗球数后计算伤害 |
| 2315 | 盾牌法术 `LG_SHIELDSPELL` | `shieldspell.cpp` | 盾牌、三级不同状态；修复 HP／SP 周期恢复溢出 |
| 2316 | 超越突破 `LG_EXEEDBREAK` | `StatusSkillImpl` | 武器重量与等级、下次普通攻击及状态消耗 |
| 2317 | 超级烙印 `LG_OVERBRAND` | `overbrand.cpp` | 当前自身范围技能及月斩联动；补齐咏唱／命中效果 |
| 2318 | 威望 `LG_PRESTIGE` | `StatusSkillImpl` | 属性参与魔法回避、盾防御及状态互斥 |
| 2319 | 结盟 `LG_BANDING` | `banding.cpp` | 范围人数、周期 SP、地面状态及清理 |
| 2320 | 月斩 `LG_MOONSLASHER` | `moonslasher.cpp` | 范围攻击、坐下／延迟及烙印准备状态 |
| 2321 | 创世之光 `LG_RAYOFGENESIS` | `rayofgenesis.cpp` | 范围魔法、灵感条件；区域与命中视觉分离 |
| 2322 | 虔诚 `LG_PIETY` | `piety.cpp` | 圣水消耗、受益目标周围队友及护甲圣属性 |
| 2323 | 大地驱动 `LG_EARTHDRIVE` | `earthdrive.cpp` | 盾牌、范围伤害和地面清除；补齐区域／命中效果 |
| 2324 | 赫斯珀洛斯之光 `LG_HESPERUSLIT` | `hesperuslit.cpp` | 当前长矛攻击及等级倍率，不恢复旧人数门槛 |
| 2325 | 灵感 `LG_INSPIRATION` | `StatusSkillImpl` | 异常清理、属性增益及周期自损；修复资源溢出 |
| 5013 | 王者恩典 `LG_KINGS_GRACE` | `kingsgrace.cpp` | 自身／队伍及非对战地图公会目标、周期恢复与离域清理 |
| 5014 | 全力推进 `ALL_FULL_THROTTLE` | `StatusSkillImpl` | 继承共用审查：恢复、属性、消耗及结束副作用 |
| 5255 | 防御姿态 `IG_GUARD_STANCE` | `StatusSkillImpl` | 盾牌、防御／攻击修正及攻击姿态互斥 |
| 5256 | 守护者之盾 `IG_GUARDIAN_SHIELD` | `guardianshield.cpp` | 姿态与 AP、队伍屏障；修复容量／破盾伤害并补齐效果 |
| 5257 | 反弹之盾 `IG_REBOUND_SHIELD` | `StatusSkillImpl` | 防御姿态、牺牲保护转移伤害减免及上限 |
| 5258 | 盾牌修炼 `IG_SHIELD_MASTERY` | `status.cpp／battle.cpp／skill.cpp` | 装备盾牌时 RES 加成及攻击技能修炼关联 |
| 5259 | 矛剑修炼 `IG_SPEAR_SWORD_M` | `status.cpp／battle.cpp／skill.cpp` | 指定剑／矛命中加成及技能修炼关联 |
| 5260 | 攻击姿态 `IG_ATTACK_STANCE` | `StatusSkillImpl` | 防御减益与双攻击增益；修复切换时属性不刷新 |
| 5261 | 终极牺牲 `IG_ULTIMATE_SACRIFICE` | `ultimatesacrifice.cpp` | 姿态、单人／队伍、复活与地图限制；修复单人不扣至 1 HP |
| 5262 | 神圣盾牌 `IG_HOLY_SHIELD` | `StatusSkillImpl` | 盾牌、减伤与圣魔法加成、状态刷新 |
| 5263 | 大审判 `IG_GRAND_JUDGEMENT` | `grandjudgement.cpp` | 长矛／姿态／AP、种族倍率与施法者矛伤状态 |
| 5264 | 审判十字 `IG_JUDGEMENT_CROSS` | `judgementcross.cpp` | AP、魔法倍率、种族与修炼加成 |
| 5265 | 盾牌射击 `IG_SHIELD_SHOOTING` | `shieldshooting.cpp` | 盾牌条件、伤害和自身盾牌力量状态 |
| 5266 | 过度斩击 `IG_OVERSLASH` | `overslash.cpp` | 攻击姿态、范围攻击及修炼加成 |
| 5267 | 十字雨 `IG_CROSS_RAIN` | `crossrain.cpp` | 地面范围／周期／互斥、圣盾倍率与单位清理 |
| 6503 | 光辉长矛 `IG_RADIANT_SPEAR` | `radiantspear.cpp` | 单手矛／攻击姿态、范围伤害与矛伤加成 |
| 6504 | 帝国十字 `IG_IMPERIAL_CROSS` | `imperialcross.cpp` | 攻击姿态、矛伤联动与命中通知 |
| 6505 | 帝国压力 `IG_IMPERIAL_PRESSURE` | `imperialpressure.cpp` | 范围魔法、防御姿态圣属性转换及修炼加成 |

## 5. 刺客线

### 范围与依据

完成 Thief、Thief_High、Assassin、Assassin_Cross、Guillotine_Cross、Guillotine_Cross_T、Shadow_Cross 的 57 个去重技能代码审查。57 项客户端 ID、内部名称和最高等级一致。逐项核对技能工厂及独立实现，并追踪被动双持／拳刃、隐身／侦测、毒药制作与菜单、技能条件与消耗、状态周期、伤害／地面单位及派生攻击路径。

### 修复

- 剧毒首次扣血、普通毒／魔法蘑菇周期伤害及毒素 SP 消耗避免乘法溢出；毒素／失魂恢复、吸血末端不再先将 HP／SP 窄化为有符号整数。
- 武器格挡在命中和未命中两条路径均限定近战物理，不再误触发于远程物理或近距离非物理攻击。
- 涂毒菜单提交时复核存活、技能等级及当前武器；先检查毒药类型再消耗物品，阻止重置、降级、死亡或换装后的旧窗口请求。
- 幻觉行走取消独立方法的重复扣血，数据库统一最大 HP 的 10%，由通用施法结束检查及消耗负责；生命值不足时不先扣 SP。通用 HP 百分比计算使用宽整数并钳制。
- 舞动之刃仅在成功启动时播放启动动画；滚动切割的旋转只作用施法者，不再旋转受击者。补齐十字冲击、反击斩、滚动切割、十字撕裂斩原生效果，范围效果与受击通知分离。

### 验证与限制

- `assassin-poison.test.mjs` 提取生产表达式、涂毒方法和幻觉行走类执行 C++／UBSan 回归：HP／SP 边界、六种攻击类型／距离组合、概率边界、八种毒药选择与失效菜单、满血／半血／生命不足及单次消耗。
- 客户端通知路由与四转效果共 13 项测试通过；18 个 STR 和 280 个依赖经 Gateway 读取验证无缺失。完整 PWA／map-server／文档构建、源码 ESLint 和 changelog 检查通过，Gateway 已核验提供 `mvb1u2ze`。
- 未重启在线服务，也未进行 57 个技能逐个实机战斗验收。毒烟、毒液印记等旧三转效果仍简化；没有以空视觉映射断言服务端技能无效，也没有猜测或叠加所有方向素材。灵魂破坏等公式中的上游未确认注释保留，不声称官方数值完整复刻。

### 逐技能清单

| ID | 技能 | 实现 | 核验结果 |
| --- | --- | --- | --- |
| 48 | `TF_DOUBLE` | `doubleattack.cpp` | 短剑／装备赋予的二连、概率及拳刃副手联动 |
| 49 | `TF_MISS` | `status.cpp／battle.cpp／skill.cpp` | 一转与二转回避加成、移动速度及数值钳制 |
| 50 | `TF_STEAL` | `steal.cpp` | 偷窃目标、物品获取与失败反馈 |
| 51 | `TF_HIDING` | `hiding.cpp` | 状态切换、持续消耗、侦测与攻击限制 |
| 52 | `TF_POISON` | `envenom.cpp` | 物理命中及中毒概率；共用毒周期宽整数修复 |
| 53 | `TF_DETOXIFY` | `detoxify.cpp` | 普通毒及剧毒解除、目标反馈 |
| 132 | `AS_RIGHT` | `status.cpp／battle.cpp／skill.cpp` | 双持主手倍率、武器与职业条件 |
| 133 | `AS_LEFT` | `status.cpp／battle.cpp／skill.cpp` | 双持副手倍率、单独左手武器分支 |
| 134 | `AS_KATAR` | `status.cpp／battle.cpp／skill.cpp` | 拳刃修炼与武器限制 |
| 135 | `AS_CLOAKING` | `cloaking.cpp` | 低等级贴墙条件、切换、SP 与侦测 |
| 136 | `AS_SONICBLOW` | `sonicblow.cpp` | 拳刃、目标半血加成、音速加速命中与眩晕 |
| 137 | `AS_GRIMTOOTH` | `grimtooth.cpp` | 隐藏／拳刃条件、范围伤害和普通魔物减速 |
| 138 | `AS_ENCHANTPOISON` | `enchantpoison.cpp` | 队伍目标、毒属性和失败反馈 |
| 139 | `AS_POISONREACT` | `StatusSkillImpl` | 毒属性格挡与伤害增益阶段、反击次数和状态消耗 |
| 140 | `AS_VENOMDUST` | `venomdust.cpp` | 红矿、地面单位、敌人范围与中毒 |
| 141 | `AS_SPLASHER` | `venomsplasher.cpp` | 状态免疫、延迟爆炸、搜索／伤害范围与二次资源消耗抑制 |
| 149 | `TF_SPRINKLESAND` | `sandattack.cpp` | 倍率及玩家／魔物致盲概率 |
| 150 | `TF_BACKSLIDING` | `backslide.cpp` | 后退方向、移动限制与位置通知 |
| 151 | `TF_PICKSTONE` | `findstone.cpp` | 负重、制造石头、满包反馈及配置掉落 |
| 152 | `TF_THROWSTONE` | `stonefling.cpp` | 石头消耗、固定伤害、先眩晕再致盲 |
| 376 | `ASC_KATAR` | `status.cpp／battle.cpp／skill.cpp` | Renewal 拳刃伤害倍率、非旧版卡片倍率分支 |
| 378 | `ASC_EDP` | `enchantdeadlypoison.cpp` | 毒药、持续时间受新毒研究影响及武器攻击加成 |
| 379 | `ASC_BREAKER` | `souldestroyer.cpp` | Renewal 物理倍率、STR／INT 和等级缩放 |
| 406 | `ASC_METEORASSAULT` | `meteorassault.cpp` | 自身范围攻击、随机异常及成功通知 |
| 407 | `ASC_CDP` | `createdeadlypoison.cpp` | 材料核验、DEX／LUK 制作率与结果反馈 |
| 1003 | `AS_SONICACCEL` | `status.cpp／battle.cpp／skill.cpp` | 音速投掷命中修正的被动入口 |
| 1004 | `AS_VENOMKNIFE` | `throwvenomknife.cpp` | 毒刃弹药消耗、倍率及必中毒状态请求 |
| 2021 | `GC_VENOMIMPRESS` | `StatusSkillImpl` | 目标状态、毒抗下降及结束清理；旧视觉仍简化 |
| 2022 | `GC_CROSSIMPACT` | `crossimpact.cpp` | 目标附近移动检查、失败反馈；补齐命中效果 |
| 2023 | `GC_DARKILLUSION` | `darkillusion.cpp` | 突进及概率追加十字冲击 |
| 2024 | `GC_RESEARCHNEWPOISON` | `status.cpp／battle.cpp／skill.cpp` | 配方等级、产量与毒药持续时间；确认提交时再次校验 |
| 2025 | `GC_CREATENEWPOISON` | `createnewpoison.cpp` | 制作窗口、材料／等级复核、产量与成功率 |
| 2026 | `GC_ANTIDOTE` | `antidote.cpp` | 解毒剂消耗、八种新毒状态清除 |
| 2027 | `GC_POISONINGWEAPON` | `poisoningweapon.cpp` | 毒药选择、伤害附毒与自身增益；修复旧窗口和扣物品顺序 |
| 2028 | `GC_WEAPONBLOCKING` | `StatusSkillImpl` | 周期 SP、概率及反击窗口；修复误格挡远程／非物理 |
| 2029 | `GC_COUNTERSLASH` | `counterslash.cpp` | 反击窗口、AGI／转职前职业等级倍率；补齐范围效果 |
| 2030 | `GC_WEAPONCRUSH` | `weaponcrush.cpp` | 反击条件、脱卸目标装备与失败反馈 |
| 2031 | `GC_VENOMPRESSURE` | `venompressure.cpp` | 涂毒要求、命中／伤害、传毒概率与涂毒状态消耗 |
| 2032 | `GC_POISONSMOKE` | `poisonsmoke.cpp` | 已有涂毒、地面保存毒种与等级、概率施毒；视觉仍简化 |
| 2033 | `GC_CLOAKINGEXCEED` | `cloakingexceed.cpp` | 切换／取消、SP、受击次数、Boss 侦测及允许的破隐技能 |
| 2034 | `GC_PHANTOMMENACE` | `phantommenace.cpp` | 隐藏敌人伤害、暗影形态解除分支与范围通知 |
| 2035 | `GC_HALLUCINATIONWALK` | `hallucinationwalk.cpp` | 修复重复扣 HP；统一最大 HP 的 10%，不足时不先扣 SP |
| 2036 | `GC_ROLLINGCUTTER` | `rollingcutter.cpp` | 拳刃、十层计数及范围伤害；旋转仅作用施法者，补齐范围效果 |
| 2037 | `GC_CROSSRIPPERSLASHER` | `crossripperslasher.cpp` | 拳刃／旋转计数要求、AGI 和计数倍率；补齐命中效果 |
| 5001 | `GC_DARKCROW` | `darkclaw.cpp` | 伤害及未命中也施加的近战易伤 |
| 5014 | `ALL_FULL_THROTTLE` | `status.cpp／battle.cpp／skill.cpp` | 沿用前线共用审查：恢复、属性、周期消耗及副作用 |
| 5285 | `SHC_SHADOW_EXCEED` | `StatusSkillImpl` | AP 消耗、状态与其他四转技能倍率联动 |
| 5286 | `SHC_DANCING_KNIFE` | `dancingknife.cpp` | 短剑、周期范围伤害、换装解除；启动视觉不按命中重复 |
| 5287 | `SHC_SAVAGE_IMPACT` | `savageimpact.cpp` | 拳刃、隐匿额外段数、突进及暗影超越加成 |
| 5288 | `SHC_SHADOW_SENSE` | `status.cpp／battle.cpp／skill.cpp` | 武器类型区分暴击、回避及属性钳制 |
| 5289 | `SHC_ETERNAL_SLASH` | `eternalslash.cpp` | 反击窗口、五层连击、状态续期和伤害段数 |
| 5290 | `SHC_POTENT_VENOM` | `StatusSkillImpl` | 致命毒药前置状态与 RES 穿透 |
| 5291 | `SHC_SHADOW_STAB` | `shadowstab.cpp` | 解除普通／超越隐匿、物理倍率和命中通知 |
| 5292 | `SHC_IMPACT_CRATER` | `impactcrater.cpp` | 自身状态、范围攻击及 POW／等级倍率 |
| 5293 | `SHC_ENCHANTING_SHADOW` | `StatusSkillImpl` | 普通攻击概率产生暗影伤口、计时器与层数清理 |
| 5294 | `SHC_FATAL_SHADOW_CROW` | `fatalshadowcrow.cpp` | AP、突进、范围、种族加成及暗黑之爪等级 |
| 6511 | `SHC_CROSS_SLASH` | `crossslash.cpp` | 范围攻击、暗影超越倍率和自身状态 |

## 6. 铁匠／机匠线

### 范围与依据

已逐项审查 Merchant、Merchant_High、Blacksmith、Whitesmith、Mechanic（含进阶／机甲变体）、Meister（含机甲变体）的 89 个去重技能，以及岩浆喷发 DOT 派生技能。核对技能数据库目标／资源／状态要求、工厂和全部独立主动实现；追踪制造／精炼／维修／属性石菜单、价格、手推车、机甲过热、被动伤害和属性、ABR 召唤／跟随／清理共享逻辑。客户端核对技能选择和制作／维修／精炼回包、三转效果、地面单位、四转施放与命中阶段。

### 明确问题与修复

- 机甲修复按战斗实时最大 HP 计算，避免使用只在基础重算时更新的存档最大 HP。
- 自爆伤害的 SP＋VIT、乘法和等级缩放使用宽整数；手推车终结的重量乘法使用宽整数，合法的自定义容量不再使伤害倍率溢出。
- ABR 的生命及攻击计算使用宽整数，攻击／防御／命中／回避按字段范围钳制；无限型追加生命及攻击也不再回绕，保留现有公式。
- 魔法诱饵先验证所选属性，再扣除一次属性石；修复原有连续两次扣除和非法属性选择先扣材料的问题。
- 斧踏、冲击震荡的整套启动动画只在成功通知播放，保留各目标命中动画，避免范围命中重复叠加。

### 共享路径复核补充

岩浆喷发的地面周期分支在职业／魔物分流之前还无条件计算了一次机匠版本伤害，导致机匠重复命中、魔物混入额外公式。删除分流之前的重复调用，保留两种版本各自一次周期伤害。扩展 `tests/mechanic-resources.test.mjs` 执行实际分支，分别断言职业／魔物的调用次数和技能 ID；修复前断言失败，修复后 UBSan 回归通过。

### 验证与边界

- 生产 C++ 代码提取回归通过 UBSan：五级修复及实时 HP／存档不一致，非机甲／非玩家拒绝；普通／10 亿／UINT_MAX SP 与多等级自爆；普通及极高属性 ABR／无限型；三种手推车容量、空载／半载／满载和十级终结；四种属性石、单颗／多颗、非法属性、缺材料及扣除失败。
- 四组客户端定向测试共 16 项通过，包含两项新增的成功／多目标命中阶段回归。
- Gateway 实际资源读取确认 38 个相关 STR 及 582 个纹理／音效存在，STR 结构可解析。
- 服务端和 `--all` 完整 PWA 构建通过（构建标识 `mvb2izo7`）。未重启地图服务，不将代码回归声称为逐技能真人战斗验收。
- 收购商店官方客户端元数据 MaxLv=2，服务端为 1；客户端升级按钮与可选施放等级使用服务端字段，因此不直接改写官方生成源。
- 保留已有实现限制：攻击装置公式、制造装置成功率和 ABR 属性存在上游自定义／待确认标记；手推车终结专用旧效果仍未实现，部分二转效果只有音效，三种 ABR 召唤没有独立施放 STR 配置。它们不等于服务端技能失效，也不以推测补写官方公式或声称动画完全还原。
- 装备维修也可由道具触发，不能加上必须学会技能的硬性检查；本轮未以旧窗口的存在单独推断可利用问题。

### 逐技能记录

| ID | 技能 | 主要实现 | 核对内容 |
| --- | --- | --- | --- |
| 36 | `MC_INCCARRY` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 最大负重加成与重新计算 |
| 37 | `MC_DISCOUNT` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 购买价格折扣、十级修正与最低售价 |
| 38 | `MC_OVERCHARGE` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 出售加价、十级修正与最低售价 |
| 39 | `MC_PUSHCART` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 安装技能要求、卸下清理、物品同步和移速惩罚 |
| 40 | `MC_IDENTIFY` | `itemappraisal.cpp` | 鉴定列表、物品索引复核及取消 |
| 41 | `MC_VENDING` | `skill_vending.cpp` | 手推车要求、开店状态与物品 ID 保存 |
| 42 | `MC_MAMMONITE` | `mammonite.cpp` | 目标倍率、金币消耗与不公平交易减免 |
| 94 | `BS_IRON` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 配方技能等级、材料、DEX／LUK／职业等级与矿石制作率 |
| 95 | `BS_STEEL` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 配方技能等级、材料、DEX／LUK／职业等级与矿石制作率 |
| 96 | `BS_ENCHANTEDSTONE` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 配方技能等级、材料、DEX／LUK／职业等级与矿石制作率 |
| 97 | `BS_ORIDEOCON` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 高等级武器制作可选成功率加成 |
| 98 | `BS_DAGGER` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 对应武器配方、技能与材料复核、属性石／星角及锻造率 |
| 99 | `BS_SWORD` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 对应武器配方、技能与材料复核、属性石／星角及锻造率 |
| 100 | `BS_TWOHANDSWORD` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 对应武器配方、技能与材料复核、属性石／星角及锻造率 |
| 101 | `BS_AXE` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 对应武器配方、技能与材料复核、属性石／星角及锻造率 |
| 102 | `BS_MACE` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 对应武器配方、技能与材料复核、属性石／星角及锻造率 |
| 103 | `BS_KNUCKLE` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 对应武器配方、技能与材料复核、属性石／星角及锻造率 |
| 104 | `BS_SPEAR` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 对应武器配方、技能与材料复核、属性石／星角及锻造率 |
| 105 | `BS_HILTBINDING` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | STR、攻击与队伍增益时长加成 |
| 106 | `BS_FINDINGORE` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 第一拾取权角色触发矿石组掉落 |
| 107 | `BS_WEAPONRESEARCH` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 武器攻击、命中与锻造成功率 |
| 108 | `BS_REPAIRWEAPON` | `weaponrepair.cpp` | 破损列表、距离、取消与材料；维修道具不要求学习技能 |
| 109 | `BS_SKINTEMPER` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 无属性与火属性抗性 |
| 110 | `BS_HAMMERFALL` | `hammerfall.cpp` | 地面范围、武器条件与眩晕 |
| 111 | `BS_ADRENALINE` | `adrenalinerush.cpp` | 队伍武器筛选、本人及队友不同加成 |
| 112 | `BS_WEAPONPERFECT` | `weaponperfection.cpp` | 队伍增益、体型修正和持续时间 |
| 113 | `BS_OVERTHRUST` | `powerthrust.cpp` | 本人／队友倍率、武器条件及 Renewal 破坏规则 |
| 114 | `BS_MAXIMIZE` | `StatusSkillImpl` | 最大武器攻击、周期 SP 与状态终止 |
| 153 | `MC_CARTREVOLUTION` | `cartrevolution.cpp` | 手推车重量倍率、范围与击退 |
| 154 | `MC_CHANGECART` | `changecart.cpp` | 已有手推车与外观选择 |
| 155 | `MC_LOUD` | `crazyuproar.cpp` | 自身 STR 状态和成功通知 |
| 384 | `WS_MELTDOWN` | `StatusSkillImpl` | 武器／铠甲破坏概率、攻击类型与例外技能 |
| 387 | `WS_CARTBOOST` | `StatusSkillImpl` | 手推车要求、速度及减速互斥 |
| 459 | `BS_ADRENALINE2` | `advancedadrenalinerush.cpp` | 扩大武器范围和队伍增益 |
| 477 | `WS_WEAPONREFINE` | `upgradeweapon.cpp` | 等级／精炼上限、材料、成功率单位与成功／破坏回包 |
| 485 | `WS_CARTTERMINATION` | `carttermination.cpp` | 加速状态、金币和眩晕；修复自定义容量的倍率乘法溢出 |
| 486 | `WS_OVERTHRUSTMAX` | `StatusSkillImpl` | 金币消耗、最高攻击增益与持续时间 |
| 1012 | `BS_UNFAIRLYTRICK` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | Renewal 金钱攻击与手推车终结消耗减免 |
| 1013 | `BS_GREED` | `greed.cpp` | 范围拾取与地图／物品权限 |
| 2255 | `NC_MADOLICENCE` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 机甲职业／技能要求、攻击及机甲移速 |
| 2256 | `NC_BOOSTKNUCKLE` | `boostknuckle.cpp` | 机甲、DEX 倍率及投射／命中阶段 |
| 2257 | `NC_PILEBUNKER` | `pilebunker.cpp` | 机甲／装备要求、命中后解除状态 |
| 2258 | `NC_VULCANARM` | `vulcanarm.cpp` | 子弹消耗、范围与原生动画 |
| 2259 | `NC_FLAMELAUNCHER` | `flamelauncher.cpp` | 工具／燃料、范围配置与火属性命中 |
| 2260 | `NC_COLDSLOWER` | `coldslower.cpp` | 地面范围、燃料／液体弹药及冰冻／结冰 |
| 2261 | `NC_ARMSCANNON` | `armcannon.cpp` | 炮弹属性／燃料、体型倍率与 ABR 双炮加成 |
| 2262 | `NC_ACCELERATION` | `StatusSkillImpl` | 加速器／燃料、机甲专用移速 |
| 2263 | `NC_HOVERING` | `StatusSkillImpl` | 悬浮装置／燃料与状态 |
| 2264 | `NC_F_SIDESLIDE` | `frontsideslide.cpp` | 前进方向、移动限制与位置同步 |
| 2265 | `NC_B_SIDESLIDE` | `backsideslide.cpp` | 后退方向、移动限制与位置同步 |
| 2266 | `NC_MAINFRAME` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | DEF、机甲过热阈值与冷却 |
| 2267 | `NC_SELFDESTRUCTION` | `selfdestruction.cpp` | 卸下机甲、范围、SP 清空及地面单位清理；修复伤害宽整数 |
| 2268 | `NC_SHAPESHIFT` | `StatusSkillImpl` | 四级分别选择属性和对应材料 |
| 2269 | `NC_EMERGENCYCOOL` | `emergencycool.cpp` | 按冷却装置选择降温值 |
| 2270 | `NC_INFRAREDSCAN` | `infraredscan.cpp` | 隐身检测、范围与回避下降 |
| 2271 | `NC_ANALYZE` | `analyze.cpp` | 燃料、目标 DEF/MDEF 下降与通知 |
| 2272 | `NC_MAGNETICFIELD` | `magneticfield.cpp` | 自身与敌人状态、周期 SP 和失效清理 |
| 2273 | `NC_NEUTRALBARRIER` | `neutralbarrier.cpp` | 开关、随身地面单位和状态清理 |
| 2274 | `NC_STEALTHFIELD` | `stealthfield.cpp` | 开关、随身地面单位和状态清理 |
| 2275 | `NC_REPAIR` | `repair.cpp` | 修理材料及目标机甲条件；修复实时最大 HP 取值 |
| 2276 | `NC_TRAININGAXE` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 斧／钝器分别计算命中和伤害 |
| 2277 | `NC_RESEARCHFE` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 火／地属性目标攻击与魔物防御加成 |
| 2278 | `NC_AXEBOOMERANG` | `axeboomerang.cpp` | 斧要求、距离／重量倍率及飞行效果 |
| 2279 | `NC_POWERSWING` | `powerswing.cpp` | 击晕、追加攻击及 ABR 战士段数加成 |
| 2280 | `NC_AXETORNADO` | `axetornado.cpp` | 斧、范围与施放成功动画 |
| 2281 | `NC_SILVERSNIPER` | `fawsilversniper.cpp` | 工具／材料、召唤数量、存活时间和 FAW 属性 |
| 2282 | `NC_MAGICDECOY` | `fawmagicdecoy.cpp` | 四种属性选择、列表与召唤；修复重复扣石及非法选择先扣材料 |
| 2283 | `NC_DISJOINT` | `fawremoval.cpp` | FAW 目标类型、拆除及失败反馈 |
| 2535 | `ALL_BUYING_STORE` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 许可证、开店列表；客户端元数据差异不突破服务端等级 |
| 2544 | `MC_CARTDECORATE` | `decoratecart.cpp` | 手推车要求和装饰选择 |
| 5006 | `NC_MAGMA_ERUPTION` | `magmaeruption.cpp` | 首击、延迟地面单位、DOT 派生技能及单位销毁 |
| 5014 | `ALL_FULL_THROTTLE` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 沿用前线共享恢复／属性／周期消耗与副作用审查 |
| 5295 | `MT_AXE_STOMP` | `axestomp.cpp` | 斧要求、双手斧段数、状态及 POW 倍率；启动动画与每个命中分离 |
| 5296 | `MT_RUSH_QUAKE` | `rushquake.cpp` | AP、突进／击退、种族及自身增益；启动动画与每个命中分离 |
| 5297 | `MT_M_MACHINE` | `manufacturemachine.cpp` | 配方书、制作窗口、材料／技能复核和产量 |
| 5298 | `MT_A_MACHINE` | `attackmachine.cpp` | 等级差限制、周期攻击／强制站立及 POW 倍率 |
| 5299 | `MT_D_MACHINE` | `StatusSkillImpl` | 胶囊、DEF／RES 增益与状态通知 |
| 5300 | `MT_TWOAXEDEF` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 双手斧及按目标体型减伤 |
| 5301 | `MT_ABR_M` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 召唤 HP／攻击／防御／命中／回避；修复实际字段溢出 |
| 5302 | `MT_SUMMON_ABR_BATTLE_WARIOR` | `abrbattlewarior.cpp` | 胶囊／AP、同类数量限制、召唤状态／时长、随行／主人死亡清理及属性钳制 |
| 5303 | `MT_SUMMON_ABR_DUAL_CANNON` | `abrdualcannon.cpp` | 胶囊／AP、同类数量限制、召唤状态／时长、随行／主人死亡清理及属性钳制 |
| 5304 | `MT_SUMMON_ABR_MOTHER_NET` | `abrmothernet.cpp` | 胶囊／AP、同类数量限制、召唤状态／时长、随行／主人死亡清理及属性钳制 |
| 5305 | `MT_SUMMON_ABR_INFINITY` | `abrinfinity.cpp` | 胶囊／AP、同类数量限制、召唤状态／时长、随行／主人死亡清理及属性钳制 |
| 6002 | `MT_SPARK_BLASTER` | `sparkblaster.cpp` | 机甲、范围、等级／POW 及成功动画 |
| 6003 | `MT_TRIPLE_LASER` | `triplelaser.cpp` | 机甲、命中段数与倍率 |
| 6004 | `MT_MIGHTY_SMASH` | `mightysmash.cpp` | 斧、范围、状态加成及成功动画 |
| 6506 | `MT_RUSH_STRIKE` | `rushstrike.cpp` | 双手斧、突进／范围和伤害倍率 |
| 6507 | `MT_POWERFUL_SWING` | `powerfulswing.cpp` | 双手斧、范围／命中、等级倍率 |
| 6508 | `MT_ENERGY_CANNONADE` | `energycannonade.cpp` | 机甲、范围／命中、等级倍率 |

## 7. 贤者／妖术师线

### 范围与依据

已逐项核对 Mage、Mage_High、Sage、Professor、Sorcerer、Sorcerer_T、Elemental_Master 的 93 个去重技能：技能树、数据库目标／资源／状态、工厂与独立实现、被动／战斗／状态／地面单位共享路径；继承法师技能沿用第 2 线审查并复核本线联动。另审查随机技能的 13 个派生技能、五属性元素爆破及元素精灵自身的 57 个技能入口，追踪召唤、模式、行动／跟随、资源消耗、到期与移除清理。客户端核对元数据、自动念咒选择、随机技能下发入口、效果阶段及资源。

### 明确问题与修复

- 精灵恢复与温暖之风使用宽整数计算 HP／SP 百分比，保留火精灵治疗加成和赤月反转。
- 精灵召唤的亲和加成与高级精灵加成使用宽整数；持久化和战斗属性按实际字段范围钳制，低 SP 不再使负攻击转成巨大无符号攻击。
- 元素分析校验窗口模式、施法等级和转换原料方向，拒绝零消耗与超量产出；避免反向兑换、数量回绕及失败前错误扣材料。
- 自动念咒的展示列表和提交共用等级解锁规则，最低触发等级为 1，保留灵魂链接和已学等级限制。
- 修复 29 个精灵辅助技能解除状态时交换主人／精灵状态类型的问题；再次施放可清理双方对应状态，也处理仅一侧仍保留状态的情况。
- 地震术、钻石星尘接入原生效果，精神冲击波持续效果归属地面单位；钻石风暴、大地驱动使用地面坐标，五属性元素爆破启动动画与逐目标命中分离。

### 验证与边界

- 生产 C++ 提取回归通过 UBSan：17 种精灵 × 三种尺寸、普通／高属性和低 SP，精灵恢复、温暖之风五级／加成／治疗反转，四属性双向元素分析与非法模式／原料／产量，自动念咒十级解锁和灵魂链接／已学等级限制。
- 30 个精灵辅助技能实际方法回归覆盖开启、再次关闭、单侧状态残留及非精灵来源，保留无关状态；其中水幕原本正确，作为对照保留。
- 客户端四组定向测试 24 项通过；60 个 STR 和 889 个纹理／音效经 Gateway 读取验证。
- 服务端完整构建通过；完整 PWA 已构建并核对 Gateway 产物 `mvb2zm9s`。未重启地图服务，不将代码回归声称为逐技能真人战斗验收。
- 致盲迷雾数据库 MaxLevel=5，职业技能树和客户端均为 1，正常学习上限一致，未改官方生成源。
- 保留既有实现边界：随机技能中的 Gravity 无实际效果；部分早期精灵效果仍缺独立动画。本次没有按推测补齐官方公式或宣称全部动画已还原。

### 逐技能记录

| ID | 技能 | 主要实现 | 核对内容 |
| --- | --- | --- | --- |
| 9 | `MG_SRECOVERY` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 10 | `MG_SIGHT` | `sight.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 11 | `MG_NAPALMBEAT` | `napalmbeat.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 12 | `MG_SAFETYWALL` | `safetywall.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 13 | `MG_SOULSTRIKE` | `soulstrike.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 14 | `MG_COLDBOLT` | `coldbolt.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 15 | `MG_FROSTDIVER` | `frostdiver.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 16 | `MG_STONECURSE` | `stonecurse.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 17 | `MG_FIREBALL` | `fireball.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 18 | `MG_FIREWALL` | `firewall.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 19 | `MG_FIREBOLT` | `firebolt.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 20 | `MG_LIGHTNINGBOLT` | `lightningbolt.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 21 | `MG_THUNDERSTORM` | `thunderstorm.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 90 | `WZ_EARTHSPIKE` | `earthspike.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 91 | `WZ_HEAVENDRIVE` | `heavensdrive.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 93 | `WZ_ESTIMATION` | `sense.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 157 | `MG_ENERGYCOAT` | `energycoat.cpp` | 继承第 2 线法师共享审查；复核本线自动念咒／魔法拳／精灵联动 |
| 274 | `SA_ADVANCEDBOOK` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 书籍攻击／ASPD 被动 |
| 275 | `SA_CASTCANCEL` | `castcancel.cpp` | 自身施法中断、原技能 SP 与施法状态清理 |
| 276 | `SA_MAGICROD` | `magicrod.cpp` | 吸收窗口、魔法来源与 SP 恢复 |
| 277 | `SA_SPELLBREAKER` | `spellbreaker.cpp` | 目标施法状态、Boss 概率及中断恢复 |
| 278 | `SA_FREECAST` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 施法移动／攻击速度与结束重算 |
| 279 | `SA_AUTOSPELL` | `hindsight.cpp` | 列表与提交共用解锁规则，最低触发等级 1；灵魂链接及已学等级 |
| 280 | `SA_FLAMELAUNCHER` | `endowblaze.cpp` | 属性赋予、目标武器／材料、持续时间及状态 |
| 281 | `SA_FROSTWEAPON` | `endowtsunami.cpp` | 属性赋予、目标武器／材料、持续时间及状态 |
| 282 | `SA_LIGHTNINGLOADER` | `endowtornado.cpp` | 属性赋予、目标武器／材料、持续时间及状态 |
| 283 | `SA_SEISMICWEAPON` | `endowquake.cpp` | 属性赋予、目标武器／材料、持续时间及状态 |
| 284 | `SA_DRAGONOLOGY` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | INT 与龙族伤害／抗性 |
| 285 | `SA_VOLCANO` | `volcano.cpp` | 属性场效果、重放免材料、剩余时间、互斥和移出清理 |
| 286 | `SA_DELUGE` | `deluge.cpp` | 属性场效果、重放免材料、剩余时间、互斥和移出清理 |
| 287 | `SA_VIOLENTGALE` | `whirlwind.cpp` | 属性场效果、重放免材料、剩余时间、互斥和移出清理 |
| 288 | `SA_LANDPROTECTOR` | `magneticearth.cpp` | 地面阻挡、互相消除、忽略技能与退出清理 |
| 289 | `SA_DISPELL` | `dispell.cpp` | 目标／职业／机甲限制、成功率及可清除状态 |
| 290 | `SA_ABRACADABRA` | `hocuspocus.cpp` | 随机数据库、等级限制、临时技能下发与派生目标选择 |
| 373 | `PF_HPCONVERSION` | `indulge.cpp` | 实际生命要求、HP 消耗及 SP 回复 |
| 374 | `PF_SOULCHANGE` | `soulexhale.cpp` | 双方当前 SP、玩家／魔物分支及免疫 |
| 375 | `PF_SOULBURN` | `soulsiphon.cpp` | 概率、失败反噬及当前 SP 伤害 |
| 402 | `PF_MINDBREAKER` | `mindbreaker.cpp` | 目标限制、MDEF／MATK 状态与失败反馈 |
| 403 | `PF_MEMORIZE` | `StatusSkillImpl` | 五次施法计数、变动咏唱与状态清理 |
| 404 | `PF_FOGWALL` | `blindingmist.cpp` | 地面布局、致盲／攻击失败、属性场重叠及移出清理 |
| 405 | `PF_SPIDERWEB` | `fiberlock.cpp` | 地面捕获、三层引用、持续时间与销毁清理 |
| 482 | `PF_DOUBLECASTING` | `StatusSkillImpl` | 概率、三种箭系魔法的追加施放 |
| 1007 | `SA_CREATECON` | `createelementalconverter.cpp` | 制作菜单、材料、四属性配方及生产入口 |
| 1008 | `SA_ELEMENTWATER` | `elementalchangewater.cpp` | 属性转换目标、材料、成功率及对应防御属性 |
| 1017 | `SA_ELEMENTGROUND` | `elementalchangeearth.cpp` | 属性转换目标、材料、成功率及对应防御属性 |
| 1018 | `SA_ELEMENTFIRE` | `elementalchangefire.cpp` | 属性转换目标、材料、成功率及对应防御属性 |
| 1019 | `SA_ELEMENTWIND` | `elementalchangewind.cpp` | 属性转换目标、材料、成功率及对应防御属性 |
| 2443 | `SO_FIREWALK` | `firewalk.cpp` | 步行生成地面单位、最大步数、伤害及状态结束 |
| 2444 | `SO_ELECTRICWALK` | `electricwalk.cpp` | 步行生成地面单位、最大步数、伤害及状态结束 |
| 2445 | `SO_SPELLFIST` | `spellfist.cpp` | 仅中断三种箭系咏唱、次数与普攻触发 |
| 2446 | `SO_EARTHGRAVE` | `earthgrave.cpp` | 地面范围、石化状态、倍率及原生地面／命中动画 |
| 2447 | `SO_DIAMONDDUST` | `diamonddust.cpp` | 地面范围、结晶状态与原生咏唱／地面动画 |
| 2448 | `SO_POISON_BUSTER` | `poisonbuster.cpp` | 毒状态条件、属性倍率与范围 |
| 2449 | `SO_PSYCHIC_WAVE` | `psychicwave.cpp` | 地面伤害周期、精灵属性变换及单位动画清理 |
| 2450 | `SO_CLOUD_KILL` | `cloudkill.cpp` | 区域持续伤害、毒状态、唯一组与删除 |
| 2451 | `SO_STRIKING` | `striking.cpp` | 攻击增益、周期 SP 及终止条件 |
| 2452 | `SO_WARMER` | `warmer.cpp` | 目标限制、地面治疗与火精灵加成；修复高 HP 溢出 |
| 2453 | `SO_VACUUM_EXTREME` | `vacuumextreme.cpp` | 地面坐标、逐目标拉取、免疫及后延迟 |
| 2454 | `SO_VARETYR_SPEAR` | `varetyrspear.cpp` | 物理／魔法倍率、范围及眩晕 |
| 2455 | `SO_ARRULLO` | `arrullo.cpp` | 深睡眠目标与概率 |
| 2456 | `SO_EL_CONTROL` | `spiritcontrol.cpp` | 模式与解除、技能条件及双侧状态清理 |
| 2457 | `SO_SUMMON_AGNI` | `summonfirespiritagni.cpp` | 三级精灵、材料／SP、属性、召唤替换／持续时间和 AI |
| 2458 | `SO_SUMMON_AQUA` | `summonwaterspiritaqua.cpp` | 三级精灵、材料／SP、属性、召唤替换／持续时间和 AI |
| 2459 | `SO_SUMMON_VENTUS` | `summonwindspiritventus.cpp` | 三级精灵、材料／SP、属性、召唤替换／持续时间和 AI |
| 2460 | `SO_SUMMON_TERA` | `summonearthspirittera.cpp` | 三级精灵、材料／SP、属性、召唤替换／持续时间和 AI |
| 2461 | `SO_EL_ACTION` | `elementalaction.cpp` | 精灵存在、距离追踪、消耗与命令攻击 |
| 2462 | `SO_EL_ANALYSIS` | `fourspiritanalysis.cpp` | 两级转换方向、原料与窗口校验、产量边界及失败消耗 |
| 2463 | `SO_EL_SYMPATHY` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | HP／SP 加成及召唤 SP 减免；修复属性回绕 |
| 2464 | `SO_EL_CURE` | `spiritrecovery.cpp` | 消耗主人当前 HP／SP 10% 并恢复精灵；宽整数计算 |
| 2465 | `SO_FIRE_INSIGNIA` | `fireinsignia.cpp` | 等级对应属性增益、周期回复／伤害、地面互斥与移出清理 |
| 2466 | `SO_WATER_INSIGNIA` | `waterinsignia.cpp` | 等级对应属性增益、周期回复／伤害、地面互斥与移出清理 |
| 2467 | `SO_WIND_INSIGNIA` | `windinsignia.cpp` | 等级对应属性增益、周期回复／伤害、地面互斥与移出清理 |
| 2468 | `SO_EARTH_INSIGNIA` | `earthinsignia.cpp` | 等级对应属性增益、周期回复／伤害、地面互斥与移出清理 |
| 5008 | `SO_ELEMENTAL_SHIELD` | `elementalshield.cpp` | 消耗精灵、队伍目标、霸邪／光壁与清理 |
| 5014 | `ALL_FULL_THROTTLE` | `StatusSkillImpl` | 沿用前线共享恢复／属性／周期消耗与副作用审查 |
| 5365 | `EM_MAGIC_BOOK_M` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 书籍要求与五属性魔法增伤 |
| 5366 | `EM_SPELL_ENCHANTING` | `StatusSkillImpl` | 自身 S.MATK 状态、持续时间及刷新 |
| 5367 | `EM_ACTIVITY_BURN` | `activityburn.cpp` | 目标 AP 消耗、成功率与反馈 |
| 5368 | `EM_INCREASING_ACTIVITY` | `increasingactivity.cpp` | 目标 AP 恢复、队伍／自身规则 |
| 5369 | `EM_DIAMOND_STORM` | `diamondstorm.cpp` | 地面范围与倍率；原生效果改由坐标通知播放 |
| 5370 | `EM_LIGHTNING_LAND` | `lightningland.cpp` | 地面周期伤害、单位与状态联动 |
| 5371 | `EM_VENOM_SWAMP` | `venomswamp.cpp` | 地面周期伤害、毒状态与单位清理 |
| 5372 | `EM_CONFLAGRATION` | `conflagration.cpp` | 地面周期伤害、火属性与单位清理 |
| 5373 | `EM_TERRA_DRIVE` | `terradrive.cpp` | 地面范围、倍率及咏唱／地面／命中原生效果 |
| 5374 | `EM_ELEMENTAL_SPIRIT_M` | `skill.cpp／status.cpp／battle.cpp／pc.cpp` | 高级精灵属性加成；字段边界及真实战斗属性转写 |
| 5375 | `EM_SUMMON_ELEMENTAL_ARDOR` | `summonelementalardor.cpp` | 前置精灵／材料、替换、属性与技能模式、维持 SP／跟随／清理 |
| 5376 | `EM_SUMMON_ELEMENTAL_DILUVIO` | `summonelementaldiluvio.cpp` | 前置精灵／材料、替换、属性与技能模式、维持 SP／跟随／清理 |
| 5377 | `EM_SUMMON_ELEMENTAL_PROCELLA` | `summonelementalprocella.cpp` | 前置精灵／材料、替换、属性与技能模式、维持 SP／跟随／清理 |
| 5378 | `EM_SUMMON_ELEMENTAL_TERREMOTUS` | `summonelementalterremotus.cpp` | 前置精灵／材料、替换、属性与技能模式、维持 SP／跟随／清理 |
| 5379 | `EM_SUMMON_ELEMENTAL_SERPENS` | `summonelementalserpens.cpp` | 前置精灵／材料、替换、属性与技能模式、维持 SP／跟随／清理 |
| 5380 | `EM_ELEMENTAL_BUSTER` | `elementalbuster.cpp` | 精灵属性分派、AP、五种派生倍率；启动／命中动画分离 |
| 5381 | `EM_ELEMENTAL_VEIL` | `elementalveil.cpp` | 精灵目标、隐身状态与同步 |
| 6517 | `EM_PSYCHIC_STREAM` | `psychicstream.cpp` | 目标／范围、延迟路径、元素状态倍率与表现 |

## 8. 炼金术师／基因学者线

### 范围与依据

从 Merchant、Merchant_High、Alchemist、Creator、Genetic、Genetic_T、Biolo 提取 71 个去重主技能。继承商人技能沿用第 6 线；逐项核对主技能定义、工厂分派、独立实现、制作／地面／状态共享路径。另核对四属性酸化、疯狂野草、地狱植物、火焰扩张派生路径及全部 58 个生命体技能（包括被动和新增技能）。生命体继续检查召回、复活、保存／加载、技能冷却、亲密度、气球、模式与连招条件。

客户端核对技能 ID／等级、伤害与成功通知、地面单位、状态／召唤实体，以及桌面材料选择和触屏材料菜单。71 个主技能仅通用开店技能 `ALL_BUYING_STORE` 存在此前已记录的显示等级差异；58 个生命体技能的名称、ID 和等级全部对应。

### 明确问题与修复

- 浓缩药水辅助的治疗量、施法增益与 H.Plus 使用宽整数，写回和治疗前钳制，避免高属性或高加成变成负数。
- 仿生植物 HP 与攻击乘法使用宽整数，防御／命中／回避钳制到实际字段范围，地狱树额外属性也不再回绕。
- 生命体召回和复活仅同步原冷却计时器的实际剩余时间，不再把计时器编号当毫秒重启冷却。
- 材料转换在匹配配方前校验真实库存、数量和重复索引；大量产出分批进入背包或沿原规则掉落，避免 16 位数量回绕和循环异常。
- 花岗岩铠甲结束扣血至少保留 1 HP，修复等于扣血量时死亡；连续破碎组合的 HP／SP 消耗用宽整数。召唤军团只补充缺少的数量，不再超过技能上限。
- 桌面材料清单使用独立背包副本，取消不再污染本地数量；共用材料窗口正确传递元素分析两种模式和标题。
- 四属性酸化的持续伤害补齐真实派生技能 ID 和受击效果，不重复播放主技能启动动画。补齐手推车龙卷风、手推车炮、手推车加速、曼陀罗花嚎叫及荆棘墙施放的原生资源。
- 新增生命体攻击接入原生命中资源；The One Fighter Rises 和 Heilige Pferd 按成功通知在施法者播放一次，Goldene Tone 在受益主人播放，避免范围伤害重复叠加。

### 验证与限制

- 32 项客户端测试通过：四属性酸化派生、范围启动／命中分离、地面坐标、生命体效果目标、材料副本与转换模式、四转效果回归。
- 服务端生产 C++ 提取测试通过 UBSan，覆盖治疗／植物数值、冷却同步、材料数量／重复索引／大批量产出、花岗岩铠甲、连续破碎组合及召唤军团数量；完整 map-server 编译成功。
- 63 个 STR、704 个关联资源通过本机 Gateway 读取与结构验证，未发现缺失。客户端 ESLint 通过；完整 PWA 构建和 Gateway 产物校验记录在本次工作产物中。
- 本轮没有重启地图服务，也未逐技能进行真实战斗或人工听音。不能将代码审查／资源可读等同于所有动画与官方完全一致。
- 旧程序式效果仍有缺口：疯狂野草、恶魔火焰及扩张、地狱植物、Silent Breeze、Magma Flow 等旧效果表引用尚未实现；荆棘墙施放已接入，但持续墙体渲染仍有缺口。毒雾、熔岩滑动和火山灰有一次性地面动画，不能据此宣称完整持续阶段。以上均记录为表现限制，不以无关技能动画替代。
- 服务端仿生植物属性、部分生命体新技能倍率和仿生制药成功率仍有上游未知公式／暂定实现；不凭猜测更改平衡数值。

### 主技能逐项记录

| ID | 技能 | 实现入口 | 核验内容 |
| --- | --- | --- | --- |
| 36 | `MC_INCCARRY` | `shared/passive` | 沿用第 6 线的商人继承、物品／手推车与通用窗口审查 |
| 37 | `MC_DISCOUNT` | `shared/passive` | 沿用第 6 线的商人继承、物品／手推车与通用窗口审查 |
| 38 | `MC_OVERCHARGE` | `shared/passive` | 沿用第 6 线的商人继承、物品／手推车与通用窗口审查 |
| 39 | `MC_PUSHCART` | `shared/passive` | 沿用第 6 线的商人继承、物品／手推车与通用窗口审查 |
| 40 | `MC_IDENTIFY` | `itemappraisal.cpp` | 沿用第 6 线的商人继承、物品／手推车与通用窗口审查 |
| 41 | `MC_VENDING` | `skill_vending.cpp` | 沿用第 6 线的商人继承、物品／手推车与通用窗口审查 |
| 42 | `MC_MAMMONITE` | `mammonite.cpp` | 沿用第 6 线的商人继承、物品／手推车与通用窗口审查 |
| 153 | `MC_CARTREVOLUTION` | `cartrevolution.cpp` | 沿用第 6 线的商人继承、物品／手推车与通用窗口审查 |
| 154 | `MC_CHANGECART` | `changecart.cpp` | 沿用第 6 线的商人继承、物品／手推车与通用窗口审查 |
| 155 | `MC_LOUD` | `crazyuproar.cpp` | 沿用第 6 线的商人继承、物品／手推车与通用窗口审查 |
| 226 | `AM_AXEMASTERY` | `shared/passive` | 武器类型、攻击／命中被动加成 |
| 227 | `AM_LEARNINGPOTION` | `shared/passive` | 制作成功率与药水治疗／使用加成 |
| 228 | `AM_PHARMACY` | `preparepotion.cpp` | 制作菜单、配方、材料扣除、数量与成功／失败产出 |
| 229 | `AM_DEMONSTRATION` | `bomb.cpp` | 材料与目标、伤害倍率、破坏装备／地面周期路径 |
| 230 | `AM_ACIDTERROR` | `acidterror.cpp` | 材料与目标、伤害倍率、破坏装备／地面周期路径 |
| 231 | `AM_POTIONPITCHER` | `aidpotion.cpp` | 目标职业／队伍限制、材料、治疗或加速状态 |
| 232 | `AM_CANNIBALIZE` | `summonflora.cpp` | 召唤实体、材料、主人关联、数量与持续时间 |
| 233 | `AM_SPHEREMINE` | `summonmarinesphere.cpp` | 召唤实体、材料、主人关联、数量与持续时间 |
| 234 | `AM_CP_WEAPON` | `alchemicalweapon.cpp` | 对应装备部位保护、材料、目标和状态初始化／解除 |
| 235 | `AM_CP_SHIELD` | `synthesizedshield.cpp` | 对应装备部位保护、材料、目标和状态初始化／解除 |
| 236 | `AM_CP_ARMOR` | `syntheticarmor.cpp` | 对应装备部位保护、材料、目标和状态初始化／解除 |
| 237 | `AM_CP_HELM` | `biochemicalhelm.cpp` | 对应装备部位保护、材料、目标和状态初始化／解除 |
| 238 | `AM_BIOETHICS` | `shared/passive` | 生命体技能前置与允许创建条件 |
| 243 | `AM_CALLHOMUN` | `callhomunculus.cpp` | 生命体创建／休息／复活、材料与状态；修复冷却重复启动 |
| 244 | `AM_REST` | `vaporize.cpp` | 生命体创建／休息／复活、材料与状态；修复冷却重复启动 |
| 247 | `AM_RESURRECTHOMUN` | `homunculusresurrection.cpp` | 生命体创建／休息／复活、材料与状态；修复冷却重复启动 |
| 446 | `AM_BERSERKPITCHER` | `aidberserkpotion.cpp` | 目标职业／队伍限制、材料、治疗或加速状态 |
| 478 | `CR_SLIMPITCHER` | `aidcondensedpotion.cpp` | 范围治疗、受益目标与战场限制；修复高属性和增益溢出 |
| 479 | `CR_FULLPROTECTION` | `fullprotection.cpp` | 对应装备部位保护、材料、目标和状态初始化／解除 |
| 490 | `CR_ACIDDEMONSTRATION` | `aciddemonstration.cpp` | 材料与目标、伤害倍率、破坏装备／地面周期路径 |
| 496 | `AM_TWILIGHT1` | `twilightalchemy1.cpp` | 制作菜单、配方、材料扣除、数量与成功／失败产出 |
| 497 | `AM_TWILIGHT2` | `twilightalchemy2.cpp` | 制作菜单、配方、材料扣除、数量与成功／失败产出 |
| 498 | `AM_TWILIGHT3` | `twilightalchemy3.cpp` | 制作菜单、配方、材料扣除、数量与成功／失败产出 |
| 2474 | `GN_TRAINING_SWORD` | `shared/passive` | 武器类型、攻击／命中被动加成 |
| 2475 | `GN_REMODELING_CART` | `shared/passive` | 车重、伤害／命中加成及手推车状态要求 |
| 2476 | `GN_CART_TORNADO` | `carttornado.cpp` | 手推车、弹药、倍率、范围与命中；补齐原生效果并分离启动／命中 |
| 2477 | `GN_CARTCANNON` | `cartcannon.cpp` | 手推车、弹药、倍率、范围与命中；补齐原生效果并分离启动／命中 |
| 2478 | `GN_CARTBOOST` | `StatusSkillImpl` | 手推车限制、速度状态与一次性增益动画 |
| 2479 | `GN_THORNS_TRAP` | `thorntrap.cpp` | 地面布局、捕获／击退、命中次数、火焰转换与单位清理；补齐荆棘墙施放动画 |
| 2480 | `GN_BLOOD_SUCKER` | `StatusSkillImpl` | 攻击触发概率、武器伤害回血与状态持续时间 |
| 2481 | `GN_SPORE_EXPLOSION` | `sporeexplosion.cpp` | 延时范围伤害、抗性状态与倍率 |
| 2482 | `GN_WALLOFTHORN` | `wallofthorns.cpp` | 地面布局、捕获／击退、命中次数、火焰转换与单位清理；补齐荆棘墙施放动画 |
| 2483 | `GN_CRAZYWEED` | `crazyweed.cpp` | 地面延迟、随机范围、派生伤害与地面单位清除 |
| 2485 | `GN_DEMONIC_FIRE` | `demonicfire.cpp` | 地面周期、五种扩张分支、材料及原单位替换／持续时间 |
| 2486 | `GN_FIRE_EXPANSION` | `fireexpansion.cpp` | 地面周期、五种扩张分支、材料及原单位替换／持续时间 |
| 2490 | `GN_HELLS_PLANT` | `hellsplant.cpp` | 主人状态周期驱动派生伤害、跟随范围与结束清理 |
| 2492 | `GN_MANDRAGORA` | `howlingofmandragora.cpp` | 范围／免疫／重复状态、概率与 SP 扣除；原生施法动画 |
| 2494 | `GN_CHANGEMATERIAL` | `changematerial.cpp` | 配方与库存校验、桌面／触屏材料选择；修复重复索引、超量和产出回绕 |
| 2495 | `GN_MIX_COOKING` | `mixcooking.cpp` | 制作菜单、配方、材料扣除、数量与成功／失败产出 |
| 2497 | `GN_S_PHARMACY` | `specialpharmacy.cpp` | 制作菜单、配方、材料扣除、数量与成功／失败产出 |
| 2535 | `ALL_BUYING_STORE` | `shared/passive` | 沿用第 6 线的商人继承、物品／手推车与通用窗口审查 |
| 2544 | `MC_CARTDECORATE` | `decoratecart.cpp` | 沿用第 6 线的商人继承、物品／手推车与通用窗口审查 |
| 5003 | `GN_ILLUSIONDOPING` | `illusiondoping.cpp` | 范围、命中／幻觉状态与材料 |
| 5014 | `ALL_FULL_THROTTLE` | `shared/passive` | 沿用已审共享恢复、属性、周期消耗与结束副作用 |
| 5336 | `BO_BIONIC_PHARMACY` | `bionicpharmacy.cpp` | 制作菜单、配方、材料扣除、数量与成功／失败产出 |
| 5337 | `BO_BIONICS_M` | `shared/passive` | 召唤属性／主人增益、数量、AI 与持续时间；修复高属性数值回绕 |
| 5338 | `BO_THE_WHOLE_PROTECTION` | `thewholeprotection.cpp` | 对应装备部位保护、材料、目标和状态初始化／解除 |
| 5339 | `BO_ADVANCE_PROTECTION` | `advanceprotection.cpp` | 对应装备部位保护、材料、目标和状态初始化／解除 |
| 5340 | `BO_ACIDIFIED_ZONE_WATER` | `acidifiedzonewater.cpp` | 属性、范围／地面周期、派生伤害；补齐派生 ID 命中特效 |
| 5341 | `BO_ACIDIFIED_ZONE_GROUND` | `acidifiedzoneground.cpp` | 属性、范围／地面周期、派生伤害；补齐派生 ID 命中特效 |
| 5342 | `BO_ACIDIFIED_ZONE_WIND` | `acidifiedzonewind.cpp` | 属性、范围／地面周期、派生伤害；补齐派生 ID 命中特效 |
| 5343 | `BO_ACIDIFIED_ZONE_FIRE` | `acidifiedzonefire.cpp` | 属性、范围／地面周期、派生伤害；补齐派生 ID 命中特效 |
| 5344 | `BO_WOODENWARRIOR` | `woodenwarrior.cpp` | 召唤属性／主人增益、数量、AI 与持续时间；修复高属性数值回绕 |
| 5345 | `BO_WOODEN_FAIRY` | `woodenfairy.cpp` | 召唤属性／主人增益、数量、AI 与持续时间；修复高属性数值回绕 |
| 5346 | `BO_CREEPER` | `creeper.cpp` | 召唤属性／主人增益、数量、AI 与持续时间；修复高属性数值回绕 |
| 5347 | `BO_RESEARCHREPORT` | `StatusSkillImpl` | 研究报告状态、持续时间与攻击倍率联动 |
| 5348 | `BO_HELLTREE` | `helltree.cpp` | 召唤属性／主人增益、数量、AI 与持续时间；修复高属性数值回绕 |
| 6005 | `BO_EXPLOSIVE_POWDER` | `explosivepowder.cpp` | 目标／范围、AP／材料、倍率、状态及四转效果映射 |
| 6006 | `BO_MAYHEMIC_THORNS` | `mayhemicthorns.cpp` | 目标／范围、AP／材料、倍率、状态及四转效果映射 |
| 6509 | `BO_MYSTERY_POWDER` | `mysterypowder.cpp` | 目标／范围、AP／材料、倍率、状态及四转效果映射 |
| 6510 | `BO_DUST_EXPLOSION` | `dustexplosion.cpp` | 目标／范围、AP／材料、倍率、状态及四转效果映射 |

### 生命体逐项范围

下列 58 个技能均核对定义、工厂／被动或状态实现与客户端元数据。主动实现集中在 `src/map/skills/homunculus/`；被动在 `status.cpp`，连招和消耗在 `homunculus.cpp`，地面单位和持续状态在 `skill.cpp`／`status.cpp`。

| ID | 技能 | 类型／核验入口 |
| --- | --- | --- |
| 8001 | `HLIF_HEAL` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8002 | `HLIF_AVOID` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8003 | `HLIF_BRAIN` | 被动：属性计算与技能前置 |
| 8004 | `HLIF_CHANGE` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8005 | `HAMI_CASTLE` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8006 | `HAMI_DEFENCE` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8007 | `HAMI_SKIN` | 被动：属性计算与技能前置 |
| 8008 | `HAMI_BLOODLUST` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8009 | `HFLI_MOON` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8010 | `HFLI_FLEET` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8011 | `HFLI_SPEED` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8012 | `HFLI_SBR44` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8013 | `HVAN_CAPRICE` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8014 | `HVAN_CHAOTIC` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8015 | `HVAN_INSTRUCT` | 被动：属性计算与技能前置 |
| 8016 | `HVAN_EXPLOSION` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8018 | `MH_SUMMON_LEGION` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8019 | `MH_NEEDLE_OF_PARALYZE` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8020 | `MH_POISON_MIST` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8021 | `MH_PAIN_KILLER` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8022 | `MH_LIGHT_OF_REGENE` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8023 | `MH_OVERED_BOOST` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8024 | `MH_ERASER_CUTTER` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8025 | `MH_XENO_SLASHER` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8026 | `MH_SILENT_BREEZE` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8027 | `MH_STYLE_CHANGE` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8028 | `MH_SONIC_CRAW` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8029 | `MH_SILVERVEIN_RUSH` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8030 | `MH_MIDNIGHT_FRENZY` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8031 | `MH_STAHL_HORN` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8032 | `MH_GOLDENE_FERSE` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8033 | `MH_STEINWAND` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8034 | `MH_HEILIGE_STANGE` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8035 | `MH_ANGRIFFS_MODUS` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8036 | `MH_TINDER_BREAKER` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8037 | `MH_CBC` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8038 | `MH_EQC` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8039 | `MH_MAGMA_FLOW` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8040 | `MH_GRANITIC_ARMOR` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8041 | `MH_LAVA_SLIDE` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8042 | `MH_PYROCLASTIC` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8043 | `MH_VOLCANIC_ASH` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8044 | `MH_BLAST_FORGE` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8045 | `MH_TEMPERING` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8046 | `MH_CLASSY_FLUTTER` | 被动：属性计算与技能前置 |
| 8047 | `MH_TWISTER_CUTTER` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8048 | `MH_ABSOLUTE_ZEPHYR` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8049 | `MH_BRUSHUP_CLAW` | 被动：属性计算与技能前置 |
| 8050 | `MH_BLAZING_AND_FURIOUS` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8051 | `MH_THE_ONE_FIGHTER_RISES` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8052 | `MH_POLISHING_NEEDLE` | 被动：属性计算与技能前置 |
| 8053 | `MH_TOXIN_OF_MANDARA` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8054 | `MH_NEEDLE_STINGER` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8055 | `MH_LICHT_GEHORN` | 被动：属性计算与技能前置 |
| 8056 | `MH_GLANZEN_SPIES` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8057 | `MH_HEILIGE_PFERD` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8058 | `MH_GOLDENE_TONE` | 主动：工厂、对应实现与状态／地面／伤害分支 |
| 8059 | `MH_BLAZING_LAVA` | 被动：属性计算与技能前置 |

## 9. 武僧／修罗线

### 范围与依据

从 Acolyte、Acolyte_High、Monk、Champion、Sura、Sura_T、Inquisitor 提取 78 个去重主技能。全部 ID、名称和等级与客户端一致。继承服事路径沿用第 3 线；本线独立实现、状态技能、被动、气弹计时器／消耗、连招开启／结束、延迟攻击、印记和阶段要求逐项核对。另检查新月肘击派生反击及闪光连击三个定时阶段。

客户端检查技能动作、球体／位移／束缚通知、效果配置与运行时 BSON：本机 BSON 未提供这批审判官基础技能的效果映射，因此不能将自动加载视为已有表现。新增显式原生效果使用成功／命中／地面阶段，保持目标与施法者区分。

### 明确问题与修复

- 地狱之门（`SR_GATEOFHELL`）SP 伤害系数原本在整数除法后赋给浮点变量，1–4 级和 6–9 级丢失中间加成。改为宽整数百分比计算，普通施放和连招均保留每级 20% 的增量。
- 拳套箭的延迟击退方向原本使用全局变量，多人交错施放、移动或前一击清空后会互相干扰。方向随各次定时攻击保存，通过攻击入口传递到击退处理；撞墙追加保留不再击退的规则。
- 诅咒圆环目标状态结束原本只在最后一个目标解除时通知客户端。改为每个目标结束都解除束缚表现，施法者消失也能清理；群体释放共用这个路径，不重复通知。
- 旋风腿由受击者逐次旋转改为施法者成功施放时旋转一次。虎炮、狂暴爆破、狮子吼的启动动画与逐目标命中分离；虎炮普通施放和闪光连击共用一次成功通知。
- 补齐大缠崩坠、地狱之门、虎炮、狂暴爆破、狮子吼及审判官信念／印记／阶段攻击等可用原生 STR；雷光弹使用明确地面位置，避免每目标重复播放地面音效。

### 验证与限制

- 服务端生产 C++ 提取回归通过 UBSan：地狱之门十级、普通／连招与极高 SP；两人反向交错施放、移动、撞墙追加；诅咒圆环逐个解除／施法者消失；虎炮普通／连招和逐目标调用。
- 21 项客户端测试通过，覆盖施法者／受击者归属、范围启动不重复、阶段攻击目标、雷光弹地面坐标、一次性效果固定位置及既有四转效果。
- 48 个 STR、663 个关联资源通过 Gateway 读取与结构检查，客户端 ESLint 通过；完整 PWA、map-server 和文档构建在提交前核对。
- 未重启地图服务，没有宣称逐技能真人战斗、人工听音或全部官方效果已还原。部分旧技能仍只有动作／音效／状态图标，本轮不以无关动画代替。
- 保留上游公式的不确定项，包括大缠崩坠等 STR／AGI 系数及新技能未知 POW 系数。Power Velocity 现有实现最多补到五气弹并清空施法者，描述为转移全部；高于五气弹时的产品规则需要单独确认，本轮未据文案擅改上限或消耗。

### 逐技能记录

| ID | 技能 | 主要实现 | 核验内容 |
| --- | --- | --- | --- |
| 22 | `AL_DP` | `shared/passive` | 沿用第 3 线服事继承审查；目标、资源、恢复／增益和通用窗口 |
| 23 | `AL_DEMONBANE` | `shared/passive` | 沿用第 3 线服事继承审查；目标、资源、恢复／增益和通用窗口 |
| 24 | `AL_RUWACH` | `ruwach.cpp` | 沿用第 3 线服事继承审查；目标、资源、恢复／增益和通用窗口 |
| 25 | `AL_PNEUMA` | `pneuma.cpp` | 沿用第 3 线服事继承审查；目标、资源、恢复／增益和通用窗口 |
| 26 | `AL_TELEPORT` | `teleport.cpp` | 沿用第 3 线服事继承审查；目标、资源、恢复／增益和通用窗口 |
| 27 | `AL_WARP` | `warpportal.cpp` | 沿用第 3 线服事继承审查；目标、资源、恢复／增益和通用窗口 |
| 28 | `AL_HEAL` | `heal.cpp` | 沿用第 3 线服事继承审查；目标、资源、恢复／增益和通用窗口 |
| 29 | `AL_INCAGI` | `incagi.cpp` | 沿用第 3 线服事继承审查；目标、资源、恢复／增益和通用窗口 |
| 30 | `AL_DECAGI` | `decagi.cpp` | 沿用第 3 线服事继承审查；目标、资源、恢复／增益和通用窗口 |
| 31 | `AL_HOLYWATER` | `holywater.cpp` | 沿用第 3 线服事继承审查；目标、资源、恢复／增益和通用窗口 |
| 32 | `AL_CRUCIS` | `crucis.cpp` | 沿用第 3 线服事继承审查；目标、资源、恢复／增益和通用窗口 |
| 33 | `AL_ANGELUS` | `angelus.cpp` | 沿用第 3 线服事继承审查；目标、资源、恢复／增益和通用窗口 |
| 34 | `AL_BLESSING` | `blessing.cpp` | 沿用第 3 线服事继承审查；目标、资源、恢复／增益和通用窗口 |
| 35 | `AL_CURE` | `cure.cpp` | 沿用第 3 线服事继承审查；目标、资源、恢复／增益和通用窗口 |
| 156 | `AL_HOLYLIGHT` | `holylight.cpp` | 沿用第 3 线服事继承审查；目标、资源、恢复／增益和通用窗口 |
| 259 | `MO_IRONHAND` | `shared/passive` | 空手／拳套武器类型与攻击被动加成 |
| 260 | `MO_SPIRITSRECOVERY` | `shared/passive` | 坐下 HP／SP 恢复、百分比与恢复字段边界 |
| 261 | `MO_CALLSPIRITS` | `summonspiritsphere.cpp` | 气弹数量／计时器、潜龙升天上限与实体通知 |
| 262 | `MO_ABSORBSPIRITS` | `absorbspiritsphere.cpp` | 自身／敌方气弹与灵符、枪手排除、魔物成功率与 SP 回复 |
| 263 | `MO_TRIPLEATTACK` | `ragingtrifectablow.cpp` | 普攻触发率、倍率、连招目标与后续技能窗口 |
| 264 | `MO_BODYRELOCATION` | `snap.cpp` | 可达位置、位移通知、爆气免气弹与阿修罗冷却 |
| 265 | `MO_DODGE` | `shared/passive` | 回避被动加成与实际字段钳制 |
| 266 | `MO_INVESTIGATE` | `occultimpaction.cpp` | 气弹消耗、真剑百破加成、延迟伤害与状态解除 |
| 267 | `MO_FINGEROFFENSIVE` | `throwspiritsphere.cpp` | 气弹消耗、真剑百破加成、延迟伤害与状态解除 |
| 268 | `MO_STEELBODY` | `StatusSkillImpl` | 减伤、移动／攻击限制、状态初始化与结束 |
| 269 | `MO_BLADESTOP` | `StatusSkillImpl` | 双侧状态关联、攻击触发、Boss 持续时间与双方解除 |
| 270 | `MO_EXPLOSIONSPIRITS` | `StatusSkillImpl` | 暴击增益、自然 SP 恢复限制与灵魂链接例外 |
| 271 | `MO_EXTREMITYFIST` | `asurastrike.cpp` | 爆气／连招／气弹条件、SP 清空、伤害上限及失败移动／消耗 |
| 272 | `MO_CHAINCOMBO` | `ragingquadrupleblow.cpp` | 前置连招、气弹／SP、拳套和点穴加成、技能窗口与追加控制 |
| 273 | `MO_COMBOFINISH` | `ragingthrust.cpp` | 前置连招、气弹／SP、拳套和点穴加成、技能窗口与追加控制 |
| 370 | `CH_PALMSTRIKE` | `ragingpalmstrike.cpp` | 延迟命中、隐匿与击退分支、伤害倍率 |
| 371 | `CH_TIGERFIST` | `glacierfist.cpp` | 前置连招、气弹／SP、拳套和点穴加成、技能窗口与追加控制 |
| 372 | `CH_CHAINCRUSH` | `chaincrushcombo.cpp` | 前置连招、气弹／SP、拳套和点穴加成、技能窗口与追加控制 |
| 401 | `CH_SOULCOLLECT` | `zen.cpp` | 气弹数量／计时器、潜龙升天上限与实体通知 |
| 1015 | `MO_KITRANSLATION` | `kitranslation.cpp` | 队伍／目标职业和气弹上限、成功时手动转移数量 |
| 1016 | `MO_BALKYOUNG` | `kiexplosion.cpp` | 主目标伤害、周边击退／眩晕和范围标记 |
| 2326 | `SR_DRAGONCOMBO` | `dragoncombo.cpp` | 连招目标、追加状态、后续虎炮／地狱之门窗口及倍率 |
| 2327 | `SR_SKYNETBLOW` | `skynetblow.cpp` | 自身范围、逐目标伤害／控制、一次性启动与逐目标命中；旋风腿旋转施法者 |
| 2328 | `SR_EARTHSHAKER` | `earthshaker.cpp` | 隐匿目标倍率、解除、Boss／守护者条件和范围动作 |
| 2329 | `SR_FALLENEMPIRE` | `fallenempire.cpp` | 连招目标、追加状态、后续虎炮／地狱之门窗口及倍率 |
| 2330 | `SR_TIGERCANNON` | `tigercannon.cpp` | HP／SP 比例、连招倍率、范围；普通施放和闪光连击共用一次启动通知 |
| 2332 | `SR_RAMPAGEBLASTER` | `rampageblaster.cpp` | 自身范围、逐目标伤害／控制、一次性启动与逐目标命中；旋风腿旋转施法者 |
| 2333 | `SR_CRESCENTELBOW` | `StatusSkillImpl` | 受击反击概率、上限、派生通知、自损与解除 |
| 2334 | `SR_CURSEDCIRCLE` | `cursedcircle.cpp` | 气弹／目标上限、Boss 排除、双侧状态；修复逐目标解除通知 |
| 2335 | `SR_LIGHTNINGWALK` | `StatusSkillImpl` | 远程非魔法触发、移动位置、方向与消耗状态 |
| 2336 | `SR_KNUCKLEARROW` | `knucklearrow.cpp` | 冲刺、延迟击退与撞墙追加；改为每次施放独立保存方向 |
| 2337 | `SR_WINDMILL` | `windmill.cpp` | 自身范围、逐目标伤害／控制、一次性启动与逐目标命中；旋风腿旋转施法者 |
| 2338 | `SR_RAISINGDRAGON` | `raisingdragon.cpp` | HP／SP 加成、气弹扩容、低 HP 和到期恢复上限 |
| 2340 | `SR_ASSIMILATEPOWER` | `assimilatepower.cpp` | 自身与对战目标、枪手排除、气弹／灵符吸收及百分比 SP 回复 |
| 2341 | `SR_POWERVELOCITY` | `powervelocity.cpp` | 要求气弹、目标数量上限与转移；保留现有规则，文案与高气弹数量语义待另行确认 |
| 2343 | `SR_GATEOFHELL` | `gateofhell.cpp` | 连招条件、额外 HP／SP 伤害；修复逐等级 SP 加成整数截断 |
| 2344 | `SR_GENTLETOUCH_QUIET` | `gentletouchquiet.cpp` | 目标、沉默／净化、战场治疗限制与恢复量 |
| 2345 | `SR_GENTLETOUCH_CURE` | `gentletouchcure.cpp` | 目标、沉默／净化、战场治疗限制与恢复量 |
| 2346 | `SR_GENTLETOUCH_ENERGYGAIN` | `StatusSkillImpl` | 攻击／受击气弹、攻速／生命恢复、点穴互斥与伤害联动 |
| 2347 | `SR_GENTLETOUCH_CHANGE` | `StatusSkillImpl` | 攻击／受击气弹、攻速／生命恢复、点穴互斥与伤害联动 |
| 2348 | `SR_GENTLETOUCH_REVITALIZE` | `StatusSkillImpl` | 攻击／受击气弹、攻速／生命恢复、点穴互斥与伤害联动 |
| 2517 | `SR_HOWLINGOFLION` | `howlingoflion.cpp` | 自身范围、逐目标伤害／控制、一次性启动与逐目标命中；旋风腿旋转施法者 |
| 2518 | `SR_RIDEINLIGHTNING` | `rideinlightening.cpp` | 气弹、地面坐标、多段与范围倍率；地面通知播放一次 |
| 5009 | `SR_FLASHCOMBO` | `flashcombo.cpp` | 三阶段定时器、目标距离／消失、已学等级、动作限制与虎炮联动 |
| 5014 | `ALL_FULL_THROTTLE` | `shared/passive` | 沿用共享恢复、属性增益、周期消耗及结束副作用审查 |
| 5238 | `IQ_POWERFUL_FAITH` | `StatusSkillImpl` | ATK／P.ATK、HP／RES、攻速／命中状态与三种增益互斥 |
| 5239 | `IQ_FIRM_FAITH` | `StatusSkillImpl` | ATK／P.ATK、HP／RES、攻速／命中状态与三种增益互斥 |
| 5240 | `IQ_WILL_OF_FAITH` | `shared/passive` | 拳套要求、不死／恶魔种族攻击与抗性被动 |
| 5241 | `IQ_OLEUM_SANCTUM` | `oleumsanctum.cpp` | 自身范围、圣油／强化状态、POW／种族倍率及启动／命中原生效果 |
| 5242 | `IQ_SINCERE_FAITH` | `StatusSkillImpl` | ATK／P.ATK、HP／RES、攻速／命中状态与三种增益互斥 |
| 5243 | `IQ_MASSIVE_F_BLASTER` | `massiveflameblaster.cpp` | 自身范围、圣油／强化状态、POW／种族倍率及启动／命中原生效果 |
| 5244 | `IQ_EXPOSION_BLASTER` | `explosionblaster.cpp` | 自身范围、圣油／强化状态、POW／种族倍率及启动／命中原生效果 |
| 5245 | `IQ_FIRST_BRAND` | `firstbrand.cpp` | 目标印记、阶段状态前置、更新／互斥和范围；目标启动与命中分离 |
| 5246 | `IQ_FIRST_FAITH_POWER` | `StatusSkillImpl` | 阶段增益互斥、后续技能解锁、气弹免耗联动与启动动画 |
| 5247 | `IQ_JUDGE` | `StatusSkillImpl` | 阶段增益互斥、后续技能解锁、气弹免耗联动与启动动画 |
| 5248 | `IQ_SECOND_FLAME` | `secondflame.cpp` | 目标印记、阶段状态前置、更新／互斥和范围；目标启动与命中分离 |
| 5249 | `IQ_SECOND_FAITH` | `secondfaith.cpp` | 目标印记、阶段状态前置、更新／互斥和范围；目标启动与命中分离 |
| 5250 | `IQ_SECOND_JUDGEMENT` | `secondjudgement.cpp` | 目标印记、阶段状态前置、更新／互斥和范围；目标启动与命中分离 |
| 5251 | `IQ_THIRD_PUNISH` | `thirdpunish.cpp` | 第二印记与阶段条件、气弹补充／多段、HP／POW 倍率、印记结束与范围动画 |
| 5252 | `IQ_THIRD_FLAME_BOMB` | `thirdflamebomb.cpp` | 第二印记与阶段条件、气弹补充／多段、HP／POW 倍率、印记结束与范围动画 |
| 5253 | `IQ_THIRD_CONSECRATION` | `thirdconsecration.cpp` | 第二印记与阶段条件、气弹补充／多段、HP／POW 倍率、印记结束与范围动画 |
| 5254 | `IQ_THIRD_EXOR_FLAME` | `StatusSkillImpl` | 阶段增益互斥、后续技能解锁、气弹免耗联动与启动动画 |
| 6519 | `IQ_BLAZING_FLAME_BLAST` | `blazingflameblast.cpp` | 目标命中、强化状态倍率、AP／POW 与原生效果阶段 |

## 10. 流氓／魅影追踪者线

### 范围与依据

从 Thief、Thief_High、Rogue、Stalker、Shadow_Chaser、Shadow_Chaser_T、Abyss_Chaser 提取 74 项主技能，全部 ID／名称／等级与客户端一致。逐项检查技能定义、工厂分派及 57 个相关实现文件；继承能力结合先前盗贼、剑士、弓箭手路径核对。共享检查包括复制／保持、自动暗影法术列表及提交、脱装保护、禁锢双侧状态、隐匿周期、面具状态、地面陷阱与深渊球生命周期。派生连锁反应射击、来自深渊与深渊火焰也纳入。

### 明确问题与修复

- 近身禁锢的目标结束时错误递减施法者状态的技能等级（val1），而非目标计数（val2），导致第一个目标解除就释放全部目标。改为递减正确计数，最后一个目标结束才解除施法者。
- 暗影形态把敌对判定当布尔值使用，漏掉返回 -1 的非敌对目标；改为仅允许正值，关系失效后停止转伤并清理关联。
- 隐身术高 SP 周期消耗先在 32 位相乘，可能回绕；改为宽整数百分比计算。
- 自动暗影法术选择提交重新检查待选状态、所学等级、存活和交易状态；所有路径先清除等待用的停止状态，取消不弹失败，拒绝失效窗口继续创建增益。
- 深渊匕首启动动画改为成功通知播放一次，不随每个受击者重复。欧米伽深渊打击大范围动画使用选定地面坐标，不逐目标重复；不幸冲击启动效果放在施法者，保留目标命中。

### 验证与限制

- `tests/rogue-state.test.mjs` 执行提取的实际 C++ 选择／解除／消耗路径，覆盖 1–10 级、取消、交易、死亡、重置／复制失效、多个禁锢目标、三种敌对结果和 UINT32_MAX SP，UBSan 通过。
- FourthJobEffects 与 MonkEffectRouting 共 22 项回归通过；深渊追踪者 38 个 STR、592 个贴图依赖均可从 Gateway 获取且结构有效。
- 完整 map-server、PWA（`--all`）和文档构建；未重启服务、未逐技能实战或人工听音。
- 遗留涂鸦系列不是完整可用功能：`RG_FLAGGRAFFITI` 缺专属服务端实现，涂鸦客户端没有完整文字输入／地面显示。本轮记录缺口，不自行发明城旗规则；不能据“已审查”宣称这些技能已补完。
- 部分旧技能只有状态／动作或不完整程序特效；背刺命中率、致命威胁 AGI 与深渊自动触发率仍有上游规则 TODO，未推测修改平衡。

### 逐技能清单

| ID | 技能 | 实现入口 | 核验重点 |
| --- | --- | --- | --- |
| 2 | `SM_SWORD` | `passive` | 沿用剑士／猎人继承路径；武器、射程、箭矢与陷阱目标 |
| 44 | `AC_VULTURE` | `passive` | 沿用剑士／猎人继承路径；武器、射程、箭矢与陷阱目标 |
| 46 | `AC_DOUBLE` | `passive` | 沿用剑士／猎人继承路径；武器、射程、箭矢与陷阱目标 |
| 48 | `TF_DOUBLE` | `doubleattack.cpp` | 沿用刺客线盗贼审查；本次重新核对技能定义与继承入口 |
| 49 | `TF_MISS` | `passive` | 沿用刺客线盗贼审查；本次重新核对技能定义与继承入口 |
| 50 | `TF_STEAL` | `steal.cpp` | 沿用刺客线盗贼审查；本次重新核对技能定义与继承入口 |
| 51 | `TF_HIDING` | `hiding.cpp` | 沿用刺客线盗贼审查；本次重新核对技能定义与继承入口 |
| 52 | `TF_POISON` | `envenom.cpp` | 沿用刺客线盗贼审查；本次重新核对技能定义与继承入口 |
| 53 | `TF_DETOXIFY` | `detoxify.cpp` | 沿用刺客线盗贼审查；本次重新核对技能定义与继承入口 |
| 124 | `HT_REMOVETRAP` | `passive` | 沿用剑士／猎人继承路径；武器、射程、箭矢与陷阱目标 |
| 149 | `TF_SPRINKLESAND` | `sandattack.cpp` | 沿用刺客线盗贼审查；本次重新核对技能定义与继承入口 |
| 150 | `TF_BACKSLIDING` | `backslide.cpp` | 沿用刺客线盗贼审查；本次重新核对技能定义与继承入口 |
| 151 | `TF_PICKSTONE` | `findstone.cpp` | 沿用刺客线盗贼审查；本次重新核对技能定义与继承入口 |
| 152 | `TF_THROWSTONE` | `stonefling.cpp` | 沿用刺客线盗贼审查；本次重新核对技能定义与继承入口 |
| 210 | `RG_SNATCHER` | `passive` | 普通攻击偷窃、商店折扣、同坐人数或隐匿移动的共享被动路径 |
| 211 | `RG_STEALCOIN` | `mug.cpp` | 目标必须为未被抢劫的非免疫魔物；成功率、收益和同步 |
| 212 | `RG_BACKSTAP` | `backstab.cpp` | 贴身位置、刀／弓倍率、方向、隐匿解除与追加眩晕 |
| 213 | `RG_TUNNELDRIVE` | `passive` | 普通攻击偷窃、商店折扣、同坐人数或隐匿移动的共享被动路径 |
| 214 | `RG_RAID` | `sightlessmind.cpp` | 隐匿前置、范围标记、目标状态和施法后解除隐匿 |
| 215 | `RG_STRIPWEAPON` | `divestweapon.cpp` | 脱装概率、时间、装备位置、化学保护／影装保护与失败通知 |
| 216 | `RG_STRIPSHIELD` | `divestshield.cpp` | 脱装概率、时间、装备位置、化学保护／影装保护与失败通知 |
| 217 | `RG_STRIPARMOR` | `divestarmor.cpp` | 脱装概率、时间、装备位置、化学保护／影装保护与失败通知 |
| 218 | `RG_STRIPHELM` | `divesthelm.cpp` | 脱装概率、时间、装备位置、化学保护／影装保护与失败通知 |
| 219 | `RG_INTIMIDATE` | `snatch.cpp` | 延迟带走、目标消失／死亡、地图传送限制和就近空格 |
| 220 | `RG_GRAFFITI` | `scribble.cpp` | 涂鸦地面单位与文字存储、已有涂鸦限制和清理；客户端文字入口／显示仍未完整支持 |
| 221 | `RG_FLAGGRAFFITI` | `passive` | 遗留技能定义存在，但没有服务端专属施放实现；记录限制，不推测城旗涂改规则 |
| 222 | `RG_CLEANER` | `remover.cpp` | 涂鸦地面单位与文字存储、已有涂鸦限制和清理；客户端文字入口／显示仍未完整支持 |
| 223 | `RG_GANGSTER` | `passive` | 普通攻击偷窃、商店折扣、同坐人数或隐匿移动的共享被动路径 |
| 224 | `RG_COMPULSION` | `passive` | 普通攻击偷窃、商店折扣、同坐人数或隐匿移动的共享被动路径 |
| 225 | `RG_PLAGIARISM` | `passive` | 复制资格、状态开关、等级上限、双槽去重、替换和持久化 |
| 389 | `ST_CHASEWALK` | `stealth.cpp` | 关闭免耗、定时 SP、行走／STR 增益及灵魂链接 |
| 390 | `ST_REJECTSWORD` | `counterinstinct.cpp` | 武器类型、反击概率、减伤与反击次数结束 |
| 475 | `ST_PRESERVE` | `StatusSkillImpl` | 复制资格、状态开关、等级上限、双槽去重、替换和持久化 |
| 476 | `ST_FULLSTRIP` | `divestall.cpp` | 脱装概率、时间、装备位置、化学保护／影装保护与失败通知 |
| 1005 | `RG_CLOSECONFINE` | `closeconfine.cpp` | 目标与施法者关联、计数和解除；修复将等级误当目标数递减 |
| 2284 | `SC_FATALMENACE` | `fatalmenace.cpp` | 范围／箭矢、刀额外命中、AGI／等级倍率及命中率 |
| 2285 | `SC_REPRODUCE` | `reproduce.cpp` | 复制资格、状态开关、等级上限、双槽去重、替换和持久化 |
| 2286 | `SC_AUTOSHADOWSPELL` | `autoshadowspell.cpp` | 复制技能列表、取消、交易／死亡／重置失效、触发等级与消费；补选择时校验及状态清理 |
| 2287 | `SC_SHADOWFORM` | `shadowform.cpp` | 双侧关联、距离／地图／死亡、转伤计数；修复非敌对目标判定 |
| 2288 | `SC_TRIANGLESHOT` | `triangleshot.cpp` | 范围／箭矢、刀额外命中、AGI／等级倍率及命中率 |
| 2289 | `SC_BODYPAINT` | `bodypainting.cpp` | 范围显隐、解除状态、盲目和攻速减益 |
| 2290 | `SC_INVISIBILITY` | `invisibility.cpp` | 开关、SP 周期和属性／攻速／暴击；修复大 SP 乘法回绕 |
| 2291 | `SC_DEADLYINFECT` | `StatusSkillImpl` | 双方攻击触发、免疫和可传播状态、剩余计时复制 |
| 2292 | `SC_ENERVATION` | `masqueradeenervation.cpp` | 材料、Boss 排除、状态重复、能力／负重抗性、气弹／随行解除与 SP 等对应效果 |
| 2293 | `SC_GROOMY` | `masqueradegloomy.cpp` | 材料、Boss 排除、状态重复、能力／负重抗性、气弹／随行解除与 SP 等对应效果 |
| 2294 | `SC_IGNORANCE` | `masqueradeignorance.cpp` | 材料、Boss 排除、状态重复、能力／负重抗性、气弹／随行解除与 SP 等对应效果 |
| 2295 | `SC_LAZINESS` | `masqueradelaziness.cpp` | 材料、Boss 排除、状态重复、能力／负重抗性、气弹／随行解除与 SP 等对应效果 |
| 2296 | `SC_UNLUCKY` | `masqueradeunlucky.cpp` | 材料、Boss 排除、状态重复、能力／负重抗性、气弹／随行解除与 SP 等对应效果 |
| 2297 | `SC_WEAKNESS` | `masqueradeweakness.cpp` | 材料、Boss 排除、状态重复、能力／负重抗性、气弹／随行解除与 SP 等对应效果 |
| 2298 | `SC_STRIPACCESSARY` | `stripaccessory.cpp` | 脱装概率、时间、装备位置、化学保护／影装保护与失败通知 |
| 2299 | `SC_MANHOLE` | `manhole.cpp` | 材料、范围／数量、地面触发、地图限制、陷阱目标、状态与单位清理 |
| 2300 | `SC_DIMENSIONDOOR` | `dimensiondoor.cpp` | 材料、范围／数量、地面触发、地图限制、陷阱目标、状态与单位清理 |
| 2301 | `SC_CHAOSPANIC` | `chaospanic.cpp` | 材料、范围／数量、地面触发、地图限制、陷阱目标、状态与单位清理 |
| 2302 | `SC_MAELSTROM` | `maelstrom.cpp` | 材料、范围／数量、地面触发、地图限制、陷阱目标、状态与单位清理 |
| 2303 | `SC_BLOODYLUST` | `bloodylust.cpp` | 材料、范围／数量、地面触发、地图限制、陷阱目标、状态与单位清理 |
| 2304 | `SC_FEINTBOMB` | `feintbomb.cpp` | 地面单位、后退、诱饵／定时爆炸或夹子；失败与材料条件 |
| 5010 | `SC_ESCAPE` | `emergencyescape.cpp` | 地面单位、后退、诱饵／定时爆炸或夹子；失败与材料条件 |
| 5014 | `ALL_FULL_THROTTLE` | `passive` | 沿用共享恢复、属性增益、周期消耗及结束副作用审查 |
| 5311 | `ABC_DAGGER_AND_BOW_M` | `passive` | 武器类型、体型加成数组、双持和魔法修炼 |
| 5312 | `ABC_MAGIC_SWORD_M` | `passive` | 武器类型、体型加成数组、双持和魔法修炼 |
| 5313 | `ABC_STRIP_SHADOW` | `stripshadow.cpp` | 脱装概率、时间、装备位置、化学保护／影装保护与失败通知 |
| 5314 | `ABC_ABYSS_DAGGER` | `abyssdagger.cpp` | 范围伤害与自身增益；启动动画从逐目标命中移至成功通知 |
| 5315 | `ABC_UNLUCKY_RUSH` | `unluckyrush.cpp` | 突进、追加不幸、追击加成；启动效果明确位于施法者 |
| 5316 | `ABC_CHAIN_REACTION_SHOT` | `chainreactionshot.cpp` | 主／派生范围、延迟参数、箭矢与追击倍率 |
| 5317 | `ABC_FROM_THE_ABYSS` | `fromtheabyss.cpp` | 深渊球创建／补充／消耗／结束、普攻派生与自动地面技能联动 |
| 5318 | `ABC_ABYSS_SLAYER` | `StatusSkillImpl` | AP、持续时间、P.ATK／S.MATK 与命中刷新 |
| 5319 | `ABC_ABYSS_STRIKE` | `omegaabyssstrike.cpp` | 地面范围、种族与 SPL 倍率；启动动画固定于选定地面，保留命中特效 |
| 5320 | `ABC_DEFT_STAB` | `deftstab.cpp` | 范围／多段、概率追加、武器／箭矢、AP 与 POW／CON 倍率 |
| 5321 | `ABC_ABYSS_SQUARE` | `abysssquare.cpp` | 地面周期、施法者在范围内时双倍段数、魔法剑联动与实体生命周期 |
| 5322 | `ABC_FRENZY_SHOT` | `frenzyshot.cpp` | 范围／多段、概率追加、武器／箭矢、AP 与 POW／CON 倍率 |
| 6512 | `ABC_HIT_AND_SLIDING` | `hitandsliding.cpp` | 移动位置／失败、追击状态、多段／范围与 AP／属性倍率 |
| 6513 | `ABC_CHASING_BREAK` | `chasingbreak.cpp` | 移动位置／失败、追击状态、多段／范围与 AP／属性倍率 |
| 6514 | `ABC_CHASING_SHOT` | `chasingshot.cpp` | 移动位置／失败、追击状态、多段／范围与 AP／属性倍率 |
| 6515 | `ABC_ABYSS_FLAME` | `abyssflame.cpp` | 自身范围与主目标派生、魔法剑修炼、SPL、通知和独立派生技能 ID |

## 11. 诗人／舞娘双分支

### 范围与依据

包含 Archer、Archer_High、Bard、Dancer、Clown、Gypsy、Minstrel、Wanderer、Minstrel_T、Wanderer_T、Troubadour、Trouvere 的 85 个去重主技能，逐项核对定义、76 个相关实现文件、共享歌曲／搭档／状态逻辑，另覆盖残响旧派生、严重暴雨周期、玫瑰绽放派生和混音自然结束攻击。

客户端有两处命名差异而非封包 ID 错误：服务端 `BA_FROSTJOKER` 对应客户端 `BA_FROSTJOKE`（318），`CG_SPECIALSINGER` 对应生成信息 `SKID_CG_SPECIALSINGER`（5068）。全部技能 ID／等级一致，没有为内部名称差异添加兼容别名。

### 明确问题与修复

- 音乐插曲、爪哇岛小夜曲、普隆德拉进行曲原本单人分支只加状态，不记录最后歌曲、也无成功通知。现在单人和组队共用记录／通知入口，保留各自目标范围和搭档增益，回顾可正确重唱。
- 魔力之歌先给施法者恢复，再通过包含自己的队伍遍历恢复一次，造成组队施法者重复恢复。递归传播跳过已处理的施法者，队员各处理一次。
- 魔力之歌启动恢复和沉睡周期恢复先用宽整数计算百分比，避免高 HP／SP 回绕。
- 命运塔罗牌失败边界由 `>` 改为 `>=`，各等级恢复正确的 8% 增量；恶魔牌诅咒的成功率与技能等级参数原本传反，改为 100% 基础成功率并保留正常状态抗性。
- 本机 BSON 无 TR 技能映射，补齐交响乐、克瓦希尔奏鸣曲、尼夫海姆安魂曲、普隆德拉进行曲与金属狂怒的现有原生 STR，分别接成功／命中阶段，不伪装持续光环。

### 验证与限制

- `tests/bard-song.test.mjs` 提取实际生产方法，验证三种歌曲单人／组队、搭档标志、记录与一次通知；魔力之歌每人一次，塔罗牌 0–99 随机全边界、恶魔诅咒参数，以及高 HP／SP，C++ UBSan 通过。
- 四转资源与阶段 9 项测试通过；42 个 STR、420 个依赖贴图从 Gateway 校验，未发现缺失。
- 完整客户端 `--all`、map-server、文档构建和 Gateway 产物检查。未重启服务、未逐技能多人实战或人工听音。
- 上游仍有若干未定规则（课程加成、部分四转异常成功率、金属狂怒 SPL 等）；未凭猜测更改平衡。旧程序特效和连续舞台表现不代表全部与官方一致；人偶控制仍按现有 8 位属性片段上限，不扩展规则。

### 逐技能清单

| ID | 技能 | 实现入口 | 核验重点 |
| --- | --- | --- | --- |
| 43 | `AC_OWL` | `passive` | 继承弓箭手路径，沿用猎人线；本次核对箭矢、射程与动作入口 |
| 44 | `AC_VULTURE` | `passive` | 继承弓箭手路径，沿用猎人线；本次核对箭矢、射程与动作入口 |
| 45 | `AC_CONCENTRATION` | `concentration.cpp` | 继承弓箭手路径，沿用猎人线；本次核对箭矢、射程与动作入口 |
| 46 | `AC_DOUBLE` | `doublestrafe.cpp` | 继承弓箭手路径，沿用猎人线；本次核对箭矢、射程与动作入口 |
| 47 | `AC_SHOWER` | `arrowshower.cpp` | 继承弓箭手路径，沿用猎人线；本次核对箭矢、射程与动作入口 |
| 147 | `AC_MAKINGARROW` | `makingarrow.cpp` | 继承弓箭手路径，沿用猎人线；本次核对箭矢、射程与动作入口 |
| 148 | `AC_CHARGEARROW` | `chargearrow.cpp` | 继承弓箭手路径，沿用猎人线；本次核对箭矢、射程与动作入口 |
| 304 | `BD_ADAPTATION` | `amp.cpp` | Renewal 增益／重演入口、上次歌曲、已学技能、SP 折扣与施放条件 |
| 305 | `BD_ENCORE` | `encore.cpp` | Renewal 增益／重演入口、上次歌曲、已学技能、SP 折扣与施放条件 |
| 306 | `BD_LULLABY` | `lullaby.cpp` | Renewal 即时范围歌曲、队伍／敌对、搭档与疲劳、状态／额外效果及互斥 |
| 307 | `BD_RICHMANKIM` | `mentalsensing.cpp` | Renewal 即时范围歌曲、队伍／敌对、搭档与疲劳、状态／额外效果及互斥 |
| 308 | `BD_ETERNALCHAOS` | `downtempo.cpp` | Renewal 即时范围歌曲、队伍／敌对、搭档与疲劳、状态／额外效果及互斥 |
| 309 | `BD_DRUMBATTLEFIELD` | `battletheme.cpp` | Renewal 即时范围歌曲、队伍／敌对、搭档与疲劳、状态／额外效果及互斥 |
| 310 | `BD_RINGNIBELUNGEN` | `harmoniclick.cpp` | Renewal 即时范围歌曲、队伍／敌对、搭档与疲劳、状态／额外效果及互斥 |
| 311 | `BD_ROKISWEIL` | `classicalpluck.cpp` | Renewal 即时范围歌曲、队伍／敌对、搭档与疲劳、状态／额外效果及互斥 |
| 312 | `BD_INTOABYSS` | `powerchord.cpp` | Renewal 即时范围歌曲、队伍／敌对、搭档与疲劳、状态／额外效果及互斥 |
| 313 | `BD_SIEGFRIED` | `acousticrhythm.cpp` | Renewal 即时范围歌曲、队伍／敌对、搭档与疲劳、状态／额外效果及互斥 |
| 315 | `BA_MUSICALLESSON` | `passive` | 武器／性别条件、攻击／攻速／SP／恢复／P.ATK 与 S.MATK 被动 |
| 316 | `BA_MUSICALSTRIKE` | `melodystrike.cpp` | 乐器／鞭、箭矢、伤害段数、等级倍率与弹道 |
| 317 | `BA_DISSONANCE` | `unchainedserenade.cpp` | Renewal 即时攻击歌曲与减 SP，范围目标／状态，保留未定属性规则 |
| 318 | `BA_FROSTJOKER` | `unbarringoctave.cpp` | 三秒定时范围、目标队伍概率与持续时间、冰冻／眩晕抗性 |
| 319 | `BA_WHISTLE` | `perfecttablature.cpp` | Renewal 即时歌曲与状态计算／互斥；不将旧地面舞台当必需施放路径 |
| 320 | `BA_ASSASSINCROSS` | `impressiveriff.cpp` | Renewal 即时歌曲与状态计算／互斥；不将旧地面舞台当必需施放路径 |
| 321 | `BA_POEMBRAGI` | `magicstrings.cpp` | Renewal 即时歌曲与状态计算／互斥；不将旧地面舞台当必需施放路径 |
| 322 | `BA_APPLEIDUN` | `songoflutie.cpp` | Renewal 即时歌曲与状态计算／互斥；不将旧地面舞台当必需施放路径 |
| 323 | `DC_DANCINGLESSON` | `passive` | 武器／性别条件、攻击／攻速／SP／恢复／P.ATK 与 S.MATK 被动 |
| 324 | `DC_THROWARROW` | `slingingarrow.cpp` | 乐器／鞭、箭矢、伤害段数、等级倍率与弹道 |
| 325 | `DC_UGLYDANCE` | `hipshaker.cpp` | Renewal 即时攻击歌曲与减 SP，范围目标／状态，保留未定属性规则 |
| 326 | `DC_SCREAM` | `dazzler.cpp` | 三秒定时范围、目标队伍概率与持续时间、冰冻／眩晕抗性 |
| 327 | `DC_HUMMING` | `focusballet.cpp` | Renewal 即时歌曲与状态计算／互斥；不将旧地面舞台当必需施放路径 |
| 328 | `DC_DONTFORGETME` | `slowgrace.cpp` | Renewal 即时歌曲与状态计算／互斥；不将旧地面舞台当必需施放路径 |
| 329 | `DC_FORTUNEKISS` | `ladyluck.cpp` | Renewal 即时歌曲与状态计算／互斥；不将旧地面舞台当必需施放路径 |
| 330 | `DC_SERVICEFORYOU` | `gypsyskiss.cpp` | Renewal 即时歌曲与状态计算／互斥；不将旧地面舞台当必需施放路径 |
| 394 | `CG_ARROWVULCAN` | `vulcanarrow.cpp` | 乐器／鞭、箭矢、伤害段数、等级倍率与弹道 |
| 395 | `CG_MOONLIT` | `shelteringbliss.cpp` | 地面群组、搭档施放、双方关联和群组结束 |
| 396 | `CG_MARIONETTE` | `marionettecontrol.cpp` | 性别／职业／状态限制、双方关联、属性打包与上限、距离和解除 |
| 488 | `CG_HERMODE` | `wandofhermode.cpp` | Renewal 范围歌曲，对非自身友方清除对应增益 |
| 489 | `CG_TAROTCARD` | `tarotcardoffate.cpp` | 十四种牌、成功消费、随机概率与状态参数；修复成功率多 1% 和恶魔诅咒参数顺序 |
| 1010 | `BA_PANGVOICE` | `pangvoice.cpp` | Renewal 玩家／魔物目标、种族、异常与成功通知 |
| 1011 | `DC_WINKCHARM` | `winkofcharm.cpp` | Renewal 玩家／魔物目标、种族、异常与成功通知 |
| 2350 | `WA_SWING_DANCE` | `swingdance.cpp` | 单人／队伍范围、课程等级、状态初始化及能力刷新 |
| 2351 | `WA_SYMPHONY_OF_LOVER` | `symphonyoflovers.cpp` | 单人／队伍范围、课程等级、状态初始化及能力刷新 |
| 2352 | `WA_MOONLIT_SERENADE` | `moonlitserenade.cpp` | 单人／队伍范围、课程等级、状态初始化及能力刷新 |
| 2381 | `MI_RUSH_WINDMILL` | `windmillrushattack.cpp` | 单人／队伍范围、课程等级、状态初始化及能力刷新 |
| 2382 | `MI_ECHOSONG` | `echosong.cpp` | 单人／队伍范围、课程等级、状态初始化及能力刷新 |
| 2383 | `MI_HARMONIZE` | `harmonize.cpp` | 对非自身施放时同步双方状态，属性降低与持续时间 |
| 2412 | `WM_LESSON` | `passive` | 武器／性别条件、攻击／攻速／SP／恢复／P.ATK 与 S.MATK 被动 |
| 2413 | `WM_METALICSOUND` | `metallicsound.cpp` | 魔法倍率、课程／混音联动、箭矢属性／消费及范围派发 |
| 2414 | `WM_REVERBERATION` | `reverberation.cpp` | 魔法倍率、课程／混音联动、箭矢属性／消费及范围派发 |
| 2418 | `WM_SEVERE_RAINSTORM` | `severerainstorm.cpp` | 地面周期、派生物理命中、乐器／鞭倍率与期间装备限制 |
| 2419 | `WM_POEMOFNETHERWORLD` | `poemofthenetherworld.cpp` | 地面目标、免疫／GVG／队伍条件、触发后单位结束 |
| 2420 | `WM_VOICEOFSIREN` | `voiceofsiren.cpp` | 范围魅惑、职业／课程成功率、来源记录与目标关系 |
| 2421 | `WM_DEADHILLHERE` | `valleyofdeath.cpp` | 仅死亡玩家、以 SP 换 HP、复活与资源同步 |
| 2422 | `WM_LULLABY_DEEPSLEEP` | `deepsleeplullaby.cpp` | 成功率、INT／等级减时与周期 HP／SP 恢复；修复百分比回绕 |
| 2423 | `WM_SIRCLEOFNATURE` | `circleofnaturessound.cpp` | 合唱资格、自己先启动／队伍传播、课程增益、互斥和持续时间 |
| 2424 | `WM_RANDOMIZESPELL` | `improvisedsong.cpp` | 成功率与合唱状态清除；保留现行技能规则 |
| 2425 | `WM_GLOOMYDAY` | `gloomyday.cpp` | 目标已学技能分支、特定攻击增益／减益与状态参数 |
| 2426 | `WM_GREAT_ECHO` | `greatecho.cpp` | 地面范围、搭档检索与消费、伤害加成和课程倍率 |
| 2427 | `WM_SONG_OF_MANA` | `songofmana.cpp` | 启动 SP 恢复和队伍传播；施法者只恢复一次，高 SP 使用宽整数 |
| 2428 | `WM_DANCE_WITH_WUG` | `dancewithawarg.cpp` | 合唱资格、自己先启动／队伍传播、课程增益、互斥和持续时间 |
| 2429 | `WM_SOUND_OF_DESTRUCTION` | `soundofdestruction.cpp` | 范围／玩家／敌对、成功率、状态互斥、属性和周期副作用 |
| 2430 | `WM_SATURDAY_NIGHT_FEVER` | `saturdaynightfever.cpp` | 范围／玩家／敌对、成功率、状态互斥、属性和周期副作用 |
| 2431 | `WM_LERADS_DEW` | `leradsdew.cpp` | 合唱资格、自己先启动／队伍传播、课程增益、互斥和持续时间 |
| 2432 | `WM_MELODYOFSINK` | `melodyofsink.cpp` | 范围／玩家／敌对、成功率、状态互斥、属性和周期副作用 |
| 2433 | `WM_BEYOND_OF_WARCRY` | `warcryofbeyond.cpp` | 范围／玩家／敌对、成功率、状态互斥、属性和周期副作用 |
| 2434 | `WM_UNLIMITED_HUMMING_VOICE` | `unlimitedhummingvoice.cpp` | 合唱资格、自己先启动／队伍传播、课程增益、互斥和持续时间 |
| 5007 | `WM_FRIGG_SONG` | `friggssong.cpp` | 单人／队伍、自身覆盖、HP 增益与每秒恢复 |
| 5014 | `ALL_FULL_THROTTLE` | `passive` | 沿用共享恢复、属性增益、周期消耗及结束副作用审查 |
| 5068 | `CG_SPECIALSINGER` | `skilledspecialsinger.cpp` | 仅解除合奏疲劳；客户端名称不同但 ID／等级一致 |
| 5349 | `TR_STAGE_MANNER` | `passive` | 武器／性别条件、攻击／攻速／SP／恢复／P.ATK 与 S.MATK 被动 |
| 5350 | `TR_RETROSPECTION` | `retrospection.cpp` | 已学技能复查、上次歌曲记录、SP 折扣和 AP 联动 |
| 5351 | `TR_MYSTIC_SYMPHONY` | `StatusSkillImpl` | 状态施放、AP、后续攻击／合奏限制联动；补原生启动资源 |
| 5352 | `TR_KVASIR_SONATA` | `StatusSkillImpl` | 状态施放、AP、后续攻击／合奏限制联动；补原生启动资源 |
| 5353 | `TR_ROSEBLOSSOM` | `roseblossom.cpp` | 命中后种子状态、定时派生范围、混音和种族／CON 倍率 |
| 5355 | `TR_RHYTHMSHOOTING` | `rhythmshooting.cpp` | 范围／段数、混音与交响乐、属性倍率、箭矢属性／消费和 AP；补金属狂怒效果 |
| 5356 | `TR_METALIC_FURY` | `metallicfury.cpp` | 范围／段数、混音与交响乐、属性倍率、箭矢属性／消费和 AP；补金属狂怒效果 |
| 5357 | `TR_SOUNDBLEND` | `soundblend.cpp` | 初始攻击与状态、自然结束派生、其他攻击解除和箭矢属性 |
| 5358 | `TR_GEF_NOCTURN` | `geffenianocturn.cpp` | 记录歌曲、异性同队四转搭档、敌方范围及状态／概率；补尼夫海姆原生效果 |
| 5359 | `TR_ROKI_CAPRICCIO` | `rokicapriccio.cpp` | 记录歌曲、异性同队四转搭档、敌方范围及状态／概率；补尼夫海姆原生效果 |
| 5360 | `TR_AIN_RHAPSODY` | `ainrhapsody.cpp` | 记录歌曲、异性同队四转搭档、敌方范围及状态／概率；补尼夫海姆原生效果 |
| 5361 | `TR_MUSICAL_INTERLUDE` | `musicalinterlude.cpp` | 单人／队伍增益和搭档加成；修复单人不记录歌曲／无成功通知，补普隆德拉进行曲效果 |
| 5362 | `TR_JAWAII_SERENADE` | `jawaiiserenade.cpp` | 单人／队伍增益和搭档加成；修复单人不记录歌曲／无成功通知，补普隆德拉进行曲效果 |
| 5363 | `TR_NIPELHEIM_REQUIEM` | `nipelheimrequiem.cpp` | 记录歌曲、异性同队四转搭档、敌方范围及状态／概率；补尼夫海姆原生效果 |
| 5364 | `TR_PRON_MARCH` | `pronmarch.cpp` | 单人／队伍增益和搭档加成；修复单人不记录歌曲／无成功通知，补普隆德拉进行曲效果 |
| 6521 | `TR_RHYTHMICAL_WAVE` | `rhythmicalwave.cpp` | 范围／段数、混音与交响乐、属性倍率、箭矢属性／消费和 AP；补金属狂怒效果 |
