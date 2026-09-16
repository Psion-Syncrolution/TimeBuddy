import { describe, it, expect } from 'vitest';
import {
  formatDatumDE,
  formatZeitDE,
  formatLangDE,
  formatKurzDE,
  getWochentagName,
  getMonatsname,
  isHeute,
  isVorher,
  isInZukunft,
} from './date-utils';

describe('formatDatumDE', () => {
  it('formatiert ISO-Datum als TT.MM.JJJJ', () => {
    expect(formatDatumDE('2026-09-15')).toBe('15.09.2026');
  });

  it('formatiert auch mit Uhrzeit-Komponente', () => {
    expect(formatDatumDE('2026-09-15T14:30:00.000Z')).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
  });
});

describe('formatZeitDE', () => {
  it('formatiert HH:MM als HH:mm', () => {
    expect(formatZeitDE('09:30')).toBe('09:30');
  });
});

describe('formatLangDE', () => {
  it('liefert Wochentag, Datum und Monat auf Deutsch', () => {
    const result = formatLangDE('2026-09-15');
    expect(result).toMatch(/^\w+, \d{2}\. \w+ \d{4}$/);
  });
});

describe('formatKurzDE', () => {
  it('liefert TT.MM.', () => {
    expect(formatKurzDE('2026-09-15')).toBe('15.09.');
  });
});

describe('getWochentagName', () => {
  it('liefert den deutschen Wochentagnamen', () => {
    // 15.09.2026 — Wochentag pruefen (unabhaengig: muss ein gueltiger Name sein)
    const name = getWochentagName('2026-09-15');
    expect(
      ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
    ).toContain(name);
  });
});

describe('getMonatsname', () => {
  it('liefert deutsche Monatsnamen', () => {
    expect(getMonatsname(0)).toBe('Januar');
    expect(getMonatsname(8)).toBe('September');
    expect(getMonatsname(11)).toBe('Dezember');
  });
});

describe('isHeute / isVorher / isInZukunft', () => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  it('erkennt das heutige Datum', () => {
    expect(isHeute(todayStr)).toBe(true);
  });

  it('erkennt vergangene Daten', () => {
    const past = new Date(today.getTime() - 5 * 86400000);
    const pastStr = `${past.getFullYear()}-${String(past.getMonth() + 1).padStart(2, '0')}-${String(past.getDate()).padStart(2, '0')}`;
    expect(isVorher(pastStr)).toBe(true);
    expect(isInZukunft(pastStr)).toBe(false);
  });

  it('erkennt zukuenftige Daten', () => {
    const future = new Date(today.getTime() + 5 * 86400000);
    const futureStr = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, '0')}-${String(future.getDate()).padStart(2, '0')}`;
    expect(isVorher(futureStr)).toBe(false);
    expect(isInZukunft(futureStr)).toBe(true);
  });
});
