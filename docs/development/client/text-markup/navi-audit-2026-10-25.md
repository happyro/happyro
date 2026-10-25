# NAVI 全量审查与处理方案（2026-10-25）

本文保留实现前的审查快照。后续实现、构建门禁和验证结果见 [NAVI 提前审查与传送实现](navi-teleport.md)。

## 结论

NPC 脚本中有 **593 处 NAVI 链接生成点，分布于 42 个文件，对应 401 个去重目标**。所有这些文件均可从 Renewal 的 `npc/re/scripts_main.conf` 导入树到达。统计单位是源码出现次数，不是玩家看到的次数；同一 NPC 的复制实例、任务分支和重复对话不展开为无限次访问。

- 593 处目标均在服务端地图缓存范围内，且目标周围 12 格存在静态可行走候选点；这不代表都能成功传送。
- **550 处**同时满足“客户端支持目标地图、静态坐标有效、加载脚本中未发现目标地图 `nowarpto` 标记”。它们仍需经过角色权限、源地图禁传、职业进图、冷却、实时 NPC／角色占用等服务器校验。
- **38 处**目标位于声明 `nowarpto` 的地图，普通无绕过权限角色不可直接传入。
- **5 处**指向 `t_garden`，服务端有地图，但客户端支持表未开放该地图，冒险工具坐标传送会拒绝。
- **17 处** NPC 彩色 NAVI 在桌面渲染时破坏 `data-navi-name` 属性，出现多余的 `">`／重复文字等残片；并非原样显示完整 `<NAVI>…</NAVI>` 源码，但不能算正常渲染。
- 移动端 NPC 的 593 处链接均可正确生成文字及目标属性，不显示 NAVI 源码；**NPCPanel 没有绑定 NAVI 点击处理**，不能直接导航或传送。
- 当前桌面点击 NAVI 是打开导航窗口，再通过坐标传送按钮调用冒险工具共享服务；**直接点击 NAVI 传送尚未实现**。

以上是对当前工作树的全量静态检查、真实格式化函数 DOM 验证和相关单元测试结论。没有使用玩家账号实际传送全部目标，也没有把静态可用候选点冒充实时安全落点；当前浏览器已部署的 bundle 是否与源码一致不在本次证明范围。

## 范围与数量

扫描服务端全部 NPC 文本，并补齐 `F_Navi`、`F_mesnavi` 动态生成链接；同时扫描 kRO 2021-11-05 回编译源 JSON 的全部字符串，覆盖任务、物品和提示文本。排除文档示例、测试夹具、名称替换词典以及 API 物品目录副本的重复计数。

| 来源 | NAVI 次数 | 去重目标数 | 地图／坐标静态候选有效 | 其他情况 |
| --- | ---: | ---: | ---: | --- |
| NPC 脚本 | 593 | 401 | 593 | 其中 38 处目标禁传、5 处客户端不支持 |
| OngoingQuestInfoList_True | 2966 | 1279 | 2925 | 40 处魔物检索、1 处越界 |
| OngoingQuestInfoList | 1463 | 548 | 1459 | 2 处魔物检索、1 处格式错误、1 处越界 |
| RecommendedQuestInfoList_True | 5 | 5 | 5 | 其中 1 处目标禁传 |
| itemInfo_true | 1076 | 129 | 1076 | 其中 28 处目标禁传 |
| tipbox | 1226 | 924 | 1218 | 7 处魔物检索、1 处周围没有静态候选点 |

逐来源合计 **7329 处**，不是互不重复的线上链接总数。任务 `_True` 是客户端优先加载的版本，基础表不能与它简单累加为实际展示量；推荐任务和 tipbox 数据存在，但当前客户端未发现完整加载／展示入口，不把离线格式化测试当作功能已上线。NPC + 优先任务表 + 物品文本合计 4635 处源码／资源出现点，也不等于玩家当前可见数量。

NPC 组成：直接字面量 278 处、`F_Navi` 调用 310 处、`F_mesnavi` 调用 5 处。两个函数定义中的 `<NAVI>[` 是构造模板，不作为额外链接计数。依斯鲁得向导有 12 处 `.@map$` 动态目标，已追溯到 `strnpcinfo(4)` 和 `GuideIzlude` 的 `izlude`／`izlude_a` 至 `izlude_d` 复制实例；数量按调用点统计，当前关闭地图分线时按 `map_channel.hpp` 归一为 `izlude`。同一行存在多个 `F_Navi` 时分别计数。

`.gat` 后缀按客户端实际规范化逻辑剥离，地图名转小写；否则会把有效坐标误报为地图不存在。目标去重采用规范化地图、X、Y，动态依斯鲁得分线按当前关闭分线配置归一。

## 渲染与点击链路

| 入口 | 渲染情况 | 当前点击行为 |
| --- | --- | --- |
| 桌面 NPC | 576 处正常；17 处彩色链接属性损坏；没有完整 NAVI 源码泄漏 | 打开 `Navigation`，不直接传送 |
| 移动 NPC | 593 处标准标签均可解析；颜色与链接属性正常 | 没有 NAVI 点击处理 |
| 桌面任务 | 优先表 2966 处 NAVI 可解析；使用 QuestHelperCommon 的解析链路 | 打开导航；魔物代码仍被当地图名，需分类修复 |
| 移动任务 | `GameQuests` 去除 NAVI 标记、保留可读名称并抽取目标 | 独立“查看地图”按钮调用 `actions.showMap`；不是 NPCPanel 的链接事件 |
| 桌面物品说明 | 1076 处经实际 `formatRagnarokMarkup` DOM 验证，链接属性正常 | ItemInfo 绑定导航事件；物品比较窗口只证明渲染，未找到同等点击绑定 |
| 推荐任务／tipbox | 全部标签离线交给格式化函数均可解析 | 当前未实现完整入口，不宣称可点击 |

桌面问题根因：`NpcBox.processNAVITags` 先把带 `^4D4DFF` 等颜色码的显示名写入 HTML 属性，然后 `processColorCodes` 对整个 HTML 做替换，把 `<span style=...>` 插入属性内。浏览器还能保留 `.navi-link` 和目标坐标，但属性、标题及可见文本被破坏。安全格式化器 `formatNPCMarkup` 会单独处理文字与属性，移动端没有这个问题。

附带发现：优先任务表任务 8772 的描述有一段 `[猫眼石]<INFO>7263</INFO></ITEM>`，缺少起始 `<ITEM>`。这是 ITEM 标记问题，不计入 NAVI 异常；如果改用安全富文本渲染，孤立标记可能成为可见文字，宜一并修正源数据。

## 传送有效性的边界

复用入口为 `AdventureActionService.teleportToCoordinate({ mapName, x, y })`，发送 `HAPPYRO_MAP_TELEPORT`；服务端 `happyro_navigation.cpp` 最终决定结果。

检查顺序包括：传送权限 → 目标地图已加载 → 是否允许跨图 → 目标 `nowarpto`／源地图 `nowarp`／职业进图权限 → 坐标边界 → 冷却 → 安全落点 → `pc_setpos`。

安全落点并非“目标格能走即可”：服务端在目标周围最多 12 格寻找，避开地图边界、角色和 NPC 占用、OnTouch 范围及其两格边距。离线检查使用按服务端优先级合并的 `db/map_cache.dat`、`db/re/map_cache.dat`、`db/import/map_cache.dat`，确认尺寸和可行走 cell 类型 0／3／6；没有模拟实时占用、脚本动态地图标记或 OnTouch 状态。因此表中的“静态候选有效”只用于排除确定错误。

本机配置文件当前声明：传送范围 2、允许跨图、冷却 1 秒、地图分线关闭。此处只读取设置项，不等价于已读取运行进程的实时值。`nowarpto` 统计取已加载脚本中的静态声明，不覆盖运行时 `setmapflag`／`removemapflag`，拥有 `WARP_ANYWHERE` 的管理员可能绕过该限制。

坐标传送也不自动执行任务入口 NPC 的等级、任务进度或收费判断。例如 `garden_of_time.txt` 的入口脚本包含 BaseLevel 条件，而共享坐标传送入口没有通用任务进度校验。若将 NAVI 改为直接传送，应明确是否沿用冒险工具现有开放策略；要求遵守任务门槛的目标必须增加服务端目标规则或仅提供查看地图，不能依靠前端链接隐藏来实施限制。

正在进行 NPC 对话时不能只隐藏窗口再发传送请求。`pc_setpos` 中所见的 NPC 队列清理位于跨 map-server 分支，不能据此断言本机同服传送都会自动终止对话；实现前需要覆盖 next/menu/input/close 等不同脚本等待状态。

## 分情况解决方案

| 情况 | 建议方案 | 验收要求 |
| --- | --- | --- |
| 桌面彩色 NAVI 属性损坏 | NPC 与任务文字统一使用安全富文本解析，属性与标签文字分别转义和着色 | 17 处问题全文回归；不出现重复文字、残片，点击目标和标题正确 |
| 移动 NPC 链接无动作 | 为 NPCPanel 增加统一 NAVI 事件处理，桌面／移动复用同一业务服务 | 点击文字及其内部彩色 span 都有效；重复点击受 pending／冷却保护 |
| 普通有效坐标 NAVI | 解析并严格校验地图、整数坐标，再调用冒险工具坐标传送服务 | 成功以服务端回执为准；权限、冷却、跨图失败均有明确提示 |
| 魔物检索型 NAVI | 识别魔物 AegisName，打开魔物图鉴与分布地图，用户选择地图后再传送 | 不把魔物代码当地图；多个分布地图不能擅自选一个；无分布时说明原因 |
| 坐标格式错误／越界 | 回查 NPC 定义、官方导航或权威位置，修正对应翻译源并重新编译验证 | 不通过截断、夹到边界或猜测数字来掩盖错误；未核实前禁止传送 |
| 客户端不支持目标地图 | 链接保留可读文字，点击提示地图未开放；开放前补齐客户端资源并验证 | t_garden 的五处均有明确反馈；资源未就绪不发送传送包 |
| 目标禁传／源地图禁传 | 遵守现有服务器规则，提供失败原因及地图查看入口 | 普通玩家不能借 NAVI 绕过限制；管理员仍按现有权限体系执行 |
| 任务／等级门槛位于入口 NPC 脚本 | 明确沿用冒险工具开放策略还是限制任务区域；需限制时在服务端校验目标访问条件，未支持前仅允许查看地图 | 不能通过直接坐标传送意外绕过要求保留的任务门槛 |
| 目标附近无安全落点 | 保留服务端 12 格安全搜索，不自动扩大范围或随机传走；核实后修正目的地 | 不落在 NPC、传送口或 OnTouch 区；失败时角色留在原地 |
| 动态地图名／分线 | 以当前 NPC 所在地图解析，使用既有分线配置和归一规则 | 关闭分线指向主地图；开启分线保留明确实例，逐种模式测试 |
| 正在对话时传送 | 明确支持的退出协议／状态；先完成可确认的结束，再传送；不能安全结束时提示先结束对话 | next/menu/input/close、同图／跨图、失败／超时都不残留对话锁，也不误触发选项或奖励 |
| tipbox／推荐任务尚无入口 | 先记录资源缺陷；将来接入口时复用同一解析及动作服务 | 不仅渲染测试通过，还要验证真实入口、按钮和权限 |

建议先修复桌面格式化和统一 NAVI 分类解析，再实现 NPC 对话结束及传送流程，最后修复异常源数据与未开放地图。此次仅审查和记录，不修改游戏功能或原始官方资源。

## 已确认的异常数据

- 优先／基础任务表任务 **16273**：`yuno_in03.gat,173,1709,0,101,0`，地图尺寸 **260 × 216**，Y=1709 越界。不能未经权威核对就改为 170 或 179。
- 基础任务表任务 **16028**：`rebel_in,33 43,0,101,0`，`33 43` 不是合法整数坐标；当前 `parseInt` 还可能误解析成 X=33、Y=0。优先 `_True` 表没有这一条格式错误，但不能把基础表当作已修复。
- tipbox **9056**：`prt_church,130,88`，坐标在 200 × 200 地图范围内，但 12 格内没有满足静态通行条件的候选点，不能承诺坐标传送成功。
- 三组资源共有 **49 处魔物检索 NAVI**：优先任务 40、基础任务 2、tipbox 7；所有首字段均能在服务端魔物数据库中匹配 AegisName，属于类型不同，不是 49 张缺失地图。示例：`ILL_TRI_JOINT,0,0,3,-222,1`、`STAPO,0,0,3,-222,1`。
- NPC 五处不支持地图均为 `garden_of_time.txt` 的 `F_mesnavi(...,"t_garden",128,122)`：1090、1133、1176、1219、1262 行。

## 证据与复查

本次审查基于客户端 HEAD `50892f34296fdf23d55e0c7555fb75f7cd218578`、服务端 HEAD `01e04b339357a0aaf765eede61c98e06211f814e` 及审查时工作树内容；实际扫描源文件 SHA-256 位于清单中。HEAD 不能代替工作树哈希。

生成文件统一位于 `work/navi-audit-20261025/`，不属于发布产物：

- `audit.py`：去注释扫描、NPC 导入树、动态函数调用、地图缓存及规则检查。
- `inventory.json`：7329 条逐项记录，含源文件、行号／JSON 路径、标签原文、目标、地图检查结果与源哈希。
- `all-links.tsv` / `npc-links.tsv`：全量／NPC 明细，便于筛选。
- `render.mjs` / `render-results.json`：从当前 NpcBox 提取真实格式化函数，配合实际共享格式化器在 jsdom 中渲染全部条目；非 NPC 资源的 mobile 列是解析器能力测试，不等于每个移动页面都使用该解析器。
- `summary.json` / `render-summary.json`：统计汇总。

复查命令（仓库根目录）：

```sh
python3 work/navi-audit-20261025/audit.py run
node work/navi-audit-20261025/render.mjs run
```

客户端相关测试：`RagnarokText`、`NPCPanel`、`MobileNPC`、`MobileQuests`、`AdventureActionService` 共 **5 个文件、39 个测试通过**。这些测试证明相关代码回归，不作为 593 次实机传送成功的证据。文档中的“不支持”“越界”“缺少事件”等是明确结论；其余目标的实时可传送性为条件成立时可尝试，必须接受服务器当次判定。

关键实现：`repos/happyro-client/src/UI/Components/NpcBox/NpcBox.js`、`src/Utils/RagnarokText.js`、`src/UI/Mobile/game/NPCPanel.js`、`src/UI/Game/GameQuests.js`、`src/UI/Mobile/game/QuestsPanel.js`、`src/UI/Components/GameTools/AdventureActionService.js`；服务端为 `repos/happyro-server/src/map/happyro_navigation.cpp`、`map.cpp`、`map_channel.hpp`、`pc.cpp`。

## 桌面 NPC 彩色链接问题清单

| 源文件（相对 npc/） | 行号 | 链接名称 | 目标 |
| --- | ---: | --- | --- |
| re/custom/lasagna/lasagna_npcs.txt | 3589 | [牧羊人] | `lasa_fild01,353,370,000,1,` |
| re/custom/lasagna/lasagna_npcs.txt | 3607 | [弗洛林] | `lasa_fild02,102,372,000,1,` |
| re/custom/lasagna/lasagna_npcs.txt | 3619 | [普洛克] | `lasa_fild02,177,241,000,1,` |
| re/custom/lasagna/lasagna_npcs.txt | 3631 | [渔夫] | `lasa_fild02,326,170,000,1,` |
| re/custom/lasagna/lasagna_npcs.txt | 3649 | [困倦喵] | `lasa_fild02,331,251,000,1,` |
| re/custom/lasagna/lasagna_npcs.txt | 6107 | [冒险者俱乐部] | `lasagna,56,186,000,1,` |
| re/custom/lasagna/lasagna_npcs.txt | 6119 | [冒险者俱乐部] | `lasagna,56,186,000,1,` |
| re/custom/lasagna/lasagna_npcs.txt | 7795 | [龙之巢穴] | `lasa_fild02,340,244,000,1,` |
| re/custom/lasagna/lasagna_npcs.txt | 7824 | [龙之巢穴] | `lasa_fild02,340,244,000,1,` |
| re/custom/lasagna/lasagna_npcs.txt | 7833 | [龙之巢穴] | `lasa_fild02,340,244,000,1,` |
| re/custom/lasagna/lasagna_npcs.txt | 7835 | [龙之巢穴] | `lasa_fild02,340,244,000,1,` |
| re/jobs/novice/academy.txt | 8712 | [战斗教官苏比诺] | `iz_ac01,59,83,` |
| re/jobs/novice/academy.txt | 8809 | [战斗教官苏比诺] | `iz_ac01,59,83,` |
| re/jobs/novice/academy.txt | 9564 | [魔法师公会向导] | `geffen,43,123,` |
| re/jobs/novice/academy.txt | 9584 | [魔法师公会向导] | `geffen,43,123,` |
| re/jobs/novice/academy.txt | 9615 | [魔法师公会职员] | `geffen_in,164,124,` |
| re/jobs/novice/academy.txt | 9626 | [魔法师公会职员] | `geffen_in,164,124,` |

## NPC 目标禁传分布

下表为已加载脚本中的静态 `nowarpto` 声明；共 38 处链接，不包括角色源地图限制。

| 目标地图 | 链接次数 |
| --- | ---: |
| `ba_in01` | 4 |
| `nif_dun01` | 2 |
| `nif_dun02` | 4 |
| `oz_dun01` | 2 |
| `pub_cat` | 6 |
| `que_thr` | 1 |
| `rgsr_in` | 5 |
| `wolfvill` | 14 |
