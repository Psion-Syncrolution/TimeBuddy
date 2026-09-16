/**
 * Benchmark-Framework: Führt eine Funktion mehrfach aus und berechnet Statistiken.
 */

export interface BenchmarkResult {
  name: string;
  iterations: number;
  min: number;
  max: number;
  avg: number;
  p50: number;
  p90: number;
  p95: number;
  p99: number;
  stddev: number;
  opsPerSecond: number;
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  const weight = idx - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function stddev(values: number[], mean: number): number {
  if (values.length < 2) return 0;
  const sumSq = values.reduce((s, v) => s + (v - mean) ** 2, 0);
  return Math.sqrt(sumSq / values.length);
}

/**
 * Führt eine asynchrone Funktion `iterations` Mal aus und gibt Statistiken zurück.
 */
export async function benchmark(
  name: string,
  fn: () => Promise<void> | void,
  iterations = 100,
): Promise<BenchmarkResult> {
  const durations: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    durations.push(performance.now() - start);
  }

  const sorted = [...durations].sort((a, b) => a - b);
  const total = sorted.reduce((s, v) => s + v, 0);
  const avg = total / sorted.length;

  return {
    name,
    iterations,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg,
    p50: percentile(sorted, 50),
    p90: percentile(sorted, 90),
    p95: percentile(sorted, 95),
    p99: percentile(sorted, 99),
    stddev: stddev(sorted, avg),
    opsPerSecond: avg > 0 ? Math.round(1000 / avg) : Infinity,
  };
}

/**
 * Formatiert ein Benchmark-Ergebnis als Tabelle.
 */
export function formatBenchmarkTable(
  results: BenchmarkResult[],
): string {
  const lines: string[] = [];
  const header = `${'Benchmark'.padEnd(35)} ${'Avg'.padStart(10)} ${'p90'.padStart(10)} ${'p95'.padStart(10)} ${'p99'.padStart(10)} ${'Ops/s'.padStart(8)}`;
  lines.push('');
  lines.push('=== Performance Benchmarks ===');
  lines.push('');
  lines.push(header);
  lines.push('─'.repeat(85));

  for (const r of results) {
    const ops = r.opsPerSecond === Infinity ? '∞' : String(r.opsPerSecond);
    lines.push(
      `${r.name.padEnd(35)} ${r.avg.toFixed(1).padStart(10)} ${r.p90.toFixed(1).padStart(10)} ${r.p95.toFixed(1).padStart(10)} ${r.p99.toFixed(1).padStart(10)} ${ops.padStart(8)}`,
    );
  }

  lines.push('');
  return lines.join('\n');
}

/**
 * Formatiert ein Benchmark-Ergebnis als JSON.
 */
export function formatBenchmarkJson(
  results: BenchmarkResult[],
): string {
  return JSON.stringify(results, null, 2);
}
