# 故障检查

## 先跑 doctor

```bash
make doctor
make status
```

`doctor` 是配置检查，不是完整运行健康检查。它依赖已有应用检出和部分生成配置；缺失时先按[本地开发](../development/local-setup.md)准备。

若报告 `HappyRO Gateway is not at locked commit`，当前脚本在 `scripts/maintenance/doctor.sh` 要求 Gateway HEAD 精确等于 `versions/sources.lock` 中的旧锁定值。维护分支有新提交也会失败。这不是回退源码的理由：检查锁定提交是否是当前 HEAD 祖先，再独立验证封包、配置、端口与服务。更新锁定策略需要单独修改脚本和基线，不在排障时执行 `git checkout` 丢弃新版本。

`make status` 目前只汇总 Client / Server / Gateway 分支、数据库和五个游戏服务；不检查 Admin，也不访问浏览器。Admin 另用 `systemctl status happyro-admin-backend happyro-admin-frontend`。

## 端口占用

Gateway 要求 `3338` 空闲。Server 四个端口必须分别由对应 systemd 单元监听。Admin 前端 `8000` 必须属于 `happyro-admin-frontend.service` 的 cgroup，不能用孤立的 `umi` 进程。

```bash
ss -ltnp 'sport = :3338'
ss -ltnp 'sport = :8000'
systemctl status happyro-gateway.service
systemctl status happyro-admin-frontend.service
```

## 资源仍是韩文或旧文件

1. 确认覆盖源在 `localization/client/data/` 或运行目录中已更新。
2. 重新执行 `make configure-resources`。
3. 重启 Gateway。Gateway 缓存已读文件，只改磁盘不够。
4. 用 `make gateway-verify` 检查消息表、称号和技能说明端点。
5. 浏览器强制刷新，排除 Service Worker 旧缓存。

卡片前缀安装到 `repos/happyro-gateway/data/cardprefixnametable.txt`。物品名称来自运行目录 `System/itemInfo_true.lub`，不是已归档的 `itemlocalization.json`。

## 进不去游戏

- `make server-verify`：四个 rAthena 服务是否 ready。
- `make gateway-verify`：PWA、本地化资源和 Web API 代理。
- 查看 `work/runtime/rathena-20211103/logs/` 与 `work/runtime/gateway/gateway.log`。
- 确认浏览器访问的是 Gateway `3338`，而不是 Client Vite 开发页，除非正在单独调试 UI。

## 游戏中断线

先记录本地时间与角色、动作，再检查 `journalctl -u happyro-map --since ...`、地图日志和 Gateway 结构化连接日志。区分服务重启、TCP/WS 关闭、非法包、未完成帧超时及每 IP 建连频率保护。Gateway 日志包含 connectionId、时间、关闭原因和字节计数；同一个前端登录会先后建立 login、char、map 三条连接，其中旧阶段关闭是正常切换。

日志出现“合法长度但当前字节不足”时应对照[字节流契约](../architecture/game-stream.md)，不能仅凭一次 recv 的长度判定客户端发错包。真实端口测试会产生预期拒绝日志，应与玩家故障区分。

## iOS 攻击时整个画面停顿

先按[移动端性能日志回传](../development/mobile-diagnostics.md)采集同一设备、同一浏览器下开启和关闭音效的战斗对照。对比实际帧间隔与 `audio.start` 同步耗时，区分资源加载／解码的异步等待时间；旧构建使用 `audio.play.*` 指标。

[2026-09-24 调查记录](../history/validation/2026-09-24-ios-audio-stutter.md)观察到缓存音效 `.play()` 调用最高耗时 242ms，关闭音效后明显改善。短音效现已统一迁移到 Web Audio，并完成本机浏览器及 iPhone Chrome 实机验证：新构建 `mufpt8su` 的 35 秒音效开启样本中，124 次音效启动的同步耗时最高 1ms，用户确认流畅且音效正常。iPad 与 Safari 的修复后实机样本尚未单独采集；关闭音效只用于对照。

## 技能无法释放或说明窗口越界

确认服务端下发技能类型、等级与 `SKILL_POSTDELAY`，再对照施放请求和 ACK。`cause=4` 是间隔未结束；不是所有失败都能通过清数据库解决，在线角色状态由地图服持有。说明中的时间是配置参考，实际倒计时由服务器下发。详见[技能与状态](../game-data/skills.md)。

技能说明窗口应有标题栏、内部滚动，窄屏最高为视口 80%。仍不能拖动或看不到底部时先运行 `./scripts/client/refresh-client.sh verify --no-color` 并强制刷新，确认不是旧构建。

## 数据库

```bash
make database-status
docker inspect --format '{{.State.Health.Status}}' happyro-mariadb
```

未初始化时先 `make database-start`。测试账号脚本依赖健康的 MariaDB 和 `work/runtime/mariadb-10.11/compose.env`。

## Admin 前端改动未生效

核对该端口监听进程是否属于 systemd 服务，而不是只看编译日志。发现孤立进程时，只终止已核实的进程，然后 `systemctl restart happyro-admin-frontend.service`。不要使用宽泛的 `pkill node`。

## Docker 部署下 Admin 后端改动未生效

本机 systemd 部署没有这个问题；只发生在 Docker 离线包部署（见[离线部署](docker-deployment.md)）。Admin 镜像开启了 OPcache 且 `validate_timestamps=0`，只信任构建镜像时打包的文件快照，容器内改代码或重启容器都不会生效。必须重新构建 Admin 镜像并 `docker compose up -d --pull never admin`。
