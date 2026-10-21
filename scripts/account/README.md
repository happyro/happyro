# scripts/account

- `test-account.sh`：在健康的 MariaDB 中确保本机测试账号存在，凭据写入 `work/runtime/test-account.env`。
- `automation-account.sh`：自动化流程使用的账号准备。

```bash
make test-account
```

可重放的四角色功能测试账号 `happyro2` 定义在 [`deploy/mariadb/fixtures/happyro2.sql`](../../deploy/mariadb/fixtures/happyro2.sql)。角色配置、停服导入及重放行为见[功能测试账号文档](https://happyro.kugarocks.com/development/test-accounts)。该 SQL 仅按需执行，不加入正式数据库自动初始化。
