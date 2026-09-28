import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['node_modules', '.next'],
    // Repository-Tests teilen sich eine SQLite-Test-DB (setup.ts) —
    // daher sequenzielle Dateiausfuehrung.
    fileParallelism: false,
    setupFiles: ['./tests/shared/setup.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/lib/**/*.ts',
        'src/validators/**/*.ts',
      ],
      // Dünne Wrapper (Prisma-Singleton, iron-session) und Test-Code werden
      // nicht gemessen — der Wert liegt in den Repository-Tests.
      exclude: [
        '**/*.test.ts',
        'src/lib/prisma.ts',
        'src/lib/auth.ts',
      ],
    },
  },
});
