# Commit-Konvention — TimeBuddy

Jede Commit-Message folgt diesem Aufbau, damit die Historie maschinenlesbar
und konsistent bleibt.

## Format

```
v<MAJOR.MINOR.PATCH> | <Kategorie[+Kategorien]>: <kurze Zusammenfassung (max. ~80 Zeichen)>

### <Kategorie 1>
- Punkt 1
- Punkt 2

### <Kategorie 2>
- Punkt 1
```

- **Version**: aktuelle Version aus `package.json` (z. B. `v0.1.0`).
  Bei Versionsbump zuerst `package.json` anpassen und in denselben Commit nehmen.
- **Kategorien** (kleinere Schreibweise, nur diese Vokabel verwenden):
  | Kategorie | Inhalt |
  |---|---|
  | `Core` | App-Logik, API-Routen, Datenmodell, Auth |
  | `UX/UI` | Seiten, Komponenten, Design, Interaktion |
  | `Bugfix` | Fehlerbehebungen (ohne Feature-Zuwachs) |
  | `Performance` | Benchmarks, Instrumentierung, Optimierungen |
  | `Testing` | Unit-/E2E-Tests, Test-Infrastruktur |
  | `Security` | Auth-Härtung, Secrets, Validierung |
  | `Docs` | Dokumentation, README, Kommentare |
  | `Build/Tooling` | Dependencies, Skripte, Config, CI |
- **Body**: pro Kategorie eine `###`-Sektion mit Bullet-Points (was wurde geändert,
  nicht wie). Bei nur einer Kategorie darf der Body einfliegender Text sein.
- Mehrere Kategorien in der Zeile: mit Komma trennen, wichtigste zuerst.

## Beispiel

```
v0.2.0 | UX/UI, Bugfix: Erinnerungs-Form schließt nach Speichern; Zod-Feldfehler sichtbar

### UX/UI
- Erinnerung: onSuccess-Callback schließt Formular und aktualisiert Liste

### Bugfix
- termin-form/erinnerung-form: Zod v4 `.issues` statt `.errors`
```
