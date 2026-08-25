# client-server 完整合并结果

本目录保存四个 agent 译文切片合并后的完整 client 和 server 文件。本批次已将 `work/translation-merge/repair-20260824-01-run3/client-server/merged/` 晋级到这里，包含 2,099 个文件、manifest 和结构复核记录，可作为正式 writeback 输入。

## 目录约定

```text
merged/
├── README.md
├── manifest.tsv       # 完整文件、源路径和分片来源
├── files/
│   ├── client/        # client 源文件的相对路径
│   └── server/        # server 源文件的相对路径
└── validation/        # 已确认的合并和格式校验记录
```

合并前的临时结果放在 `work/translation-merge/client-server/<batch>/`。正式目录必须同时保存完整文件、manifest 和验证记录；三者齐备并复核 Git diff 后，才能作为正式回写输入。当前批次的验证记录仍包含需人工复核的结构提示，详见 `validation/merge-warnings.tsv`。
