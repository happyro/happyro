import sys
from pathlib import Path
import unittest
sys.path.insert(0,str(Path(__file__).parents[1]))
from tools.localization.npcs.reconcile_names import decide

def row(source,name,key='1'):
    return {'source':source,'name':name,'key':source+key,'sourceConflict':False}

class Decisions(unittest.TestCase):
    def test_space_equivalence_keeps_verbatim(self):
        result=decide([row('dvg','少女'),row('ro321','少 女')])
        self.assertEqual(result[1],'agree');self.assertEqual(result[2]['name'],'少女')
    def test_same_position_different_names_is_not_confirmed(self):
        result=decide([row('dvg','苹果商人'),row('ro321','霍慈')])
        self.assertEqual(result[0],'unresolved-position-candidate')
        self.assertEqual(result[1],'prefer-dvg-pending-identity')
    def test_multiple_same_site_records_are_not_merged(self):
        result=decide([row('dvg','商人'),row('dvg','商人','2'),row('ro321','商人')])
        self.assertEqual(result[1],'hold-multiple-identities');self.assertIsNone(result[2])
    def test_hidden_label_is_not_chinese_name(self):
        self.assertEqual(decide([row('ro321','(无形或隐藏)')])[1],'hold-no-chinese-evidence')
    def test_english_is_not_translated(self):
        self.assertIsNone(decide([row('ro321','Kaci')])[2])
    def test_chinese_source_is_only_candidate_for_english_identity(self):
        result=decide([row('dvg','卡西'),row('ro321','Kaci')])
        self.assertEqual(result[1],'prefer-chinese-pending-identity')
    def test_single_source_is_not_cross_site_agreement(self):
        self.assertEqual(decide([row('ro321','守卫')])[1],'retain-single-source')
if __name__=='__main__':unittest.main()
