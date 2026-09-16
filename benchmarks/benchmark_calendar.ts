/**
 * Kalender-Logik-Benchmarks: Reine CPU-Operationen ohne I/O.
 * Mass die Geschwindigkeit der zentralen Kalender-Hilfsfunktionen.
 */

import { getMonthDays, getWeekRange, groupByDate } from '../src/lib/calendar';
import { benchmark } from './benchmark_runner.js';
import type { BenchmarkResult } from './benchmark_runner.js';

/** Monatsraster berechnen (inkl. Wochen-Strukturierung). */
export async function benchmarkCalendarMonth(): Promise<BenchmarkResult> {
  return benchmark(
    'calendar_month_grid',
    () => {
      getMonthDays(2026, 8);
    },
    1000,
  );
}

/** Wochenrange + KW berechnen. */
export async function benchmarkCalendarWeek(): Promise<BenchmarkResult> {
  const date = new Date(2026, 8, 15);
  return benchmark(
    'calendar_week_range',
    () => {
      getWeekRange(date);
    },
    1000,
  );
}

/** Termine nach Datum gruppieren (Statistik-Pfad). */
export async function benchmarkCalendarGroupByDate(): Promise<BenchmarkResult> {
  const termine = Array.from({ length: 500 }, (_, i) => ({
    datum: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}T00:00:00.000Z`,
  }));

  return benchmark(
    'calendar_group_by_date (500 termine)',
    () => {
      groupByDate(termine);
    },
    1000,
  );
}
