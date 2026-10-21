-- HappyRO optional development fixture: happyro2 / happyro.
-- PACKETVER=20211103, Renewal. Run against the game database with writers stopped.
-- Explicit replay only: this fixture is not part of production database startup.
-- Existing matching fixtures are left unchanged; other same-name accounts fail.
-- Source baseline: happyro-server f15a55742 (2026-10-22).
-- Sources: happyro-server/sql-files/main.sql, src/common/mmo.hpp,
-- src/map/{status.hpp,pet.cpp,homunculus.cpp}, db/{mercenary_db.yml,re/*.yml}.
SET NAMES utf8mb4;

DROP PROCEDURE IF EXISTS happyro_seed_happyro2;
DELIMITER //
CREATE PROCEDURE happyro_seed_happyro2()
seed: BEGIN
    DECLARE fixture_account INT UNSIGNED DEFAULT 0;
    DECLARE smith_id INT UNSIGNED;
    DECLARE pet_char_id INT UNSIGNED;
    DECLARE merc_char_id INT UNSIGNED;
    DECLARE hom_char_id INT UNSIGNED;
    DECLARE companion_id INT UNSIGNED;
    DECLARE created_account BOOLEAN DEFAULT FALSE;

    -- rAthena uses MyISAM for these tables; ROLLBACK cannot undo the fixture.
    -- Remove only rows owned by the account created by this invocation on error.
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        IF created_account THEN
            DELETE sh FROM skill_homunculus sh
                JOIN homunculus h ON h.homun_id = sh.homun_id
                JOIN `char` c ON c.char_id = h.char_id WHERE c.account_id = fixture_account;
            DELETE h FROM homunculus h JOIN `char` c ON c.char_id = h.char_id
                WHERE c.account_id = fixture_account;
            DELETE m FROM mercenary m JOIN `char` c ON c.char_id = m.char_id
                WHERE c.account_id = fixture_account;
            DELETE o FROM mercenary_owner o JOIN `char` c ON c.char_id = o.char_id
                WHERE c.account_id = fixture_account;
            DELETE FROM pet WHERE account_id = fixture_account;
            DELETE i FROM inventory i JOIN `char` c ON c.char_id = i.char_id
                WHERE c.account_id = fixture_account;
            DELETE i FROM cart_inventory i JOIN `char` c ON c.char_id = i.char_id
                WHERE c.account_id = fixture_account;
            DELETE s FROM skill s JOIN `char` c ON c.char_id = s.char_id
                WHERE c.account_id = fixture_account;
            DELETE h FROM hotkey h JOIN `char` c ON c.char_id = h.char_id
                WHERE c.account_id = fixture_account;
            DELETE FROM sc_data WHERE account_id = fixture_account;
            DELETE FROM `char` WHERE account_id = fixture_account;
            DELETE FROM login WHERE account_id = fixture_account;
        END IF;
        RESIGNAL;
    END;

    SELECT COALESCE(MAX(account_id), 0) INTO fixture_account FROM login WHERE userid = 'happyro2';
    IF fixture_account <> 0 THEN
        IF (SELECT COUNT(*) FROM login WHERE account_id = fixture_account
            AND email = 'happyro2-fixture@localhost') <> 1
            OR (SELECT COUNT(*) FROM `char` WHERE account_id = fixture_account) <> 4
            OR (SELECT COUNT(*) FROM `char` WHERE account_id = fixture_account AND (
                (char_num = 0 AND name = '二号铁匠' AND class = 10) OR
                (char_num = 1 AND name = '二号宠物' AND class = 1) OR
                (char_num = 2 AND name = '二号佣兵' AND class = 1) OR
                (char_num = 3 AND name = '二号炼金' AND class = 18))) <> 4 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'happyro2 already exists but is not the complete fixture; no changes made';
        END IF;
        SELECT 'happyro2 already exists; all saved progress preserved' AS result;
        LEAVE seed;
    END IF;
    IF EXISTS (SELECT 1 FROM `char` WHERE name IN ('二号铁匠','二号宠物','二号佣兵','二号炼金')) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A fixture character name is already in use; no changes made';
    END IF;

    INSERT INTO login (userid,user_pass,sex,email,group_id)
        VALUES ('happyro2','happyro','M','happyro2-fixture@localhost',0);
    SET fixture_account = LAST_INSERT_ID();
    SET created_account = TRUE;

    INSERT INTO `char` (account_id,char_num,name,class,sex,base_level,job_level,zeny,
        str,agi,vit,`int`,dex,luk,max_hp,hp,max_sp,sp,hair,weapon,
        last_map,last_x,last_y,save_map,save_x,save_y)
    VALUES
        (fixture_account,0,'二号铁匠',10,'M',99,50,1000000,70,60,40,30,50,10,5000,5000,500,500,1,2,'prontera',164,185,'prontera',159,189),
        (fixture_account,1,'二号宠物',1,'M',99,50,1000000,70,60,40,30,50,10,5000,5000,500,500,2,2,'prontera',164,185,'prontera',159,189),
        (fixture_account,2,'二号佣兵',1,'M',99,50,1000000,70,60,40,30,50,10,5000,5000,500,500,3,2,'prontera',164,185,'prontera',159,189),
        (fixture_account,3,'二号炼金',18,'M',99,50,1000000,60,40,50,70,50,10,5000,5000,500,500,4,2,'prontera',164,185,'prontera',159,189);
    SELECT char_id INTO smith_id FROM `char` WHERE account_id=fixture_account AND char_num=0;
    SELECT char_id INTO pet_char_id FROM `char` WHERE account_id=fixture_account AND char_num=1;
    SELECT char_id INTO merc_char_id FROM `char` WHERE account_id=fixture_account AND char_num=2;
    SELECT char_id INTO hom_char_id FROM `char` WHERE account_id=fixture_account AND char_num=3;

    INSERT INTO skill (char_id,id,lv,flag)
        SELECT char_id,1,9,0 FROM `char` WHERE account_id=fixture_account;
    INSERT INTO skill (char_id,id,lv,flag) VALUES
        (smith_id,36,10,0),(smith_id,37,10,0),(smith_id,38,10,0),
        (smith_id,39,10,0),(smith_id,40,1,0),(smith_id,41,10,0),(smith_id,42,10,0),
        (pet_char_id,2,10,0),(pet_char_id,4,4,0),(pet_char_id,5,10,0),
        (pet_char_id,6,5,0),(pet_char_id,7,10,0),(pet_char_id,8,10,0),
        (merc_char_id,2,10,0),(merc_char_id,4,4,0),(merc_char_id,5,10,0),
        (merc_char_id,6,5,0),(merc_char_id,7,10,0),(merc_char_id,8,10,0),
        (hom_char_id,36,10,0),(hom_char_id,37,10,0),(hom_char_id,38,10,0),
        (hom_char_id,39,10,0),(hom_char_id,40,1,0),(hom_char_id,41,10,0),
        (hom_char_id,42,10,0),(hom_char_id,238,1,0),(hom_char_id,243,1,0),
        (hom_char_id,244,1,0),(hom_char_id,247,5,0);

    INSERT INTO inventory (char_id,nameid,amount,equip,identify)
        SELECT char_id,1101,1,2,1 FROM `char` WHERE account_id=fixture_account;
    INSERT INTO inventory (char_id,nameid,amount,identify)
        SELECT char_id,501,100,1 FROM `char` WHERE account_id=fixture_account;
    INSERT INTO inventory (char_id,nameid,amount,identify)
        SELECT char_id,505,50,1 FROM `char` WHERE account_id=fixture_account;

    -- NEW_CARTS uses SC_PUSH_CART=518, not the old char.option bit.
    INSERT INTO sc_data (account_id,char_id,type,tick,val1,val2,val3,val4)
        VALUES (fixture_account,smith_id,518,-1,1,0,0,0);
    INSERT INTO cart_inventory (char_id,nameid,amount,identify) VALUES
        (smith_id,501,100,1),(smith_id,505,50,1),(smith_id,909,100,1),(smith_id,1101,1,1);
    INSERT INTO hotkey (char_id,hotkey,type,itemskill_id,skill_lvl)
        VALUES (smith_id,0,1,41,10),(smith_id,1,0,501,0),(smith_id,2,0,505,0);

    -- Active Poring plus its hidden, correctly linked egg for return/hatching tests.
    INSERT INTO pet (class,name,account_id,char_id,level,egg_id,intimate,hungry,rename_flag,incubate)
        VALUES (1002,'波利',fixture_account,pet_char_id,1,9001,950,75,1,0);
    SET companion_id = LAST_INSERT_ID();
    UPDATE `char` SET pet_id=companion_id WHERE char_id=pet_char_id;
    INSERT INTO inventory (char_id,nameid,amount,identify,attribute,card0,card1,card2,card3)
        VALUES (pet_char_id,9001,1,1,1,256,companion_id & 65535,companion_id >> 16,11);
    INSERT INTO inventory (char_id,nameid,amount,identify)
        VALUES (pet_char_id,531,100,1),(pet_char_id,643,10,1);

    -- Mina / MER_ARCHER01: native HP/SP and a 30-minute online contract.
    INSERT INTO mercenary (char_id,class,hp,sp,kill_counter,life_time)
        VALUES (merc_char_id,6017,256,200,0,1800000);
    SET companion_id = LAST_INSERT_ID();
    INSERT INTO mercenary_owner (char_id,merc_id,arch_calls,arch_faith)
        VALUES (merc_char_id,companion_id,1,0);
    INSERT INTO inventory (char_id,nameid,amount,identify)
        VALUES (merc_char_id,12153,10,1),(merc_char_id,12184,30,1),(merc_char_id,12185,30,1);

    -- Amistr=6002, level 50. Deterministic legal growth from db/re/homunculus_db.yml:
    -- 49 levels of HP+105, SP+2, and fixed-point STR+14/AGI+12/VIT+12/INT+5/DEX+11/LUK+11.
    -- Intimacy uses hundredths; base stats use tenths. 16 earned skill points, 15 spent.
    INSERT INTO homunculus (char_id,class,name,level,intimacy,hunger,str,agi,vit,`int`,dex,luk,
        hp,max_hp,sp,max_sp,skill_point,alive,rename_flag,vaporize)
        VALUES (hom_char_id,6002,'Amistr',50,75000,75,886,758,938,355,779,659,
            5465,5465,108,108,1,1,0,0);
    SET companion_id = LAST_INSERT_ID();
    UPDATE `char` SET homun_id=companion_id WHERE char_id=hom_char_id;
    INSERT INTO skill_homunculus (homun_id,id,lv)
        VALUES (companion_id,8005,5),(companion_id,8006,5),(companion_id,8007,5);
    INSERT INTO inventory (char_id,nameid,amount,identify)
        VALUES (hom_char_id,912,100,1),(hom_char_id,7140,10,1),(hom_char_id,7142,10,1);
    INSERT INTO hotkey (char_id,hotkey,type,itemskill_id,skill_lvl)
        VALUES (hom_char_id,0,1,244,1),(hom_char_id,1,1,243,1),(hom_char_id,2,1,247,5);

    SELECT 'happyro2 created with four test characters' AS result;
END//
DELIMITER ;
CALL happyro_seed_happyro2();
DROP PROCEDURE happyro_seed_happyro2;
