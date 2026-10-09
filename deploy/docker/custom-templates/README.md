# HappyRO 自定义内容

- npc/scripts.conf：登记新增脚本，路径相对于 npc/，必须位于 additions/。
- npc/additions/：新增脚本 .txt，子清单 .conf；不自动扫描加载。
- npc/overrides/：按内置 npc/ 的相对路径覆盖 .txt 文件；仅改变读取路径，不重复定义 NPC。删除覆盖文件恢复内置版本。仅有注释的文件可停用该文件全部定义。不支持覆盖内置 .conf 清单。
- db/：rAthena db/import 模板；按各数据库原生合并规则编辑。
- resources/：对应客户端 data/ 下的资源相对路径（例如 texture/...），不要再嵌套 data/。资源必须采用当前客户端支持的格式。

保存文件不自动重载。脚本手动 @reloadscript；数据库按类型重载或重启服务。资源更新后重新登录游戏；旧浏览器本地缓存必要时清除。目录资料使用 refresh-custom-catalogs 刷新。
升级不会覆盖本目录，也不会合并自定义脚本。覆盖文件不自动获得新版修复；有错误必须自行修正，不会静默退回内置文件。不要使用符号链接。


首次 initialize 创建默认 custom；若 `.env` 中改了 CUSTOM_DIR，在部署包根目录执行 `python3 tools/deployment/manage.py initialize-custom --directory .`，只补缺少文件。建议 CUSTOM_DIR 位于版本目录外，使用专用绝对路径。

按内置文件路径卸载使用 `@unloadnpcfile npc/cities/prontera.txt`，重新加载使用 `@loadnpc npc/cities/prontera.txt`；`@unloadnpc` 接受 NPC 名称。覆盖前确认原文件当前被加载。

数据库保留当前包模板 Header；子文件导入使用 `db/import/文件.yml`。游戏重载和 `python3 tools/deployment/manage.py refresh-custom-catalogs --directory .` 分别执行；后者只刷新物品、魔物和静态 NPC 查询资料。

升级保持 DATA_DIR/CUSTOM_DIR，使用新版整包和原密钥，不重新 initialize。停止游戏、后台写入及宿主机编辑后备份；备份含 custom-files.tar，恢复会删除备份外的额外文件。详细命令见部署包根目录 README.md。

本目录是发行模板 examples/custom，实际用户文件只放 CUSTOM_DIR。不要在打包暂存目录初始化或把运行 custom 复制回模板。
