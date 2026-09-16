export const TERMIN_FARBEN = {
  niedrig: 'rgba(52, 211, 153, 0.15)',   // 1-4 Termine: Emerald-Tint
  mittel:  'rgba(251, 191, 36, 0.15)',   // 5-8 Termine: Amber-Tint
  hoch:    'rgba(248, 113, 113, 0.15)',  // 9+ Termine: Crimson-Tint
} as const;

export const FARBE_KLASSEN = {
  niedrig: 'bg-gruen',
  mittel:  'bg-gelb',
  hoch:    'bg-orange',
} as const;
