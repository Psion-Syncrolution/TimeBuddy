import { describe, it, expect } from 'vitest';
import { ErinnerungSchema, ErinnerungUpdateSchema } from './erinnerung-schema';

const validErinnerung = {
  terminId: 'abc123',
  erinnerung: 'Präsentation vorbereiten',
  datum: '2026-09-15',
  uhrzeit: '08:00',
};

describe('ErinnerungSchema', () => {
  it('akzeptiert eine gueltige Erinnerung', () => {
    const result = ErinnerungSchema.safeParse(validErinnerung);
    expect(result.success).toBe(true);
  });

  it('akzeptiert eine Erinnerung mit Beschreibung', () => {
    const result = ErinnerungSchema.safeParse({ ...validErinnerung, beschreibung: 'Details' });
    expect(result.success).toBe(true);
  });

  it('lehnt fehlende terminId ab', () => {
    const { erinnerung, datum, uhrzeit } = validErinnerung;
    expect(ErinnerungSchema.safeParse({ erinnerung, datum, uhrzeit }).success).toBe(false);
  });

  it('lehnt leeren Erinnerungstext ab', () => {
    expect(ErinnerungSchema.safeParse({ ...validErinnerung, erinnerung: '' }).success).toBe(false);
  });

  it('lehnt Erinnerung ueber 500 Zeichen ab', () => {
    const result = ErinnerungSchema.safeParse({ ...validErinnerung, erinnerung: 'x'.repeat(501) });
    expect(result.success).toBe(false);
  });

  it('lehnt ungültiges Datum ab', () => {
    expect(ErinnerungSchema.safeParse({ ...validErinnerung, datum: '2026/09/15' }).success).toBe(false);
  });

  it('lehnt ungültige Uhrzeit ab', () => {
    expect(ErinnerungSchema.safeParse({ ...validErinnerung, uhrzeit: 'ab:cd' }).success).toBe(false);
  });
});

describe('ErinnerungUpdateSchema', () => {
  it('akzeptiert Partial-Updates', () => {
    const result = ErinnerungUpdateSchema.safeParse({ erinnerung: 'Geaendert' });
    expect(result.success).toBe(true);
  });

  it('validiert vorhandene Felder weiterhin', () => {
    const result = ErinnerungUpdateSchema.safeParse({ datum: 'invalid' });
    expect(result.success).toBe(false);
  });
});
