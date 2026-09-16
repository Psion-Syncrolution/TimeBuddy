# Setup-Anleitung

## 1. Abhängigkeiten installieren
```bash
npm install
```

## 2. Prisma Client generieren
```bash
npx prisma generate
```

## 3. Datenbank migrieren (erstellt prisma/dev.db)
```bash
npx prisma migrate dev --name init
```

## 4. Development-Server starten
```bash
npm run dev
```

## Fehlersuche

### `bcryptjs` Build-Fehler
Falls `bcryptjs` nicht kompiliert, nutze:
```bash
npm install bcryptjs --force
```

### `better-sqlite3` Native-Addon
Falls Probleme mit dem Native-Addon:
```bash
npm rebuild better-sqlite3
```

### Prisma-Generierung
Falls `@prisma/client` nicht gefunden:
```bash
npx prisma generate
```
