# Deployment tools

- `manage.py`：校验、导入本机架构镜像、生成密钥、部署、备份/恢复。
- `bundle.py`：包内文件清单与资源完整性校验。
- `offline.py`：镜像归档、平台、摘要及本机已导入镜像核验。
- `custom.py`：自定义目录初始化与精确备份恢复。

这些文件使用 Python 标准库，独立随离线包分发。构建与发布使用 [tools/release](../release/README.md)；macOS 服务配置使用 [tools/operations](../operations/README.md)。

版本唯一来源：deploy/docker/VERSION。prepare 和 build 读取同一版本；package 要求六个构建仓库提交也完全一致。默认交付完整 ZIP，包含镜像与资源；只有明确要求时才从同一个已校验完整包生成可合并的拆分包。无镜像时使用 verify --prepared 检查准备包；正常 verify、initialize 和 deploy 均拒绝缺失镜像的包。

命令不带参数仅显示帮助，支持 `--no-color`。外层离线交付只生成 `.zip`，包内供 Docker 导入的镜像保持 `.tar`。生成文件放 `artifacts/`，不修改官方源材料。

拆分交付沿用 `happyro-<VERSION>-runtimes.zip`（运行资源）和 `happyro-<VERSION>-images.zip`（双架构镜像及部署文件）命名，保留同名根目录；两包解压到同一目录后按完整包校验和部署。

构建端执行入口见[镜像构建与交付](../../docs/operations/docker-release.md)；包内安装步骤见 [Docker 部署手册](../../docs/operations/docker-deployment.md)。Docker 定义位于 [deploy/docker](../../deploy/docker)。

上传 Docker Hub：先执行 `docker login`，再执行 `python3 tools/release/release.py offline push --version "$(cat deploy/docker/VERSION)"`。需要 Python 3.11+ 和 Skopeo；按版本定位 `artifacts/releases/<版本>/images/` 与 `bundle/`，核验记录默认写入该版本日志批次的 dockerhub 时间目录。

`deploy` 校验包及已导入镜像后，先启动并等待 database 健康，再执行新版 Database 镜像内的 `/opt/rathena/sql/upgrades/upgrade_20261012_sessions.sql`，成功后才启动整栈；SQL 失败停止后续命令，不批量执行历史升级脚本。保留旧库升级同样执行，须先停止旧服务并导入全部本版镜像。

`initialize` 只生成密钥和 custom 模板；随后 `deploy` 的 Admin 初始化任务创建 `admin/admin` 超级管理员；Database 首次空库初始化会创建 `happyro/happyro` GM 账号和第一角色位“罗安”（99/50 男剑士、10,000 Zeny，预配技能、装备、药水、波利蛋和快捷栏）。两项初始化均幂等，已有数据库不会重复插入账号。

自定义内容采用 `HAPPYRO_CUSTOM_DIR`，默认 `./custom`。`initialize-custom` 只创建缺失文件，`refresh-custom-catalogs` 使用 API 镜像刷新查询资料；二者不会构建镜像。`custom.py` 管理初始化与归档恢复；API 仓库的 `tools/catalogs.py` 在 API 镜像内生成声明资料快照。发行包仅复制 templates，`prepare` 不读取用户 custom，ZIP 拒绝实际 custom/。备份含 custom-files.tar，恢复精确替换对应内容。

源码级测试（不构建镜像）：`python3 -m unittest discover -s tools/deployment -p 'test_*.py'`。测试中的镜像归档是临时构造的小型夹具，不是发布镜像。

自定义功能的实现位置和数据流见[实现与维护说明](../../docs/architecture/customization.md)。打包、失败后重建及最终验收见[镜像交付流程](../../docs/operations/docker-release.md)。升级和恢复必须使用对应版本工具；旧备份缺少 custom-files.tar 时由旧版工具恢复，不由新工具自动迁移。

发行 README 来源为 docs/operations/docker-deployment.md，examples/custom 来自 deploy/docker/custom-templates 与 Server db/import-tmpl。修改源码文档不会改变已有 ZIP；不得编辑受 release-manifest.json 校验的包内文件来绕过验证。

测试最终 ZIP 的隔离运行和基础验收见 [offline 验收入口](../acceptance/offline/README.md)。运行命令支持显式 `--compose-override PATH` 追加 Compose 配置，未指定时只使用包内 compose.yaml；隔离配置不修改受清单校验的模板。
