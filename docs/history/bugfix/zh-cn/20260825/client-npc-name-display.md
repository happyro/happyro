# NPC 实体名称显示本地化

## 现象

NPC 对话内容和左上角对话标题已经是中文，但鼠标移动到 NPC 时，名称牌或悬停名称仍显示英文，例如 `Warmhearted woman`、`Apprentice Craftsman`。这类问题可能表现为第一次对话标题正常，点击“继续”后标题又恢复英文。

## 根因

NPC 有两条不同的名称来源：

1. 服务端脚本中的 `mes "[中文名称]"`，用于对话窗口标题。
2. 实体创建包中的初始 `name` 字段，客户端在实体生成时直接用于名称牌和悬停显示。

此前只在 `ACK_REQNAME` 身份包处理逻辑中调用本地化。NPC 的初始实体包不一定会经过该身份包路径，因此初始英文名称会绕过本地化；后续对话又直接使用脚本发送的标题，造成两处名称不一致。

## 24 字节名称封包截断

### 现象

名称表已经登记完整英文名称，但少数长名称仍显示截断后的英文。例如服务端脚本中的 `Phantasmagorika Spokesperson`，客户端实际收到的是 `Phantasmagorika Spokesp`。

### 原因

客户端 `PacketStructure.js` 中的 `NAME_LENGTH` 为 24，与服务端 `mmo.h` 保持一致。C 字符串需要一个结尾空字节，因此纯 ASCII 名称最多只能传输 23 个可见字符。客户端如果只用完整脚本名称查表，截断后的名称就无法命中。

这不是某一个 NPC 漏翻译。当前普隆德拉名称表中共有 14 个超过 23 个 ASCII 字符的名称：

- `Carbonated Water Vending Machine`
- `Clothing Effect Removal Service`
- `Librarian in charge of juveniles`
- `Phantasmagorika Spokesperson`
- `The King of Rune-Midgarts`
- `Valkyrie Realm Training Instructor`
- `Fortress Entry Warp Portal`
- `Helper for the Royal Richard`
- `Married couple Quest_START`
- `Underground Dungeon Helper`
- `qroom_heine_in_qroom_heine_out`
- `qroom_nerius_in_qroom_nerius_out`
- `way_to_qroom_L_qroom_L_to_way`
- `way_to_qroom_R_qroom_R_to_way`

### 解决方案

`NpcNameTable.js` 在初始化时遍历完整名称表，为超过 23 个字符的可打印 ASCII 名称自动建立前 23 个字符的别名。截断别名若对应不同译文会直接抛出错误，防止两个长名称具有相同前缀时静默显示错误译名。

新增长名称时不需要手工登记截断版本，但必须运行 `NpcNameTable.test.js`。测试会遍历普隆德拉名称表并验证每个长名称的截断版本都能命中相同译文。

## 修复方案

- 在客户端维护 `NpcNameTable.js`，登记英文显示名到中文显示名的映射。
- 普隆德拉全量映射单独维护在 `PronteraNpcNameTable.js`，范围包括 `prontera`、普隆德拉室内、教堂、王宫及其任务房间、图书馆、监狱、竞技场和普隆德拉公会城地图；周边野外、迷宫和下水道不属于城区 NPC。
- 在实体创建路径统一调用 `DB.getNpcName()`，覆盖 NPC 初始名称包。
- 在身份包路径也调用同一入口，避免名称被服务端回包再次覆盖为英文。
- 保留 `#` 实例后缀和 `::` 内部脚本标识，只替换玩家可见名称部分。
- 名称封包截断按上面的独立规则统一处理，不手工维护单个截断词条。
- 服务端脚本中的 `mes` 标题仍需同步翻译；客户端实体名称映射不能替代对话文本翻译。

## 验收

1. 重新构建 PWA，并确认实际网关返回新构建的 `Online.js`。
2. 进入目标地图，鼠标移动到 NPC，检查名称牌和悬停名称。
3. 点击 NPC，检查第一次对话、点击“继续”后的每一页标题均保持中文。
4. 检查带 `#id` 或 `::function` 的 NPC，确认内部标识未被改写。
5. 检查超过 23 个 ASCII 字符的 NPC，确认封包截断后的名称仍能命中译文。

普隆德拉名称表以服务端活动脚本中的 NPC 定义为准。检查时先从第三个制表符字段提取显示名，再去掉 `#...` 实例后缀和 `::...` 事件别名后去重；所有仍为 ASCII 的基础名称都必须存在于 `PronteraNpcNameTable.js` 或公共 `NpcNameTable.js`。当前普隆德拉专用表基准为 487 项，客户端测试会同时检查条目数和中文译值。

这类客户端逻辑修复不需要重建 `.lub`；如果只修改服务端 NPC 名称脚本，则必须重启或重新加载 map-server，已有实体不会自动更新旧名称。

修改客户端名称表后必须执行 `npm run build:pwa`。网页网关直接提供构建产物，但浏览器可能仍持有旧 bundle；验收前应刷新页面，必要时清除站点缓存后重新登录。无需重启 map-server，也无需重建 `.lub`。
