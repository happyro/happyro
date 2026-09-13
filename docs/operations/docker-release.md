# Docker 镜像构建与发布规则

本文件是 AGENTS.md 引用的发布入口。只修改 Docker 定义不等于执行镜像发布；用户明确要求不 build 时，不运行构建或推送。

## 版本与范围

- 当前已发布版本：`v0.1.4`；下一个默认版本：`v0.1.5`。本次方案改造未发布新版本。
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
python3 tools/deployment/manage.py prepare --workspace . --output artifacts/deployment/v0.1.5 --version v0.1.5
python3 tools/deployment/manage.py verify --directory artifacts/deployment/v0.1.5
python3 tools/deployment/images.py build --workspace . --output artifacts/images/v0.1.5 --version v0.1.5
python3 tools/deployment/images.py push --output artifacts/images/v0.1.5 --bundle artifacts/deployment/v0.1.5
```

工具不自动同步 Git、不修改版本记录、不部署。

推送失败必须报告已成功标签；不得用旧镜像补齐，不自动删除已发布标签。全量运行验收要求及部署步骤见 [部署手册](docker-deployment.md)。
