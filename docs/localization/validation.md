# 本地化校验

校验按阶段进行：源文件结构、生成一致性、Gateway 端点、客户端测试、真实浏览器。

## 资源配置

```bash
make configure-resources
make gateway-verify
```

`configure-resources.sh` 会检查：

- `msgstringtable.txt` 至少覆盖客户端消息 ID 行数；
- `titletable.json` 含 47 条，抽查 ID 1000 和 1046；
- 技能名称和说明表至少 1600 条，且无韩文；
- 卡片前缀表恰好 1081 条，且无韩文。

Gateway 健康检查会再请求这些 `/data` 端点，确认线上内容与覆盖源一致。

## 生成器

```bash
node scripts/resources/generate-skill-localization.mjs --check --no-color
node scripts/resources/generate-navigation-data.mjs --check --no-color
python3 -m unittest discover tools/resources/catalog/tests
```

技能和导航生成器在输入集合、大小、哈希或固定版本记录数量不一致时直接失败，不使用旧快照继续生成。

## LUB 回编译

```bash
python3 tools/client/build/lua50/main.py build
python3 tools/client/build/lua51/main.py build
```

默认输入是 `localization/sources/kro-20211105/merged/files/lub/`。工具会按目标 ABI 编译，并用同版本 Lua 做语义回环。编译成功只证明 LUB 内字符串为 UTF-8，不代替客户端字体和渲染验收。

## 客户端与浏览器

```bash
cd repos/happyro-client && npm test
```

界面、物品名、技能窗、导航和仓库等改动必须在真实浏览器中进入游戏后核对。Gateway 缓存、PWA Service Worker 和运行目录 LUB 都可能导致“源文件已改、画面仍是旧文案”。
