import type { BenchmarkResult } from './benchmark_runner.js';
import { benchmark } from './benchmark_runner.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Benchmark: Modul-Import-Geschwindigkeit (simuliert Kaltstart).
 * Mass die Zeit fuer das Laden der TimeBuddy-Kernmodule.
 */
export async function benchmarkStartup(): Promise<BenchmarkResult> {
  return benchmark('startup_imports', async () => {
    // Dynamische Imports simulieren Kaltstart
    await Promise.all([
      import('../src/lib/prisma.js'),
      import('../src/lib/calendar.js'),
      import('../src/lib/colors.js'),
    ]);
  }, 5);
}

/**
 * Benchmark: Dateisystem-Leseoperationen (kleine Dateien).
 */
export async function benchmarkFileRead(): Promise<BenchmarkResult> {
  // Eine kleine TypeScript-Datei aus dem Projekt lesen
  const targetFile = path.join(process.cwd(), 'src', 'lib', 'calendar.ts');
  if (!fs.existsSync(targetFile)) {
    return {
      name: 'file_read',
      iterations: 0,
      min: 0, max: 0, avg: 0, p50: 0, p90: 0, p95: 0, p99: 0, stddev: 0, opsPerSecond: 0,
    };
  }

  return benchmark('file_read_small', async () => {
    await fs.promises.readFile(targetFile, 'utf-8');
  }, 300);
}
