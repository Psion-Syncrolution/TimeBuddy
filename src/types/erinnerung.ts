/** Kurzform des zugehoerigen Termins (fuer Anzeige in Listen). */
export interface TerminKurz {
  id: string;
  titel: string;
}

/**
 * Domain-Modell einer Erinnerung (API-Vertrag).
 * `datum` ist ein ISO-Datumsstring im Format YYYY-MM-DD.
 */
export interface Erinnerung {
  id: string;
  terminId: string;
  erinnerung: string;
  datum: string;
  uhrzeit: string;
  beschreibung: string | null;
  userId: string;
  createdAt: string;
  /** Zugehoriger Termin (nur wenn via `include` geladen). */
  termin?: TerminKurz | undefined;
}

/** Eingabe fuer POST /api/erinnerungen (Zod-Validiert). */
export interface ErinnerungCreateInput {
  terminId: string;
  erinnerung: string;
  datum: string;
  uhrzeit: string;
  beschreibung?: string | null | undefined;
}

/** Eingabe fuer PUT /api/erinnerungen/[id] — alle Felder optional. */
export interface ErinnerungUpdateInput {
  terminId?: string | undefined;
  erinnerung?: string | undefined;
  datum?: string | undefined;
  uhrzeit?: string | undefined;
  beschreibung?: string | null | undefined;
}
