"""Cross-repository contract for reviewed skill identities and names."""
import hashlib
import json
from pathlib import Path
import subprocess
import unittest

import yaml

ROOT = Path(__file__).resolve().parents[4]


class SkillNameConsistencyTests(unittest.TestCase):
    def test_reviewed_names_reach_client_server_and_generated_catalog(self):
        merged = ROOT / 'docs/localization/skill-name-scans/merged'
        manifest = json.loads((merged / 'manifest.json').read_text())
        records = []
        for shard in manifest['shards']:
            raw = (merged / shard['file']).read_bytes()
            self.assertEqual(hashlib.sha256(raw).hexdigest(), shard['sha256'])
            records.extend(json.loads(raw))
        self.assertEqual(len(records), manifest['records'])
        self.assertEqual(len({r['id'] for r in records}), len(records))
        client = json.loads((ROOT / 'repos/happyro-client/src/DB/Skills/SkillNames.zh-CN.json').read_text())
        server = {r['Id']: r for r in yaml.safe_load((ROOT / 'repos/happyro-server/db/re/skill_db.yml').read_text())['Body']}
        generated = json.loads(subprocess.check_output([
            'node', '--input-type=module', '-e',
            "import t from './repos/happyro-client/src/DB/Skills/SkillLocalizationTable.generated.js'; console.log(JSON.stringify(t));"
        ], cwd=ROOT, text=True))
        self.assertEqual([r['id'] for r in records if r['name'] is None], [2549])
        for row in records:
            if row['name'] is None:
                continue  # GM_AP_HEAL has no confirmed external or previous name.
            with self.subTest(id=row['id'], aegis=row['aegis']):
                self.assertEqual(client[row['aegis']], row['name'])
                self.assertEqual(generated[str(row['id'])]['name'], row['name'])
                if row['id'] in server:
                    self.assertEqual(generated[str(row['id'])]['key'], row['aegis'])
                    self.assertEqual(server[row['id']]['Name'], row['aegis'])
                    self.assertEqual(server[row['id']]['Description'], row['name'])

    def test_skill_references_and_ordinary_words_remain_distinct(self):
        names = json.loads((ROOT / 'repos/happyro-client/src/DB/Skills/SkillNames.zh-CN.json').read_text())
        prose = json.loads((ROOT / 'localization/client/data/skill-description-prose.zh-CN.json').read_text())
        for skill_id, key in [(2574, 'SJ_LIGHTOFSTAR'), (2590, 'SJ_LIGHTOFMOON'),
                              (5051, 'SU_FRESHSHRIMP'), (8032, 'MH_ANGRIFFS_MODUS'),
                              (421, 'KN_ONEHAND'), (2042, 'AL_INCAGI'),
                              (5009, 'SR_FALLENEMPIRE'), (5246, 'SR_FALLENEMPIRE')]:
            with self.subTest(skill=skill_id):
                self.assertIn(names[key], prose[str(skill_id)])
        self.assertIn('发动三连击', prose['502'])  # Gunslinger attack count, not monk skill.
        self.assertNotIn(names['MO_TRIPLEATTACK'], prose['502'])
        self.assertIn('风属性转换器', prose['1007'])  # Item, not elemental-change skill.
        items = json.loads((ROOT / 'localization/sources/kro-20211105/merged/files/lub/itemInfo_true.json').read_text())['data']
        for item_id, key in [('1654', 'SO_PSYCHIC_WAVE'), ('24281', 'DC_HUMMING'),
                             ('19200', 'WM_REVERBERATION'), ('4357', 'LK_BERSERK'),
                             ('15055', 'KO_ZANZOU')]:
            self.assertIn(names[key], '\n'.join(items[item_id]['identifiedDescriptionName']))
        self.assertIn('霰弹枪', '\n'.join(items['28218']['identifiedDescriptionName']))
        self.assertNotIn('自动', items['600016']['identifiedDescriptionName'][5])

    def test_explicit_prerequisites_share_reviewed_skill_names(self):
        table = json.loads(subprocess.check_output([
            'node', '--input-type=module', '-e',
            "import t from './repos/happyro-client/src/DB/Skills/SkillLocalizationTable.generated.js'; console.log(JSON.stringify(t));"
        ], cwd=ROOT, text=True))
        for skill_id, prerequisite_id in [(355, 3), (399, 55), (399, 63), (495, 60),
                                          (496, 228), (2338, 2341), (2347, 2346)]:
            with self.subTest(skill=skill_id, prerequisite=prerequisite_id):
                self.assertIn(table[str(prerequisite_id)]['name'], table[str(skill_id)]['description'])

    def test_quest_skill_tips_use_skill_identity_not_ambiguous_aliases(self):
        names = json.loads((ROOT / 'repos/happyro-client/src/DB/Skills/SkillNames.zh-CN.json').read_text())
        tips = json.loads((ROOT / 'localization/sources/kro-20211105/merged/files/lub/tipbox.json').read_text())
        bindings = {
            '9016': ['KN_CHARGEATK'], '9017': ['AS_VENOMKNIFE', 'AS_SONICACCEL'],
            '9018': ['PR_REDEMPTIO'], '9019': ['HT_PHANTASMIC'],
            '9020': ['WZ_SIGHTBLASTER'], '9021': ['BS_UNFAIRLYTRICK'],
            '9022': ['CR_SHRINK'], '9023': ['RG_CLOSECONFINE'],
            '9024': ['MO_BALKYOUNG', 'MO_KITRANSLATION'],
            '9025': ['BA_PANGVOICE'], '9026': ['DC_WINKCHARM'],
            '9027': ['SA_CREATECON', 'SA_ELEMENTWATER', 'SA_ELEMENTGROUND', 'SA_ELEMENTFIRE', 'SA_ELEMENTWIND'],
            '9028': ['AM_BIOETHICS'], '9030': ['MC_CARTDECORATE'], '9067': ['BS_GREED']
        }
        for tip_id, keys in bindings.items():
            for key in keys:
                with self.subTest(tip=tip_id, skill=key):
                    self.assertIn(names[key], '\n'.join(tips[tip_id]['Page']))
        self.assertNotIn('地牛翻身', '\n'.join(tips['9020']['Page']))
        self.assertNotIn('赎罪', '\n'.join(tips['9018']['Page']))
        self.assertEqual(names['AB_EXPIATIO'], '赎罪')

    def test_converter_tip_materials_match_renewal_recipe(self):
        tips = json.loads((ROOT / 'localization/sources/kro-20211105/merged/files/lub/tipbox.json').read_text())
        items = json.loads((ROOT / 'localization/item-names/zh-CN.json').read_text())['items']
        recipes = (ROOT / 'repos/happyro-server/db/re/produce_db.txt').read_text()
        found = 0
        for line in recipes.splitlines():
            if not line or line.startswith('//'):
                continue
            values = line.split(',')
            if len(values) < 5 or values[3] != '1007':
                continue
            found += 1
            for item_id, amount in zip(values[5::2], values[6::2]):
                self.assertIn(f"{items[item_id]['name']}{amount}个", tips['9027']['Page'][1])
        self.assertEqual(found, 4)
