# 客户端默认设置

Gateway 通过环境变量提供客户端部署默认值，涵盖镜头、自动战斗与瞬移、自动恢复、自动拾取、画质、音频、界面和地图显示。默认定义的唯一来源是 Client 仓库 `src/Core/ClientDefaults.schema.json`。完整 PWA 构建同时发布 `client-defaults.schema.json`，Gateway 使用同一份定义解析变量、校验类型和范围；非法配置会在启动时明确报错。

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
CLIENT_AUTO_COMBAT_SEARCH_RANGE=40
CLIENT_AUTO_COMBAT_ACTIVITY_RANGE=50
CLIENT_AUTO_RECOVERY_HP_TRIGGER_PERCENT=50
CLIENT_AUTO_RECOVERY_HP_TARGET_PERCENT=80
CLIENT_AUTO_RECOVERY_SP_TRIGGER_PERCENT=20
CLIENT_AUTO_RECOVERY_SP_TARGET_PERCENT=50
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

57 项客户端配置的用途、默认值、范围与示例统一维护在[公开环境变量参考](https://happyro.kugarocks.com/deploy/environment-variables#客户端默认设置-gateway)，以 Client 的 `src/Core/ClientDefaults.schema.json` 为权威输入。本页只维护构建与运行时契约，不再复制完整参数表。

自动战斗活动范围必须大于或等于寻怪范围；单独覆盖一项时，另一项使用 schema 默认值参与校验。

## 脚本文字对比度

`CLIENT_SCRIPT_TEXT_MIN_CONTRAST` 默认 4.5，接受 4.5–7 的小数。颜色自动修正始终开启，作用于桌面 NPC 对话和选项、移动端 NPC 对话，以及共用可读性处理的任务说明。颜色与实际背景的对比度已达到目标时保留原色，否则向黑色或白色调整；若背景无法达到设定目标，使用两者中对比度更高的端点。

此项是部署显示策略，不写入玩家 localStorage。改变配置后重启 Gateway 并刷新游戏页面；值越高，颜色可能偏离原始颜色越多。

## 服务端视野

服务端 `HAPPYRO_AREA_SIZE`（默认 18）与 `HAPPYRO_MAX_WALK_PATH`（默认 17）独立于客户端默认值，配置入口、生效顺序及重启要求见[地图服配置](configuration.md#地图服视野与行走)。

## 自动恢复

`CLIENT_AUTO_RECOVERY_HP_TRIGGER_PERCENT`、`CLIENT_AUTO_RECOVERY_HP_TARGET_PERCENT` 分别设置 HP 的触发比例和恢复目标；SP 对应 `CLIENT_AUTO_RECOVERY_SP_TRIGGER_PERCENT`、`CLIENT_AUTO_RECOVERY_SP_TARGET_PERCENT`。触发比例为 1–99 的整数，目标为 2–100 的整数，目标必须严格高于触发比例。启动时联合校验环境变量与未覆盖项的内置默认值。已保存的角色恢复设置优先；开关与道具选择不由环境变量强制修改。
