const s=await snapshot();return {job:s.job_id,jobs:s.jobs.filter(j=>JSON.stringify(j).includes('十字')||JSON.stringify(j).includes('暗影')),sent:await game.evaluate(()=>window.__audit.sent)};
