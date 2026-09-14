# Deployment tools

- `manage.py`：准备统一版本离线包、校验全包、导入本机架构镜像、生成密钥、部署、备份/恢复。
- `images.py`：在构建机器全量无缓存构建双架构 OCI；package 转为 Docker-save 归档，放入包内 images/amd64 和 images/arm64，并生成 `.zip` 离线交付包及 SHA-256 文件，不重新构建、不推送。
- `offline.py`：包内共享校验模块，不直接执行。

版本唯一来源：deploy/docker/VERSION。prepare 和 build 读取同一版本；package 要求五仓库提交也完全一致。最终交付必须包含镜像与资源，不拆包。无镜像时使用 verify --prepared 检查准备包；正常 verify、initialize 和 deploy 均拒绝缺失镜像的包。

两者不带参数仅显示帮助，支持 `--no-color`。外层离线交付只生成 `.zip`，包内供 Docker 导入的镜像保持 `.tar`。生成文件放 `artifacts/`，不修改官方源材料。

完整流程与限制见 [Docker 部署手册](../../docs/operations/docker-deployment.md)。Docker 定义位于 [deploy/docker](../../deploy/docker/)。

首次 `initialize` 会由 Admin 初始化任务创建 `admin/admin` 超级管理员；Database 初始化会创建 `happyro/happyro` GM 账号。两项初始化均幂等，已有数据库不会重复插入账号。
