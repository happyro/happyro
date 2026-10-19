# 测试与构建

## 日常改动的验收环境

后续功能改动统一使用本机开发服务验收：Gateway `http://127.0.0.1:3338`，手机／平板通过 `rodev-mba.kugarocks.com` 访问同一环境。数据库使用 Docker，其它开发服务在本机运行。客户端完整构建后核对 Gateway 实际提供的产物，不以浏览器临时替换脚本代替本机部署验收。

不使用离线包验收环境承接日常改动；只有明确要求离线包、镜像或发布验收时，才另行使用对应发布流程。

## 根仓库

```bash
make doctor
make test-client
make test-gateway
make build-server
make test
```

`make test` 声明 doctor、客户端测试、网关检查和服务端编译为前置任务；不要用 `make -j test` 假定它们仍按顺序执行。它会安装配置、构建产物，不是只读审查，不启动完整游戏世界，也不覆盖 Admin。doctor 的锁定提交限制见[故障检查](../../operations/troubleshooting.md)。

## Client

```bash
(cd repos/happyro-client && npm test)
(cd repos/happyro-client && npm run lint)
(cd repos/happyro-client && npm run catalog:world)
(cd repos/happyro-client && npm run catalog:monsters)
(cd repos/happyro-client && npm run build:pwa)
```

涉及 UI、导航、图鉴或静态数据时，还需要真实浏览器走完进入游戏、打开对应窗口和操作路径。构建产物位于 `repos/happyro-client/dist/Web`。

## Gateway

```bash
(cd repos/happyro-gateway && npm run test:runtime-config)
(cd repos/happyro-gateway && npm run test:proxy)
(cd repos/happyro-gateway && npm run test:safe-path)
(cd repos/happyro-gateway && node --test test/game-stream-proxy.test.js)
(cd repos/happyro-gateway && npm run doctor)
```

资源变更后执行 `make configure-resources` 和 `make gateway-verify`，确认消息表、称号、技能说明和 PWA 端点返回预期中文内容。

`make test-gateway` 实际执行脚本只做语法和资源 doctor 检查，不包含上述全部单元测试。完整 Gateway 单测可用 `(cd repos/happyro-gateway && node --test test/*.test.js)`。

## Server

```bash
make build-server
make server-verify
```

`server-verify` 检查四个服务在配置端口监听，并确认日志出现 connected-ready 标记。修改 Game Control 或自定义封包后，必须同时验证 Client 封包编号和 Admin 命令路径。

其 ready 标记来自累计日志，不能单独证明本次启动互联成功。收包修改还应执行[游戏字节流回归](../../architecture/game-stream.md)中的生产解析函数和真实端口测试；真实端口测试产生预期的断开/非法包日志，不使用玩家会话。

## Admin

```bash
(cd repos/happyro-admin/backend && php artisan test)
(cd repos/happyro-admin/frontend && npm run lint && npm run test && npm run build)
```

前端必须以 `happyro-admin-frontend` 服务提供的进程为准验收，不能用手工 `umi` 长期占用 `8000`。

## 资料生成器

```bash
python3 -m unittest discover tools/resources/catalog/tests
node --test tools/resources/world/generate-npc-catalog.test.mjs
```

## 结果记录

记录命令、工作目录、代码提交或 dirty 状态、构建标识及失败项。历史测试数不作为当前通过标准；已知失败也要复核归因，不能直接跳过或把测试全绿等同于玩家流程正确。截图、JSON 和日志写入 `artifacts/` 或 `work/`，产品变更的验证范围写入对应 changelog；正式交付按[发布清单](../../operations/release-checklist.md)记录。临时执行流水不复制到 docs；需要长期引用的脱敏审计证据经审查后集中放入对应主题的 `evidence/`，保留来源和验证范围。

纯文档更新使用[文档维护检查](documentation.md)，无需重建游戏或重启服务。
