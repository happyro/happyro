import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('npc_scan', Path(__file__).parents[1] / 'scan_sources.py')
scan = importlib.util.module_from_spec(spec)
spec.loader.exec_module(scan)

class ParsingTests(unittest.TestCase):
    def test_ro_warp_uses_origin_coordinates_and_discovers_destination(self):
        text = '''(town)<div id='npc_block'></div>
        <a id='t#warp_7'>去 inside (2, 3)</a>
        <div id='warp_7' title='town (10, 20) to inside (2, 3)'><a href='index.php?page=npc_shop_warp&map=inside&re_mob=1'><img src='warp.gif'></a></div>'''
        data = scan.parse_ro(text, scan.ro_url('npc_shop_warp', map='town'))
        self.assertEqual((data['records'][0]['x'], data['records'][0]['y']), (10, 20))
        self.assertIn(scan.ro_url('npc_shop_warp', map='inside'), data['links'])

    def test_ro_npc_and_shop_ids_are_separate(self):
        text = "(town)<div id='npc_block'></div>"
        for kind in ('npc', 'shop'):
            text += f"<a id='t#{kind}_1'>商人</a><div id='{kind}_1' title='town (10, 20)'><a href='detail.php?id=1'></a></div>"
        self.assertEqual(len(scan.parse_ro(text, scan.ro_url('npc_shop_warp', map='town'))['records']), 2)

    def test_ro_missing_marker_is_not_success(self):
        with self.assertRaises(ValueError):
            scan.parse_ro("(town)<div id='npc_block'></div><a id='t#npc_1'>NPC</a>", scan.ro_url('npc_shop_warp', map='town'))

    def test_ro_index_prevents_silent_empty_result(self):
        text = "(town)<div id='npc_block'></div><script>var all_npc_arr = new Array('npc_12');</script>"
        with self.assertRaises(ValueError):
            scan.parse_ro(text, scan.ro_url('npc_shop_warp', map='town'))

    def test_ro_pre_renewal_links_are_excluded(self):
        links = scan.ro_links("<a href='index.php?page=npc_shop_warp&map=old&re_mob=0'>old</a><a href='index.php?page=npc_shop_warp&map=new&re_mob=1'>new</a>")
        self.assertEqual(links, [scan.ro_url('npc_shop_warp', map='new')])

    def test_dvg_name_scan_does_not_enqueue_details(self):
        text = '''1 条 · 第 1 / 1 页<article class="npc-card"><a class="npc-card-name" href="/npc_info.php?id=1">名称</a><img src="/dbsource/npc/649.gif"><button data-ui-copy-text="/navi abbey02 155/290"></button></article>'''
        result = scan.parse_dvg_list(text, 'https://ro.dvg.cn/npc_list.php?sort=id&page=1')
        self.assertEqual(result['records'][0]['name'], '名称')
        self.assertEqual(result['records'][0]['spriteId'], 649)
        self.assertEqual(result['links'], ['https://ro.dvg.cn/npc_list.php?sort=id&page=1'])

    def test_dvg_wrong_detail_id_is_rejected(self):
        with self.assertRaises(ValueError):
            scan.parse_dvg_detail('<dt>NPC ID</dt><dd>2</dd><dt>名称</dt><dd>测试</dd>', 'https://ro.dvg.cn/npc_info.php?id=1')

    def test_dvg_detail_retains_distinct_related_names(self):
        text = '''<dt>NPC ID</dt><dd>1</dd><dt>名称</dt><dd>踪迹</dd><code class="npc-navigation">/navi abbey02 155/290</code>
        <details><summary>游戏内记录 · 1 条</summary><pre>{&quot;name&quot;:&quot;痕迹#3&quot;}</pre></details>'''
        row = scan.parse_dvg_detail(text, 'https://ro.dvg.cn/npc_info.php?id=1')['records'][0]
        self.assertEqual(row['name'], '踪迹')
        self.assertEqual(row['related'][0]['records'][0]['name'], '痕迹#3')

    def test_dvg_related_count_mismatch_is_rejected(self):
        text = '''<dt>NPC ID</dt><dd>1</dd><dt>名称</dt><dd>踪迹</dd><code class="npc-navigation">/navi abbey02 155/290</code>
        <details><summary>游戏内记录 · 2 条</summary><pre>{"name":"痕迹"}</pre></details>'''
        with self.assertRaises(ValueError):
            scan.parse_dvg_detail(text, 'https://ro.dvg.cn/npc_info.php?id=1')

    def test_captcha_is_not_empty_success(self):
        for site, url in [('ro321', scan.ro_url('npc_shop_warp', map='town')), ('dvg', 'https://ro.dvg.cn/npc_list.php')]:
            with self.assertRaises(ValueError): scan.parse(site, '<html>Checking your browser</html>', url)

if __name__ == '__main__': unittest.main()
