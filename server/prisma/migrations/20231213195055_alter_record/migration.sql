-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Record" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Record" ("createdAt", "id", "points", "updatedAt", "username") SELECT "createdAt", "id", "points", "updatedAt", "username" FROM "Record";
DROP TABLE "Record";
ALTER TABLE "new_Record" RENAME TO "Record";
CREATE UNIQUE INDEX "Record_username_key" ON "Record"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
