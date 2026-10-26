import sys
from pathlib import Path
import unittest
sys.path.insert(0,str(Path(__file__).parents[1]))
from tools.localization.npcs.apply_names import rename_definition

class DisplayNameTests(unittest.TestCase):
    def test_preserves_existing_internal_name_and_hidden_suffix(self):
        self.assertEqual(rename_definition('男子#King::KingActor','倒卧的男子'),'倒卧的男子#King::KingActor')
    def test_old_identifier_remains_referenceable(self):
        self.assertEqual(rename_definition('Trace of an adventurer#3','冒险家的踪迹'),'冒险家的踪迹#3::Trace of an adventurer#3')
    def test_utf8_length_limit_does_not_truncate(self):
        with self.assertRaises(ValueError):rename_definition('NPC','名'*17)
    def test_suffix_counts_towards_display_limit(self):
        with self.assertRaises(ValueError):rename_definition('NPC#'+'x'*30,'名'*7)
if __name__=='__main__':unittest.main()
