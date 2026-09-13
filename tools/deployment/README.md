# Deployment tools

- `manage.py`：准备无源码部署包及统一资源目录、校验资源、生成密钥、备份/恢复。
- `images.py`：完整双架构无缓存构建到 OCI，全部成功后独立推送并锁定 digest。

两者不带参数仅显示帮助，支持 `--no-color`。生成文件放 `artifacts/`，不修改官方源材料。

完整流程与限制见 [Docker 部署手册](../../docs/operations/docker-deployment.md)。Docker 定义位于 [deploy/docker](../../deploy/docker/)。
