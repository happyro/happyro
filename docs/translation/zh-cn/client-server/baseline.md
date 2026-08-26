# 中文汉化扫描基线

## 目的

本文档记录本轮从进度 0 开始的中文翻译扫描基准。
扫描器只读取三个仓库当前 Git 跟踪的文件，不读取旧进度表、术语表或候选表。

## 当前维护基线

2026-08-25 回写复核后，`repos/happyro-client`、`repos/happyro-server` 和 gateway 源码树是后续翻译的唯一维护基线。它们已经包含已确认的客户端、服务端和资源网关 bugfix；`canonical-20260825-01` 仅作为历史发布快照，不再作为新的 `--repo-root` 输入。

现有 `agents/` 分片保存的是回写前源码快照。使用当前仓库直接合并会报告 334 个源分片漂移（client 23、server 311），这属于旧分片过期，不应通过关闭源一致性检查解决。日常 bugfix 不再为此重新分片：bugfix 直接维护在当前源码仓库，旧 agent 分片只用于历史审计，不得直接回写。只有明确启动新一轮翻译项目时，才从当时的最新源码重新扫描、分片并建立新的 manifest。

## 扫描版本

- 分支：main
- 扫描日期：2026-08-21
- 扫描工具：scripts/localization/scan-localization-inventory.py
- 扫描工具提交：6d36b252ce5653978f640c61f2b6319c45a9e827
- 根仓库提交：0eb4a2b8d7e0747fec9fd7c1f731770e72fc4902
- server 提交：ced737d3cae337da0c8d701150e4f70b845e76f9
- client 提交：18729e433efd5a5f0d98198a9cf908c09888cb9b
- Git 跟踪文件总数：5,994
- 候选文本行总数：337,691
- 候选文件原始行数：2,535,635

## 仓库文件数

| 仓库 | Git 跟踪文件 |
| --- | ---: |
| 根仓库 | 38 |
| server | 4,962 |
| client | 994 |
| 合计 | 5,994 |

## 候选文本分类

| 领域 | 文件数 | 候选数 | 可见性 |
| --- | ---: | ---: | --- |
| client UI | 473 | 16,078 | 玩家可见 |
| client 游戏数据库 | 45 | 18,195 | 玩家数据 |
| server 消息配置 | 12 | 426 | 玩家可见 |
| server NPC/任务 | 1,011 | 258,934 | 玩家可见 |
| server 游戏数据库 | 62 | 22,371 | 玩家数据 |
| server 运行时 | 171 | 12,717 | 需结合上下文 |
| client 应用 | 22 | 645 | 需结合上下文 |
| client 网络 | 9 | 452 | 内部文本 |
| client 其他源码 | 179 | 4,403 | 需结合上下文 |
| server 配置 | 35 | 327 | 需结合上下文 |
| server 数据库迁移 | 23 | 147 | 内部文本 |
| server 其他源码 | 54 | 2,900 | 内部文本 |
| 根仓库配置 | 3 | 96 | 需结合上下文 |

## 扫描范围

文件清单对根仓库、server 和 client 的 Git 跟踪文件进行全量盘点。

候选文本提取范围：

- server：conf/、db/、localization/、npc/、sql-files/、src/
- client：src/、applications/、rathena/
- 根仓库：configs/、deploy/、localization/、patches/、scripts/

候选提取排除：

- server 第三方库、文档和 CI 文件
- client src/Vendors/ 和 applications/tools/ 中的第三方或工具编码库
- inputs/official/ 和 inputs/runtime/kro-20211105/ 官方源材料
- vendor 固定第三方代码整体不作为翻译对象；只处理 HappyRO 兼容补丁

## 生成结果

扫描器写入 work/localization/：

- scan-files.tsv：全量文件覆盖清单
- scan-summary.tsv：文件类型统计
- scan-candidates.tsv：候选文本行
- scan-candidates-classified.tsv：候选领域和可见性
- scan-candidate-summary.tsv：候选分类统计
- scan-batches.tsv：按领域和优先级排列的文件批次
- translation-files.tsv：预备待翻译文件清单

这些文件均为可重建生成物，不提交到 Git。每次批次完成后重新扫描，并以新的输出复核残留候选。

## 翻译工作单元

本轮前置分配按原始文件行数切片：超过 500 行的文件切成每片最多 500 行，500 行以内的文件作为一个完整工作单元。当前共生成 6,493 个工作单元，其中 538 个源文件被切割；四个 agent 按原始总行数均衡分配。

切片只在翻译期间使用，agent 不直接修改正式源码。翻译输出的物理行数默认可以变化，但必须保持非对白结构、标记、占位符和控制逻辑；全部 agent 完成后再按原始切片顺序合并回源码。
