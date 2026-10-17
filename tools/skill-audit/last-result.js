const r=live.results.at(-1);return {name:r.name,chat:r.observed.chat,packets:r.observed.packets.filter(p=>!/PAR_CHANGE/.test(p.name))};
