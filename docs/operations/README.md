# 运维文档

先选择实际部署方式，不混用原生开发库与 Docker 离线包的数据目录、端口和工具。

| 场景 | 入口 |
| --- | --- |
| 拿到离线包后安装、配置、升级、备份恢复 | [Docker 部署手册](docker-deployment.md)，同时是包内 README 来源 |
| 从源码构建与交付镜像 | [发布流程](docker-release.md) |
| 最终包逐项验收 | [发布验收清单](release-checklist.md) |
| Linux systemd / macOS launchd 原生开发环境 | [服务管理](services.md)、[配置](configuration.md) |
| 原生环境备份与通用数据一致性原则 | [备份与恢复](backup-recovery.md) |
| 运行故障 | [排障](troubleshooting.md)，按章节注明的部署方式使用 |

产品变化与正式版本交付结果见[更新日志](../../changelog/README.md)。一次性日志、截图和候选包报告放在 work/ 或 artifacts/，不再维护历史操作手册副本。
