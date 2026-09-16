import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules', '.next', 'e2e'],
    coverage: {
      provider: 'v8',
      include: [
        'src/lib/**/*.ts',
        'src/validators/**/*.ts',
        'benchmarks/benchmark_runner.ts',
      ],
      exclude: ['**/*.test.ts'],
    },
  },
});
