# 魔物

## 权威来源

- 属性、掉落、常驻刷新：`repos/happyro-server/db/re/mob_db.yml` 与刷新配置。
- 中文名称与精灵映射：`repos/happyro-client/src/DB/Monsters/`。
- 图片：GRF 中魔物 SPR 的首帧。

导航里的魔物记录只说明客户端已知分布，不代表某只魔物当前存在。召唤始终由 map-server 判断。

## 生成命令

```bash
python3 tools/resources/catalog/main.py monsters
cd repos/happyro-client && npm run catalog:monsters
```

根仓库命令生成 Admin 双语快照和 PNG。Client 命令生成 PWA 魔物图鉴资源。

## 输出位置

| 产物 | 路径 |
| --- | --- |
| Admin 快照 | `repos/happyro-admin/backend/resources/game-data/monsters/` |
| PNG | `work/game-data/monsters/kro-20211105/` |
| Client 图鉴资源 | `repos/happyro-client/applications/pwa/data/monsters/` |

## 消费者

- Admin 魔物查询与召唤表单。
- 冒险工具魔物图鉴。
- 右上角导航的魔物搜索（导航目录，不是实时刷新表）。

## 校验规则

- 服务端魔物 ID 与客户端名称表必须能合并出完整中文名。
- 无图片的魔物仍保留在目录中，使用占位。
- 客户端不得把图鉴记录当作召唤许可。
