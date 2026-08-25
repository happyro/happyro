# kRO 完整合并结果

本目录保存 kRO 2021-11-05 各 agent 译文切片合并后的完整文件，是准备纳入 Git 跟踪的正式翻译产物。当前 `files/`、`manifest.tsv` 和 `validation/` 已齐备，但在根仓库提交前仍属于未跟踪变更。

## 目录约定

```text
merged/
├── README.md
├── manifest.tsv       # 完整文件、源路径和分片来源
├── files/             # 按目标源文件相对路径保存完整文件
└── validation/        # 已确认的合并和格式校验记录
```

合并前的临时结果放在 `work/translation-merge/kro-20211105/<batch>/`，不得将临时目录直接作为正式结果。后续回写或回编译以 `files/` 为输入；正式提交必须同时包含 manifest 和验证记录。官方 `inputs/runtime/kro-20211105/client/` 源文件保持只读。
