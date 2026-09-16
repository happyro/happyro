# 冒险工具 API 压缩顺序与 NPC 导入缺口（2026-09-16）

本文件记录 NPC/地图目录改为服务端分页过程中发现的两个真实缺陷，与产品 changelog 分开维护。不是提交记录，也不替代各仓库 `changelog/`。

## 现象与修复

| 项 | 现象 | 修复 | 位置 |
| --- | --- | --- | --- |
| Gateway 压缩顺序 | `compression` 中间件注册在 `/api/adventure-tools` 反向代理**之后**，Express 中间件按注册顺序执行，代理响应永远不会命中压缩逻辑；冒险工具的 NPC/地图/物品分页接口响应体全部未压缩下发 | 把 `compression` 中间件移到 CORS 之后、所有代理注册之前，让代理响应也经过同一层压缩 | `repos/happyro-gateway/index.js` |
| NPC 导入未自动化 | 新增的 `game_npcs` 表由 `admin-init` 的 `migrate --force` 自动建出，但 `initialize` 分支没有调用对应的导入命令；干净部署或从旧版本升级后，表结构存在但数据为空，NPC 查询和 NPC 图鉴接口返回 0 条 | 在 `initialize` 分支追加 `php -d memory_limit=512M artisan game-data:import-npcs --renewal --no-color`，与已有的物品、魔物导入命令保持同样的内存限制和参数风格 | `deploy/docker/admin/entrypoint.sh` |

## 排查依据

- Gateway 问题通过实际请求 `/api/adventure-tools/npcs` 并核对响应头 `Content-Encoding` 确认，修复后现网验证已带 `gzip`。
- NPC 导入缺口通过对照 `docker-release.md`/`entrypoint.sh` 与迁移文件清单发现：`migrate --force` 是仓库里唯一的迁移入口，但导入命令只覆盖了 `game-data:import-items`、`game-data:import-monsters` 两条，NPC 目录的等价命令 `game-data:import-npcs` 从未被脚本调用过。

## 影响范围

两处修复都不涉及数据结构或接口协议变更，纯运维/部署脚本层面。已发布的 v0.2.0 离线包（对应根仓库提交 `c6ef0ebe`）早于本次改动，不受影响也不包含修复；下次重新构建镜像时需要一并带上这两处改动，见 [Docker 发布](../../../../operations/docker-release.md)。

## 相关文档

- [离线部署 · Admin 数据库导入命令](../../../../operations/docker-deployment.md)
- [NPC · 生成命令](../../../../game-data/npcs.md)
