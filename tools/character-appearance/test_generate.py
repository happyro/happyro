"""Contract checks for configuration rejection and generated-catalog drift."""
import contextlib
import copy
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location('appearance_generator', Path(__file__).with_name('generate.py'))
generator = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(generator)


class CatalogTests(unittest.TestCase):
    def setUp(self):
        self.data = json.loads((generator.ROOT / generator.SOURCE).read_text())

    def branch(self, key):
        return next(b for b in self.data['branches'] if b['key'] == key)

    def rejected(self, fragment):
        with self.assertRaisesRegex(ValueError, fragment):
            generator.render(self.data)

    def test_reviewed_source_has_thirteen_branches_thirty_nine_choices(self):
        generator.validate(self.data)
        self.assertEqual(len(self.data['branches']), 13)
        self.assertEqual(sorted(o['id'] for b in self.data['branches'] for o in b['options']), list(range(1, 40)))
        self.assertEqual([o['id'] for o in self.branch('knight')['options']], [1, 2, 3])
        self.assertEqual([o['id'] for o in self.branch('crusader')['options']], [4, 5, 6])
        self.assertEqual(self.branch('bard')['sex'], 'male')
        self.assertEqual(self.branch('dancer')['sex'], 'female')

    def test_cross_branch_option_body_rejected(self):
        self.branch('hunter')['options'][0]['job'] = self.branch('knight')['options'][0]['job']
        self.rejected('cross-branch')

    def test_duplicate_job_and_choice_ids_rejected(self):
        original = copy.deepcopy(self.data)
        self.branch('hunter')['jobs'][0]['id'] = self.branch('knight')['jobs'][0]['id']
        self.rejected('Duplicate job|cross-branch')
        self.data = original
        self.branch('hunter')['options'][0]['id'] = 1
        self.rejected('Duplicate option ID')

    def test_stage_mismatch_and_current_stage_rejected(self):
        original = copy.deepcopy(self.data)
        self.branch('hunter')['options'][0]['stage'] = 2
        self.rejected('wrong stage')
        self.data = original
        self.branch('hunter')['options'][0]['stage'] = 4
        self.rejected('Invalid option stage')

    def test_mount_cannot_pair_another_body(self):
        self.branch('knight')['options'][0]['mountedJob'] = 4014
        self.rejected('Invalid bound mount')

    def test_mount_cannot_cross_branch_or_stage(self):
        mount = next(j for j in self.branch('hunter')['jobs'] if 'mountedOf' in j)
        mount['mountedOf'] = 7
        self.rejected('Invalid mounted base')

    def test_existing_mount_cannot_be_silently_removed(self):
        option = self.branch('knight')['options'][0]
        option['mountedJob'] = option['mountLabel'] = None
        self.rejected('Missing bound mount')

    def test_sex_and_wire_capacity_are_strict(self):
        original = copy.deepcopy(self.data)
        for bad in ['both', 1, None, []]:
            self.data = copy.deepcopy(original)
            self.branch('hunter')['sex'] = bad
            self.rejected('Invalid sex')
        for bad in [0, 65536, -1, True, '7']:
            self.data = copy.deepcopy(original)
            self.branch('hunter')['options'][0]['id'] = bad
            self.rejected('uint16')

    def test_generated_outputs_share_source_digest(self):
        outputs = generator.render(self.data)
        digests = [value.split('SHA-256: ')[1].split('.')[0] for value in outputs.values()]
        self.assertEqual(len(set(digests)), 1)
        self.assertIn('nullptr', outputs['server'])
        self.assertIn('mountedJob: 0', outputs['client'])
        self.assertIn("case 0, 1, 2, 3", outputs['admin'])

    def test_check_reports_each_missing_or_modified_catalog_without_writes(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / generator.SOURCE).parent.mkdir()
            (root / generator.SOURCE).write_text(json.dumps(self.data))
            with self.assertRaisesRegex(ValueError, 'catalog drift'):
                generator.run(root, 'check')
            generator.run(root, 'generate')
            generator.run(root, 'check')
            for path in generator.TARGETS.values():
                target = root / path
                original = target.read_bytes()
                target.write_bytes(original + b'\n')
                with self.assertRaisesRegex(ValueError, path.name.replace('.', r'\.')):
                    generator.run(root, 'check')
                self.assertEqual(target.read_bytes(), original + b'\n')
                target.write_bytes(original)
            generator.run(root, 'check')

    def test_no_argument_only_prints_colored_help(self):
        with contextlib.redirect_stdout(io.StringIO()) as output:
            self.assertEqual(generator.main([]), 0)
        result = output.getvalue()
        self.assertTrue(result.startswith('\n') and result.endswith('\n\n'))
        self.assertIn('\033[1;36m', result)
        self.assertIn('generate', result)
        self.assertNotIn('\033', generator.help_text(False))


if __name__ == '__main__':
    unittest.main()
