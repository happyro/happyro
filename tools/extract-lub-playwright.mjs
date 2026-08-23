import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const client = path.join(root, 'repos/happyro-client');
const source = path.join(root, 'inputs/runtime/kro-20211105/client/System');
const out = path.join(root, 'work/lub-reextract');
const targets = [
  ['achievement_list.lub', 'achievement_tbl', 'achievement_list.json'],
  ['OngoingQuestInfoList.lub', 'QuestInfoList', 'OngoingQuestInfoList.json'],
  ['OngoingQuestInfoList_True.lub', 'QuestInfoList', 'OngoingQuestInfoList_True.json'],
  ['itemInfo_true.lub', 'ItemInfo', 'itemInfo_true.json'],
  ['RecommendedQuestInfoList_True.lub', 'RecommendedQuestInfoList', 'RecommendedQuestInfoList_True.json'],
  ['RecommendedQuestInfoList.lub', 'RecommendedQuestInfoList', 'RecommendedQuestInfoList.json'],
  ['LuaFiles514/MsgString.lub', 'SetupMSG', 'MsgString.json'],
  ['LuaFiles514/OptionInfo.lub', 'OptionInfoList', 'LuaFiles514_OptionInfo.json'],
  ['OptionInfo.lub', 'OptionInfoList', 'OptionInfo.json'],
  ['mapInfo_true.lub', 'mapTbl', 'mapInfo_true.json'],
  ['Towninfo.lub', 'mapNPCInfoTable', 'Towninfo.json'],
  ['PrivateAirplane_true.lub', 'StartableMap', 'PrivateAirplane_true.json'],
  ['PetEvolutionCln.lub', '__pet_callbacks__', 'PetEvolutionCln.json'],
  ['PetEvolutionCln_true.lub', '__pet_callbacks__', 'PetEvolutionCln_true.json'],
  ['CheckAttendance.lub', '__attendance_callbacks__', 'CheckAttendance.json'],
  ['ShadowTable.lub', 'jobtbl', 'ShadowTable.json'],
  ['monster_size_effect.lub', 'EFFECT', 'monster_size_effect.json'],
  ['monster_size_effect_new.lub', 'EFFECT', 'monster_size_effect_new.json'],
    ['tipbox.lub', 'tbl', 'tipbox.json'],
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:3000/applications/tools/index.html');
await fs.mkdir(out, { recursive: true });
for (const [file, variable, output] of targets) {
  const bytes = await fs.readFile(path.join(source, file));
  const result = await page.evaluate(async ({ file, variable, bytes }) => {
    const { default: CLua } = await import('/src/Vendors/wasmoon-lua5.1.js');
    const lua = await CLua.Lua.create({ customWasmUri: '/src/Vendors/liblua5.1.wasm' });
    let value = null;
    const decode = v => typeof v === 'string' ? v : new TextDecoder('euc-kr').decode(v);
    const items = {};
    const quests = {};
    const pet = { Evolution: {}, AutoFeeding: [] };
    const attendance = { Config: {}, Rewards: [] };
    if (file === 'CheckAttendance.lub') {
      lua.ctx.InsertCheckAttendanceConfig = (on, start, end) => { attendance.Config = { EvendOnOff: on, StartDate: start, EndDate: end }; return 1; };
      lua.ctx.InsertCheckAttendanceReward = (day, id, qty) => { attendance.Rewards[day - 1] = { day, item_id: id, quantity: qty }; return 1; };
    }
    if (file === 'PetEvolutionCln.lub' || file === 'PetEvolutionCln_true.lub') {
      lua.ctx.InsertEvolutionRecipeLGU = (base, target, mat, amount) => { (pet.Evolution[base] ||= {})[target] ||= []; pet.Evolution[base][target].push({ MaterialID: Number(mat), Amount: Number(amount) }); return 1; };
      lua.ctx.InsertPetAutoFeeding = id => { pet.AutoFeeding.push(Number(id)); return 1; };
    }
    if (file === 'OngoingQuestInfoList.lub' || file === 'OngoingQuestInfoList_True.lub') {
      lua.ctx.AddQuestInfo = (id, title, summary, icon, spr, navi, x, y, exp, jexp) => { quests[id] = { Title: decode(title), Summary: decode(summary), IconName: decode(icon), NpcSpr: decode(spr), NpcNavi: decode(navi), NpcPosX: x, NpcPosY: y, RewardItemList: [], RewardEXP: exp, RewardJEXP: jexp, Description: [] }; return 1; };
      lua.ctx.AddQuestDescription = (id, v) => { quests[id].Description.push(decode(v)); return 1; };
      lua.ctx.AddQuestRewardItem = (id, item, num) => { quests[id].RewardItemList.push({ ItemID: item, ItemNum: num }); return 1; };
    }
    if (file === 'itemInfo_true.lub') {
      lua.ctx.AddItem = (id, un, unr, idn, idr, slots, cls) => { items[id] = { unidentifiedDisplayName: decode(un), unidentifiedResourceName: decode(unr), identifiedDisplayName: decode(idn), identifiedResourceName: decode(idr), slotCount: slots, ClassNum: cls, unidentifiedDescriptionName: [], identifiedDescriptionName: [] }; return 1; };
      lua.ctx.AddItemUnidentifiedDesc = (id, v) => { items[id].unidentifiedDescriptionName.push(decode(v)); return 1; };
      lua.ctx.AddItemIdentifiedDesc = (id, v) => { items[id].identifiedDescriptionName.push(decode(v)); return 1; };
      lua.ctx.AddItemEffectInfo = (id, v) => { items[id].EffectID = v; return 1; };
      lua.ctx.AddItemIsCostume = (id, v) => { items[id].costume = v; return 1; };
      lua.ctx.AddItemPackageID = (id, v) => { items[id].PackageID = v; return 1; };
    }
    if (file === 'ShadowTable.lub') lua.doStringSync(`jobtbl=setmetatable({}, {__index=function(t,k) local x={}; rawset(t,k,x); return x end}); JTtbl=jobtbl`);
    lua.mountFile(file, new Uint8Array(bytes));
    await lua.doFile(file);
    if (file === 'CheckAttendance.lub') { lua.doStringSync('main()'); return attendance; }
    if (file === 'PetEvolutionCln.lub' || file === 'PetEvolutionCln_true.lub') { lua.doStringSync('main()'); return pet; }
    if (file === 'OngoingQuestInfoList.lub' || file === 'OngoingQuestInfoList_True.lub') {
      lua.doStringSync(`function main_quest() for QuestID,DESC in pairs(QuestInfoList) do DESC=type(DESC)=='table' and DESC or {}; AddQuestInfo(QuestID,DESC.Title or 'Unknown Quest',DESC.Summary or 'Unknown Quest',DESC.IconName or '',DESC.NpcSpr or '',DESC.NpcNavi or '',DESC.NpcPosX or 0,DESC.NpcPosY or 0,tonumber(DESC.RewardEXP) or 0,tonumber(DESC.RewardJEXP) or 0); for _,v in pairs(DESC.RewardItemList or {}) do AddQuestRewardItem(QuestID,v.ItemID,v.ItemNum) end; for _,v in pairs(DESC.Description or {}) do AddQuestDescription(QuestID,v or '') end end end; main_quest()`);
      return { data: quests };
    }
    if (file === 'itemInfo_true.lub') {
      lua.doStringSync(`function main_item() for ItemID,DESC in pairs(tbl) do if #DESC.identifiedDescriptionName > 0 then AddItem(ItemID,DESC.unidentifiedDisplayName,DESC.unidentifiedResourceName,DESC.identifiedDisplayName,DESC.identifiedResourceName,DESC.slotCount,DESC.ClassNum); for _,v in pairs(DESC.unidentifiedDescriptionName) do AddItemUnidentifiedDesc(ItemID,v) end; for _,v in pairs(DESC.identifiedDescriptionName) do AddItemIdentifiedDesc(ItemID,v) end; if DESC.EffectID then AddItemEffectInfo(ItemID,DESC.EffectID) end; if DESC.costume then AddItemIsCostume(ItemID,DESC.costume) end; if DESC.PackageID then AddItemPackageID(ItemID,DESC.PackageID) end end end end; main_item()`);
      return { data: items };
    }
    lua.ctx.extractValue = json => { value = JSON.parse(new TextDecoder('euc-kr').decode(json)); };
    lua.doStringSync(`
      local function q(s) s=string.gsub(s,'\\\\','\\\\\\\\'); s=string.gsub(s,'"','\\\\"'); s=string.gsub(s,'\\n','\\\\n'); s=string.gsub(s,'\\r','\\\\r'); s=string.gsub(s,'\\t','\\\\t'); return s end
      local function j(v)
        if type(v)=='string' then return '"'..q(v)..'"' end
        if type(v)=='number' or type(v)=='boolean' then return tostring(v) end
        if type(v)~='table' then return 'null' end
        local a=true; local n=0; local index=1; for k,_ in pairs(v) do if type(k)~='number' or k~=index then a=false; break end; index=index+1; n=n+1 end
        local r={}; if a then for i=1,n do table.insert(r,j(v[i])) end else for k,x in pairs(v) do if type(k)=='string' or type(k)=='number' then table.insert(r,'"'..q(k)..'":'..j(x)) end end end
        return (a and '[' or '{')..table.concat(r,',')..(a and ']' or '}')
      end
      extractValue(j(${variable}))
    `);
    lua.unmountFile(file);
    return value;
  }, { file, variable, bytes: [...bytes] });
  if (file === 'itemInfo_true.lub') for (const row of Object.values(result.data)) for (const k of ['EffectID', 'costume', 'PackageID']) if (row[k] === null) delete row[k];
  if (file === 'tipbox.lub') for (const row of Object.values(result)) { delete row.Search; delete row.PageEX; }
  await fs.writeFile(path.join(out, output), JSON.stringify(result) + '\n');
  console.log(output);
}
await browser.close();
