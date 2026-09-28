# TimeBuddy — Dein smarter Kalender

Migration von PHP/MySQL zu Next.js + TypeScript mit Tailwind CSS und SQLite.

## Tech-Stack

- **Framework:** Next.js 16 (App Router)
- **Sprache:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Datenbank:** SQLite via Prisma ORM
- **Auth:** Session-basiert (iron-session)
- **Validierung:** Zod
- **Datum:** date-fns (deutsche Lokalisierung)

## Verzeichnisstruktur

```
src/
├── app/                    # Next.js App-Router (Seiten + API-Routes)
│   └── globals.css         # Tailwind + globale Styles
├── components/             # Reusable UI-Komponenten
│   ├── ui/                 # Atomare UI-Elemente
│   ├── layout/             # Layout-Komponenten
│   ├── kalender/           # Kalender-spezifisch
│   ├── termine/            # Termin-Komponenten
│   ├── erinnerungen/       # Erinnerung-Komponenten
│   └── shared/             # Gemeinsam genutzte Komponenten
├── lib/                    # Geschäftslogik & Utilities
│   └── repositories/       # Datenbank-Repositories (Repository-Pattern)
├── hooks/                  # Custom React Hooks
├── validators/             # Zod-Schemas
├── types/                  # TypeScript-Interfaces
└── constants/              # Konstanten

# Projekt-Root
prisma/                     # Prisma-Schema + Migrations (SQLite)
benchmarks/                 # Performance-Benchmarks (tsx)
tests/                      # Zentrale Test-Struktur (unit/e2e/shared)
.docs/                      # Projektdokumentation (Setup, Pläne, Konventionen)
```

## Schnellstart

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Umgebungsvariablen anlegen (.env im Projekt-Root, ist gitignored)
#    DATABASE_URL="file:./dev.db"
#    SESSION_SECRET="<langer zufälliger Wert>"

# 3. Prisma Client generieren
npm run db:generate

# 4. Datenbank migrieren (erstellt prisma/dev.db)
npm run db:migrate

# 5. Development-Server starten
npm run dev
```

Details und Fehlersuche (u. a. PowerShell Execution Policy, E2E-Port 3100):
`.docs/SETUP.md`.

## API-Routes

### Auth
- `POST /api/auth/register` — Benutzer registrieren
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/session` — Session-Status

### Termine
- `GET /api/termine` — Alle Termine (Filter: `?start=&end=`)
- `POST /api/termine` — Termin erstellen
- `GET /api/termine/[id]` — Einzelnen Termin lesen
- `PUT /api/termine/[id]` — Termin bearbeiten
- `DELETE /api/termine/[id]` — Termin löschen
- `GET /api/termine/statistik` — Terminanzahl pro Datum

### Erinnerungen
- `GET /api/erinnerungen` — Alle Erinnerungen
- `POST /api/erinnerungen` — Erinnerung erstellen
- `GET /api/erinnerungen/[id]` — Einzelne Erinnerung lesen
- `PUT /api/erinnerungen/[id]` — Erinnerung bearbeiten
- `DELETE /api/erinnerungen/[id]` — Erinnerung löschen

## Datenbank-Modelle

### User
- `id` (cuid), `email` (unique), `passwordHash`, `createdAt`

### Termin
- `id` (cuid), `titel`, `datum`, `uhrzeit`, `beschreibung` (optional),
  `userId` (FK), `createdAt`, `updatedAt`

### Erinnerung
- `id` (cuid), `terminId` (FK), `erinnerung`, `datum`, `uhrzeit`,
  `beschreibung` (optional), `userId` (FK), `createdAt`

## Farbcodierung

| Termine | Farbe | Bedeutung |
|---------|-------|-----------|
| 1-4 | 🟢 Grün | Wenig Termine |
| 5-8 | 🟡 Gelb | Mittel |
| 9+ | 🟠 Orange | Viele Termine |

## Scripts

| Befehl | Beschreibung |
|--------|-------------|
| `npm run dev` | Development-Server (Port 3000) |
| `npm run build` | Produktion-Build |
| `npm run start` | Produktion-Server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript-Check (`tsc --noEmit`) |
| `npm test` | Unit-Tests (Vitest, einmalig) |
| `npm run test:coverage` | Unit-Tests + Coverage-Report (v8) |
| `npm run e2e` | E2E-Tests (Playwright, startet Dev-Server auf Port 3100) |
| `npm run benchmark` | Performance-Benchmarks (Console-Tabelle) |
| `npm run db:generate` | Prisma Client generieren |
| `npm run db:migrate` | Datenbank migrieren |
| `npm run db:push` | Schema in DB pushen |
| `npm run db:studio` | Prisma Studio (DB-UI) |

## Dokumentation

Weitere Details liegen in `.docs/`:

- `SETUP.md` — Setup-Anleitung & Fehlersuche
- `MIGRATION_ANALYSE.md` — Funktions-Abgleich alte vs. neue App
- `COVERAGE_PLAN.md` — Test-Infrastruktur & Coverage-Strategie
- `PERFORMANCE_PLAN.md` — Benchmark-Baseline & Optimierungsideen
- `COMMIT_CONVENTION.md` — Format der Commit-Messages
