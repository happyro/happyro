#!/usr/bin/env python3
"""Explicit, two-phase multi-platform image build and publication."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys

NAMES = ['gateway', 'server', 'admin', 'database']


def run(*args):
    subprocess.run(args, check=True)


def inspect(reference, authfile=None):
    args = ['skopeo', 'inspect', '--raw']
    if authfile:
        args += ['--authfile', str(authfile)]
    raw = subprocess.check_output([*args, reference])
    manifest = json.loads(raw)
    platforms = {f'{m.get("platform", {}).get("os")}/{m.get("platform", {}).get("architecture")}' for m in manifest.get('manifests', [])}
    if not {'linux/amd64', 'linux/arm64'} <= platforms:
        raise ValueError(f'{reference} must contain both amd64 and arm64')
    return sorted(platforms)


def main():
    argv = [arg for arg in sys.argv[1:] if arg != '--no-color']
    if not argv or argv == ['--help']:
        c = lambda code, s: s if '--no-color' in sys.argv else f'\033[{code}m{s}\033[0m'
        print('\n' + c('1;36', 'HappyRO image release') + '\n\n' + c('1;33', 'Commands'))
        print(c('1;32', '  build | push') + '\n\n' + c('1;33', 'Examples'))
        print(c('36', '  python3 tools/deployment/images.py build --workspace . --output artifacts/images/v0.2.0 --version v0.2.0'))
        print(c('36', '  python3 tools/deployment/images.py push --output artifacts/images/v0.2.0 --bundle artifacts/deployment/v0.2.0') + '\n')
        return
    parser = argparse.ArgumentParser()
    parser.add_argument('command', choices=['build', 'push'])
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--workspace', type=Path)
    parser.add_argument('--version')
    parser.add_argument('--namespace', default='kugarocks')
    parser.add_argument('--bundle', type=Path)
    parser.add_argument('--authfile', type=Path, default=Path.home() / '.docker/config.json')
    args = parser.parse_args(argv)
    output = args.output.resolve()
    if args.command == 'build':
        if not args.workspace or not re.fullmatch(r'v\d+\.\d+\.\d+', args.version or ''):
            raise ValueError('build requires --workspace and --version vMAJOR.MINOR.PATCH')
        run('skopeo', '--version')
        run('docker', 'buildx', 'inspect')
        if output.exists():
            raise ValueError('Build output must be a new directory')
        root = args.workspace.resolve()
        commits = {}
        for repo in ['.', 'repos/happyro-client', 'repos/happyro-gateway', 'repos/happyro-server', 'repos/happyro-admin']:
            if subprocess.check_output(['git','-C',str(root/repo),'status','--porcelain']).strip():
                raise ValueError(f'Dirty repository: {repo}')
            commits[repo] = subprocess.check_output(['git','-C',str(root/repo),'rev-parse','HEAD'],text=True).strip()
        output.mkdir(parents=True)
        state = {'version': args.version, 'commits': commits, 'images': {}}
        for name in NAMES:
            archive = output / f'{name}.tar'
            run('docker','buildx','build','--no-cache','--pull','--platform','linux/amd64,linux/arm64','--file',str(root/f'deploy/docker/{name}/Dockerfile'),'--output',f'type=oci,dest={archive}',str(root))
            state['images'][name] = {'sha256': hashlib.sha256(archive.read_bytes()).hexdigest(), 'platforms': inspect(f'oci-archive:{archive}')}
        (output/'built.json').write_text(json.dumps(state, indent=2)+'\n')
        print('All four images built and architectures checked. Nothing was pushed.')
    else:
        if not args.bundle or not re.fullmatch(r'[a-z0-9]+(?:[._-][a-z0-9]+)*', args.namespace):
            raise ValueError('push requires --bundle and a valid namespace')
        state = json.loads((output/'built.json').read_text())
        bundle = args.bundle.resolve()
        release = json.loads((bundle/'release-manifest.json').read_text())
        if release.get('dirty_repositories'):
            raise ValueError('Prepare the release bundle again from clean, committed sources')
        if release['version'] != state['version'] or release['commits'] != state['commits']:
            raise ValueError('Bundle and built images must come from the same version and commits')
        for name in NAMES:
            archive = output / f'{name}.tar'
            if hashlib.sha256(archive.read_bytes()).hexdigest() != state['images'][name]['sha256'] or inspect(f'oci-archive:{archive}') != state['images'][name]['platforms']:
                raise ValueError(f'Changed OCI artifact: {name}')
        images = {}
        # All local artifacts are verified before the first external write.
        for name in NAMES:
            image = f'{args.namespace}/happyro-{name}'
            reference = f'{image}:{state["version"]}'
            run('skopeo','copy','--all','--preserve-digests','--authfile',str(args.authfile),f'oci-archive:{output}/{name}.tar',f'docker://{reference}')
            platforms = inspect(f'docker://{reference}', args.authfile)
            if platforms != state['images'][name]['platforms']:
                raise ValueError(f'Remote platforms differ: {reference}')
            digest = subprocess.check_output(['skopeo','inspect','--authfile',str(args.authfile),'--format','{{.Digest}}',f'docker://{reference}'],text=True).strip()
            images[name] = f'{image}@{digest}'
        for name in NAMES:
            run('skopeo','copy','--all','--preserve-digests','--authfile',str(args.authfile),f'docker://{images[name]}',f'docker://{args.namespace}/happyro-{name}:latest')
            if inspect(f'docker://{args.namespace}/happyro-{name}:latest', args.authfile) != state['images'][name]['platforms']:
                raise ValueError(f'latest verification failed: {name}')
        release.update(images=images, status='published')
        (bundle/'release-manifest.json').write_text(json.dumps(release,indent=2)+'\n')
        env = (bundle/'.env.example').read_text()
        for name, reference in images.items():
            key = name.upper() + '_IMAGE'
            env = re.sub(rf'^{key}=.*$', f'{key}={reference}', env, flags=re.M)
        (bundle/'.env.example').write_text(env)
        print('All remote images verified; bundle now pins digests. No deployment was performed.')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        sys.exit(str(error))
