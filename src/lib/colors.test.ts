import { describe, it, expect } from 'vitest';
import {
  getTerminHintergrund,
  getTerminBorder,
  getTerminTextColor,
  getFarbeLabel,
} from './colors';
import { TERMIN_FARBEN } from '@/constants/farben';

describe('getTerminHintergrund', () => {
  it('liefert transparent fuer keine Termine', () => {
    expect(getTerminHintergrund(0)).toBe('transparent');
  });

  it('liefert die niedrige Farbe fuer 1-4 Termine', () => {
    expect(getTerminHintergrund(1)).toBe(TERMIN_FARBEN.niedrig);
    expect(getTerminHintergrund(4)).toBe(TERMIN_FARBEN.niedrig);
  });

  it('liefert die mittlere Farbe fuer 5-8 Termine', () => {
    expect(getTerminHintergrund(5)).toBe(TERMIN_FARBEN.mittel);
    expect(getTerminHintergrund(8)).toBe(TERMIN_FARBEN.mittel);
  });

  it('liefert die hohe Farbe fuer 9+ Termine', () => {
    expect(getTerminHintergrund(9)).toBe(TERMIN_FARBEN.hoch);
    expect(getTerminHintergrund(20)).toBe(TERMIN_FARBEN.hoch);
  });
});

describe('getTerminBorder', () => {
  it('klassifiziert die Border-Farbe nach Schwellwerten', () => {
    expect(getTerminBorder(0)).toBe('border-white/10');
    expect(getTerminBorder(1)).toBe('border-emerald-500/60');
    expect(getTerminBorder(4)).toBe('border-emerald-500/60');
    expect(getTerminBorder(5)).toBe('border-amber-500/60');
    expect(getTerminBorder(8)).toBe('border-amber-500/60');
    expect(getTerminBorder(9)).toBe('border-red-500/60');
  });
});

describe('getTerminTextColor', () => {
  it('verwendet weissen Text ab 5 Terminen', () => {
    expect(getTerminTextColor(0)).toBe('text-ivory');
    expect(getTerminTextColor(4)).toBe('text-ivory');
    expect(getTerminTextColor(5)).toBe('text-white');
  });
});

describe('getFarbeLabel', () => {
  it('liefert deutsche Labels pro Kategorie', () => {
    expect(getFarbeLabel(0)).toBe('Keine Termine');
    expect(getFarbeLabel(3)).toBe('Wenige (1-4)');
    expect(getFarbeLabel(6)).toBe('Mittel (5-8)');
    expect(getFarbeLabel(12)).toBe('Viele Termine (9+)');
  });
});
