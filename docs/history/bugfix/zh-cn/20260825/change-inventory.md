# 未提交变更清单

## Git 工作树边界

当前目录下实际有四个未清洁 Git 工作树，而不是单一仓库：

| 工作树 | 本轮归属 |
| --- | --- |
| HappyRO 根仓库 | 翻译分块、zh-cn 覆盖、部署脚本和本文档 |
| `repos/happyro-client` | 客户端源码与测试 |
| `repos/happyro-server` | 服务端 MOTD |
| `repos/happyro-gateway` | HappyRO Gateway 独立仓库，包含网关资源路径和 WebSocket 目标修复 |

三个应用仓库分别是 client、server 和 HappyRO Gateway；根仓库仍需单独提交其编排、翻译源和文档。提交前必须分别在各自工作树检查状态。

## 根仓库

本轮明确相关：

- `docs/translation/zh-cn/client-server/agents/**`：修订后的翻译源分块、清单和新增技能描述本地化文件。
- `localization/client/**`：消息表、称号表和技能描述表，是 zh-cn 运行时覆盖源。
- `deploy/remote-client/.env.example`：启用 `DATA_OVERRIDE_PATH=../../localization/client/data`。
- `scripts/resources/configure-resources.sh`：校验三张覆盖表，并接入官方 AI 目录。
- `scripts/gateway/gateway.sh`：启动后验证本地化表和 AI 端点。
- `docs/bugfix/zh-cn/20260825/**`：本归档。

不应纳入本轮源代码提交：

- `work/translation-merge/**`：临时合并输出和验证日志。
- `work/runtime/ui-audit/**`：浏览器审计截图与 JSON 证据。
- `docs/translation/zh-cn/kro-20211105/merged/**`：已验证的正式翻译产物，必须连同 manifest 和验证记录作为独立的翻译产物提交；不与 bugfix 文档或运行时源码修复混为一个提交。

## happyro-client

变更可分为四组：

- 数据加载与编码：`src/DB/DBManager.js`、`src/Utils/CodepageManager.js`。
- 静态本地化数据：`MapTable.js`、`MonsterTable.js`、`SkillInfo.js`、新增 `SkillDescriptionLocalization.js`。
- UI 文案与布局：签到、ESC、背包、导航、NPC 对话/选项、队伍、任务、弹窗、世界地图和 `UIManager.js`。
- 运行逻辑与测试：`Rodex.js`、`CodepageManager.test.js`、新增 `SkillDescriptionLocalization.test.js`。

## happyro-server

当前仅 `conf/motd.txt` 未提交，属于服务端配置本地化。`db/re/item_db_equip.yml` 的 C_Persika YAML 修复已包含在既有提交 `842de2a7a`，本归档只记录其源头追溯，不重复提交。

## 2026-08-25 回写复核

本次回写曾使用旧源码基线，导致 client 的 `DBManager.js` 和 `MapTable.js` 部分 bugfix 被覆盖。复核时已从备份中的 bugfix 维护源恢复这两个文件，并完成三仓库全量目录对比：client/server/gateway 的源码与备份一致；正式 client-server merged 与当前仓库的可对照文件没有实质差异，剩余差异仅为生成文件、换行或格式。

旧 agent 分片仍是回写前快照，使用当前仓库合并会报告 334 个源分片漂移。日常 bugfix 直接修改源码维护源，不再为每次修复重新分片；旧分片或 `canonical-20260825-01` 不能作为新的 writeback 输入。只有明确启动新翻译项目时，才从最新仓库重新扫描和分片。

## gateway

本轮明确相关的是 `src/controllers/clientController.js`：按路径段处理 CP949 乱码，保留已经是 Unicode 的文件名。

以下项目不能在未复核前自动归入本轮：

- `index.js`：Web API 代理和公共路径改动，可能是此前环境工作。
- `package.json`：移除本地 ESRGAN 依赖，可能是此前环境工作。
- `AI`、`BGM`、`System`：资源配置脚本创建的运行时符号链接，不应提交为源码。

## 状态约束

本清单是 2026-08-25 的归档快照。提交前仍需重新运行四个工作树的 `git status --short` 和 `git diff`，因为用户的并行改动可能继续变化。
