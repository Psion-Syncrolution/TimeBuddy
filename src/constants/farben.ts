export const TERMIN_FARBEN = {
  niedrig: 'rgba(142, 209, 102, 0.678)',  // 1-4 Termine: Grün
  mittel:  'rgba(250, 225, 1, 0.68)',     // 5-8 Termine: Gelb
  hoch:    'rgba(255, 72, 0, 0.68)',      // 9+ Termine: Orange
} as const;

export const FARBE_KLASSEN = {
  niedrig: 'bg-gruen',
  mittel:  'bg-gelb',
  hoch:    'bg-orange',
} as const;
