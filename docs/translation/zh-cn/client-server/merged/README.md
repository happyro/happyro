# client-server 完整合并结果

本目录保存四个 agent 译文切片合并后的完整 client 和 server 文件，是本工作区内 Git 跟踪的合并结果。

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

合并前的临时结果放在 `work/translation-merge/client-server/<batch>/`。确认后再将完整文件复制到 `files/`，后续回写脚本以此目录为输入，写入目标项目工作树。
