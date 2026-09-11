# client-server 完整合并结果

本目录保存四个 agent 译文切片合并后的 client 和 server 文件。当前正式基准为 `canonical-20260825-01`，使用冻结基线重新合并并重新纳入已确认的根因修复；manifest 登记 2,099 个源目标，实际输出 838 个发生翻译或需要保留的文件。

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

合并前的临时结果放在 `work/translation-release/client-server/<batch>/`。发布工具通过 `--promote-merged` 将完整文件、manifest、BATCH_STATE 和验证记录一起晋级；通过 `--target-root` 回写两个独立源码仓库。当前批次的验证记录仍包含需人工复核的结构提示，详见 `validation/merge-warnings.tsv`。
