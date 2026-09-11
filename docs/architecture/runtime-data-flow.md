# 运行时数据流

本文说明玩家会话和 GM 操作经过哪些进程，以及哪些数据是静态的、哪些必须由服务器当场裁决。

## 浏览器会话

```text
PWA (dist/Web)
  → Gateway :3338
       ├── 静态页面与生成 JSON
       ├── /data/<path> 资源查找
       ├── /ws/ → rAthena TCP（login / char / map）
       └── HTTP 代理 → web-server :8889
```

客户端不直连 login / char / map 端口。WebSocket 目标白名单为 `127.0.0.1:6900,127.0.0.1:6121,127.0.0.1:5121`。

## 资源查找

Gateway 处理 `/data/...` 的顺序为：

1. Gateway 仓库内同路径的本地文件，例如 `repos/happyro-gateway/data/...`。
2. `DATA_OVERRIDE_PATH` 中按顺序配置的目录。当前为已审查运行目录，然后是 `localization/client/data/`。
3. 官方 `data.grf`。

命中结果会进入 Gateway 文件缓存。修改覆盖文件或 GRF 后必须重新配置资源并重启 Gateway，只改源文件不会生效。完整路径见 [客户端资源](../localization/client-resources.md)。

## 静态游戏数据

构建期生成、运行期只读：

- 技能名称、说明、技能树：Client 生成模块，进入游戏不再执行对应 LUB。
- 导航目录与寻路图：PWA `data/navigation/*.json`，按需加载。
- NPC / 魔物 / 地图图鉴：Client 与 Admin 消费同一套生成目录。
- 物品显示名和说明：运行目录中的 `System/itemInfo_true.lub`。
- 系统消息、称号、技能 TXT、卡片前缀：`localization/client/data/`。

这些文件描述“游戏里有什么”，不证明某个实体此刻存在，也不授予传送或召唤权限。

## 服务器权威

map-server 裁决：

- 账号与角色是否允许执行操作；
- 地图是否已加载、能否进入、是否禁止传送；
- NPC 是否可见、坐标是否可落点；
- 魔物召唤位置、Boss / MVP 限制和冷却；
- 背包、邮件、鉴定等物品变更。

客户端提交请求 ID、目标或坐标；成功后才更新本地冷却和界面。Admin 的 Game Control 走同一权威，不通过 SQL 改写 map-server 内存。

## Admin 数据流

```text
Admin 前端 :8000
  → Laravel :18081
       ├── happyro_admin     管理员、角色、权限、审计
       ├── happyro           玩家账号与角色查询（游戏库）
       ├── 静态资料 JSON     物品 / 魔物 / 地图 / NPC 目录
       └── Game Control      在线角色与地图实体变更
```

游戏内冒险工具需要调用 Admin 能力时，由 Gateway 做同源反向代理，避免把服务密钥下发到浏览器。
