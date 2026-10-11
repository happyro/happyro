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

直接维护本目录已审查的 JSON 与文本，不恢复旧 Agent 分片。编译与语义校验见 [LUB 构建说明](../../../tools/client/build/README.md)，安装到运行目录后须校验目标哈希并记录来源。

`merged/files/` 是现行消费者使用的版本化源路径，直接维护其中 JSON/文本；`manifest.tsv` 和 `validation/` 仅记录源材料形成时的来源与校验，不代表当前全部修改已复测。重新构建的验证结果写入本次 artifacts/ 清单，不通过分片合并或晋级工具更新源。
