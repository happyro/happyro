import contextlib
import importlib.util
import io
import json
from pathlib import Path
import struct
import tempfile
import unittest
from unittest.mock import patch
import zlib

SPEC = importlib.util.spec_from_file_location('navi_review', Path(__file__).with_name('review.py'))
review = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(review)


class ExtractionTests(unittest.TestCase):
    def test_comments_are_not_links_and_multiple_calls_are_independent(self):
        source = '''// F_Navi("ignored","missing,1,1")
/* "<NAVI>ignored<INFO>missing,1,1</INFO></NAVI>" */
mes "欢迎" + F_Navi("北方","town,10,20","^0000FF") + F_Navi("南方","town,30,40");
mes "<NAVI>^4D4DFF牧羊人^000000<INFO>field,35,37,000,1,</INFO></NAVI>";
F_Navi("导航说明");
F_mesnavi("终端", "garden", 128,122);
'''
        rows = review.script_links(source, 'npc/test.txt')
        self.assertEqual({r['info'] for r in rows}, {
            'town,10,20,0,000,0', 'town,30,40,0,000,0',
            'field,35,37,000,1,', 'garden,128,122,0,101,0'})
        self.assertEqual(len(rows), 4)

    def test_known_dynamic_maps_expand_from_actual_duplicate_definitions(self):
        source = '''set .@map$, strnpcinfo(4);
mes F_Navi("港口", .@map$+",197,205", "^B9062F");
izlude,1,2,4 duplicate(GuideIzlude) A 105
izlude_a,1,2,4 duplicate(GuideIzlude) B 105
'''
        rows = review.script_links(source, 'npc/re/guides/guides_izlude.txt')
        self.assertEqual([r['info'] for r in rows], ['izlude,197,205,0,000,0', 'izlude_a,197,205,0,000,0'])
        with self.assertRaisesRegex(ValueError, 'review required'):
            review.script_links(source + 'unknown,1,2,4 duplicate(GuideIzlude) C 105', 'npc/re/guides/guides_izlude.txt')

    def test_unknown_dynamic_target_and_unclosed_tag_fail_closed(self):
        for source in ('mes F_Navi("地点", .@target$);', 'mes "<NAVI>坏标签";'):
            with self.subTest(source=source), self.assertRaises(ValueError):
                review.script_links(source, 'npc/new.txt')

    def test_balanced_argument_scan_handles_parentheses_in_label(self):
        rows = review.script_links('mes F_Navi("位置(一)","town,10,20");', 'npc/test.txt')
        self.assertEqual(rows[0]['label'], '位置(一)')

    def test_normalization_preserves_semantic_flags_and_rejectable_bad_numbers(self):
        self.assertEqual(review.normalize_info(' Town.GAT , 0010 , 020,0,101,0, '), 'town,10,20,0,101,0')
        self.assertEqual(review.normalize_info('rebel_in,33 43,0,101,0'), 'rebel_in,33 43,0,101,0')
        self.assertNotEqual(review.normalize_info('town,10,20,0,101,0'), review.normalize_info('town,10,20,3,-222,1'))


class DestinationTests(unittest.TestCase):
    def setUp(self):
        self.maps = {'town', 'garden'}
        self.supported = {'town'}
        self.cache = {'town': (50, 50, bytes(2500)), 'garden': (50, 50, bytes(2500))}

    def classify(self, info, **kwargs):
        args = dict(maps=self.maps, supported=self.supported, flags=set(), cache=self.cache,
                    monsters={'stapo': 1784}, unsafe_cells={})
        args.update(kwargs)
        return review.classify(info, **args)

    def test_valid_coordinate_and_monster_are_different_operations(self):
        self.assertEqual(self.classify('town.gat,20,30,0,101,0'), {'kind': 'coordinate', 'mapName': 'town', 'x': 20, 'y': 30})
        self.assertEqual(self.classify('STAPO,0,0,3,-222,1'), {'kind': 'monster', 'monsterId': 1784, 'monsterCode': 'STAPO'})
        self.assertEqual(self.classify('STAPO,1,2,0,101,0')['kind'], 'blocked')

    def test_invalid_coordinates_are_not_clamped_or_guessed(self):
        self.assertEqual(self.classify('town,33 43,0,101,0')['reason'], 'invalid_coordinate')
        self.assertEqual(self.classify('town,20,1709,0,101,0')['reason'], 'out_of_bounds')
        self.assertEqual(self.classify('town,-1,20,0,101,0')['reason'], 'invalid_coordinate')
        self.assertEqual(self.classify('town,0,0,0,101,0')['reason'], 'default_arrival_unreviewed')

    def test_unavailable_and_forbidden_destinations_are_blocked(self):
        self.assertEqual(self.classify('garden,20,20')['reason'], 'unsupported_map')
        self.assertEqual(self.classify('new,20,20')['reason'], 'map_not_configured')
        self.assertEqual(self.classify('town,20,20', flags={'town'})['reason'], 'map_forbidden')
        self.assertEqual(self.classify('town,20,20', cache={})['reason'], 'map_cache_missing')

    def test_static_candidates_follow_twelve_cell_limit(self):
        cells = bytearray([1] * 2500)
        cells[20 + 32 * 50] = 3
        self.assertEqual(self.classify('town,20,20', cache={'town': (50, 50, bytes(cells))})['kind'], 'coordinate')
        cells[20 + 32 * 50] = 1
        cells[20 + 33 * 50] = 0
        self.assertEqual(self.classify('town,20,20', cache={'town': (50, 50, bytes(cells))})['reason'], 'no_safe_candidate')

    def test_touch_zone_and_margin_block_the_entire_search_radius(self):
        areas = review.static_touch_areas([('npc/test.txt',
            'town,20,20,0\tscript\tQuestTrigger\tHIDDEN_WARP_NPC,10,10,{\nend;\nOnTouch:\nend;\n}\n')])
        unsafe = review.unsafe_touch_cells(areas, self.cache)
        self.assertEqual(self.classify('town,20,20', unsafe_cells=unsafe)['reason'], 'no_safe_candidate')
        # An eleven-cell exclusion still leaves a legal cell at radius twelve.
        unsafe = review.unsafe_touch_cells({'town': [(11, 11, 29, 29)]}, self.cache)
        self.assertEqual(self.classify('town,20,20', unsafe_cells=unsafe)['kind'], 'coordinate')

    def test_touch_cells_ignore_walls_and_keep_exact_two_cell_margin(self):
        cells = bytearray([1] * 2500)
        cells[20 + 20 * 50] = 0
        unsafe = review.unsafe_touch_cells({'town': [(10, 10, 30, 30)]}, {'town': (50, 50, cells)})['town']
        self.assertTrue(unsafe[22 + 22 * 50])
        self.assertFalse(unsafe[23 + 20 * 50])
        self.assertFalse(unsafe[10 + 10 * 50])
        wall_only = review.unsafe_touch_cells({'town': [(10, 10, 15, 15)]}, {'town': (50, 50, cells)})['town']
        self.assertFalse(any(wall_only))

    def test_combined_touch_zones_can_remove_all_safe_candidates(self):
        unsafe = review.unsafe_touch_cells({'town': [(8, 8, 20, 32), (21, 8, 32, 32)]}, self.cache)
        self.assertEqual(self.classify('town,20,20', unsafe_cells=unsafe)['reason'], 'no_safe_candidate')

    def test_cache_decoder_checks_lengths(self):
        compressed = zlib.compress(bytes([0, 1, 3, 6]))
        data = struct.pack('<IH2x', 28 + len(compressed), 1) + struct.pack('<12shhi', b'town', 2, 2, len(compressed)) + compressed
        self.assertEqual(review.decode_cache(data)['town'], (2, 2, bytes([0, 1, 3, 6])))
        with self.assertRaises(ValueError):
            review.decode_cache(data + b'junk')
        with self.assertRaises(ValueError):
            review.decode_cache(data[:-1])


class TouchDeclarationTests(unittest.TestCase):
    def test_hidden_scripts_warps_and_duplicate_spans(self):
        areas = review.static_touch_areas([('npc/a.txt', '''-\tscript\tDisplay::Base\tHIDDEN_WARP_NPC,10,10,{
end;
}
town,20,20, 0\tduplicate(Base)\tPlaced\tHIDDEN_WARP_NPC,10,10
town,30,30,0\tduplicate(Base)\tNoInheritedSpan\tHIDDEN_WARP_NPC
town,4,5,0\twarp(HIDDEN)\tPortal\t1,2,town,40,40
town,12,13,0\tduplicate(Portal)\tPortalCopy\t2,3
town,40,40,0\tscript(CLOAKED)\tNoLabelNeeded\tHIDDEN_WARP_NPC,0,0,{
end;
}
town,45,45,0\tscript\tNegativeSpan\tHIDDEN_WARP_NPC,-1,5,{
end;
}
''')])
        self.assertEqual(areas['town'], [(10, 10, 30, 30), (3, 3, 5, 7), (10, 10, 14, 16), (40, 40, 40, 40)])

    def test_comments_and_script_body_text_are_not_declarations(self):
        source = '''// town,20,20,0\twarp\tIgnored\t10,10,town,1,1
town,5,5,0\tscript\tNormal\t100,{
mes "town,20,20,0\twarp\tAlsoIgnored\t10,10,town,1,1";
if (1) { end; }
}
'''
        self.assertEqual(review.static_touch_areas([('npc/test.txt', source)]), {})

    def test_unresolved_span_bearing_duplicate_fails_review(self):
        with self.assertRaisesRegex(ValueError, 'Unresolved NPC trigger duplicate'):
            review.static_touch_areas([('npc/test.txt', 'town,20,20,0\tduplicate(Missing)\tCopy\t100,10,10')])


class DialogueReviewTests(unittest.TestCase):
    def setUp(self):
        self.cache = {'town': (50, 50, bytes(2500)), 'inside': (50, 50, bytes(2500))}
        self.maps = set(self.cache)

    def target(self, text, *, label='商人', kind='literal', cells=None, info='town,20,20'):
        _, placements = review.static_npcs([('npc/test.txt', text)])
        cache = self.cache if cells is None else {'town': (50, 50, cells), 'inside': self.cache['inside']}
        unsafe = review.unsafe_touch_cells(review.static_touch_areas([('npc/test.txt', text)]), cache)
        entry = review.classify(info, self.maps, self.maps, set(), cache, {}, unsafe)
        return review.review_dialogue_target(entry, [{'kind': kind, 'label': label}], placements,
            self.maps, self.maps, set(), cache, unsafe)

    def test_missing_npc_and_unrelated_nearby_npc_do_not_become_teleportable(self):
        self.assertEqual(self.target('')['reason'], 'target_missing')
        text = 'town,21,20,0\tscript\t完全不同的服务\t100,{\nmes "[其他角色]"; close;\n}\n'
        self.assertEqual(self.target(text)['reason'], 'target_identity_unconfirmed')

    def test_visible_loaded_npc_requires_identity_and_connected_safe_landing(self):
        text = 'town,20,20,0\tscript\t商人#1\t100,{\nmes "[商人]"; close;\n}\n'
        result = self.target(text)
        self.assertTrue(result['allowed'])
        self.assertEqual(result['npcName'], '商人#1')
        self.assertNotEqual((result['arrivalX'], result['arrivalY']), (20, 20))

    def test_dialogue_alias_can_confirm_translated_display_name(self):
        text = 'town,20,20,0\tscript\tDisplay::Internal\t100,{\nmes "[商人]"; close;\n}\n'
        self.assertTrue(self.target(text)['allowed'])

    def test_hidden_and_conditionally_disabled_npc_remain_plain_text(self):
        for declaration, sprite, command in [('script(HIDDEN)', '100', ''),
                ('script', 'HIDDEN_WARP_NPC', ''), ('script', '32767', ''),
                ('script', '100', 'disablenpc "商人";'),
                ('script', '100', 'disablenpc strnpcinfo(0);')]:
            with self.subTest(declaration=declaration, sprite=sprite, command=command):
                text = f'town,20,20,0\t{declaration}\t商人\t{sprite},{{\nmes "[商人]"; {command} close;\n}}\n'
                self.assertFalse(self.target(text)['allowed'])

    def test_guide_facility_entrance_does_not_require_a_human_npc(self):
        text = 'town,20,20,0\twarp\tDoor\t2,2,inside,10,10\n'
        result = self.target(text, label='工具店', kind='F_Navi')
        self.assertTrue(result['allowed'])
        self.assertEqual(result['targetType'], 'entrance')
        self.assertGreater(max(abs(result['arrivalX'] - 20), abs(result['arrivalY'] - 20)), 4)
        self.assertFalse(self.target(text, label='失踪人物')['allowed'])

    def test_entrance_must_lead_to_a_loaded_walkable_destination(self):
        for destination in ['missing,10,10', 'inside,99,99', 'inside,0,0']:
            text = f'town,20,20,0\twarp\tDoor\t2,2,{destination}\n'
            self.assertFalse(self.target(text, label='工具店', kind='F_Navi')['allowed'])

    def test_wall_between_target_and_only_safe_cell_blocks_landing(self):
        cells = bytearray([1] * 2500)
        cells[20 + 20 * 50] = 0
        cells[22 + 20 * 50] = 0
        text = 'town,20,20,0\tscript\t商人\t100,{\nclose;\n}\n'
        result = self.target(text, cells=cells)
        self.assertFalse(result['allowed'])
        self.assertFalse(result['teleportAllowed'])
        self.assertEqual(result['reason'], 'target_no_connected_arrival')

    def test_diagonal_gap_is_not_a_walkable_connection(self):
        cells = bytearray([1] * 2500)
        cells[20 + 20 * 50] = 0
        cells[21 + 21 * 50] = 0
        self.assertIsNone(review.connected_safe_arrival('town', 20, 20,
            {'town': (50, 50, cells)}, {}, {(20, 20)}))

    def test_duplicate_uses_own_sprite_and_inherits_conditional_target(self):
        text = '-\tscript\t商人::Base\t100,{\nmes "[商人]"; close;\n}\ntown,20,20,0\tduplicate(Base)\t商人#1\t100\n'
        self.assertTrue(self.target(text)['allowed'])
        self.assertFalse(self.target(text + '-\tscript\tController\t-1,{\nOnInit: disablenpc "Base"; end;\n}\n')['allowed'])

    def test_forbidden_map_can_be_marked_without_enabling_teleport(self):
        text = 'town,20,20,0\tscript\t商人\t100,{\nclose;\n}\n'
        _, placements = review.static_npcs([('npc/test.txt', text)])
        entry = review.classify('town,20,20', self.maps, self.maps, {'town'}, self.cache, {}, {})
        result = review.review_dialogue_target(entry, [{'kind': 'literal', 'label': '商人'}], placements,
            self.maps, self.maps, {'town'}, self.cache, {})
        self.assertTrue(result['allowed'])
        self.assertFalse(result['teleportAllowed'])
        self.assertEqual(result['teleportReason'], 'map_forbidden')
        self.assertEqual(entry['kind'], 'blocked')

    def test_monster_without_unique_coordinate_cannot_open_dialogue_map(self):
        result = review.review_dialogue_target({'kind': 'monster', 'monsterId': 1784}, [], [],
            self.maps, self.maps, set(), self.cache, {})
        self.assertEqual(result, {'allowed': False, 'teleportAllowed': False, 'reason': 'not_coordinate'})

    def test_invalid_map_or_coordinate_cannot_be_marked(self):
        for info in ['town,999,20', 'town,1 2,20', 'town,-1,20', 'town,0,0', 'unknown,20,20']:
            with self.subTest(info=info):
                self.assertFalse(self.target('', info=info)['allowed'])

    def test_npc_label_near_portal_does_not_imply_facility_entrance(self):
        text = 'town,20,20,0\twarp\tDoor\t2,2,inside,10,10\n'
        self.assertFalse(self.target(text, label='失踪人物', kind='F_Navi')['allowed'])

    def test_command_name_in_dialogue_text_does_not_hide_npc(self):
        text = 'town,20,20,0\tscript\t商人\t100,{\nmes "请勿使用 disablenpc 命令"; close;\n}\n'
        self.assertTrue(self.target(text)['allowed'])

    def test_dynamic_visibility_name_cannot_be_mistaken_for_literal_prefix(self):
        text = 'town,20,20,0\tscript\t商人#1\t100,{\nmes "[商人]"; close;\nOnInit: disablenpc "商人#" + 1; end;\n}\n'
        self.assertFalse(self.target(text)['allowed'])

    def test_shared_info_does_not_approve_unrelated_labels(self):
        text = 'town,20,20,0\tscript\t商人\t100,{\nclose;\n}\n'
        _, placements = review.static_npcs([('npc/test.txt', text)])
        entry = review.classify('town,20,20', self.maps, self.maps, set(), self.cache, {}, {})
        result = review.review_dialogue_target(entry,
            [{'kind': 'literal', 'label': '[商人]'}, {'kind': 'literal', 'label': '[不存在的附魔专家]'}],
            placements, self.maps, self.maps, set(), self.cache, {})
        self.assertEqual(result['labels'], ['商人'])
        self.assertEqual(review.normalize_label('^0000FF[商人]^000000'), '商人')

    def test_facility_label_does_not_approve_missing_person_at_same_info(self):
        text = 'town,20,20,0\twarp\tDoor\t2,2,inside,10,10\n'
        _, placements = review.static_npcs([('npc/test.txt', text)])
        entry = review.classify('town,20,20', self.maps, self.maps, set(), self.cache, {}, {})
        result = review.review_dialogue_target(entry,
            [{'kind': 'F_Navi', 'label': '工具店'}, {'kind': 'F_Navi', 'label': '道具店员'}],
            placements, self.maps, self.maps, set(), self.cache, {})
        self.assertEqual(result['labels'], ['工具店'])

    def test_quoted_fake_declaration_does_not_create_destination(self):
        text = '-\tscript\tController\t-1,{\nmes "town,20,20,0\tscript\t商人\t100,{"; end;\n}\n'
        self.assertEqual(self.target(text)['reason'], 'target_missing')


class CommandTests(unittest.TestCase):
    def test_local_overrides_cannot_silently_diverge_from_release_baseline(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            baseline = root / 'repos/happyro-server/db/import-tmpl'
            baseline.mkdir(parents=True)
            (baseline / 'map_cache.dat').write_bytes(b'cache')
            (baseline / 'mob_db.yml').write_bytes(b'monsters')
            checker = review.Review(root)
            checker.validate_local_overrides()
            local = root / 'repos/happyro-server/db/import'
            local.mkdir()
            (local / 'map_cache.dat').write_bytes(b'cache')
            (local / 'mob_db.yml').write_bytes(b'monsters')
            checker.validate_local_overrides()
            (local / 'mob_db.yml').write_bytes(b'changed monster identities')
            with self.assertRaisesRegex(ValueError, 'differs from the reviewed release baseline'):
                checker.validate_local_overrides()

    def test_no_arguments_only_show_help(self):
        with patch.object(review.Review, 'compile', side_effect=AssertionError('must not run')), contextlib.redirect_stdout(io.StringIO()) as output:
            self.assertEqual(review.main(['--no-color']), 0)
        self.assertTrue(output.getvalue().startswith('\n'))
        self.assertTrue(output.getvalue().endswith('\n\n'))
        self.assertNotIn('\033[', output.getvalue())

    def test_check_rejects_changed_sources_or_target_decisions(self):
        baseline = {'schema': 1, 'version': 'hash', 'sources': {'npc/test.txt': 'before'}, 'entries': {}}
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / 'manifest.json'
            target.write_text(json.dumps(baseline))
            with patch.object(review.Review, 'compile', return_value=(baseline, [])), contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(review.main(['check', '--output', str(target)]), 0)
            changed = {**baseline, 'sources': {'npc/test.txt': 'after'}}
            with patch.object(review.Review, 'compile', return_value=(changed, [])), contextlib.redirect_stderr(io.StringIO()):
                self.assertEqual(review.main(['check', '--output', str(target)]), 1)
            self.assertEqual(json.loads(target.read_text()), baseline)


if __name__ == '__main__':
    unittest.main()
