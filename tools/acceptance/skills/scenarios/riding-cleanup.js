await command('character.skills.learn_all',{});await command('character.vitals.restore',{});const s=await snapshot();return {job:s.job_id,riding:s.riding,hp:s.hp};
