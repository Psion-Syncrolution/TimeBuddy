import type { Page } from '@playwright/test';

/** Erzeugt eine eindeutige Test-E-Mail pro Lauf. */
export function uniqueEmail(): string {
  return `test+${Date.now()}-${Math.floor(Math.random() * 10000)}@timebuddy.test`;
}

export const TEST_PASSWORD = 'geheim12345';

/** Registriert einen neuen Nutzer über die UI und liefert die Zugangsdaten. */
export async function registerUser(page: Page): Promise<{ email: string; password: string }> {
  const email = uniqueEmail();
  await page.goto('/register');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(TEST_PASSWORD);
  await page.locator('#confirmPassword').fill(TEST_PASSWORD);
  await page.getByRole('button', { name: 'Registrieren' }).click();
  // Registrierung leitet automatisch in die Monatsansicht weiter
  await page.waitForURL('**/kalender/monat', { timeout: 30_000 });
  return { email, password: TEST_PASSWORD };
}

/** Loggt einen bestehenden Nutzer über die UI ein. */
export async function loginUser(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: 'Anmelden' }).click();
  await page.waitForURL('**/kalender/monat', { timeout: 30_000 });
}
/**
 * Stellt sicher, dass die Seite eine aktive Session hat.
 * Jeder Playwright-Test bekommt einen frischen Browser-Kontext (keine Cookies),
 * daher wird bei Bedarf neu eingeloggt.
 */
export async function ensureLoggedIn(page: Page, email: string, password: string): Promise<void> {
  const res = await page.request.get('/api/auth/session');
  if (!res.ok()) {
    await loginUser(page, email, password);
  }
}
/** Loggt den aktuellen Nutzer über die Navbar ab. */
export async function logoutUser(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Abmelden' }).click();
  await page.waitForURL('**/login', { timeout: 30_000 });
}

/** Liefert das heutige Datum als YYYY-MM-DD (lokale Zeit). */
export function todayStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
