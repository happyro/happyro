# scripts/resources

- `configure-resources.sh apply`：校验中文覆盖、链接 GRF / AI / System，安装卡片前缀表和 The Sign 四张中文公告图片。无参数只显示帮助。
- `generate-skill-localization.mjs`：从服务端技能库生成中文技能资源。
- `generate-navigation-data.mjs`：生成 PWA 导航目录和寻路图。
- 跨机器构建资源包由 `python3 tools/release/release.py resources create` 负责，见[发布工具](../../tools/release/README.md)。

```bash
make configure-resources
```

```bash
node scripts/resources/generate-skill-localization.mjs --write
```

```bash
node scripts/resources/generate-navigation-data.mjs --write
```

```bash
python3 tools/release/release.py resources create
```

资源归档保留构建工作区目录结构，包含整个 kRO 运行目录、物品和魔物图片；API 的 NPC、地图和地形资源由 Git 仓库提供。输出路径、传输与清理说明见 [Docker 发布手册](../../docs/operations/docker-release.md)。

脚本不带参数只显示帮助；不需要颜色时加 `--no-color`。

The Sign 公告源位于 `localization/client/data/texture/유저인터페이스/illust/`，中文文字及来源哈希见 `localization/client/data/sign-notices.zh-CN.json`。`configure-resources.sh apply` 将四张图片安装到 Gateway 松散资源和运行客户端 data 目录，供资源打包读取；不带参数不会安装。
