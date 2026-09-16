/**
 * Domain-Modell eines Termins (API-Vertrag).
 * `datum` ist ein ISO-Datumsstring im Format YYYY-MM-DD,
 * Zeitstempel sind ISO-Strings (JSON-Serialisierung von Prisma-Date).
 */
export interface Termin {
  id: string;
  titel: string;
  datum: string;
  uhrzeit: string;
  beschreibung: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/** Eingabe fuer POST /api/termine (Zod-Validiert). */
export interface TerminCreateInput {
  titel: string;
  datum: string;
  uhrzeit: string;
  beschreibung?: string | null | undefined;
}

/** Eingabe fuer PUT /api/termine/[id] — alle Felder optional. */
export interface TerminUpdateInput {
  titel?: string | undefined;
  datum?: string | undefined;
  uhrzeit?: string | undefined;
  beschreibung?: string | null | undefined;
}

export type TerminWithCount = Termin & { terminCount?: number };
