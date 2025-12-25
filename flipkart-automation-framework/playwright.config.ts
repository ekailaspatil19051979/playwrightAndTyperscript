import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  reporter: [
    ['dot'],
    ['json', { outputFile: 'test-results.json' }],
    ['html', { open: 'never' }],
    ['allure-playwright'],
  ],
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    baseURL: process.env.BASE_URL || 'https://www.flipkart.com',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  shard: {
    total: Number(process.env.SHARD_TOTAL) || 1,
    index: Number(process.env.SHARD_INDEX) || 0,
  },
});