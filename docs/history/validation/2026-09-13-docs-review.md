# 跨仓库文档审查（2026-09-13）

## 范围与依据

审查根仓库全部 `docs/` 页面、根 README，以及文档直接依赖的 Makefile、scripts、Dockerfile、Compose、版本锁和应用代码/文档入口。应用仓库内部文档未做全量重写；本次没有产品源码改动，没有重建镜像、恢复数据库或重启游戏。

依据是当时检出的源码、已安装 systemd 单元的只读属性和本地配置语法检查，不把网上通用建议当作本项目已经实现的能力。

## 结构决策

- 保留架构、开发、运维、本地化、游戏资料五类主目录：职责成立，不机械改名。
- 新增 `history/validation/`，迁移四份性能/验收快照；字节流契约进入 `architecture/game-stream.md`，技能长期说明进入 `game-data/skills.md`。
- 移除无内部必要引用的五个旧转向页：`bugfix/README.md`、`translation/README.md`、`deploy/README.md`、`deploy/docker/README.md`、`deploy/docker/image-release.md`。内容已有规范入口，旧外部书签需改用 docs 总览。Git 历史可恢复这些页面。
- `operations/docker-release.md` 保持固定路径，继续作为 AGENTS.md 的强制入口。
- 给旧翻译批次添加历史标记，保留当时记录，不让旧回写规则充当当前指令。

## 实质修正

| 问题 | 处理位置 |
| --- | --- |
| work/ 被整体标成可删除，但含数据库和密钥 | repository-boundaries、backup-recovery |
| 当前单元全部被写成 transient、Gateway 绑定被写成仅回环 | services、local-setup、system-overview |
| 首次启动遗漏依赖安装与 PWA 全量构建 | 根 README、local-setup |
| configure-gateway 被描述为会覆盖已有环境 | configuration |
| `make test-gateway` 与完整单测混淆、server-verify 被当作本次启动证明 | testing、troubleshooting、services |
| Gateway 旧精确提交锁会误报维护分支 | troubleshooting、local-setup |
| Docker 模板被描述为不存在的未来方案，发布脚本前提不明 | docker-compose、docker-release |
| 旧消息表哈希冒充当前文件哈希 | client-resources |
| 技能 TXT 校验冒充实际 UI 更新，状态时间与独立冷却混淆 | skills、client-resources |
| Skill 原文重组已回滚，但历史叙述容易误读为已发布 | skills |
| NPC 完整实体目录与图鉴可见子集混淆 | world-catalog-navigation |
| 同一 shell 中连续 cd 导致后续命令目录错误 | common-commands、testing |
| Gateway changelog 路径与跨仓库推送规则过期 | docs 总览、git-workflow |

## 验证与限制

- 遍历普通 Markdown 本地链接目标、标题锚点以及从 docs 总入口的页面可达性；完成整理时全部通过。
- 对照 Makefile、package.json、CLI 定义确认文中入口；`make -n status server-verify gateway-verify` 对应实际脚本。
- `docker compose -f deploy/docker/compose.yml config --quiet` 通过，仅证明配置语法，不证明镜像可部署。
- `node scripts/resources/generate-skill-localization.mjs --check --no-color` 通过，说明资料文档引用的当前生成链一致。
- `git diff --check` 通过，四个应用仓库工作区未被修改。

未运行 Docker 构建/推送、产品全量测试或数据库恢复演练。本次只记录而不修复以下代码/运行能力缺口：doctor 的精确 HEAD 锁定、累计日志 ready 检查、Gateway 根测试脚本不包含全量单测、Buildx 本地 OCI 发布路径的环境可用性、缺少自动备份恢复，以及技能说明尚非纯原文翻译。对应手册已标明这些限制，不能宣称文档整理同时修复了产品。
