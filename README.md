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
├── components/             # Reusable UI-Komponenten
│   ├── ui/                 # Atomare UI-Elemente
│   ├── layout/             # Layout-Komponenten
│   ├── kalender/           # Kalender-spezifisch
│   ├── termine/            # Termin-Komponenten
│   ├── erinnerungen/       # Erinnerung-Komponenten
│   └── shared/             # Gemeinsam genutzte Komponenten
├── lib/                    # Geschäftslogik & Utilities
│   └── repositories/       # Datenbank-Repositories
├── hooks/                  # Custom React Hooks
├── services/               # API-Services (Client-seitig)
├── validators/             # Zod-Schemas
├── types/                  # TypeScript-Interfaces
├── constants/              # Konstanten
└── styles/                 # Globale Styles
```

## Schnellstart

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Prisma Client generieren
npm run db:generate

# 3. Datenbank migrieren
npm run db:migrate

# 4. Development-Server starten
npm run dev
```

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
| `npm run dev` | Development-Server |
| `npm run build` | Produktion-Build |
| `npm run start` | Produktion-Server |
| `npm run lint` | ESLint |
| `npm run db:generate` | Prisma Client generieren |
| `npm run db:migrate` | Datenbank migrieren |
| `npm run db:push` | Schema in DB pushen |
| `npm run db:studio` | Prisma Studio (DB-UI) |
