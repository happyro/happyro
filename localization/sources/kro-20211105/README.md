# kRO 2021-11-05 回编译源

本目录保存已审查的 kRO 翻译 JSON 和直接文本，供 LUB 回编译和物品目录生成读取。官方安装包仍在 `inputs/official/`，运行时 LUB 写在 `inputs/runtime/kro-20211105/`。

```text
merged/
├── files/lub/     itemInfo_true.json 等 11 个 JSON
├── files/text/    GuildTip.txt 等直接文本
├── manifest.tsv
└── validation/
```

默认构建输入：

```bash
python3 tools/client/build/lua50/main.py build
python3 tools/client/build/lua51/main.py build
python3 tools/resources/catalog/main.py items client
```

历史 Agent 分片和提取基准仍在 `archive/translation/zh-cn/kro-20211105/`。
