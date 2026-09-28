# Setup-Anleitung — TimeBuddy

Stand: 28.09.2026 (v0.1.0, Next.js 16 / Prisma 6 / Vitest 5 / Playwright)

## Voraussetzungen

- Node.js 18+ (empfohlen: aktuelle LTS-Version)
- npm (mit `package-lock.json` im Repo)

## 1. Abhängigkeiten installieren

```bash
npm install
```

> **Windows/PowerShell:** Falls `npm` mit „Ausführung von Skripts ist auf diesem
> System deaktiviert" fehlschlägt (Execution Policy), `npm.cmd` verwenden oder
> die Execution Policy anpassen:
>
> ```powershell
> npm.cmd install
> # alternativ:
> Set-ExecutionPolicy -Scope Process Bypass; npm install
> ```

## 2. Umgebungsvariablen anlegen

`.env` im Projekt-Root erstellen (ist via `.gitignore` ausgeschlossen):

```bash
# Pfad zur SQLite-Datenbank (relativ zum prisma/-Ordner)
DATABASE_URL="file:./dev.db"

# Secret fuer die Session-Verschluesselung (iron-session).
# WICHTIG: In Production durch einen langen, zufaelligen Wert ersetzen.
SESSION_SECRET="..."
```

Ohne `SESSION_SECRET` fällt `src/lib/auth.ts` auf ein hartkodiertes
Fallback-Secret zurueck — nur fuer lokale Entwicklung gedacht.

## 3. Prisma Client generieren

```bash
npm run db:generate
```

## 4. Datenbank migrieren (erstellt prisma/dev.db)

```bash
npm run db:migrate
```

Die initiale Migration liegt unter `prisma/migrations/20260724193111_init/`.

## 5. Development-Server starten

```bash
npm run dev
```

App erreichbar unter <http://localhost:3000>.

## Verfügbare Scripts (package.json)

| Befehl | Beschreibung |
|--------|-------------|
| `npm run dev` | Development-Server (Port 3000) |
| `npm run build` / `npm start` | Produktions-Build bzw. -Server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript-Check (`tsc --noEmit`) |
| `npm test` | Unit-Tests (Vitest, einmalig) |
| `npm run test:watch` | Unit-Tests im Watch-Modus |
| `npm run test:coverage` | Unit-Tests + Coverage-Report (v8) |
| `npm run e2e` | E2E-Tests (Playwright, startet Dev-Server auf Port 3100) |
| `npm run benchmark` | Performance-Benchmarks (Console-Tabelle) |
| `npm run benchmark:report` | Benchmarks als JSON (`--json`) |
| `npm run db:generate` | Prisma Client generieren |
| `npm run db:migrate` | Migrationen anwenden (dev) |
| `npm run db:push` | Schema ohne Migration pushen |
| `npm run db:studio` | Prisma Studio (DB-UI) |

## Fehlersuche

### `npm`/`npx` wird in PowerShell blockiert
Siehe Hinweis oben — Ursache ist die Windows Execution Policy, nicht das Projekt.

### Prisma-Generierung
Falls `@prisma/client` nicht gefunden wird:

```bash
npm run db:generate
```

### E2E-Tests: Port-Konflikt
Playwright startet den Dev-Server bewusst auf **Port 3100** (`playwright.config.ts`).
Die Standardports 3000/3001 werden in dieser Umgebung von VS Code belegt
(statischer File-Server bzw. WebSocket-Proxy), den Playwright sonst
wiederverwenden würde und der keine gültigen App-Antworten liefert.

### `bcryptjs` Build-Fehler
Falls `bcryptjs` nicht korrekt installiert wird:

```bash
npm install bcryptjs --force
```
