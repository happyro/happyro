# Docker 镜像构建与发布规则

本文是 HappyRO 新版本打包、Docker 镜像重建、发布和部署的强制规则。用户说“重建镜像”、
“发布新版本”或“打包新版本”时，均按本文执行。

## 核心规则

每个版本都必须使用当前最新代码完整重建所有镜像，不能按代码是否变更决定是否构建，
禁止复用旧构建产物、旧镜像或旧 Docker 构建缓存。

## 版本号

- 所有镜像必须统一使用同一个 `vMAJOR.MINOR.PATCH` 版本号。
- 当前已发布版本为 `v0.1.4`，下一个默认版本为 `v0.1.5`。
- 用户未指定版本时，在当前已发布版本基础上递增 patch 号；用户指定版本时使用指定值。
- 发布成功后，应在本文中更新“当前已发布版本”和“下一个默认版本”。

## 发布范围

每次发布或打包新版本都必须完整执行以下构建，不得因某个仓库没有代码变更而跳过：

- `happyro-client`：重新构建前端 PWA 产物。
- `happyro-gateway`：使用本次新构建的 PWA 产物重新构建 Gateway 镜像。
- `happyro-server`：重新构建 Server 镜像。
- `happyro-database`：重新构建 Database 镜像。

发布的三个镜像为：

```text
kugarocks/happyro-gateway:VERSION
kugarocks/happyro-server:VERSION
kugarocks/happyro-database:VERSION
```

三个镜像都必须包含 `linux/amd64` 和 `linux/arm64`，并在发布时统一更新 `latest`。

## 禁止复用

完整重建必须满足以下要求：

- 不读取 Git diff 来决定构建范围。
- 不跳过没有代码变更的仓库或镜像。
- 不复用先前生成的 `dist` 或其他构建产物。
- 不复用本地或远端的旧镜像作为本次发布结果。
- Docker 构建必须禁用层缓存，例如使用 Buildx 的 `--no-cache`。
- 前端 PWA 必须在本次 Gateway 镜像构建过程中从当前 client 源码重新生成。

## 执行顺序

1. 快进同步根仓库、`repos/happyro-client`、`repos/happyro-gateway` 和
   `repos/happyro-server` 的 `origin/main`。
2. 确认四个仓库均处于预期分支且工作区干净，记录各仓库当前提交。
3. 确认 Docker、Buildx 和 Docker Hub 登录状态可用。
4. 禁用 Docker 缓存，完整构建 PWA 和三个双架构镜像；此阶段不得 push 或部署。
5. 确认 PWA 和三个镜像全部构建成功。任一构建失败，立即停止后续操作。
6. 全部构建成功后，才允许使用统一版本号推送三个镜像及其 `latest` 标签。
7. 使用 `docker buildx imagetools inspect` 校验每个版本标签和 `latest` 的远端 manifest，
   确认均包含 `linux/amd64` 和 `linux/arm64`。
8. 只有全部远端 manifest 校验成功后，才允许部署该版本。

构建工具必须实现“全部构建成功后再 push”的两阶段流程。
`scripts/deploy/push-docker-images.sh` 会先使用 `--no-cache` 将全部镜像构建为临时 OCI
产物并校验架构，全部成功后才统一 push，适用于正式发布。

## 失败处理

- 任一 PWA 或镜像构建失败：停止，不 push，不部署。
- 任一镜像 push 失败：停止，不部署，并明确报告已经推送成功的标签。
- 任一远端 manifest 校验失败：停止，不部署。
- 不得用旧镜像补齐失败的镜像，也不得把部分成功的镜像视为一个完整版本。
