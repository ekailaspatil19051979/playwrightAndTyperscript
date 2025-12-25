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
    // Enable parallel execution
    launchOptions: {
      headless: true,
    },
  },
  // Group tests by project and file
  projects: [
    {
      name: 'UI Tests - Chromium',
      testMatch: /.*\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'UI Tests - Firefox',
      testMatch: /.*\.spec\.ts$/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'UI Tests - WebKit',
      testMatch: /.*\.spec\.ts$/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'API Tests',
      testMatch: /.*api-playwright\.spec\.ts$/,
      use: { baseURL: 'https://www.flipkart.com' },
    },
  ],
  // Enable sharding for parallel CI execution
  shard: {
    total: Number(process.env.SHARD_TOTAL) || 1,
    index: Number(process.env.SHARD_INDEX) || 0,
  },
  // Limit workers for CI parallelism
  workers: process.env.CI ? 4 : undefined,
});