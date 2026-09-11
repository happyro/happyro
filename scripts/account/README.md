# scripts/account

- `test-account.sh`：在健康的 MariaDB 中确保本机测试账号存在，凭据写入 `work/runtime/test-account.env`。
- `automation-account.sh`：自动化流程使用的账号准备。

```bash
make test-account
```
