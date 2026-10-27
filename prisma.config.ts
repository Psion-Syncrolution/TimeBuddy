import path from 'node:path';
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// Prisma 7: Die CLI liest ihre Konfiguration aus dieser Datei (statt aus dem
// datasource-Block im Schema). .env wird hier explizit geladen — die CLI lädt
// Umgebungsvariablen seit v7 nicht mehr automatisch.
//
// Relative file:-Pfade werden auf den prisma/-Ordner bezogen aufgelöst, um die
// dokumentierte Konvention DATABASE_URL="file:./dev.db" (→ prisma/dev.db) zu
// wahren — identisch zum Verhalten von src/lib/prisma.ts.
function resolveDatabaseUrl(): string {
  const url = env('DATABASE_URL');
  if (url.startsWith('file:')) {
    const dbPath = url.slice('file:'.length);
    return `file:${path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), 'prisma', dbPath)}`;
  }
  return url;
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: resolveDatabaseUrl(),
  },
});
