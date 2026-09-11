# scripts/server

- `configure-server.sh apply`：按 `deploy/rathena/profile.env` 写入服务端导入配置。无参数只显示帮助。
- `build-server.sh`：编译 login / char / map / web。
- `server.sh`：启动、停止、校验四个 rAthena 服务。

```bash
make configure-server
make build-server
make server-start
```

端口：login `6900`、char `6121`、map `5121`、web `8889`。
