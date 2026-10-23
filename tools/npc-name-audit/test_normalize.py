import sys
from pathlib import Path
import unittest
sys.path.insert(0,str(Path(__file__).parent))
from normalize import transform

class NormalizationTests(unittest.TestCase):
    def test_reviewed_function_title_keeps_callee_and_company(self):
        source='function\tscript\tF_Test\t{\ncallfunc("F_SetKafCode","[Staff]","Company");\n}'
        rule={'surface':'literal','line':2,'old':'[Staff]','new':'[员工]','display_call':{'command':'callfunc','callee':'F_SetKafCode','argument':1}}
        result=transform(source,'npc/test.txt',[rule])
        self.assertIn('callfunc("F_SetKafCode","[员工]","Company")',result)
        rule['display_call']['callee']='F_Other'
        with self.assertRaisesRegex(ValueError,'direct display argument'):
            transform(source,'npc/test.txt',[rule])

    def test_dynamic_title_and_identity_comparison_are_exact_and_idempotent(self):
        source='m,1,2,0\tscript\tGuard\t100,{\nmes "[Guard]";\nif (strnpcinfo(0) == "Guard")\nend;\n}'
        rules=[{'surface':'dynamic_title','line':2,'old':'mes "[Guard]";','new':'mes "[" + strnpcinfo(1) + "]";'},
               {'surface':'identity_comparison','line':3,'old':'if (strnpcinfo(0) == "Guard")','new':'if (strnpcinfo(3) == "Guard")'}]
        result=transform(source,'npc/test.txt',rules)
        self.assertIn('strnpcinfo(1)',result)
        self.assertIn('strnpcinfo(3)',result)
        self.assertEqual(transform(result,'npc/test.txt',rules),result)
        rules[1]['new']='if (1)'
        with self.assertRaisesRegex(ValueError,'Only reviewed'):
            transform(source,'npc/test.txt',rules)

    def test_reviewed_call_argument_does_not_change_other_arguments(self):
        source='m,1,2,0\tscript\tGuard\t100,{\ncallsub L_Question, "Guard", "Guard";\n}'
        rule={'surface':'literal','line':2,'old':'Guard','new':'卫兵','display_call':{'command':'callsub','callee':'L_Question','argument':2}}
        with self.assertRaisesRegex(ValueError,'direct display argument'):
            transform(source,'npc/test.txt',[rule])
        source=source.replace('"Guard", "Guard"','"Question", "Guard"')
        result=transform(source,'npc/test.txt',[rule])
        self.assertIn('"Question", "卫兵"',result)

    def test_explicit_display_variable_does_not_allow_unrelated_assignment(self):
        source='m,1,2,0\tscript\tGuard\t100,{\n.@n$ = "Guard";\n.@event$ = "Guard";\n}'
        rule={'surface':'literal','line':2,'old':'Guard','new':'卫兵','display_variable':'.@n$'}
        result=transform(source,'npc/test.txt',[rule])
        self.assertIn('.@event$ = "Guard"',result)
        rule['line']=3
        with self.assertRaisesRegex(ValueError,'direct display argument'):
            transform(source,'npc/test.txt',[rule])

    def test_refuses_literal_rule_that_would_change_event_references(self):
        source='m,1,2,0\tscript\tGuard\t100,{\nmes "Guard";\ngetnpcid(0,"Guard");\n}'
        with self.assertRaisesRegex(ValueError,'direct display argument'):
            transform(source,'npc/test.txt',[{'surface':'literal','old':'Guard','new':'卫兵'}])

    def test_scoped_dialogue_keeps_internal_reference_and_is_idempotent(self):
        source='m,1,2,0\tscript\tGuard\t100,{\nmes "Guard";\ngetnpcid(0,"Guard");\n}'
        rules=[{'surface':'literal','old':'Guard','new':'卫兵','line':2}, {'surface':'definition','old':'Guard','new':'卫兵','internal_name':'Guard'}]
        result=transform(source,'npc/test.txt',rules)
        self.assertIn('卫兵::Guard',result)
        self.assertIn('getnpcid(0,"Guard")',result)
        self.assertEqual(transform(result,'npc/test.txt',rules),result)

    def test_rejects_injected_executable_code(self):
        source='m,1,2,0\tscript\tGuard\t100,{\nmes "Guard";\n}'
        with self.assertRaisesRegex(ValueError,'executable code'):
            transform(source,'npc/test.txt',[{'surface':'literal','old':'Guard','new':'Guard"; end; mes "other'}])

    def test_rejects_unclosed_quote(self):
        source='m,1,2,0\tscript\tGuard\t100,{\nmes "Guard";\n}'
        with self.assertRaisesRegex(ValueError,'invalid script syntax'):
            transform(source,'npc/test.txt',[{'surface':'literal','old':'Guard','new':'Guard\\'}])

    def test_preserves_hidden_suffix_and_legacy_bytes(self):
        source='m,1,2,0\tscript\tGuard#1\t100,{\ncutin "legacy\udcb0",1;\n}'
        result=transform(source,'npc/test.txt',[{'surface':'definition','old':'Guard','new':'卫兵','internal_name':'Guard#1'}])
        self.assertIn('卫兵#1::Guard#1',result)
        self.assertIn(b'legacy\xb0',result.encode('utf-8',errors='surrogateescape'))
