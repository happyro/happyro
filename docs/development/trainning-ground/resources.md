# 资源与安装

## 来源与收录边界

地图主体来自 Gravity kRO 2025-10-15 官方补丁，模型和贴图依赖还涉及 2021、2022、2023、2024 年补丁。来源明细见 [assets/sources.json](assets/sources.json)，逐个文件均有长度和 SHA-256。

原始获取使用 HTTP 分段读取官方 GPF，再提取所需文件。本目录的“原始资源”指未修改内容的官方资源文件；不是完整 GPF 容器。六个完整 GPF 合计 210,532,828 字节（约 200.78 MiB），未收录其完整内容，也没有声称核验完整 GPF 的 SHA-256。

| 官方 GPF | 大小 |
| --- | ---: |
| `2021-11-17_live_data_493_498_1636621550.gpf` | 114.26 MiB |
| `2022-09-28_live_data_1043_1043_1663831766.gpf` | 48.07 MiB |
| `2023-08-02_live_data_1433_1440_1690420988.gpf` | 21.05 MiB |
| `2024-05-16_live_data_1981_1982_1715224936.gpf` | 1.76 MiB |
| `2025-10-15_live_client_2799_2800_1760061430.gpf` | 15.64 MiB |
| `2025-10-15_live_client_2812_2812_1760510532.gpf` | 1,765 字节 |

以上完整包大小核对于 2026-10-23。官方补丁列表和每个下载地址均保存在来源 JSON 中。

## 仓库内附件

| 路径 | 内容 | 大小 |
| --- | --- | ---: |
| [training-maps.zip](assets/training-maps.zip) | 122 个资源文件及随包清单、说明 | 7,701,173 字节，约 7.34 MiB |
| [originals/data/](assets/originals/data/) | 72 个可安装补充文件 | 16,323,371 字节，约 15.57 MiB |
| [originals/reference-lub/](assets/originals/reference-lub/) | 官方 `NPCIdentity.lub`、`jobName.lub` | 678,056 字节，约 0.65 MiB |
| [sources.json](assets/sources.json) | 附件和官方来源信息、逐文件 SHA-256 | 小型 JSON |

72 个补充文件由地图及场景依赖 46 个、假人 SPR/ACT 26 个组成。ZIP 还带有 50 个现有 2021 运行资源的依赖副本，便于独立核对。ZIP 和原始资源都按本专题要求收录；两份内容有意重复，以分别保留可交付包和可检查的原始文件。

两个 LUB 只用于核对 143 个假人的官方外观映射，不应整体覆盖现有客户端的 NPC 身份和职业名称文件。当前外观映射、中文名称及回归测试在客户端仓库维护，资源包不能替代对应代码更新。

随 ZIP 保留其生成时的说明；本专题的安装步骤和最终验收结果以本文及 [verification.md](verification.md) 为准。

## 清单职责

- [inputs/manifests/training-maps.json](../../../inputs/manifests/training-maps.json)：安装器使用的权威清单，固定 72 个资源的运行路径与哈希。
- [inputs/manifests/training-dummy-identity.json](../../../inputs/manifests/training-dummy-identity.json)：两个官方 LUB 的哈希及 143 个外观映射来源。
- [assets/sources.json](assets/sources.json)：本专题收录附件的路径、来源、大小和哈希。

清单更新时应同步核对，不能只替换二进制文件。`inputs/official/` 中的已核验源材料保持不可修改。

## 校验仓库附件

在根仓库执行以下只读检查。它会检查来源 JSON 中的每个原始文件、ZIP 自身及 ZIP 内全部资源：

```bash
python3 - <<'PY'
import hashlib
import json
import zipfile
from pathlib import Path

base = Path('docs/development/trainning-ground/assets')
sources = json.loads((base / 'sources.json').read_text())
for entry in [sources['bundle'], *sources['files']]:
    data = (base / entry['path']).read_bytes()
    assert len(data) == entry['bytes'], entry['path']
    assert hashlib.sha256(data).hexdigest() == entry['sha256'], entry['path']
with zipfile.ZipFile(base / sources['bundle']['path']) as archive:
    assert archive.testzip() is None
    manifest = json.loads(archive.read('manifest.json'))
    for entry in manifest['files']:
        data = archive.read(entry['path'])
        assert len(data) == entry['bytes'], entry['path']
        assert hashlib.sha256(data).hexdigest() == entry['sha256'], entry['path']
print('All retained resources and ZIP entries verified')
PY
```

## 安装与目录更新

以下命令在根仓库执行。安装器先验证全部源文件，再向运行目录新增文件；同名不同内容会报错，安装后回读校验。重复执行时已存在且哈希一致的文件会复用。

```bash
node tools/resources/install-training-maps.mjs install \
  --source docs/development/trainning-ground/assets/originals --no-color
node tools/resources/install-training-maps.mjs verify --no-color

node tools/resources/world/generate-map-resources.mjs generate --no-color
node tools/resources/world/generate-npc-catalog.mjs generate --no-color
npm --prefix repos/happyro-client run catalog:world -- --no-color
node tools/resources/world/generate-map-catalog.mjs generate --no-color
npm --prefix repos/happyro-client run build -- --all
```

资源安装位置是 `inputs/runtime/kro-20211105/client/data/`，通过 Gateway 现有运行资源覆盖路径提供。只安装资源不需要重启游戏进程。目录生成不等于后台数据库导入；NPC 目录变更应按[服务更新流程](../../operations/services.md#修改后的更新路径)及 `scripts/client/refresh-client.sh` 中的 `catalog import` 参数同步，API 启动时读取的地图目录需重新载入。

若同时修改 NPC 脚本，应通过受支持的定向脚本重载或维护窗口部署使其生效。本次使用了两份训练场 NPC 文件的定向热重载，未重启游戏服务。构建后须核对 Gateway 提供的启动页、构建标识和文件哈希，再用无头浏览器检查真实对话、传送和重登；不能只以地图查看器渲染成功作为全部验收。

## 离线包状态

补丁安装前，本机与 `happyro-resources-20261022.tar.gz` 的三个资源目录共 37,311 个文件逐项 SHA-256 一致。之后新增了本专题的补充资源；该原始离线包没有因此自动更新。此处收录的补丁 ZIP 是资源补充包，不是完整离线部署包或新镜像发布。
