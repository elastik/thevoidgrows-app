import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'on',
    trace: 'on-first-retry',
  },
  reporter: [['html', { outputFolder: 'tests/e2e/results', open: 'never' }]],
  webServer: {
    command: 'npx vite --host',
    port: 5173,
    env: { VITE_MOCK_API: 'true' },
    reuseExistingServer: true,
  },
});
