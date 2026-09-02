# 游戏资源工具

`item_catalog/` 是 HappyRO Admin 物品快照的独立生成工程。它统一管理客户端与服务端两条生成流水线，生成文件由后台使用，但生成逻辑和跨仓库来源校验归根仓库维护。

## 结构

```text
item_catalog/
├── main.py       # 薄命令入口
├── cli.py        # 参数、帮助和流程选择
├── service.py    # 可注入读写适配器的应用服务
├── client.py     # 客户端集合及双语名称合并规则
├── assets.py     # 客户端图标映射与说明索引规则
├── server.py     # rAthena 双语服务端快照规则
├── storage.py    # JSON、YAML、Git 和原子写出适配器
├── errors.py     # 领域错误
└── tests/        # 单元测试
```

`client.py` 和 `server.py` 只处理内存数据，不读取文件或调用 Git；`service.py` 通过参数注入读写函数，因此核心流程可以独立 Mock 和测试。`storage.py` 是唯一执行文件系统及 Git I/O 的模块。

## 使用

不带参数运行只显示帮助：

```bash
python3 tools/resources/item_catalog/main.py
```

生成仅客户端快照：

```bash
python3 tools/resources/item_catalog/main.py client
```

该命令读取 `docs/translation/zh-cn/kro-20211105/merged/files/lub/itemInfo_true.json` 与后台 Renewal 快照，一次生成 `client-kro-20211105.json`、`icon-map.json` 和 `descriptions.json`。客户端物品 ID 必须全部命中服务端快照，中文、英文名称和说明不能为空；空资源名允许存在，但不会写入图标映射。

生成 Renewal 与 Pre-Renewal 服务端快照：

```bash
python3 tools/resources/item_catalog/main.py server
```

该命令读取当前 `repos/happyro-server/db/` 中文数据，并通过 Git 读取英文基线 `2fe6ab3dc4d8`，生成后台的 `renewal.json` 和 `pre-renewal.json`。两个子命令都支持显式覆盖输入和输出路径；完整选项通过对应子命令的 `--help` 查看。

## 测试

```bash
python3 -m unittest discover tools/resources/item_catalog/tests
```
