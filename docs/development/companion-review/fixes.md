# 首轮发现的问题与修复

[返回总览](README.md) · [最新修复总结](repair-summary.md) · [测试覆盖](coverage.md) · [有效待办](pending.md)

本页保留首轮 C001—C009 的复现和验证范围；下文“未测／待补测”描述仅对应首轮时间点，当前结果以[修复总结](repair-summary.md)和[覆盖表](coverage.md)为准。后续已补齐名称边界、桌面技能控件、全进化分支与50击杀等，勿将本页当作当前待办。

以下问题均在首轮操作中发现并处理。修复状态指当时源码及本机构建；复验范围以列出的记录为限。记录 ID 在[observations.json](evidence/observations.json)中查找，自动化结果见[regression-result.txt](evidence/regression-result.txt)。

## C001：佣兵增量状态与菜单不同步

**发现：** 真实击杀后，服务端回包参数 `189` 的值已为 `1`，移动端菜单仍显示击杀数 `0`。同一处理器把 HP/SP 当成参数 `0～3`，与服务端使用的 `5～8` 不一致，也遗漏了战斗属性和忠诚度。

**解决：** 使用状态枚举映射增量字段，更新移动端状态模型和实体血蓝条；桌面合并增量数据，保留名称、契约和其他字段。

**验证：** `mercenary-kill-counter-live` 保留修复前回包与显示差异；`mobile-mercenary-fixed-live-update`、`desktop-mercenary-kill-counter-fixed` 证明实战计数更新；`desktop-mercenary-skill-cast` 证明 SP 200→188。忠诚度核对了新契约中的值，未完成 50 次击杀增量场景。

源码：[Mercenary.js](../../../repos/happyro-client/src/Engine/MapEngine/Mercenary.js)。自动化：[MobileCompanionProtocol.test.js](../../../repos/happyro-client/tests/ui/MobileCompanionProtocol.test.js)。

## C002：攻击模式不恢复，桌面写入值错误

**发现：** 整页重新登录后，AI 默认回到被动模式，没有恢复保存值；桌面开关把 `localStorage` 返回的字符串与数字 `0` 做严格比较，导致保存值和实际 AI 状态不一致。

**解决：** 页面初始化读取 `'1'`／`'0'`；桌面切换按实际 AI 布尔状态保存，移除初始化时的两次无意义切换，同步右键菜单判断。

**验证：** `mobile-final-full-page-relogin` 保留重登后的主动状态；`desktop-final-full-page-mode-persistence` 在整页重登后再次实际击杀，确认模式继续生效。

源码：[AIDriver.js](../../../repos/happyro-client/src/Core/AIDriver.js)、[EntityControl.js](../../../repos/happyro-client/src/Controls/EntityControl.js)、[生命体窗口](../../../repos/happyro-client/src/UI/Components/HomunInformations/HomunInformations.js)、[佣兵窗口](../../../repos/happyro-client/src/UI/Components/MercenaryInformations/MercenaryInformations.js)。自动化：[AIDriver.test.js](../../../repos/happyro-client/tests/core/AIDriver.test.js)、[DesktopCompanions.test.js](../../../repos/happyro-client/tests/ui/DesktopCompanions.test.js)。

## C003：部分生命体在被动模式下仍主动选怪

**发现：** 巴尼米乐斯在被动状态仍攻击中立罗达蛙。原始 AI 对部分物种自行搜索全部可见魔物，关闭客户端附加的主动选敌逻辑不足以阻止该行为。

**解决：** 被动模式下，AI 的候选实体列表排除未交战的中立魔物；保留当前交战、反击及玩家已指定的目标。

**验证：** 修复前为 `desktop-homunculus-passive-unexpected-attack`；修复后 `desktop-passive-mode-fixed` 无主动攻击请求且目标仍存在。移动端飞里乐在 `mobile-passive-species-regression` 中攻击请求为 0，切主动后的 `mobile-active-species-regression` 记录 14 次攻击请求及目标消失。反击和玩家指定目标的保留由自动化覆盖，尚未做完整双端实战矩阵。

源码：[AIDriver.js](../../../repos/happyro-client/src/Core/AIDriver.js)。自动化：[AIDriver.test.js](../../../repos/happyro-client/tests/core/AIDriver.test.js)。

## C004：无随行单位时桌面快捷键访问空窗口

**发现：** 第一次进入没有随行单位的角色，按宠物、生命体和佣兵信息快捷键均产生 `Cannot read properties of null (reading 'style')`。窗口尚未初始化，处理器已访问 `_host.style`。

**解决：** 打开信息窗前检查窗口与对应实体是否存在。

**验证：** 最初的 3 条页面异常保留在[verification.json](evidence/verification.json)；新空角色的 `desktop-empty-shortcuts-fixed` 和最终构建的 `final-build-smoke` 均无页面异常。

源码：[宠物窗口](../../../repos/happyro-client/src/UI/Components/PetInformations/PetInformations.js)、[生命体窗口](../../../repos/happyro-client/src/UI/Components/HomunInformations/HomunInformations.js)、[佣兵窗口](../../../repos/happyro-client/src/UI/Components/MercenaryInformations/MercenaryInformations.js)。自动化：[DesktopCompanions.test.js](../../../repos/happyro-client/tests/ui/DesktopCompanions.test.js)。

## C005：单位消失后留下旧信息或技能窗口

**发现：** 桌面删除生命体后，实体已消失，信息窗口仍显示原有数据和操作；消失路径原先主要停止 AI，没有统一清理所属窗口。

**解决：** 自己的宠物、佣兵、生命体消失时隐藏相应信息窗，清理随行技能窗并停止生命体喂食计时；快捷键不再重开不存在实体的旧信息。其他玩家的单位消失不关闭自己的窗口。

**验证：** `desktop-homunculus-deleted` 的修复前窗口仍可见；`desktop-homunculus-delete-cleanup-fixed` 证明删除后隐藏且不能重开。`desktop-contract-expiry-fixed` 证明 15 秒测试契约到期后信息、技能窗同时关闭。移动端的空状态和操作禁用另有记录。

源码：[Entity.js](../../../repos/happyro-client/src/Engine/MapEngine/Entity.js)及三个信息窗口。自动化：[EntityLifecycle.test.js](../../../repos/happyro-client/tests/engine/EntityLifecycle.test.js)。

## C006：技能窗口打开后被信息窗口遮挡

**发现：** 点击生命体技能按钮后，技能窗 `z-index=84`，信息窗为 `85`，升级控件被遮挡。技能窗在 `mousedown` 阶段打开，随后信息窗又获得焦点。

**解决：** 生命体和佣兵技能按钮改在 `click` 阶段打开并置前；技能窗标题改为中文。

**验证：** 修复前 `desktop-skill-window-obscured` 保留层级数据；修复后实际完成生命体升级、前置解锁和点数耗尽，并从两个技能窗分别施放“奇想”Lv.5、“双重扫射”Lv.2。技能详情、拖放快捷键、施放等级调节等控件仍待补测。

源码：[生命体窗口](../../../repos/happyro-client/src/UI/Components/HomunInformations/HomunInformations.js)、[佣兵窗口](../../../repos/happyro-client/src/UI/Components/MercenaryInformations/MercenaryInformations.js)、[SkillListMH.js](../../../repos/happyro-client/src/UI/Components/SkillListMH/SkillListMH.js)。[升级截图](evidence/desktop-homunculus-skill-upgraded.png)。

## C007：桌面宠物状态文案与进化分支错误

**发现：** 饰品状态显示成“装备穿戴失败”；进化名称直接使用未解码的宠物字符串而乱码；多个进化选项只传入原宠物种类，进化窗口总取第一个目标。

**解决：** 饰品状态按实际装备字段显示并接收增量更新；进化选项与窗口使用物品中文名，显式传递目标蛋 ID 并读取该分支材料；装备饰品时先提示卸下。

**验证：** `desktop-pet-accessory-evolution-guard`、`desktop-pet-unequip` 验证装备状态；波利→大师波利成功并扣除材料。`desktop-pet-second-evolution-branch` 显示第二分支“甜心波利之蛋”及其材料，`desktop-pet-evolution-insufficient-materials` 没有发送进化请求。第二分支成功进化尚未实测；提交正确目标 ID 的逻辑另有自动化测试。

源码：[PetInformations.js](../../../repos/happyro-client/src/UI/Components/PetInformations/PetInformations.js)、[PetEvolution.js](../../../repos/happyro-client/src/UI/Components/PetEvolution/PetEvolution.js)、[Pet.js](../../../repos/happyro-client/src/Engine/MapEngine/Pet.js)。自动化：[DesktopCompanions.test.js](../../../repos/happyro-client/tests/ui/DesktopCompanions.test.js)。[第二分支截图](evidence/desktop-pet-second-evolution-branch.png)。

## C008：桌面中文改名被静默截短

**发现：** 输入 8 个汉字“八个中文测试名字”后，宠物变成“八个中文测试名”，并消耗唯一改名机会。桌面入口发送前没有验证 UTF-8 字节上限。

**解决：** 宠物和生命体共用发送前名称校验：修剪首尾空白，拒绝空名称、控制字符以及超过 23 个 UTF-8 字节的名称。

**验证：** `desktop-pet-long-name` 保留修复前结果；`desktop-pet-long-name-rejected` 和 `desktop-homunculus-long-name-rejected` 验证超长拒绝；合法中文及一次改名限制通过实测。空名称、控制字符等校验有自动化覆盖，尚未逐项双端实测。

源码：[CompanionName.js](../../../repos/happyro-client/src/Utils/CompanionName.js)、[Pet.js](../../../repos/happyro-client/src/Engine/MapEngine/Pet.js)、[Homun.js](../../../repos/happyro-client/src/Engine/MapEngine/Homun.js)。自动化：[DesktopCompanions.test.js](../../../repos/happyro-client/tests/ui/DesktopCompanions.test.js)。

## C009：生命体改名资格、零值和场景名称不同步

**发现：** 桌面普通增量状态包没有 `bModified`，却进入完整信息更新并禁用改名；标志使用大小比较；技能点和属性的零值被真值判断跳过；窗口已显示新名称时，场景实体仍可能显示旧名称。

**解决：** 增量状态按对应字段处理；仅在收到名称标志时检查已改名位；允许 0 值更新；完整生命体信息同步场景实体名称。

**验证：** 双端技能点耗尽后显示 0 且不能继续升级；`desktop-homunculus-name-synchronized`、`mobile-final-rename-synchronized` 核对窗口、改名限制与实体名称；桌面死亡条件下用正常技能复活。其他零属性增量由自动化验证，未逐项全部实机覆盖。

源码：[Homun.js](../../../repos/happyro-client/src/Engine/MapEngine/Homun.js)、[HomunInformations.js](../../../repos/happyro-client/src/UI/Components/HomunInformations/HomunInformations.js)。自动化：[MobileCompanionProtocol.test.js](../../../repos/happyro-client/tests/ui/MobileCompanionProtocol.test.js)、[DesktopCompanions.test.js](../../../repos/happyro-client/tests/ui/DesktopCompanions.test.js)。

## 已执行的自动化回归

2026-10-19 对以下 7 个文件执行了 55 项测试，全部通过：

- [AIDriver.test.js](../../../repos/happyro-client/tests/core/AIDriver.test.js)
- [DesktopCompanions.test.js](../../../repos/happyro-client/tests/ui/DesktopCompanions.test.js)
- [MobileCompanionProtocol.test.js](../../../repos/happyro-client/tests/ui/MobileCompanionProtocol.test.js)
- [MobileCompanions.test.js](../../../repos/happyro-client/tests/ui/MobileCompanions.test.js)
- [MobilePetProtocol.test.js](../../../repos/happyro-client/tests/ui/MobilePetProtocol.test.js)
- [MobilePet.test.js](../../../repos/happyro-client/tests/ui/MobilePet.test.js)
- [EntityLifecycle.test.js](../../../repos/happyro-client/tests/engine/EntityLifecycle.test.js)

完整 PWA `--all` 构建和最终入口冒烟检查也已通过。自动化、构建、实机观察分别证明各自覆盖内容，未测试项继续保留在[待补测](pending.md)。
