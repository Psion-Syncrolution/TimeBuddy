import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  getWeek,
  isSameMonth,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
} from 'date-fns';
import { de } from 'date-fns/locale';

export function getMonthDays(year: number, month: number) {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  const weekStart = startOfWeek(start, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(end, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: weekStart, end: weekEnd }).map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, start),
  }));
}

export function getWeekRange(date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return {
    start,
    end,
    days: eachDayOfInterval({ start, end }),
    weekNumber: getWeek(date, { locale: de, weekStartsOn: 1 as const }),
  };
}

export function navigateMonth(year: number, month: number, direction: 'prev' | 'next') {
  const date = new Date(year, month);
  const newDate = direction === 'next' ? addMonths(date, 1) : subMonths(date, 1);
  return { year: newDate.getFullYear(), month: newDate.getMonth() };
}

export function navigateWeek(date: Date, direction: 'prev' | 'next') {
  return direction === 'next' ? addWeeks(date, 1) : subWeeks(date, 1);
}

/** ISO-Kalenderwoche (KW) eines Datums. */
export function getWeekNumber(date: Date): number {
  return getWeek(date, { locale: de, weekStartsOn: 1 });
}

/** Parst YYYY-MM-DD als lokales Datum (ohne Zeitzonen-Shift). */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toDateString(date: Date): string {
  // Verwende explizit das lokale Datum, um Zeitzonen-Shifts zu vermeiden
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function groupByDate(termine: { datum: string }[]): Map<string, number> {
  const groups = new Map<string, number>();
  for (const termin of termine) {
    const dateStr = termin.datum.slice(0, 10);
    groups.set(dateStr, (groups.get(dateStr) || 0) + 1);
  }
  return groups;
}
