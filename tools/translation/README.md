# 翻译工具

## 工具职责

| 工具 | 用途 | 阶段 |
| --- | --- | --- |
| [`merge/main.py`](merge/main.py) | 将各 agent 的译文分片合并成完整文件，并生成来源清单 | 合并 |
| [`check-output/main.py`](check-output/main.py) | 检查单个 agent 的译文文件、占位符、颜色码、转义符和清单登记 | 合并前 |
| [`check-merged-indentation/main.py`](check-merged-indentation/main.py) | 检查完整文件回拼后的缩进变化 | 合并后 |
| [`../workspace/validate-kro/main.mjs`](../workspace/validate-kro/main.mjs) | 检查 kRO 总清单、agent 清单、切片范围和提取单元一致性 | 工作区维护 |

临时合并结果写入 `work/translation-merge/<workspace>/<batch>/`；确认后再复制到对应工作区的 `merged/files/`。这些工具不修改 agent 分片、官方输入或独立 client/server 仓库。

合并器按职责拆分在 [`merge/`](merge/) 包中：`cli.py` 负责参数和流程编排，`manifest.py` 负责清单读取与分组，`client.py` 和 `kro.py` 分别处理两类工作区，`checks.py` 集中处理行、结构、标记和 JSON 校验，`writer.py` 写出合并清单与复核报告；`main.py` 仅作为可直接执行的薄入口。命令不带参数时只显示帮助，不执行合并。

## 合并器

### client-server

```bash
python3 tools/translation/merge/main.py \
  --workspace client-server \
  --output work/translation-merge/client-server/batch-01/merged/files
```

`file` 工作单元直接复制完整译文；`chunk` 工作单元以仓库源文件为基准，按清单的行范围替换已翻译分片，`跳过` 分片保留源内容。所有工作单元必须处于终态；源切片与仓库对应行发生漂移时合并失败。

译文分片的物理行数默认允许变化。合并器按源文件的原始行范围顺序拼接，并检查非对白结构签名、颜色码、占位符和转义符；行数变化会写入合并清单并将对应文件标为 `需复核`。如需执行旧的严格行数规则，可加 `--strict-line-count`。

### kRO 2021-11-05

```bash
python3 tools/translation/merge/main.py \
  --workspace kro-20211105 \
  --output work/translation-merge/kro-20211105/batch-01/merged/files
```

kRO 的 LUB 分片是带 `{}` 或 `[]` 框架的规范化 JSON；合并器会去掉每片的外层框架、按顺序拼接记录并重新校验完整 JSON。直接文本会保留其完整文件格式。存在 `待处理`、`进行中` 或 `阻塞` 单元时默认失败；仅在临时排查时使用 `--allow-incomplete`，此时未解决分片使用源内容并在合并清单中标记为 `不完整`。

kRO 的译文分片同样默认允许物理行数变化。合并器以源 JSON 为结构骨架，只替换字符串文本；缺失或新增的非翻译字段、数值和类型变化不会写入结果，而是保留源值并记录复核警告。描述文本数组的长度变化会记录为复核警告；页面数组会尽量按页面边界重建，无法安全重建时保留源页面。JSON 解析或分片组合失败仍会中止合并；如需严格物理行数检查，使用 `--strict-line-count`。

输出目录的上一级自动生成 `manifest.tsv`，记录逻辑源路径、完整输出路径、分片统计、行数变化和是否完整；`validation/merge-warnings.tsv` 保存结构签名或受保护标记的复核项。工具不会清理已有输出；需要重新开始时请指定新的 batch 目录。
