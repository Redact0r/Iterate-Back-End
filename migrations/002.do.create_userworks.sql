CREATE TABLE "userworks" (
  "id" uuid NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "wordcount" INTEGER NOT NULL,
  "user_id" INTEGER REFERENCES "iterateusers"(userid)
);