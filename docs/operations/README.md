# 运维文档

本目录面向本机和发布环境的部署维护。当前可执行路径是根仓库脚本加 systemd transient units；完整 Docker Compose 运行仍是后续方案。

- [服务](services.md)：进程、端口和启停入口。
- [配置](configuration.md)：环境变量、数据库和资源覆盖。
- [故障检查](troubleshooting.md)：doctor、日志和常见失败。
- [Docker 镜像发布](docker-release.md)：完整重建、统一版本、禁止缓存。

尚未实施的 Compose 目标架构见 [Docker 部署方案](docker-compose.md)，不要把它当成当前运行手册。
