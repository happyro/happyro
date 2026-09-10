# 构建与环境重载

## 本轮需要执行

| 变更 | 操作 | 原因 |
| --- | --- | --- |
| happyro-client 源码 | 重新构建 PWA | 浏览器运行的是构建产物 |
| gateway 源码、`.env` 或资源链接 | 重新配置资源并重启 gateway | Node 进程和符号链接不会自动更新 |
| `localization/client/data` | 重启或重新加载 gateway | loose-data 覆盖由 gateway 提供 |
| `conf/motd.txt` | 重启相关 rAthena 服务 | 让服务重新读取 MOTD |

对应命令：

```bash
bash scripts/client/test-client.sh
bash scripts/gateway/test-gateway.sh
bash scripts/resources/configure-resources.sh
bash scripts/gateway/gateway.sh stop
bash scripts/gateway/gateway.sh start
bash scripts/server/server.sh stop
bash scripts/server/server.sh start
```

停止和启动会影响当前服务，应在确认没有其他验证会话后执行。单纯复核当前进程可使用 `gateway.sh verify` 和 `server.sh verify`。

## 本轮不需要执行

- 不重建 SQL 数据库。
- 不重新初始化账号、角色或游戏数据。
- 不修改或重新打包官方 GRF。
- 不改变固定的 `PACKETVER=20211103`、Renewal 或客户端/服务端封包设置。

## 运行生成物

构建输出、gateway 的 `AI/BGM/System` 符号链接、`work/runtime/ui-audit/**` 以及 `work/translation-merge/**` 都应保留在运行/工作目录，不与维护源混合提交。
