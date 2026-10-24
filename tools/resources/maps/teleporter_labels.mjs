/** Update displayed choices while preserving Pick destinations and coordinates. */
export function updateTeleporterLabels(script, maps) {
const targets=Object.fromEntries([...script.matchAll(/^T(\d+):([\s\S]*?)(?=^T\d+:|\/\/ -)/gm)].map(([,label,body])=>[label,body.match(/\bGo\("([^"\n]+)"/)?.[1]]));

script=script.replace(/"([^"]*)",T(\d+)/g,(all,name,label)=>maps[targets[label]]?JSON.stringify(maps[targets[label]].displayName)+',T'+label:all);
script=script.replace(/Disp\("([^"\n]*)"(?:,\s*(\d+)\s*,\s*(\d+))?\);(\s*Pick\(([^;\n]*)\);)/g,(all,text,first,last,pick,argsRaw)=>{
 const args=[...argsRaw.matchAll(/"([^"\n]*)"|(-?\d+)/g)].map(m=>m[1]!==undefined?m[1]:Number(m[2]));
 const oldLabels=first===undefined?text.split(':'):Array.from({length:Number(last)-Number(first)+1},(_,i)=>text+' '+(Number(first)+i));
 const ids=args[0]===''?args.slice(1):oldLabels.map((_,i)=>args[0]+String(i+1-(args[1]||0)).padStart(2,'0'));
 if(new Set(ids).size!==ids.length)return all; // Castle choices on a shared outdoor map retain castle names.
 if(ids.length!==oldLabels.length)throw Error('Menu length mismatch');
 let labels=ids.map((id,i)=>maps[id]?.displayName.replaceAll(':','：')||oldLabels[i]);
 const counts=new Map(labels.map(x=>[x,labels.filter(y=>x===y).length]));
 labels=labels.map((label,i)=>counts.get(label)>1?`${label}（${ids[i]}）`:label);

 return `Disp(${JSON.stringify(labels.join(':'))});${pick}`;
});
return script;
}
