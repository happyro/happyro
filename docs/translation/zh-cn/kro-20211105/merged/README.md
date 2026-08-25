# kRO 完整合并结果

本目录保存 kRO 2021-11-05 各 agent 译文切片合并后的正式文件。当前正式基准为 `canonical-20260825-01`；`files/`、`manifest.tsv` 和 `validation/` 已齐备，manifest 实际输出 12 个文件。

## 目录约定

```text
merged/
├── README.md
├── manifest.tsv       # 完整文件、源路径和分片来源
├── files/             # 按目标源文件相对路径保存完整文件
└── validation/        # 已确认的合并和格式校验记录
```

合并前的临时结果放在 `work/translation-release/kro-20211105/<batch>/`，不得将临时目录直接作为正式结果。发布工具通过 `--promote-merged` 晋级 `files/`、manifest、BATCH_STATE 和验证记录；kRO 的回编译和运行时发布通过 `--runtime-root` 完成。官方输入材料保持只读，运行时写回前会在批次目录中备份被替换文件。
