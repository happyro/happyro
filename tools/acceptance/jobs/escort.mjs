// Protect the native trial summon using ordinary character skills and consumables.
export function escortGuard(game,proof){
 let lastPotion=0;
 return async()=>{
  if(Date.now()-lastPotion>1200){
   const used=await game.evaluate(()=>{const t=window.__fourthTest,i=t.inventory.getItemById(12184);if(!i)return false;t.inventory.useItem(i);return true;});
   if(used){proof.potionUseRequests=(proof.potionUseRequests||0)+1;lastPotion=Date.now();}
  }
  const targets=await game.evaluate(()=>{const t=window.__fourthTest,a=[],p=t.session.Entity.position;t.entities.forEach(e=>{if(e.objecttype===5&&e.life.hp!==0&&e.action!==e.ACTION.DIE&&!e.remove_tick&&Math.abs(e.position[0]-p[0])<=7&&Math.abs(e.position[1]-p[1])<=7)a.push({id:e.GID,job:e.job});});return a.slice(0,3);});
  for(const target of targets){await game.evaluate(id=>window.__fourthTest.targeting.onUseSkillToId(156,1,id),target.id);(proof.attacks||=[]).push(target);await game.waitForTimeout(450);}
 };
}
