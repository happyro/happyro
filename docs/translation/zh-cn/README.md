# 中文翻译工作区

本目录包含两个相互独立的中文翻译工作区：

- [`client-server/`](client-server/README.md)：HappyRO client 和 server 项目的主产品翻译工作区；
- [`kro-20211105/`](kro-20211105/README.md)：kRO 2021-11-05 官方客户端资源的独立翻译工作区。

两个工作区分别维护自己的清单、进度、术语表、基准文件和 agent 目录，不共用工作状态文件。

## 工作区边界

主产品翻译工作区：

```text
docs/translation/zh-cn/client-server/
```

kRO 专用翻译工作区：

```text
docs/translation/zh-cn/kro-20211105/
```

每个工作区的 agent 都位于各自的 `agents/` 目录下。kRO 的提取基准和状态记录也只属于 kRO 工作区，不写入主产品工作区。

## 分片合并与回写

翻译分片完成后，先在被 Git 忽略的临时目录中合并和校验：

```text
work/translation-merge/<workspace>/<batch>/
└── merged/
    ├── manifest.tsv                    # 本次运行的来源和状态清单
    ├── files/                          # 本次运行的完整合并结果
    └── validation/merge-warnings.tsv   # 结构和标记复核项
```

确认结果后，将完整文件复制到对应工作区的 Git 跟踪目录：

```text
docs/translation/zh-cn/<workspace>/merged/
├── README.md
├── manifest.tsv
├── files/           # 按目标源文件的相对路径保存完整文件
└── validation/      # 已确认的校验记录
```

`agents/*/chunks/translated/` 保留原始译文分片，`merged/` 保存整个工作区的完整合并结果。后续回写或编译脚本以 `merged/files/` 为输入，生成到 `artifacts/` 或目标项目资源目录。`inputs/official/` 和 `inputs/runtime/kro-20211105/` 中的官方源材料保持只读，不直接覆盖。

合并器和分片校验器的职责、命令和校验边界见 [`tools/translation/README.md`](../../../tools/translation/README.md)。

本次合并问题修复批次见 [`repair/20260824-01/`](repair/20260824-01/)。其中的 `agent-01` 至 `agent-12` 互相独立，全部完成后再统一收集修复分片并重新合并。
