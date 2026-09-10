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

Gateway 收到 `/data/...` 请求后的查找顺序为：

1. Gateway 仓库内同路径的本地文件，例如 `repos/happyro-gateway/data/...`。
2. `DATA_OVERRIDE_PATH` 中按顺序配置的目录；当前依次为已审查运行目录和中文散装目录。
3. 官方 `data.grf`。

本地文件或覆盖目录中的同路径文件会替代 GRF 版本；不存在同路径覆盖时，仍读取官方 GRF。Gateway 会缓存已经读取的内容，变更资源后必须重新执行资源配置并重启 Gateway，不能只修改源文件。

## 当前资源路径

| 资源 | 版本化来源 | 部署方式 | 客户端消费方式 | 用途 |
| --- | --- | --- | --- | --- |
| `cardprefixnametable.txt` | `localization/client/data/`，由物品本地化生成器生成 | 校验后安装到 Gateway `data/` | `DBManager.loadTable` 以 UTF-8 读取 | 插卡装备的中文前缀 |
| `msgstringtable.txt` | `localization/client/data/` | `DATA_OVERRIDE_PATH` | `DBManager.loadTable` 按客户端字符集读取 | 系统消息 |
| `skillnametable.txt` | `localization/client/data/`，由技能生成器生成 | `DATA_OVERRIDE_PATH` | 作为技能目录和相关界面的发布输入 | 技能名称 |
| `skilldesctable.txt` | `localization/client/data/`，由技能生成器生成 | `DATA_OVERRIDE_PATH` | 作为技能说明目录的发布输入 | 技能说明 |
| `titletable.json` | `localization/client/data/` | `DATA_OVERRIDE_PATH` | 官方称号表加载后由 `loadTitleTable` 合并 | 中文称号 |
| `itemInfo_true.lub` | `inputs/runtime/kro-20211105/client/System/`，由翻译 JSON 编译 | 运行目录覆盖 | `loadItemInfo` 通过 Lua 运行时加载 | 物品名称、说明、资源名、洞数和 ClassNum |

`data/msgstringtable.txt` 基于 OpenKore 在提交 `51de1ddfc4449ae5217f6886de702f87ca934030` 时的 cRO 消息表。该文件包含 0 至 4070 的消息 ID，其 SHA-256 为 `b0fa22e17ec01688828157b215c58d452dae389d4601a52087c1e1324be794ce`。

`data/titletable.json` 包含 2021 客户端固定称号 ID 范围 1000 至 1046 的简体中文名称。

`data/skillnametable.txt` 和 `data/skilldesctable.txt` 从固定版本服务端技能数据库生成，覆盖全部 1767 个技能的简体中文名称和机制信息。其中 `data/skill-description-prose.zh-CN.json` 逐条收录官方 `skilldescript.lub` 的 1279 条玩家可见说明与 6260 行有效等级数据，并按效果逻辑分段。`data/skill-description-labels.zh-CN.json` 按同一技能 ID 收录官方最高等级、类别、类型、目标和独立范围标签；习得条件优先从已核验的运行时前置技能数据生成，官方文本存在差异时使用显式覆盖，其余任务、身份和状态条件也由生成器补充。生成器还会阻止已识别的可翻译英文标签、属性和技能名后缀重新进入玩家可见资源；正文、条件和等级公式中的技能交叉引用必须与技能目录使用同一中文名称。运行 `node scripts/resources/generate-skill-localization.mjs --write` 可从当前服务端数据库重新生成两份资源。

`num2cardillustnametable.txt` 和 `cardpostfixnametable.txt` 仍来自官方 GRF：前者只关联卡片图片资源名，后者只标记装备名称采用前缀还是后缀，它们不承载需要翻译的卡片显示名称。

已归档的 `itemlocalization.json` 由翻译后的 `itemInfo_true.lub` 取代，现保留在 `archive/localization/client/data/`。

回编译输入位于 `localization/sources/kro-20211105/merged/files/lub/`，默认由 `tools/client/build` 读取。

## 当前不翻译的旧 TXT

`questid2display.txt` 和 `mapnametable.txt` 虽然存在于 GRF 且含有韩文，但当前不是主要的中文显示来源：

- 当前 PWA 配置启用 `loadLua=true`，任务标题、摘要和说明由 `System/OngoingQuestInfoList.lub` 加载；`questid2display.txt` 只在旧的非 Lua 分支使用，因此目前不翻译。
- `mapnametable.txt` 会被读取，但 `MapTable.js`、`MapNameTranslations.js`、世界地图和导航中文目录优先提供地图名称；它只作为少量未覆盖地图的兜底，因此目前不整表翻译。

后续只有在运行时审计确认某个任务或地图实际回退到韩文时，才针对缺失项补充对应的当前运行时资源。不要因为 GRF TXT 含有韩文，就直接覆盖整张表。

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
