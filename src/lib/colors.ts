import { TERMIN_FARBEN } from '@/constants/farben';

export function getTerminHintergrund(count: number): string {
  if (count >= 9) return TERMIN_FARBEN.hoch;
  if (count >= 5) return TERMIN_FARBEN.mittel;
  if (count >= 1) return TERMIN_FARBEN.niedrig;
  return 'transparent';
}

export function getTerminBorder(count: number): string {
  if (count >= 9) return 'border-red-500/60';
  if (count >= 5) return 'border-amber-500/60';
  if (count >= 1) return 'border-emerald-500/60';
  return 'border-white/10';
}

export function getTerminTextColor(count: number): string {
  if (count >= 5) return 'text-white';
  return 'text-ivory';
}

export function getFarbeLabel(count: number): string {
  if (count >= 9) return 'Viele Termine (9+)';
  if (count >= 5) return 'Mittel (5-8)';
  if (count >= 1) return 'Wenige (1-4)';
  return 'Keine Termine';
}
