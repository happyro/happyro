const before=await snapshot();
await live.cast('MG_ENERGYCOAT',{restore:false,wait:6500});
const casts=[];for(let i=0;i<1;i++)casts.push(await live.cast('PF_HPCONVERSION',{restore:false,wait:1500}));
const after=await snapshot();await fs.writeFile('artifacts/skill-live/heal-target-preparation.json',JSON.stringify({before:{hp:before.hp,sp:before.sp},after:{hp:after.hp,sp:after.sp},casts},null,2));
return {before:{hp:before.hp,sp:before.sp},after:{hp:after.hp,sp:after.sp}};
