import unittest
from tools.resources.maps.scan_names import parse_dvg, parse_ro, ro_links, aggregate

class MapNamesTest(unittest.TestCase):
    def test_links_preserve_renewal_and_deduplicate_warps(self):
        text = '''<a href='index.php?page=npc_shop_warp&map=alberta&re_mob=1'>x</a>
        <a href='index.php?page=npc_shop_warp&map=alberta&s_x=20&re_mob=1'>y</a>
        <a href='index.php?page=npc_shop_warp&map=alberta'>pre</a>
        <a href='https://example.org/index.php?page=npc_shop_warp&map=foo&re_mob=1'>foreign</a>
        <a href='index.php?page=areainfo&area=1025&re_mob=1'>area</a>'''
        self.assertEqual(ro_links(text), ['https://ro.ro321.com/index.php?page=areainfo&area=1025&re_mob=1', 'https://ro.ro321.com/index.php?page=npc_shop_warp&map=alberta&re_mob=1'])

    def test_dvg_identity_and_pagination(self):
        card = '<article class="database-card"><a class="database-card-title" href="/map_info.php?id=alberta">港口之都 艾尔贝塔</a><p>#1281 · alberta</p><p>280 × 280 · 村落</p></article>'
        text = '1 条 · 第 1 / 1 页' + card
        self.assertEqual(parse_dvg(text, 1)['records'][0]['map'], 'alberta')
        self.assertIsNone(parse_dvg(text.replace('280 × 280', '— × —'), 1)['records'][0]['width'])
        for bad, page in [(text, 2), (text.replace('id=alberta', 'id=prontera'), 1), (text+card, 1), ('403 Forbidden',1)]:
            with self.assertRaises(ValueError): parse_dvg(bad,page)

    def test_area_name_is_not_the_region_label(self):
        url='https://ro.ro321.com/index.php?page=areainfo&area=1&re_mob=1'
        text="<tr><td><b>地图名称: treasure01</b></td><td><b>区域: 沉没之船 (艾尔贝塔)<br> - 沉没之船 1楼</b></td></tr><tr><td><b>地图名称: lhz_dun_n</b></td><td><b>区域: 生体试验研究所 - 战死者之墓</b></td></tr>"
        text+="<a href='index.php?page=npc_shop_warp&map=treasure01&re_mob=1'>details</a>"
        parsed=parse_ro(text,url)
        self.assertEqual(parsed['records'],[{'map':'treasure01','name':'沉没之船 1楼','version':'re'}])
        self.assertEqual(len(parsed['areaLabels']),2)

    def test_instance_variants_are_not_merged_with_base_map(self):
        url='https://ro.ro321.com/index.php?page=areainfo&area=3101&re_mob=1'
        text="<tr><td><b>地图名称: 1@pop1(hard)</b></td><td><b>区域: 副本<br> - 教皇办公室 (噩梦模式)</b></td></tr><a href='index.php?page=npc_shop_warp&map=1%40pop1%28hard%29&re_mob=1'>detail</a>"
        row=parse_ro(text,url)['records'][0]
        self.assertEqual(row['map'],'1@pop1(hard)')
        self.assertEqual(len(ro_links(text)),1)

    def test_conflicting_area_names_require_detail(self):
        pages=[{'url':'https://ro.ro321.com/index.php?page=areainfo&area='+str(i),'records':[{'map':'test','name':name}]} for i,name in enumerate(['甲','乙'])]
        rows,conflicts=aggregate(pages)
        self.assertEqual(rows,[]);self.assertEqual(conflicts,{'test'})
        pages.append({'url':'https://ro.ro321.com/index.php?page=npc_shop_warp&map=test&re_mob=1','records':[{'map':'test','name':'乙'}]})
        rows,conflicts=aggregate(pages)
        self.assertFalse(conflicts);self.assertEqual(rows[0]['name'],'乙');self.assertEqual(len(rows[0]['evidence']),3)

    def test_ro_title_body_identity(self):
        url = 'https://ro.ro321.com/index.php?page=npc_shop_warp&map=alberta&re_mob=1'
        text = "<title>港口之都 艾尔贝塔 - alberta 地图知訊</title><span class='clear_ctext'>港口之都 艾尔贝塔</span> (alberta)"
        self.assertEqual(parse_ro(text,url)['records'][0]['name'], '港口之都 艾尔贝塔')
        with self.assertRaises(ValueError): parse_ro(text.replace(' - alberta ', ' - prontera '),url)
        with self.assertRaises(ValueError): parse_ro('challenge page',url)

if __name__ == '__main__': unittest.main()
