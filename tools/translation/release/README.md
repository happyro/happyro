# 翻译发布编排

`release/main.py` 是完整翻译发布流程的编排入口。校验器、合并器、编译器和回写工具仍分别负责自己的行为；本命令只负责阶段顺序、路径、日志和失败处理。

实现按职责拆分为 `cli.py`（参数和入口）、`state.py`（批次状态）、`stages.py`（子流程执行和日志）、`promotion.py`（正式 merged 晋级）以及 `runtime.py`（LUB/文本运行时回写）。

## 临时批次目录

每次运行都必须使用以下目录下的新批次目录：

```text
work/translation-release/<workspace>/<batch>/
```

The directory contains:

| 路径 | 用途 |
| --- | --- |
| `STATE.json` | 阶段状态、时间和输出路径 |
| `merged/BATCH_STATE` | 供 writeback 读取的批次生命周期状态 |
| `logs/validate-chunks.log` | 分片校验输出 |
| `merged/files/` | 本次生成的完整合并文件 |
| `merged/manifest.tsv` | 合并来源和输出路径清单 |
| `merged/validation/merge-warnings.tsv` | 合并复核警告 |
| `logs/merge.log` | 合并命令输出 |
| `logs/validate-merged.log` | merged 文件校验输出 |
| `artifacts/lua50/` | Lua 5.0 LUB 文件和编译清单，仅 kRO 使用 |
| `artifacts/lua51/` | Lua 5.1 LUB 文件和编译清单，仅 kRO 使用 |
| `logs/build-lua*.log` | Lua 编译输出，仅 kRO 使用 |
| `backup/writeback/` | 使用 `--write` 时被替换的目标文件备份 |
| `logs/writeback.log` | writeback 预览或写入输出 |
| `backup/runtime/` | 使用 `--runtime-root` 和 `--write` 时被替换的运行时文件备份 |
| `logs/runtime-writeback.log` | 运行时 LUB/文本回写预览或输出 |
| `backup/formal-merged/` | 使用 `--promote-merged` 和 `--write` 时被替换的正式 merged 文件备份 |
| `logs/promote-merged.log` | 正式 merged 晋级预览或输出 |

发布目录不会重复使用。再次运行必须指定新的批次名称，避免把旧的失败结果误认为新的 canonical 结果。

## 使用命令

预览完整的 kRO 流程：

```bash
python3 tools/translation/release/main.py \
  --workspace kro-20211105 \
  --batch canonical-20260825-01 \
  --target-root client=docs/translation/zh-cn/kro-20211105/merged/files
```

检查 `STATE.json`、日志、merged 文件和编译清单后，再增加 `--write` 发布清单中的文件。只有明确提供 `--write` 才会写入目标文件；命令不会删除目标中的旧文件、修改数据库或重启服务。

要将本次结果晋级为正式 `docs/translation/zh-cn/<workspace>/merged/`，增加 `--promote-merged`。该选项会写入 `merged/files/`、`manifest.tsv`、`BATCH_STATE` 和 `validation/`，并备份被替换的正式文件：

```bash
python3 tools/translation/release/main.py \
  --workspace kro-20211105 \
  --batch canonical-20260825-01 \
  --promote-merged \
  --write
```

`--promote-merged` 也可以不加 `--write` 用于预览。它不会自动回写源码仓库或运行时；这些目标仍需分别通过 `--target-root` 和 `--runtime-root` 指定。

如果当前源码仓库已经包含此前回写结果，必须用 `--repo-root` 指定与 agent 分片对应的冻结源码基线；它只影响合并和校验输入，不改变回写目标：

```bash
python3 tools/translation/release/main.py \
  --workspace client-server \
  --batch canonical-20260825-01 \
  --repo-root client=/path/to/frozen/happyro-client \
  --repo-root server=/path/to/frozen/happyro-server \
  --target-root client=repos/happyro-client \
  --target-root server=repos/happyro-server \
  --promote-merged --write
```

要部署 kRO 运行时文件，必须明确指定运行时根目录。命令会发布编译后的 Lua 5.0/5.1 `.lub` 文件和直接文本文件（从运行时路径中去掉 `text/`），并在当前批次中备份被替换的文件：

```bash
python3 tools/translation/release/main.py \
  --workspace kro-20211105 \
  --batch canonical-20260825-01 \
  --target-root client=docs/translation/zh-cn/kro-20211105/merged/files \
  --runtime-root inputs/runtime/kro-20211105/client \
  --write
```

对于 `client-server`，默认 dry-run 目标是两个独立仓库。如果目标是其他 staging 或发布目录，请明确提供 `--target-root` 映射。

client-server 的历史译文可能保留与冻结源码不同的缩进，merged 校验会报告审阅告警但不一定表示语法错误。确认日志中的 `Errors: 0` 后，可显式增加 `--allow-review-findings` 让本批次继续晋级；该选项不会放过校验错误。
