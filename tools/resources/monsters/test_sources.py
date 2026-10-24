"""Offline parser regressions: identity, version and pagination failures."""
from pathlib import Path
import unittest
from .scan_sources import parse
from .merge_sources import decide, field_differences

ROOT = Path(__file__).with_name('fixtures')

class SourceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.dvg = (ROOT / 'dvg.html').read_bytes()
        cls.ro = (ROOT / 'ro321.html').read_text().encode('gb18030')
    def test_dvg_fields_keep_database_and_game_parameters_separate(self):
        result = parse('dvg', self.dvg, 'https://ro.dvg.cn/monster_list.php?page=1&sort=id')
        self.assertEqual((result['total'], result['pages'], len(result['records'])), (1,1,1))
        row = result['records'][0]
        self.assertEqual((row['id'],row['name'],row['aegis']), (1001,'蝎子','SCORPION'))
        self.assertEqual([x['label'] for x in row['sections']], ['怪物属性','战斗参数 游戏内'])
        self.assertIn({'label':'HP','value':'136'},row['sections'][0]['fields'])
        self.assertTrue(any('id=990' in x['url'] for x in row['relations']))
    def test_dvg_rejects_wrong_page_and_missing_records(self):
        with self.assertRaises(ValueError):
            parse('dvg', self.dvg, 'https://ro.dvg.cn/monster_list.php?page=2')
        with self.assertRaises(ValueError):
            parse('dvg', self.dvg.replace(b'monster-name-1001', b'monster-name-9999'), 'https://ro.dvg.cn/monster_list.php?page=1')
    def test_ro_renewal_identity_and_related_fields(self):
        result = parse('ro321',self.ro,'https://ro.ro321.com/index.php?page=re_mob_db&list=1&letter=a')
        row = result['records'][0]
        self.assertEqual((row['id'],row['name'],row['aegis']),(1016,'邪骸弓箭手','ARCHER_SKELETON'))
        self.assertEqual(len(result['records']),1)
        self.assertIn({'label':'HP','value':'1458'},row['sections'][0]['fields'])
    def test_ro_discovers_page_gaps_including_canonical_first_page(self):
        result=parse('ro321',self.ro,'https://ro.ro321.com/index.php?page=re_mob_db&race=0&mob_search=Search&page_num=3')
        self.assertEqual(len(result['links']),3)
        self.assertTrue(any('page_num=2' in u for u in result['links']))

    def test_ro_requires_explicit_no_result_message(self):
        url='https://ro.ro321.com/index.php?page=re_mob_db&mob_id=2245'
        result=parse('ro321','<html>對不起，沒有找到匹配結果。</html>'.encode('gb18030'),url)
        self.assertEqual(result['status'],'not-found')
        with self.assertRaises(ValueError):parse('ro321','<html>找不到帮助？</html>'.encode('gb18030'),url)

    def test_ro_never_accepts_pre_renewal_route(self):
        with self.assertRaises(ValueError):
            parse('ro321',self.ro,'https://ro.ro321.com/index.php?page=mob_db&re_mob=1')
    def test_ro_rejects_unrecognized_empty_and_truncated_pages(self):
        for raw in [b'<html>error</html>', self.ro[:self.ro.lower().index(b'</html>')]]:
            with self.assertRaises(ValueError):
                parse('ro321',raw,'https://ro.ro321.com/index.php?page=re_mob_db')

class MergeTests(unittest.TestCase):
    def test_identity_conflict_prevents_selection(self):
        d={'name':'波利','aegis':'PORING'};r={'name':'波利','aegis':'OTHER'}
        result=decide(d,r,{'AegisName':'PORING'})
        self.assertIsNone(result[0]);self.assertEqual(result[2],'identity-conflict')
    def test_chinese_source_is_used_when_other_source_is_internal_name(self):
        d={'name':'G_PORING','aegis':'G_PORING'};r={'name':'波利','aegis':'G_PORING'}
        self.assertEqual(decide(d,r,None)[:2],('波利','ro321'))
    def test_damaged_name_is_not_selected_as_chinese(self):
        d={'name':'?袅男爵','aegis':'OWL_BARON'};r={'name':'鹗枭男爵','aegis':'OWL_BARON'}
        self.assertEqual(decide(d,r,None)[:2],('鹗枭男爵','ro321'))

    def test_never_invents_missing_translation(self):
        self.assertIsNone(decide({'name':'Poring','aegis':'PORING'},None,None)[0])
    def test_display_size_comparison_does_not_rewrite_unknown_values(self):
        d={'sections':[{'label':'怪物属性','fields':[{'label':'体型','value':'中型'},{'label':'Luk','value':'—'}]}]}
        r={'sections':[{'label':'stats','fields':[{'label':'体型','value':'中'},{'label':'Luk','value':'0'}]},{'label':'map','text':'abc'}]}
        self.assertEqual(field_differences(d,r),[{'field':'Luk','dvg':'—','ro321':'0'}])

if __name__ == '__main__': unittest.main()
