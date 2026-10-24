# 服务端配置编码复查（2026-10-25）

在修复 4 份 NPC 脚本后，继续检查 7 个仓库的 Git 管理文件和未忽略的新文件。按文本扩展名及常规文件名检查 9,239 份文件；另检查扩展名范围外的非 UTF-8 文件，未发现额外的无 NUL 文本候选。图片、编译文件、数据库模型等二进制产物不进行文本转换；忽略目录、官方源材料不在此次扫描范围内。

新增发现并修复 5 份服务端消息配置，路径均位于 `repos/happyro-server/conf/msg_conf/`：

| 文件 | 原有混合编码 | 修复行数 |
| --- | --- | ---: |
| map_msg_frn.conf | UTF-8 / Windows-1252 | 8 |
| map_msg_por.conf | UTF-8 / Windows-1252 | 433 |
| map_msg_rus.conf | UTF-8 / Windows-1251 | 493 |
| map_msg_spn.conf | UTF-8 / Windows-1252 | 289 |
| map_msg_tha.conf | UTF-8 / Windows-874 | 506 |

共 1,729 行。保留原语言，不进行翻译。只转换已确认的旧编码行，其余 UTF-8 行保持字节不变。逐行反向编码可恢复原始字节；全文件 ASCII 字节序列一致，因此消息编号、格式参数、配置语法及换行保持不变。

泰语消息 22、25、53 的原字节恰好能解码为 UTF-8，但产生错误文字，因此另外按 Windows-874 恢复为 `Base level ลดลง.`、`Job level ลดลง.` 和 `สถานะของ '%s':`。已增加内容回归检查，避免只验证 UTF-8 合法性而漏掉此类问题。

验证：

- 原扫描范围再次检查：9,239 份文件，非法 UTF-8 为 0。
- `node --test repos/happyro-server/tests/npc-script-encoding.test.mjs`：2 项通过，覆盖 NPC 脚本与服务端配置，以及上述泰语消息。
- 根仓库与服务端 changelog 已更新，文档站 changelog 已同步。

结合前次 4 份 NPC 脚本，本轮累计修复 9 份混合编码文件。此结论不代表所有合法 UTF-8 文本中的历史乱码均已完成语义审查。本次未重启本机服务。
