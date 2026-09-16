import { z } from 'zod';

/** Prueft, ob die Zeichenfolge ein gueltiges Kalenderdatum ist (nicht nur das Format). */
export function isKalenderdatum(value: string): boolean {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export const TerminSchema = z.object({
  titel: z.string()
    .min(1, 'Titel ist erforderlich')
    .max(200, 'Titel darf maximal 200 Zeichen lang sein'),
  datum: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum muss im Format YYYY-MM-DD sein')
    .refine(isKalenderdatum, 'Datum ist kein gueltiges Kalenderdatum'),
  uhrzeit: z.string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Uhrzeit muss im Format HH:MM sein'),
  beschreibung: z.string()
    .max(1000, 'Beschreibung darf maximal 1000 Zeichen lang sein')
    .optional()
    .nullable(),
});

export const TerminCreateSchema = TerminSchema;
export const TerminUpdateSchema = TerminSchema.partial();

export type TerminInput = z.infer<typeof TerminSchema>;
export type TerminUpdateInput = z.infer<typeof TerminUpdateSchema>;
