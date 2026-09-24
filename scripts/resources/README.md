# scripts/resources

- `configure-resources.sh apply`：校验中文覆盖、链接 GRF / AI / System，安装卡片前缀表。无参数只显示帮助。
- `generate-skill-localization.mjs`：从服务端技能库生成中文技能资源。
- `generate-navigation-data.mjs`：生成 PWA 导航目录和寻路图。
- `package-offline-resources.sh create`：将运行客户端、物品和魔物图片打成跨机器传输用的 `.tar.gz`，同时生成同名 `.sha256` 校验文件，不会覆盖已有包。

```bash
make configure-resources
node scripts/resources/generate-skill-localization.mjs --write
node scripts/resources/generate-navigation-data.mjs --write
bash scripts/resources/package-offline-resources.sh create --output artifacts/happyro-resources-20260924.tar.gz
```

资源归档包含 `inputs/runtime/kro-20211105/client/`、`work/game-data/items/kro-20211105/` 和 `work/game-data/monsters/kro-20211105/`。传输归档和 `.sha256` 后，先在文件所在目录运行 `sha256sum -c happyro-resources-20260924.tar.gz.sha256`；macOS 可用 `shasum -a 256 -c`。目标电脑在 HappyRO 工作区根目录解压后，按 [Docker 发布手册](../../docs/operations/docker-release.md) 运行 `prepare`。Admin 的 NPC、地图和地形资源由其 Git 仓库提供。这个归档仅用于构建机间传输，不是可部署的离线安装包。

脚本不带参数只显示帮助；不需要颜色时加 `--no-color`。
