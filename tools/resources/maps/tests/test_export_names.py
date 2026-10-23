from hashlib import sha256
import json
from pathlib import Path
import tempfile
import unittest
from tools.resources.maps.export_names import verify, usable
from tools.resources.maps.scan_names import write

class EvidenceTest(unittest.TestCase):
    def test_complete_evidence_and_tampering(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);site=root/'dvg';site.mkdir()
            raw=b'<title>maps</title><a class="database-card-title" href="/map_info.php?id=alberta">Alberta</a>'
            path=site/'1.html';path.write_bytes(raw)
            row={'map':'alberta','name':'Alberta','siteId':1}
            page={'url':'https://ro.dvg.cn/map_list.php?page=1','rawPath':str(path),'sha256':sha256(raw).hexdigest(),'records':[row],'pages':1,'total':1}
            write(site/'status.json',{'complete':True,'pending':[],'error':None,'pages':1,'records':1})
            write(site/'pages.json',[page]);write(site/'records.json',[{**row,'sourceUrl':page['url']}])
            self.assertTrue(verify(root,'dvg')[2]['passed'])
            page['records'][0]['name']='Forged title';write(site/'pages.json',[page])
            with self.assertRaises(ValueError):verify(root,'dvg')
            path.write_bytes(raw+b'changed')
            with self.assertRaises(ValueError):verify(root,'dvg')

    def test_incomplete_scan_is_not_success(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            write(root/'ro321'/'status.json',{'complete':False,'pending':['url'],'error':None})
            with self.assertRaises(ValueError):verify(root,'ro321')

    def test_names_need_chinese_evidence(self):
        self.assertTrue(usable('初心者修炼场'))
        for value in [None, '', 'new_zone01', 'Training Ground', '测试�', 'テスト地图']:
            self.assertFalse(usable(value))

if __name__=='__main__':unittest.main()
