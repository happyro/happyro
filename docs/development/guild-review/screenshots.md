# 公会审查关键截图

[返回公会审查](README.md)

以下截图来自本机真实客户端与服务端交互，手机和平板为 Chrome 触屏视口模拟，非物理设备测试。未用渲染 mock 替代游戏界面。

| 场景 | 截图 | 说明 |
|---|---|---|
| 手机仓库存取记录 | [查看](evidence/storage/phone-storage-log-final.png) | 真实存取记录，398×600px，窗口不被 HUD 遮挡 |
| 平板仓库存取记录 | [查看](evidence/storage/tablet-storage-log-final.png) | 暗色平板窗口，640×600px |
| 桌面非空公会仓库 | [查看](evidence/storage/desktop-storage-title-final.png) | 最新版本标题、物品图标和容量 |
| 桌面仓库存取记录 | [查看](evidence/storage/desktop-storage-log-final.png) | 浅色桌面窗口，760×540px |
| 桌面人数 | [查看](evidence/management/desktop-count-2-online-1.png) | 首次打开，实际总成员 2、在线 1 |
| 平板人数（含离线成员） | [查看](evidence/management/tablet-count-2-online-1.png) | 总成员 2、在线 1 |
| 平板公会管理 | [查看](evidence/management/tablet-guild.png) | 会长转交后管理界面、成员及公告 |
| FE 实际攻击核心 | [查看](evidence/siege/fe-real-attack.png) | 普通角色攻击，画面可见伤害数字 |
| FE 占城公告 | [查看](evidence/siege/fe-capture-announcement.png) | 实际摧毁核心和城堡归属公告 |
| TE 职业限制 | [查看](evidence/siege/te-entry-rejection-fixed.png) | 新版传送入口标题及限制提示；角色临时职业测试后恢复 |

桌面权限实测：[会长可编辑](evidence/management/desktop-master-positions-final.png)、[普通成员禁用](evidence/management/desktop-member-positions-final.png)。手推车实机：[存入前](evidence/storage/cart-before-transfer-final.png)、[存入后](evidence/storage/cart-after-deposit-final.png)、[取出后](evidence/storage/cart-after-withdraw-final.png)。调试注入预览与修复前截图不列入此清单。

## 界面复核后的替换截图

- [中文驱逐原因](evidence/management/guild-expulsion-chinese.png)：替代旧 `desktop-4.png`，测试原因改为“公会功能验收”，玩家自定义原因仍原样显示。
- [公会信息中文标签](evidence/management/guild-info-chinese.png)：倾向图中文标签。
- 旧 `te-third-job-blocked.png` 由上表的 TE 职业限制修复图替代；旧 `desktop-storage-log.png`、`tablet-storage-log.png` 不代表当前布局。桌面及移动端日志已替换为本轮真实重拍图。
- 本轮桌面最终构建 `mvt03h6i`；平板/手机与中文驱逐图摄于 `mvsztp6y`，后续仅调整桌面日志标题颜色。

## 仓库记录公共布局补充

手机、平板横竖屏及桌面的最新组件截图见[横竖屏与公共样式补充](ui-followup.md#横竖屏与公共样式补充)。这些截图使用测试记录验证布局；上述游戏截图保留首轮实际存取测试的结果。
