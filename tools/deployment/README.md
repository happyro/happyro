# Deployment tools

- `manage.py`：准备统一版本离线包、校验全包、导入本机架构镜像、生成密钥、部署、备份/恢复。
- `images.py`：在构建机器全量无缓存构建双架构 OCI；package 转为 Docker-save 归档，放入包内 images/amd64 和 images/arm64，并生成 `.zip` 离线交付包，不重新构建、不推送。
- `offline.py`：包内共享校验模块，不直接执行。

版本唯一来源：deploy/docker/VERSION。prepare 和 build 读取同一版本；package 要求五仓库提交也完全一致。默认交付完整 ZIP，包含镜像与资源；只有明确要求时才从同一个已校验完整包生成可合并的拆分包。无镜像时使用 verify --prepared 检查准备包；正常 verify、initialize 和 deploy 均拒绝缺失镜像的包。

两者不带参数仅显示帮助，支持 `--no-color`。外层离线交付只生成 `.zip`，包内供 Docker 导入的镜像保持 `.tar`。生成文件放 `artifacts/`，不修改官方源材料。

完整流程与限制见 [Docker 部署手册](../../docs/operations/docker-deployment.md)。Docker 定义位于 [deploy/docker](../../deploy/docker/)。

`initialize` 只生成密钥和 custom 模板；随后 `deploy` 的 Admin 初始化任务创建 `admin/admin` 超级管理员；Database 初始化会创建 `happyro/happyro` GM 账号。两项初始化均幂等，已有数据库不会重复插入账号。

自定义内容采用 `CUSTOM_DIR`，默认 `./custom`。`initialize-custom` 只创建缺失文件，`refresh-custom-catalogs` 使用 Admin 镜像刷新查询资料；二者不会构建镜像。`custom.py` 管理初始化与归档恢复；`catalogs.py` 在 Admin 镜像内生成声明资料快照。发行包仅复制 templates，`prepare` 不读取用户 custom，ZIP 拒绝实际 custom/。备份含 custom-files.tar，恢复精确替换对应内容。

源码级测试（不构建镜像）：`python3 -m unittest discover -s tools/deployment -p 'test_*.py'`。测试中的镜像归档是临时构造的小型夹具，不是发布镜像。

自定义功能的实现位置和数据流见[实现与维护说明](../../docs/architecture/customization.md)。打包、失败后重建及最终验收见[镜像交付流程](../../docs/operations/docker-release.md)。升级和恢复必须使用对应版本工具；旧备份缺少 custom-files.tar 时由旧版工具恢复，不由新工具自动迁移。

发行 README 来源为 docs/operations/docker-deployment.md，examples/custom 来自 deploy/docker/custom-templates 与 Server db/import-tmpl。修改源码文档不会改变已有 ZIP；不得编辑受 release-manifest.json 校验的包内文件来绕过验证。
