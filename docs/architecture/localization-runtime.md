# 本地化运行时

中文资源不修改官方 GRF。经过审查的散装文件和已编译 LUB 作为覆盖进入 Gateway，由客户端按当前加载分支读取。

当前生效链、文件清单和暂不翻译的旧 TXT 见 [客户端资源](../localization/client-resources.md)。汉化方法和限制见 [本地化概览](../localization/overview.md)。

## 覆盖，而不是改包

```text
inputs/official/          只读官方安装包
inputs/runtime/...        允许写入已校验 LUB / 文本
localization/client/data  UTF-8 散装覆盖
localization/sources/...  回编译仍使用的 JSON / 文本源
        ↓
Gateway 查找顺序：本地文件 → DATA_OVERRIDE_PATH → GRF
        ↓
Client DB 加载器 / Lua 运行时
```

`repos/happyro-gateway/data/` 是本机部署副本。卡片前缀表由 `scripts/resources/configure-resources.sh` 安装到该目录；消息表、称号、技能 TXT 走覆盖路径。

## 静态数据与服务器权威

本地化只替换玩家可见字符串和客户端展示资源：

- 界面、物品名、技能名、NPC 显示名、系统消息；
- 构建期生成的技能树和导航目录。

以下内容始终以服务器为准，译文不能赋予权限：

- 物品能否获得、鉴定结果、价格结算；
- NPC 当前是否可见；
- 地图能否进入；
- 魔物能否召唤。

## 构建期静态化

技能定义、技能树和导航目录在构建时从已核验 LUB 快照生成 JavaScript / JSON，进入游戏不再请求或执行对应数据 LUB。普通角色启动只保留一个数据库 Lua WASM 实例。细节见 [客户端静态运行数据](client-static-runtime-data.md)。
