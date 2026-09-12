# 系统概览

HappyRO 是浏览器可玩的中文 RO 栈。玩家只访问 Gateway；登录、角色、地图权威在 rAthena；GM 操作走独立的 Admin 后台。

固定基线为 `PACKETVER=20211103`、Renewal、kRO 2021-11-05 客户端资源。Client 与 Server 的包定义和混淆设置必须一致；Gateway 透明转发字节流，Admin 使用相应服务端接口。

## 仓库职责

| 仓库 | 职责 |
| --- | --- |
| 根仓库 | 编排脚本、本机配置、官方输入清单、版本化本地化覆盖、跨仓库文档 |
| `happyro-client` | 浏览器 PWA、游戏 UI、静态中文表、世界图鉴前端 |
| `happyro-server` | login / char / map / web-server，NPC 脚本，游戏数据库定义，Game Control |
| `happyro-gateway` | PWA 静态文件、`/data` 资源、GRF、WebSocket 代理、rAthena Web API 反向代理 |
| `happyro-admin` | GM 认证、玩家查询、游戏资料、物品发放和运行中世界操作 |

## 运行时拓扑

游戏 TCP 与数据库本机默认绑定回环地址。Gateway 对浏览器监听 `3338`，可经局域网访问；Admin 的绑定由其部署配置管理。

```text
浏览器
  ├── HTTP  /applications/pwa/*     → Gateway :3338 → Client dist/Web
  ├── HTTP  /data/*                 → Gateway 本地文件 / 覆盖目录 / GRF
  ├── WS    /ws/                    → Gateway → rAthena TCP
  │                                     ├── login-server :6900
  │                                     ├── char-server  :6121
  │                                     └── map-server   :5121
  └── HTTP  /userconfig 等 Web API  → Gateway → web-server :8889

Admin 浏览器 :8000
  └── HTTP API :18081               → Laravel
        ├── MariaDB :33062
        │     ├── happyro / happyro_log   游戏库（只读查询与发放记录）
        │     └── happyro_admin           后台账号、权限、审计
        └── Game Control                → map-server Unix Socket / web-server
```

MariaDB 本机端口为 `33062`，避免与系统默认 `3306` 冲突。数据库镜像或 Compose 只服务游戏库初始化；Admin 使用同一实例中的独立 `happyro_admin` 库。

## 玩家进入游戏

1. 浏览器加载 Gateway 提供的 PWA。
2. 客户端按 `Config.happyro.js` 连接当前页面的 `/ws/` 和 `/data/`。
3. Gateway 把 WebSocket 转到 login / char / map 的 TCP 端口。
4. 角色进入地图后，技能、导航等静态数据来自 PWA 构建产物；物品图标、地图、LUB 等按资源查找顺序由 Gateway 提供。
5. 客户端计算和展示导航路线；角色移动、传送、召唤的有效性由 map-server 裁决。

## Admin 与游戏世界

Admin 不模拟 map-server 内存。后台读取静态资料目录和 MariaDB 中的玩家数据；发放物品、召唤魔物、修改在线角色等操作经 Game Control 到达 map-server。冒险工具在游戏内发起的同类请求，由 Gateway 同源反向代理到 Admin API，浏览器不持有服务密钥。
