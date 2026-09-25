# 本机运维工具

集中保存日常运维子命令，与 `tools/deployment/` 的构建发布工具分开。
使用 Python 3 标准库和本机 Docker CLI，目标为当前 Docker context 中的
`happyro-database` 及 HappyRO 应用容器；只接受 Unix socket 连接。

```bash
# 无参数只显示帮助；--no-color 可以放在任意位置
python3 tools/operations/manage.py
python3 tools/operations/manage.py --no-color

# 预览 happyro 账号的全部角色
python3 tools/operations/manage.py reset-characters --account happyro

# 实际清空
python3 tools/operations/manage.py reset-characters --account happyro --execute
```

账号按用户名精确匹配，不需要填写游戏密码。保留登录账号、密码、账号变量、
账号仓库和历史日志；删除角色、背包、手推车、技能、任务、邮件附件、宠物、
生命体、佣兵、精灵及摆摊数据，并清理其他角色的好友引用。
存在队伍、公会或家庭关系时拒绝执行，需先在游戏内解除关系。

执行时停止当前运行的 Admin、Web API、Map、Char、Login 容器，重新核对角色列表，
将完整 `happyro` 数据库备份至 `work/operations/backups/`，随后删除角色数据。
备份权限为 `0600`，包含账号信息，应妥善保管。成功后只启动原先运行的容器。
执行期间不要另行启动服务或运行直接写库的工具。

部分游戏表使用 MyISAM，删除无法依靠事务回滚。删除阶段失败时，工具保留停服状态
并打印备份路径；检查原因后使用该完整游戏库备份恢复，再启动服务。备份恢复会
恢复整个游戏库，而非单个账号。备份前的检查失败则恢复原先运行的容器。

验证（临时表遮蔽真实表，仅在当前数据库会话中创建测试数据）：

```bash
python3 -m unittest discover -s tools/operations -p 'test_*.py'
```
