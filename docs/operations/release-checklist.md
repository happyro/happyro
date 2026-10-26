# 最终包验收清单

本清单用于当前代码的完整构建、离线部署、自定义功能、保持登录与断线恢复验收。第 10 节记录当前下载包、历史交付与工具验收。各批次按文件摘要和源码记录区分，验收结果只适用于对应产物。清单包含真机和完整回归要求，未验证项保持未勾选；源码测试不能替代容器与游戏验收。

操作依据：[镜像构建与交付](docker-release.md)、[全新部署](docker-deployment.md)。构建命令在源码根目录执行，部署命令在独立解压后的包根目录执行；命令逐条执行，失败停止后续步骤。

## 1. 搬迁和构建前准备

- [ ] 确认本次实现及本清单已保存；允许包含未提交改动，跨机器构建时须同步相同源码内容并核对指纹。
- [ ] 核对根仓库、Client、Gateway、Server、Admin、API 六个构建仓库的分支、提交和工作区；允许未提交改动，记录各仓库 HEAD、dirty 状态和源码内容指纹，准备与构建必须使用相同源码。不要丢弃未提交文件；文档仓库不参与构建，若一并检出则记录其提交。
- [ ] 核对 `configs/Config.happyro.js` 与 Client 的配置副本一致（忽略换行格式），避免配置安装覆盖已启用功能；差异须先审查并同步，构建期间不修改源码。
- [ ] 核对 `deploy/docker/VERSION` 与本次目标一致；只有更换目标版本时才修改并提交。不覆盖历史版本产物。
- [ ] 安装 Python 3.11+、Docker、Compose v2、Buildx、Skopeo，确认能够构建 `linux/amd64` 和 `linux/arm64`。
- [ ] 检查 Buildx 当前 builder 的平台与 OCI 导出能力；未配置好双架构 builder 时不开始构建。
- [ ] 检查磁盘空间、Docker 分配的内存、构建联网能力和部署端口是否满足要求。
- [ ] 补齐未随 Git 搬迁的运行资源：
  - `inputs/runtime/kro-20211105/client/` 内的 `DATA.INI`、所引用 GRF、`AI/`、`BGM/`、`System/`、`data/`。
  - `work/game-data/items/kro-20211105/`、`work/game-data/monsters/kro-20211105/`。
  - API 的 `resources/game-data/world/` 下 `npcs/`、`maps/`、`terrain/`。
- [ ] 若使用资源传输归档，先核对附带的 SHA-256，再在源码根目录解压；不修改 `inputs/official/`，不使用历史翻译目录作为发布源。

## 2. 完整构建和离线包

分阶段命令统一使用 `artifacts/releases/<版本>/`，prepare 要求该目录不存在，不接受自定义输出路径。已有同版本结果时，先确认需要替换旧交付物，再用 `offline create --rebuild --split` 全量重建；若要逐阶段执行，用 `offline clean --version <版本> --include-package --execute` 清理后从 prepare 开始。需保留的历史交付物应先另行保存。

```bash
python3 tools/release/release.py stage prepare --version "$(cat deploy/docker/VERSION)"
```

```bash
python3 tools/deployment/manage.py verify --directory "artifacts/releases/$(cat deploy/docker/VERSION)/bundle" --prepared
```

```bash
python3 tools/release/release.py stage build --version "$(cat deploy/docker/VERSION)"
```

```bash
python3 tools/release/release.py stage package --version "$(cat deploy/docker/VERSION)"
```

```bash
python3 tools/deployment/manage.py verify --directory "artifacts/releases/$(cat deploy/docker/VERSION)/bundle"
```

- [ ] 六个构建组件全部无缓存重建：完整 `--all` PWA、Gateway、Server、API、Admin、Database；五类镜像均包含两种架构。
- [ ] 所有构建成功后再执行 package；归档哈希、架构、版本、源码提交校验全部通过。
- [ ] package 成功退出且最终 ZIP 存在；offline-ready 仅表示目录校验通过，ZIP 失败按发布手册重试，不手改清单。
- [ ] ZIP 包含两种架构的镜像、运行资源、工具、`examples/custom/` 模板及空 `data/`。
- [ ] ZIP 不含 `.env`、实际用户 `custom/`、存档或密钥；不要在打包暂存目录运行 initialize。
- [ ] 保存完整 ZIP、`built.json`、发布清单和构建日志。仅在用户明确要求时推送 Docker Hub。

## 3. 全新部署

将 ZIP 解压到独立验收目录，进入包根目录：

```bash
python3 tools/deployment/manage.py verify --directory .
```

```bash
python3 tools/deployment/manage.py import-images --directory .
```

```bash
python3 tools/deployment/manage.py initialize --directory .
```

- [ ] 检查自动生成的 `.env`，配置新机器实际地址、端口。手机和平板使用可访问的机器地址，不能使用它们自己的 localhost。
- [ ] 推荐将 `HAPPYRO_CUSTOM_DIR` 设为版本目录外的持久化绝对路径；修改后执行下方 initialize-custom。若调整 `HAPPYRO_DATA_DIR`，也必须准备 Compose 要求的完整数据目录结构。

```bash
python3 tools/deployment/manage.py initialize-custom --directory .
```

```bash
python3 tools/deployment/manage.py deploy --directory .
```

```bash
docker compose ps -a
```

```bash
docker compose logs api-init
```

```bash
docker compose logs map gateway
```

- [ ] 八个常驻服务正常，`api-init` 完成并以 0 退出；无迁移、目录导入、脚本加载或挂载错误。
- [ ] 首次生成 `npc/scripts.conf`、`npc/additions/`、`npc/overrides/`、`db/`、`resources/`；数据库模板版本与当前服务端匹配。
- [ ] 再次执行 initialize-custom，已有文件内容不改变，只补齐缺少的模板。
- [ ] 用 `docker compose config` 和容器 inspect 确认以下挂载来源正确且只读。输出可能包含密钥，不直接公开。

| 宿主机目录 | 容器目标 | 使用方 |
| --- | --- | --- |
| `HAPPYRO_CUSTOM_DIR/npc` | `/opt/happyro/custom/npc` | Server |
| `HAPPYRO_CUSTOM_DIR/db` | `/opt/rathena/db/import` | Server |
| `HAPPYRO_CUSTOM_DIR/resources` | `/opt/happyro/custom/resources` | Gateway |
| `HAPPYRO_CUSTOM_DIR` | `/opt/happyro/custom` | API |

- [ ] 游戏 `/applications/pwa/index.html` 显示启动页和查看器入口；能登录、选角、进入地图，地图、音效、中文正常。
- [ ] 后台能登录，冒险工具的物品、魔物、NPC 查询正常；空 custom 不改变原有数据和行为。
- [ ] 修改一项后台战斗设置并重启，确认仍保存在 `HAPPYRO_DATA_DIR/server-settings/`，没有第二份配置来源。

## 4. 新增及覆盖 NPC

下文 `custom/` 指实际 `HAPPYRO_CUSTOM_DIR`。使用独立测试角色和测试地图位置，记录每个测试脚本及原始文件，测试后清理。

- [ ] 在 `custom/npc/additions/review.txt` 添加合法测试 NPC，使用确认可用的地图、坐标和现有外观。在 `custom/npc/scripts.conf` 登记 `npc: additions/review.txt`。
- [ ] 保存文件后不会自动出现；执行有权限的 `@reloadscript` 或维护重启 map 后出现，能完成对话且只出现一次。
- [ ] 修改对话并重载，显示新内容；删除清单登记并重载，新增 NPC 消失。
- [ ] 验证 `import: additions/events.conf` 子清单能加载；子清单内路径仍相对于 `custom/npc/`，不是子清单所在目录。
- [ ] 未登记的 additions 文件不自动加载。
- [ ] 选取一个**当前确实被加载**的内置 `.txt` 脚本，复制到 `custom/npc/overrides/` 下相同相对路径并只修改测试文案。例如原路径 `npc/某目录/example.txt` 对应 `custom/npc/overrides/某目录/example.txt`。
- [ ] 不直接拿默认未启用的脚本测试覆盖；一个文件可能包含多个 NPC，先确认影响范围。
- [ ] 分别验证启动、`@reloadscript`、按原内置路径 `@unloadnpcfile` / `@loadnpc`：使用覆盖内容，不重复加载，卸载仍可按原路径定位。
- [ ] 将覆盖改为仅注释文件并重载，该文件中的定义停用；删除覆盖并重载，恢复当前镜像内置版本。
- [ ] 负向测试：非法脚本、循环 import、越界路径、符号链接产生明确错误；非法覆盖不静默回退内置。测试后恢复有效内容并重新加载。
- [ ] 内置 `.conf` 不支持覆盖；未被内置清单引用的旧覆盖不自动启用。

通过标准：不改镜像里的原脚本，不生成服务端 runtime 目录，覆盖和移除行为可重复。脚本重载会中断对话，失败不保证保留重载前状态，负向测试只在隔离验收环境做。

## 5. 数据库扩展及目录刷新

- [ ] 保留初始化模板的 Header，向 `custom/db/item_db.yml` 添加一个已知物品的测试修改；按原生规则重载数据库或维护重启，验证游戏实际效果。
- [ ] 修改 `custom/db/mob_db.yml` 中一个已知魔物的测试字段和掉落，验证游戏使用新的配置。
- [ ] 测试 `Footer.Imports` 拆分文件，引用使用 `db/import/文件.yml`；验证 Renewal 导入有效。
- [ ] 物品 `Script`、`EquipScript`、`UnEquipScript` 按需各选一个安全效果验证，确认遵循原有触发时机。
- [ ] 数据库和 Admin schema 已初始化后，执行目录刷新：

```bash
python3 tools/deployment/manage.py refresh-custom-catalogs --directory .
```

- [ ] 后台和冒险工具能查询修改后的物品、魔物及新增/覆盖的静态 NPC；重复刷新不产生重复记录。
- [ ] NPC 新坐标可用于寻路；没有匹配官方导航 ID 的新 NPC 不应伪造导航传送能力。
- [ ] 删除测试修改后，游戏重载与目录刷新分别执行，资料恢复内置基线，无残留旧条目。
- [ ] 故意写错 YAML Header 或内容，目录刷新报错，不把解析失败当作成功；修复后可正常刷新。

边界：刷新只处理物品、魔物及静态 NPC 声明，不执行动态脚本、不生成新外观缩略图，也不重载游戏。服务端 YAML 不负责客户端物品名称、说明和外观映射；其它原生数据库可由服务端加载，但不属于这三类目录刷新范围。

## 6. 自定义图片和资源

- [ ] 从浏览器网络请求选取一个实际使用的 `data/` 资源，制作同格式、易辨识的测试替换文件。
- [ ] 放入 `custom/resources/` 内相同相对路径，**不要再套一层 `data/`**；包含中文或韩文的路径也测试一次。
- [ ] 重新请求该 URL，返回自定义内容且响应使用 `Cache-Control: no-store`；重新进入游戏可看到替换结果。
- [ ] 同路径再次修改，后续 HTTP 请求获得新内容，ETag 随内容变化，不命中 Gateway 旧缓存。
- [ ] 删除替换文件，重新请求及重新进入游戏后恢复内置资源。
- [ ] 越界路径和无效符号链接不能读取目录外文件；错误有日志，不静默误用覆盖。
- [ ] 浏览器原有缓存必要时强制刷新；游戏已解码的图片需重新进入游戏，不能把未实时替换内存图片判为文件挂载失败。

边界：只支持客户端原有格式和路径；任意 PNG 不会自动转换为 SPR/ACT，新外观仍需映射配置。本目录不覆盖网页代码，也不自动制作后台图片。

## 7. 手机、iPad 和桌面回归

专题证据用于选择回归范围，发布时仍须在本次包上核验：[职业外观](../development/character-appearance/TODO.md)、[随行功能](../development/companion-review/pending.md)、[转职流程](../development/job-change-review/README.md)、[菜单设置](../development/settings/README.md)。

- [ ] 职业外观：本人／旁观者、选角与重登同步，普通职业、坐骑绑定及缺形态恢复；手机和平板真机分别记录。
- [ ] 随行功能：重复改名、进化配方、状态增量、攻击模式与技能；单位替换后旧确认失效，失败时不误扣材料或费用。
- [ ] 社交与容器：在线好友详情、私聊对象及草稿、仓库与手推车存取、售卖／收购摊位的创建和再次管理。
- [ ] 移动端交易：平板横竖屏与手机横屏三列、手机竖屏三行；分类和搜索、数量与金额输入、不可交易物品提示、双方锁定及两列成交核对正常，取消和失败不丢失物品或 Zeny。
- [ ] 移动端邮件：搜索不区分大小写，阅读与附件标题正确，写信上下两框独立滚动；校验收件人、发送、取消及领取后核对双方资产和邮费，横竖屏软键盘不遮挡操作。
- [ ] 背包、技能、快捷键、任务、图鉴及邮件列表滚动到底部并选择条目，不回弹或跳动；长失败提示完整换行，获得物品提示不被菜单遮挡，快捷键使用等级不符道具时有提示。
- [ ] 三端分别登录，确认启动、资源和冒险工具正常，保留版本号及截图。
- [ ] 手机与 iPad：普通 NPC 对话、选择项、数量输入、购买、出售、材料兑换没有遮挡和溢出。
- [ ] 手机与 iPad：仓库打开/关闭、背包与仓库切换、物品详情、存取数量、连续存取、容量/重量限制正常。
- [ ] 桌面：背包装备等操作按钮文字垂直居中，既有交互无回归。
- [ ] 三端检查本次测试 NPC、物品和资源；新增资源缺少映射的情况单独记录，不与 UI 缺陷混淆。
- [ ] 重启服务后，角色、物品、仓库存档、后台设置和自定义效果均保留。

### 保持登录与断线恢复

以下项目须在最终离线包部署后执行，HTTP 与 HTTPS、手机/平板/桌面分别记录；已有源码测试和开发环境浏览器联调只作参考。

- [ ] 空库初始化创建 happyro_sessions 表及账号变更撤销触发器；重复 deploy 成功且保留原账号、角色、物品、仓库与设置。
- [ ] 在隔离验收环境制造会话 SQL 执行失败，确认 deploy 返回失败且不继续启动新版 login/web/Gateway；修复后重试通过，不改发行包文件绕过校验。
- [ ] 默认不勾选保持登录；勾选后关闭页面、关闭浏览器再打开均进入选角；不勾选时刷新或重新打开要求密码。
- [ ] 两种登录方式在当前页面断线后均可恢复原角色，遵守 PIN；同地图恢复镜头，地图、位置、血量和物品以服务端为准，不重放交易或技能操作。
- [ ] 原连接仍有效时只检查连接；恢复超时或账号在其他位置在线时给出明确结果，不无限重试、不踢另一处在线角色。
- [ ] 主动退出、密码修改后改回、封禁后解封、账号有效期变更及会话过期使旧凭据失效；一次性票据不能重复使用。
- [ ] 服务重启后有效持久会话仍可用；返回选角与退出登录行为区分正确。
- [ ] HTTP 与 HTTPS 均可保持登录，HTTPS Cookie 为 Secure，HTTP 使用独立名称；Host 保留外部端口，代理不缓存会话 API，错误 Host/跨站请求被拒绝。
- [ ] iOS 与 Android 真机分别验证切后台、锁屏、回前台及系统回收页面；页面回收后持久登录进入选角，未勾选时重新登录，不能将模拟视口标记为真机通过。
- [ ] 恢复前后的普通登录、移动、战斗、聊天、NPC、商店、交易、仓库及冒险工具回归通过；服务端强制下线不触发自动恢复。

### 自动战斗与恢复回归

以下项目在最终包上重新验证，不沿用源码测试或旧截图的通过结果：

- [ ] 三端战斗设置保持技能单列表；普通攻击保留自身增益，停止战斗、死亡、断线和切后台停止自动施放。
- [ ] 缺失自身增益会补充、已有状态跳过；连续补增益不会长期挤占攻击，不自动给队长施放。
- [ ] 挑衅等减益之后继续攻击；连续确认无伤害时尝试普攻；材料、AP 或前置状态不足时能换用其他技能／普攻。
- [ ] 火箭、冰箭、链电及怒爆验证实际伤害、父子回执、自身目标和接近范围；迟到结果、取消和无效换目标不误确认下一次请求。
- [ ] 陷阱不放在禁放占位上；无合法落点时有界退避，交互／友方领域等未支持技能不进入自动攻击候选。
- [ ] HP／SP 默认比例、环境覆盖和已保存个人配置优先级正确；选择弹窗每页 10 项，缺货、失败和回执超时不会阻塞战斗或重复消耗道具。
- [ ] 冒险工具仅按当前地图显示名称搜索，地图／NPC 滚动可到魔物区；无刷新记录时「地图魔物 ↓」置灰。分别检查桌面、平板横竖屏和手机。

## 8. 全新环境隔离验收

- [ ] 使用当次完整包、新 `.env`、空数据库以及独立的新 data/custom 目录。
- [ ] 不复用旧环境密钥、存档、配置或自定义文件，不执行兼容升级或历史数据迁移。
- [ ] 完成 initialize 和 api-init，验证默认账号、罗安及资料初始化成功。
- [ ] 同一完整包的重启保留该环境数据；备份只恢复到同一完整包的隔离环境。

## 9. 备份、恢复和失败处理

停止游戏及后台写入，确保 api-init 已完成，并暂停宿主机 custom 编辑，仅保留数据库运行。备份输出目录使用尚不存在的路径：

```bash
docker compose stop gateway admin api web-api map char login
```

```bash
python3 tools/deployment/manage.py backup --directory . --output ../backups/custom-review
```

- [ ] 备份包含数据库、服务端设置、`custom-files.tar`、`.env`、部署清单和 `checksums.json`。妥善保管密钥，不提交到 Git。
- [ ] 保留匹配版本完整包。在隔离恢复环境准备数据目录，复制备份 `.env` 并修正目录和地址，保留原数据库凭据与游戏控制令牌，不重新 initialize。
- [ ] 在实际 `HAPPYRO_DATA_DIR` 下准备 `database`、`control-socket`、`server-settings`、`server-logs`、`gateway-logs` 五个目录；包内 `./data` 已包含这些空目录，外部新目录须另行创建。`initialize-custom` 只建立 `HAPPYRO_CUSTOM_DIR`；随后导入匹配镜像，仅启动 database，再恢复：

```bash
python3 tools/deployment/manage.py initialize-custom --directory .
```

```bash
python3 tools/deployment/manage.py import-images --directory .
```

```bash
docker compose up -d --wait --pull never --no-build database
```

```bash
python3 tools/deployment/manage.py restore --directory . --backup ../backups/custom-review --confirm-replace
```

```bash
python3 tools/deployment/manage.py deploy --directory .
```

- [ ] 恢复后角色、背包、仓库、后台设置与备份一致，所有 custom 文件哈希一致。
- [ ] 在恢复目标预先添加一个备份中没有的测试文件，确认恢复会移除它，custom 精确恢复而非只追加覆盖。
- [ ] 使用备份副本测试哈希损坏/缺少归档，恢复明确拒绝；不要破坏唯一备份。
- [ ] 记录同一完整包恢复失败的处理步骤，不通过更换版本尝试恢复。

## 10. 验收记录和完成条件

文档与发布事实在此收口，不另建重复发布进度页。

2026-10-25 源码文档预检：七仓库维护入口与本地文档引用已核对，清理重复阶段说明，更新自动战斗、恢复、地图和动作指南；根仓库与文档站 65 页 changelog 同步通过。文档站构建后 134 个 HTML 页、18,894 处站内引用检查通过；70 张登记图片哈希、五组主页图片镜像及 37 个攻略定位坐标来源核对通过。桌面、平板和手机浏览器视口的侧栏、分页点、横向切图、纵向滚动及页面跳转检查通过，无脚本／样式请求错误。证据位于 `work/docs-preflight-20261025/`。

2026-10-25 的预检仅覆盖源码、文档、配置副本和资源路径检查，未执行离线包构建或运行验收。构建版本统一读取 `deploy/docker/VERSION`，允许带未提交改动构建，并以源码指纹记录实际输入。各批次的包校验和运行验收按各自证据记录。


- [ ] 根仓库与文档站的本次目标版本摘要、日期日志同步通过，范围覆盖最终提交；文档构建及站内链接检查通过。
- [ ] 文档站截图对应当前 UI，来源、视口与哈希已记录；截图操作不充当最终发行包的功能验收。
- [ ] 版本摘要按当前生产功能维护，不添加工作流状态标签；只在交付和验收完成后填写发布日期、下载地址与 SHA-256，并同步资源下载页、快速开始、根 README 及 AGENTS 的已发布版本记录；Docker Hub 仅在实际推送并核对远端摘要后记录成功。

当前公开离线包：[happyro-v0.6.0.zip](https://pan.baidu.com/s/1p2m0YHljHGjb_n0-QEWG2g?pwd=59p4)，提取码 `59p4`。本地文件为 `artifacts/releases/v0.6.0/happyro-v0.6.0.zip`，4,254,554,420 字节，SHA-256：`3e09911db25b4d80ce6b8ec4c3fe299728d8c1475ef694da3e33001e8d274ab7`。包内包含 Gateway、Server、API、Admin、Database 五组双架构镜像；来源见包内 `release-manifest.json`。本次离线包验收通过。下方历史验收及 Docker Hub 记录不作为当前包的验收或推送凭据。

### 历史交付记录（2026-10-26 较早批次）

以下路径与摘要仅代表该历史批次，部分本机产物已清理，不对应当前下载包。

| 项目 | 历史记录 |
| --- | --- |
| 验收日期、人员、宿主机与 Docker 架构 | 2026-10-26，Codex；macOS / OrbStack，arm64 宿主机 |
| 六个构建仓库与文档仓库提交 | 构建前已同步 origin/main 并保持干净，见 work/release-v060-20261026/sources.json；构建提交同时列入 v0.6.0 摘要 |
| 版本、最终 ZIP 路径及 SHA-256 | artifacts/deployment/happyro-v0.6.0.zip；4,348,033,247 字节；SHA-256：4b85f81ff74989b5b8e913347faf2b9f3c89e6561aa64e5530f268ac1dcf140e |
| amd64 / arm64 实际运行 | 两架构均运行最终包镜像并通过七服务、游戏、后台与触屏视口检查；amd64 为本机仿真 |
| 空库、v0.3.2／v0.5.0 升级及回退 | 空库、精确备份恢复、保留原密钥的 v0.5.0 备份恢复升级通过；未运行 v0.3.2 存档和旧镜像回退 |
| 保持登录、原角色恢复及真机后台行为 | HTTP 持久登录与刷新选角通过；未覆盖完整断线、HTTPS、PIN、到期及真机后台矩阵 |
| 日志、截图、失败复测及未完成边界 | work/release-v060-20261026/verification.md；原始日志和两架构截图位于同目录 |

2026-10-26 Docker Hub 发布：四组 happyro-gateway/server/api/database 的 v0.6.0 和 latest 与本批本地 OCI 完整 index 一致，amd64／arm64 子摘要全部一致。原始响应位于 work/dockerhub/v0.6.0/。该批次 ZIP 当时未上传公开下载服务。

### 工具验收记录（2026-10-26 至 2026-10-27）

已完成一键创建、同版本自动重建和独立 prepare/build/package 三轮全量无缓存双架构构建，每轮完整包均通过本机 Linux arm64 容器健康、HTTP 和罗安登录进图及移动验收。资源包生成、重建、核验、清理、写入中断后清理，以及拆分一致性、同批次名复用、同 tag 镜像更新均通过。额外容器测试覆盖 Gateway 权限、后台浏览器登录、备份恢复、代理网络与隔离数据库角色清理。

记录位于 `work/release-cli-live/REPORT.md`。这些测试未执行 Docker Hub 推送，仅验证推送命令对缺失中间产物和未完成包的拒绝路径；运行范围不包含 amd64、手机真机、完整战斗／断线恢复和跨版本升级。结果只适用于报告记录的三个构建批次，不作为当前下载包的完整发布验收凭据。

- [ ] 截图和脱敏日志放在 work/ 或 artifacts/，不记录密码、令牌和完整 .env。
- [ ] 失败项记录复现步骤、期望、实际结果，修复后用最终包复测。
- [ ] 实际运行过的架构才标记运行通过，模拟视口与真机分别记录。
- [ ] 在发布说明记录最终提交、ZIP 摘要及验收边界；详细日志放 work/ 或 artifacts/，不复制阶段清单。
- [ ] 必需项完成并列明未验证边界后，再决定正式部署和发布；公开下载、镜像标签与已发布版本按实际结果更新。

## 默认测试角色

- [ ] 最终离线包空库初始化后，`happyro/happyro` 第一角色位为罗安（男剑士 99/50、10,000 Zeny），技能、装备、各 100 瓶红蓝药水和六个快捷栏正确。
- [ ] 波利蛋能正常孵化和收回；初始未召唤，没有截图临时好友、邮件、队伍或公会记录。
- [ ] 同一完整包重启不会覆盖角色或补发物品；桌面、平板、手机登录并选择罗安进入游戏正常。
