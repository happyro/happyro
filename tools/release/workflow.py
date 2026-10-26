"""Build a new owned offline package; rebuilding explicitly replaces local outputs."""
from tools.deployment import progress
import argparse
import os
from pathlib import Path
import re
import subprocess
import sys
import zipfile

from tools.deployment.bundle import verify
from tools.deployment.offline import digest
from tools.release import package, sources, split, operations
from tools.release.lifecycle import Layout, LOCK_ENV, clean_locked, version_lock


@progress.operation('发布预检与同步远程引用')
def preflight(workspace, requested_version):
    actual = sources.version(workspace)
    if requested_version != actual:
        raise ValueError(f'Requested {requested_version}, but deploy/docker/VERSION is {actual}; '
                         'select the matching source checkout and VERSION before rebuilding')
    if sys.version_info < (3, 11):
        raise ValueError('Release tooling requires Python 3.11+')
    source_state = sources.snapshot(workspace)
    for repo in sources.REPOS:
        # Fetch only: never discard, merge, commit or push local work.
        subprocess.run(['git', '-C', str(workspace / repo), 'fetch', 'origin', 'main'], check=True)
        result = subprocess.run(['git', '-C', str(workspace / repo), 'merge-base', '--is-ancestor',
                                 'origin/main', 'HEAD'])
        if result.returncode:
            raise ValueError(f'{repo} does not contain latest origin/main; synchronize before rebuilding')
    if (workspace / 'configs/Config.happyro.js').read_text() != (
            workspace / 'repos/happyro-client/applications/pwa/Config.happyro.js').read_text():
        raise ValueError('Root and Client PWA configurations differ')
    package.resource_inputs(workspace)
    for command in (['skopeo', '--version'], ['docker', 'compose', 'version']):
        subprocess.run(command, check=True)
    builder = subprocess.check_output(['docker', 'buildx', 'inspect'], text=True)
    if not {'linux/amd64', 'linux/arm64'} <= set(re.findall(r'linux/(?:amd64|arm64)\b', builder)):
        raise ValueError('Buildx builder must support linux/amd64 and linux/arm64')
    if re.search(r'^Driver:\s+docker\s*$', builder, re.M):
        storage = subprocess.check_output(['docker', 'info', '--format', '{{json .DriverStatus}}'], text=True)
        if 'io.containerd.snapshotter.v1' not in storage:
            raise ValueError('Docker builder needs the containerd image store for OCI export; select a docker-container builder')
    elif not re.search(r'^Driver:\s+(docker-container|remote|kubernetes)\s*$', builder, re.M):
        raise ValueError('Unrecognized Buildx driver; verify OCI export support before release')
    subprocess.run([sys.executable, str(workspace / 'tools/resources/navigation/review.py'),
                    'check', '--root', str(workspace), '--no-color'], check=True)
    if sources.snapshot(workspace) != source_state or sources.version(workspace) != actual:
        raise ValueError('Source state changed during preflight')
    return source_state


@progress.operation('运行发布子阶段')
def run_phase(layout, phase, descriptor, log_path):
    script = Path(__file__).with_name('release.py')
    command = [sys.executable, str(script), 'stage', phase, '--workspace', str(layout.root),
               '--version', layout.version, '--no-color']
    environment = {**os.environ, LOCK_ENV: str(descriptor)}
    # The worker and its OCI writers inherit the lock. Killing just this parent
    # does not make a still-running child look safe to clean.
    with log_path.open('x') as log:
        process = subprocess.Popen(command, cwd=layout.root, env=environment,
                                   pass_fds=(descriptor,), stdout=subprocess.PIPE,
                                   stderr=subprocess.STDOUT, text=True, errors='replace')
        try:
            for line in process.stdout:
                log.write(line)
                log.flush()
                print(line, end='', flush=True)
            if process.wait():
                raise subprocess.CalledProcessError(process.returncode, command)
        except BaseException:
            if process.poll() is None:
                process.terminate()
                try:
                    process.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait()
            raise
        finally:
            process.stdout.close()


@progress.operation('执行完整发布流程')
def execute(args, rebuild=False):
    workspace = args.workspace.resolve()
    # Validate the requested version before acquiring/creating any state.
    actual = sources.version(workspace)
    requested = args.version or actual
    if requested != actual:
        raise ValueError(f'Requested {requested}, but deploy/docker/VERSION is {actual}; no cleanup was performed')
    layout = Layout(workspace, requested)
    with version_lock(layout) as descriptor:
        if not rebuild and layout.artifacts.exists():
            raise ValueError(f'{layout.artifacts} already exists; use offline create --rebuild to clean and replace this version')
        # Complete non-destructive checks before replacing a previous good ZIP.
        source_state = preflight(workspace, requested)
        if rebuild:
            clean_locked(layout, include_package=True, execute=True)
        state, log_dir = layout.create(source_state)
        try:
            for phase in ('prepare', 'build', 'package'):
                complete_phase(layout, state, phase, descriptor, log_dir)
            if getattr(args, 'split', False):
                state.update(status='running', stage='split')
                layout.save(state)
                split.split_locked(layout)
                state.update(status='packaged', stage=None)
                layout.save(state)
            progress.message(f'Offline ZIP ready: {layout.zip}\nSHA-256: {state["package"]["sha256"]}')
            if getattr(args, 'push', False):
                evidence = log_dir / 'dockerhub'
                operations.publish_locked(layout, state, descriptor, evidence)
            else:
                progress.message('Docker Hub push skipped (default); use --push or offline push explicitly.')
            progress.message('Packaging and publication do not replace local runtime acceptance.')
        except BaseException as error:
            state['status'] = 'interrupted' if isinstance(error, (KeyboardInterrupt, SystemExit)) else 'failed'
            # Do not persist exception text: commands may contain environment-specific data.
            state['error_type'] = type(error).__name__
            layout.save(state)
            raise
        return layout.zip


def create(args):
    return execute(args, rebuild=args.rebuild)


def check_sources(layout, state):
    if sources.version(layout.root) != layout.version or sources.snapshot(layout.root) != state['sources']:
        raise ValueError('Source state changed between phases; refuse to mix release batches')


def complete_phase(layout, state, phase, descriptor, log_dir):
    """One transition used by both full orchestration and explicit stage commands."""
    check_sources(layout, state)
    state.update(status='running', stage=phase)
    layout.save(state)
    progress.message(f'[{layout.version}] {phase}; log: {log_dir / (phase + ".log")}')
    run_phase(layout, phase, descriptor, log_dir / f'{phase}.log')
    if phase == 'prepare':
        verify(argparse.Namespace(directory=layout.bundle, prepared=True))
    if phase == 'package':
        state['stage'] = 'verify'
        layout.save(state)
        verify(argparse.Namespace(directory=layout.bundle, prepared=False))
        with zipfile.ZipFile(layout.zip) as archive:
            broken = archive.testzip()
            if broken:
                raise ValueError(f'Final ZIP failed CRC verification: {broken}')
        state['package'] = {'path': layout.zip.relative_to(layout.root).as_posix(),
                            'size': layout.zip.stat().st_size, 'sha256': digest(layout.zip)}
    check_sources(layout, state)
    state.update(status={'prepare': 'prepared', 'build': 'built', 'package': 'packaged'}[phase], stage=None)
    layout.save(state)
