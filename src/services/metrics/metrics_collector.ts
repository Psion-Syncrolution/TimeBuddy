import { logger } from '../../config/logger.js';
import type {
  MetricPoint,
  MetricAggregation,
  MetricUnit,
  TimerHandle,
  MetricsConfig,
  DashboardSnapshot,
  DashboardSection,
} from './metrics_types.js';

/** Standard-Konfiguration */
const DEFAULT_CONFIG: MetricsConfig = {
  maxPoints: parseInt(process.env.PERF_METRICS_MAX_POINTS || '10000', 10),
  reportIntervalMs: parseInt(
    process.env.PERF_REPORT_INTERVAL_MS || '60000',
    10,
  ),
  alertP95Ms: parseInt(process.env.PERF_ALERT_P95_MS || '500', 10),
  alertErrorRate: parseFloat(process.env.PERF_ALERT_ERROR_RATE || '0.01'),
};

/**
 * Berechnet den Perzentil-Wert aus einem sortierten Array.
 */
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

/**
 * Berechnet die Standardabweichung.
 */
function stddev(values: number[], mean: number): number {
  if (values.length < 2) return 0;
  const sumSq = values.reduce((s, v) => s + (v - mean) ** 2, 0);
  return Math.sqrt(sumSq / values.length);
}

/**
 * No-Op MetricsCollector — Zero-Overhead wenn Metriken deaktiviert.
 */
export class NoOpMetricsCollector implements MetricsCollector {
  timer(_name: string, _tags?: Record<string, string>): Promise<TimerHandle> {
    return Promise.resolve({
      stop: () => 0,
      elapsed: () => 0,
    });
  }
  gauge(_name: string, _value: number, _tags?: Record<string, string>): void {}
  increment(_name: string, _amount?: number, _tags?: Record<string, string>): void {}
  histogram(_name: string, _value: number, _tags?: Record<string, string>): void {}
  snapshot(): Record<string, MetricPoint[]> {
    return {};
  }
  aggregations(): Map<string, MetricAggregation> {
    return new Map();
  }
  dashboard(_startTs: number): DashboardSnapshot {
    return { uptime: '-', toolsRegistered: 0, sections: [], alerts: [] };
  }
  reset(): void {}
  stop(): void {}
}

/**
 * Vollstaendiger MetricsCollector mit In-Memory-Puffer und Aggregation.
 */
export class RealMetricsCollector implements MetricsCollector {
  private points: Map<string, MetricPoint[]> = new Map();
  private gauges: Map<string, { value: number; tags?: Record<string, string> }> = new Map();
  private config: MetricsConfig;
  private reportTimer: ReturnType<typeof setInterval> | null = null;
  private readonly startTs: number;

  constructor(config?: Partial<MetricsConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.startTs = Date.now();
    if (this.config.reportIntervalMs > 0) {
      this.reportTimer = setInterval(() => this.periodicReport(), this.config.reportIntervalMs);
    }
  }

  async timer(
    name: string,
    tags?: Record<string, string>,
  ): Promise<TimerHandle> {
    const start = performance.now();
    return {
      stop: (): number => {
        const duration = performance.now() - start;
        this.histogram(name, duration, { unit: 'ms', ...tags });
        return duration;
      },
      elapsed: (): number => performance.now() - start,
    };
  }

  gauge(
    name: string,
    value: number,
    tags?: Record<string, string>,
  ): void {
    this.gauges.set(name, tags !== undefined ? { value, tags } : { value });
  }

  increment(
    name: string,
    amount = 1,
    tags?: Record<string, string>,
  ): void {
    this.recordPoint(name, amount, 'count', tags);
  }

  histogram(
    name: string,
    value: number,
    tags?: Record<string, string>,
  ): void {
    this.recordPoint(name, value, 'ms', tags);
  }

  snapshot(): Record<string, MetricPoint[]> {
    const result: Record<string, MetricPoint[]> = {};
    for (const [name, pts] of this.points) {
      result[name] = [...pts];
    }
    return result;
  }

  aggregations(): Map<string, MetricAggregation> {
    const agg = new Map<string, MetricAggregation>();
    for (const [name, pts] of this.points) {
      if (pts.length === 0) continue;
      const values = pts.map((p) => p.value).sort((a, b) => a - b);
      const total = values.reduce((s, v) => s + v, 0);
      const avg = total / values.length;
      const unit = pts[0].unit ?? 'ms';
      agg.set(name, {
        name,
        unit,
        count: values.length,
        min: values[0],
        max: values[values.length - 1],
        avg,
        p50: percentile(values, 50),
        p90: percentile(values, 90),
        p95: percentile(values, 95),
        p99: percentile(values, 99),
        stddev: stddev(values, avg),
        total,
        lastUpdated: pts[pts.length - 1].timestamp,
      });
    }
    return agg;
  }

  dashboard(startTs: number): DashboardSnapshot {
    const agg = this.aggregations();
    const sections: DashboardSection[] = [];
    const alerts: string[] = [];

    // Gruppiere nach Praefix (bis zum ersten '_')
    const groups = new Map<string, MetricAggregation[]>();
    for (const a of agg.values()) {
      const key = a.name.split('_')[0] ?? 'other';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(a);
    }

    for (const [group, metrics] of groups) {
      const sectionMetrics: Array<{ name: string; value: string }> = [];
      for (const m of metrics) {
        const formatted =
          m.unit === 'ms'
            ? `${m.avg.toFixed(1)}ms (p95: ${m.p95.toFixed(1)}ms, n=${m.count})`
            : m.unit === 'ratio'
              ? `${(m.avg * 100).toFixed(1)}%`
              : `${m.count}`;
        sectionMetrics.push({ name: m.name, value: formatted });

        // Alert-Checks
        if (m.unit === 'ms' && m.p95 > this.config.alertP95Ms) {
          alerts.push(
            `⚠️ ${m.name}: p95=${m.p95.toFixed(0)}ms > ${this.config.alertP95Ms}ms`,
          );
        }
      }
      sections.push({ title: group.toUpperCase(), metrics: sectionMetrics });
    }

    const uptimeMs = Date.now() - startTs;
    const uptime = formatUptime(uptimeMs);

    return { uptime, toolsRegistered: 0, sections, alerts };
  }

  reset(): void {
    this.points.clear();
    this.gauges.clear();
  }

  stop(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
      this.reportTimer = null;
    }
  }

  private recordPoint(
    name: string,
    value: number,
    unit: MetricUnit,
    tags?: Record<string, string>,
  ): void {
    const point: MetricPoint = {
      name,
      value,
      unit,
      ...(tags !== undefined && { tags }),
      timestamp: Date.now(),
    };

    if (!this.points.has(name)) {
      this.points.set(name, []);
    }
    const bucket = this.points.get(name)!;
    bucket.push(point);

    // Rotation bei Ueberlauf
    const totalPoints = Array.from(this.points.values()).reduce((s, b) => s + b.length, 0);
    if (totalPoints > this.config.maxPoints) {
      this.rotate();
    }
  }

  private rotate(): void {
    // Halbiere alle Buckets
    for (const bucket of this.points.values()) {
      const half = Math.floor(bucket.length / 2);
      bucket.splice(0, half);
    }
  }

  private periodicReport(): void {
    const agg = this.aggregations();
    const entries: Array<{ name: string; avg: number; p95: number; count: number }> = [];
    for (const a of agg.values()) {
      entries.push({ name: a.name, avg: a.avg, p95: a.p95, count: a.count });
    }
    logger.info('Performance-Metriken (periodisch)', { metrics: entries });
  }
}

/** Formatiert Millisekunden in eine lesbare Uptime-String */
function formatUptime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}m ${sec}s`;
}

// ============================================================
// Factory & Singleton
// ============================================================

let _collector: MetricsCollector | null = null;
let _startTs = Date.now();

/**
 * Erstellt einen MetricsCollector basierend auf der Umgebungsvariable.
 */
export function createMetricsCollector(config?: Partial<MetricsConfig>): MetricsCollector {
  const enabled = process.env.PERF_METRICS !== 'false';
  if (enabled) {
    logger.info('Performance-Metriken aktiviert');
    return new RealMetricsCollector(config);
  }
  logger.debug('Performance-Metriken deaktiviert (PERF_METRICS=false)');
  return new NoOpMetricsCollector();
}

/**
 * Gibt den aktuellen MetricsCollector zurueck.
 */
export function getMetricsCollector(): MetricsCollector {
  if (!_collector) {
    _collector = createMetricsCollector();
    _startTs = Date.now();
  }
  return _collector;
}

/**
 * Setzt einen spezifischen Collector (Tests / Container-Init).
 */
export function setMetricsCollector(collector: MetricsCollector): void {
  _collector = collector;
}

/**
 * Setzt den Startzeitpunkt (fuer Uptime-Berechnung).
 */
export function setMetricsStartTs(ts: number): void {
  _startTs = ts;
}

/**
 * Gibt den Startzeitpunkt zurueck.
 */
export function getMetricsStartTs(): number {
  return _startTs;
}

/**
 * Reset fuer Tests.
 */
export function resetMetricsCollector(): void {
  _collector?.stop();
  _collector?.reset();
  _collector = null;
  _startTs = Date.now();
}

// ============================================================
// Public Interface (wird im ServiceContainer verwendet)
// ============================================================

export interface MetricsCollector {
  timer(name: string, tags?: Record<string, string>): Promise<TimerHandle>;
  gauge(name: string, value: number, tags?: Record<string, string>): void;
  increment(name: string, amount?: number, tags?: Record<string, string>): void;
  histogram(name: string, value: number, tags?: Record<string, string>): void;
  snapshot(): Record<string, MetricPoint[]>;
  aggregations(): Map<string, MetricAggregation>;
  dashboard(startTs: number): DashboardSnapshot;
  reset(): void;
  stop(): void;
}
