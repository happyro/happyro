"""Split a verified managed ZIP without changing any deployment payload bytes."""
from tools.deployment import progress
import copy
import hashlib
import json
from pathlib import Path, PurePosixPath
import shutil
import stat
import tempfile
import zipfile

from tools.deployment.offline import digest
from tools.release.lifecycle import Layout, version_lock


def readme(layout, source_hash, run_id):
    name = f'happyro-{layout.version}'
    return f'''# HappyRO 拆分包合并安装说明

版本：{layout.version}
构建批次：{run_id}
来源完整包：{name}.zip
来源完整包 SHA-256：{source_hash}

## 必须同时取得两份包

- {name}-runtimes.zip：resources/ 运行资源。
- {name}-images.zip：双架构镜像、部署文件和完整部署 README。

两包必须来自相同版本、相同构建批次；外部 README 与两份包中的本说明内容必须一致。
不能单独部署其中一包。两份包使用相同的 {name}/ 根目录。
发布目录中的 {name}-split.json 记录两份 ZIP 和外部 README 的大小与 SHA-256，可用于传输后核验。

## 合并并校验

在一个新的空目录中解压两份 ZIP，允许覆盖内容相同的本说明文件：

```bash
unzip {name}-runtimes.zip
```

```bash
unzip -o {name}-images.zip
```

```bash
cd {name}
```

```bash
python3 tools/deployment/manage.py verify --directory .
```

Windows 可使用支持 ZIP64 的解压工具将两包解压到同一目录，合并同名文件夹。
不要分别解压到两个互不相同的版本目录，也不要覆盖正在运行的部署。
校验失败时停止安装，重新取得同批次的两份包。

## 初始化与启动

部署机器需要 Python 3.11+、Docker 和 Docker Compose；无需构建源码。
校验通过后，先阅读当前目录中的 README.md（完整部署手册），再执行：

```bash
python3 tools/deployment/manage.py import-images --directory .
```

```bash
python3 tools/deployment/manage.py initialize --directory .
```

按 README.md 配置 .env 中的地址、端口和持久化目录，确认后启动：

```bash
python3 tools/deployment/manage.py deploy --directory .
```

升级已有部署须遵循 README.md 的备份与升级流程，不可直接套用全新初始化步骤。
本说明位于归档外层，不改变部署目录中的文件及其校验清单。
'''.encode('utf-8')


def entry_digest(archive, info):
    value = hashlib.sha256()
    with archive.open(info) as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b''):
            value.update(chunk)
    return value.hexdigest()


def inventory(archive, prefix):
    result = {}
    for info in archive.infolist():
        path = PurePosixPath(info.filename)
        mode = info.external_attr >> 16
        if (info.filename in result or '\\' in info.filename or path.is_absolute()
                or '..' in path.parts or not info.filename.startswith(prefix)
                or path.as_posix() != info.filename.rstrip('/')
                or (stat.S_IFMT(mode) not in (0, stat.S_IFDIR, stat.S_IFREG))):
            raise ValueError(f'Unsafe or duplicate ZIP member: {info.filename}')
        result[info.filename] = (info.is_dir(), info.file_size, entry_digest(archive, info))
    return result


@progress.operation('生成拆分包并校验一致性')
def split_locked(layout):
    """Caller holds the version lock; only an already verified full ZIP is accepted."""
    state = layout.read_state()
    recorded = (state or {}).get('package', {})
    if (recorded.get('path') != layout.zip.relative_to(layout.root).as_posix()
            or not layout.zip.is_file() or layout.zip.is_symlink()
            or recorded.get('size') != layout.zip.stat().st_size
            or recorded.get('sha256') != digest(layout.zip)):
        raise ValueError('Split requires the unchanged complete ZIP recorded by offline create or stage package')
    targets = layout.split_paths
    if any(path.exists() or path.is_symlink() for path in targets):
        raise ValueError('Split outputs already exist; use offline create --rebuild --split to replace this version')
    prefix = f'happyro-{layout.version}/'
    note_name = targets[3].name
    note = readme(layout, recorded['sha256'], state['run_id'])
    published = []
    # Staging is owned by the same version and cleaned after failure or rebuild.
    with tempfile.TemporaryDirectory(prefix='.split-', suffix='.tmp', dir=layout.artifacts) as directory:
        temporary = [Path(directory) / path.name for path in targets]
        try:
            with zipfile.ZipFile(layout.zip) as source:
                expected = inventory(source, prefix)
                release = json.loads(source.read(prefix + 'release-manifest.json'))
                if release.get('status') != 'offline-ready' or release.get('version') != layout.version:
                    raise ValueError('Only an offline-ready ZIP of the requested version can be split')
                if not any(name.startswith(prefix + 'resources/') for name in expected):
                    raise ValueError('Complete ZIP is missing resources')
                with zipfile.ZipFile(temporary[0], 'w', compression=zipfile.ZIP_DEFLATED, allowZip64=True) as runtime, \
                     zipfile.ZipFile(temporary[1], 'w', compression=zipfile.ZIP_DEFLATED, allowZip64=True) as images:
                    for target in (runtime, images):
                        target.writestr(note_name, note)
                    for info in source.infolist():
                        target = runtime if info.filename.startswith(prefix + 'resources/') else images
                        # Copy metadata and stream large image/GRF files with ZIP64.
                        with source.open(info) as reader, target.open(copy.copy(info), 'w', force_zip64=True) as writer:
                            shutil.copyfileobj(reader, writer, length=1024 * 1024)
            actual = {}
            for path in temporary[:2]:
                with zipfile.ZipFile(path) as archive:
                    if archive.read(note_name) != note:
                        raise ValueError('Split README differs between archives')
                    # The outer README is the sole addition; payload entries are disjoint.
                    payload = {name: value for name, value in inventory(archive, '').items() if name != note_name}
                    if actual.keys() & payload.keys():
                        raise ValueError('Split payload entries overlap')
                    actual.update(payload)
            if actual != expected or digest(layout.zip) != recorded['sha256']:
                raise ValueError('Split round-trip verification failed')
            temporary[3].write_bytes(note)
            report = {'schema': 2, 'version': layout.version, 'run_id': state['run_id'],
                      'source': recorded, 'payload_entries': len(expected),
                      'readme': {'name': note_name, 'size': len(note),
                                 'sha256': digest(temporary[3])},
                      'archives': {path.name: {'size': temp.stat().st_size, 'sha256': digest(temp)}
                                   for path, temp in zip(targets[:2], temporary[:2])}}
            temporary[2].write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
            for index in (0, 1, 3, 2):
                temp, target = temporary[index], targets[index]
                temp.replace(target)
                published.append(target)
        except BaseException:
            for path in published:
                path.unlink(missing_ok=True)
            raise
    for path in targets:
        progress.message(f'Split delivery: {path}')
    return targets


def split(args):
    layout = Layout(args.workspace, args.version)
    with version_lock(layout):
        return split_locked(layout)
