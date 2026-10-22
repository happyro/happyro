# 客户端默认设置

Gateway 通过环境变量提供客户端部署默认值，涵盖镜头、自动战斗与瞬移、自动拾取、画质、音频、界面和地图显示。默认定义的唯一来源是 Client 仓库 `src/Core/ClientDefaults.schema.json`。完整 PWA 构建同时发布 `client-defaults.schema.json`，Gateway 使用同一份定义解析变量、校验类型和范围；非法配置会在启动时明确报错。

## 配置入口

- macOS 原生开发：修改 `repos/happyro-gateway/.env`。模板为 `deploy/remote-client/.env.example`。
- Docker 部署：修改部署目录 `.env`，然后重新创建 Gateway 容器，使 Compose 注入新的变量；模板见 `deploy/docker/.env.example`。首次使用此功能需要包含本次改造的 Gateway 与 PWA。
- 值留空或不设置：采用当前 PWA 的内置默认值。布尔值只接受 `true` / `false`；类别列表使用逗号分隔且不重复。

例如：

```dotenv
CLIENT_CAMERA_PHONE_LANDSCAPE_ZOOM=95
CLIENT_CAMERA_PHONE_PORTRAIT_ZOOM=170
CLIENT_AUTO_TELEPORT_ENABLED=true
CLIENT_AUTO_TELEPORT_WAIT_SECONDS=2
CLIENT_AUTO_TELEPORT_INTERVAL_SECONDS=2
CLIENT_AUTO_COMBAT_SEARCH_RANGE=20
CLIENT_AUTO_COMBAT_ACTIVITY_RANGE=30
CLIENT_BGM_VOLUME=0.3
```

修改已支持的变量不需要重新构建前端。原生部署重启 Gateway，Docker 重新创建 Gateway 容器后，刷新游戏页面即可获取新配置。Gateway 重启会断开它承载的 WebSocket 游戏连接，客户端随后按现有恢复逻辑重连。新增配置项或修改内置定义时，仍需更新代码并完整构建 PWA。

## 生效与保存

优先级为：**当前浏览器已保存的玩家设置 > Gateway 环境变量默认值 > PWA 内置默认值**。

镜头、画质、音量、界面等保存在当前站点的浏览器 localStorage；自动战斗、瞬移、拾取还按服务器、账号、角色区分。不会写入游戏数据库，也不会跨浏览器或跨设备自动同步。更改部署默认值不覆盖已保存设置；“恢复默认”读取本次加载的部署默认值。地图默认显示参数也通过原有 Map 偏好保存。

镜头保存的是基础距离；竖屏根据部署的横竖屏距离差调整，并仍受地图的最小/最大镜头距离约束。选择“重置镜头”回到部署默认距离。平板/大屏按现有布局空间判定。

自动瞬移默认开启并不代表登录后自动开始战斗；当前目标、自动战斗运行状态、职业技能选择、快捷栏和排除物品列表不会从环境变量强制写入。

## 运行时配置生命周期

Gateway 在启动时读取 PWA 的默认定义和环境变量，通过 `<ROBROWSER_PUBLIC_PATH>/Config.runtime.js` 动态返回 `window.ROConfigRuntime`，带 `Cache-Control: no-store`。该路由优先于静态文件服务，不再把运行时配置写入 dist/Web；因此重建 PWA 复制空模板不会抹掉正在提供的部署配置。静态模板只供没有 Gateway 的客户端使用内置默认值。

PWA 清单校验包含 `client-defaults.schema.json`，动态 `Config.runtime.js` 不作为静态构建产物计算哈希。启动缺少默认定义的新 Gateway 会失败，应先完成新版 PWA 构建，不能只更新 Gateway 源码。更新内置默认定义后需重新加载 Gateway，确保运行时与新 PWA 使用同一版本的定义。

## 配置清单

以下是本次统一的 52 项客户端默认设置。

| 分类 | 配置项 | 环境变量 | 内置默认值 | 允许范围 |
|---|---|---|---|---|
| 镜头 | 桌面距离 | `CLIENT_CAMERA_DESKTOP_ZOOM` | `125` | 1–325 |
| 镜头 | 手机横屏距离 | `CLIENT_CAMERA_PHONE_LANDSCAPE_ZOOM` | `95` | 1–325 |
| 镜头 | 手机竖屏距离 | `CLIENT_CAMERA_PHONE_PORTRAIT_ZOOM` | `170` | 1–325 |
| 镜头 | 平板/大屏横屏距离 | `CLIENT_CAMERA_TABLET_LANDSCAPE_ZOOM` | `125` | 1–325 |
| 镜头 | 平板/大屏竖屏距离 | `CLIENT_CAMERA_TABLET_PORTRAIT_ZOOM` | `155` | 1–325 |
| 镜头 | 平滑移动 | `CLIENT_CAMERA_SMOOTH` | `true` | true / false |
| 自动战斗 | 搜怪范围 | `CLIENT_AUTO_COMBAT_SEARCH_RANGE` | `20` | 1–50，整数 |
| 自动战斗 | 活动范围 | `CLIENT_AUTO_COMBAT_ACTIVITY_RANGE` | `30` | 1–100，整数 |
| 自动战斗 | 无目标随机瞬移 | `CLIENT_AUTO_TELEPORT_ENABLED` | `true` | true / false |
| 自动战斗 | 无目标等待 | `CLIENT_AUTO_TELEPORT_WAIT_SECONDS` | `2` | 1–60，整数 |
| 自动战斗 | 最短瞬移间隔 | `CLIENT_AUTO_TELEPORT_INTERVAL_SECONDS` | `2` | 1–300，整数 |
| 自动拾取 | 开关 | `CLIENT_AUTO_PICKUP_ENABLED` | `false` | true / false |
| 自动拾取 | 范围 | `CLIENT_AUTO_PICKUP_RANGE` | `5` | 1–15，整数 |
| 自动拾取 | 每轮拾取时限 | `CLIENT_AUTO_PICKUP_BATCH_SECONDS` | `5` | 1–30，整数 |
| 自动拾取 | 默认类别 | `CLIENT_AUTO_PICKUP_CATEGORIES` | `equipment,consumable,card,other` | equipment, consumable, card, other |
| 画质 | 渲染比例 | `CLIENT_GRAPHICS_QUALITY` | `100` | 25–100 |
| 画质 | 帧率上限 | `CLIENT_GRAPHICS_FPS_LIMIT` | `60` | -1, 30, 60, 90, 120 |
| 画质 | 性能模式 | `CLIENT_GRAPHICS_PERFORMANCE_MODE` | `false` | true / false |
| 画质 | 显示范围 | `CLIENT_GRAPHICS_VIEW_AREA` | `14` | 4–20 |
| 画质 | 游戏光标 | `CLIENT_GRAPHICS_CURSOR` | `true` | true / false |
| 画质 | 像素清晰显示 | `CLIENT_GRAPHICS_PIXEL_PERFECT_SPRITES` | `false` | true / false |
| 高级画质 | 泛光开关 | `CLIENT_GRAPHICS_BLOOM_ENABLED` | `false` | true / false |
| 高级画质 | 景深开关 | `CLIENT_GRAPHICS_BLUR_ENABLED` | `false` | true / false |
| 高级画质 | 抗锯齿开关 | `CLIENT_GRAPHICS_FXAA_ENABLED` | `false` | true / false |
| 高级画质 | 自然饱和度开关 | `CLIENT_GRAPHICS_VIBRANCE_ENABLED` | `false` | true / false |
| 高级画质 | 卡通开关 | `CLIENT_GRAPHICS_CARTOON_ENABLED` | `false` | true / false |
| 高级画质 | 锐化开关 | `CLIENT_GRAPHICS_CAS_ENABLED` | `false` | true / false |
| 高级画质 | 泛光强度 | `CLIENT_GRAPHICS_BLOOM_INTENSITY` | `0.5` | 0.1–3 |
| 高级画质 | 景深范围 | `CLIENT_GRAPHICS_BLUR_AREA` | `14` | 3–20 |
| 高级画质 | 景深强度 | `CLIENT_GRAPHICS_BLUR_INTENSITY` | `3` | 2–10 |
| 高级画质 | 抗锯齿边缘阈值 | `CLIENT_GRAPHICS_FXAA_EDGE_THRESHOLD` | `0.125` | 0.063–0.333 |
| 高级画质 | 饱和强度 | `CLIENT_GRAPHICS_VIBRANCE` | `0.15` | -0.9–0.9 |
| 高级画质 | 卡通强度 | `CLIENT_GRAPHICS_CARTOON_POWER` | `1.5` | 0.1–9.9 |
| 高级画质 | 描边强度 | `CLIENT_GRAPHICS_CARTOON_EDGE_SLOPE` | `1.5` | 1.5–5.9 |
| 高级画质 | 锐化对比度 | `CLIENT_GRAPHICS_CAS_CONTRAST` | `0` | 0–1 |
| 高级画质 | 锐化强度 | `CLIENT_GRAPHICS_CAS_SHARPENING` | `1` | 0–1 |
| 音频 | 背景音乐开关 | `CLIENT_BGM_ENABLED` | `true` | true / false |
| 音频 | 背景音乐音量 | `CLIENT_BGM_VOLUME` | `0.5` | 0–1 |
| 音频 | 音效开关 | `CLIENT_SOUND_ENABLED` | `true` | true / false |
| 音频 | 音效音量 | `CLIENT_SOUND_VOLUME` | `0.5` | 0–1 |
| 界面 | 通知显示时长 | `CLIENT_TOAST_DURATION_SECONDS` | `2` | 1–10，整数 |
| 界面 | 紧凑布局聊天预览行数 | `CLIENT_CHAT_PREVIEW_COMPACT_LINES` | `3` | 2, 3, 4, 5, 6, 7, 8 |
| 界面 | 宽松布局聊天预览行数 | `CLIENT_CHAT_PREVIEW_SPACIOUS_LINES` | `5` | 2, 3, 4, 5, 6, 7, 8 |
| 界面 | 聊天预览频道标签 | `CLIENT_CHAT_PREVIEW_TABS` | `true` | true / false |
| 地图显示 | 雾 | `CLIENT_MAP_FOG` | `false` | true / false |
| 地图显示 | 光照贴图 | `CLIENT_MAP_LIGHTMAP` | `true` | true / false |
| 地图显示 | 技能特效 | `CLIENT_MAP_EFFECTS` | `true` | true / false |
| 地图显示 | 简化特效 | `CLIENT_MAP_MIN_EFFECTS` | `false` | true / false |
| 地图显示 | 显示未命中 | `CLIENT_MAP_SHOW_MISS` | `true` | true / false |
| 地图显示 | 名称字体样式 | `CLIENT_MAP_SHOW_NAME_STYLE` | `true` | true / false |
| 地图显示 | 光照平滑参数 | `CLIENT_MAP_SMOOTH_LIGHT` | `0` | 0, 1, 2 |
| 地图显示 | 光环模式 | `CLIENT_MAP_AURA` | `1` | 0, 1, 2 |

自动战斗活动范围必须大于或等于搜怪范围；单独覆盖其中一项时，另一项使用同一份内置默认值参与校验。
