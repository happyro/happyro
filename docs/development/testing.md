# 测试与构建

## 根仓库

```bash
make doctor
make test-client
make test-gateway
make build-server
make test
```

`make test` 依次执行 doctor、客户端测试、网关测试和服务端编译。它不启动完整游戏世界，也不覆盖 Admin。

## Client

```bash
cd repos/happyro-client
npm test
npm run lint
npm run catalog:world
npm run catalog:monsters
npm run build:pwa
```

涉及 UI、导航、图鉴或静态数据时，还需要真实浏览器走完进入游戏、打开对应窗口和操作路径。构建产物位于 `repos/happyro-client/dist/Web`。

## Gateway

```bash
cd repos/happyro-gateway
npm run test:runtime-config
npm run test:proxy
npm run test:safe-path
npm run doctor
```

资源变更后执行 `make configure-resources` 和 `make gateway-verify`，确认消息表、称号、技能说明和 PWA 端点返回预期中文内容。

## Server

```bash
make build-server
make server-verify
```

`server-verify` 检查四个服务在配置端口监听，并确认日志出现 connected-ready 标记。修改 Game Control 或自定义封包后，必须同时验证 Client 封包编号和 Admin 命令路径。

## Admin

```bash
cd repos/happyro-admin/backend && php artisan test
cd repos/happyro-admin/frontend && npm run lint && npm run test && npm run build
```

前端必须以 `happyro-admin-frontend` 服务提供的进程为准验收，不能用手工 `umi` 长期占用 `8000`。

## 资料生成器

```bash
python3 -m unittest discover tools/resources/catalog/tests
node --test tools/generate-npc-catalog.test.mjs
```
