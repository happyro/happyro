# scripts/database

`database.sh` 管理本机 MariaDB Compose：`start`、`stop`、`status`、`verify`。

配置来自 `deploy/mariadb/profile.env`，运行时状态在 `work/runtime/mariadb-10.11/`。端口为 `127.0.0.1:33062`。

```bash
make database-start
make database-verify
```
