BEGIN;

TRUNCATE
"iterateusers",
"userworks";

INSERT INTO "iterateusers" ("userid", "user_name", "password", "full_name", "nickname", "streak")
VALUES
  (1, 'mistertest',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    'Mr. Test', 'Tester', 2
  ),
  (2, 'Goblinman', '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG', 'Gorbol the Humie Slayer', 'Gobz', 37);

INSERT INTO "userworks" ("id", "title", "content", "wordcount", "user_id")
VALUES
  ('611eff82-1d2f-444c-9d12-db5d9608bff2', 'Mr. Test''s big day', 'I had the best day today, testing Iterate software...', 8, 1),
  ('3b79ca86-e62f-4c6f-b39d-8c3a731481a0', 'Gobbo''s big bust', 'I slayed dem ''umies wif me grog-filled ax!', 8, 2);
COMMIT;
