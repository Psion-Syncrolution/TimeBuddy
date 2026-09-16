# Migrationsplan: TimeBuddy → Next.js + TypeScript

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

### 1.3 Prisma/SQLite konfigurieren
- `prisma/schema.prisma` mit Modellen:
  - `User` (id, email, passwordHash, createdAt)
  - `Termin` (id, titel, datum, uhrzeit, beschreibung, userId, createdAt, updatedAt)
  - `Erinnerung` (id, terminId, erinnerung, datum, uhrzeit, beschreibung, userId, createdAt)
- Migration erstellen, SQLite-Datenbank initialisieren

### 1.4 Verzeichnisstruktur (fein-granular)
```
src/
├── app/                          # Next.js App-Router
│   ├── layout.tsx                # Root-Layout mit Metadata
│   ├── page.tsx                  # Startseite (Login/Willkommen)
│   ├── login/
│   │   └── page.tsx              # Login-Seite
│   ├── register/
│   │   └── page.tsx              # Registrierungsseite
│   ├── kalender/
│   │   ├── layout.tsx            # Kalender-Layout mit Navbar
│   │   ├── monat/
│   │   │   └── page.tsx          # Monatsansicht
│   │   ├── woche/
│   │   │   └── page.tsx          # Wochenansicht
│   │   ├── tag/
│   │   │   └── page.tsx          # Tagesansicht
│   │   ├── termin/
│   │   │   ├── neu/
│   │   │   │   └── page.tsx      # Termin erstellen
│   │   │   ├── bearbeiten/
│   │   │   │   └── page.tsx      # Termin bearbeiten
│   │   │   └── loeschen/
│   │   │       └── page.tsx      # Termin löschen
│   │   └── erinnerung/
│   │       └── page.tsx          # Erinnerungen verwalten
│   └── api/                      # API-Routes
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   └── register/route.ts
│       ├── termine/
│       │   ├── route.ts          # GET alle, POST erstellen
│       │   └── [id]/
│       │       ├── route.ts      # GET, PUT, DELETE einzelner
│       └── erinnerungen/
│           ├── route.ts          # GET alle, POST erstellen
│           └── [id]/
│               └── route.ts      # GET, PUT, DELETE einzelne
├── components/                   # Reusable UI-Komponenten
│   ├── ui/                       # Atomare UI-Elemente
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── modal.tsx
│   │   └── tooltip.tsx
│   ├── layout/                   # Layout-Komponenten
│   │   ├── navbar.tsx            # Navigationsleiste
│   │   ├── footer.tsx
│   │   └── clock-display.tsx     # Live-Uhrzeit + Datum
│   ├── kalender/                 # Kalender-spezifisch
│   │   ├── monat/
│   │   │   ├── calendar-grid.tsx
│   │   │   ├── day-cell.tsx
│   │   │   ├── week-row.tsx
│   │   │   └── month-selector.tsx
│   │   ├── woche/
│   │   │   ├── week-grid.tsx
│   │   │   └── week-selector.tsx
│   │   └── tag/
│   │       ├── day-grid.tsx
│   │       └── day-selector.tsx
│   ├── termine/                  # Termin-Komponenten
│   │   ├── termin-form.tsx       # Formular (ERstellen/Bearbeiten)
│   │   ├── termin-list.tsx       # Terminliste als Tabelle
│   │   ├── termin-card.tsx       # Einzelner Termin als Karte
│   │   └── termin-dropdown.tsx   # Dropdown-Auswahl
│   ├── erinnerungen/             # Erinnerung-Komponenten
│   │   ├── erinnerung-form.tsx
│   │   └── erinnerung-list.tsx
│   └── shared/                   # Gemeinsam genutzte Komponenten
│       ├── legend.tsx            # Farblegende (1-4, 5-8, 9+ Termine)
│       └── empty-state.tsx       # "Keine Einträge" Anzeige
├── lib/                          # Geschäftslogik & Utilities
│   ├── prisma.ts                 # Prisma-Client-Instanz
│   ├── auth.ts                   # Session-Management
│   ├── calendar.ts               # Kalender-Hilfsfunktionen
│   ├── date-utils.ts             # Datumsformatierung (DE)
│   └── colors.ts                 # Termin-Farben-Logik
├── hooks/                        # Custom React Hooks
│   ├── use-auth.ts               # Auth-Status
│   ├── use-termine.ts            # Termin-Daten laden/mutieren
│   ├── use-erinnerungen.ts       # Erinnerung-Daten
│   └── use-calendar.ts           # Kalender-Logik
├── services/                     # API-Services (Client-seitig)
│   ├── termin-service.ts
│   └── erinnerung-service.ts
├── validators/                   # Zod-Schemas
│   ├── termin-schema.ts
│   ├── erinnerung-schema.ts
│   └── auth-schema.ts
├── types/                        # TypeScript-Interfaces
│   ├── termin.ts
│   ├── erinnerung.ts
│   ├── user.ts
│   └── calendar.ts
├── constants/                    # Konstanten
│   ├── monate.ts                 # Deutsche Monatsnamen
│   ├── wochentage.ts             # Deutsche Wochentage
│   └── farben.ts                 # Termin-Farben-Konfiguration
└── styles/                       # Globale Styles
    └── globals.css               # Tailwind + Custom
```

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

## Umsetzung in Schritten

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
| Keine Tests | Vitest + Testing Library |
