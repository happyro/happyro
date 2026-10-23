import json
from pathlib import Path
import unittest
from tools.resources.catalog.sync_item_names import render_crafting_materials

ROOT = Path(__file__).resolve().parents[4]


class CraftingNamesTests(unittest.TestCase):
    def test_material_ids_match_server_recipes_with_documented_quantity_exception(self):
        config = json.loads((ROOT / 'localization/item-names/crafting-materials.json').read_text())
        server = {}
        for line in (ROOT / config['source']).read_text().splitlines():
            line = line.split('//')[0].strip()
            if not line:
                continue
            fields = [int(v) for v in line.split(',')]
            if fields[2] <= 22:
                server.setdefault(str(fields[1]), []).append(sorted((str(i), q) for i, q in zip(fields[5::2], fields[6::2]) if q))
        exceptions = {(d['outputID'], d['itemID']): d for d in config['quantityDifferences']}
        for recipe in config['recipes']:
            materials = []
            for item in recipe['materials']:
                quantity = item['quantity']
                exception = exceptions.get((recipe['outputID'], item['itemID']))
                if exception:
                    self.assertEqual(quantity, exception['clientQuantity'])
                    quantity = exception['serverQuantity']
                materials.append((item['itemID'], quantity))
            self.assertIn(sorted(materials), server[recipe['outputID']], recipe['outputID'])

    def test_renderer_uses_ids_and_preserves_amounts_and_order(self):
        recipes = [{'outputID': '994', 'materials': [{'itemID': '990', 'quantity': 10}]}]
        self.assertEqual(render_crafting_materials(recipes, {'990': {'name': '火灵矿石'}}), '994#\n火灵矿石 × 10\n#\n')
        with self.assertRaises(KeyError):
            render_crafting_materials(recipes, {})
