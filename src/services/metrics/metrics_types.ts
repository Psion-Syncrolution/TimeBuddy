/**
 * Metriken-Typen fuer den Performance-Metriken-Service.
 */

/** Einheit einer Metrik */
export type MetricUnit = 'ms' | 'bytes' | 'count' | 'ratio';

/** Einzelner Metrik-Datenpunkt */
export interface MetricPoint {
  name: string;
  value: number;
  unit: MetricUnit;
  tags?: Record<string, string>;
  timestamp: number;
}

/** Aggregierte Statistiken fuer eine Metrik */
export interface MetricAggregation {
  name: string;
  unit: MetricUnit;
  count: number;
  min: number;
  max: number;
  avg: number;
  p50: number;
  p90: number;
  p95: number;
  p99: number;
  stddev: number;
  total: number;
  lastUpdated: number;
}

/** Timer-Handle fuer nicht-blockierende Dauer-Messung */
export interface TimerHandle {
  /** Stoppt den Timer und gibt die Dauer in ms zurueck */
  stop(): number;
  /** Gibt die aktuelle Dauer seit Start zurueck (in ms) */
  elapsed(): number;
}

/** Konfiguration des MetricsCollectors */
export interface MetricsConfig {
  /** Max. Anzahl Metrik-Punkte im Puffer vor Rotation */
  maxPoints: number;
  /** Intervall fuer periodisches Reporting in ms (0 = aus) */
  reportIntervalMs: number;
  /** p95-Schwellenwert fuer Alerts in ms */
  alertP95Ms: number;
  /** Error-Rate-Schwellenwert fuer Alerts (0.0 — 1.0) */
  alertErrorRate: number;
}

/** Dashboard-Ausschnitt fuer eine Kategorie */
export interface DashboardSection {
  title: string;
  metrics: Array<{ name: string; value: string }>;
}

/** Kompletter Dashboard-Snapshot */
export interface DashboardSnapshot {
  uptime: string;
  toolsRegistered: number;
  sections: DashboardSection[];
  alerts: string[];
}
