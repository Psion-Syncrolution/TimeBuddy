-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
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
);

-- CreateTable
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
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
