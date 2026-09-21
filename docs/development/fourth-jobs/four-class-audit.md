# 四条四转职业路线逐技能审查

审查日期：2026-09-22。本轮范围是龙骑士、禁咒魔导士、影十字、风鹰的四转技能。独立于旧 F01—F08/R1—R4 的代表抽样，不用旧抽样结果代替本轮逐项记录。

## 范围与方法

| 职业 | 全部四转技能 | 主动 | 被动 |
| --- | ---: | ---: | ---: |
| 龙骑士 | 13 | 12 | 1 |
| 禁咒魔导士 | 19 | 18 | 1 |
| 影十字 | 11 | 10 | 1 |
| 风鹰 | 14 | 12 | 2 |
| 合计 | 57 | 52 | 5 |

使用专用自动化账号/角色，不修改玩家角色。逐职业在真实浏览器点击冒险工具“学满技能”和确认，核对所有四转技能达到服务端技能树上限。证据：`artifacts/fourth-jobs/four-class-full-audit.json`。

主动技能通过实际客户端使用回调、网络和运行服务端施放。浏览器注入仅记录封包、效果回调、特效实例/绘制次数，没有伪造施法或伤害。脚本位于 `work/fourth-jobs/`；首次及复测报告分别保存，失败准备不计作技能失败。

52 个主动技能均取得成功施放封包或对应效果回调；攻击样本检查伤害反馈，状态/地面/召唤按各自机制检查。逐项索引见 `artifacts/fourth-jobs/four-class-evidence-index.md` 和同名 JSON。主动技能无独立 STR 不一定异常：召鹰以鹰实体出现/消失反馈，猎鹰回旋以鹰攻击移动反馈。

## 修复

1. 龙之吐息、龙之刺击、交叉斩、能量转换、荒野疾行原先只有补充图标，缺少专属特效资源及显式映射。补充官方 STR 和纹理共 288 个文件、9,885,944 字节；原 GRF 未修改。
2. 接入已存在但未映射的灾厄风暴 `4wh_calumitygale` 资源。
3. 荒野疾行加入猎鹰目标攻击移动判定；真实战斗已记录鹰向目标移动及返回。
4. 对照官方 2024-10-16 效果表补充地面图层和高度偏移；交叉斩区分主动作和独立命中层，命中层复用原 GRF 的 `shadow_stab_hit1`。
5. 修复资源审计工具对 `{files, ...渲染参数}` 描述报错的问题，并覆盖此前漏查的持续状态特效。

来源、归档/文件 SHA-256 和 STR 纹理依赖见 `inputs/manifests/fourth-job-effects.json`。新增文件位于 `inputs/runtime/kro-20211105/client/data/texture/effect/`，既有离线打包规则会收录。校验命令：

```bash
node tools/resources/install-fourth-job-effects.mjs verify --no-color
```

没有替换整份运行 BSON；客户端元数据见 `FourthJobEffectMetadata.js`。技能常量只补本轮映射需要的后追加 ID。

## 被动机制证据

| 被动 | 实测结果 | 报告（位于 artifacts/fourth-jobs/） |
| --- | --- | --- |
| 双手防御 | 学习前后，同一攻击来源的平均普通攻击受伤均下降；保留逐次伤害及匹配来源，现场多攻击者和随机伤害不用于精确百分比结论 | `passive-dragon-defense.json` |
| 双手杖修炼 | 装备双手杖，Lv.1—10 的 S.Matk 为 61、63、65、67、69、71、73、75、77、79，每级 +2 | `passive-stats.json` |
| 影之感知 | 满级闪避 786→886，短剑暴击 40→90，分别 +100/+50 | `passive-stats-first.json` |
| 亲近自然 | 同一装备/属性/猎鹰冲锋等级，伤害 212176→318228，0→5 级为 1.5 倍 | `passive-windhawk.json` |
| 高级陷阱 | 火焰陷阱 Lv.1，被动 3→5 级，伤害 155898→194590，约 1.248 倍，与 1.6→2.0 倍率相符 | `passive-windhawk.json` |

这些样本确认被动实际生效，不覆盖每个武器/体型、全部自动触发概率、所有公式和状态组合。

## 验证

- 补充资源累计 2,142 个文件（117,114,628 字节），全部通过运行目标及 Gateway HTTP 哈希校验；来源清单覆盖四份官方补丁。
- 239 个 STR 完整解析并检查依赖；1,299 张 BMP 经 Chromium 解码、604 张 TGA 经客户端 Targa 解码，全部通过。
- 全量资源扫描覆盖 579 项效果、7,166 张纹理，图标/纹理无缺失；仍保留 3 个没有当前技能绑定的旧苦无区域 STR 缺口，审计退出码为 1，不描述为全量通过。
- 最新四组相关回归共 15 项测试通过，覆盖技能 ID、图层/锚点、持续状态、四元素状态选择、地面动画与伤害通知分离，以及短动画资源加载和猎鹰移动；改动的客户端源文件 ESLint 通过。
- PWA 使用 `build:pwa`（`--all`）全量重建。当前构建 `mubp6r4r`，Gateway 与本地产物一致，入口仍为启动页。
- 最终实战确认龙之呼吸、砍杀者、交叉斩、狂风暴雨、荒野疾行均有正伤害，且主动画仅播放一组；天空之日服务端修复后只发送一次成功通知、播放一组主动画，同时保留正伤害。证据见 `combat-Dragon_Knight,Shadow_Cross,Windhawk,Sky_Emperor-retry-DK_HACKANDSLASHER.json`。
- 服务端已重新编译并重启地图服务，运行进程的可执行文件哈希与构建产物一致，四项服务健康检查通过。

主要实战报告：`combat-Dragon_Knight-chain-retry.json`、`combat-Dragon_Knight-retry.json`、`combat-Arch_Mage-retry-AG_DEADLY_PROJECTION.json`、`combat-Shadow_Cross.json`、`combat-Windhawk-retry.json`。龙骑士骑龙样本临时启用专用账号 GM 命令，退出后已恢复 group_id=0 并查库确认；该组的 skill_unconditional/all_skill/all_equipment 均为 false。其余被动传送采用冒险工具实际封包。

## 同类扩展检查与边界

另外检查了原 35 张补充图标对应的其它技能：四条目标路线以外的 30 项均有官方效果表条目，但缺显式映射，其中 25 项缺命名常量；29 项至少有一个官方 STR 路径缺失且同名搜索未找到，ABC_HIT_AND_SLIDING 的共用素材已存在。详细清单见 [后追加技能效果缺口](post-2021-effect-gaps.md)，完整字段和 HTTP 状态见 `similar-skill-resource-audit.json`。

这些 30 项缺口已全部完成资源补齐和实战修复验证，共 33 个样本（四元素护符分别验证火、水、风、地）。证据见 `artifacts/fourth-jobs/expanded-skill-evidence.json` 和同名 Markdown。神秘粉末同时验证状态循环动画和约 60 秒结束清理；天空之日修复服务端重复成功通知。客户端实际 BSON 合并后核查 254 个阶段，没有阶段内重复 STR 路径。

本轮未构建 Docker 镜像、未打离线包。上述结果证明所列功能样本和特效可用，不表示所有等级、装备、元素、PvP、概率分支或官方逐帧表现已全面验证。

最终证据覆盖核对见 `artifacts/fourth-jobs/completion-audit.json`；运行时检查确认三个旧苦无区域条目没有技能绑定，见 `runtime-effect-bindings.json`。
