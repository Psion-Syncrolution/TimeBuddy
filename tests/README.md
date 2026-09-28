# Test-Struktur — TimeBuddy

Alle Tests liegen zentral in diesem Ordner. Die Unterverzeichnisse spiegeln
die App-Struktur aus `src/` wider, sodass direkt ersichtlich ist, zu welcher
Funktion/Bereich ein Test gehört.

```
tests/
├── unit/                  # Unit-Tests (Vitest) — laufen gegen Node + SQLite-Test-DB
│   ├── lib/               # ↔ src/lib/**
│   │   ├── calendar.test.ts        # Datums-/Kalender-Helfer (getMonthDays, getWeekNumber, …)
│   │   ├── colors.test.ts          # Termin-Farben (Priorität → CSS-Werte)
│   │   ├── auth-event.test.ts      # Custom Event für Auth-Status-Updates
│   │   ├── session-utils.test.ts   # requireAuth() — Session-Prüfung für API-Routes
│   │   └── repositories/           # Datenzugriffsschicht (echte SQLite-Test-DB)
│   │       ├── user-repository.test.ts      # User-CRUD, bcrypt-Hashing, verifyPassword
│   │       ├── termin-repository.test.ts    # Termin-CRUD, Isolation, Statistik, Cascade
│   │       └── erinnerung-repository.test.ts# Erinnerung-CRUD, Termin-Verknüpfung, Cascade
│   └── validators/        # ↔ src/validators/** (Zod-Schemas)
│       ├── auth-schema.test.ts         # Login/Register-Validierung
│       ├── termin-schema.test.ts       # Termin-Eingaben (Create/Update)
│       └── erinnerung-schema.test.ts   # Erinnerung-Eingaben (Create/Update)
├── e2e/                   # E2E-Tests (Playwright) — komplette App im Browser
│   ├── timebuddy.spec.ts  # Kern-Flow: Registrierung, Login, Termin-/Erinnerungs-CRUD
│   ├── responsive.spec.ts # Viewport-Matrix (Mobile → 4K): Overflow + Zentrierung
│   └── helpers.ts         # UI-Helfer (registerUser, loginUser, ensureLoggedIn, …)
└── shared/                # Test-Infrastruktur (kein eigener Test)
    ├── setup.ts           # Vitest setupFile: SQLite-Test-DB anlegen (prisma/test.db)
    └── helpers.ts         # resetDatabase(), createUser() für die Unit-Tests
```

## Konventionen

| Regel | Begründung |
|---|---|
| **Ein Test pro Funktion/Modul** — Dateiname = Modulname + `.test.ts` (Unit) bzw. Feature + `.spec.ts` (E2E) | Zugehörigkeit auf einen Blick; neue Module → neuer Test im passenden Unterordner |
| **Unit-Tests spiegeln `src/`** (`tests/unit/lib/repositories/…` ↔ `src/lib/repositories/…`) | Man findet den Test immer dort, wo man die Funktion vermutet |
| **E2E-Tests pro Feature** (nicht pro Komponente) | E2E deckt User-Flows ab; UI-Details gehören in Unit-/Komponenten-Tests |
| **Geteilte Helfer nur in `shared/` bzw. `e2e/helpers.ts`** | Vermeidet Duplikate; Unit- und E2E-Helfer bleiben getrennt (unterschiedliche Laufzeitumgebung) |

## Ausführen

```bash
npm test              # alle Unit-Tests (Vitest)
npm run test:coverage # Unit-Tests + Coverage-Report (v8)
npm run e2e           # E2E-Tests (Playwright, startet Dev-Server auf Port 3100)
```

## Hinweise

- **Unit-Tests** laufen gegen eine echte SQLite-Test-DB (`prisma/test.db`,
  wird von `shared/setup.ts` angelegt und nach dem Lauf gelöscht). Kein
  Prisma-Mock — auch FK-Cascades werden verifiziert.
- **E2E-Tests** starten den Next.js-Dev-Server selbst (Port 3100, siehe
  `playwright.config.ts`). Jeder Test bekommt einen frischen Browser-Kontext.
- Die Coverage misst bewusst nur Produktionscode (`src/lib/**`,
  `src/validators/**`) — Details in `.docs/COVERAGE_PLAN.md`.
