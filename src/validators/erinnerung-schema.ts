import { z } from 'zod';

export const ErinnerungSchema = z.object({
  terminId: z.string()
    .min(1, 'Termin-Auswahl ist erforderlich'),
  erinnerung: z.string()
    .min(1, 'Erinnerungstext ist erforderlich')
    .max(500, 'Erinnerung darf maximal 500 Zeichen lang sein'),
  datum: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum muss im Format YYYY-MM-DD sein'),
  uhrzeit: z.string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Uhrzeit muss im Format HH:MM sein'),
  beschreibung: z.string()
    .max(1000, 'Beschreibung darf maximal 1000 Zeichen lang sein')
    .optional()
    .nullable(),
});

export const ErinnerungUpdateSchema = ErinnerungSchema.partial();

export type ErinnerungInput = z.infer<typeof ErinnerungSchema>;
export type ErinnerungUpdateInput = z.infer<typeof ErinnerungUpdateSchema>;
