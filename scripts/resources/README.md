# scripts/resources

- `configure-resources.sh apply`：校验中文覆盖、链接 GRF / AI / System，安装卡片前缀表。无参数只显示帮助。
- `generate-skill-localization.mjs`：从服务端技能库生成中文技能资源。
- `generate-navigation-data.mjs`：生成 PWA 导航目录和寻路图。

```bash
make configure-resources
node scripts/resources/generate-skill-localization.mjs --write
node scripts/resources/generate-navigation-data.mjs --write
```

无参数运行生成器只显示帮助。
