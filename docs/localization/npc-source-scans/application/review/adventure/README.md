# 第三轮审查：冒险工具数据同步

本轮没有新增 NPC 改名或脚本正文修改。重新验证脚本变更清单及启用关系，重点核对冒险工具的数据来源和本机生效状态。

## 发现并处理

1. 本机 API 数据库仍有 3,743 个旧显示名，虽然源 JSON 已更新。通过现有 `happyro-api catalog import` 完整校验并原子发布目录，当前 generation 为 19。没有直接修改游戏角色或 NPC 数据库。
2. PWA 已构建的 NPC 实例目录及资源清单仍是旧版。执行 `npm run build -- --all`，随后通过 `scripts/client/refresh-client.sh verify --no-color` 验证 3338 提供的新构建，入口仍为含“进入游戏”的启动页。

## 跨端调用核对

- NPC 页通过 `searchAdventureNpcs` 请求 `/api/adventure-tools/npcs`；地图页通过地图 NPC 接口读取列表。两者经过 `toCatalogNpcs`，使用 API 的 `display_name`。
- 桌面和移动端共用注册的 NPC/地图页组件，列表和详情标题均读取转换后的 `npc.name`；地图标记沿用同一 NPC 对象与坐标。
- API 从 `catalog_state` 指向的当前 generation 查询，没有因进程未重启而继续固定旧目录；导入完成即可供下一次列表请求使用。
- 静态导航通过 `npc-instances.json` 按地图坐标获取实例名称。本轮逐条验证全部 3,743 个改名实例与当前名称相同，未套用其他地点的同名 NPC。

## 验收证据

数据库全部 13,432 条记录逐条匹配源目录的名称、内部声明、坐标、形象及导航对象。再把这 13,432 条数据库记录通过客户端实际共用转换函数，全部显示名、原始声明和坐标一致。

通过 HTTP 获取当前 3338 的两份 NPC 数据文件，SHA-256 与源码产物一致；全部构建关键文件通过刷新脚本校验。版本、构建标识和核对范围见 [verification.json](verification.json)。

冒险工具的 NPC 页、地图页、移动端宿主、世界实体转换及导航测试，以及 API 目录/HTTP 路由测试已执行，结果见同目录验证记录。

本次只更新本机 API 目录与 PWA；未重启游戏服、未热重载服务端 NPC 脚本、未进行游戏内实机验证。已打开的冒险工具可关闭重开，静态导航需刷新页面加载新资源。

后续名称修改验收必须同时检查源目录、数据库当前 generation 和 Gateway 实际提供的 PWA 文件；仅生成 JSON 不能证明冒险工具已同步。
