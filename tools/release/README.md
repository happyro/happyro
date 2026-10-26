# 发布工具

统一入口为 `python3 tools/release/release.py`，不带参数只显示帮助。命令按产物对象分组，不保留旧入口或参数别名。公开教程见 [happyro-doc 构建离线包](../../repos/happyro-doc/docs/development/offline-package.md)，完整发布规则见 [Docker 发布手册](../../docs/operations/docker-release.md)。

## 常用命令

VERSION 默认版本：全量无缓存构建并生成完整包和拆分包

```bash
python3 tools/release/release.py offline create --split
```

预检通过后清理旧产物并重新构建

```bash
python3 tools/release/release.py offline create --rebuild --split
```

独立拆包或推送已登记的版本，推送会更新 latest

```bash
python3 tools/release/release.py offline split --version "$(cat deploy/docker/VERSION)"
```

```bash
python3 tools/release/release.py offline push --version "$(cat deploy/docker/VERSION)"
```

快速查询登记/文件存在性，--verify 才读取文件并验证完整性

```bash
python3 tools/release/release.py offline status --version "$(cat deploy/docker/VERSION)"
```

```bash
python3 tools/release/release.py offline status --version "$(cat deploy/docker/VERSION)" --verify
```

默认只预览；--execute 才清理中间产物；--include-package 同时删除交付包

```bash
python3 tools/release/release.py offline clean --version "$(cat deploy/docker/VERSION)" --include-package
```

输出统一位于 `artifacts/releases/<版本>/`，登记和日志位于 `work/releases/<版本>/`。`offline create` 默认不推送，只有显式 `--push` 或 `offline push` 才发布 Docker Hub。独立推送按版本定位原始 OCI 和 bundle，不再接受 --images/--bundle 路径。推送前必须保留这些中间产物，只有 ZIP 不能直接推送。

拆分交付包含两个 ZIP、`happyro-<版本>-SPLIT-README.md` 和 `happyro-<版本>-split.json`。外部 README 与两个 ZIP 内的说明来自同一模板，内容一致；报告记录归档和外部说明的大小与 SHA-256，status --verify 同时核对三份说明。默认 clean 保留这些交付文件，--include-package 才全部删除。

## 资源传输

```bash
python3 tools/release/release.py resources create
```

```bash
python3 tools/release/release.py resources create --rebuild
```

```bash
python3 tools/release/release.py resources status --version "$(cat deploy/docker/VERSION)" --verify
```

```bash
python3 tools/release/release.py resources clean --version "$(cat deploy/docker/VERSION)" --execute
```

归档完整收录 `inputs/runtime/kro-20211105/`、物品与魔物图片，保留工作区路径和空目录。输出位于 `artifacts/resources/<版本>/`，包括 `happyro-<版本>-resources-transfer.tar.gz`、同名 `.sha256` 和 `resources-manifest.json`；登记在 `work/resource-transfers/<版本>/`。资源 clean 默认预览，加 --execute 直接删除该版本的归档、摘要、清单与临时文件，不需要 --include-package。

工具使用 Python 3.11+ 标准库，过滤 `.DS_Store` 和 `._*`，拒绝符号链接及特殊文件；逐文件验证归档并核对输入是否变化。它是跨机器构建输入，不是可部署的 runtimes 拆分包；API 的 NPC、地图和地形资料仍由 Git 提供。目标电脑先验证 `.sha256`，再在源码工作区根目录解压。创建默认读取 VERSION，显式版本必须匹配；预检失败保留旧包，清理后的重建失败不会恢复旧包。

## 分阶段构建

```bash
python3 tools/release/release.py stage prepare --version "$(cat deploy/docker/VERSION)"
```

```bash
python3 tools/release/release.py stage build --version "$(cat deploy/docker/VERSION)"
```

```bash
python3 tools/release/release.py stage package --version "$(cat deploy/docker/VERSION)"
```

三个阶段与 offline create 共用路径、锁、来源记录和状态转换。prepare 预检并创建登记，build 只接受 prepared，package 只接受 built；任一步失败停止后续操作，不自动重试或断点续跑。失败后可用 offline clean 清理，再从 prepare 开始，或用 offline create --rebuild 全量重建。每阶段前后校验源码指纹。中途源码改变时不能拼接不同批次。

分阶段命令不接受任意输出路径，不生成无法统一清理的匿名目录。工作区路径与来源受登记约束，资源传输到另一台机器后应从 stage prepare 开始，不直接搬移已有登记。

## 执行反馈与架构

默认彩色帮助和执行进度，耗时阶段每 10 秒提示一次，--no-color 可在任意命令层级使用。全部创建、清理和发布由版本锁保护；子阶段和 OCI 写入进程继承锁，父进程被杀死也不会立即允许清理仍在写入的目录。日志保持纯文本，不记录凭据。

- `release.py`：命令树、参数和路由；帮助与参数来自同一份定义。
- `operations.py`：版本目标的拆分、推送与清理。
- `lifecycle.py`：共用版本登记、路径和锁，Offline 与 Resource 布局分别定义交付文件与中间产物。
- `workflow.py` / `stages.py`：完整流程与独立阶段，共用阶段执行和完成校验。
- `status.py`：只读状态和显式内容核验，历史成功状态不等于当前文件已校验。
- `sources.py`、`package.py`、`images.py`、`split.py`、`publish.py`、`resources.py`：各自承担单一处理职责。
- `tools/cli.py`：源码侧命令共用帮助样式；包内部署工具仅依赖随包携带的标准库模块。

产物构建与完整性验证不替代游戏运行验收；运行与验收使用 `tools/acceptance/offline/manage.py`，不会由打包隐式启动。发布清理不删除验收目录、原始资源或共享 Docker 镜像。所有状态查询默认不重新验证游戏功能或远程发布状态。
