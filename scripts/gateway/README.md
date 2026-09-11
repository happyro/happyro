# scripts/gateway

- `configure-gateway.sh`：安装 `deploy/remote-client/.env.example` 为 Gateway `.env`。
- `gateway.sh`：以 systemd transient unit 启动、停止、校验 `happyro-gateway.service`。
- `test-gateway.sh`：网关测试入口。

Gateway 监听 `3338`。启动前会验证 Server，并重新配置资源和网关。

```bash
make configure-gateway
make gateway-start
```
