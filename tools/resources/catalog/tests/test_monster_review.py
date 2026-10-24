"""Reviewed costume titles must survive catalog regeneration."""
import unittest

from tools.resources.catalog.errors import CatalogError
from tools.resources.catalog.monster import build_catalog


class ReviewedMonsterNamesTest(unittest.TestCase):
    def build(self, records):
        return build_catalog({'Body': records}, {'Body': records}, {}, {},
                             'baseline', 'mob_db.yml', [])['monsters']

    def test_pope_costumes_use_same_id_mercenary_titles(self):
        monsters = self.build([
            {'Id': 3569, 'AegisName': 'POPE_MD_H_MERC_NORMAL', 'Name': 'Casual Pope'},
            {'Id': 3570, 'AegisName': 'POPE_MD_H_MERC_CASUAL', 'Name': 'Official Pope'},
            {'Id': 2213, 'AegisName': 'M_WANDER_MAN', 'Name': 'Wanderer'},
        ])
        self.assertEqual(monsters['3569']['names']['en-US'], 'Official Pope')
        self.assertEqual(monsters['3570']['names']['en-US'], 'Casual Pope')
        self.assertEqual(monsters['2213']['names']['en-US'], 'Wanderer')

    def test_review_rejects_an_id_assigned_to_another_monster(self):
        with self.assertRaises(CatalogError):
            self.build([{'Id': 3569, 'AegisName': 'OTHER', 'Name': 'Other'}])
