# v0.4.0 本机验收记录

2026-10-09，Mac arm64 / OrbStack。已完成离线包及下述实际验收；这不是全清单通过或正式部署声明。逐项状态以根目录 `todo.md` 为准。

## 交付物与源码

- 完整包：`artifacts/deployment/happyro-v0.4.0.zip`
- 大小：4,624,926,473 字节。
- SHA-256：`28a10b5f74ab1f1cac6582bc64ce6a6f6aec9fbfdc08d5ee6e7c5913b51b3836`。
- 包含 39,149 个资源文件、八个 amd64/arm64 Docker-save 归档、工具、定制模板及空数据目录；不含 `.env` 和用户 custom。
- 构建清单：`artifacts/images/v0.4.0/built.json`；归档与资源清单：`artifacts/deployment/v0.4.0/release-manifest.json`。
- 根仓库 `2179b923`，Client `7679eae1`，Gateway `599af1a`，Server `1ebb40bc5`，Admin `75fc67c`。文档仓库为 `20e146a`。

四类镜像均从干净提交执行 `--no-cache --pull` 双架构构建，PWA 使用 `build:pwa`（`--all`）。全部完成后才 package；最终 verify 和 ZIP CRC 通过。未推送 Docker Hub，未部署远程生产环境。

## 发现、修复与复测

首轮全新部署中，Admin 迁移完成后刷新目录失败：`/opt/happyro/server-base/conf/import/script_conf.txt` 不存在，admin-init 退出 1。

Server 启动会从 `conf/import-tmpl` 初始化配置，但 Admin 的只读源码快照没有该步骤。修复提交 `2179b923` 在 Admin Dockerfile 中复制版本化模板到快照的 `conf/import/`。实际容器挂载模板的定向验证通过后，废弃首轮候选产物，对 Gateway、Server、Admin、Database 全部重新无缓存构建。最终 ZIP 仅使用第二轮产物。

失败证据位于 `work/releases/v0.4.0/failed-candidate/`、`catalog-fix-probe.log`；最终日志为 `build-final.log`、`package-final.log`、`deploy-final.log`。

按原文件路径卸载 NPC 应使用 `@unloadnpcfile`；`@unloadnpc` 接受 NPC 名称。原部署说明中这一命令写法有误，源部署手册、文档站与清单现已更正；已生成 ZIP 未回写，包内 README 仍应按本记录采用 `@unloadnpcfile`。

## 实际通过的验收

| 范围 | 实际证据 |
| --- | --- |
| arm64 全新部署 | 从最终 ZIP 解压、verify、导入并核对镜像、initialize、deploy；七个服务健康，admin-init 退出 0 |
| 初始目录 | 成功导入物品、魔物及 13,447 条 NPC；custom 挂载只读，重复 initialize-custom 保持文件哈希 |
| 浏览器基线 | 启动页、登录、创建角色、进地图、中文地图、冒险工具物品/魔物/NPC、后台登录及子路由、设置保存；页面脚本异常为零 |
| 音频自动检查 | BGM HTTP 200，Web Audio running / 48kHz；未人工听音 |
| 新增 NPC | 显式登记及相对子清单、启动和 GM 重载、实际对话；未登记脚本不加载；无匹配导航 ID 的新 NPC 不获得导航传送能力 |
| NPC 覆盖 | 已加载的 prontera 文件按原路径覆盖，启动、重载、卸载/加载生效；注释覆盖移除目录条目，删除覆盖恢复 23 条原 NPC |
| 数据库目录 | Renewal 子文件导入，物品价格 42/21、波利 Hp 1234；重复刷新不重复；错误 Header 拒绝并保留原目录；移除后恢复版本化基线 10/5、55 |
| 资源 HTTP | 韩文路径 BMP 覆盖、no-store、内容变化产生新 ETag、旧 ETag 请求仍获得新内容、删除回退、越界符号链接返回 500 |
| 手机/iPad 模拟 | NPC 对话及仓库截图；精确存入 3、取出 1，并从数据库确认背包 20→18、仓库 20→22；独立 iPad 会话另验证存入 |
| 备份恢复 | 数据库、后台文件、设置及 custom 备份；损坏副本拒绝；Zeny 测试修改回退；custom 精确恢复并移除备份外文件 |
| 同版本重部署 | 完整 down/deploy 后账号、角色、背包、仓库摘要及设置哈希保持一致；不是跨版本升级 |

浏览器辅助脚本适配了当前冒险工具入口和移动输入弹窗。旧脚本选择器超时及触控坐标调整不作为产品通过证据；最后复测结果、截图和服务状态分别见 `local-browser-report.json`、`local-npc-browser-report.json`、`phone-storage.png`、`ipad-storage-fresh.png`、`ipad-npc-dialog.png`、`persistence.json`、`final-health.json`。

测试定制已归档到 `work/releases/v0.4.0/retired-test-fixtures/`，运行 custom 已恢复默认模板；再次目录刷新、map 重启及浏览器基线复测通过。备份含密钥，只保存在受限的本地验收目录，不属于公开交付物。

## 运行入口与保留内容

- 游戏：`http://10.24.1.24:4338/applications/pwa/index.html`
- 后台：`http://10.24.1.24:48000`
- 安装目录：`artifacts/deployment/install/happyro-v0.4.0/`
- custom：`work/releases/v0.4.0/custom-final/`
- 原生服务仍使用原端口；原停止的 Docker 容器保留为 `*-before-v040`，没有迁移原存档。
- 构建时使用本地版本提交 `7b719a7d` 和修复提交 `2179b923`，当时尚未推送。

## 未完成边界

amd64 仅构建，未实际运行；未测试真实手机/iPad 触控、人工听音、桌面完整交互、商店/材料交易的全部流程、仓库容量/重量与连续操作边界。NPC 非法脚本、循环 import、路径及链接的完整运行时负向矩阵未执行；物品三类脚本、魔物掉落和游戏内数据库效果未完整验收；图片替换仅完成 HTTP 验证，未完成游戏内视觉验收。

本机没有旧版完整 ZIP，未执行真实跨版本升级和回退；同版本重部署不能替代该项。回退必须使用匹配旧包、旧版工具及对应备份，不能只降级镜像并沿用不兼容数据库。

未勾选项目仍待补测，不应以本记录宣称 `todo.md` 全部完成。
