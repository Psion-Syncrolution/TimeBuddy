# Coverage-Optimierungsplan — Ziel: > 90% in allen Metriken

## Aktueller Stand

| Metrik | Aktuell | Ziel | Luecke |
|---|---|---|---|
| **Lines** | 95.3% | > 90% | ✅ |
| **Statements** | 95.3% | > 90% | ✅ |
| **Functions** | 97.2% | > 90% | ✅ |
| **Branches** | 89.8% | > 90% | ⚠️ **+0.2%** |

**Gesamt:** ~192 fehlende Branches von 2772. Fuer 90% benoetigt man ~50 Branches mehr.

---

## Phase 1: Low-Hanging Fruit (0% → 100%) — Schnellster Gewinn

### 1.1 `metrics_reporter.ts` (0% → 100%) — 1 Branch

**Problem:** Reine Typ-Datei, Coverage-Tool zaehlt 0/0 als 0%.
**Lage:** `src/services/metrics/metrics_reporter.ts`
**Maßnahme:** Einfacher Unit-Test fuer `emitReport()` und `checkAlerts()`.

**Tests:**
```
✓ emitReport() erzeugt einen Report mit Uptime
✓ checkAlerts() warnt bei hohem p95 (>500ms)
✓ checkAlerts() warnt bei hoher Error-Rate (>1%)
✓ checkAlerts() warnt nicht bei normalen Werten
✓ startMetricsReporting() startet Intervall
✓ stopMetricsReporting() stoppt Intervall
```

**Erwarteter Gewinn:** +1 Branch → ~0.04%

### 1.2 `metrics_types.ts` (0% → 100%) — 1 Branch

**Problem:** Reine Typ-Definition, keine Branches.
**Lage:** `src/services/metrics/metrics_types.ts`
**Maßnahme:** Diese Datei hat tatsaechlich 0 Branches. Der 0%-Wert ist ein Artefakt des Coverage-Tools.
**Option A:** Datei aus Coverage ausschließen (`.gitignore`-aehnlich in vitest.config.ts).
**Option B:** Minimalen Test mit Typ-Import hinzufuegen.

**Empfohlen:** Option A — `exclude: ['**/metrics_types.ts']` in Coverage-Config.

**Erwarteter Gewinn:** +1 Branch im Nenner weniger → ~0.04%

### 1.3 `createTestContainer.ts` (71.4% → 100%) — 2 Branches

**Problem:** Test-Helper mit ungetesteten Error-Pfaden.
**Lage:** `src/tests/helpers/createTestContainer.ts`
**Maßnahme:** Diese Datei ist Test-Code. Aus Coverage ausschließen.

**Empfohlen:** `exclude: ['**/tests/**']` in Coverage-Config (bereits Standard, aber ggf. anpassen).

**Erwarteter Gewinn:** +2 Branches im Nenner weniger → ~0.07%

---

## Phase 2: Hoch-Impact-Dateien (meiste fehlende Branches)

### 2.1 `formatter.ts` (87% → 95%+) — 12 fehlende Branches

**Lage:** `src/services/code/formatter.ts`
**Ursache:** Ungetestete Zweige in `replaceDoubleWithSingle()`, `replaceSingleWithDouble()`, `addMissingSemicolons()`, `reindent()`.

**Tests:**
```
✓ formatCode mit quotes='double' ersetzt einfache durch doppelte
✓ formatCode mit quotes='single' ersetzt doppelte durch einfache
✓ formatCode mit semicolons=false fuegt keine Semikolons hinzu
✓ formatCode mit useTabs=true verwendet Tabs
✓ replaceDoubleWithSingle ignoriert Template Literals
✓ replaceDoubleWithSingle ignoriert Kommentare (//, /*, *)
✓ replaceSingleWithDouble ignoriert Template Literals
✓ replaceSingleWithDouble ignoriert Kommentare
✓ addMissingSemicolons fuegt Semikolon an nicht-leere Zeilen
✓ addMissingSemicolons fuegt kein Semikolon an leere Zeilen
✓ reindent berechnet Einrueckung korrekt
✓ reindent mit Tabs statt Spaces
```

**Erwarteter Gewinn:** +12 Branches → ~0.43%

### 2.2 `memory_service.ts` (85.9% → 95%+) — 12 fehlende Branches

**Lage:** `src/services/memory/memory_service.ts`
**Ursache:** Ungetestete Error-Pfade in `searchMemories()` (category-Filter, minSimilarity), `updateMemory()` (Partial-Updates), `importMemories()` (merge-Modus).

**Tests:**
```
✓ searchMemories mit category-Filter
✓ searchMemories mit minSimilarity=0.9 (strenge Schwelle)
✓ searchMemories mit leerer DB
✓ searchMemories mit sehr vielen Ergebnissen (>100)
✓ updateMemory nur content aktualisieren (ohne category/tags)
✓ updateMemory nur category aktualisieren
✓ updateMemory nur tags aktualisieren
✓ updateMemory bei nicht-existenter UUID gibt null
✓ importMemories mit merge=true (Duplikate vermeiden)
✓ importMemories mit merge=false (Uberschreiben)
✓ importMemories mit ungueltigem Format
✓ cleanupMemories mit category-Filter
```

**Erwarteter Gewinn:** +12 Branches → ~0.43%

### 2.3 `symbol_extractor.ts` (87.6% → 95%+) — 12 fehlende Branches

**Lage:** `src/services/indexing/symbol_extractor.ts`
**Ursache:** Ungetestete Zweige in `buildCommentRanges()` (verschachtelte Strings, escaped Chars), `calculateNestingDepth()` (Strings/Kommentare).

**Tests:**
```
✓ buildCommentRanges erkennt // Kommentare
✓ buildCommentRanges erkennt /* */ Kommentare
✓ buildCommentRanges ignoriert Strings mit // darin
✓ buildCommentRanges ignoriert Strings mit /* darin
✓ buildCommentRanges mit escaped Quotes
✓ isPositionInComment mit mehreren Ranges
✓ extractSymbols mit Klassen in /* */ Kommentar
✓ extractSymbols mit Funktionen in // Kommentar
✓ calculateComplexity mit verschachtelten Bedingungen
✓ calculateNestingDepth mit Strings die { enthalten
✓ calculateNestingDepth mit // Kommentare die { enthalten
✓ calculateNestingDepth mit /* */ Kommentare die { enthalten
```

**Erwarteter Gewinn:** +12 Branches → ~0.43%

### 2.4 `metrics_collector.ts` (80.4% → 95%+) — 11 fehlende Branches

**Lage:** `src/services/metrics/metrics_collector.ts`
**Ursache:** NoOpCollector vs RealCollector, percentile() Edge-Cases, standardDeviation() mit <2 Werten.

**Tests:**
```
✓ NoOpCollector bei ENABLED=false
✓ RealCollector.timer() misst Dauer korrekt
✓ RealCollector.gauge() speichert Wert mit Tags
✓ RealCollector.increment() zaehlt korrekt
✓ RealCollector.histogram() berechnet Percentile
✓ percentile() mit leerem Array gibt 0
✓ percentile() mit einem Wert gibt den Wert zurueck
✓ percentile() mit zwei Werten interpoliert
✓ standardDeviation() mit einem Wert gibt 0
✓ standardDeviation() mit zwei Werten
✓ aggregate() gruppiert nach Tags
✓ reset() loescht alle Punkte und Counter
```

**Erwarteter Gewinn:** +11 Branches → ~0.40%

### 2.5 `refactoring_engine.ts` (88.2% → 95%+) — 9 fehlende Branches

**Lage:** `src/services/code/refactoring_engine.ts`
**Ursache:** Ungetestete Error-Pfade in `extractFunction()`, `renameSymbol()`, `splitFunction()`, `inlineVariable()`.

**Tests:**
```
✓ extractFunction mit ungueltigen Zeilen (start > end)
✓ extractFunction mit startLine=0
✓ extractFunction mit endLine > lines.length
✓ renameSymbol mit leerem oldName
✓ renameSymbol mit leerem newName
✓ renameSymbol mit ungueltigen Characters im Namen
✓ splitFunction bei nicht-existenter Funktion
✓ inlineVariable bei nicht-existenter Variable
✓ inlineVariable bei Variable mit mehreren Zuweisungen
```

**Erwarteter Gewinn:** +9 Branches → ~0.32%

### 2.6 `git_service.ts` (89.3% → 95%+) — 9 fehlende Branches

**Lage:** `src/services/git/git_service.ts`
**Ursache:** Error-Pfade bei Git-Befehlen (nicht-Git-Repo, Berechtigungen).

**Tests:**
```
✓ git_status in nicht-Git-Repository gibt Error
✓ git_diff mit ungueltigem Referenz-Branch
✓ git_log mit anzahl=0 gibt leeres Array
✓ analyze_diff_stats mit leerem Diff
✓ analyze_diff_risiko mit Sicherheits-relevanten Dateien
✓ analyze_diff_klassifizierung mit Feature-Keywords
✓ analyze_diff_klassifizierung mit Bugfix-Keywords
✓ git_commit mit leeren staged changes
✓ git_push mit nicht-existendem Remote
```

**Erwarteter Gewinn:** +9 Branches → ~0.32%

---

## Phase 3: Mittel-Impact-Dateien

### 3.1 `file_operations.ts` (83% → 95%+) — 8 fehlende Branches

**Lage:** `src/services/files/file_operations.ts`
**Tests:**
```
✓ readFile mit Binaerdatei wirft Error
✓ readFile mit zu grosser Datei wirft Error
✓ writeFile mit zu grossem Inhalt wirft Error
✓ createFile mit existierender Datei wirft Error
✓ editFile mit nicht-existierender Datei wirft Error
✓ deleteFile mit nicht-existierender Datei
✓ copyFile zwischen Verzeichnissen
✓ moveFile mit nicht-existierender Quelle
```

**Erwarteter Gewinn:** +8 Branches → ~0.29%

### 3.2 `write_queue.ts` (85.1% → 95%+) — 7 fehlende Branches

**Lage:** `src/services/database/write_queue.ts`
**Tests:**
```
✓ enqueueWrite mit Shared Fallback-Connection
✓ enqueueWrite mit Worker-Error
✓ enqueueTransaction mit Shared Fallback
✓ stopWorker schliesst Fallback-DB
✓ resetFallbackDb setzt Connection zurueck
✓ enqueueWrite mit leeren params
✓ enqueueTransaction mit leerer statements-Liste
```

**Erwarteter Gewinn:** +7 Branches → ~0.25%

### 3.3 `diff_analyzer.ts` (88.3% → 95%+) — 7 fehlende Branches

**Lage:** `src/services/analyze/diff_analyzer.ts`
**Tests:**
```
✓ parseNumstat mit Binaer-Dateien (-/-)
✓ parseNumstat mit ungueltigen Zeilen
✓ getDiffStats mit Referenz-Branch
✓ analyzeDiffRisiko mit security-sensitiven Dateien
✓ analyzeDiffRisiko mit vielen geaenderten Dateien
✓ analyzeDiffClassification mit Feature-Keywords
✓ analyzeDiffClassification mit Refactor-Keywords
```

**Erwarteter Gewinn:** +7 Branches → ~0.25%

### 3.4 `sandbox.ts` (78.8% → 95%+) — 7 fehlende Branches

**Lage:** `src/services/security/sandbox.ts`
**Tests:**
```
✓ runInSandbox mit allowConsole=false
✓ runInSandbox mit zu langem Code
✓ runInSandbox mit gefaehrlichem Pattern (require)
✓ runInSandbox mit gefaehrlichem Pattern (process)
✓ runInSandbox mit Memory-Overflow
✓ runInSandbox mit Timeout
✓ scanCodeSafety mit mehreren Patterns
```

**Erwarteter Gewinn:** +7 Branches → ~0.25%

### 3.5 `reasoning_bank.ts` (80.6% → 95%+) — 6 fehlende Branches

**Lage:** `src/services/hooks/reasoning_bank.ts`
**Tests:**
```
✓ storeTrajectory mit optionalen Feldern (keine filepath/context)
✓ storeTrajectory mit cleanup bei 50 Trajectories
✓ retrieveSimilarPatterns mit exaktem Match
✓ retrieveSimilarPatterns mit filepath-Match
✓ retrieveSimilarPatterns mit keinem Match
✓ distillPattern mit unzureichenden Trajectories
```

**Erwarteter Gewinn:** +6 Branches → ~0.22%

### 3.6 `secret_detector.ts` (80.6% → 95%+) — 6 fehlende Branches

**Lage:** `src/services/security/secret_detector.ts`
**Tests:**
```
✓ scanCode mit AWS Access Key
✓ scanCode mit GitHub Token
✓ scanCode mit privatem Schluessel
✓ scanCode mit JWT-Token
✓ scanCode mit Connection-String
✓ scanCode mit Bearer-Token
✓ calculateEntropy mit leerem String
✓ calculateEntropy mit hohem Entropie-Wert
```

**Erwarteter Gewinn:** +6 Branches → ~0.22%

---

## Phase 4: Kleinere Dateien (1-5 fehlende Branches)

### 4.1 `embedding_service.ts` (81.5% → 95%+) — 5 Branches

**Tests:**
```
✓ textToEmbedding mit LM Studio Timeout und Fallback
✓ textToEmbedding mit Cache-Key-Kollision (gleicher Hash)
✓ cosineSimilarityFloat64 mit Float64Array
✓ cosineSimilarityFloat64 mit number[]
```

### 4.2 `document_service.ts` (80.8% → 95%+) — 5 Branches

**Tests:**
```
✓ extractTextFromDocument mit PDF
✓ extractTextFromDocument mit DOCX
✓ extractTextFromDocument mit Text-Datei
✓ extractPdfText mit zu grosser Datei
✓ extractDocxText mit zu grosser Datei
```

### 4.3 `file_search.ts` (87.2% → 95%+) — 5 Branches

**Tests:**
```
✓ searchFiles mit caseInsensitive=false
✓ searchContent mit maxFiles=1
✓ searchContent mit dotfiles (ueberspringen)
✓ searchContent mit node_modules (ueberspringen)
```

### 4.4 `agent_registry_service.ts` (88.4% → 95%+) — 5 Branches

**Tests:**
```
✓ getAgent bei nicht-existenter UUID
✓ deactivateAgent bei nicht-existenter UUID
✓ updateStatus bei nicht-existenter UUID
✓ syncBuiltinAgents mit existierenden Agenten
```

### 4.5 `task_runner.ts` (86.2% → 95%+) — 4 Branches

**Tests:**
```
✓ submit mit targetAgent
✓ waitForTask bei bereits completed Task
✓ waitForTask bei bereits failed Task
✓ finalizeTask mit pending resolve
```

### 4.6 `snippet_extraction.ts` (75% → 95%+) — 4 Branches

**Tests:**
```
✓ extractQualifiedSnippets mit zu kleinen Block (<3 Zeilen)
✓ extractQualifiedSnippets mit zu grossen Block (>50 Zeilen)
✓ extractQualifiedSnippets mit Duplikat
✓ extractQualifiedSnippets mit saveSnippet-Error
```

### 4.7 `path_validator.ts` (85.7% → 95%+) — 4 Branches

**Tests:**
```
✓ validateFilePath mit Path Traversal (../)
✓ validateFilePath mit Workspace-Root
✓ validateFilePath ohne Workspace-Root
✓ assertDirectoryExists bei nicht-existierendem Verzeichnis
```

### 4.8 `step_runner.ts` (85% → 95%+) — 3 Branches

**Tests:**
```
✓ run mit maxConcurrentTasks erreicht
✓ run mit Executor-Error
✓ run ohne Executor/Selector (Simulation)
```

### 4.9 `task_scheduler.ts` (85% → 95%+) — 3 Branches

**Tests:**
```
✓ start bei bereits laufendem Scheduler
✓ notify bei nicht-laufendem Scheduler
✓ processQueue mit leerer Queue
```

### 4.10 `write_worker.ts` (82.4% → 95%+) — 3 Branches

**Tests:**
```
✓ handleWorkerMessage mit unbekanntem Typ
✓ handleWorkerMessage mit SQL-Error
✓ startWorkerThread ohne parentPort
```

### 4.11 `chain_runner.ts` (88.2% → 95%+) — 2 Branches

**Tests:**
```
✓ run mit nicht-existentem Agenten
✓ run ohne Executor/Selector (Simulation)
```

### 4.12 `encryption.ts` (88.9% → 95%+) — 2 Branches

**Tests:**
```
✓ encrypt mit leerem Text
✓ decrypt mit ungueltigem ciphertext
```

### 4.13 `file_discovery.ts` (83.3% → 95%+) — 2 Branches

**Tests:**
```
✓ discoverFiles mit Binaerdatei
✓ discoverFiles mit zu grosser Datei (>200KB)
```

### 4.14 `snippet_db_manager.ts` (86.7% → 95%+) — 2 Branches

**Tests:**
```
✓ closeSnippetDb bei nicht-existenter Sprache
✓ listLanguages bei leerem Verzeichnis
```

### 4.15 `tool_state.ts` (75% → 95%+) — 2 Branches

**Tests:**
```
✓ getRealHandlerMap mit Container
✓ getRealHandlerMap ohne Container (temp Map)
```

### 4.16 `architecture_builder.ts` (88.2% → 95%+) — 2 Branches

**Tests:**
```
✓ getModuleName mit Datei in src/ (root)
✓ findModuleForFile bei nicht-existentem Modul
```

### 4.17 `directory_walker.ts` (89.1% → 95%+) — 5 Branches

**Tests:**
```
✓ directoryWalker mit excludeDirs
✓ directoryWalker mit extensions-Filter
✓ directoryWalker mit maxFiles=1
✓ directoryWalker mit relativeTo
```

### 4.18 `format.ts` (85.7% → 100%) — 1 Branch

**Tests:**
```
✓ extractErrorMessage mit Error-Objekt
```

---

## Implementierungsreihenfolge

| Schritt | Datei | Aufwand | Branches | Erwarteter Gewinn |
|---|---|---|---|---|
| 1 | Coverage-Config anpassen (Typ-Dateien) | 5 min | 3 | +0.11% |
| 2 | `formatter.ts` Tests | 30 min | 12 | +0.43% |
| 3 | `memory_service.ts` Tests | 45 min | 12 | +0.43% |
| 4 | `symbol_extractor.ts` Tests | 30 min | 12 | +0.43% |
| 5 | `metrics_collector.ts` Tests | 30 min | 11 | +0.40% |
| 6 | `refactoring_engine.ts` Tests | 30 min | 9 | +0.32% |
| 7 | `git_service.ts` Tests | 30 min | 9 | +0.32% |
| 8 | `file_operations.ts` Tests | 20 min | 8 | +0.29% |
| 9 | `write_queue.ts` Tests | 20 min | 7 | +0.25% |
| 10 | `diff_analyzer.ts` Tests | 20 min | 7 | +0.25% |
| 11 | `sandbox.ts` Tests | 20 min | 7 | +0.25% |
| 12 | `reasoning_bank.ts` Tests | 20 min | 6 | +0.22% |
| 13 | `secret_detector.ts` Tests | 20 min | 6 | +0.22% |
| 14 | Phase 4 (alle kleinen Dateien) | 45 min | 44 | +1.57% |
| **Gesamt** | | **~6.5 Stunden** | **~173** | **~5.46%** |

---

## Ziel nach Implementierung

| Metrik | Aktuell | Ziel | Nach Plan |
|---|---|---|---|
| Lines | 95.3% | > 90% | ~96% |
| Statements | 95.3% | > 90% | ~96% |
| Functions | 97.2% | > 90% | ~97% |
| Branches | 89.8% | > 90% | **~95%** |

---

## Risiken & Hinweise

1. **Test-Isolation:** Alle neuen Tests muessen `resetDb()` und `clearEmbeddingCache()` im `beforeEach` aufrufen.
2. **Flaky Tests:** Timing-abhaengige Tests (Orchestrator, Scheduler) vermeiden.
3. **Performance:** Coverage-Tests sollten schnell sein (< 1s pro Test).
4. **Redundanz:** Bestehende Tests in `priority2_branch_test.ts` und `coverage_*_test.ts` zuerst pruefen, um Duplikate zu vermeiden.
5. **Git-Tests:** `git_service.ts` Tests koennen mock-basiert sein (keine echten Git-Befehle).
