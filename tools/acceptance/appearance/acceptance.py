#!/usr/bin/env python3
"""Verify deployed appearance behavior through existing isolated browser sessions."""
import argparse
import datetime
import hashlib
import json
import re
from pathlib import Path
import sys
import time
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[3]
READ_ENTITY = """return await game.evaluate(gid => {
 const t=window.__fourthTest; if(!t?.session?.Playing) throw Error('Game is not playing');
 let e=gid===null?t.session.Entity:null;
 if(gid!==null)t.entities.forEach(candidate=>{if(Number(candidate.GID)===gid)e=candidate;});
 if(!e)return null;
 const body=e.files?.body;
 return {gid:e.GID,name:e.name,realJob:e._job,renderJob:e.renderJob,sex:e._sex,
  appearance:e.characterAppearance,failed:!!e._characterAppearanceFailed,costume:e.costume,
  bodyPathsPresent:!!(body?.spr&&body?.act),bodySprite:body?.spr,bodyAction:body?.act,position:Array.from(e.position),action:e.action,
  direction:e.direction,weapon:e.weapon,shield:e.shield,robe:e.robe,
  head:e.head,headTop:e.headtop,headMid:e.headmid,headBottom:e.headbottom,
  bodyPalette:e.bodypalette};
}, GID);"""


def redact_error(message):
    # Playwright includes request headers in network-error call logs.
    return re.sub(r'(x-happyro-auth-token[^:]*:\s*)[^\s\\"<>]+', r'\1[REDACTED]', str(message), flags=re.I)


def control(port, code):
    request = urllib.request.Request(f'http://127.0.0.1:{port}', data=json.dumps({'code': code}).encode(),
                                     headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            payload = json.load(response)
    except urllib.error.HTTPError as error:
        raise RuntimeError(redact_error(error.read().decode())) from error
    if not payload.get('ok'):
        raise RuntimeError(redact_error(payload.get('error', 'Controller failed')))
    return payload.get('value')


def entity(port, gid=None):
    return control(port, READ_ENTITY.replace('GID);', json.dumps(gid) + ');'))


def snapshot(port):
    return control(port, 'return await snapshot();')


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def invariant(state):
    fields = ['job_id', 'sex', 'base_level', 'job_level', 'str', 'agi', 'vit', 'int', 'dex', 'luk',
              'status_points', 'skill_points', 'zeny', 'traits', 'max_hp', 'max_sp', 'max_ap', 'riding']
    return {key: state.get(key) for key in fields}


def change(port, appearance, via='api'):
    if via == 'api':
        return control(port, f"return await command('character.appearance.update',{{appearance:{appearance}}});")
    return control(port, f"""const trigger=game.getByRole('button',{{name:'职业外观',exact:true}});
 await trigger.click();
 await game.locator('[role="option"][data-value="{appearance}"]:visible').click();
 return {{method:'visible UI selection'}};""")


def reject_choice(port, choice, known=True):
    response = control(port, f"""await new Promise(resolve=>setTimeout(resolve,2100));
 await refreshHeaders();
 const r=await game.request.post(`${{api}}/commands`,{{headers,data:{{idempotency_key:crypto.randomUUID(),type:'character.appearance.update',payload:{{appearance:{choice}}}}}}});
 return {{status:r.status(),body:await r.json()}};""")
    if known:
        require(response['status'] == 409 and response['body'].get('error', {}).get('code') == 'appearance_job_required',
                f'Expected qualification rejection, got {response}')
    else:
        require(response['status'] == 422 and 'payload.appearance' in response['body'].get('errors', {}),
                f'Expected unknown ID validation, got {response}')
    return response


def wait_render(args, gid, choice, render_job):
    deadline = time.monotonic() + 15
    last = None
    while time.monotonic() < deadline:
        own, observer = entity(args.self_port), entity(args.observer_port, gid)
        last = {'self': own, 'observer': observer}
        if all(e and e['appearance'] == choice and e['renderJob'] == render_job and e['bodyPathsPresent'] and e['bodySprite'] == args.resource_paths[(render_job, args.sex, 'spr')] and e['bodyAction'] == args.resource_paths[(render_job, args.sex, 'act')] and not e['failed']
               for e in [own, observer]):
            return last
        time.sleep(0.25)
    raise AssertionError(f'Render synchronization timeout: expected choice={choice}, render={render_job}; actual={last}')


def preflight(args):
    require(args.self_port != args.observer_port, 'Self and observer must use different controller ports')
    source = json.loads((ROOT / 'config/character-appearance.json').read_text())
    audited = json.loads((ROOT / 'work/character-appearance/resource-audit/mapping.json').read_text())
    args.resource_paths = {(r['job'], r['sex'], r['extension']): r['path'] for r in audited['resources'] if r['valid']}
    for definition in source['branches']:
        audited_branch = next(b for b in audited['branches'] if b['branch'] == definition['key'])
        for job in definition['jobs']:
            canonical_stage = next(s for s in audited_branch['stages'] if s['stage'] == job['stage'])
            body_job = canonical_stage['mounted'] if 'mountedOf' in job else canonical_stage['job']
            for sex in audited_branch['sex']:
                for extension in ['spr', 'act']:
                    args.resource_paths[(job['id'], sex, extension)] = args.resource_paths[(body_job, sex, extension)]
    branch = next((b for b in source['branches'] if b['key'] == args.branch), None)
    require(branch is not None, 'Unknown branch')
    own, other = snapshot(args.self_port), snapshot(args.observer_port)
    for state in [own, other]:
        require(str(state.get('name', '')).startswith('Job'), 'Only dedicated Job audit fixtures are allowed')
    require(own['char_id'] != other['char_id'], 'Observer must be another character')
    require(own['map'] == other['map'], 'Observer is on a different map')
    require(own['sex'] == args.sex, 'Fixture sex differs from requested coverage')
    require(branch['sex'] == 'any' or branch['sex'] == ('male' if args.sex else 'female'), 'Branch sex mismatch')
    real = next((job for job in branch['jobs'] if job['id'] == own['job_id']), None)
    require(real is not None, 'Prepare the intended branch fixture before this run; this tool does not change jobs')
    for port in [args.self_port, args.observer_port]:
        build = control(port, "const r=await game.request.get(new URL('/applications/pwa/build-info.json',baseUrl).href); assert.equal(r.status(),200); return await r.json();")
        require(build['buildId'] == args.build_id, f'Deployed build changed: {build["buildId"]}')
    rendered = entity(args.self_port)
    require(entity(args.observer_port, rendered['gid']) is not None, 'Observer cannot currently see the tested character')
    return source, branch, real, own, rendered


def run_case(args, report):
    source, branch, real, original, rendered = preflight(args)
    report['fixture'] = {key: original[key] for key in ['char_id', 'name', 'job_id', 'sex', 'map']}
    report['sourceSha256'] = hashlib.sha256((ROOT / 'config/character-appearance.json').read_bytes()).hexdigest()
    original_choice = original['characterAppearance']['current']
    options = [option for option in branch['options'] if option['stage'] < real['stage']]
    allowed = [0] + [o['id'] for o in options]
    actual = sorted(o['id'] for o in original['characterAppearance']['options'])
    require(sorted(allowed) == actual, f'Server options differ: expected {allowed}, got {actual}')
    gid = rendered['gid']
    own_job = real.get('mountedOf', real['id'])
    own_mounted = next((j['id'] for j in branch['jobs'] if j.get('mountedOf') == own_job), None)
    active_mount = rendered.get('costume') == own_mounted and own_mounted is not None
    require(active_mount == (args.form == 'mounted'), 'Current native mount state does not match --form')
    expected_default = own_mounted if active_mount else own_job
    report['checks'] = []
    try:
        # Default first provides a real-game baseline, rather than a generated table comparing with itself.
        change(args.self_port, 0)
        wait_render(args, gid, 0, expected_default)
        before = snapshot(args.self_port)
        for option in [None] + options + [None]:
            choice = option['id'] if option else 0
            change(args.self_port, choice, args.via)
            expected = ((option['mountedJob'] or own_mounted) if active_mount else option['job']) if option else expected_default
            observed = wait_render(args, gid, choice, expected)
            after = snapshot(args.self_port)
            require(after['characterAppearance']['current'] == choice, 'Server did not retain selected appearance')
            require(invariant(before) == invariant(after), 'Appearance update changed real character state')
            require(observed['self']['realJob'] == own_job, 'Appearance changed client real job')
            require(observed['observer']['realJob'] == own_job, 'Appearance changed observer real job')
            stem = f'{args.branch}-{args.sex}-{args.form}-{len(report["checks"]):02d}-{choice}'
            for side, port in [('self', args.self_port), ('observer', args.observer_port)]:
                image = str(args.output / f'{stem}-{side}.png')
                control(port, 'await game.screenshot({path:' + json.dumps(image) + ',fullPage:false}); return true;')
            report['checks'].append({'choice': choice, 'expectedRenderJob': expected, 'observed': observed,
                                     'serverAppearance': after['characterAppearance'], 'invariant': invariant(after), 'screenshots': stem})
            save(args, report)
        cross = next(o['id'] for b in source['branches'] if b['key'] != args.branch for o in b['options'])
        for bad in [65535, cross] + [o['id'] for o in branch['options'] if o['stage'] >= real['stage']]:
            response = reject_choice(args.self_port, bad, known=bad != 65535)
            after = snapshot(args.self_port)
            require(after['characterAppearance']['current'] == 0, 'Rejected choice changed saved appearance')
            report.setdefault('negativeChecks', []).append({'choice': bad, 'response': response})
        report['status'] = 'passed_scoped_checks_only'
    finally:
        change(args.self_port, original_choice)
        require(snapshot(args.self_port)['characterAppearance']['current'] == original_choice, 'Failed to restore original choice')
        report['restoredChoice'] = original_choice
        save(args, report)


def capture(args, report):
    _, _, _, own, rendered = preflight(args)
    report['samples'] = []
    deadline = time.monotonic() + args.seconds
    while time.monotonic() < deadline:
        report['samples'].append({'at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                                  'self': entity(args.self_port), 'observer': entity(args.observer_port, rendered['gid'])})
        time.sleep(0.15)
    report['status'] = 'captured_not_visually_reviewed'
    report['fixture'] = {key: own[key] for key in ['char_id', 'name', 'job_id', 'sex', 'map']}


def save(args, report):
    (args.output / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    if not argv or '--help' in argv or '-h' in argv or argv == ['--no-color']:
        p = lambda code, value: value if '--no-color' in argv else f'\033[{code}m{value}\033[0m'
        print('\n' + p('1;36', 'HappyRO deployed character appearance acceptance') + '\n\n' + p('1;33', 'Usage'))
        print('  python3 tools/acceptance/appearance/acceptance.py ' + p('1;32', 'run|capture') + ' --branch KEY --sex 0|1 --build-id ID --output work/PATH [--self-port 9351] [--observer-port 9361] [--form walking|mounted] [--via api|ui] [--seconds 10] [--no-color]')
        print('\n' + p('1;33', 'Commands') + '\n  ' + p('1;32', 'run') + '      Verify existing fixture options, both renderers and preserved state\n  ' + p('1;32', 'capture') + '  Record live actions while native game actions are performed elsewhere')
        print('\n' + p('1;33', 'Example') + '\n' + p('36', '  python3 tools/acceptance/appearance/acceptance.py run --branch knight --sex 1 --build-id BUILD --output work/character-appearance/acceptance/knight-male') + '\n')
        return 0
    parser = argparse.ArgumentParser()
    parser.add_argument('command', choices=['run', 'capture'])
    parser.add_argument('--branch', required=True)
    parser.add_argument('--sex', type=int, choices=[0, 1], required=True)
    parser.add_argument('--build-id', required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--self-port', type=int, default=9351)
    parser.add_argument('--observer-port', type=int, default=9361)
    parser.add_argument('--form', choices=['walking', 'mounted'], default='walking')
    parser.add_argument('--via', choices=['api', 'ui'], default='api')
    parser.add_argument('--seconds', type=int, default=10)
    parser.add_argument('--no-color', action='store_true')
    args = parser.parse_args(argv)
    args.output = args.output.resolve()
    require(any(parent in args.output.parents for parent in [ROOT / 'work', ROOT / 'artifacts']), 'Evidence must be under work/ or artifacts/')
    require(1 <= args.seconds <= 60, 'Capture seconds must be 1..60')
    require(not args.output.exists(), 'Use a new output directory; do not overwrite prior evidence')
    args.output.mkdir(parents=True)
    report = {'startedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'buildId': args.build_id,
              'branch': args.branch, 'sex': args.sex, 'form': args.form, 'via': args.via,
              'status': 'running', 'unverified': ['visual correctness of actions/attachments/effects', 'job skill and equipment eligibility',
              'relogin/map change/death', 'real iOS/iPadOS devices', 'resource failure/timeout callbacks', 'mount transition and restoration',
              'stage/sex rejection beyond cross-branch rejection', 'previews']}
    try:
        (run_case if args.command == 'run' else capture)(args, report)
    except Exception as error:
        report['status'] = 'failed'
        report['error'] = str(error)
        raise
    finally:
        report['finishedAt'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
        save(args, report)
    print(f'{report["status"]}: {args.output / "report.json"}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
