# 运维文档

- [无源码 Docker 部署](docker-deployment.md)：四类镜像、统一资源目录、部署包工具和备份恢复。

本目录面向本机和发布环境的部署维护。开发主机使用 systemd 游戏进程和 MariaDB 容器，完整 Docker Compose 是另外一套部署拓扑。

- [服务](services.md)：进程、端口和启停入口。
- [配置](configuration.md)：环境变量、数据库和资源覆盖。
- [故障检查](troubleshooting.md)：doctor、日志和常见失败。
- [备份与恢复](backup-recovery.md)：数据库一致性、持久数据、恢复演练与应用回滚。
- [Docker 镜像发布](docker-release.md)：完整重建、统一版本、禁止缓存。

[Docker 部署](docker-deployment.md) 说明部署包、镜像与资源的完整流程。开发主机与独立容器部署使用各自的数据和端口。
