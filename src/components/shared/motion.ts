import type { Variants } from 'framer-motion';

/**
 * Zentrale Motion-Variants für das Dark-Luxury-Design.
 * Alle Animationen sind dezent gehalten (200–500ms, ease-out-quart).
 */

export const EASE_LUX: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Einzelnes Element: sanftes Einblenden mit leichtem Aufsteigen */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_LUX },
  },
};

/** Reines Einblenden (für Overlays, Hintergründe) */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

/** Container für gestaffelte Listen (z.B. Feature-Karten, Termin-Listen) */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

/** Kind-Element für staggerContainer */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_LUX },
  },
};

/** Hero-Elemente: etwas langsamer und edler */
export const heroReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_LUX, delay: i * 0.12 },
  }),
};

/** Standard-Viewport-Konfiguration für whileInView */
export const VIEWPORT = { once: true, margin: '-60px' } as const;
