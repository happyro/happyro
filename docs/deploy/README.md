# 部署文档

HappyRO 当前在局域网中通过根仓库 `scripts/`、systemd transient units 和 `deploy/` 配置运行。这里的文档需要明确区分当前可执行流程与未来方案。

## 当前入口

- `scripts/database/database.sh`：MariaDB 启停和健康检查。
- `scripts/server/server.sh`：rAthena login、char、map、web 服务管理。
- `scripts/gateway/gateway.sh`：客户端资源网关管理和健康检查。
- `scripts/maintenance/doctor.sh`：环境诊断。
- `deploy/mariadb/compose.yml`：当前已落地的 MariaDB Compose 定义。

## 方案文档

- [Docker 部署方案](docker/README.md)：尚未实施的完整 gateway、rAthena、MariaDB Compose 目标架构，不是当前运行手册。
