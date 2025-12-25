# Flipkart Automation Framework

A robust test automation framework for Flipkart, built with Playwright and TypeScript.

## Features
- UI and API test automation using Playwright
- Page Object Model (POM) for maintainable and reusable test code
- Parallel execution and test grouping (Chromium, Firefox, WebKit, API)
- Allure and HTML reporting for rich test results
- Environment-based configuration (dev, qa, prod)
- Custom agents for planning, healing, and code generation
- CI integration with GitHub Actions

## Project Structure
```
flipkart-automation-framework/
├── configs/
│   ├── environments/
│   │   ├── dev.env.json
│   │   ├── qa.env.json
│   │   └── prod.env.json
│   └── sharding.config.json
├── src/
│   ├── agents/           # Custom agents (Planner, Healer, Generator)
│   ├── api/              # API client and endpoints
│   ├── components/       # Reusable UI components (Button, BaseComponent, etc.)
│   ├── fixtures/         # Playwright fixtures
│   ├── pages/            # Page Object Model classes
│   ├── tests/            # Test specs (UI & API)
│   ├── types/            # Type definitions
│   └── utils/            # Utility functions (logger, helpers)
├── playwright.config.ts  # Playwright configuration
├── package.json          # Project metadata and scripts
└── README.md             # Project documentation
```

## Playwright Configuration
- Parallel execution and test grouping via `projects` and `shard`.
- Allure, HTML, dot, and JSON reporters enabled.
- Environment config via `baseURL` and environment files.
- Example config:
```typescript
export default defineConfig({
  testDir: './src/tests',
  timeout: 30000,
  expect: { timeout: 5000 },
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
    launchOptions: { headless: true },
  },
  projects: [
    { name: 'UI Tests - Chromium', testMatch: /.*\.spec\.ts$/, use: { ...devices['Desktop Chrome'] } },
    { name: 'UI Tests - Firefox', testMatch: /.*\.spec\.ts$/, use: { ...devices['Desktop Firefox'] } },
    { name: 'UI Tests - WebKit', testMatch: /.*\.spec\.ts$/, use: { ...devices['Desktop Safari'] } },
    { name: 'API Tests', testMatch: /.*api-playwright\.spec\.ts$/, use: { baseURL: 'https://www.flipkart.com' } },
  ],
  shard: { total: Number(process.env.SHARD_TOTAL) || 1, index: Number(process.env.SHARD_INDEX) || 0 },
  workers: process.env.CI ? 4 : undefined,
});
```

## Example: Page Object Model
```typescript
// src/components/BaseComponent.ts
import { Page, Locator } from '@playwright/test';
export class BaseComponent {
  protected page: Page;
  protected root: Locator;
  constructor(page: Page, rootSelector: string) {
    this.page = page;
    this.root = page.locator(rootSelector);
  }
  async isVisible(): Promise<boolean> {
    return await this.root.isVisible();
  }
}
```
```typescript
// src/components/ButtonComponent.ts
import { BaseComponent } from './BaseComponent';
import { Locator, Page } from '@playwright/test';
export class ButtonComponent extends BaseComponent {
  constructor(page: Page, rootSelector: string) {
    super(page, rootSelector);
  }
  async click(): Promise<void> {
    await this.root.click();
  }
  async getText(): Promise<string> {
    return await this.root.textContent() ?? '';
  }
}
```

## Example: API Test
```typescript
// src/tests/api-playwright.spec.ts
import { test, expect } from '@playwright/test';
test.describe('Flipkart API', () => {
  test('should get home page response', async ({ request }) => {
    const response = await request.get('https://www.flipkart.com');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });
  test('should get a valid product search response', async ({ request }) => {
    const response = await request.get('https://www.flipkart.com/search?q=iphone');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('iPhone');
  });
});
```

## Running Tests
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run all tests:
   ```bash
   npx playwright test
   ```
3. Run tests in parallel shards:
   ```bash
   npx playwright test --shard=1/2
   ```
4. Run only API tests:
   ```bash
   npx playwright test src/tests/api-playwright.spec.ts
   ```

## Reporting
- HTML report: `npx playwright show-report`
- Allure report:
   ```bash
   npx allure generate allure-results --clean -o allure-report
   npx allure open allure-report
   ```

## CI Integration
- GitHub Actions workflow in `.github/workflows/playwright.yml` runs tests on every push/pull request.
- Parallel execution and reporting enabled in CI.

## Customization
- Update Playwright config in `playwright.config.ts` for more options (timeout, browsers, reporters, sharding).
- Add more reusable components in `src/components/` and page objects in `src/pages/`.
- Extend API tests in `src/tests/`.

## Scripts
- `npm test` - Run all tests
- `npm run test:ci` - Run tests with dot reporter (CI)
- `npm run test:shard` - Run tests in shards
- `npm run lint` - Lint code
- `npm run format` - Format code

## License
MIT
