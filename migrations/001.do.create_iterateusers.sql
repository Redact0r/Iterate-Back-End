CREATE TABLE "iterateusers" (
  "userid" SERIAL PRIMARY KEY,
  "user_name" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "full_name" TEXT NOT NULL,
  "nickname" TEXT NOT NULL,
  "date_created" TIMESTAMP NOT NULL DEFAULT now(),
  "streak" INTEGER NULL,
  "last_login" TIMESTAMP NULL
);