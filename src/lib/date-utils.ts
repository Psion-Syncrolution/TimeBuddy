import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

export function formatDatumDE(dateStr: string): string {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'dd.MM.yyyy', { locale: de });
}

export function formatZeitDE(time: string): string {
  // Eingabe ist bereits im Format HH:MM — nur normalisieren (z. B. "9:30" -> "09:30")
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return time;
  return `${match[1].padStart(2, '0')}:${match[2]}`;
}

export function formatLangDE(dateStr: string): string {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'EEEE, dd. MMMM yyyy', { locale: de });
}

export function formatKurzDE(dateStr: string): string {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'dd.MM.', { locale: de });
}

export function getWochentagName(dateStr: string): string {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'EEEE', { locale: de });
}

export function getMonatsname(month: number): string {
  const date = new Date(2000, month, 1);
  return format(date, 'MMMM', { locale: de });
}

export function isHeute(dateStr: string): boolean {
  const today = new Date();
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isVorher(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  date.setHours(0, 0, 0, 0);
  return date < today;
}

export function isInZukunft(dateStr: string): boolean {
  return !isVorher(dateStr) && !isHeute(dateStr);
}
