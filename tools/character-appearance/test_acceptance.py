"""Test evidence assertions without launching browsers or touching game state."""
import importlib.util
from pathlib import Path
from types import SimpleNamespace
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location('appearance_acceptance', Path(__file__).with_name('acceptance.py'))
audit = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(audit)


class EvidenceChecks(unittest.TestCase):
    def setUp(self):
        self.args = SimpleNamespace(self_port=9351, observer_port=9361, sex=1,
                                    resource_paths={(7, 1, 'spr'): 'knight.spr', (7, 1, 'act'): 'knight.act'})
        self.loaded = {'appearance': 1, 'renderJob': 7, 'bodyPathsPresent': True,
                       'bodySprite': 'knight.spr', 'bodyAction': 'knight.act', 'failed': False}

    def test_both_clients_must_finish_the_expected_body(self):
        with patch.object(audit, 'entity', side_effect=[self.loaded, self.loaded]):
            result = audit.wait_render(self.args, 12, 1, 7)
        self.assertEqual(result['observer']['bodyAction'], 'knight.act')

    def test_new_render_job_with_old_body_is_not_a_pass(self):
        stale = dict(self.loaded, bodySprite='old.spr')
        with patch.object(audit, 'entity', side_effect=[self.loaded, stale]), \
             patch.object(audit.time, 'monotonic', side_effect=[0, 1, 16]), \
             patch.object(audit.time, 'sleep'), self.assertRaisesRegex(AssertionError, 'synchronization timeout'):
            audit.wait_render(self.args, 12, 1, 7)

    def test_missing_observer_never_counts_as_synchronized(self):
        with patch.object(audit, 'entity', side_effect=[self.loaded, None]), \
             patch.object(audit.time, 'monotonic', side_effect=[0, 1, 16]), \
             patch.object(audit.time, 'sleep'), self.assertRaisesRegex(AssertionError, 'synchronization timeout'):
            audit.wait_render(self.args, 12, 1, 7)

    def test_network_errors_do_not_expose_session_tokens(self):
        raw = 'POST failed: x-happyro-auth-token: example-secret\n next header'
        self.assertNotIn('example-secret', audit.redact_error(raw))
        self.assertIn('[REDACTED]', audit.redact_error(raw))

    def test_rate_limit_is_not_a_qualification_rejection(self):
        with patch.object(audit, 'control', return_value={'status': 429, 'body': {'message': 'Too many requests'}}), \
             self.assertRaisesRegex(AssertionError, 'qualification rejection'):
            audit.reject_choice(9351, 4)

    def test_correct_qualification_reason_is_recorded(self):
        response = {'status': 409, 'body': {'error': {'code': 'appearance_job_required'}}}
        with patch.object(audit, 'control', return_value=response):
            self.assertEqual(audit.reject_choice(9351, 4), response)

    def test_gameplay_state_changes_are_not_hidden_by_appearance(self):
        baseline = {'job_id': 4252, 'str': 123, 'zeny': 5000, 'riding': [{'kind': 'dragon', 'active': True}]}
        changed = dict(baseline, zeny=4999)
        self.assertNotEqual(audit.invariant(baseline), audit.invariant(changed))
        transient = dict(baseline, hp=40, x=20)
        self.assertEqual(audit.invariant(baseline), audit.invariant(transient))


if __name__ == '__main__':
    unittest.main()
