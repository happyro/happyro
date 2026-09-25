"""Exercise deletion against session-local copies of the installed schema."""
import contextlib
import io
import unittest
from unittest.mock import patch

import manage


class OperationsTests(unittest.TestCase):
    def test_help_never_calls_docker(self):
        for args in ([], ['--no-color'], ['reset-characters', '--help']):
            with patch.object(manage, 'run') as run, contextlib.redirect_stdout(io.StringIO()) as output:
                self.assertEqual(manage.main(args), 0)
                run.assert_not_called()
                self.assertTrue(output.getvalue().startswith('\n'))
                self.assertTrue(output.getvalue().endswith('\n\n'))
                self.assertEqual('\033[' in output.getvalue(), '--no-color' not in args)

    def test_preview_never_deletes(self):
        with patch.object(manage, 'reset_characters') as reset:
            self.assertEqual(manage.main(['reset-characters', '--account', 'happyro']), 0)
            self.assertFalse(reset.call_args.args[0].execute)

    def test_delete_isolates_account_and_cleans_dependencies(self):
        tables = set(manage.OWNED_TABLES) | {
            'char', 'mail', 'mail_attachments', 'skill_homunculus',
            'skillcooldown_homunculus', 'skillcooldown_mercenary',
            'vending_items', 'buyingstore_items', 'login', 'storage',
        }
        # Read DDL only; build temporary tables without foreign keys, which
        # MariaDB does not support on temporary tables. Any creation error
        # aborts before fixtures or DELETE, so real tables cannot be touched.
        import re
        definitions = []
        for table in sorted(tables):
            ddl = manage.sql(f'SHOW CREATE TABLE `{table}`;').split('\t', 1)[1]
            ddl = re.sub(r',\n\s*CONSTRAINT[^\n]+', '', ddl)
            definitions.append(ddl.replace('CREATE TABLE', 'CREATE TEMPORARY TABLE', 1) + ';')
        setup = '\n'.join(definitions)
        fixtures = '''
        INSERT INTO login (account_id, userid, user_pass) VALUES (900001,'target','password'),(900002,'other','password');
        INSERT INTO `char` (char_id, account_id, name) VALUES
            (900001,900001,'Target1'),(900003,900001,'Target2'),(900002,900002,'Other');
        INSERT INTO inventory (char_id,nameid) VALUES (900001,501),(900003,501),(900002,501);
        INSERT INTO skill (char_id,id,lv) VALUES (900001,1,1),(900002,1,1);
        INSERT INTO friends (char_id,friend_id) VALUES (900002,900001);
        INSERT INTO storage (account_id,nameid) VALUES (900001,501);
        INSERT INTO mail (id,send_id,dest_id,title) VALUES
            (900001,900002,900001,'inbound'),(900002,900001,900002,'outbound');
        INSERT INTO mail_attachments (id,`index`,nameid) VALUES (900001,0,501);
        '''
        checks = '''SELECT
            (SELECT COUNT(*) FROM `char`),
            (SELECT account_id FROM `char`),
            (SELECT COUNT(*) FROM inventory),
            (SELECT COUNT(*) FROM skill),
            (SELECT COUNT(*) FROM friends),
            (SELECT COUNT(*) FROM mail_attachments),
            (SELECT send_id FROM mail),
            (SELECT COUNT(*) FROM login),
            (SELECT COUNT(*) FROM storage);'''
        result = manage.sql(setup + fixtures + manage.deletion_sql(900001) + checks)
        self.assertEqual(result, '1\t900002\t1\t1\t0\t0\t0\t2\t1')


if __name__ == '__main__':
    unittest.main()
