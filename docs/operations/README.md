# 运维文档

本目录面向本机和发布环境的部署维护。开发主机使用 systemd 游戏进程和 MariaDB 容器，完整 Docker Compose 是另外一套部署拓扑。

- [服务](services.md)：进程、端口和启停入口。
- [配置](configuration.md)：环境变量、数据库和资源覆盖。
- [故障检查](troubleshooting.md)：doctor、日志和常见失败。
- [备份与恢复](backup-recovery.md)：数据库一致性、持久数据、恢复演练与应用回滚。
- [Docker 镜像发布](docker-release.md)：完整重建、统一版本、禁止缓存。

[Docker Compose](docker-compose.md) 说明已有模板及部署前提。按所选拓扑操作，不把容器服务与 systemd 服务混为同一实例。历史验收结果见[历史快照](../history/validation/README.md)。
