# 物品名称来源

当前状态：已合并两站完整扫描结果，并将可靠映射同步至当前 Renewal 产品数据。完整来源、规则、分片、冲突与验证见 [合并结果](../../docs/localization/item-name-scans/merged/README.md)。

## 当前覆盖与限制

- [zh-CN.json](zh-CN.json)：15,968 个项目 ID，小册子列表 15,565、网格 24、RO321 379。每项保存来源原名及内部标识；网格的身份依据单独记录。
- [unresolved.json](unresolved.json)：13,388 个项目 ID 无可靠中文候选，保留现名，不自行翻译。
- [source-conflicts.json](source-conflicts.json)：137 项合格中文名冲突，逐项记录选用与候选；采用小册子列表、网格、RO321 的优先顺序。
- [source-exclusions.json](source-exclusions.json)：排除 33 项语言未经确认的网格候选，不把纯汉字日文当作中文。
- [reviewed-references.json](reviewed-references.json)：14 项物品说明引用及 23 项 NPC 奖励标签，按实际物品 ID 同步。
- 当前客户端 16,127 个 ID 中，12,121 个有可靠映射。未映射条目不声称翻译通过。
- 本轮较提交基线新增 235 个映射；实际更新服务端 232 个名称、客户端 178 个名称。
- 仅使用项目固定的 Renewal／PACKETVER=20211103 语义。Pre-Renewal 不套用本映射；同名技能、其他 ID 的装备及通用未鉴定名称不做全局替换。

## 同步流程

```bash
# 公开资料缓存与每页哈希保存在 work/，遇到拒绝访问停止获取。
python3 tools/localization/items/item_names.py fetch --source dvg --output work/item-name-sources
# RO321 按明确的 ID 列表查询；ids.json 是数字 ID 数组。
python3 tools/localization/items/item_names.py fetch --source ro321 --ids work/item-name-sources/ids.json --output work/item-name-sources --limit 20 --interval 8
python3 tools/localization/items/build_item_names.py build --references docs/localization/item-name-scans
python3 tools/localization/items/sync_item_names.py apply
python3 tools/resources/catalog/main.py items server
python3 tools/resources/catalog/main.py items client
python3 tools/resources/catalog/generate_card_prefixes.py --write
python3 tools/resources/catalog/generate-item-services.py generate --no-color
python3 tools/localization/items/sync_item_names.py check --no-color
```

`items client` 需要 GRF 提取清单。若仅改名称、原提取目录已经删除，应先证明物品资源路径及全部数值字段与 Git 基线一致，再使用 `client.build_catalog` 与 `assets.descriptions` 更新名称／说明快照；不得伪造提取清单或改动既有图片映射。

`sync_item_names.py apply/check` 同时按 ID 同步和检查任务／提示中的 `<ITEM>` 链接，保留标签颜色和括号。客户端直接使用 ItemInfo 的名称，已移除旧名称覆盖补丁。卡片前缀、冒险工具、附魔材料和 Admin 共用更新后的名称目录。修改说明、任务或技能文字后，需重建相关 LUB 和技能生成表，并按资源手册安装和校验哈希。

## 对话与引用

不能对所有文本直接全局替换：同一个旧译名可能对应不同 ID，物品也可能与 NPC、技能、属性或普通名词同名。对话替换限制在显示字符串，保留 NPC 内部标识；13 处要求输入物品名的答案判定明确改为 `getitemname(ID)`，其余执行 token 不变；导航标签中的 NPC 名称保持原义。可确认的任务、道具和技能说明引用已同步，有歧义的候选保留原文。

本地证据在 `work/item-name-sources/`：`reference-changes.json` 记录替换上下文，`reference-unresolved.json` 是待人工核对候选（包含普通名词，不等于全部都是错误），`verification.json` 检查数据库非名称字段、客户端资源与数值字段、NPC 除已列出的 13 处答案判定外执行 token 及菜单分隔符不变。来源冲突见映射输出目录中的 `source-conflicts.json`，编译及安装证据同目录保存。复查另见 `recheck-verification.log`、`input-name-fixes.json` 和 `dicastes-reference-fixes.json`。

## 名称示例

| ID | 采用名称 |
| --- | --- |
| 502 | 赤色药水 |
| 569 | 初学者专用药水 |
| 1604 | 橡木魔杖 |
| 7619 | 浓缩铝 |
| 7620 | 浓缩神之金属 |
| 7621 | 原地复活之证 |
| 12848 | 猎鹰魔笛 |

## 本次验证与本机状态

客户端 314 个测试文件、1,978 项通过；目录工具 26 项、服务端 Python 17 项通过，Go API 全量测试通过。客户端以 `--all` 构建，文档站构建通过；11 份 LUB 语义回环通过，4 份变更 LUB 已备份并安装。Gateway 已重启，HTTP 返回的 ItemInfo 和卡片前缀与当前产物哈希一致。Admin 资料已原子导入为 generation 9（29,356 物品、2,675 魔物、13,432 NPC）。游戏地图服未重启，服务端名称及 NPC 对话的内存状态尚需维护窗口重载后验证。

## 再次复查修正

- 排除 255 个缺少来源内部标识的条目，防止“未命名道具”及纯汉字日文标签被当成已核实中文；RO321 本次新增核实 33 个 ID，包括确认 5815 为古雅帽子，5816 仍待核对。
- 拆分无空格的插槽后缀（例如“古雅帽子[1]”），避免重复显示洞数。
- 按 `<ITEM>` 内的明确 ID 修正 207 段任务／提示文字，保留颜色及括号。
- 修正 13 处任务答案判定，使用数据库当前物品名；普通谜题中的“斧头”等并非实际背包物品，不替换。
- 根据 `unknown_d(questID,itemID)` 补齐 33 个艾尔迪卡斯特文档材料标签。
- 撤回技能“龙之吐息”、职业“狙击手”和普通描述“神圣十字钝器”的同名误替换；78 段贵族／帝国／恩典魔法披肩引用按完整装备身份更新为对应斗篷名称。

## 全脚本追加检查

扫描全部 1,140 份 NPC 脚本的比较表达式及 case 行，筛出 18 处与旧物品名相同的字符串；检查后未发现新增的物品名输入判定遗漏。保留武器类别、剧情书名和谜题用词；按明确物品 ID 修正乐园团强化菜单的三件装备名称。候选证据见 `work/item-name-sources/all-npc-answer-audit.json`。此检查不代表所有自然语言引用均已审核。

单个 ID 补抓和请求中断现在保留已有来源快照；只有完整取得小册子列表后才替换全量快照。新增成功补抓和 HTTP 403 中断的离线回归测试，不需要再次请求网站。

RO321 补查采用单线程，默认每次至多 20 条、请求间隔至少 5 秒（本次试跑使用 8 秒）；自动跳过已有来源记录，每条成功立即保存快照，缓存保留原页哈希。优先检查客户端实际使用且未取得 RO321 资料的 ID，避免重复请求整份列表。401／403／429 立即停止，不轮换代理或身份。单批成功只表示该批完成，不将 RO321 标记为全量完成。

限速首批 10 条查询成功，均为英文标题，未新增可采用中文名称；后续批次日志位于 `work/item-name-sources/paced-ro321-next.log`，进程信息在 `paced-ro321-job.json`。新增抓取资料尚未用于重建产品名称映射。

## 完整 RO321 扫描进行中

完整扫描入口：

```bash
python3 tools/localization/items/ro321_scan.py scan --output work/item-name-sources --interval 8 --no-color
```

2026-10-24 追加检查公开分类导航，确认包括之前遗漏的租赁物品（18）和认养宠物之物品（91）。13 个分类合计 2,421 页；不同分类可能重复收录同一 ID，合并时同时核对原始名称与内部标识，冲突立即停止。扫描复用已验证缓存、单线程限速、各分类轮流补缺，每页原子保存名称快照和进度；分页变化、未识别响应或拒绝访问均停止。进程互斥防止重复启动同一个列表扫描。

实时进度以 `work/item-name-sources/source-status.json` 为准，日志为 `full-ro321-scan.log`。目前尚未完成；后续依次核对全页覆盖及去重数量、生成新增中文映射与冲突清单、同步服务端／客户端／后台资料及明确 ID 引用、重新编译和验证受影响资源。没有可核对中文资料的 ID 继续保留现名，不自行翻译。扫描完成不等于网站为所有物品提供了中文名。

扫描器的中断保存、断点续跑、标识冲突和拒绝响应处理已通过离线测试；目录工具当前共 36 项通过。

映射生成器支持 `--output DIR`，可先生成审查副本，避免扫描期间反复改写产品映射。读取来源时校验记录数，输出哈希直接取自解析的同一份字节；缺少快照或记录数不一致时停止。`source-conflicts.json` 随映射写入输出目录，记录两个来源对同一身份采用不同中文名称的情况。

名称同步同时覆盖当前 Renewal／共用 NPC 脚本字符串内的明确 `<ITEM>` 链接，跳过 Pre-Renewal 脚本，不改代码和注释，并转义名称中的脚本字符串字符。自然语言中的普通词语与模糊名称仍需人工核对，不全局替换。

最终扫描完成必须运行独立缓存审计：

```bash
python3 tools/localization/items/audit_ro321.py check --references work/item-name-sources --require-complete --no-color
```

审计逐分类检查全部页码、URL、原页哈希格式、每页行数、分类内重复 ID、跨分类身份冲突、补查记录与最终快照的一致性；仅有进程成功或状态文件的 complete 标志不算完成。报告写入 `ro321-cache-audit.json`。接近末页时网站隐藏“最后”按钮，解析器现从全部数字分页链接计算末页；旧缓存中受影响的 15 页重新获取，并核对物品行保持一致后更新分页元数据与页面哈希。

## items.php 入口全量扫描

已按用户要求以 4 并发完成该入口公开网格视图的 295 页、29,500 个 ID 扫描，并逐页核验原页与快照。详细列表存在源站 HTML 截断；网格视图不提供内部标识。与原入口的全量差异及 15 项中文名称对照见 [扫描审计报告](DVG-ITEMS-AUDIT.md)。此次未替换正式翻译映射；RO321 保持暂停。
