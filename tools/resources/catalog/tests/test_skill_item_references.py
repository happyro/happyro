import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[4]


class SkillItemReferencesTests(unittest.TestCase):
    def test_reviewed_references_use_current_names(self):
        base = ROOT / 'localization'
        names = json.loads((base / 'item-names/zh-CN.json').read_text())['items']
        refs = json.loads((base / 'item-names/reviewed-references.json').read_text())['skillProse']
        prose = json.loads((base / 'client/data/skill-description-prose.zh-CN.json').read_text())
        for ref in refs:
            with self.subTest(skill=ref['skillID'], item=ref['itemID']):
                self.assertIn(ref['prefix'] + names[ref['itemID']]['name'] + ref['suffix'], prose[ref['skillID']])
                self.assertNotIn(ref['old'], prose[ref['skillID']])

    def test_item_updates_preserve_skill_and_weapon_terms(self):
        prose = json.loads((ROOT / 'localization/client/data/skill-description-prose.zh-CN.json').read_text())
        for skill, term in [('3', '双手剑'), ('5037', '海洋力量'), ('2481', '爆炸蘑菇孢子'), ('2570', '重型独头弹'), ('5036', '降下胡萝卜')]:
            self.assertIn(term, prose[skill])

    def test_cost_references_resolve_to_server_item_ids(self):
        import yaml
        base = ROOT / 'localization'
        names = json.loads((base / 'item-names/zh-CN.json').read_text())['items']
        refs = json.loads((base / 'item-names/reviewed-references.json').read_text())['skillProse']
        skills = {str(row['Id']): row for row in yaml.safe_load((ROOT / 'repos/happyro-server/db/re/skill_db.yml').read_text())['Body']}
        for ref in refs:
            if ref['skillID'] in {'477', '1007', '5036'}:
                continue  # Refinement/production code or an existing consumable description.
            with self.subTest(skill=ref['skillID'], item=ref['itemID']):
                costs = skills[ref['skillID']]['Requires']['ItemCost']
                self.assertIn(names[ref['itemID']]['aegis'], [row['Item'] for row in costs])
