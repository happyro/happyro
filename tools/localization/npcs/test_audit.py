import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('audit', Path(__file__).with_name('audit.py'))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)

class InventoryTests(unittest.TestCase):
    def test_comments_strings_and_braces_do_not_create_npcs(self):
        source = ('/*\nm,1,2,3\tscript\tGhost\t100,{ end; }\n*/\n'
                  'm,1,2,3\tscript\t向导#x::Guide#x\t100,{\n'
                  '\tmes "[向导]";\n\tmes "http://host/{/*}"; // }\n}\n'
                  'm,3,4,0\tduplicate(Guide#x)\t向导#y\t100\n')
        rows, _, _, errors, unknown = audit.parse_script(source, 'npc/a.txt', True)
        self.assertEqual(len(rows), 2)
        self.assertEqual(rows[0]['line'], 4)
        self.assertEqual(rows[0]['internal_name'], 'Guide#x')
        self.assertEqual(rows[0]['dialogue_titles'], [{'line':5,'name':'向导'}])
        self.assertEqual(rows[1]['duplicate_of'], 'Guide#x')
        self.assertEqual(errors, [])
        self.assertEqual(unknown, [])

    def test_function_hidden_shop_and_warp_are_distinct(self):
        source = ('function\tscript\tF_Test\t{ return; }\n'
                  '-\tscript\t#controller\t-1,{ end; }\n'
                  'm,1,2,0\tshop\t商人::Shop\t100,501:10\n'
                  'm,3,4,0\twarp2(DISABLED)\t#exit\t1,1,m,5,5\n')
        rows, _, _, errors, unknown = audit.parse_script(source,'npc/a.txt',True)
        self.assertEqual([r['kind'] for r in rows],['function','script','shop','warp2'])
        self.assertTrue(rows[1]['hidden'])
        self.assertFalse(rows[2]['hidden'])
        self.assertEqual(errors, [])
        self.assertEqual(unknown, [])

    def test_stable_identity_ignores_display_translation_and_inserted_lines(self):
        before = 'm,1,2,0\tscript\tGuide::guide_1\t100,{ end; }'
        after = '// additional comment\nm,1,2,0\tscript\t向导::guide_1\t100,{ end; }'
        a = audit.parse_script(before,'npc/a.txt',True)[0][0]
        b = audit.parse_script(after,'npc/a.txt',True)[0][0]
        self.assertEqual(a['audit_id'], b['audit_id'])

    def test_dynamic_names_are_retained_as_expressions(self):
        source='m,1,2,0\tscript\t女孩::girl\t100,{\nsetnpcdisplay instance_npcname("girl"), "莎拉·艾琳";\n}'
        rows, strings, calls, errors, _ = audit.parse_script(source,'npc/a.txt',True)
        self.assertEqual([c['command'] for c in calls], ['setnpcdisplay','instance_npcname'])
        self.assertIn('莎拉·艾琳',calls[0]['expression'])
        self.assertEqual(strings[0]['owner'],rows[0]['audit_id'])
        self.assertEqual(errors, [])

class SafetyTests(unittest.TestCase):
    def test_escaped_last_quote_is_not_a_closed_string(self):
        _,_,_,errors=audit.lex('mes "text\\"')
        self.assertEqual(errors[0]['kind'],'unterminated_string')

    def test_command_candidates_exclude_variables_and_static_duplicate(self):
        text='m,1,2,0\tduplicate(Guide)\tGuide#copy\t100\n-\tscript\tControl\t-1,{\n.@npcname$ = "Guide";\ngetnpcid(\n0,\n"Guide");\n}'
        calls=audit.parse_script(text,'npc/test.txt',True)[2]
        self.assertEqual(len(calls),1)
        self.assertIn('"Guide"',calls[0]['expression'])

if __name__ == '__main__':
    unittest.main()
