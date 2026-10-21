# 仓库与目录边界

项目共七个独立 Git 仓库：根仓库、五个应用仓库和公开文档仓库。根仓库编排五个应用仓库，并保存不可修改的官方输入、版本化本地化覆盖和跨仓库工具。应用仓库不复制根仓库文档；根仓库不把产品源码当作文档存放。

## 应用仓库

| 路径 | Git 仓库 | 写入规则 |
| --- | --- | --- |
| `repos/happyro-client` | 独立 | 客户端源码、PWA 配置和生成的静态表 |
| `repos/happyro-server` | 独立 | rAthena 源码、`conf/`、`db/`、`npc/` |
| `repos/happyro-gateway` | 独立 | 网关源码；`data/` 是本机部署副本，不单独维护中文源 |
| `repos/happyro-admin` | 独立 | React / Umi / Ant Design 管理前端 |
| `repos/happyro-api` | 独立 | Go / Gin 后端，提供管理与玩家 API；资料 JSON 由根仓库生成器写入 |
| `repos/happyro-doc` | 独立 | VitePress 公开产品、安装与玩家指南；不参与应用镜像构建 |

## 根仓库目录

| 目录 | 职责 | 可否删除 |
| --- | --- | --- |
| `docs/` | 长期有效的设计、开发、运维和资料说明 | 否 |
| `changelog/` | 根仓库集中变更记录 | 否 |
| `localization/` | 版本管理的本地化源和客户端覆盖资源 | 否 |
| `inputs/` | 不可修改的官方输入与运行基线 | 运行目录可重建，官方安装包不可改 |
| `scripts/` | 面向运维和开发者的业务入口 | 否；路径被 systemd、Makefile 和文档引用 |
| `tools/` | 按 client/resources/deployment/operations/changelog 分类的工具 | 否 |
| `deploy/` | 部署模板和环境样例，不承载业务逻辑 | 否 |
| `configs/` | 客户端与导航等跨仓库配置源 | 否 |
| `config/` | 职业外观权威映射等结构化配置 | 否 |
| `work/` | 构建中间结果、缓存，以及数据库、密钥等持久运行状态 | 不可整体删除；先辨别子目录并备份 |
| `artifacts/` | 可交付结果和验收证据 | 可重建，不作为运行输入 |
| `repos/` | 五个应用仓库及文档站的独立检出 | 否 |

## 输入与产物

- `inputs/official/`：经过核验的官方 kRO 2021-11-05 文件，不可修改。
- `inputs/runtime/kro-20211105/`：运行目录。允许用已审查、已编译并通过语义校验的翻译产物覆盖对应文件，覆盖后必须校验目标哈希并记录来源。
- `localization/client/data/`：UTF-8 散装中文覆盖，由 Gateway `DATA_OVERRIDE_PATH` 提供。
- `localization/sources/kro-20211105/`：当前 LUB / 文本回编译仍读取的已审查 JSON 与文本源。
- `work/`：GRF 解压、图片转换、翻译临时合并、本机 MariaDB 数据等，不提交。
- `work/runtime/mariadb-10.11/` 包含数据库与凭据，不是可随意清理的缓存。Docker 数据卷也可能位于 `work/runtime/docker-mariadb/`；以实际挂载为准。恢复流程见[备份与恢复](../operations/backup-recovery.md)。
- `artifacts/`：LUB 编译产物、浏览器验收截图等，不作为运行时数据源。

## 文档边界

- 长期说明放在 `docs/` 对应分类下。
- 只保留当前本地化源和必要来源清单；临时翻译产物放 work/，废弃批次从 Git 历史追溯。
- 缺陷的现行约束写入对应维护文档，产品变化写 changelog；已完成批次通过 Git 追溯。
- 产品翻译直接修改对应应用仓库；旧翻译工作区不得再作为发布源向 Client 或 Server 回写。
