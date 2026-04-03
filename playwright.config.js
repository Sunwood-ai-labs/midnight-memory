import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'viewer-probe.spec.js',
  timeout: 30_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:8000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'uv run python -m http.server 8000',
    url: 'http://127.0.0.1:8000/viewer/',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
