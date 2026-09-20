# 运行资源差异清单

核查日期：2026-09-20。命令：`node tools/resources/audit-fourth-jobs.mjs audit --no-color`。
完整路径、字节数及 SHA-256 见 `artifacts/fourth-jobs/source-audit.json`。

本页记录实际运行 Gateway 的读取结果，不代表渲染或技能战斗逻辑已验收。

资源目录已直接复核：Gateway 的 `resources/data.grf` 是指向 `inputs/runtime/kro-20211105/client/data.grf` 的软链接；另有运行目录散文件覆盖。绕过 Gateway、以 CP949 解码直接读取该 GRF 的 148,805 个文件索引，35 个缺失技能代码及 `kunaiarea_00` 在任意路径中均无匹配；已有的 `dk_servantweapon.bmp` 能正常匹配。缺口不是漏挂载该运行目录，但后续仍需核对是否存在不同命名的对应资源。

## 已确认覆盖

- 20 个职业的 72 个基本身体 SPR／ACT 可读取，文件签名符合预期。
- 333 条职业技能树记录均有客户端技能定义、技能树位置，最高等级与服务端一致。
- 技能显式映射、17 种静态地面单位映射与运行时 `ez2streffect.bson` 共引用 280 条特效配置；其中 277 条 STR 可读取并通过结构长度检查。
- 可读取 STR 所引用的 3,322 个独立纹理均可读取，已记录哈希；图片完整解码与游戏内播放按机制抽样检查。
- 扩展职业已有 BSON 特效加载路径。新增静态映射不重复加入相同资源，审计会拒绝静态映射与 BSON 重复引用同一 STR。
- 已明确接入 5 种 BSON 地面单位（图腾、鹿灵之风、重力场、霜冻新星、蜃气楼）的 20 个阶段条目：开始／循环绑定区域，结束动画在服务端移除区域时播放，不再同时映射到施法者；这些文件已包含在上述资源审计中。

## 已补齐的技能图标

以下 35 个技能图标在初始运行目录中缺失，现已从同名官方补丁条目提取，作为散文件补入 `inputs/runtime/kro-20211105/client/data/texture/유저인터페이스/item/`。原 `data.grf` 未修改。

| 职业系 | 技能代码 |
| --- | --- |
| DK | DRAGONIC_BREATH、DRAGONIC_PIERCE |
| MT | SPARK_BLASTER、TRIPLE_LASER、MIGHTY_SMASH、RUSH_STRIKE、POWERFUL_SWING、ENERGY_CANNONADE |
| SHC | CROSS_SLASH |
| AG | ENERGY_CONVERSION |
| CD | DIVINUS_FLOS |
| WH | WILD_WALK |
| IG | IMPERIAL_CROSS、RADIANT_SPEAR、IMPERIAL_PRESSURE |
| BO | EXPLOSIVE_POWDER、MAYHEMIC_THORNS、MYSTERY_POWDER、DUST_EXPLOSION |
| ABC | HIT_AND_SLIDING、CHASING_BREAK、CHASING_SHOT、ABYSS_FLAME |
| EM | PSYCHIC_STREAM |
| IQ | BLAZING_FLAME_BLAST |
| TR | RHYTHMICAL_WAVE |
| SKE | SKY_SUN、SKY_MOON、STAR_LIGHT_KICK |
| SS | FOUR_CHARM |
| NW | WILD_SHOT、MIDNIGHT_FALLEN |
| HN | OVERCOMING_CRISIS |
| SH | CHUL_HO_BATTERING、HYUN_ROK_SPIRIT_POWER |

完整技能代码为“职业系 + 下划线 + 表内代码”。所有图标均为对应技能的官方原文件，未使用其他技能图标替代。

来源是官方 `https://ropatch.gnjoy.com/Patch/` 下的 3 个补丁：

- `2022-06-02_live_data_831_832_1653639546.gpf`：6 个。
- `2024-08-07_live_data_2137_2142_1722493122.gpf`：15 个。
- `2024-10-16_live_client_2270_2276_1728616019.gpf`：14 个。

完整补丁 SHA-256、来源 URL、包内路径、提取文件 SHA-256 和尺寸记录在 [来源清单](../../../inputs/manifests/fourth-job-icons.json)。35 个文件均通过 Chromium 实际图片解码，尺寸为 24×24，安装后已复核目标哈希；Gateway 使用 Unicode 路径和客户端 CP949 字节形式路径读取均与来源哈希一致。

补充后同时修复了本机未配置 `client/data/` 散文件覆盖目录、Gateway 散文件路径未转换 CP949 字节形式的问题。两者不改变原 GRF 索引未包含这些图标的事实。

安装工具不下载或修改原始材料；先按来源清单提取同名条目，再执行：

```bash
node tools/resources/install-fourth-job-icons.mjs install --source work/fourth-jobs/official-patches/extracted
node tools/resources/install-fourth-job-icons.mjs verify --no-color
```

工具会在写入前校验全部源文件与已存在目标文件，拒绝哈希不匹配，只新增缺失文件。运行资源仍位于原统一目录，后续离线包按既有规则包含其 `data/` 子目录，无需新增资源镜像。

## BSON 引用的缺失 STR

以下路径在运行 Gateway 搜索及直接读取中均未找到：

- `data/texture/effect/shinkiro_shiranui/npc_kinai/kunaiarea_00_end.str`
- `data/texture/effect/shinkiro_shiranui/npc_kinai/kunaiarea_00_loop.str`
- `data/texture/effect/shinkiro_shiranui/npc_kinai/kunaiarea_00_start.str`

不能仅凭 `npc_kinai` 的拼写猜测新路径；还需核对原始定义、对应技能及可信补充资源。

后续映射核查：使用当前 `DBManager.mergeEz2Effects` 源码及运行 BSON 计算引用，3 个 `_00` 条目没有技能映射，也没有地面单位阶段映射；同目录 `_01` 的 3 个条目也未被映射。证据为 `artifacts/fourth-jobs/bson-mapping-audit.json`。因此目前没有证据表明游戏会请求这 3 个缺失文件，不能将它们直接等同于 3 个职业技能不可用；资源清单仍保留缺失项，后续确定苦无区域的正确映射时再判定是否需要补充。

## 后续处理

本页只维护资源事实、来源和引用证据。剩余映射、动画检查及 3 条旧 STR 的调查统一在[后续清单](backlog.md)排优先级，不在本页重复列待办，也不因保留缺失记录自动启动补丁搜索或全量实测。

官方源材料保持只读；资源差异不能通过修改源快照或隐藏缺失项消除。
