/**
 * Test-Setup: legt eine isolierte SQLite-Testdatenbank an, BEVOR der
 * Prisma-Singleton (@/lib/prisma) geladen wird.
 *
 * WICHTIG: DATABASE_URL muss vor dem ersten Import von @/lib/prisma gesetzt
 * sein — der Singleton liest die Variable beim Modul-Laden.
 * Die Tests laufen sequenziell (fileParallelism: false in vitest.config.ts),
 * daher ist eine gemeinsame Test-DB pro Prozess sicher.
 */
import fs from 'node:fs';
import path from 'node:path';

const TEST_DB_PATH = path.resolve(process.cwd(), 'prisma', 'test.db');

process.env.DATABASE_URL = `file:${TEST_DB_PATH}`;

const globalStore = globalThis as unknown as { __timebuddyTestDbReady?: boolean };

if (!globalStore.__timebuddyTestDbReady) {
  // Frische DB pro Testlauf.
  if (fs.existsSync(TEST_DB_PATH)) fs.unlinkSync(TEST_DB_PATH);

  const { default: prisma } = await import('@/lib/prisma');

  // Schema spiegelt prisma/migrations/20260724193111_init/migration.sql.
  // ACHTUNG: Der Prisma-SQLite-Connector fuehrt bei $executeRawUnsafe nur die
  // ERSTE Anweisung aus — daher eine Aussage pro Aufruf.
  await prisma.$executeRawUnsafe(`
    CREATE TABLE "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL,
      "passwordHash" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE "Termin" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "titel" TEXT NOT NULL,
      "datum" DATETIME NOT NULL,
      "uhrzeit" TEXT NOT NULL,
      "beschreibung" TEXT,
      "userId" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "Termin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE "Erinnerung" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "terminId" TEXT NOT NULL,
      "erinnerung" TEXT NOT NULL,
      "datum" DATETIME NOT NULL,
      "uhrzeit" TEXT NOT NULL,
      "beschreibung" TEXT,
      "userId" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Erinnerung_terminId_fkey" FOREIGN KEY ("terminId") REFERENCES "Termin" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "Erinnerung_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX "User_email_key" ON "User"("email")
  `);

  // Aufräumen nach dem Testlauf (test.db ist gitignored).
  process.on('exit', () => {
    try {
      if (fs.existsSync(TEST_DB_PATH)) fs.unlinkSync(TEST_DB_PATH);
    } catch {
      /* noop */
    }
  });

  globalStore.__timebuddyTestDbReady = true;
}
