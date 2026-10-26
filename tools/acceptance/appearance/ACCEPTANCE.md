# 配套部署后的浏览器验收驱动

`acceptance.py` 控制已启动的 `tools/acceptance/jobs/session.mjs`，不自行启动浏览器、不连接数据库、不转职、不学习技能、不改变装备或骑乘状态。`run` 只在专用 Job 前缀角色上切换职业外观，结束时恢复原选择。已在冻结构建 mvdokr6y 执行四转选项矩阵；具体范围、证据和负向断言补测见 [进度记录](../../../docs/development/character-appearance/progress.md)，不能将驱动通过等同整线验收完成。

## 启动条件

负责人先完成配套部署、冻结 buildId 和源码／二进制快照，分配专用本人／旁观者账号及角色。新构建可能改变 session.mjs 注入的打包局部变量名，必须先做控制器冒烟。两个账号要在同一张安全地图、互相可见，停止会影响属性的战斗或临时增益。不要使用用户角色。

在两个独立终端启动已分配控制器（以下只是示例，未执行）：

```sh
node tools/acceptance/jobs/session.mjs --run --pair=1 --port=9351
node tools/acceptance/jobs/session.mjs --run --pair=1 --female --port=9353
```

控制器内 `game` 是真实浏览器页面，`snapshot()` 使用游戏认证接口；`command()` 通过真实 Admin→map 服务命令，内置2.1秒节流。证据不输出会话认证令牌。只把控制器绑定 localhost。

准备每个分支的相应性别角色后执行（准备转职由负责人在专用 fixture 上单独完成，驱动拒绝职业不匹配，不自动改职业）：

```sh
python3 tools/acceptance/appearance/acceptance.py run --branch knight --sex 1 --build-id BUILD --output work/character-appearance/acceptance/knight-male-walk
python3 tools/acceptance/appearance/acceptance.py run --branch knight --sex 1 --build-id BUILD --form mounted --output work/character-appearance/acceptance/knight-male-mounted
```

四转角色逐项覆盖同分支三个外观；11个不限性别分支分别男女执行，加诗人男／舞娘女，共24个性别分支实例、72个选项／性别实例。骑士／十字军／猎人／铁匠额外执行真实骑乘状态实例。随后在进阶二转、普通／进阶三转 fixture 上执行同一驱动，验证较早阶段选项以及当前／更高阶段请求被拒绝；二转没有选择入口，API模式仍可验证默认及非法请求。

分支名称：hunter、wizard、priest、crusader、assassin、blacksmith、sage、alchemist、monk、rogue、bard、dancer、knight。不得并行操作同一账号，即使角色 slot 不同。

`--via ui` 使用页面中实际可见的“职业外观”按钮与选项，需要事先打开“角色”菜单。默认 API 模式不算UI验收。手机／平板可复用此驱动与各自控制器的 `--mobile`／`--tablet`，必须记录模拟视口而非真实设备。

## 自动断言范围

- 两个控制器所连接环境的 buildId 必须符合指定冻结版本。
- 验证独立服务端选项列表、每个允许选项、默认和恢复默认。
- 从本人及另一客户端的实际 EntityManager 读取真实职业、renderJob、保存选择、实际身体 SPR/ACT 路径。身体路径必须等于资源核验得到的对应职业／性别路径；不会只验证两份生成表相等，也不只检查资源文件存在。
- 骑乘模式下检查已具备真实骑乘状态：有映射显示完整绑定身体，无映射显示真实职业对应身体，保存选择不变。
- 对比服务端真实职业、属性、等级、点数、Zeny、riding状态等不变量；不以这些字段代替技能树和装备资格实测。
- 非法未知、跨分支请求被拒绝且不改变选择；在低阶段fixture额外拒绝当前／高阶段选项。
- 每次选择分别截图本人／旁观者，记录独立服务端与两个客户端读数；原始report持续落盘，失败保留失败原因，禁止覆盖已有证据目录。
- `run` 结果标为 `passed_scoped_checks_only`，不宣称整个 TODO 完成。

## 动作取证与剩余矩阵

可在第二控制器或人工进行真实行走、攻击、施法、受击时采样，不直接篡改客户端 action 字段伪造玩法：

```sh
python3 tools/acceptance/appearance/acceptance.py capture --branch knight --sex 1 --build-id BUILD --seconds 10 --output work/character-appearance/acceptance/knight-action-sample
```

capture 仅记录当时实际action、direction、position及双方身体／附件信息；状态为 `captured_not_visually_reviewed`。必须另行执行并录制/截图：八方向、待机、走路、攻击、受击、施法、剑枪盾／弓／拳刃／拳套／乐器鞭、头饰披肩、技能特效挂点。截图存在不能自动判定没有错位或断帧，负责人需查看图像。

以下仍需独立真实场景：骑乘与步行转换恢复，骑乘中切换、切图、重登保留选择，随行单位与手推车不变，选角及装备／他人预览，进出视野，死亡复活，技能和装备资格，UI提示，变身／第二服装优先级，失败超时／迟到回调，真实 iOS/iPadOS。资源故障可另用浏览器route做可控注入，但不得修改生产资源。每项结论归并现有 acceptance/matrix.json 与 progress.md，不能因为驱动循环结束就把整条职业线计为验收通过。

## 八方向移动驱动

`movement.py --run` 在已准备好的同一职业／外观下，向八个方向分别发送真实移动请求，采样本人和旁观者的实际动作帧，截图终点待机，并返回原位置。不直接改实体动作、方向或位置。运行前要求双方可见、存活和周边地面可走；保持独占角色。每个外观及特殊形态分别执行，截图仍需人工检查。工具本身通过语法检查不代表实际移动验收通过。

```sh
python3 tools/acceptance/appearance/movement.py --run --branch knight --sex 1 --build-id BUILD --output work/character-appearance/acceptance/knight-movement
```
