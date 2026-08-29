# 部署文档

HappyRO 当前通过根仓库 `scripts/`、systemd transient units 和 `deploy/` 配置运行。这里的文档需要明确区分当前可执行流程与未来方案。

## 当前入口

- `scripts/database/database.sh`：MariaDB 启停和健康检查。
- `scripts/server/server.sh`：rAthena login、char、map、web 服务管理。
- `scripts/gateway/gateway.sh`：客户端资源网关管理和健康检查。
- `scripts/maintenance/doctor.sh`：环境诊断。
- `scripts/deploy/push-docker-images.sh`：构建并推送三枚 HappyRO 多架构镜像。
- `deploy/mariadb/compose.yml`：当前已落地的 MariaDB Compose 定义。

## 方案文档

- [Docker 部署方案](docker/README.md)：尚未实施的完整 gateway、rAthena、MariaDB Compose 目标架构，不是当前运行手册。

其中 [Docker 部署方案](docker/README.md) 的“当前镜像发布流程”章节记录了仓库同步、版本号递增、镜像构建推送和远端 manifest 校验步骤。
