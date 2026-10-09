# 新机器验收 TODO

本清单用于验收本次自定义 NPC、数据库、图片资源及离线升级方案。所有复选框初始均为待验收；源码测试通过不代表容器和游戏验收通过。

操作依据：[镜像构建与交付](docs/operations/docker-release.md)、[部署与升级](docs/operations/docker-deployment.md)。命令逐条执行，失败立即停止后续步骤。构建命令在**源码根目录**执行；部署、定制、升级和恢复命令在**解压后的部署包根目录**执行。

## 1. 搬迁和构建前准备

- [ ] 确认本次实现及本清单已经提交并同步到新机器，核对提交后再开始构建。
- [ ] 核对六个仓库的分支、提交和工作区；参与构建的根仓库、Client、Gateway、Server、Admin 五个仓库必须干净，且与准备机器的提交一致。不要丢弃未提交文件。
- [ ] 确定新发布版本，只修改 `deploy/docker/VERSION`，随后提交。当前记录中的 `v0.3.2` 已发布，不覆盖旧版本产物。
- [ ] 安装 Python 3.11+、Docker、Compose v2、Buildx、Skopeo，确认能够构建 `linux/amd64` 和 `linux/arm64`。
- [ ] 检查磁盘空间、Docker 分配的内存、构建联网能力和部署端口是否满足要求。
- [ ] 补齐未随 Git 搬迁的运行资源：
  - `inputs/runtime/kro-20211105/client/` 内的 `DATA.INI`、所引用 GRF、`AI/`、`BGM/`、`System/`、`data/`。
  - `work/game-data/items/kro-20211105/`、`work/game-data/monsters/kro-20211105/`。
  - Admin 的 `backend/resources/game-data/world/` 下 `npcs/`、`maps/`、`terrain/`。
- [ ] 若使用资源传输归档，先核对附带的 SHA-256，再在源码根目录解压；不修改 `inputs/official/`，不使用历史翻译目录作为发布源。

## 2. 完整构建和离线包

以下输出目录必须尚不存在；如有旧结果，改用新的输出路径，不覆盖旧产物。准备目录和镜像目录需在后续命令中保持一致。

```bash
python3 tools/deployment/manage.py prepare --workspace . --output artifacts/deployment/release
python3 tools/deployment/manage.py verify --directory artifacts/deployment/release --prepared
python3 tools/deployment/images.py build --workspace . --output artifacts/images/release
python3 tools/deployment/images.py package --output artifacts/images/release --bundle artifacts/deployment/release
python3 tools/deployment/manage.py verify --directory artifacts/deployment/release
```

- [ ] 五个应用组件全部无缓存重建：完整 `--all` PWA、Gateway、Server、Admin、Database；四类镜像均包含两种架构。
- [ ] 所有构建成功后再执行 package；归档哈希、架构、版本、源码提交校验全部通过。
- [ ] ZIP 包含两种架构的镜像、运行资源、工具、`examples/custom/` 模板及空 `data/`。
- [ ] ZIP 不含 `.env`、实际用户 `custom/`、存档或密钥；不要在打包暂存目录运行 initialize。
- [ ] 保存完整 ZIP、`built.json`、发布清单和构建日志。此次不要求推送 Docker Hub。

## 3. 全新部署

将 ZIP 解压到独立验收目录，进入包根目录：

```bash
python3 tools/deployment/manage.py verify --directory .
python3 tools/deployment/manage.py import-images --directory .
python3 tools/deployment/manage.py initialize --directory .
```

- [ ] 检查自动生成的 `.env`，配置新机器实际地址、端口。手机和平板使用可访问的机器地址，不能使用它们自己的 localhost。
- [ ] 推荐将 `CUSTOM_DIR` 设为版本目录外的持久化绝对路径；修改后执行下方 initialize-custom。若调整 `DATA_DIR`，也必须准备 Compose 要求的完整数据目录结构。

```bash
python3 tools/deployment/manage.py initialize-custom --directory .
python3 tools/deployment/manage.py deploy --directory .
docker compose ps -a
docker compose logs admin-init
docker compose logs map gateway
```

- [ ] 七个常驻服务正常，`admin-init` 完成并以 0 退出；无迁移、目录导入、脚本加载或挂载错误。
- [ ] 首次生成 `npc/scripts.conf`、`npc/additions/`、`npc/overrides/`、`db/`、`resources/`；数据库模板版本与当前服务端匹配。
- [ ] 再次执行 initialize-custom，已有文件内容不改变，只补齐缺少的模板。
- [ ] 用 `docker compose config` 和容器 inspect 确认以下挂载来源正确且只读。输出可能包含密钥，不直接公开。

| 宿主机目录 | 容器目标 | 使用方 |
| --- | --- | --- |
| `CUSTOM_DIR/npc` | `/opt/happyro/custom/npc` | Server |
| `CUSTOM_DIR/db` | `/opt/rathena/db/import` | Server |
| `CUSTOM_DIR/resources` | `/opt/happyro/custom/resources` | Gateway |
| `CUSTOM_DIR` | `/opt/happyro/custom` | Admin |

- [ ] 游戏 `/applications/pwa/index.html` 显示启动页和查看器入口；能登录、选角、进入地图，地图、音效、中文正常。
- [ ] 后台能登录，冒险工具的物品、魔物、NPC 查询正常；空 custom 不改变原有数据和行为。
- [ ] 修改一项后台战斗设置并重启，确认仍保存在 `DATA_DIR/server-settings/`，没有第二份配置来源。

## 4. 新增及覆盖 NPC

下文 `custom/` 指实际 `CUSTOM_DIR`。使用独立测试角色和测试地图位置，记录每个测试脚本及原始文件，测试后清理。

- [ ] 在 `custom/npc/additions/review.txt` 添加合法测试 NPC，使用确认可用的地图、坐标和现有外观。在 `custom/npc/scripts.conf` 登记 `npc: additions/review.txt`。
- [ ] 保存文件后不会自动出现；执行有权限的 `@reloadscript` 或维护重启 map 后出现，能完成对话且只出现一次。
- [ ] 修改对话并重载，显示新内容；删除清单登记并重载，新增 NPC 消失。
- [ ] 验证 `import: additions/events.conf` 子清单能加载；子清单内路径仍相对于 `custom/npc/`，不是子清单所在目录。
- [ ] 未登记的 additions 文件不自动加载。
- [ ] 选取一个**当前确实被加载**的内置 `.txt` 脚本，复制到 `custom/npc/overrides/` 下相同相对路径并只修改测试文案。例如原路径 `npc/某目录/example.txt` 对应 `custom/npc/overrides/某目录/example.txt`。
- [ ] 不直接拿默认未启用的脚本测试覆盖；一个文件可能包含多个 NPC，先确认影响范围。
- [ ] 分别验证启动、`@reloadscript`、按原内置路径 `@unloadnpc` / `@loadnpc`：使用覆盖内容，不重复加载，卸载仍可按原路径定位。
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

- [ ] 三端分别登录，确认启动、资源和冒险工具正常，保留版本号及截图。
- [ ] 手机与 iPad：普通 NPC 对话、选择项、数量输入、购买、出售、材料兑换没有遮挡和溢出。
- [ ] 手机与 iPad：仓库打开/关闭、背包与仓库切换、物品详情、存取数量、连续存取、容量/重量限制正常。
- [ ] 桌面：背包装备等操作按钮文字垂直居中，既有交互无回归。
- [ ] 三端检查本次测试 NPC、物品和资源；新增资源缺少映射的情况单独记录，不与 UI 缺陷混淆。
- [ ] 重启服务后，角色、物品、仓库存档、后台设置和自定义效果均保留。

## 8. 保留定制的升级验收

使用独立旧版本测试存档；同一存档只能运行一套服务，固定容器名也不能在同一 Docker 环境直接并行部署两套。

- [ ] 保留旧完整包及配套工具，停止旧服务写入并备份；旧版备份用旧版工具恢复。
- [ ] 记录用户自定义文件的路径和 SHA-256，以及角色/仓库/后台设置的验收值。
- [ ] 解压并 verify 新包；复制旧 `.env`，保留 `APP_KEY`、密码、令牌和 Compose 项目名。
- [ ] 从新版 `.env.example` 更新 `RELEASE_VERSION` 和四个 IMAGE 变量；`DATA_DIR`、`CUSTOM_DIR` 指向旧数据的绝对路径，`RESOURCE_DIR` 使用新包资源。
- [ ] 不重新 initialize 已有环境；只运行 initialize-custom。旧版没有 custom 时建立新目录，已有 custom 只补缺少模板。

```bash
python3 tools/deployment/manage.py initialize-custom --directory .
python3 tools/deployment/manage.py import-images --directory .
docker compose up -d --pull never database
docker compose run --rm --no-deps --pull never admin-init
python3 tools/deployment/manage.py deploy --directory .
```

- [ ] 如本版涉及 Server schema，先按发布说明审查和执行对应升级 SQL，不批量执行历史脚本。
- [ ] 用户原有文件哈希不变，存档不丢失，目录刷新成功，未定制功能正常。
- [ ] 有真实新旧差异的内置 NPC 随镜像升级；同路径覆盖仍使用用户版本；删除覆盖后使用新版内置文件。
- [ ] 升级不要求手工合并整个 npc/db/resources；同时明确覆盖文件不会自动获得上游修复，自定义语法和依赖仍需验收。
- [ ] 若只用同一版本重复部署，记录为“升级流程演练”，不要勾选真实跨版本内容验证。

## 9. 备份、恢复和失败处理

停止游戏及后台写入，确保 admin-init 已完成，并暂停宿主机 custom 编辑，仅保留数据库运行。备份输出目录使用尚不存在的路径：

```bash
docker compose stop gateway admin web-api map char login
python3 tools/deployment/manage.py backup --directory . --output ../backups/custom-review
```

- [ ] 备份包含数据库、Admin 文件/服务端设置、`custom-files.tar`、`.env`、部署清单和 `checksums.json`。妥善保管密钥，不提交到 Git。
- [ ] 保留匹配版本完整包。在隔离恢复环境准备数据目录，复制备份 `.env` 并修正目录和地址，保留原 `APP_KEY`，不重新 initialize。
- [ ] initialize-custom 建立挂载目录，导入匹配镜像，仅启动 database，然后恢复：

```bash
python3 tools/deployment/manage.py initialize-custom --directory .
python3 tools/deployment/manage.py import-images --directory .
docker compose up -d --pull never database
python3 tools/deployment/manage.py restore --directory . --backup ../backups/custom-review --confirm-replace
python3 tools/deployment/manage.py deploy --directory .
```

- [ ] 恢复后角色、背包、仓库、后台设置与备份一致，所有 custom 文件哈希一致。
- [ ] 在恢复目标预先添加一个备份中没有的测试文件，确认恢复会移除它，custom 精确恢复而非只追加覆盖。
- [ ] 使用备份副本测试哈希损坏/缺少归档，恢复明确拒绝；不要破坏唯一备份。
- [ ] 记录失败回退步骤：使用旧完整包及匹配备份，不能只换旧镜像却保留不兼容的新数据库。

## 10. 验收记录和完成条件

| 项目 | 记录 |
| --- | --- |
| 验收日期 / 人员 | 待填写 |
| 新机器系统 / Docker daemon 架构 | 待填写 |
| Docker / Compose / Buildx / Skopeo 版本 | 待填写 |
| 发布版本 / ZIP 路径 | 待填写 |
| 根仓库及四应用仓库提交 | 待填写 |
| amd64 构建 / 实际运行验收 | 待填写 |
| arm64 构建 / 实际运行验收 | 待填写 |
| 首次部署 / 定制 / 升级 / 恢复 | 待填写 |
| 手机 / iPad / 桌面截图位置 | 待填写 |
| 失败用例 / 日志 / 复测结果 | 待填写 |
| 尚未完成的验收项 | 待填写 |

- [ ] 截图和脱敏日志放入 `work/` 或 `artifacts/`，不要记录密码、令牌和完整 `.env`。
- [ ] 每个失败项记录复现步骤、期望、实际结果，修复后复测。
- [ ] 只有完成实际容器及游戏操作的架构才标记“运行通过”；双架构构建成功不能替代双架构运行验收。
- [ ] 完成必需项并记录未验证边界后，再决定正式部署。当前这份清单的创建不代表任何新机器验收已经执行。
