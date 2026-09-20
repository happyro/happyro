# 副本名称与新物品标记修复

日期：2026-09-20。

## 实现与进度

- 已修复：BasicInfo V4/V5 的新物品覆盖图以背包按钮为定位容器，左侧、底部对齐，覆盖层不拦截鼠标点击。
- 已修复：服务端 49 个脚本、118 处引用、61 个副本名称。包括创建、进入、名称变量、候选数组和 `ILI_NAME` 模式判断。
- 已校验：以现有 Renewal `db/re/instance_db.yml` 为唯一注册名来源，使用本地上游同 ID 记录核对英文名与中文名映射；不增加运行时别名。
- 已更新：客户端、服务端及根仓库 changelog。
- 待生效：运行中的地图服务需重新加载脚本；本次只启动独立验收进程，没有重载或重启当前服务。

“暮光花园”在数据库中注册为“黄昏花园”；`Hey! Sweety` 注册为“嘿！甜心”。名称引用不一致会在 `instance_create` 查找数据库时返回失败。只修创建入口不够，共用地图的 `OnInstanceInit` 也必须使用同一个名称，否则日常副本会走主线分支。

## 抽样与检查范围

| 检查 | 结果 |
| --- | --- |
| 新物品提示 | 浏览器登录四转测试角色，页面内触发 `Inventory.addItem`；BasicInfo V5 提示左边与按钮差 0 px、底边差 0 px，35×40 图片正常显示，`pointer-events: none`；截图人工确认，浏览器错误为 0 |
| 副本引用检查 | `python3 -m unittest discover -s tests -p test_instance_names.py`，3 项通过；扫描 NPC 中可静态识别的创建、进入、变量赋值、模式比较及数组名称，对照 Renewal 注册表 |
| 整库加载 | 独立端口执行 `map-server --run-once`，加载 1265 张地图、24179 个 NPC，无脚本错误，正常退出 |
| 实际创建样本 | 独立进程用 `IM_NONE` 分别创建“黄昏花园”和“嘿！甜心”，获得实例 ID 1、2，均复制 `1@bamn`、`1@bamq` 与 NPC，随后销毁；无错误 |
| 客户端构建 | `refresh-client.sh build` 使用 `--all`，构建标识 `mu9w7zme`，3338 产物哈希通过 |

不逐个通关全部副本，不穷举全部客户端 UI 版本。`IM_NONE` 创建样本验证注册名、地图及 NPC 初始化，不替代玩家组队、任务前置、冷却与完整战斗流程。副本已有占用、非队长或任务条件不足仍应按游戏规则拒绝。

诊断产物位于忽略目录：`artifacts/inventory-marker.json`、`artifacts/inventory-marker.png`、`artifacts/instance-run-once.log`、`artifacts/instance-smoke.log`；临时脚本在 `work/`。服务端测试脚本保留在 `repos/happyro-server/tests/test_instance_names.py`。
