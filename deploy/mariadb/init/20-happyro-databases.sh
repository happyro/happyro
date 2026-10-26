#!/usr/bin/env bash
set -euo pipefail

mariadb_root=(mariadb --protocol=socket --user=root "--password=$MARIADB_ROOT_PASSWORD")

"${mariadb_root[@]}" <<SQL
CREATE DATABASE IF NOT EXISTS \`$HAPPYRO_SERVER_LOG_DB_NAME\`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON \`$HAPPYRO_SERVER_LOG_DB_NAME\`.* TO '$MARIADB_USER'@'%';
FLUSH PRIVILEGES;
SQL

"${mariadb_root[@]}" "$MARIADB_DATABASE" < /opt/rathena/sql/main.sql
"${mariadb_root[@]}" "$MARIADB_DATABASE" < /opt/rathena/sql/web.sql
"${mariadb_root[@]}" "$MARIADB_DATABASE" < /opt/rathena/sql/upgrades/upgrade_20261012_sessions.sql
"${mariadb_root[@]}" "$MARIADB_DATABASE" < /opt/rathena/sql/roulette_default_data.sql
"${mariadb_root[@]}" "$HAPPYRO_SERVER_LOG_DB_NAME" < /opt/rathena/sql/logs.sql

"${mariadb_root[@]}" "$MARIADB_DATABASE" <<SQL
UPDATE login
SET userid = '$HAPPYRO_SERVER_INTERSERVER_USERNAME',
    user_pass = '$HAPPYRO_SERVER_INTERSERVER_PASSWORD',
    sex = 'S'
WHERE account_id = 1;
SQL

# Seed the documented GM account while keeping the inter-server account separate.
"${mariadb_root[@]}" "$MARIADB_DATABASE" <<SQL
INSERT INTO login (userid, user_pass, sex, email, group_id)
SELECT 'happyro', 'happyro', 'M', 'happyro@localhost', 99
WHERE NOT EXISTS (SELECT 1 FROM login WHERE userid = 'happyro');
UPDATE login SET user_pass = 'happyro', sex = 'M', group_id = 99
WHERE userid = 'happyro';
SQL

# This entrypoint runs only for an empty data directory. Never seed existing saves.
"${mariadb_root[@]}" --default-character-set=utf8mb4 "$MARIADB_DATABASE" <<'SQL'
SET @account_id = (SELECT account_id FROM login WHERE userid = 'happyro');
INSERT INTO `char` (
  account_id, char_num, name, class, sex, base_level, job_level, zeny,
  str, agi, vit, `int`, dex, luk, max_hp, hp, max_sp, sp,
  hair, weapon, last_map, last_x, last_y, save_map, save_x, save_y
) VALUES (
  @account_id, 0, '罗安', 1, 'M', 99, 50, 10000,
  70, 60, 40, 10, 40, 1, 5758, 5758, 228, 228,
  1, 2, 'prontera', 164, 185, 'prontera', 159, 189
);
SET @char_id = LAST_INSERT_ID();

INSERT INTO skill (char_id, id, lv, flag) VALUES
  (@char_id, 1, 9, 0),  -- Basic Skill
  (@char_id, 2, 10, 0), -- Sword Mastery
  (@char_id, 4, 4, 0),  -- Increase HP Recovery
  (@char_id, 5, 10, 0), -- Bash
  (@char_id, 6, 5, 0),  -- Provoke
  (@char_id, 7, 10, 0), -- Magnum Break
  (@char_id, 8, 10, 0); -- Endure
INSERT INTO inventory (char_id, nameid, amount, equip, identify) VALUES
  (@char_id, 1101, 1, 2, 1),
  (@char_id, 501, 100, 0, 1),
  (@char_id, 505, 100, 0, 1);

-- A real incubating pet record is required; an unlinked egg cannot be hatched.
INSERT INTO pet (
  class, name, account_id, char_id, level, egg_id,
  intimate, hungry, rename_flag, incubate
) VALUES (1002, '波利', @account_id, @char_id, 1, 9001, 950, 100, 1, 1);
SET @pet_id = LAST_INSERT_ID();
-- CARD0_PET, low/high pet ID words, named flag + loyal intimacy display.
INSERT INTO inventory (char_id, nameid, amount, identify, card0, card1, card2, card3)
VALUES (@char_id, 9001, 1, 1, 256, @pet_id & 65535, @pet_id >> 16, 11);

INSERT INTO hotkey (char_id, hotkey, type, itemskill_id, skill_lvl) VALUES
  (@char_id, 0, 1, 5, 10),
  (@char_id, 1, 1, 7, 10),
  (@char_id, 2, 1, 6, 5),
  (@char_id, 3, 1, 8, 10),
  (@char_id, 4, 0, 501, 0),
  (@char_id, 5, 0, 505, 0);
SQL
