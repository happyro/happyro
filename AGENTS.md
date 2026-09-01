# HappyRO 代理说明

本仓库属于 HappyRO Web 栈。

## Git 规则

- HappyRO 自有提交必须使用 type(scope): subject 格式。
- scope 必须存在，使用小写英文；破坏性变更使用 type(scope)!: subject，并在正文说明迁移方式。
- 允许的 type：feat、fix、config、docs、refactor、test、build、ci、chore、perf、style、revert。
- subject 使用祈使语气的英文，不以句号结尾，首行总长度不超过 72 个字符。
- 一个提交只包含一个逻辑变更；上游合并提交和上游作者提交不受此限制。
- 产品改动如果需要提交，必须自动添加或更新对应的 changelog 记录；只有用户明确说明不写 changelog 时才可跳过。
- changelog 记录必须与对应的实际变更位于同一个 Git 仓库，并包含在同一个提交中；禁止创建只包含 changelog 的独立提交。
- 客户端和服务端属于独立 Git 仓库，根仓库的集中 changelog 不能替代产品仓库内与实际变更同提交的记录；产品仓库缺少 changelog 时，应先在该仓库建立对应记录。
- `repos/happyro-client` 和 `repos/happyro-server` 的产品变更还必须同步记录到根仓库的集中 changelog，并在同一次工作中完成提交和推送。
- 跨仓库集中 changelog 是“禁止创建只包含 changelog 的独立提交”规则的唯一例外，根仓库使用独立的 `docs(changelog)` 提交记录客户端和服务端变更。
- main 是长期中文产品分支，也是默认维护分支。
- demo 是中文演示环境分支；演示专属改动只提交到 demo，并持续同步 main。
- 三个仓库只推送到各自的 origin，不推送到 upstream。
- 未经用户明确要求，不提交、不推送。

## 仓库边界

- 固定 PACKETVER=20211103、Renewal，以及客户端和服务端一致的封包设置。
- `inputs/official/` 中经过核验的官方 kRO 2021-11-05 文件是不可修改的源材料；`inputs/runtime/kro-20211105/` 是运行目录，允许用已审查、已编译并通过语义校验的翻译产物直接覆盖对应文件，覆盖后必须校验目标哈希并记录来源。
- 生成文件放在 work/ 或 artifacts/。
- repos/happyro-client 和 repos/happyro-server 是独立 Git 仓库。
- repos/happyro-admin 是独立的 HappyRO GM 管理后台仓库；其代码实现规范和仓库 changelog 规则以 `repos/happyro-admin/AGENTS.md` 与 `repos/happyro-admin/changelog/` 为准。
- docs/translation/zh-cn/ 中的旧翻译工作区仅作为历史记录，后续不得再作为发布源向客户端或服务端仓库回写；产品翻译直接修改对应仓库。

## Docker 镜像发布规则

- 用户说“重建镜像”、“发布新版本”或“打包新版本”时，必须先读取并严格执行 `docs/deploy/docker/image-release.md`。
- 每个版本都必须从四个仓库的最新代码完整、无缓存地重新构建 PWA、Gateway、Server 和 Database；不得根据 Git 变更跳过构建，不得复用旧 `dist`、旧镜像或旧 Docker 缓存。
- 所有镜像必须使用同一版本号。当前已发布版本为 `v0.1.4`，下一个默认版本为 `v0.1.5`；发布成功后同步更新本节和规则文档中的版本记录。
- 必须先确认全部构建成功，再 push 和部署；任一构建失败立即停止后续操作。

## 代码实现

- 默认按当前最佳实践实现，不为了历史写法、旧接口、旧字段、旧环境变量、旧参数名或临时方案保留兼容分支。
- 不添加未被当前需求使用的兜底逻辑、迁移逻辑、别名逻辑或废弃路径。
- 只有用户明确要求兼容已有生产用法时，才保留或新增兼容实现，并在文档中写清楚兼容范围。
- 命令行工具不带任何参数运行时，必须只输出使用说明和常用例子，不执行实际业务动作。
- 命令行工具的帮助输出默认启用友好的 ANSI 终端高亮：标题使用亮青色加粗 `1;36`，分节标题使用亮黄色加粗 `1;33`，子命令使用亮绿色加粗 `1;32`，常用例子使用青色 `36`，并使用 `0` 重置样式。
- 命令行工具必须提供禁用颜色的选项，例如 `--no-color`，用于日志、管道或不支持 ANSI 的终端。
- 命令行工具的帮助输出首行和尾行必须为空行。
