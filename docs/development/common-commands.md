# 常用命令

根仓库 `Makefile` 是本机业务入口。脚本路径见 [scripts/README.md](../../scripts/README.md)。底层生成器见 [tools/README.md](../../tools/README.md)。

## 环境

```bash
make doctor
make status
make fetch-upstreams
make upstream-status
```

## 数据库

```bash
make database-start
make database-status
make database-verify
make database-stop
```

## 服务端

```bash
make configure-server
make build-server
make server-start
make server-status
make server-verify
make server-stop
```

## 客户端与网关

```bash
make configure-client
make configure-gateway
make configure-resources
./scripts/client/refresh-client.sh build --no-color
./scripts/client/refresh-client.sh verify --no-color
make gateway-start
make gateway-status
make gateway-verify
make gateway-stop
make test-client
make test-gateway
```

## 测试账号

```bash
make test-account
make automation-account
```

## 资料与本地化生成

这些命令不在 Makefile 中，需要显式执行：

```bash
python3 tools/resources/catalog/main.py items client
python3 tools/resources/catalog/main.py items server
python3 tools/resources/catalog/main.py items images
python3 tools/resources/catalog/main.py monsters
python3 tools/resources/catalog/generate_item_name_overrides.py --write
node tools/generate-npc-catalog.mjs generate
node scripts/resources/generate-skill-localization.mjs --write
node scripts/resources/generate-navigation-data.mjs --write
```

无参数运行上述 CLI 只显示帮助，不写文件。

`refresh-client.sh build` 要求 Gateway 已运行，因为构建后立即核对 HTTP 产物。首次启动前先在 Client 执行 `npm install` 和 `npm run build:pwa`，再启动 Gateway。

## 应用仓库内命令

```bash
(cd repos/happyro-client && npm test && npm run build:pwa)
(cd repos/happyro-gateway && node --test test/*.test.js)
(cd repos/happyro-admin/backend && php artisan test)
(cd repos/happyro-admin/frontend && npm run lint && npm run test && npm run build)
```

服务端编译使用根仓库 `make build-server`，不要绕过 HappyRO 配置直接调用上游安装脚本作为本机默认路径。
