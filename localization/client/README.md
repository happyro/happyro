# 客户端本地化覆盖资源

本目录保存 UTF-8 散装中文覆盖，供 Gateway 按同路径提供给客户端。官方 GRF 保持不变。

完整生效链、资源表、卡片前缀和暂不翻译的旧 TXT 见 [docs/localization/client-resources.md](../../docs/localization/client-resources.md)。

生成技能表：

```bash
node scripts/resources/generate-skill-localization.mjs --write
```

生成卡片前缀并安装运行资源：

```bash
python3 tools/resources/catalog/generate_item_name_overrides.py --write
make configure-resources
```
