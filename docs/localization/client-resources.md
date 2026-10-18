# 客户端资源生效链

这些 UTF-8 文件用于补充或替换官方 kRO 2021-11-05 GRF 中的玩家可见文本。经过核验的官方源材料保持不变，生成后的中文文件由资源网关作为同路径散装资源提供。

`localization/client/README.md` 只保留短入口，完整说明以本文为准。

## 通用生效链

本地化资源按以下单向链路进入游戏，不直接修改官方 GRF：

```text
固定版本官方资源、服务端数据库或已审查翻译源
                    ↓ 生成或整理
localization/client/data/<资源文件>
                    ↓ scripts/resources/configure-resources.sh
Gateway 本地 data/ 或 DATA_OVERRIDE_PATH
                    ↓ HTTP /data/<资源文件>
HappyRO Client 对应的 DB 加载器
                    ↓
游戏界面
```

`localization/client/data/` 是这些中文散装文件的版本化来源。Gateway 仓库中的 `data/` 文件是本机部署副本，不应单独维护。`scripts/resources/configure-resources.sh` 会先校验关键文件的条目数、结构和韩文残留，再配置运行资源。

未配置自定义资源时，Gateway 收到 `/data/...` 请求后的查找顺序为：

1. Gateway 仓库内同路径的本地文件，例如 `repos/happyro-gateway/data/...`。
2. `DATA_OVERRIDE_PATH` 中按顺序配置的目录；当前依次为已审查运行目录和中文散装目录。
3. 官方 `data.grf`。

本地文件或覆盖目录中的同路径文件会替代 GRF 版本；不存在同路径覆盖时，仍读取官方 GRF。Gateway 会缓存已经读取的内容，变更资源后必须重新执行资源配置并重启 Gateway，不能只修改源文件。

## 当前资源路径

| 资源 | 版本化来源 | 部署方式 | 客户端消费方式 | 用途 |
| --- | --- | --- | --- | --- |
| `metalprocessitemlist.txt` | `localization/client/data/`，按官方材料表翻译的 75 条制作配方 | 校验后安装到运行目录及 Gateway `data/` | `DBManager.loadTable` 以 UTF-8 读取 | 锻造／制药窗口的材料说明 |
| `cardprefixnametable.txt` | `localization/client/data/`，由物品本地化生成器生成 | 校验后安装到 Gateway `data/` | `DBManager.loadTable` 以 UTF-8 读取 | 插卡装备的中文前缀 |
| `msgstringtable.txt` | `localization/client/data/` | `DATA_OVERRIDE_PATH` | `DBManager.loadTable` 按客户端字符集读取 | 系统消息 |
| `skillnametable.txt` | `localization/client/data/`，由技能生成器生成 | `DATA_OVERRIDE_PATH` | 可访问的散装输出；当前主要 UI 读取生成 JS | 技能名称 |
| `skilldesctable.txt` | `localization/client/data/`，由技能生成器生成 | `DATA_OVERRIDE_PATH` | 可访问的散装输出；当前 `DB.getSkillDescription` 读取生成 JS | 技能说明 |
| `titletable.json` | `localization/client/data/` | `DATA_OVERRIDE_PATH` | 官方称号表加载后由 `loadTitleTable` 合并 | 中文称号 |
| `itemInfo_true.lub` | `inputs/runtime/kro-20211105/client/System/`，由翻译 JSON 编译 | 运行目录覆盖 | `loadItemInfo` 通过 Lua 运行时加载 | 物品名称、说明、资源名、洞数和 ClassNum |
| `OngoingQuestInfoList_True.lub` | `inputs/runtime/kro-20211105/client/System/`，由翻译 JSON 编译 | 运行目录覆盖 | `loadQuestInfo` 通过 Lua 运行时加载 | 完整任务标题、摘要、说明、导航与奖励；含后续 EP |

`data/msgstringtable.txt` 基于 OpenKore 在提交 `51de1ddfc4449ae5217f6886de702f87ca934030` 时的 cRO 消息表，之后有 HappyRO 文案维护。原始来源提交不能作为当前覆盖文件的哈希；当前版本应从 Git 与 `sha256sum localization/client/data/msgstringtable.txt` 核验，不复制旧文档中的固定哈希作为部署依据。

`data/titletable.json` 包含 2021 客户端固定称号 ID 范围 1000 至 1046 的简体中文名称。

技能生成器组合服务端数据库、中文正文/标签和固定 LUB 运行快照，同时写出 TXT 与 Client 生成 JS。当前覆盖计数与来源差异见[技能与状态](../game-data/skills.md)。只验证 `/data/skilldesctable.txt` 不能证明游戏技能窗已更新：必须重建 PWA 并验证生成 JS。原文忠实度与运行数值是不同问题，不能将生成的参数称为 LUB 原文翻译。

`num2cardillustnametable.txt` 和 `cardpostfixnametable.txt` 仍来自官方 GRF：前者只关联卡片图片资源名，后者只标记装备名称采用前缀还是后缀，它们不承载需要翻译的卡片显示名称。

物品文本以翻译后的 `itemInfo_true.lub` 为准，不再维护额外的物品名称覆盖表。

回编译输入位于 `localization/sources/kro-20211105/merged/files/lub/`，默认由 `tools/client/build` 读取。

## 当前不翻译的旧 TXT

`questid2display.txt` 和 `mapnametable.txt` 虽然存在于 GRF 且含有韩文，但当前不是主要的中文显示来源：

- 当前 PWA 配置启用 `loadLua=true`，任务标题、摘要和说明优先由 `System/OngoingQuestInfoList_True.lub` 加载，缺失该文件时才回退基础表；`questid2display.txt` 只在旧的非 Lua 分支使用，因此目前不翻译。
- `mapnametable.txt` 会被读取，但 `MapTable.js`、`MapNameTranslations.js`、世界地图和导航中文目录优先提供地图名称；它只作为少量未覆盖地图的兜底，因此目前不整表翻译。

后续只有在运行时审计确认某个任务或地图实际回退到韩文时，才针对缺失项补充对应的当前运行时资源。不要因为 GRF TXT 含有韩文，就直接覆盖整张表。

## 任务资料校验边界

历史 EP 与 Renewal NPC 审计已补齐实际任务引用、空说明和乱码，并执行过 LUB 逐键语义回环及浏览器抽样；这些结论只适用于当时快照，详细产品变化见 changelog。当前任务来源及未完成的玩法验收见[服务端审读边界](server-content.md#审读范围与未完成验收)。

发布时使用最终源输入重新校验 LUB 语义，并核对运行目录和 Gateway 响应的哈希及来源；同步检查 NPC 目录和公告图片。旧测试数量、旧包校验和及旧部署状态不能证明当前资源一致。静态任务资料完整也不表示全部随机分支和完整任务链已实际通关。

## 卡片前缀链路

```text
GRF 提取的 CP949 原表
work/grf-extract/kro-20211105/data/data/cardprefixnametable.txt
                    + 已审查物品中文目录
                    ↓ generate_item_name_overrides.py --write
UTF-8 中文表 localization/client/data/cardprefixnametable.txt
                    ↓ configure-resources.sh 校验并安装
repos/happyro-gateway/data/cardprefixnametable.txt
                    ↓ /data/cardprefixnametable.txt
ItemTable[卡片 ID].prefixName
                    ↓ cardpostfixnametable.txt 决定拼接位置
最终插卡装备名称
```

中文表保持官方物品 ID 和 `#` 分隔结构，只替换玩家可见的前缀文本。生成器优先使用客户端目录中的已审查中文名，客户端目录没有该 ID 时才使用服务端目录名称。

加载官方 Lua 表时，客户端会保留已翻译的静态名称：

- `DBManager.loadTitleTable` 在官方称号表之后应用 `titletable.json`，使已获得的称号不会回退为韩文。
- `DBManager.loadWorldMapInfo` 将官方世界地图几何数据与已翻译的 `WorldMap.js` 和 `MapTable.js` 名称合并。旧世界地图布局中不存在的动态地图 ID 使用已翻译的地图信息快照。
- 道具显示名称保持本地化，道具资源名称则使用配置的客户端字符集解码。这样既能保持韩文 GRF 文件名有效，也不会在界面中显示韩文道具名称。

资源网关会分别转换各个乱码路径片段。请求可能同时包含旧式 CP949 目录 `À¯ÀúÀÎÅÍÆäÀÌ½º` 和有效的 Unicode 文件名 `나이프.bmp`；转换整个路径会破坏文件名，导致装备图标返回 HTTP 404。

资源配置脚本会验证本地化覆盖资源，客户端变更由 Vitest 测试套件覆盖。

配置用户自定义资源时，`CUSTOM_RESOURCE_PATH` 优先于内置来源及缓存；更新／删除行为见[自定义资源设计](../architecture/customization.md#资源与资料刷新)。

## 氏族与公会术语

`Clan` 统一译为“氏族”，`Guild` 指玩家公会；伊兹鲁德剑士转职公会、商人公会及任务中的旧公会地址保留职业组织称呼，不全局替换“公会”。四个固定氏族名称以服务端 `sql-files/main.sql` 和 NPC 对话为准：剑士氏族、奥术法杖氏族、金锤氏族、十字弩氏族。

地图牌子的 `SignBoardTranslationTable.js`、状态图标 `stateiconinfo.zh-CN.json`、`Clan.html` 与消息表编号2355～2365需同步检查。`ui-text` 优先取消息表，仅改模板备用文字不能保证界面生效。运行数据库中的 `clan` 与 `clan_alliance` 名称也应与版本化初始数据一致；数据库名称由服务端缓存，更新后需安排重新加载。

氏族任务的“公会大师”应按具体任务归属修正为“氏族首领”。任务文本修改仍须经过 LUB 编译、逐键语义回环、运行目标和HTTP哈希核对；资源验收不代表任务链已经通关。
