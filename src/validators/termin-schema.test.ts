import { describe, it, expect } from 'vitest';
import { TerminSchema, TerminCreateSchema, TerminUpdateSchema } from './termin-schema';

const validTermin = {
  titel: 'Team-Meeting',
  datum: '2026-09-15',
  uhrzeit: '09:30',
};

describe('TerminSchema', () => {
  it('akzeptiert einen gueltigen Termin ohne Beschreibung', () => {
    const result = TerminSchema.safeParse(validTermin);
    expect(result.success).toBe(true);
  });

  it('akzeptiert einen Termin mit Beschreibung', () => {
    const result = TerminSchema.safeParse({ ...validTermin, beschreibung: 'Agenda besprechen' });
    expect(result.success).toBe(true);
  });

  it('lehnt leeren Titel ab', () => {
    const result = TerminSchema.safeParse({ ...validTermin, titel: '' });
    expect(result.success).toBe(false);
  });

  it('lehnt Titel ueber 200 Zeichen ab', () => {
    const result = TerminSchema.safeParse({ ...validTermin, titel: 'x'.repeat(201) });
    expect(result.success).toBe(false);
  });

  it('lehnt ungültiges Datumsformat ab', () => {
    expect(TerminSchema.safeParse({ ...validTermin, datum: '15.09.2026' }).success).toBe(false);
    expect(TerminSchema.safeParse({ ...validTermin, datum: '2026-13-45' }).success).toBe(false);
    expect(TerminSchema.safeParse({ ...validTermin, datum: '20260915' }).success).toBe(false);
  });

  it('lehnt ungültige Uhrzeiten ab', () => {
    expect(TerminSchema.safeParse({ ...validTermin, uhrzeit: '24:00' }).success).toBe(false);
    expect(TerminSchema.safeParse({ ...validTermin, uhrzeit: '9:30' }).success).toBe(false);
    expect(TerminSchema.safeParse({ ...validTermin, uhrzeit: '09:60' }).success).toBe(false);
  });

  it('akzeptiert Grenzwerte der Uhrzeit', () => {
    expect(TerminSchema.safeParse({ ...validTermin, uhrzeit: '00:00' }).success).toBe(true);
    expect(TerminSchema.safeParse({ ...validTermin, uhrzeit: '23:59' }).success).toBe(true);
  });

  it('lehnt Beschreibung ueber 1000 Zeichen ab', () => {
    const result = TerminSchema.safeParse({ ...validTermin, beschreibung: 'x'.repeat(1001) });
    expect(result.success).toBe(false);
  });

  it('meldet Fehler mit issues (Zod v4)', () => {
    const result = TerminSchema.safeParse({ titel: '', datum: 'bad', uhrzeit: 'bad' });
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(3);
      expect(result.error.issues[0].message).toBeTruthy();
    } else {
      throw new Error('Erwartet wurde ein Validierungsfehler');
    }
  });
});

describe('TerminCreateSchema', () => {
  it('ist identisch zum TerminSchema', () => {
    expect(TerminCreateSchema).toBe(TerminSchema);
  });
});

describe('TerminUpdateSchema', () => {
  it('akzeptiert Partial-Updates (nur ein Feld)', () => {
    const result = TerminUpdateSchema.safeParse({ titel: 'Neuer Titel' });
    expect(result.success).toBe(true);
  });

  it('akzeptiert leeres Objekt (kein Feld geaendert)', () => {
    const result = TerminUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('validiert vorhandene Felder weiterhin', () => {
    const result = TerminUpdateSchema.safeParse({ uhrzeit: '25:00' });
    expect(result.success).toBe(false);
  });
});
