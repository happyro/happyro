# HappyRO tools

工具按生命周期和权威来源划分。开发机业务入口保留在 `scripts/`；实现放在这里。工具无参数只显示帮助，支持 `--no-color`。临时结果放 `work/` 或 `artifacts/`；经过审查的产品资料按各生成器的明确命令写入对应仓库。

| 目录 | 职责 | 边界 |
| --- | --- | --- |
| [release/](release/README.md) | 源码预备、全量双架构构建、离线 ZIP、Docker Hub 发布 | 构建机使用，不装入离线包 |
| [deployment/](deployment/README.md) | 离线校验、初始化、导入镜像、部署、备份恢复 | Python 标准库；不需要源码、Node 或 Git |
| [operations/](operations/README.md) | 本机 Docker 运维、macOS API 服务定义 | 不承担发布打包 |
| [resources/](resources/README.md) | 运行资料、图像、职业外观、导航与帮助目录生成 | 使用已审查的本地来源；不访问翻译网站 |
| [localization/](localization/README.md) | 外部名称来源采集、对照、审查与受控应用 | 来源证据和翻译选择独立于运行资料生成 |
| [client/](client/README.md) | Lua 5.0/5.1 提取、回编译与语义校验 | 两版本 ABI 分开验证 |
| [acceptance/](acceptance/README.md) | 跨应用浏览器验收、场景与历史证据核验 | 人工实机场景与自动单元测试明确区分 |
| [changelog/](../changelog/README.md#检查与同步) | changelog 检查、同步、索引 | 不发布产品或自动提交 Git |

API 镜像中的运行时自定义目录生成器属于 API 仓库：`repos/happyro-api/tools/catalogs.py`。其测试随代码放在 API 仓库，根工具检查也会执行该测试。不要把镜像运行时业务代码重新放回发布工具。

## 依赖与统一检查

源码工具需要 Python 3.11+、Node 22+。Python 和 Node 工具依赖分别固定在本目录的 `requirements.txt`、`package.json` 和 `package-lock.json`，不借用应用仓库的 node_modules。

```bash
python3 -m venv work/tools-venv
work/tools-venv/bin/python -m pip install -r tools/requirements.txt
npm ci --prefix tools
work/tools-venv/bin/python tools/check.py test --no-color
```

`test` 执行 Python 单元测试、API 的 Python 目录测试、Node 测试、所有 JS 模块与 AsyncFunction 场景的语法检查，以及登记命令的彩色/纯文本帮助检查。`commands.json` 是 CLI 入口清单，库模块、Lua VM 程序和浏览器场景函数体不登记为 CLI。

Docker 集成测试按各测试文件的环境变量显式启用；跳过项会显示，不算通过。角色删除集成测试需要 `HAPPYRO_OPERATIONS_TEST_DATABASE` 指向专用数据库容器。单元测试不启动发布、不登录游戏、不推送镜像，也不代表双架构容器或手机真机验收完成。

新增工具应先确定所属目录；入口只处理参数，业务逻辑应能单独测试。不要创建通吃部署、资源、翻译和验收的公共业务模块。真正需要离线分发的代码只从 deployment 取用。
