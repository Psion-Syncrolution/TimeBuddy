import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  getWeeksInMonth,
  eachDayOfInterval,
  getWeek,
  isSameMonth,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { StatistikDatum } from '@/types/calendar';

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

export function getMonthRange(year: number, month: number) {
  return {
    start: startOfMonth(new Date(year, month)),
    end: endOfMonth(new Date(year, month)),
    days: eachDayOfInterval({
      start: startOfMonth(new Date(year, month)),
      end: endOfMonth(new Date(year, month)),
    }),
    weeksInMonth: getWeeksInMonth(new Date(year, month)),
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

export function formatDateDE(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatTimeDE(time: string): string {
  return time; // HH:MM Format bleibt unverändert
}

export function getTerminFarbe(count: number): string {
  if (count >= 9) return 'hoch';
  if (count >= 5) return 'mittel';
  if (count >= 1) return 'niedrig';
  return '';
}

export function parseDateString(dateStr: string): Date {
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

export function createStatistik(termine: { datum: string }[]): StatistikDatum[] {
  const groups = groupByDate(termine);
  return Array.from(groups.entries()).map(([datum, count]) => ({ datum, count }));
}
