# 地图名称来源审计

按地图内部名（例如 `prontera`、`alberta`）关联两站与项目；网站数字 ID 仅作来源信息，不当作项目地图 ID。RO321 的 `1@pop1(hard)`、`1@nyr(daily)` 等模式后缀按来源原样保留为独立键，不擅自去掉后缀并到普通副本。

## 范围

- RO 小册子：国服正式服、简体中文的地图列表全部分页，保留原名、站内 ID、内部名、尺寸、区域和详情链接。首份目录显示 1,271 条、64 页。
- RO321：从地图大全出发，采集复兴后区域和地图入口，区域页有明确的单张地图名称时直接记录；仅有区域标签、缺名或冲突时查询详情，详情中新发现的链接继续补查，按内部名去重。不逐一请求已有名称的详情，不声称遍历全部传送网络。只使用 `re_mob=1` 版本，不混用复兴前数据。不声称覆盖没有公开链接的隐藏地图。
- 项目：客户端 `src/DB/Map/MapTable.js` 执行现有翻译映射后的显示名，首次快照 1,109 项。
- 输出：两站独立原始名称清单、页面哈希、覆盖核验、与项目的差异、合并建议。名称采用来源原文，不自行翻译；不自动修改游戏资源和产品代码。

## 本次结果

| 项目 | 数量 |
| --- | ---: |
| 小册子目录页 / 地图名称 | 64 / 1,271 |
| RO321 内容页 / 地图名称（复兴后） | 400 / 821 |
| 两站共有地图键 | 806 |
| 两站原名完全一致 | 167 |
| 仅空白不同 | 83 |
| 其他名称差异 | 556 |
| 合并两站与项目后的地图键 | 1,303 |
| 项目现有地图 | 1,109 |
| 项目地图在两站都未收录 | 17 |
| 按来源优先级建议改变项目显示名 | 946 |

946 项是来源优先级产生的名称建议，不表示现名均有错误；常见差异包括城市前缀、楼层写法、别名及空格。原始名称与候选全部保留，尚未应用到游戏。

项目中 20 项“初心者修炼场”按用户既定命名保留；60 项因缺少可确认的外部中文名称而保留现名。88 个仅在外部来源出现、且没有可用中文名称的地图键留空，不自行翻译。

## 采集与复现

扫描入口：`tools/resources/maps/scan_names.py`。原始 HTML、抓取时间、页面哈希和可恢复进度保存在 `work/map-name-sources/`；文档数据按每 250 条拆分。

```sh
python3 tools/resources/maps/scan_names.py scan --site dvg --output work/map-name-sources
python3 tools/resources/maps/scan_names.py scan --site ro321 --output work/map-name-sources --interval 1 \
  --verify-map treasure01 --verify-map kh_kiehl01 --verify-map iz_ac01 --verify-map bat_a01 \
  --verify-map que_thor --verify-map int_land --verify-map bossnia_01 --verify-map lhz_dun_n
python3 tools/resources/maps/export_names.py export --input work/map-name-sources --output docs/localization/map-name-scans
```

RO321 抽查 `treasure01`、`kh_kiehl01`、`iz_ac01`、`bat_a01` 等区域页明确给出的名称与详情页一致；`lhz_dun_n` 的区域标签与详情名不同，证明不能把只有区域标签的标题当作单张地图名称。

每站最多两个并发连接。最初每次新请求至少间隔两秒；用户要求加速后，RO321 改为间隔一秒，小册子已在两秒间隔阶段完成。错误时停止该站并保存断点，再运行会校验缓存哈希并续扫；不把 HTTP 200 本身当作成功，需通过页面结构和身份核验。

初次普通 HTTP 请求出现 403；沿用此前来源扫描工具的请求标识后，两站目录和样本页成功返回正文。此为本次观察，不推定 403 的具体服务端原因。

扫描及合并对照已完成；核验见 [verification.json](verification.json)。

- [小册子原始名称](dvg/README.md)
- [RO321 复兴后原始名称](ro321/README.md)
- [两站名称差异](comparison/README.md)
- [合并建议](merged/README.md)

本次未修改产品地图名称，未提交或推送。
