await command('character.progression.update',{job_id:2,base_level:99,job_level:50});await command('character.vitals.restore',{});return {job:(await snapshot()).job_id};
