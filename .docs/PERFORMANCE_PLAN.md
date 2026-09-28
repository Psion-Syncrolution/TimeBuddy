# Performance-Metriken & Benchmarks — TimeBuddy

Stand: 28.09.2026 (v0.1.0)

> **Hinweis:** Die frühere Version dieses Dokuments bezog sich auf ein anderes
> Projekt (MCP-Server mit `src/services/**` und MCP-Tools). Diese Pfade existieren
> in TimeBuddy nicht — das Dokument wurde vollständig neu geschrieben.

## Ziel

Systematische Messung der kritischen Pfade des Kalenders: Datenbankzugriffe
(Prisma/SQLite), Kalender-Logik (reine CPU) und Modul-Startup. Engpässe
identifizieren, Regressionen über Commits hinweg erkennen.

---

## Bestehende Benchmark-Suite (`benchmarks/`)

| Datei | Inhalt |
|---|---|
| `benchmark_runner.ts` | Framework: wiederholte Ausführung + Statistiken (min/max/avg/p50/p90/p95/p99/stddev/Ops-per-sec) |
| `benchmark_database.ts` | Prisma Lese-/Schreib-/Aggregations-Benchmarks gegen SQLite |
| `benchmark_calendar.ts` | Kalender-Hilfsfunktionen (`getMonthDays`, `getWeekRange`, `groupByDate`) |
| `benchmark_startup.ts` | Modul-Import (Kaltstart-Simulation) + Dateisystem-Leseoperationen |
| `run_all.ts` | Master-Runner: führt alle Benchmarks aus, gibt Tabelle oder JSON aus |

### Ausführung

```bash
npm run benchmark            # Console-Tabelle
npm run benchmark:report     # JSON-Ausgabe (--json)
```

Die DB-Benchmarks legen einen temporären User (`benchmark@timebuddy.local`) an
und räumen danach auf — die Suite ist idempotent.

---

## Baseline (gemessen am 28.09.2026, lokale Entwicklungsumgebung)

| Benchmark | Avg | p90 | p95 | p99 | Ops/s |
|---|---|---|---|---|---|
| `db_read` (findMany termine) | 0.5 ms | 0.6 | 0.7 | 1.2 | 2 072 |
| `db_write` (create+delete termin) | 16.5 ms | 17.5 | 17.8 | 19.2 | 61 |
| `db_count` (statistik) | 0.5 ms | 0.6 | 0.7 | 1.0 | 2 092 |
| `calendar_month_grid` | < 0.1 ms | < 0.1 | < 0.1 | 0.1 | 37 546 |
| `calendar_week_range` | < 0.1 ms | < 0.1 | < 0.1 | < 0.1 | 154 135 |
| `calendar_group_by_date` (500 termine) | < 0.1 ms | < 0.1 | < 0.1 | 0.1 | 35 839 |
| `startup_imports` | 3.3 ms | 8.2 | 10.6 | 12.4 | 299 |
| `file_read_small` | 0.3 ms | 0.4 | 0.4 | 0.8 | 3 944 |

### Interpretation

- **Kalender-Logik:** vernachlässigbar schnell (< 0.1 ms) — kein Optimierungsbedarf.
- **DB-Lesezugriffe:** < 1 ms p95 — gut für SQLite/Prisma.
- **`db_write` ist der langsamste Pfad (16.5 ms avg):** create + delete als zwei
  separate Roundtrips. Das ist der Hauptkandidat für Optimierungen (siehe unten).
- **`startup_imports`:** 3.3 ms avg, aber p99 bei 12.4 ms — erste Imports sind
  teurer (Cold Cache); in der Praxis durch Next.js-Bundling irrelevant.

---

## Optimierungsideen (priorisiert)

### 1. `db_write`-Pfad: Transaktionen (erwartet: ~50% schneller)

Create + Delete laufen aktuell als zwei getrennte Prisma-Aufrufe. Ein
`prisma.$transaction([...])` bündelt beide in einen SQLite-Transaktionslauf:

```typescript
await prisma.$transaction([
  prisma.termin.create({ data }),
  // delete nach Bedarf
]);
```

**Ziel:** `db_write` von ~16.5 ms auf < 8 ms avg.

### 2. Statistik-Pfad: Indexierung prüfen

`db_count` nutzt `groupByDate` + count-Abfrage. Bei wachsender Terminanzahl
sollte ein Composite-Index auf `(userId, datum)` in der Prisma-Schema-Migration
verifiziert werden (`@@index([userId, datum])`).

**Ziel:** `db_count` bleibt < 1 ms p95 auch bei 10.000+ Terminen pro User.

### 3. N+1-Abfragen in API-Routen vermeiden

Termine mit Erinnerungen laden: `include: { erinnerungen: true }` statt
separater Abfragen pro Termin. Vor jeder Änderung an `termin-repository.ts`
mit `db_read`-Benchmark verifizieren.

---

## Regressionserkennung

1. **Baseline committen:** `npm run benchmark:report > benchmarks/report.json`
   (Datei ist gitignored — nur lokal/CI verwenden).
2. **Nach Performance-relevanten Commits** (`Core`, `Performance`) die Suite
   erneut ausführen und mit der Baseline vergleichen.
3. **Schwellenwerte (Vorschlag):**
   - `db_read` p95 > 5 ms → Warnung
   - `db_write` avg > 25 ms → Warnung
   - Kalender-Logik p99 > 1 ms → Warnung

## Design-Entscheidungen

1. **Keine externen Abhängigkeiten:** Reines `performance.now()`-Timing,
   keine Benchmark-Bibliothek — die Suite läuft mit `tsx` direkt.
2. **Idempotenz:** DB-Benchmarks räumen ihre Testdaten auf; wiederholte Läufe
   verfälschen sich nicht.
3. **Benchmarks getrennt von Unit-Tests:** Vitest-Coverage schließt die
   Benchmarks aus (siehe `COVERAGE_PLAN.md`); sie sind ein eigenes Tool.
4. **Kein Live-Monitoring:** TimeBuddy ist eine lokale App ohne Server-Dauerlast —
   Metriken-Sammler wären Overhead ohne Nutzen. Bei Bedarf später ergänzen.
