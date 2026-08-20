# 中文汉化扫描基线

## 目的

本文档记录 HappyRO 中文产品分支的待翻译扫描方法、当前基线和后续工作边界。原始扫描结果位于 `work/localization/`，不进入 Git；扫描方法由已提交的 `scripts/scan-localization-inventory.py` 持久保存。

## 当前基线

- 分支：`lang/zh-cn`
- 扫描工具提交：`6d36b25 feat(localization): add translation inventory scanner`
- 扫描日期：2026-08-21
- 根仓 Git 跟踪文件：34
- `repos/happyro-server` Git 跟踪文件：4,962
- `repos/happyro-client` Git 跟踪文件：994
- 全量文件清单：5,990
- 候选文本行：337,600

候选文本按领域分类如下：

| 领域 | 文件数 | 候选数 | 判断 |
| --- | ---: | ---: | --- |
| client UI | 473 | 16,078 | 玩家可见，高优先级 |
| client 游戏数据库 | 45 | 18,195 | 玩家数据，高优先级 |
| server 消息配置 | 12 | 426 | 玩家可见，高优先级 |
| server NPC/任务 | 1,011 | 258,934 | 玩家可见，高优先级 |
| server 游戏数据库 | 62 | 22,371 | 玩家数据，高优先级 |
| server 运行时源码 | 171 | 12,717 | 需要结合调用上下文确认 |

上述高优先级翻译范围共 1,603 个文件。候选数量按源代码行统计，不能直接视为最终需要翻译的字符串数量。

## 扫描范围

文件清单对根仓、server 和 client 的 Git 跟踪文件进行全量盘点。

候选文本提取范围：

- server：`conf/`、`db/`、`localization/`、`npc/`、`sql-files/`、`src/`
- client：`src/`、`applications/`、`rathena/`
- 根仓：`configs/`、`deploy/`、`localization/`、`patches/`、`scripts/`

候选提取排除：

- server 第三方库、文档和 CI 文件
- client `src/Vendors/` 和 `applications/tools/` 中的第三方或工具编码库
- `inputs/official/` 和 `inputs/runtime/kro-20211105/` 官方源材料不修改
- vendor 固定第三方代码不作为整体翻译对象；只处理 HappyRO 兼容补丁

## 生成结果

扫描命令：

```bash
python3 scripts/scan-localization-inventory.py
```

生成文件：

- `work/localization/scan-files.tsv`：全量文件覆盖清单
- `work/localization/scan-summary.tsv`：文件类型统计
- `work/localization/scan-candidates.tsv`：候选文本行
- `work/localization/scan-candidates-classified.tsv`：带领域和可见性判断的候选文本
- `work/localization/scan-candidate-summary.tsv`：候选分类统计
- `work/localization/scan-batches.tsv`：按优先级排列的文件批次
- `work/localization/translation-files.tsv`：预备待翻译文件清单

这些文件均为可重建的扫描产物，默认被 `.gitignore` 排除。

## Git 记录约定

- `docs/zh-cn/source-files.tsv` 只登记实际被翻译修改过的产品源文件。
- `docs/zh-cn/terms-names.csv` 登记稳定译名、术语和保留原样项。
- `docs/zh-cn/translation-candidates.csv` 用于需要长期人工跟踪的候选项。
- 原始扫描输出保留在 `work/`，不与产品源码混合提交。

## 后续顺序

1. client 核心 UI：登录、角色创建、角色选择、聊天、主界面、背包和装备。
2. client 游戏数据库：道具、技能、怪物、地图名称和说明。
3. server 消息配置。
4. server NPC 和任务脚本。
5. server 游戏数据库。
6. server/client 运行时动态显示文本。

每完成一个翻译批次，重新运行扫描器，复核残留非中文玩家可见文本，并将实际修改文件登记到 `docs/zh-cn/source-files.tsv`。当前阶段不进行自动测试，全部源码翻译完成后由用户统一手动验收。
