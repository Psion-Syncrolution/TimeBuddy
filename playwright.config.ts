import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright-Konfiguration für TimeBuddy E2E-Tests.
 *
 * Startet automatisch den Next.js Dev-Server auf Port 3100,
 * sofern nicht bereits ein Server läuft (reuseExistingServer).
 *
 * Hinweis: Die Standardports 3000/3001 werden bewusst vermieden — in dieser
 * Umgebung belegt VS Code selbst diese Ports (statischer File-Server bzw.
 * WebSocket-Proxy), den Playwright sonst wiederverwendet und der keine
 * gültigen App-Antworten liefert.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- -p 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
