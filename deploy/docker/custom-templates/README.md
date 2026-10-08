# HappyRO 自定义内容

- npc/scripts.conf：登记新增脚本，路径相对于 npc/，必须位于 additions/。
- npc/additions/：新增脚本 .txt，子清单 .conf；不自动扫描加载。
- npc/overrides/：按内置 npc/ 的相对路径覆盖 .txt 文件；仅改变读取路径，不重复定义 NPC。删除覆盖文件恢复内置版本。仅有注释的文件可停用该文件全部定义。不支持覆盖内置 .conf 清单。
- db/：rAthena db/import 模板；按各数据库原生合并规则编辑。
- resources/：对应客户端 data/ 下的资源相对路径（例如 texture/...），不要再嵌套 data/。资源必须采用当前客户端支持的格式。

保存文件不自动重载。脚本手动 @reloadscript；数据库按类型重载或重启服务。资源更新后重新登录游戏；旧浏览器本地缓存必要时清除。目录资料使用 refresh-custom-catalogs 刷新。
升级不会覆盖本目录，也不会合并自定义脚本。覆盖文件不自动获得新版修复；有错误必须自行修正，不会静默退回内置文件。不要使用符号链接。
