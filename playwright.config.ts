import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  globalSetup: './tests/global-setup.ts',
  use: {
    baseURL: 'http://localhost:8082',
    storageState: 'tests/.auth/admin.json',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
