/**
 * Datenbank-Benchmarks: Prisma Lese-/Schreiboperationen gegen SQLite.
 *
 * Legt einen temporären Benchmark-User an und raeumt danach auf,
 * damit die Benchmarks idempotent sind.
 */

import prisma from '../lib/prisma';
import { benchmark } from './benchmark_runner.js';
import type { BenchmarkResult } from './benchmark_runner.js';

const BENCHMARK_USER_EMAIL = 'benchmark@timebuddy.local';

async function ensureBenchmarkUser(): Promise<string> {
  const existing = await prisma.user.findUnique({ where: { email: BENCHMARK_USER_EMAIL } });
  if (existing) return existing.id;

  const user = await prisma.user.create({
    data: {
      email: BENCHMARK_USER_EMAIL,
      passwordHash: 'benchmark-user-kein-echtes-passwort',
    },
  });
  return user.id;
}

async function cleanupBenchmarkUser(userId: string): Promise<void> {
  // Cascade loescht Termine + Erinnerungen automatisch.
  await prisma.user.deleteMany({ where: { id: userId } });
}

/** Lese-Benchmark: findMany fuer alle Termine eines Users. */
export async function benchmarkDbRead(): Promise<BenchmarkResult> {
  const userId = await ensureBenchmarkUser();

  try {
    return await benchmark(
      'db_read (findMany termine)',
      async () => {
        await prisma.termin.findMany({ where: { userId } });
      },
      100,
    );
  } finally {
    await cleanupBenchmarkUser(userId);
  }
}

/** Schreib-Benchmark: create + delete eines Termins (Roundtrip). */
export async function benchmarkDbWrite(): Promise<BenchmarkResult> {
  const userId = await ensureBenchmarkUser();

  try {
    return await benchmark(
      'db_write (create+delete termin)',
      async () => {
        const termin = await prisma.termin.create({
          data: {
            titel: 'Benchmark-Termin',
            datum: new Date('2026-01-15T00:00:00Z'),
            uhrzeit: '09:00',
            userId,
          },
        });
        await prisma.termin.delete({ where: { id: termin.id } });
      },
      100,
    );
  } finally {
    await cleanupBenchmarkUser(userId);
  }
}

/** Aggregations-Benchmark: count-Abfrage (Statistik-Pfad). */
export async function benchmarkDbCount(): Promise<BenchmarkResult> {
  const userId = await ensureBenchmarkUser();

  try {
    return await benchmark(
      'db_count (statistik)',
      async () => {
        await prisma.termin.count({ where: { userId } });
      },
      100,
    );
  } finally {
    await cleanupBenchmarkUser(userId);
  }
}
