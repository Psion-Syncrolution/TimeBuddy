import { describe, it, expect, beforeEach } from 'vitest';
import {
  RealMetricsCollector,
  NoOpMetricsCollector,
  resetMetricsCollector,
  getMetricsCollector,
  setMetricsCollector,
} from './metrics_collector.js';

describe('MetricsCollector', () => {
  beforeEach(() => {
    resetMetricsCollector();
  });

  describe('RealMetricsCollector', () => {
    it('sollte histogram Werte korrekt aggregieren', async () => {
      const collector = new RealMetricsCollector();

      for (let i = 1; i <= 100; i++) {
        collector.histogram('test_duration_ms', i);
      }

      const agg = collector.aggregations();
      const testMetric = agg.get('test_duration_ms');

      expect(testMetric).toBeDefined();
      expect(testMetric!.count).toBe(100);
      expect(testMetric!.min).toBe(1);
      expect(testMetric!.max).toBe(100);
      expect(testMetric!.avg).toBeCloseTo(50.5, 1);
      expect(testMetric!.p50).toBeCloseTo(50.5, 0);
      expect(testMetric!.p95).toBeCloseTo(95.5, 0);
    });

    it('sollte timer korrekt messen', async () => {
      const collector = new RealMetricsCollector();
      const timer = await collector.timer('timer_test_ms');

      await new Promise((r) => setTimeout(r, 10));
      const duration = timer.stop();

      expect(duration).toBeGreaterThanOrEqual(8);
      expect(duration).toBeLessThan(100);

      const agg = collector.aggregations();
      expect(agg.has('timer_test_ms')).toBe(true);
    });

    it('sollte increment Counter korrekt zaehlen', () => {
      const collector = new RealMetricsCollector();

      collector.increment('call_count');
      collector.increment('call_count');
      collector.increment('call_count', 5);

      const agg = collector.aggregations();
      const counter = agg.get('call_count');
      expect(counter).toBeDefined();
      expect(counter!.count).toBe(3);
      expect(counter!.total).toBe(7);
    });

    it('sollte gauge Werte speichern', () => {
      const collector = new RealMetricsCollector();
      collector.gauge('cache_size', 42);
      collector.gauge('cache_size', 50);

      // Gauge wird nicht im Aggregation-Map gespeichert, aber im internen State
      expect(() => collector.aggregations()).not.toThrow();
    });

    it('sollte reset alle Daten loeschen', () => {
      const collector = new RealMetricsCollector();
      collector.histogram('test_ms', 100);
      collector.increment('count');

      collector.reset();

      const agg = collector.aggregations();
      expect(agg.size).toBe(0);
    });

    it('sollte dashboard Snapshot generieren', () => {
      const collector = new RealMetricsCollector();
      collector.histogram('tool_duration_ms', 50);
      collector.histogram('tool_duration_ms', 100);
      collector.increment('tool_count');

      const dashboard = collector.dashboard(Date.now() - 60000);

      expect(dashboard.sections.length).toBeGreaterThan(0);
      expect(dashboard.uptime).toBeDefined();
    });

    it('sollte bei Ueberflow rotieren', () => {
      const collector = new RealMetricsCollector({ maxPoints: 100 });

      for (let i = 0; i < 200; i++) {
        collector.histogram('overflow_test_ms', i);
      }

      const agg = collector.aggregations();
      const metric = agg.get('overflow_test_ms');
      // Nach Rotation sollte die Anzahl reduziert sein
      expect(metric!.count).toBeLessThan(200);
    });
  });

  describe('NoOpMetricsCollector', () => {
    it('sollte keine Daten sammeln', async () => {
      const collector = new NoOpMetricsCollector();

      collector.histogram('noop_ms', 999);
      collector.increment('noop_count');
      const timer = await collector.timer('noop_timer_ms');
      timer.stop();

      const agg = collector.aggregations();
      expect(agg.size).toBe(0);
    });

    it('sollte timer mit 0 zurueckgeben', async () => {
      const collector = new NoOpMetricsCollector();
      const timer = await collector.timer('noop_ms');

      await new Promise((r) => setTimeout(r, 10));
      const duration = timer.stop();

      expect(duration).toBe(0);
    });
  });

  describe('Factory', () => {
    it('sollte nach Reset einen neuen Collector erstellen', () => {
      resetMetricsCollector();
      const collector = getMetricsCollector();
      expect(collector).toBeDefined();
      // Standard: aktiviert (PERF_METRICS nicht gesetzt = true)
      expect(collector).toBeInstanceOf(RealMetricsCollector);
    });

    it('sollte setMetricsCollector verwenden', () => {
      const noop = new NoOpMetricsCollector();
      setMetricsCollector(noop);

      const collector = getMetricsCollector();
      expect(collector).toBe(noop);
    });
  });
});
