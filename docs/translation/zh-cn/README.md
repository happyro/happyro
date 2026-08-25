# 中文翻译工作区

完整的翻译、校验、repair、合并晋级、回写、kRO 回编译、运行验证和 bugfix 回溯顺序，以 [`WORKFLOW.md`](WORKFLOW.md) 为准。本 README 只介绍工作区结构。

本目录包含两个相互独立的中文翻译工作区：

- [`client-server/`](client-server/README.md)：HappyRO client 和 server 项目的主产品翻译工作区；
- [`kro-20211105/`](kro-20211105/README.md)：kRO 2021-11-05 官方客户端资源的独立翻译工作区。
- [`npc-names/`](npc-names/README.md)：常用城镇 NPC 名称的独立中文翻译计划。

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
work/translation-release/<workspace>/<batch>/
└── merged/
    ├── manifest.tsv                    # 本次运行的来源和状态清单
    ├── files/                          # 本次运行的完整合并结果
    └── validation/merge-warnings.tsv   # 结构和标记复核项
```

确认结果后，使用发布工具的 `--promote-merged --write` 将完整文件、manifest、BATCH_STATE 和验证记录晋级到对应工作区的 Git 跟踪目录；kRO 的运行时资源另通过 `--runtime-root` 明确写回：

```text
docs/translation/zh-cn/<workspace>/merged/
├── README.md
├── manifest.tsv
├── files/           # 按目标源文件的相对路径保存完整文件
└── validation/      # 已确认的校验记录
```

`agents/*/chunks/translated/` 保留原始译文分片，`merged/` 保存整个工作区的完整合并结果。后续回写或编译脚本以 `merged/files/` 为输入，生成到 `artifacts/` 或目标项目资源目录。`inputs/official/` 和 `inputs/runtime/kro-20211105/` 中的官方源材料保持只读，不直接覆盖。

合并器和分片校验器的职责、命令和校验边界见 [`tools/translation/README.md`](../../../tools/translation/README.md)。

Repair 是校验失败时的条件回路，不是每次翻译必经阶段。本次修复已回填原工作区 translated 分片，并在最新正式基准 `canonical-20260825-01` 中完成校验、合并和回写；过程 repair 目录不作为长期维护入口。
