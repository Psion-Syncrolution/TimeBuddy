import { TERMIN_FARBEN } from '@/constants/farben';

export function getTerminHintergrund(count: number): string {
  if (count >= 9) return TERMIN_FARBEN.hoch;
  if (count >= 5) return TERMIN_FARBEN.mittel;
  if (count >= 1) return TERMIN_FARBEN.niedrig;
  return 'transparent';
}

export function getTerminBorder(count: number): string {
  if (count >= 9) return 'border-orange-500';
  if (count >= 5) return 'border-yellow-500';
  if (count >= 1) return 'border-green-500';
  return 'border-gray-200';
}

export function getTerminTextColor(count: number): string {
  if (count >= 5) return 'text-white';
  return 'text-gray-900';
}

export function getFarbeLabel(count: number): string {
  if (count >= 9) return 'Viele Termine (9+)';
  if (count >= 5) return 'Mittel (5-8)';
  if (count >= 1) return 'Wenige (1-4)';
  return 'Keine Termine';
}
