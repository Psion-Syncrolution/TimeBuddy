#!/usr/bin/env tsx
/**
 * Master-Benchmark-Runner: Fuehrt alle TimeBuddy-Benchmarks aus und gibt einen Report aus.
 *
 * Verwendung:
 *   npm run benchmark
 *   npm run benchmark -- --json > benchmarks/report.json
 */

import { formatBenchmarkTable, formatBenchmarkJson } from './benchmark_runner.js';
import type { BenchmarkResult } from './benchmark_runner.js';

async function runAll(): Promise<BenchmarkResult[]> {
  const results: BenchmarkResult[] = [];

  // 1. Datenbank: Lese-Operationen
  try {
    const { benchmarkDbRead } = await import('./benchmark_database.js');
    results.push(await benchmarkDbRead());
  } catch (e) {
    console.error('[WARN] db_read Benchmark fehlgeschlagen:', e);
  }

  // 2. Datenbank: Schreib-Operationen
  try {
    const { benchmarkDbWrite } = await import('./benchmark_database.js');
    results.push(await benchmarkDbWrite());
  } catch (e) {
    console.error('[WARN] db_write Benchmark fehlgeschlagen:', e);
  }

  // 3. Datenbank: Aggregation (count)
  try {
    const { benchmarkDbCount } = await import('./benchmark_database.js');
    results.push(await benchmarkDbCount());
  } catch (e) {
    console.error('[WARN] db_count Benchmark fehlgeschlagen:', e);
  }

  // 4. Kalender-Logik: Monatsraster
  try {
    const { benchmarkCalendarMonth } = await import('./benchmark_calendar.js');
    results.push(await benchmarkCalendarMonth());
  } catch (e) {
    console.error('[WARN] calendar_month Benchmark fehlgeschlagen:', e);
  }

  // 5. Kalender-Logik: Wochenrange
  try {
    const { benchmarkCalendarWeek } = await import('./benchmark_calendar.js');
    results.push(await benchmarkCalendarWeek());
  } catch (e) {
    console.error('[WARN] calendar_week Benchmark fehlgeschlagen:', e);
  }

  // 6. Kalender-Logik: Gruppierung nach Datum
  try {
    const { benchmarkCalendarGroupByDate } = await import('./benchmark_calendar.js');
    results.push(await benchmarkCalendarGroupByDate());
  } catch (e) {
    console.error('[WARN] calendar_group_by_date Benchmark fehlgeschlagen:', e);
  }

  // 7. Startup: Modul-Imports
  try {
    const { benchmarkStartup } = await import('./benchmark_startup.js');
    results.push(await benchmarkStartup());
  } catch (e) {
    console.error('[WARN] startup Benchmark fehlgeschlagen:', e);
  }

  // 8. Dateisystem: Lese-Operationen
  try {
    const { benchmarkFileRead } = await import('./benchmark_startup.js');
    results.push(await benchmarkFileRead());
  } catch (e) {
    console.error('[WARN] file_read Benchmark fehlgeschlagen:', e);
  }

  return results;
}

async function main(): Promise<void> {
  const jsonMode = process.argv.includes('--json');
  const results = await runAll();

  if (jsonMode) {
    console.log(formatBenchmarkJson(results));
  } else {
    console.log(formatBenchmarkTable(results));
  }
}

main().catch((err) => {
  console.error('Benchmark fehlgeschlagen:', err);
  process.exit(1);
});
