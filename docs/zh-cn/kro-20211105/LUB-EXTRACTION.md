# LUB 提取重现方案

## 目的

使用 Playwright 在浏览器中运行项目自己的 Lua 5.1 WASM 运行时，提取当前工具清单中的 19 个 LUB 目标，并与 `workspace/lub/source/` 中的基准 JSON 比较。官方 `.lub` 文件只读，不修改、不回编译。Lua 5.0 兼容读取结果单独登记，不混入 Playwright 5.1 运行时。

长期工具：[`tools/extract-lub-playwright.mjs`](../../../tools/extract-lub-playwright.mjs)

## 前置条件

在 `tools/` 下安装 Playwright（`tools/package.json` 已固定版本），浏览器缓存仍放在用户缓存目录：

```bash
cd tools
npm install
npx playwright install chromium
```

工具从 `http://127.0.0.1:3000` 加载 Vite 页面，因此先启动客户端开发服务器：

```bash
cd repos/happyro-client
npm run dev -- --host 127.0.0.1
```

然后在另一个终端运行：

```bash
node tools/extract-lub-playwright.mjs
```

`tools/node_modules/` 和 Playwright 浏览器缓存不得提交。

## 提取内容

工具提取：

- `System/achievement_list.lub` → `achievement_list.json`，读取 `achievement_tbl`；
- `System/OngoingQuestInfoList.lub` → `OngoingQuestInfoList.json`，注入 `AddQuestInfo`、`AddQuestDescription` 和 `AddQuestRewardItem`；
- `System/itemInfo_true.lub` → `itemInfo_true.json`，注入全部 `AddItem*` 回调并执行 `main_item()`；
- `System/RecommendedQuestInfoList_True.lub` → `RecommendedQuestInfoList_True.json`；
- `System/OngoingQuestInfoList_True.lub` → `OngoingQuestInfoList_True.json`，复用任务回调；
- `System/RecommendedQuestInfoList.lub` → `RecommendedQuestInfoList.json`，读取 `RecommendedQuestInfoList`。
- `System/LuaFiles514/MsgString.lub` → `MsgString.json`，读取客户端消息字符串表；
- `System/LuaFiles514/OptionInfo.lub` → `LuaFiles514_OptionInfo.json`；
- `System/OptionInfo.lub` → `OptionInfo.json`；
- `System/mapInfo_true.lub` → `mapInfo_true.json`，读取 `mapTbl`；
- `System/Towninfo.lub` → `Towninfo.json`，读取 `mapNPCInfoTable`；
- `System/PrivateAirplane_true.lub` → `PrivateAirplane_true.json`，读取 `StartableMap`；
- `System/PetEvolutionCln.lub` → `PetEvolutionCln.json`；
- `System/PetEvolutionCln_true.lub` → `PetEvolutionCln_true.json`；两者通过 `InsertEvolutionRecipeLGU` 和 `InsertPetAutoFeeding` 回调提取。
- `System/CheckAttendance.lub` → `CheckAttendance.json`，通过签到回调提取奖励记录；不含可翻译文本。
- `System/ShadowTable.lub` → `ShadowTable.json`，读取 `jobtbl`；仅内部渲染数据。
- `System/monster_size_effect.lub` → `monster_size_effect.json`，读取 `EFFECT`；仅内部效果数据。
- `System/monster_size_effect_new.lub` → `monster_size_effect_new.json`，读取 `EFFECT`；仅内部效果数据。
- `System/tipbox.lub` → `tipbox.json`，读取 `tbl` 并保留提示框字段和 0-based `Page` 索引表现。

结果写入 `work/lub-reextract/`，核验后的基准复制到 `workspace/lub/source/`。该目录属于生成工作区，不是正式源文件。每次提取后应同步更新 `status/extracted-files.tsv`，再决定是否生成翻译切片。

## 比较规则

先比较文件字节；若仅因 Lua `pairs()` 造成对象键顺序不同，再解析 JSON 做递归结构比较。数组顺序、字段名、字符串、控制标记、颜色码和占位符必须完全一致。`workspace/lub/source/` 是基准，只读，不得用重提结果覆盖。

提取器中保留 CP949/EUC-KR 解码、客户端回调和字段包装逻辑；不能改成系统 Lua、默认 UTF-8 解码或只读取单一全局表，否则会得到看似有效但无法复现的 JSON。

## Lua 5.0 可见资源

已验证的 Lua 5.0 玩家可见资源为：

- `System/MsgString.lub` → `System_MsgString_lua50.json`；
- `PatchClient/Lua Files/ServerInfoz/ServerInfo_KR.lub` → `ServerInfo_KR.json`。

这两个文件使用 kRO 的 Lua 5.0 头部（其中 `size_t` 和 `Instruction` 采用 4 字节布局）。不能用系统默认 Lua 5.0 直接读取；兼容读取器需要使用 4 字节 `Instruction`，按 4 字节读取 `size_t`，执行后再将 CP949 输出转换为 UTF-8。兼容读取结果作为审阅基准保存在 `workspace/lub/source/`，原始生成副本保存在 `work/lub-reextract/`，不覆盖官方资源，也不代表已完成中文回编译。
