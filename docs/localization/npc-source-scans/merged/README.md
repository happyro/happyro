# NPC 身份对齐与名称校准

这是基于本次两站扫描的独立决策表，未读取旧 NPC 名称方案，也未读取游戏名称来反推网站结论。名称均直接选自来源，不自行翻译。不修改游戏。

## 身份规则

地图内部名与精确坐标生成位置候选；只有两站各一条、可用中文名忽略空白一致时，标记“名称与位置对齐”。此标记为资料层面的对齐，不等于运行脚本身份已验证。

同位置异名、多记录、英文或隐藏标签不强制合并身份。同名不同位置保持独立。RO321 的图片 URL 是标签图，不是 NPC 形象 ID；不能与 DVG 的 spriteId 比较。两站版本不同，单站缺失不代表另一站错误。坐标不同不自动靠近匹配。

## 名称规则

- `agree`：两站一致，保留 DVG 原文。
- `retain-single-source`：仅单站收录且有可用中文名，原样保留。
- `prefer-chinese-pending-identity`：仅一站有可用中文名，以该名为候选，身份仍待核对。
- `prefer-dvg-pending-identity`：两站中文不同，候选优先 DVG 当前国服导航原文；这是统一的来源选择策略，不是对名称真实性或同一身份的断言。
- `hold-multiple-identities`：同位置多记录，不选择统一名。
- `hold-no-chinese-evidence`：没有可信中文原文，不自行翻译，不把隐藏标签当名称。

空白只用于比较，不改写选定原文；不做未经核实的繁简或专名替换。每项记录有原名、来源键、URL、建议名、理由和身份状态。

## 待核对边界

校准已覆盖全部来源记录；有歧义者明确保留，不伪装成确定答案。`review-queue.json` 保存身份待核对或缺中文依据的组。后续只有要应用具体项时，才按需查详情、任务上下文或脚本标识。本阶段不批量下载详情，不自动应用待核对候选。

## 统计

- `hold-no-chinese-evidence`：2729
- `retain-single-source`：3898
- `hold-multiple-identities`：219
- `prefer-chinese-pending-identity`：1172
- `prefer-dvg-pending-identity`：720
- `agree`：1286

## 分片

- [decisions/001.md](decisions/001.md)
- [decisions/002.md](decisions/002.md)
- [decisions/003.md](decisions/003.md)
- [decisions/004.md](decisions/004.md)
- [decisions/005.md](decisions/005.md)
- [decisions/006.md](decisions/006.md)
- [decisions/007.md](decisions/007.md)
- [decisions/008.md](decisions/008.md)
- [decisions/009.md](decisions/009.md)
- [decisions/010.md](decisions/010.md)
- [decisions/011.md](decisions/011.md)
- [decisions/012.md](decisions/012.md)
- [decisions/013.md](decisions/013.md)
- [decisions/014.md](decisions/014.md)
- [decisions/015.md](decisions/015.md)
- [decisions/016.md](decisions/016.md)
- [decisions/017.md](decisions/017.md)
- [decisions/018.md](decisions/018.md)
- [decisions/019.md](decisions/019.md)
- [decisions/020.md](decisions/020.md)
- [decisions/021.md](decisions/021.md)
- [decisions/022.md](decisions/022.md)
- [decisions/023.md](decisions/023.md)
- [decisions/024.md](decisions/024.md)
- [decisions/025.md](decisions/025.md)
- [decisions/026.md](decisions/026.md)
- [decisions/027.md](decisions/027.md)
- [decisions/028.md](decisions/028.md)
- [decisions/029.md](decisions/029.md)
- [decisions/030.md](decisions/030.md)
- [decisions/031.md](decisions/031.md)
- [decisions/032.md](decisions/032.md)
- [decisions/033.md](decisions/033.md)
- [decisions/034.md](decisions/034.md)
- [decisions/035.md](decisions/035.md)
- [decisions/036.md](decisions/036.md)
- [decisions/037.md](decisions/037.md)
- [decisions/038.md](decisions/038.md)
- [decisions/039.md](decisions/039.md)
- [decisions/040.md](decisions/040.md)
- [decisions/041.md](decisions/041.md)
