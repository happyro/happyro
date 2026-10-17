const result=await live.cast('SA_DISPELL',{target:{id:2000000},wait:2000});await live.partner("await command('character.vitals.restore',{});return true;");return result;
