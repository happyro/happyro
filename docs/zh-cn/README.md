# HappyRO 中文汉化

本目录只维护中文汉化的工作规则和空白记录表。翻译从进度 0 开始，不继承旧批次、旧术语或旧源码修改记录。

## 文档导航

- [扫描基线](translation-scan-baseline.md)：当前代码树的扫描范围、统计和生成结果
- [翻译进度](translation-progress.md)：从 0 开始的批次状态
- [已翻译文件](translated-files.tsv)：agent 完成翻译后登记的产品源文件
- [术语和人名表](terms-names.csv)：翻译过程中新增的稳定译名和保留原样项
- [翻译总清单](translation-manifest.tsv)：全量候选文件、agent 分配和状态
- [Agent 工作目录](agent-01/)：四个独立 agent 的候选、进度和术语记录

## 扫描工具

扫描工具位于：

    scripts/scan-localization-inventory.py

运行：

    python3 scripts/scan-localization-inventory.py

扫描器读取根仓库、server 和 client 的 Git 跟踪文件，将可疑非中文文本写入 work/localization/。这些输出属于可重建生成物，不提交到 Git。

## 工作规则

1. 以 translation-scan-baseline.md 和 translation-manifest.tsv 作为本轮翻译的初始基准。
2. 每个 agent 只处理 docs/zh-cn/agent-xx/manifest.tsv 中预先分配的文件。
3. 直接修改对应仓库中的产品源文件，不建立 locale 或 overlay 源码树。
4. 翻译期间只更新自己的 agent-xx/ 目录，不修改根目录总表，不提交代码。
5. 完成翻译后，将实际修改过的产品源文件登记到自己的 modified-files.tsv；最终合并到 translated-files.tsv。
6. 新增稳定译名、人名和保留原样项登记到自己的 terms-names.csv；最终合并到根目录 terms-names.csv。
7. 四个 agent 全部完成后，合并各自记录、更新 translation-progress.md，并重新运行扫描器。

所有翻译必须遵守根仓库 AGENTS.md 中的仓库边界、标识符保护和分支规则。当前阶段不进行自动测试，全部源码翻译完成后由用户统一手动验收。
