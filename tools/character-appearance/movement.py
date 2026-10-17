#!/usr/bin/env python3
"""Capture real server-directed eight-way walking for the current audit fixture."""
import argparse
import json
from pathlib import Path
import sys
import time
from acceptance import ROOT, control, entity, preflight, require, snapshot


def main():
    argv = sys.argv[1:]
    if not argv or argv == ['--no-color'] or '--help' in argv:
        color = lambda c, s: s if '--no-color' in argv else f'\033[{c}m{s}\033[0m'
        print('\n' + color('1;36', 'HappyRO live appearance movement capture'))
        print('\n' + color('1;33', 'Usage') + '\n  ' + color('1;32', 'python3 tools/character-appearance/movement.py --run') + ' --branch KEY --sex 0|1 --build-id ID --output work/PATH [--self-port 9351 --observer-port 9353] [--no-color]')
        print('\n' + color('1;33', 'Example') + '\n  ' + color('36', 'python3 tools/character-appearance/movement.py --run --branch knight --sex 1 --build-id BUILD --output work/character-appearance/acceptance/movement-knight') + '\n')
        return
    parser = argparse.ArgumentParser()
    parser.add_argument('--run', action='store_true', required=True)
    parser.add_argument('--branch', required=True)
    parser.add_argument('--sex', type=int, choices=[0, 1], required=True)
    parser.add_argument('--build-id', required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--self-port', type=int, default=9351)
    parser.add_argument('--observer-port', type=int, default=9353)
    parser.add_argument('--no-color', action='store_true')
    args = parser.parse_args(argv)
    args.output = args.output.resolve()
    require(any(p in args.output.parents for p in [ROOT/'work', ROOT/'artifacts']), 'Output must be under work or artifacts')
    require(not args.output.exists(), 'Do not overwrite evidence')
    _, _, _, original, initial = preflight(args)
    require(original['hp'] > 0, 'Fixture must be alive')
    origin = [original['x'], original['y']]
    # Every test leg starts at the same cell, keeping both clients within visibility.
    destinations = [[origin[0]+dx*3, origin[1]+dy*3] for dx, dy in [(0,1),(-1,1),(-1,0),(-1,-1),(0,-1),(1,-1),(1,0),(1,1)]]
    walkable = control(args.self_port, 'return await game.evaluate(destinations=>{const a=window.__fourthTest.altitude;return destinations.every(([x,y])=>Boolean(a.getCellType(x,y)&a.TYPE.WALKABLE));},'+json.dumps(destinations)+');')
    require(walkable, 'Prepare an open floor with all eight endpoints walkable')
    args.output.mkdir(parents=True)
    report = {'buildId':args.build_id, 'branch':args.branch, 'sex':args.sex, 'choice':initial['appearance'], 'origin':origin, 'steps':[], 'status':'running', 'scope':'Actual server walking and idle directions; screenshots need visual review, does not cover attack/hit/cast'}
    start_sampler = """return await game.evaluate(gid=>{
 const t=window.__fourthTest;window.__appearanceMovementSamples=[];
 clearInterval(window.__appearanceMovementTimer);
 window.__appearanceMovementTimer=setInterval(()=>{
  const e=gid===null?t.session.Entity:t.entities.get(gid);if(!e)return;
  const sample={action:e.action,frame:e.animation.frame,direction:e.direction,position:Array.from(e.position),real:e._job,render:e.renderJob,choice:e.characterAppearance,body:e.files.body.spr,bodyAction:e.files.body.act,failed:Boolean(e._characterAppearanceFailed)};
  const prev=window.__appearanceMovementSamples.at(-1);
  if(!prev||JSON.stringify(prev)!==JSON.stringify(sample))window.__appearanceMovementSamples.push(sample);
 },40);return true;
},GID);"""
    stop_sampler = 'return await game.evaluate(()=>{clearInterval(window.__appearanceMovementTimer);return window.__appearanceMovementSamples;});'
    def move(destination):
        control(args.self_port, 'await game.evaluate(dest=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest=dest;t.network.sendPacket(p);},'+json.dumps(destination)+');return true;')
        control(args.self_port, 'await game.waitForFunction(dest=>{const e=window.__fourthTest.session.Entity;return Math.abs(e.position[0]-dest[0])<0.2&&Math.abs(e.position[1]-dest[1])<0.2&&e.action===e.ACTION.IDLE;},'+json.dumps(destination)+',{timeout:10000});return true;')
    try:
        for index, dest in enumerate(destinations):
            control(args.self_port, start_sampler.replace('GID);','null);'))
            control(args.observer_port,start_sampler.replace('GID);',str(initial['gid'])+');'))
            move(dest)
            own = control(args.self_port,stop_sampler)
            other = control(args.observer_port,stop_sampler)
            require(any(s['action']==1 for s in own), 'No actual walking observed on self')
            require(any(s['action']==1 for s in other), 'No actual walking observed by observer')
            require(all(s['real']==initial['realJob'] and s['choice']==initial['appearance'] and s['render']==initial['renderJob'] for s in own+other), 'Movement changed appearance identity')
            require(all(s['body']==initial['bodySprite'] and s['bodyAction']==initial['bodyAction'] and not s['failed'] for s in own+other), 'Movement changed the verified body resources or triggered fallback')
            for side,port in [('self',args.self_port),('observer',args.observer_port)]:
                control(port,'await game.screenshot({path:'+json.dumps(str(args.output/f'{index}-{side}.png'))+'});return true;')
            report['steps'].append({'destination':dest,'self':own,'observer':other})
            (args.output/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
            move(origin)
        report['status']='passed_movement_checks_pending_visual_review'
    except Exception as error:
        report['status']='failed'
        report['error']=str(error)
        raise
    finally:
        for port in [args.self_port,args.observer_port]:
            try: control(port,stop_sampler)
            except Exception: pass
        try: move(origin)
        except Exception as error: report['restoreError']=str(error)
        report['finishedAt']=time.time()
        (args.output/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(str(args.output/'report.json'))


if __name__ == '__main__':
    main()
