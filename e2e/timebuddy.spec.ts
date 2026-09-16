import { test, expect } from '@playwright/test';
import { registerUser, loginUser, logoutUser, ensureLoggedIn, todayStr, TEST_PASSWORD } from './helpers';

test.describe('TimeBuddy E2E', () => {
  test.describe.configure({ mode: 'serial' });

  let email = '';

  test('1. Registrierung ueber die UI', async ({ page }) => {
    const user = await registerUser(page);
    email = user.email;

    // Session muss aktiv sein: E-Mail wird in der Navbar angezeigt
    await expect(page.getByText(email)).toBeVisible({ timeout: 15_000 });

    // Session-API bestaetigt den eingeloggten Zustand
    const res = await page.request.get('/api/auth/session');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.user?.email).toBe(email);
  });

  test('2. Login mit falschem Passwort zeigt Fehler', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill(email);
    await page.locator('#password').fill('falsches-passwort-99');
    await page.getByRole('button', { name: 'Anmelden' }).click();

    await expect(page.getByTestId('login-error')).toBeVisible({ timeout: 15_000 });
    // URL bleibt auf /login
    expect(page.url()).toContain('/login');
  });

  test('3. Login mit korrekten Zugangsdaten', async ({ page }) => {
    await loginUser(page, email, TEST_PASSWORD);
    await expect(page.getByText(email)).toBeVisible({ timeout: 15_000 });
  });

  test('4. Termin-Formular zeigt Validierungsfehler (Zod v4 issues)', async ({ page }) => {
    await page.goto('/kalender/termin/neu');
    // Titel ueber 200 Zeichen: passiert HTML5-Validierung, scheitert an Zod max(200)
    await page.locator('#titel').fill('x'.repeat(201));
    await page.getByRole('button', { name: 'Termin erstellen' }).click();

    // Feldfehler muss sichtbar sein (Regressionstest fuer Zod v4 issues-Fix)
    await expect(page.getByText('Titel darf maximal 200 Zeichen lang sein')).toBeVisible({ timeout: 10_000 });
  });

  test('5. Termin ueber die UI erstellen', async ({ page }) => {
    await ensureLoggedIn(page, email, TEST_PASSWORD);
    const titel = `E2E-Termin ${Date.now()}`;
    await page.goto('/kalender/termin/neu');
    await page.locator('#titel').fill(titel);
    await page.locator('#datum').fill(todayStr());
    await page.locator('#uhrzeit').fill('09:00');
    await page.getByRole('button', { name: 'Termin erstellen' }).click();

    // Zurueck in der Monatsansicht
    await page.waitForURL('**/kalender/monat', { timeout: 30_000 });

    // Der heutige Tag zeigt den Termin-Count "Termin: 1"
    const dayCell = page.locator('button', { hasText: 'Termin: 1' }).first();
    await expect(dayCell).toBeVisible({ timeout: 15_000 });

    // API bestaetigt den gespeicherten Termin
    const res = await page.request.get('/api/termine');
    expect(res.ok()).toBeTruthy();
    const termine = await res.json();
    expect(termine.some((t: { titel: string }) => t.titel === titel)).toBeTruthy();
  });

  test('6. Termin erscheint in der Tagesansicht', async ({ page }) => {
    await ensureLoggedIn(page, email, TEST_PASSWORD);
    await page.goto(`/kalender/tag?datum=${todayStr()}`);
    // Der Termin-Titel wird im Stundenraster angezeigt
    await expect(page.getByText(/E2E-Termin/).first()).toBeVisible({ timeout: 15_000 });
  });

  test('7. Erinnerung ueber die UI erstellen', async ({ page }) => {
    await ensureLoggedIn(page, email, TEST_PASSWORD);
    const text = `E2E-Erinnerung ${Date.now()}`;
    await page.goto('/kalender/erinnerung');
    await page.getByRole('button', { name: 'Neue Erinnerung' }).click();

    // Termin aus dem Dropdown waehlen (einziges Select auf der Seite)
    const select = page.locator('select').first();
    await expect(select).toBeVisible({ timeout: 15_000 });
    const option = select.locator('option', { hasText: 'E2E-Termin' }).first();
    await expect(option).toHaveCount(1);
    await select.selectOption({ label: (await option.textContent())?.trim() ?? '' });

    // Datum wird automatisch aus dem Termin uebernommen
    await expect(page.locator('#datum')).toHaveValue(todayStr());

    await page.locator('#erinnerung').fill(text);
    await page.getByRole('button', { name: 'Erinnerung erstellen' }).click();

    // Zurueck in der Uebersicht, Erinnerung ist gelistet
    await page.waitForURL('**/kalender/erinnerung', { timeout: 30_000 });
    await expect(page.getByText(text)).toBeVisible({ timeout: 15_000 });

    // API bestaetigt die gespeicherte Erinnerung
    const res = await page.request.get('/api/erinnerungen');
    expect(res.ok()).toBeTruthy();
    const erinnerungen = await res.json();
    expect(erinnerungen.some((e: { erinnerung: string }) => e.erinnerung === text)).toBeTruthy();
  });

  test('8. Abmelden beendet die Session', async ({ page }) => {
    await ensureLoggedIn(page, email, TEST_PASSWORD);
    await logoutUser(page);
    expect(page.url()).toContain('/login');

    // Session-API meldet danach 401
    const res = await page.request.get('/api/auth/session');
    expect(res.status()).toBe(401);
  });
});
