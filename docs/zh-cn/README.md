# HappyRO 中文汉化

本目录只维护中文汉化的工作规则和空白记录表。翻译从进度 0 开始，不继承旧批次、旧术语或旧源码修改记录。

## 文档导航

- [扫描基线](translation-scan-baseline.md)：当前代码树的扫描范围、统计和生成结果
- [翻译进度](translation-progress.md)：从 0 开始的批次状态
- [源码修改清单](source-files.tsv)：实际完成翻译后登记的产品源文件
- [术语和人名表](terms-names.csv)：翻译过程中新增的稳定译名和保留原样项
- [翻译候选表](translation-candidates.csv)：需要人工跟踪的候选项

## 扫描工具

扫描工具位于：

    scripts/scan-localization-inventory.py

运行：

    python3 scripts/scan-localization-inventory.py

扫描器读取根仓库、server 和 client 的 Git 跟踪文件，将可疑非中文文本写入 work/localization/。这些输出属于可重建生成物，不提交到 Git。

## 工作规则

1. 以 translation-scan-baseline.md 作为本轮翻译的唯一初始基准。
2. 按 work/localization/translation-files.tsv 和 scan-batches.tsv 选择功能域批次。
3. 直接修改对应仓库中的产品源文件，不建立 locale 或 overlay 源码树。
4. 完成并复核翻译后，才将实际修改过的产品源文件登记到 source-files.tsv。
5. 新增稳定译名、人名和保留原样项登记到 terms-names.csv。
6. 需要长期人工跟踪但尚未完成的候选项登记到 translation-candidates.csv。
7. 每完成一个批次重新运行扫描器，检查残留候选和新增文件，并更新 translation-progress.md。

所有翻译必须遵守根仓库 AGENTS.md 中的仓库边界、标识符保护和分支规则。当前阶段不进行自动测试，全部源码翻译完成后由用户统一手动验收。
