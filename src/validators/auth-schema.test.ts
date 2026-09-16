import { describe, it, expect } from 'vitest';
import { LoginSchema, RegisterSchema } from './auth-schema';

describe('LoginSchema', () => {
  it('akzeptiert gueltige Zugangsdaten', () => {
    const result = LoginSchema.safeParse({ email: 'test@example.com', password: 'geheim123' });
    expect(result.success).toBe(true);
  });

  it('lehnt ungültige E-Mail ab', () => {
    const result = LoginSchema.safeParse({ email: 'keine-email', password: 'geheim123' });
    expect(result.success).toBe(false);
  });

  it('lehnt leeres Passwort ab', () => {
    const result = LoginSchema.safeParse({ email: 'test@example.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('RegisterSchema', () => {
  const valid = {
    email: 'neu@example.com',
    password: 'sehrgeheim123',
    confirmPassword: 'sehrgeheim123',
  };

  it('akzeptiert eine gueltige Registrierung', () => {
    const result = RegisterSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('lehnt Passwort unter 8 Zeichen ab', () => {
    const result = RegisterSchema.safeParse({ ...valid, password: 'kurz123', confirmPassword: 'kurz123' });
    expect(result.success).toBe(false);
  });

  it('lehnt Passwort ueber 100 Zeichen ab', () => {
    const long = 'x'.repeat(101);
    const result = RegisterSchema.safeParse({ ...valid, password: long, confirmPassword: long });
    expect(result.success).toBe(false);
  });

  it('lehnt ungleiche Passwoerter ab (Refine)', () => {
    const result = RegisterSchema.safeParse({ ...valid, confirmPassword: 'anders12345' });
    if (!result.success) {
      // Fehler muss auf dem confirmPassword-Pfad liegen
      expect(result.error.issues.some((i) => i.path[0] === 'confirmPassword')).toBe(true);
    } else {
      throw new Error('Erwartet wurde ein Validierungsfehler');
    }
  });

  it('lehnt fehlende Bestaetigung ab', () => {
    const { confirmPassword: _omit, ...rest } = valid;
    expect(RegisterSchema.safeParse(rest).success).toBe(false);
  });
});
