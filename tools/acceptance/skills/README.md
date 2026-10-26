# 技能实机审计

本目录保留已审查的技能场景和证据核验能力。历史范围见[审查总览](../../../docs/development/skill-review/README.md)，[未解决事项](../../../docs/development/skill-review/pending.md)和[evidence](../../../docs/development/skill-review/evidence)。历史快照核验不表示当前版本已重新实测。

## 只读证据核验

```bash
python3 tools/acceptance/skills/verify.py --run --no-color
```

尚未提交的路径迁移可以加 `--working-tree` 做工作区预检；输出会明确标为工作区结果，不能代替默认的 Git 跟踪检查。

该命令核对既有 607 项技能快照、606 项处理记录和 1 项豁免，以及 Git 跟踪、文档链接和证据哈希；不会启动游戏或写库。计数属于该次审查，不充当当前全部技能覆盖门槛。

## 会话与场景

三个角色共用 `session.mjs`，通过 `--role main|partner|assist` 选择独立凭据及端口。必须明确测试角色名称和浏览器程序；不再维护三份登录、事件观察和 HTTP 控制器。

```bash
node tools/acceptance/skills/session.mjs --run --role main --character AuditMain --browser-path /path/to/chromium
node tools/acceptance/skills/session.mjs --run --role partner --character AuditPartner --browser-path /path/to/chromium
python3 tools/acceptance/control.py --run tools/acceptance/skills/scenarios/init.js --port 9341
```

| 角色 | 凭据文件 | 控制端口 |
| --- | --- | --- |
| main | work/runtime/automation-account.env | 9341 |
| partner | work/runtime/test-account.env | 9343 |
| assist | work/runtime/skill-assist-account.env | 9345 |

`--credentials`、`--port`、`--slot` 和 `--base-url` 可显式覆盖；浏览器调试端口为控制端口减一。账号文件只保存在忽略目录，不写入 Git。main/assist 使用 AUTOMATION_ACCOUNT_USER/PASSWORD，partner 使用 TEST_ACCOUNT_USER/PASSWORD。同一账号不可并发进入多个角色。

`scenarios/*.js` 是控制器中 AsyncFunction 的函数体，依赖 `game`、`command`、`live` 等已建立的会话状态，不是 Node CLI，也不是可无条件重放的自动测试。`scripts.json` 登记维护文件。重放前必须读对应证据、核对角色和前置初始化；成功日志不能代替操作后的状态断言。

`coverage-tree.mjs` 处理新的审计产物，`db-read.py` 仅供人工审核后的本机 SQL 诊断；SQL 前缀检查不提供数据库只读权限。不可自动运行二者，也不可直接覆盖正式证据。

旧的固定库存/角色 ID 样本修改器、复制服务端结构体的内存偏移读取器已退出维护，原实现可通过 Git 历史查询；不再提供看似可复用的旧环境入口。完全重复的 spirit-batch-prepare 已合并到 `scenarios/spirit-prepare.js`。原始失败采样及续跑片段仍保留其观察意义，不能把它们改标为通过测试。

统一检查只执行语法、参数和只读证据测试。需要验证实际技能或内部客户端符号时，必须重新运行专用实机场景；当前重构未代替这项验收。
