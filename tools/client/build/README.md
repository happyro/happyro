# LUB 回编译工具

本目录将 kRO 2021-11-05 翻译流程合并出的规范化 JSON 重新生成为 Lua 源码，编译成客户端可加载的 LUB，并执行语义回环校验。Lua 5.0 和 Lua 5.1 使用独立入口及独立目标清单：

```text
build/
├── lua50/main.py   # System/MsgString.lub
├── lua51/main.py   # System 下的 10 个 Lua 5.1 翻译目标
└── common.py       # JSON 序列化、工具链准备和公共校验
```

工具不会修改 `inputs/` 中的官方文件，也不会写回翻译工作区。默认输入是正式合并目录 `docs/translation/zh-cn/kro-20211105/merged/files/lub/`，默认输出是 `artifacts/client/lub/`。正式合并结果尚未发布时，必须用 `--input` 明确指定已复核的临时合并目录。

## 准备编译器

普通 64 位系统 `luac` 生成的字节码与官方客户端不兼容。两个准备命令分别下载 Lua 官方源码、校验 SHA-256，并构建使用 4 字节 `size_t` 和 `Instruction` 的工具链：

```bash
python3 tools/client/build/lua50/main.py prepare
python3 tools/client/build/lua51/main.py prepare
```

Lua 5.0 固定使用 5.0.2，Lua 5.1 固定使用 5.1.5。下载和构建结果只放在 `work/lub-toolchains/`。离线环境可以在 `build` 时通过 `--lua` 和 `--luac` 指向已经准备好的兼容程序；工具仍会先编译探针并检查完整字节码头，错误版本或错误 ABI 会立即失败。

## 构建

分别运行两个版本的构建器，输出到同一个资源根目录：

```bash
python3 tools/client/build/lua50/main.py build \
  --input work/translation-merge/<batch>/kro-20211105/merged/files/lub \
  --output artifacts/client/lub

python3 tools/client/build/lua51/main.py build \
  --input work/translation-merge/<batch>/kro-20211105/merged/files/lub \
  --output artifacts/client/lub
```

也可以在缺少默认工具链时加 `--prepare`。`--keep-source` 会在 LUB 旁保留生成的 `.lua`，用于人工排查；默认只保留 LUB 和两个版本各自的 `manifest-luaXX.tsv`。

每个目标按以下顺序处理：

1. 读取并校验对应的合并 JSON；
2. 按客户端原文件的全局变量和顶层结构生成 Lua；
3. 将中文字符串编码为 UTF-8 字节，并使用定长十进制转义写入 ASCII Lua 源码；
4. 使用目标 ABI 的 `luac -s` 生成 LUB，并检查字节码头；
5. 使用同 ABI 的 Lua 加载 LUB，将运行时表与输入 JSON 逐键、逐类型、逐值比较；
6. 写出 SHA-256 和验证状态清单。

这里验证的是 LUB 中字符串字节为 UTF-8。最终投放前仍需确认目标客户端字体和文本渲染链路支持 UTF-8；编译成功本身不能让 CP949 原生客户端自动显示简体中文。

命令不带参数时只显示帮助，不准备工具链，也不构建文件。使用 `--no-color` 可关闭帮助中的 ANSI 颜色。
