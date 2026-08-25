# client-server 完整合并结果

本目录用于保存四个 agent 译文切片合并后的完整 client 和 server 文件。当前只有目录约定，已验证的临时合并结果尚未晋级，因此 `manifest.tsv`、`files/` 和 `validation/` 仍缺失，不能从本目录执行正式 writeback。

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

合并前的临时结果放在 `work/translation-merge/client-server/<batch>/`。必须按 [`../../WORKFLOW.md`](../../WORKFLOW.md) 同时晋级完整文件、manifest 和验证记录；三者齐备并复核 Git diff 后，本目录才是正式回写输入。
