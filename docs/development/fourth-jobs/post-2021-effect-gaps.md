# 后追加四转技能的同类资源审查

对照官方 2024-10-16 效果表、当前客户端显式映射、Gateway 实际读取和同文件名搜索。以下表格保留四条目标路线以外的初始缺口，不是当前资源状态或逐技能实战通过记录。

| 技能 | 官方效果条目 | 原路径缺失且未找到同名资源 | 命名常量 |
| --- | ---: | ---: | --- |
| ABC_ABYSS_FLAME | 5 | 5 | 缺失 |
| CD_DIVINUS_FLOS | 5 | 5 | 缺失 |
| EM_PSYCHIC_STREAM | 4 | 4 | 缺失 |
| HN_OVERCOMING_CRISIS | 2 | 2 | 缺失 |
| IG_IMPERIAL_PRESSURE | 4 | 3 | 缺失 |
| IQ_BLAZING_FLAME_BLAST | 4 | 4 | 缺失 |
| SH_CHUL_HO_BATTERING | 4 | 4 | 缺失 |
| SH_HYUN_ROK_SPIRIT_POWER | 5 | 5 | 缺失 |
| SKE_SKY_MOON | 5 | 5 | 缺失 |
| SKE_SKY_SUN | 3 | 2 | 缺失 |
| SKE_STAR_LIGHT_KICK | 3 | 3 | 缺失 |
| ABC_CHASING_BREAK | 2 | 1 | 缺失 |
| ABC_CHASING_SHOT | 5 | 5 | 缺失 |
| ABC_HIT_AND_SLIDING | 1 | 0 | 缺失 |
| BO_DUST_EXPLOSION | 3 | 3 | 缺失 |
| BO_MYSTERY_POWDER | 4 | 4 | 缺失 |
| IG_IMPERIAL_CROSS | 2 | 2 | 缺失 |
| IG_RADIANT_SPEAR | 6 | 5 | 缺失 |
| MT_ENERGY_CANNONADE | 5 | 5 | 缺失 |
| MT_POWERFUL_SWING | 3 | 3 | 缺失 |
| MT_RUSH_STRIKE | 3 | 2 | 缺失 |
| NW_MIDNIGHT_FALLEN | 3 | 2 | 缺失 |
| NW_WILD_SHOT | 3 | 3 | 缺失 |
| SS_FOUR_CHARM | 8 | 8 | 缺失 |
| TR_RHYTHMICAL_WAVE | 5 | 5 | 缺失 |
| BO_EXPLOSIVE_POWDER | 1 | 1 | 有 |
| BO_MAYHEMIC_THORNS | 2 | 2 | 有 |
| MT_MIGHTY_SMASH | 1 | 1 | 有 |
| MT_SPARK_BLASTER | 2 | 2 | 有 |
| MT_TRIPLE_LASER | 1 | 1 | 有 |

初始检查时这些项均无显式技能特效映射。资源同名搜索不能证明不同命名文件一定不能复用；修复需要逐项建立对应关系、补官方依赖并验证渲染。完整字段、HTTP 状态及来源路径见 `artifacts/fourth-jobs/similar-skill-resource-audit.json`。

## 资源补齐进度（2026-09-22）

- 已从四份官方补丁提取并安装全部新增技能资源及帝国十字复用的新版超越斩命中特效；没有替换原 GRF 或整份 BSON。
- 清单累计 2,142 个文件、117,114,628 字节，其中 239 个 STR、1,903 张纹理；相对四职业首轮新增 1,854 个文件。
- STR 结构和所有纹理依赖校验通过；1,299 张 BMP 经 Chromium 解码、604 张 TGA 经客户端加载器解码通过。Gateway HTTP 返回的全部文件 SHA-256 与清单一致。
- 官方补丁含一份无扩展名的低画质文件，未作为运行资源发布；所有已发布 STR 均不引用它，排除记录保留在清单。
- 资源证据：`inputs/manifests/fourth-job-effects.json`、`artifacts/fourth-jobs/expanded-texture-decode.json`、`artifacts/fourth-jobs/expanded-http-verify.json`。
- 已接入全部 30 项缺口：29 项使用技能阶段映射，四元素护符按服务端四种元素状态分别触发动画；深渊火焰同时覆盖独立的二次攻击 ID。全部通过真实施放和实际绘制验证，共 33 个样本；攻击技能具有正伤害记录，状态技能核对成功通知及 AP 消耗。完整逐项索引见 `artifacts/fourth-jobs/expanded-skill-evidence.json` 和同名 Markdown。
- 五项复测索引：`artifacts/fourth-jobs/expanded-five-evidence.json`。四项范围动画使用施放成功阶段，避免无伤害通知与伤害包重复播放；三重激光按三个命中显示。
- 全量映射资源审计覆盖 579 项效果、7,166 张纹理，无缺图标/纹理；仍有此前已记录的三个未接入苦无区域 STR，审计退出码为 1，未声明全量通过。

## 同类机制修复

- 神秘粉末增加状态编号与上下两层循环动画，状态结束按服务端通知移除。实测粉尘爆炸前置状态生效，并在约 60 秒时触发效果清理。
- 午夜降临只在地面施放通知的坐标显示主动画，伤害通知不重播地面主动画。
- 四元素护符按火、水、风、地状态分别显示动画；按实际规则先积累 10 枚同属性护符，不能用未满足前置条件的失败记录判定技能失效。
- 天空之日服务端删除重复的范围搜索成功通知，保留原范围伤害；修复后重新编译、重启并实战确认只收到一次成功通知和一组主动画，正伤害保留。
- 龙之吐息、交叉斩、荒野疾行及旧技能 `DK_HACKANDSLASHER`、`WH_GALESTORM` 改用成功阶段播放主动画，避免成功包与伤害包重复显示；最终实战确认均只有一组主动画，并产生正伤害。
- 对合法跨技能资源复用记录来源，不再仅凭资源路径相同判定重复。浏览器在 BSON 合并后核查 254 个技能阶段，未发现阶段内重复 STR 路径。

最终证据覆盖核对见 `artifacts/fourth-jobs/completion-audit.json`；运行时检查确认三个旧苦无区域条目没有技能绑定，见 `runtime-effect-bindings.json`。
