# 故障检查

## 先跑 doctor

```bash
make doctor
make status
```

`doctor` 失败时先处理缺失命令、上游基线、封包配置或环境文件，再启动服务。

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

## 数据库

```bash
make database-status
docker inspect --format '{{.State.Health.Status}}' happyro-mariadb
```

未初始化时先 `make database-start`。测试账号脚本依赖健康的 MariaDB 和 `work/runtime/mariadb-10.11/compose.env`。

## Admin 前端改动未生效

核对该端口监听进程是否属于 systemd 服务，而不是只看编译日志。发现孤立进程时，只终止已核实的进程，然后 `systemctl restart happyro-admin-frontend.service`。不要使用宽泛的 `pkill node`。
