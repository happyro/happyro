# 中文演示环境部署

HappyRO 中文演示环境使用 `happyro-demo.kugarocks.com`，运行目录为 `/opt/happyro-demo/current`，kRO 2021-11-05 资源固定放在 `/root/happyro/kro-20211105/client`。

## 发布

在开发机生成归档：

```bash
tools/deploy/package-demo.sh --build
```

上传并解压到 `/opt/happyro-demo/releases/<时间戳>`，再将 `/opt/happyro-demo/current` 指向该目录。数据库使用 Ubuntu 系统 MariaDB，不使用 Docker。首次部署执行：

```bash
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y mariadb-server
install -m 0644 /opt/happyro-demo/current/deployment/deploy/production/mariadb/60-happyro.cnf /etc/mysql/mariadb.conf.d/
/opt/happyro-demo/current/deployment/deploy/production/configure-runtime.sh configure
install -m 0644 /opt/happyro-demo/current/deployment/deploy/production/systemd/*.service /etc/systemd/system/
install -m 0644 /opt/happyro-demo/current/deployment/deploy/production/systemd/*.timer /etc/systemd/system/
install -m 0644 /opt/happyro-demo/current/deployment/deploy/production/openresty/happyro-demo.kugarocks.com.conf /etc/nginx/conf.d/
systemctl daemon-reload
systemctl enable mariadb.service happyro-mariadb.service happyro-login.service happyro-char.service happyro-map.service happyro-web-api.service happyro-gateway.service
systemctl enable --now happyro-database-reset.timer
systemctl restart mariadb.service
systemctl restart happyro-gateway.service
systemctl reload openresty
```

systemd 依赖链会先初始化 MariaDB 数据库，再依次启动 login、char、map、web API 和 Gateway。数据库密钥保存在 `/etc/happyro`，数据库数据使用系统目录 `/var/lib/mysql`，均不进入发布归档。MariaDB 只监听 `127.0.0.1:33062`，并按 1.6 GiB 演示机限制缓冲池、连接数和表缓存。

本演示 ECS 不使用 Docker。确认没有其他容器业务后，停止并禁用相关进程：

```bash
systemctl disable --now docker.service docker.socket containerd.service
```

演示环境关闭 `_M` / `_F` 自动注册，保留已有账号的角色创建能力，并将每账号角色上限明确设为 15。固定测试账号为 `happyro1` 至 `happyro9`，密码均为 `happyro`。

`happyro-database-reset.timer` 每天北京时间 7:00 停止游戏服务，重建 `happyro` 和 `happyro_log` 数据库，恢复内部通信账号和九个测试账号，再启动完整服务链。可手动验收：

```bash
systemctl start happyro-database-reset.service
systemctl status happyro-database-reset.service
systemctl list-timers happyro-database-reset.timer
```

## 验证

```bash
systemctl status happyro-gateway.service
systemctl status happyro-database-reset.timer
curl -fsS http://127.0.0.1:3338/api/health
curl -fsS https://happyro-demo.kugarocks.com/applications/pwa/index.html
ss -ltn
```

公网只能暴露 OpenResty 的 80/443；MariaDB、rAthena 和 Gateway 仅监听回环地址。若从 MySQL 8 切换，Ubuntu 安装器保留的 `/var/lib/mysql-8.0` 不得在核实数据前删除。
