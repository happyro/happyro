# deploy

部署模板和环境样例，不承载业务逻辑。

| 路径 | 用途 |
| --- | --- |
| `mariadb/` | 本机 MariaDB Compose 与初始化脚本 |
| `rathena/` | 服务端地址和端口 profile |
| `docker/` | 四类镜像 Dockerfile、纯运行 Compose 和环境模板 |

部署工具集中在 [tools/deployment](../tools/deployment/)，完整交付流程见 [无源码 Docker 部署](../docs/operations/docker-deployment.md)。

当前运行手册见 [docs/operations/](../docs/operations/README.md)。不要把 `deploy/docker/compose.yml` 当成已经落地的本机默认运行方式。
