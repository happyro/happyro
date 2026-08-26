INSERT INTO `login` (`account_id`, `userid`, `user_pass`, `sex`, `email`)
VALUES
  (2000000, 'happyro1', 'happyro', 'M', 'happyro1@demo.invalid'),
  (2000001, 'happyro2', 'happyro', 'F', 'happyro2@demo.invalid'),
  (2000002, 'happyro3', 'happyro', 'M', 'happyro3@demo.invalid'),
  (2000003, 'happyro4', 'happyro', 'F', 'happyro4@demo.invalid'),
  (2000004, 'happyro5', 'happyro', 'M', 'happyro5@demo.invalid'),
  (2000005, 'happyro6', 'happyro', 'F', 'happyro6@demo.invalid'),
  (2000006, 'happyro7', 'happyro', 'M', 'happyro7@demo.invalid'),
  (2000007, 'happyro8', 'happyro', 'F', 'happyro8@demo.invalid'),
  (2000008, 'happyro9', 'happyro', 'M', 'happyro9@demo.invalid')
ON DUPLICATE KEY UPDATE
  `userid` = VALUES(`userid`),
  `user_pass` = VALUES(`user_pass`),
  `sex` = VALUES(`sex`),
  `email` = VALUES(`email`),
  `group_id` = 0,
  `state` = 0,
  `unban_time` = 0,
  `expiration_time` = 0;
