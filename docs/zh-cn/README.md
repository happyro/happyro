# HappyRO 中文汉化

本目录记录 HappyRO `lang/zh-cn` 分支的汉化范围、扫描结果、翻译进度和术语约定。

## 文档导航

- [扫描基线](translation-scan-baseline.md)：扫描范围、排除规则、统计和生成命令
- [翻译进度](translation-progress.md)：批次、状态、完成数量和下一步
- [源码修改清单](source-files.tsv)：实际被翻译修改过的产品源文件
- [术语和人名表](terms-names.csv)：稳定译名、术语及保留原样项
- [翻译候选表](translation-candidates.csv)：需要长期人工跟踪的候选文本

## 扫描工具

扫描工具位于：

```text
scripts/scan-localization-inventory.py
```

运行：

```bash
python3 scripts/scan-localization-inventory.py
```

原始扫描结果写入 `work/localization/`，属于可重建生成物，不提交到 Git。

## 工作顺序

1. 运行扫描器并更新 `work/localization/` 下的候选清单。
2. 按 [翻译进度](translation-progress.md) 选择翻译批次。
3. 直接修改对应仓库中的产品源码，不建立新的 locale 或 overlay 源码树。
4. 将实际修改文件登记到 [源码修改清单](source-files.tsv)。
5. 将新增译名和保留项登记到 [术语和人名表](terms-names.csv)。
6. 重新扫描并更新进度文档。

翻译必须遵守根仓库 [AGENTS.md](../../AGENTS.md) 中的仓库边界、标识符保护和分支规则。
