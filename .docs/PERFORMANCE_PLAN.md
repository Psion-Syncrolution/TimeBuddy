# Performance-Metriken, Benchmarks & Monitoring — Implementierungsplan

## Ziel

Systematische Erfassung, Analyse und Visualisierung von Performance-Metriken fuer alle kritischen Pfade des MCP-Servers, um Engpaesse zu identifizieren und gezielte Optimierungen vorzunehmen.

---

## Phase 1 — Performance-Metriken-Service (Grundlage)

### 1.1 Metriken-Sammelservice erstellen

**Datei:** `src/services/metrics/metrics_collector.ts`

Zentraler, injizierbarer Service fuer alle Performance-Metriken.

```typescript
// Kernschnittstelle
export interface MetricPoint {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'ratio';
  tags?: Record<string, string>;
  timestamp: number;
}

export interface MetricsCollector {
  // Timer: misst Dauer einer Operation
  timer(name: string, tags?: Record<string, string>): Promise<{ duration: number }>;

  // Gauge: momentaner Wert (z.B. Cache-Size, Queue-Laenge)
  gauge(name: string, value: number, tags?: Record<string, string>): void;

  // Counter: monoton steigend (z.B. Tool-Aufrufe, Errors)
  increment(name: string, amount?: number, tags?: Record<string, string>): void;

  // Histogram: Verteilung (Percentile p50, p90, p95, p99)
  histogram(name: string, value: number, tags?: Record<string, string>): void;

  // Snapshot aller Metriken (fuer Reporting)
  snapshot(): Record<string, MetricPoint[]>;

  // Reset (fuer Benchmarks/Tests)
  reset(): void;
}
```

**Implementierungsdetails:**
- In-Memory Puffer mit konfigurierbarer Max-Size (Default: 10.000 Punkte)
- Automatische Aggregation pro Minute (Min, Max, Avg, p50, p90, p95, p99)
- Thread-safe (keine Worker-Thread-Probleme)
- Deaktivierbar via `PERF_METRICS=false` (Zero-Overhead im Prod-Modus)

### 1.2 Performance-Tool als MCP-Tool

**Datei:** `src/tools/system/performance_tools.ts`

```
performance_dashboard    — Gesamtdashboard aller Metriken
performance_top          — Top-N langsamste Operationen
performance_histogram    — Verteilung einer spezifischen Metrik
performance_reset        — Metriken zuruecksetzen
```

### 1.3 Container-Integration

- `MetricsCollector` als neues Feld im `ServiceContainer`
- Lazy-Init: nur wenn `PERF_METRICS=true`
- Export fuer Tests: `resetMetricsCollector()`

---

## Phase 2 — Instrumentierung der kritischen Pfade

### 2.1 Tool-Execution-Pipeline (Hoechste Prioritaet)

**Datei:** `src/services/tools/tool_executor.ts`

Jeder Tool-Aufruf wird gemessen:

```
tool_execution_duration_ms     — Gesamtdauer pro Tool-Name
tool_execution_count           — Aufrufe pro Tool
tool_execution_errors          — Fehler pro Tool
tool_schema_validation_ms      — Dauer der Schema-Validierung (separat)
```

**Tags:** `tool_name`, `handler_type` (real/stub), `success`

### 2.2 Embedding-Service

**Datei:** `src/services/memory/embedding_service.ts`

```
embedding_duration_ms          — Dauer pro Embedding
embedding_cache_hit_ratio      — Cache-Trefferquote (0.0 — 1.0)
embedding_cache_size           — Aktuelle Cache-Size
embedding_provider             — Provider: lm_studio / hash_fallback
```

### 2.3 Datenbank-Operationen

**Datei:** `src/services/database/write_queue.ts`

```
db_write_duration_ms           — Dauer pro Write-Operation
db_write_queue_depth           — Anzahl pending Writes
db_worker_active               — Worker-Status (1=aktiv, 0=fallback)
db_transaction_duration_ms     — Dauer von Transaktionen
```

### 2.4 Indexierung

**Datei:** `src/services/indexing/index_orchestrator.ts`

```
index_duration_ms              — Gesamtdauer Indexierung
index_files_discovered         — Anzahl entdeckter Dateien
index_symbols_extracted        — Anzahl extrahierter Symbole
index_cache_hit_ratio          — Cache-Trefferquote
index_graph_edges              — Anzahl Dependency-Edges
```

### 2.5 Multi-Agent-System

**Datei:** `src/services/agents/agent_orchestrator.ts`

```
agent_task_duration_ms         — Dauer pro Task
agent_task_queue_depth         — Warteschlangen-Laenge
agent_step_duration_ms         — Dauer pro Schritt
agent_chain_duration_ms        — Dauer pro Chain
message_bus_messages_sent      — Nachrichten-Volumen
message_bus_subscribers        — Aktive Subscriptions
```

### 2.6 Dateioperationen

**Datei:** `src/utils/path_validator.ts` + File-Service

```
file_operation_duration_ms     — Dauer pro Dateioperation
file_operation_size_bytes      — Dateigroesse
path_validation_duration_ms    — Pfad-Validierung (inkl. Symlink-Check)
```

### 2.7 Memory-Suche

**Datei:** `src/services/memory/memory_service.ts`

```
memory_search_duration_ms      — Dauer semantischer Suche
memory_search_results_count    — Anzahl Ergebnisse
memory_embedding_similarity    — Durchschnittliche Aehnlichkeit
```

---

## Phase 3 — Benchmark-Suite

### 3.1 Benchmark-Framework

**Datei:** `src/benchmarks/benchmark_runner.ts`

```typescript
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
```

### 3.2 Benchmark-Szenarien

| Benchmark | Beschreibung | Ziel |
|---|---|---|
| `benchmark_tool_execution` | 100 Tool-Aufrufe (jeweils 10 pro Kategorie) | < 50ms avg |
| `benchmark_embedding` | 1.000 Embedding-Generierungen | < 5ms avg (Cache), < 200ms (LM Studio) |
| `benchmark_db_writes` | 1.000 asynchrone DB-Writes via Queue | < 2ms avg |
| `benchmark_indexing` | Projekt-Indexierung (eigenes Repo) | < 500ms |
| `benchmark_memory_search` | 100 semantische Suchanfragen | < 10ms avg |
| `benchmark_agent_task` | 50 Agent-Tasks (versch. Prioritaeten) | < 2s avg |
| `benchmark_file_operations` | 100 Lese/Schreib-Operationen | < 5ms avg (kleine Files) |
| `benchmark_startup` | Kaltstart bis ready | < 3s |

### 3.3 npm-Script

```json
"benchmark": "tsx src/benchmarks/run_all.ts"
"benchmark:report": "tsx src/benchmarks/run_all.ts --json > benchmarks/report.json"
```

### 3.4 Benchmark-Report

Ausgabe als strukturiertes JSON + Console-Tabelle:

```
┌──────────────────────────┬──────┬──────┬──────┬──────┬──────────┐
│ Benchmark                │ Avg  │ p90  │ p95  │ p99  │ Ops/sec  │
├──────────────────────────┼──────┼──────┼──────┼──────┼──────────┤
│ tool_execution           │ 12ms │ 28ms │ 45ms │ 89ms │ 83       │
│ embedding (cached)       │ 0.3ms│ 0.5ms│ 1ms  │ 2ms  │ 3333     │
│ db_write                 │ 1.2ms│ 3ms  │ 5ms  │ 12ms │ 833      │
│ ...                      │ ...  │ ...  │ ...  │ ...  │ ...      │
└──────────────────────────┴──────┴──────┴──────┴──────┴──────────┘
```

---

## Phase 4 — Monitoring & Reporting

### 4.1 Performance-Dashboard Tool

**Tool:** `performance_dashboard`

Strukturierte Ausgabe aller aktiven Metriken:

```
=== MCP Server Performance Dashboard ===
Uptime: 12m 34s
Tools registriert: 119

--- Tool Execution ---
Gesamt: 1,247 Aufrufe | Avg: 18ms | p95: 89ms | Errors: 3 (0.24%)
Top 5 langsamste:
  1. projekt_indizieren     245ms avg (12 calls)
  2. dokument_analyse       178ms avg (8 calls)
  3. code_review_pipeline   134ms avg (5 calls)
  4. websuche               98ms avg (24 calls)
  5. bild_groesse           67ms avg (15 calls)

--- Embedding ---
Cache Hit Rate: 78% | Cache Size: 389/500 | Provider: lm_studio
Avg Duration: 4ms (cached) / 187ms (miss)

--- Datenbank ---
Writes: 3,421 | Avg: 1.4ms | Queue Depth: 0 | Worker: aktiv

--- Agent System ---
Tasks: 47 | Avg Duration: 1,247ms | Queue Depth: 2
Messages: 189 | Active Subscribers: 7
```

### 4.2 Periodisches Reporting

- Alle 60 Sekunden: Aggregierte Metriken in Log schreiben (Level: `info`)
- Format: JSON-Struktur fuer einfaches Parsen
- Konfigurierbar: `PERF_REPORT_INTERVAL_MS`

### 4.3 Alerting (Optional)

- Warnung wenn p95 > konfigurierbarer Schwellenwert
- Warnung wenn Error-Rate > 1%
- Warnung wenn DB-Queue-Depth > 100

---

## Dateistruktur (neu)

```
src/
├── services/
│   └── metrics/
│       ├── metrics_collector.ts      # Core Metriken-Sammelservice
│       ├── metrics_types.ts          # Typ-Definitionen
│       └── metrics_reporter.ts       # Periodisches Reporting
├── tools/
│   └── system/
│       └── performance_tools.ts      # MCP-Tools (dashboard, top, histogram, reset)
└── benchmarks/
    ├── benchmark_runner.ts           # Benchmark-Framework
    ├── benchmark_tool_execution.ts   # Tool-Execution-Benchmarks
    ├── benchmark_embedding.ts        # Embedding-Benchmarks
    ├── benchmark_database.ts         # DB-Benchmarks
    ├── benchmark_indexing.ts         # Indexierungs-Benchmarks
    ├── benchmark_agent.ts            # Agent-Benchmarks
    ├── benchmark_file_operations.ts  # Datei-Benchmarks
    ├── benchmark_startup.ts          # Startup-Benchmark
    └── run_all.ts                    # Master-Runner + Report
```

---

## Implementierungsreihenfolge

| Schritt | Datei | Aufwand | Abhaengigkeit |
|---|---|---|---|
| 1 | `metrics_types.ts` | 15 min | — |
| 2 | `metrics_collector.ts` | 45 min | 1 |
| 3 | Container-Integration (`container.ts`, `index.ts`) | 20 min | 2 |
| 4 | `tool_executor.ts` Instrumentierung | 15 min | 3 |
| 5 | `embedding_service.ts` Instrumentierung | 15 min | 3 |
| 6 | `write_queue.ts` Instrumentierung | 15 min | 3 |
| 7 | `index_orchestrator.ts` Instrumentierung | 15 min | 3 |
| 8 | `agent_orchestrator.ts` Instrumentierung | 20 min | 3 |
| 9 | `performance_tools.ts` (MCP-Tools) | 30 min | 3 |
| 10 | `benchmark_runner.ts` (Framework) | 30 min | 3 |
| 11 | Benchmark-Szenarien (8x) | 60 min | 10 |
| 12 | `run_all.ts` + Report | 20 min | 11 |
| 13 | `metrics_reporter.ts` (periodisch) | 15 min | 3 |
| 14 | Tests fuer Metrics-Collector | 30 min | 2 |
| 15 | Tests fuer Benchmarks | 20 min | 11 |
| **Gesamt** | | **~5.5 Stunden** | |

---

## Konfiguration

```bash
# .env
PERF_METRICS=true                          # Metriken aktivieren (Default: false)
PERF_METRICS_MAX_POINTS=10000              # Max. Metrik-Punkte im Puffer
PERF_REPORT_INTERVAL_MS=60000              # Intervall fuer Log-Reports (0=aus)
PERF_ALERT_P95_MS=500                      # Alert wenn p95 > X ms
PERF_ALERT_ERROR_RATE=0.01                 # Alert wenn Error-Rate > X
```

---

## Wichtige Design-Entscheidungen

1. **Zero-Overhead bei Deaktivierung:** Der `MetricsCollector` ist ein No-Op wenn `PERF_METRICS=false`. Keine if-Checks in instrumentiertem Code — der injizierte Collector ist einfach ein Stub.

2. **Keine externen Abhaengigkeiten:** Alles rein in-memory, keine Prometheus-Client-Bibliothek, keine Netzwerk-Kommunikation. Der MCP-Server bleibt lokal.

3. **Kein Sampling:** Bei < 100ms Overhead pro Metrik-Punkt und typischer Last (< 100 Aufrufe/sec) ist Vollstaendigkeit praktikabel.

4. **Benchmark trennen von Metriken:** Benchmarks sind deterministische, isolierte Tests. Metriken sind Live-Messungen. Beide nutzen dieselben Typen, aber unterschiedliche Implementierungen.

5. **Keine Persistenz:** Metriken sind fluechtig (Restart = Reset). Benchmarks schreiben optional JSON-Reports.
