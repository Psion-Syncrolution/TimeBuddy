# Migrationsplan: TimeBuddy → Next.js + TypeScript

> **Status (28.09.2026): ✅ Migration abgeschlossen.** Alle Phasen sind umgesetzt;
> das alte PHP/MySQL-Projekt wurde aus dem Repo entfernt (Commit `9027959`).
> Abweichungen zwischen Plan und Ist-Zustand sind im Text markiert.

## Zusammenfassung
Migration der PHP/MySQL Kalender-Anwendung zu einem modernen Next.js-Projekt mit TypeScript, Tailwind CSS, SQLite und einer fein-granularen, modularen Architektur.

---

## Phase 1: Projekt-Setup & Grundgerüst

### 1.1 Next.js Projekt initialisieren
- `npx create-next-app@latest . --typescript --tailwind --eslint --app`
- App-Router verwenden (Next.js 15 Standard)
- Verzeichnisstruktur erstellen

### 1.2 Abhängigkeiten installieren
```
prisma              # ORM für SQLite
@prisma/client      # Prisma Client
better-sqlite3      # SQLite-Engine
@types/better-sqlite3
bcryptjs            # Passwort-Hashing
iron-session        # Session-basierte Authentifizierung
date-fns            # Datumsmanipulation (i18n für Deutsch)
zod                 # Validierung
```

> **Ist-Zustand:** `better-sqlite3` wurde nicht benötigt (Prisma nutzt die eigene
> SQLite-Engine). Zusätzlich im Einsatz: `framer-motion` (Animationen),
> `lucide-react` (Icons), `date-fns-tz`, `vitest`, `@playwright/test`, `tsx`.

### 1.3 Prisma/SQLite konfigurieren
- `prisma/schema.prisma` mit Modellen:
  - `User` (id, email, passwordHash, createdAt)
  - `Termin` (id, titel, datum, uhrzeit, beschreibung, userId, createdAt, updatedAt)
  - `Erinnerung` (id, terminId, erinnerung, datum, uhrzeit, beschreibung, userId, createdAt)
- Migration erstellen, SQLite-Datenbank initialisieren

### 1.4 Verzeichnisstruktur (Ist-Zustand, Stand 28.09.2026)
```
src/
├── app/                          # Next.js App-Router
│   ├── globals.css               # Tailwind + Custom Styles
│   ├── layout.tsx                # Root-Layout mit Metadata
│   ├── page.tsx                  # Startseite (Login/Willkommen)
│   ├── login/page.tsx            # Login-Seite
│   ├── register/page.tsx         # Registrierungsseite
│   ├── kalender/
│   │   ├── layout.tsx            # Kalender-Layout mit Navbar
│   │   ├── monat/page.tsx        # Monatsansicht
│   │   ├── woche/page.tsx        # Wochenansicht
│   │   ├── tag/page.tsx          # Tagesansicht
│   │   ├── termin/
│   │   │   ├── neu/page.tsx      # Termin erstellen
│   │   │   ├── bearbeiten/page.tsx  # Termin bearbeiten
│   │   │   └── loeschen/page.tsx    # Termin löschen
│   │   └── erinnerung/page.tsx   # Erinnerungen verwalten
│   └── api/                      # API-Routes
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   ├── register/route.ts
│       │   └── session/route.ts  # Session-Status (GET)
│       ├── termine/
│       │   ├── route.ts          # GET alle, POST erstellen
│       │   ├── [id]/route.ts     # GET, PUT, DELETE einzelner
│       │   └── statistik/route.ts  # Terminanzahl pro Datum
│       └── erinnerungen/
│           ├── route.ts          # GET alle, POST erstellen
│           └── [id]/route.ts     # GET, PUT, DELETE einzelne
├── components/                   # Reusable UI-Komponenten
│   ├── ui/                       # button, input, select, textarea, modal
│   ├── layout/                   # navbar (Hamburger auf Mobile), footer,
│   │                             # clock-display, page-transition
│   ├── kalender/                 # monat/, woche/, tag/ (Grids + Selectors)
│   ├── termine/                  # termin-form.tsx, termin-dropdown.tsx
│   ├── erinnerungen/             # erinnerung-form.tsx, erinnerung-list.tsx
│   └── shared/                   # legend.tsx, empty-state.tsx, motion.ts
├── lib/                          # Geschäftslogik & Utilities
│   ├── prisma.ts                 # Prisma-Client-Instanz (Singleton)
│   ├── auth.ts                   # Session-Management (iron-session)
│   ├── auth-event.ts             # Custom Event für Auth-Status-Updates
│   ├── session-utils.ts          # requireAuth() für API-Routes
│   ├── calendar.ts               # Kalender-Hilfsfunktionen
│   ├── colors.ts                 # Termin-Farben-Logik
│   └── repositories/             # Repository-Pattern
│       ├── user-repository.ts
│       ├── termin-repository.ts
│       └── erinnerung-repository.ts
├── hooks/
│   └── use-calendar.ts           # Kalender-Logik (Client)
├── validators/                   # Zod-Schemas
│   ├── auth-schema.ts
│   ├── termin-schema.ts
│   └── erinnerung-schema.ts
├── types/                        # user, termin, erinnerung, calendar
└── constants/                    # monate, wochentage, farben

# Projekt-Root (außerhalb von src/)
prisma/                           # schema.prisma + migrations/
benchmarks/                       # Performance-Benchmarks (tsx)
tests/                            # Zentrale Test-Struktur (Details: tests/README.md)
├── unit/                         # Vitest-Unit-Tests, spiegelt src/ (lib/, validators/)
├── e2e/                          # Playwright-E2E-Suite
└── shared/                       # Test-Setup + Helpers (SQLite-Test-DB)
```

**Abweichungen vom ursprünglichen Plan:**
- `services/` (Client-API-Services) wurde nicht angelegt — die Seiten rufen die API direkt auf.
- `hooks/`: nur `use-calendar.ts`; der Auth-Status läuft über `auth-event.ts` + Navbar statt separater `use-auth`/`use-termine`/`use-erinnerungen` Hooks.
- `lib/date-utils.ts` entfällt — Datumsformatierung via `date-fns` direkt in den Komponenten.
- `ui/tooltip.tsx`, `termine/termin-list.tsx`, `termine/termin-card.tsx` wurden nicht umgesetzt (Listen/Karten liegen in den Seiten).
- Neu: `api/auth/session/route.ts`, `api/termine/statistik/route.ts`, `layout/page-transition.tsx`, `shared/motion.ts`.
- Tests zentral unter `tests/` (statt Colocation in `src/`) — Struktur und Konventionen siehe `tests/README.md`.

---

## Phase 2: Kern-Module implementieren

### 2.1 Datenbank-Layer (lib/prisma.ts + Services)
- Prisma-Client mit Singleton-Pattern
- CRUD-Operationen als Repository-Funktionen:
  - `terminRepository`: getAll, getById, create, update, delete, getCountByDate
  - `erinnerungRepository`: getAll, getById, create, update, delete
  - `userRepository`: getByEmail, create, getById

### 2.2 Validierung (validators/)
- `TerminSchema` mit Zod (titel, datum, uhrzeit, beschreibung)
- `ErinnerungSchema` (terminId, erinnerung, datum, uhrzeit, beschreibung)
- `LoginSchema` / `RegisterSchema`

### 2.3 API-Routes (app/api/)
- `POST /api/auth/register` - Benutzer registrieren
- `POST /api/auth/login` - Login, Session starten
- `POST /api/auth/logout` - Session beenden
- `GET /api/termine` - Alle Termine (mit Filter nach Datum)
- `POST /api/termine` - Termin erstellen
- `GET /api/termine/[id]` - Einzelnen Termin lesen
- `PUT /api/termine/[id]` - Termin bearbeiten
- `DELETE /api/termine/[id]` - Termin löschen
- `GET /api/erinnerungen` - Alle Erinnerungen
- `POST /api/erinnerungen` - Erinnerung erstellen
- `PUT /api/erinnerungen/[id]` - Erinnerung bearbeiten
- `DELETE /api/erinnerungen/[id]` - Erinnerung löschen
- `GET /api/termine/statistik` - Terminanzahl pro Datum (für Farbcodierung)

### 2.4 Geschäftslogik (lib/)
- `calendar.ts`: Kalenderwoche berechnen, Datumsrange für Monat/Woche/Tag
- `date-utils.ts`: Deutsche Formatierung (TT.MM.JJJJ, HH:MM)
- `colors.ts`: Farbcodierung nach Terminanzahl (1-4 grün, 5-8 gelb, 9+ orange)

---

## Phase 3: UI-Komponenten (fein-granular)

### 3.1 Atomare UI-Elemente (components/ui/)
Jedes Element ist eine einzelne, wiederverwendbare Komponente:
- `Button` - Varianten: primary, secondary, danger, ghost
- `Input` - mit Label, Error-Message, Icon-Unterstützung
- `Select` - Dropdown mit Suchfunktion
- `Textarea` - mit Resize und Character-Count
- `Modal` - für Bestätigungen (Löschen)
- `Tooltip` - für Icon-Overlays

### 3.2 Layout-Komponenten
- `Navbar` - mit aktiver Route, Icons, Tooltips, Scroll-Verhalten
- `ClockDisplay` - Live-Uhrzeit + aktuelles Datum (wie im Original)
- `Legend` - Farblegende für Terminanzahl

### 3.3 Kalender-Komponenten
- `DayCell` - Einzelner Tag mit Farbcodierung
- `WeekRow` - Eine Kalenderwoche
- `CalendarGrid` - Vollständige Monatsansicht
- `MonthSelector` / `WeekSelector` / `DaySelector` - Navigation

### 3.4 Formular-Komponenten
- `TerminForm` - Wiederverwendbar für Erstellen und Bearbeiten
- `ErinnerungForm` - Mit Termin-Dropdown
- `TerminList` - Tabelle mit allen Terminen
- `ErinnerungList` - Tabelle mit allen Erinnerungen

---

## Phase 4: Seiten & Routing

### 4.1Auth-Seiten
- Login mit Email/Passwort
- Registrierung mit Validierung

### 4.2 Kalender-Seiten
- `/kalender/monat` - Monatsansicht mit Termin-Farbcodierung
- `/kalender/woche` - Wochenansicht mit KW-Auswahl
- `/kalender/tag` - Tagesansicht mit Stundenraster

### 4.3 Termin-Seiten
- `/kalender/termin/neu` - Neues Formular
- `/kalender/termin/bearbeiten` - Mit Dropdown-Auswahl
- `/kalender/termin/loeschen` - Mit Bestätigung

### 4.4 Erinnerung-Seite
- `/kalender/erinnerung` - Termin-Auswahl + Formular

---

## Phase 5: Styling & Polish

### 5.1 Tailwind-Konfiguration
- Custom Farben (grün: `rgba(142, 209, 102, 0.678)`, gelb: `rgba(250, 225, 1, 0.68)`, orange: `rgba(255, 72, 0, 0.68)`)
- Custom Font-Größen für Uhrzeit-Display
- Responsive Breakpoints

### 5.2 Globale Styles
- Navbar Scroll-Verhalten (ausblenden beim Runter-scrollen)
- Hover-Effekte auf Buttons und Icons
- Transitionen

### 5.3 Assets migrieren
- Bilder: `clock.png`, `appo.png`, `bell.webp`, `Kalender001.png` → `public/pictures/`

---

## Phase 6: Testing & Qualität

> **Status:** Unit-Tests (101 Tests in 10 Dateien, Coverage 100 %) und E2E-Suite
> (Playwright) sind zentral unter `tests/` organisiert (`tests/unit/`, `tests/e2e/`).
> Komponententests mit Testing Library wurden nicht angelegt.
> Details siehe `.docs/COVERAGE_PLAN.md` und `tests/README.md`.

### 6.1 Unit-Tests (Vitest)
- Geschäftslogik: `calendar.ts`, `date-utils.ts`, `colors.ts`
- Validatoren: Zod-Schemas
- Repository-Funktionen

### 6.2 Komponententests (Testing Library)
- UI-Elemente: Button, Input, Select
- Kalender: DayCell, CalendarGrid
- Formulare: TerminForm, ErinnerungForm

### 6.3 API-Tests
- Alle API-Routes mit Test-Fixture
- Auth-Flow: Register → Login → Logout
- CRUD: Create → Read → Update → Delete

### 6.4 TypeScript-Strikte Einstellungen
- `strict: true` in tsconfig.json
- `noImplicitAny`, `strictNullChecks`, `exactOptionalPropertyTypes`

---

## Umsetzung in Schritten (abgeschlossen)

Alle Schritte wurden umgesetzt; die tatsächliche Aufwandsverteilung lag nahe am Plan.

| Schritt | Inhalt | Aufwand |
|---------|--------|---------|
| 1 | Projekt-Setup, Prisma, Verzeichnisstruktur | 2-3h |
| 2 | Datenbank-Layer + Validatoren | 2h |
| 3 | API-Routes (Auth + CRUD) | 3-4h |
| 4 | Atomare UI-Komponenten | 2-3h |
| 5 | Layout + Navbar + Clock | 2h |
| 6 | Kalender-Komponenten (Monat/Woche/Tag) | 4-5h |
| 7 | Formular-Komponenten | 3h |
| 8 | Seiten zusammenbauen | 2-3h |
| 9 | Styling, Assets, Polish | 2h |
| 10 | Tests schreiben | 3-4h |
| **Gesamt** | | **~25-32h** |

---

## Was fällt weg / wird ersetzt

| Aktuell | Neuer Ansatz |
|---------|-------------|
| PHP (.php) | Next.js Pages (.tsx) |
| MySQL (XAMPP) | SQLite (Prisma) |
| mysqli/PDO direkt | Prisma ORM (type-safe) |
| Inline-CSS + .css | Tailwind CSS + Components |
| JavaScript inline | TypeScript + React Hooks |
| Keine Auth | Session-basiert (iron-session) |
| Keine Validierung | Zod-Schemas |
| Monolithische Dateien | Fein-granulare Komponenten |
| Keine Tests | Vitest (Unit) + Playwright (E2E) |
