import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { uniqueEmail, TEST_PASSWORD } from './helpers';

/**
 * Responsive-E2E-Suite für TimeBuddy.
 *
 * Prüft die App auf einer Viewport-Matrix (Mobile → 4K) auf:
 *   1. Horizontalen Overflow (Inhalt breiter als das Layout-Viewport).
 *   2. Zentrierung des Inhalts-Containers (`main > div`, max-w-7xl mx-auto)
 *      – nur auf Desktop-Viewports >= 1280px, wo der Container tatsächlich
 *      zentriert statt randbündig dargestellt wird.
 *
 * Zusätzlich wird pro Viewport+Seite ein Screenshot nach
 * `playwright-report/responsive/` geschrieben (wird per .gitignore ignoriert),
 * um den Ist-Zustand visuell zu bewerten.
 */

type Device = {
  name: string;
  viewport: { width: number; height: number };
  isMobile?: boolean;
  hasTouch?: boolean;
};

const DEVICES: Device[] = [
  { name: 'iphone-se', viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true },
  { name: 'iphone-14', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  { name: 'ipad-portrait', viewport: { width: 768, height: 1024 } },
  { name: 'fullhd', viewport: { width: 1920, height: 1080 } },
  { name: 'wqhd', viewport: { width: 2560, height: 1440 } },
  { name: '4k', viewport: { width: 3840, height: 2160 } },
];

type PageSpec = {
  path: string;
  label: string;
  /** true = Seite wird anonym (ohne Session) getestet, z. B. das Login-Formular. */
  anonymous?: boolean;
};

const PAGES: PageSpec[] = [
  { path: '/', label: 'start' },
  { path: '/login', label: 'login', anonymous: true },
  { path: '/kalender/monat', label: 'monat' },
  { path: '/kalender/woche', label: 'woche' },
  { path: '/kalender/tag', label: 'tag' },
];

/** Ab dieser Viewport-Breite wird zusätzlich die Zentrierung geprüft. */
const DESKTOP_MIN_WIDTH = 1280;

const SHOT_DIR = path.resolve('playwright-report', 'responsive');

test.beforeAll(() => {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
});

/** Legt per API einen frischen Test-User an und setzt damit die Session-Cookie. */
async function registerViaApi(page: Page): Promise<void> {
  const email = uniqueEmail();
  const res = await page.request.post('/api/auth/register', {
    data: { email, password: TEST_PASSWORD, confirmPassword: TEST_PASSWORD },
  });
  expect(
    res.ok(),
    `Registrierung via API fehlgeschlagen (HTTP ${res.status()}: ${await res.text()})`,
  ).toBe(true);
}

/** Lässt Layout, Fonts und Framer-Motion-Transitionen kurz abklingen. */
async function settle(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(400);
}

/** true, wenn der Inhalt horizontal aus dem Layout-Viewport ragt. */
async function hasHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const de = document.documentElement;
    return de.scrollWidth - de.clientWidth > 1;
  });
}

/** Liefert die Abstände des Inhalts-Containers zu links/rechter Viewport-Kante. */
async function containerMargins(page: Page): Promise<{ left: number; right: number } | null> {
  return page.evaluate(() => {
    const el = document.querySelector('main > div');
    if (!el) return null;
    const box = el.getBoundingClientRect();
    return { left: box.left, right: window.innerWidth - box.right };
  });
}

test.describe('Mobile Navigation (Hamburger-Menü)', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test('öffnet Menü, zeigt alle Einträge und navigiert', async ({ page }) => {
    await registerViaApi(page);
    await page.goto('/kalender/monat');
    await settle(page);

    const toggle = page.getByTestId('mobile-menu-toggle');
    const menu = page.getByTestId('mobile-menu');

    // Menü ist initial geschlossen.
    await expect(menu).not.toBeVisible();

    // Öffnen über den Hamburger-Button.
    await toggle.click();
    await expect(menu).toBeVisible();

    // Navigation + Aktionen (angemeldet) sind enthalten.
    for (const label of ['Monat', 'Woche', 'Tag', 'Termin erstellen', 'Erinnerungen', 'Abmelden']) {
      await expect(menu.getByText(label, { exact: true })).toBeVisible();
    }

    // Klick auf "Woche" navigiert und schließt das Menü.
    await menu.getByRole('link', { name: 'Woche' }).click();
    await page.waitForURL('**/kalender/woche');
    await expect(menu).not.toBeVisible();
  });

  test('ist auf Desktop ausgeblendet (kein doppeltes "Abmelden")', async ({ page }) => {
    // Expliziter Desktop-Viewport – das umgebende describe setzt Mobile (390px),
    // hier wird bewusst md+ geprüft, wo der Toggle ausgeblendet sein muss.
    await page.setViewportSize({ width: 1440, height: 900 });

    await registerViaApi(page);
    await page.goto('/kalender/monat');
    await settle(page);

    // Der Hamburger-Button ist auf md+ nicht sichtbar.
    await expect(page.getByTestId('mobile-menu-toggle')).not.toBeVisible();

    // Genau ein sichtbarer "Abmelden"-Button (der in der Navbar).
    const abmeldenButtons = page.getByRole('button', { name: 'Abmelden' });
    expect(await abmeldenButtons.count()).toBe(1);
  });
});

for (const device of DEVICES) {
  test.describe(`Viewport: ${device.name} (${device.viewport.width}x${device.viewport.height})`, () => {
    test.use({
      viewport: device.viewport,
      ...(device.isMobile ? { isMobile: true, hasTouch: true } : {}),
    });

    for (const pageSpec of PAGES) {
      test(`${pageSpec.label} – kein Overflow${
        device.viewport.width >= DESKTOP_MIN_WIDTH ? ' + zentriert' : ''
      }`, async ({ page }) => {
        if (!pageSpec.anonymous) {
          await registerViaApi(page);
        }

        await page.goto(pageSpec.path);
        await settle(page);

        // 1) Kein horizontaler Overflow.
        const overflow = await hasHorizontalOverflow(page);
        expect(overflow, `Horizontale Überschiebung auf "${pageSpec.label}"`).toBe(false);

        // 2) Zentrierung nur auf Desktop (>= 1280px).
        if (device.viewport.width >= DESKTOP_MIN_WIDTH) {
          const margins = await containerMargins(page);
          expect(margins, 'Inhalts-Container "main > div" nicht gefunden').not.toBeNull();
          const delta = Math.abs(margins!.left - margins!.right);
          expect(
            delta,
            `Inhalt nicht zentriert (links ${margins!.left}px vs. rechts ${margins!.right}px)`,
          ).toBeLessThanOrEqual(2);
        }

        // 3) Screenshot zur visuellen Bewertung.
        const file = path.join(SHOT_DIR, `${device.name}_${pageSpec.label}.png`);
        await page.screenshot({ path: file });
      });
    }
  });
}
