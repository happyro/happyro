# Git 工作流

操作规则以各仓库根目录 `AGENTS.md` 为准。这里只说明文档读者需要的入口，不复制完整代理规则。

## 仓库

四个应用仓库是独立 Git 仓库，只推送到各自的 `origin`，不推送到 `upstream`。根仓库编排它们，但不替代产品仓库内的 changelog。

`main` 是长期中文产品分支。`demo` 是中文演示环境分支；演示专属改动只提交到 `demo`，并持续同步 `main`。

未经明确要求，不提交、不推送。

## 提交格式

HappyRO 自有提交使用 `type(scope): subject`。

- `scope` 必须存在，使用小写英文。
- 允许的 type：`feat`、`fix`、`config`、`docs`、`refactor`、`test`、`build`、`ci`、`chore`、`perf`、`style`、`revert`。
- 破坏性变更使用 `type(scope)!: subject`，并在正文说明迁移方式。
- subject 使用祈使语气英文，不以句号结尾，首行不超过 72 个字符。
- 一个提交只包含一个逻辑变更。

## Changelog

产品改动必须与对应 changelog 记录放在同一个提交中，禁止只提交 changelog。

| 仓库 | 记录位置 |
| --- | --- |
| 根仓库 | `changelog/<年>/<月>/YYYY-MM-DD.md` |
| Client | `repos/happyro-client/changelog/` |
| Server | `repos/happyro-server/changelog/` |
| Admin | `repos/happyro-admin/changelog/` |
| Gateway | `repos/happyro-gateway/CHANGELOG.md` |

Client 和 Server 的产品变更还要同步记录到根仓库集中 changelog，并在同一次工作中完成提交。根仓库用独立的 `docs(changelog)` 提交记录这两个仓库的跨仓库汇总，这是“禁止只提交 changelog”的唯一例外。Admin 变更不写入根仓库 changelog。

## 文档与源码

- 长期说明放在 `docs/`，不要把 Agent 分片或 `work/` 产物继续放进文档目录。
- 上游 roBrowser / rAthena README 保留在子仓库，HappyRO 说明写在各仓库根 README 和 `docs/`。
- Docker 镜像发布规则见 [Docker 镜像发布](../operations/docker-release.md)。
