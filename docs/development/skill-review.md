# 主要职业线技能审查

本轮按用户指定的 1–11 顺序审查，每条线独立提交。范围包括基础职业、进阶二转、三转、四转及其继承技能。以当前 Renewal 服务端、PACKETVER=20211103 和本机运行资源为依据；代码审查不等同于逐技能实机验收，也不以空特效配置直接判定技能失效。

## 进度

| 顺序 | 职业线 | 状态 |
| --- | --- | --- |
| 1 | 弓箭手／猎人／神射手／游侠／风鹰 | 代码审查完成，修复并完成自动验证 |
| 2 | 魔法师／巫师／大法师／至高法师 | 78 个技能代码审查完成，修复并完成自动验证 |
| 3 | 服事／牧师／大主教／枢机主教 | 待审查 |
| 4 | 剑士／十字军／皇家卫士／帝国卫士 | 待审查 |
| 5 | 盗贼／刺客／十字斩首者／暗影十字 | 待审查 |
| 6 | 商人／铁匠／机甲神匠／机甲大师 | 待审查 |
| 7 | 魔法师／贤者／妖术师／元素大师 | 待审查 |
| 8 | 商人／炼金术师／基因学者／生物学者 | 待审查 |
| 9 | 服事／武僧／修罗／审判官 | 待审查 |
| 10 | 盗贼／流氓／魅影追踪者／深渊追踪者 | 待审查 |
| 11 | 弓箭手／诗人、舞娘／宫廷乐师、漫游舞者／吟游诗人、咏唱舞姬 | 待审查 |

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
