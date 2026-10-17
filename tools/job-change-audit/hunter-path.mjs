// Read the actual collision grid; send only ordinary movement packets.
export function route(grid, start, goal, blocked = new Set(), radius = 0, bounds = [50,64,129,142], diagonal = false) {
 const key=(x,y)=>y*grid.width+x, queue=[start], previous=new Map([[key(...start),null]]);let end;
 for(let i=0;i<queue.length;i++){
  const [x,y]=queue[i];if(Math.abs(x-goal[0])+Math.abs(y-goal[1])<=radius){end=[x,y];break;}
  for(const [dx,dy] of (diagonal ? [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]] : [[1,0],[-1,0],[0,1],[0,-1]])){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(nx<bounds[0]||nx>bounds[2]||ny<bounds[1]||ny>bounds[3]||!grid.cells[ny]?.[nx]||blocked.has(`${nx},${ny}`)||previous.has(k))continue;if(dx&&dy&&(!grid.cells[y]?.[nx]||!grid.cells[ny]?.[x]||blocked.has(`${nx},${y}`)||blocked.has(`${x},${ny}`)))continue;previous.set(k,[x,y]);queue.push([nx,ny]);}
 }
 if(!end)throw Error(`No walking path ${start} -> ${goal}`);const result=[];for(let p=end;p;p=previous.get(key(...p)))result.push(p);return result.reverse();
}
