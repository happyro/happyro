"""Catch drift between deployment documentation and the actual consumers."""
import unittest
from tools.configuration.environment import load, validate


class EnvironmentRegistryTest(unittest.TestCase):
    def test_rejects_incorrect_documented_game_factory_default(self):
        fields = load()
        fields['HAPPYRO_GAME_BASE_EXP_RATE_PERCENT']['default'] = 999
        self.assertIn('Game factory default drift: HAPPYRO_GAME_BASE_EXP_RATE_PERCENT', validate(fields))

    def test_rejects_incorrect_client_default_and_api_boolean_type(self):
        fields = load()
        client = next(name for name, field in fields.items() if field['mode'] == 'client-default')
        fields[client]['default'] = None
        fields['HAPPYRO_REGISTRATION_DEFAULT_GROUP_EDITABLE']['type'] = 'string'
        problems = validate(fields)
        self.assertIn(f'Client schema drift: {client}.default', problems)
        self.assertIn('API schema drift: HAPPYRO_REGISTRATION_DEFAULT_GROUP_EDITABLE', problems)


if __name__ == '__main__':
    unittest.main()
