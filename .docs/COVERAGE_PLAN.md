# Coverage-Optimierungsplan — TimeBuddy

Stand: 28.09.2026 (v0.1.0, Vitest 5 / v8-Coverage)

> **Status: ✅ Abgeschlossen.** Alle Phasen sind implementiert — die Coverage
> liegt in **allen vier Metriken bei 100 %** (Ziel war ≥ 85 %).
>
> Die frühere Version dieses Dokuments bezog sich auf ein anderes Projekt
> (MCP-Server mit `src/services/**`). Diese Pfade existieren in TimeBuddy nicht —
> das Dokument wurde neu geschrieben und nach Umsetzung aktualisiert.

## Ergebnis (gemessen am 28.09.2026)

| Metrik | Vorher | Ziel | **Nachher** |
|---|---|---|---|
| **Statements** | 37.86% (64/169) | ≥ 85% | **100% (121/121)** ✅ |
| **Branches** | 32.97% (31/94) | ≥ 85% | **100% (73/73)** ✅ |
| **Functions** | 31.81% (14/44) | ≥ 85% | **100% (35/35)** ✅ |
| **Lines** | 36.36% (52/143) | ≥ 85% | **100% (104/104)** ✅ |

- Test-Suite: **10 Dateien, 101 Tests** (alle grün, Laufzeit ~24 s)
- Alle Dateien im Coverage-Scope sind zu 100 % abgedeckt.

## Konfiguration (`vitest.config.ts`)

```ts
test: {
  environment: 'node',
  include: ['tests/unit/**/*.test.ts'],
  exclude: ['node_modules', '.next'],
  fileParallelism: false,          // Repository-Tests teilen sich eine Test-DB
  setupFiles: ['./tests/shared/setup.ts'],
},
coverage: {
  provider: 'v8',
  include: ['src/lib/**/*.ts', 'src/validators/**/*.ts'],
  exclude: ['**/*.test.ts', 'src/lib/prisma.ts', 'src/lib/auth.ts'],
},
```

### Begründung der Ausschlüsse

| Datei | Grund |
|---|---|
| `benchmarks/benchmark_runner.ts` | CLI-Werkzeug, kein Anwendungscode (41 Statements hätten den Nenner um ~24 PP belastet) |
| `src/lib/prisma.ts` | Dünner Prisma-Singleton-Wrapper; wird indirekt von allen Repository-Tests ausgeführt |
| `src/lib/auth.ts` | Dünner iron-session-Wrapper; der Auth-Flow ist über E2E + `session-utils`-Tests abgedeckt |

## Test-Infrastruktur

### `tests/shared/setup.ts` (setupFile)

- Setzt `DATABASE_URL` auf `prisma/test.db` **vor** dem ersten Import von
  `@/lib/prisma` (der Singleton liest die Variable beim Modul-Laden).
- Löscht eine alte Test-DB und legt das Schema neu an — es spiegelt
  `prisma/migrations/20260724193111_init/migration.sql`.
- **Wichtig:** Der Prisma-SQLite-Connector führt bei `$executeRawUnsafe` nur die
  **erste** Anweisung aus → Schema wird als vier Einzelaufrufe erstellt.
- Löscht `test.db` beim Prozessende (Datei ist gitignored).

### `tests/shared/helpers.ts`

- `resetDatabase()` — leert alle Tabellen in FK-Reihenfolge
  (Erinnerungen → Termine → Users) für saubere `beforeEach`-Isolation.
- `createUser(email, password)` — erzeugt einen User mit bcrypt-gehashtem Passwort.

### Strategie: echte DB statt Prisma-Mocks

SQLite ist schnell genug — die Repository-Tests laufen gegen eine **echte**
Test-Datenbank mit echten Queries (inkl. FK-Cascades). Einziger Mock in der
ganzen Suite: `@/lib/auth` in `session-utils.test.ts` (iron-session +
next/headers sind Server-Runtime und gehören nicht in Unit-Tests).

## Neue Testdateien

| Datei | Tests | Abgedeckte Fälle |
|---|---|---|
| `tests/unit/lib/repositories/user-repository.test.ts` | 9 | getByEmail/getById (Treffer + null), create (bcrypt-Hash, kein Klartext in DB, Unique-Verletzung), verifyPassword (korrekt / falsch / unbekannt) |
| `tests/unit/lib/repositories/termin-repository.test.ts` | 15 | create (Serialisierung YYYY-MM-DD, beschreibung-Default), getAll (Isolation + Sortierung), getById (fremd → null), getByDateRange (inkl. Grenzen, Isolation), update (Teilupdate, alle Felder, `beschreibung: null` behält Bestandswert, fremd → null), delete (eigen/fremd), getStatistik (groupBy pro Datum), FK-Cascade |
| `tests/unit/lib/repositories/erinnerung-repository.test.ts` | 15 | create (inkl. termin-Include), getAll/getById (Isolation + Sortierung), update (Teilupdate, terminId-Umverknüpfung, alle Felder, `beschreibung: null`, fremd → null), delete, FK-Cascade über Termin |
| `tests/unit/lib/session-utils.test.ts` | 4 | requireAuth: keine Session → null, nur email → null, userId+email → Kontext, nur userId → Kontext ohne email |
| `tests/unit/lib/auth-event.test.ts` | 3 | Event-Name, No-Op ohne window (Node), dispatch mit gestubtem window |
| `tests/unit/lib/calendar.test.ts` (ergänzt) | +2 | `getWeekNumber`: ISO-KW Referenzwerte (KW 1, KW 38, KW 53) + Konsistenz mit `getWeekRange` |

## Umgesetzte Maßnahmen (Chronik)

| Schritt | Maßnahme | Ergebnis |
|---|---|---|
| 1 | Coverage-Config bereinigen (Runner aus include, Wrapper in exclude) | Nenner: 169 → 121 Statements |
| 2 | Test-Setup: SQLite-Test-DB (`setup.ts` + `helpers.ts`), `fileParallelism: false` | Isolierte, reproduzierbare Repository-Tests |
| 3 | `user-repository.ts` testen (0% → 100%) | 9 Tests |
| 4 | `termin-repository.ts` testen (0% → 100%) | 15 Tests |
| 5 | `erinnerung-repository.ts` testen (0% → 100%) | 15 Tests |
| 6 | `session-utils.ts` + `auth-event.ts` testen (0% → 100%) | 7 Tests |
| 7 | `calendar.ts`: fehlende `getWeekNumber`-Branch abdecken (96% → 100%) | +2 Tests |

## Hinweise & Wartung

1. **Test-Isolation:** `beforeEach` → `resetDatabase()`; die gemeinsame Test-DB
   ist sicher, weil `fileParallelism: false` sequenzielle Dateiausführung erzwingt.
2. **Keine Prisma-Mocks:** Echte DB, echte Queries — auch FK-Cascades werden
   verifiziert (Termin-Löschung entfernt Erinnerungen, User-Löschung entfernt Termine).
3. **E2E als Ergänzung:** Die Playwright-Suite (`tests/e2e/`) deckt den kompletten
   Auth- + CRUD-Flow über die UI ab; Unit-Tests ersetzen sie nicht und umgekehrt.
   Die Gesamtstruktur ist in `tests/README.md` dokumentiert.
4. **Coverage-Schwellen:** Aktuell sind keine `thresholds` in der Config gesetzt.
   Empfehlung für CI: `coverage.thresholds = { statements: 85, branches: 85, functions: 85, lines: 85 }`,
   um Regressionsfälle früh zu erkennen.
