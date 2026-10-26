import {route} from './hunter-path.mjs?bounds=whole-map-v2';
export async function walk(game,snapshot,goal,radius=0,onStep){
 const ready=await snapshot();
 await game.waitForFunction(({x,y})=>{const t=window.__fourthTest,e=t.session.Entity;return t.session.Playing&&e&&Math.abs(e.position[0]-x)<=2&&Math.abs(e.position[1]-y)<=2;},{x:ready.x,y:ready.y},{timeout:60000});
 const grid=await game.evaluate(()=>{const a=window.__fourthTest.altitude;return {width:a.width,height:a.height,cells:Array.from({length:a.height},(_,y)=>Array.from({length:a.width},(_,x)=>(a.getCellType(x,y)&a.TYPE.WALKABLE)?1:0))};});
 const initialMap=(await snapshot()).map;
 const moves=[];let stalled=0;
 for(let n=0;n<150;n++){
  if(onStep)await onStep();
  const s=await snapshot();if(s.map!==initialMap)return moves;if(s.hp<=0)throw Error('Character is dead; cannot walk');if(Math.abs(s.x-goal[0])+Math.abs(s.y-goal[1])<=radius)return moves;
  const path=route(grid,[s.x,s.y],goal,new Set(),radius,[0,0,grid.width-1,grid.height-1],true);const end=Math.min(stalled ? 1 : 8,path.length-1);
  // The server can pathfind this short, collision-checked route through bends.
  const dest=path[end];await game.evaluate(dest=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest=dest;t.network.sendPacket(p);},dest);moves.push(dest);await game.waitForTimeout(end*170+100);
  const after=await snapshot();if(after.map!==s.map)return moves;
  // Native room portals can move the character far away within the same map.
  if(Math.abs(after.x-dest[0])+Math.abs(after.y-dest[1])>24)return moves;
  if(await game.locator('#NpcBox .content').isVisible())return moves;
  stalled=after.x===s.x&&after.y===s.y?stalled+1:0;if(stalled>=5)throw Error('Walking stalled at '+s.x+','+s.y);
 }
 throw Error('Walking exceeded step budget');
}
