import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/playwright',
  timeout: 120000,
  use: { baseURL: 'http://localhost:5173' },
  webServer: [
    { command: 'pnpm --filter api dev', port: 4000, reuseExistingServer: true },
    { command: 'pnpm --filter web dev --host 0.0.0.0 --port 5173', port: 5173, reuseExistingServer: true }
  ]
});
