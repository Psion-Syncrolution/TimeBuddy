import path from 'node:path';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// Prisma 7: Der Client braucht einen Driver Adapter. better-sqlite3 erwartet
// absolute Pfade — die dokumentierte Konvention DATABASE_URL="file:./dev.db"
// (relativ zum prisma/-Ordner) wird hier daher absolut gelöst.
function resolveDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL ist nicht gesetzt (siehe .env / .docs/SETUP.md).');
  }
  if (url.startsWith('file:')) {
    const dbPath = url.slice('file:'.length);
    return `file:${path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), 'prisma', dbPath)}`;
  }
  return url;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: resolveDatabaseUrl() }),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
