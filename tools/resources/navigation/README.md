# NAVI 提前审查清单

`review.py` 在构建前生成确定的 NAVI 目标决策；客户端点击时只查随 bundle 发布的清单，不发网络预检、不临时搜索地图或候选落点。服务端仍进行当次权限、地图规则、冷却及安全落点检查。

## 操作

```sh
python3 tools/resources/navigation/review.py generate
python3 tools/resources/navigation/review.py check
python3 -m unittest discover -s tools/resources/navigation -p 'test_*.py'
```

无参数只显示帮助；`--no-color` 禁用 ANSI。

`generate` 只写 `work/navi-review/navi-targets.json` 和逐来源证据 `navi-targets-evidence.json`，**不会更新客户端清单**。审查生成差异后，将前者替换到客户端 `src/DB/Navigation/NaviTargets.json`，再执行 `check`。`--output` 可指定生成目标或待验证清单，`--root` 可指定完整 HappyRO 工作区。

`check` 重新计算当前全部输入并比较完整 JSON；新增／删除文件、任何输入哈希变化或目标决策变化都会失败。不得以构建时自动生成并覆盖的方式绕过审查。Standalone 客户端 checkout 没有服务端／本地化源，不能执行全工作区复核，须使用已经审查并由根仓库构建流程验证的清单。

## 清单协议

```json
{
  "schema": 1,
  "accessPolicy": "adventure-tools-server-rules",
  "version": "确定性 SHA-256",
  "sources": {"相对工作区路径": "SHA-256"},
  "entries": {
    "izlude,122,207": {"kind": "coordinate", "mapName": "izlude", "x": 122, "y": 207},
    "stapo,0,0,3,-222,1": {"kind": "monster", "monsterId": 1784, "monsterCode": "STAPO"},
    "t_garden,128,122,0,101,0": {"kind": "blocked", "reason": "unsupported_map", "message": "当前客户端不支持该地图", "mapName": "t_garden", "x": 128, "y": 122}
  }
}
```

INFO key 的归一规则必须与客户端完全一致：按逗号分段，去掉每段两端空白；首段去 `.gat`／`.rsw` 后缀并转小写；仅在 X／Y 段完全符合 `[0-9]+` 时转为整数十进制文本；删除末尾空段；其他字段原样保留。保留导航模式字段，不能仅凭相同地图坐标放行一个未知语义链接。未在清单中的 key 一律不允许直接传送。

`version` 是不含自身字段的其余 payload 按 Python `json.dumps(ensure_ascii=False, sort_keys=True, indent=2)` 加末尾换行序列化后的 SHA-256。客户端不必重新计算全量 source hash；根构建工具负责检查当前源资料。

## 生成依据

- 从 `npc/re/scripts_main.conf` 递归读取已启用 NPC 导入树；全部 NPC 文本纳入源哈希，未启用脚本不生成对话来源链接，也不能作为目标 NPC 存在的证据。
- 读取所有本地化回编译 JSON 字符串中的 NAVI，保留来源文件、JSON 路径、标签名和 INFO。
- 去除字符串外的注释；处理字面量、同一行多个 `F_Navi`、`F_mesnavi`，参数扫描支持平衡括号和字符串。未知动态构造／不完整标签导致生成失败。
- 两个 NAVI helper 的返回模板有明确断言，返回语义改变时要求审查。依斯鲁得 `.@map$ = strnpcinfo(4)` 调用只按实际 `duplicate(GuideIzlude)` 实例展开；新增未知实例会失败。
- 地图范围来自服务端 map cache，按 base → Renewal → 已提交的 import-tmpl 发布基线顺序覆盖；客户端支持表、已启用地图配置及已加载脚本的静态 `nowarpto` 声明参与分类。
- 从已加载脚本的顶层 `script`、`warp`／`warp2` 及 `duplicate` 声明提取静态触发范围。复制实例采用自身声明的范围，不继承原 NPC 的范围；隐藏／禁用的声明也纳入，避免后续启用后落入触发区。依照 `npc_setcells`，仅在可行走格上设置触发区域，再向外排除两格安全边距。声明范围即参与审查，不依赖脚本是否有 `OnTouch` 标签。未解析的带范围复制声明使审查失败。
- 魔物检索必须符合已观察到的 `AegisName,0,0,3,-222,1` 格式，并能在 Renewal／import-tmpl 魔物库找到真实 ID；不把魔物代码当地图名。
- 服务端传送、NPC 触发格生成、map cell、角色传送及分线实现文件也进入源哈希，执行语义改变后旧清单不可继续通过 `check`。

## NPC 对话地图标点审查

本次新增 `entries[key].dialogueTarget`，只用于 NPC 对话里的链接。它不改变既有 `kind`、地图坐标或物品／任务面板的行为，不审核或终止来源 NPC 的任务脚本，也不生成服务端中断对话白名单。

```json
{
  "kind": "coordinate",
  "mapName": "alberta",
  "x": 98,
  "y": 154,
  "dialogueTarget": {
    "allowed": true,
    "teleportAllowed": true,
    "targetType": "entrance",
    "npcName": "alb09",
    "labels": ["工具店"],
    "arrivalX": 103,
    "arrivalY": 153,
    "evidence": {
      "source": "npc/warps/cities/alberta.txt",
      "line": 25,
      "x": 98,
      "y": 153
    }
  }
}
```

- `allowed` 表示能否在 NPC 对话中提供可点击的精确地图标点。未知 key、错误坐标、未加载／不支持地图、目标缺失、隐藏、条件出现、身份无法核实或同距离多个候选均保留为不可点击文字。魔物查询没有唯一地图坐标，因此在 NPC 对话中也不可点击；其他入口的 `kind: monster` 不变。
- 目标来源为实际加载的顶层 NPC、商店或门户声明，展开 `duplicate`。候选必须在原坐标两格内；可见 NPC 还须与链接名称或脚本中独立的角色署名匹配，不能用附近不相干的人物替代缺失 NPC。重复名称、超长唯一名以及脚本隐藏／移动／换外观行为均不作稳定身份保证。动态名称无法确定时，对该文件的目标保守拒绝。
- 城市向导的设施入口可以使用已加载门户作为证据，不要求门前有人物。仅 `F_Navi` 的明确设施名称适用，人物标签不能借附近门户通过审查；门户的目标地图和目标格也须已配置、可显示且可行走。
- 同一个 INFO 可被多个不同名称复用，因此必须同时校验 `labels` 白名单，不能只看 key。规范化标签时去除 RO 色码、HTML 标签、空白及 `[]【】（）()·・「」『』`，再转小写；名称未提供或未通过身份核实均不可点击。设施名称通过不能替同坐标的缺失人物名称背书。
- `teleportAllowed` 与地图可展示性独立。地图禁止传入但目标与安全落点均已核实时，仍可显示标点，但不能显示可用传送操作；原因位于 `teleportReason`。目标没有安全连通落点时，`allowed` 为 `false`，保留为不可点击文字；原因 `target_no_connected_arrival` 位于 `reason`。
- 可传送候选格必须从目标实际位置连通，最多搜索十二格，避开 NPC 占位、静态触发区域及两格安全边距；斜向移动不能穿墙角。`arrivalX/Y` 为已审查的安全格，地图标点仍使用原始 `x/y`，不能把入口标点移动到落点。运行时应使用此落点并保留现有服务端对话、权限、冷却等拦截。
- `evidence` 记录放行的实际目标脚本、行号及 NPC／门户坐标。逐来源证据文件保留全部原始标签、INFO、文件和行／JSON 路径。`target_identity_unconfirmed` 只表示名称证据不足，不能报告成已证实 NPC 不存在。

点击只打开既有冒险工具地图；地图查看不会关闭或推进 NPC 对话。静态 `teleportAllowed: true` 不是当次传送授权：对话未结束时仍由已有服务端规则拒绝传送。此清单不新增网络预检，也不执行脚本模拟用户选择。

## 发布基线与本机覆盖

发布清单只使用已提交的 `db/import-tmpl/{map_cache.dat,mob_db.yml}`，不把被 Git／Docker 排除的本机 `db/import/` 内容带入发布数据。生成与验证时，若本机存在这两个覆盖文件且其内容不同于发布基线，立即失败并要求审查基线变更；没有本机运行目录的 Docker 构建直接使用同一份模板基线。不存在静默回退或按环境选择不同权威源的分支。

## 放行与兜底边界

坐标目标通过条件：地图已配置、客户端支持、未静态声明 `nowarpto`、map cache 存在、整数坐标在范围内、周围 12 格有避开已声明触发区域及两格边距的静态可行走候选点。目标禁传在清单层统一禁止直接传送，即使某个管理员可绕过服务端权限也不会在该链接上额外放行。没有候选点时提前显示“目标附近没有已确认的安全落点”，不先发传送请求再等待拒绝。

这不是对实时传送成功的承诺。静态检查不模拟角色／NPC 实时占用、运行时移动或创建的触发区域、脚本运行时地图标记和角色职业／任务状态；当次服务端拒绝时留在原地并说明原因。不会夹紧越界坐标、猜测错误坐标、扩大搜索半径或随机传送。没有明确落点的 `(0,0)` 链接默认不直接传送。

当前策略沿用冒险工具已有的坐标传送开放范围，不声称执行任务入口 NPC 的收费或任务进度条件。需要限制的区域应在服务端增加目标访问规则并重新生成审查，不能依靠客户端清单充当安全权限边界。

## 构建集成

根刷新脚本和镜像构建入口执行完整 `check`；Gateway Dockerfile 的独立审查 stage 也核对全部跨仓库输入。客户端 builder 调用 `scripts/verify-navi-review.mjs` 验证发布清单完整性及客户端输入。具体运行行为及验证结果见 [实现文档](../../../docs/development/client/text-markup/navi-teleport.md)。

实现按职责拆为 `syntax.py`（文本解析）、`terrain.py`（格子与连通性）、`policy.py`（目标身份与许可决策）和 `review.py`（输入、来源指纹、CLI）。四个实现文件都纳入来源哈希，修改任何一层都必须重审清单。测试只调用所属模块，不依赖 CLI 偶然导出的实现。
