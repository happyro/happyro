const s=await snapshot();return {job:s.job_id,items:await game.evaluate(()=>window.__fourthTest.inventory.list.map(i=>({id:i.ITID,index:i.index,wear:i.WearState}))),errors:report.errors};
