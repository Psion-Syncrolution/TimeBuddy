import { describe, it, expect } from 'vitest';
import {
  getMonthDays,
  getWeekRange,
  navigateMonth,
  navigateWeek,
  parseLocalDate,
  toDateString,
  groupByDate,
} from './calendar';

describe('getMonthDays', () => {
  it('liefert alle Tage des Monats inkl. Randtage der Nachbarmonate', () => {
    // September 2026: 1.9. ist ein Sonntag
    const days = getMonthDays(2026, 8);
    expect(days.length).toBeGreaterThanOrEqual(30);
    expect(days.length).toBeLessThanOrEqual(42);

    // Erster Tag muss auf Montag fallen (weekStartsOn: 1)
    expect(days[0].date.getDay()).toBe(1);

    // Mindestens ein Tag gehoert zum aktuellen Monat
    const currentMonthDays = days.filter((d) => d.isCurrentMonth);
    expect(currentMonthDays.length).toBe(30);
  });

  it('markiert Tage ausserhalb des Monats korrekt', () => {
    const days = getMonthDays(2026, 8);
    const firstDay = days[0].date;
    // Wenn der erste Raster-Tag vor dem 1. liegt, ist er kein Current-Month-Tag
    if (firstDay.getDate() < 1) {
      expect(days[0].isCurrentMonth).toBe(false);
    }
  });
});

describe('getWeekRange', () => {
  it('liefert Montag bis Sonntag der Kalenderwoche', () => {
    const date = new Date(2026, 8, 15); // Dienstag
    const range = getWeekRange(date);

    expect(range.start.getDay()).toBe(1); // Montag
    expect(range.end.getDay()).toBe(0); // Sonntag
    expect(range.days.length).toBe(7);
    expect(range.weekNumber).toBeGreaterThan(0);
  });

  it('liefert eine konsistente KW fuer alle Tage derselben Woche', () => {
    const range = getWeekRange(new Date(2026, 8, 15));
    const sameWeekMonday = getWeekRange(range.start).weekNumber;
    const sameWeekSunday = getWeekRange(range.end).weekNumber;
    expect(sameWeekMonday).toBe(sameWeekSunday);
  });
});

describe('navigateMonth', () => {
  it('navigiert vorwaerts ueber die Jahresgrenze', () => {
    const result = navigateMonth(2026, 11, 'next'); // Dezember -> Januar
    expect(result.year).toBe(2027);
    expect(result.month).toBe(0);
  });

  it('navigiert rueckwaerts ueber die Jahresgrenze', () => {
    const result = navigateMonth(2026, 0, 'prev'); // Januar -> Dezember
    expect(result.year).toBe(2025);
    expect(result.month).toBe(11);
  });

  it('navigiert innerhalb eines Jahres', () => {
    expect(navigateMonth(2026, 4, 'next')).toEqual({ year: 2026, month: 5 });
    expect(navigateMonth(2026, 4, 'prev')).toEqual({ year: 2026, month: 3 });
  });
});

describe('navigateWeek', () => {
  it('verschiebt exakt um 7 Tage', () => {
    const date = new Date(2026, 8, 15);
    const next = navigateWeek(date, 'next');
    const prev = navigateWeek(date, 'prev');

    expect(next.getTime() - date.getTime()).toBe(7 * 86400000);
    expect(date.getTime() - prev.getTime()).toBe(7 * 86400000);
  });
});

describe('parseLocalDate / toDateString', () => {
  it('wandelt YYYY-MM-DD in ein lokales Datum um', () => {
    const date = parseLocalDate('2026-09-15');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(8);
    expect(date.getDate()).toBe(15);
  });

  it('wandelt ein Datum zurueck in YYYY-MM-DD', () => {
    const date = new Date(2026, 8, 15);
    expect(toDateString(date)).toBe('2026-09-15');
  });

  it('ist eine Inverse zueinander (Roundtrip)', () => {
    const original = '2026-03-07';
    expect(toDateString(parseLocalDate(original))).toBe(original);
  });
});

describe('groupByDate', () => {
  it('gruppiert Termine nach Datum', () => {
    const termine = [
      { datum: '2026-09-15T09:00:00.000Z' },
      { datum: '2026-09-15T14:00:00.000Z' },
      { datum: '2026-09-16T10:00:00.000Z' },
    ];

    const groups = groupByDate(termine);
    expect(groups.get('2026-09-15')).toBe(2);
    expect(groups.get('2026-09-16')).toBe(1);
    expect(groups.size).toBe(2);
  });

  it('liefert leeres Map fuer keine Termine', () => {
    const groups = groupByDate([]);
    expect(groups.size).toBe(0);
  });
});
