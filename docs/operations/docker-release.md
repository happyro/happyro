# Docker 镜像构建与发布规则

本文件是 AGENTS.md 引用的发布入口。只修改 Docker 定义不等于执行镜像发布；用户明确要求不 build 时，不运行构建或推送。

## 版本与范围

- 当前已发布版本：`v0.1.4`；下一个默认版本：`v0.2.0`。本次方案改造未发布新版本。
- 同一版本完整重建 Gateway（含完整 `--all` PWA）、Server、Admin（含后台前端）、Database 四类镜像。
- 从根仓库、Client、Gateway、Server、Admin 五个仓库最新 `origin/main` 快进同步，确认干净并记录提交。
- 四类镜像统一版本号，均包含 `linux/amd64`、`linux/arm64`。全部成功后更新 latest；部署固定 digest，不跟随 latest。
- 游戏与图鉴图片以统一资源目录发布并只读挂载，不制作资源镜像。

## 强制执行顺序

1. 确认用户授权、五仓库状态、Docker/Buildx/Skopeo 与注册表认证。
2. 从最终提交准备部署包，验证资源 SHA-256 清单。
3. 全量 `--no-cache --pull` 构建四类镜像为本地 OCI 归档。不得根据 Git diff 跳过镜像，不复用旧 dist、vendor、旧镜像或 Docker 缓存。
4. 校验全部归档平台，只有全部成功才生成 built.json；失败停止，不 push 或部署。
5. 独立 push 阶段重新核对全部归档及部署包的提交/版本一致性，再推送同一批归档。禁止为了推送重新 build。
6. 全部版本标签 digest 和架构校验成功后，再更新 latest 并校验；任一步失败停止，不部署。
7. 完成部署验收后更新本文及根 AGENTS.md 版本记录。部分成功不算发布成功。

```bash
python3 tools/deployment/manage.py prepare --workspace . --output artifacts/deployment/v0.2.0 --version v0.2.0
python3 tools/deployment/manage.py verify --directory artifacts/deployment/v0.2.0
python3 tools/deployment/images.py build --workspace . --output artifacts/images/v0.2.0 --version v0.2.0
python3 tools/deployment/images.py push --output artifacts/images/v0.2.0 --bundle artifacts/deployment/v0.2.0
```

工具不自动同步 Git、不修改版本记录、不部署。

## 发布包准备与产物说明

正式准备前，五个仓库必须干净且包含要发布的最终提交。未跟踪的截图等文件也会触发构建工具的脏仓库检查，应先移到 work/ 或 artifacts/ 等生成目录。不要为了满足检查把无关文件提交进源码。

运行资源来源为 inputs/runtime/kro-20211105/client；物品和魔物图片分别来自 work/game-data/items/kro-20211105、work/game-data/monsters/kro-20211105；NPC、地图和地形预览来自 Admin 的 backend/resources/game-data/world 对应目录。prepare 会校验目录并复制资源、计算 SHA-256，不启动服务、不构建镜像，也不修改源资源。输出目录必须不存在。

开发预览包标记为 prepared-not-built；正式发布需从最终干净提交重新准备。资源可单独压缩分发，但必须保留部署包中的目录结构及空的 data/ 子目录。资源变化后重新生成配套清单，不能手改 manifest 绕过校验。

build 全量导出双架构 OCI 归档，全部成功才写 built.json。push 使用同一批已验证归档，不重新构建。Skopeo 的 --authfile 默认使用 Docker 配置文件；使用 credential helper 时需提供 Skopeo 支持的认证文件。发布前检查工具安装与注册表认证。

Admin 使用已跟踪的 npm/composer 锁文件；Client 和 Gateway 当前未跟踪 npm 锁文件，同一源码重新构建可能解析到较新的依赖，回滚必须使用实际产物 digest。

推送成功后，工具将 digest 写回部署包的 .env.example 和 release-manifest.json，不修改已有 .env。交付前确认四个镜像 digest 齐全。部署包 README 来自 docker-deployment.md，仅包含部署端步骤；本文件及 images.py 属于源码工作区的发布工具，不随部署包分发。

推送失败必须报告已成功标签；不得用旧镜像补齐，不自动删除已发布标签。全量运行验收要求及部署步骤见 [部署手册](docker-deployment.md)。
