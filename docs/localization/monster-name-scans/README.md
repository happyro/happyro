# 魔物名称与资料来源扫描

本目录保存应用前的两站扫描与按 ID／内部名合并快照。后续修正及逐项证据见[魔物名称应用审查](application/README.md)；扫描与候选统计保持应用前基线。

| 来源 | 页面 | 唯一魔物 ID |
| --- | --- | --- |
| [RO小册子](dvg/README.md) | 128 | 2555 |
| [RO321 复兴](ro321/README.md) | 382 | 2564 |
| 项目当前 API Renewal 目录 | — | 2675 |

[完整合并对照](merged/README.md) · [两站中文冲突](merged/chinese-conflicts.md) · [全部原文差异](merged/conflicts.md) · [候选修改](merged/changes.md) · [未决项](merged/unresolved.md) · [统计](summary.json) · [独立验证](verification.json) · [文档校验](document-verification.json)

## 采集范围

小册子遍历无过滤、ID 排序的魔物列表及全部分页，记录国服正式服／简体中文列表的名称、内部名、属性、游戏内战斗参数、掉落及地图链接。RO321 遍历十种种族的复兴目录及全部分页，补查小册子与本项目仍未覆盖的 ID，记录名称、属性、掉落／技能／地图链接。未逐页采集小册子全部详情的深层技能条件、刷新明细；相关详情链接保留供后续专项审查。

RO321 只接受 `page=re_mob_db`。`page=mob_db&re_mob=1` 仍可能返回复兴前数据，禁止混用。RO321 明确返回无匹配结果的 ID 单独记录；目录范围不代表网站无链接隐藏记录。两站可能共有上游，交叉一致不等于官方版本确认。

## 合并结果

两站原文相同 906 项、不同 1648 项；原文差异也包括中文与外文，不全部视为两套中文译名冲突。

| 可用中文对照 | ID 数 |
| --- | --- |
| 两站中文一致 | 874 |
| 两站中文冲突 | 192 |
| 仅小册子提供可用中文 | 9 |
| 仅 RO321 提供可用中文 | 1359 |
| 无可靠中文候选 | 251 |

- 含可用中文字形的来源名称：小册子 1075，RO321 2425；收录 ID 不等于全部已有中文名。原文含问号／替换字符的条目为 {"dvg": 5, "ro321": 4}，只保留原文证据、不选作候选；原文含韩文的条目为 {"dvg": 149, "ro321": 0}，不选作可靠中文；纯英文／内部名保留原文，不自行翻译；RSX-0806 等本就可能是合法字母名称，未选为中文候选不表示其错误。
- 项目名称不同的合并候选：767；这不是已确认错误或已应用修改的数量。
- 两站可比较属性存在差异：1071 个 ID；所有来源值保留，不自动改写游戏规则。
- 缺少可靠中文或身份冲突时不制造名称。原始名称中的符号、变体编号和前后缀保留。

## 证据与复现

原始 HTML、断点与扫描日志位于本机 `work/monster-name-sources/`。正式文档按 250 条 JSON／100 条 Markdown 分片；源页面列表保存 URL、抓取时间、编码、哈希。project-baseline.json 固定项目目录内容哈希、各仓库提交与当前名称。

```sh
python3 tools/resources/monsters/scan_sources.py scan --site both
python3 tools/resources/monsters/scan_sources.py supplement --site ro321
python3 -m tools.resources.monsters.verify_sources verify
python3 -m tools.resources.monsters.merge_sources publish
python3 -m tools.resources.monsters.verify_docs verify
```

每站单连接、两次请求开始时间至少间隔 2 秒，缓存按哈希校验；请求／解析失败停止该站并记录断点，不将失败页面算作不存在。解析器回归与独立 HTMLParser 对所有页面名称及内部名逐项复核，覆盖分页连续性、重复 ID 与分片哈希。
