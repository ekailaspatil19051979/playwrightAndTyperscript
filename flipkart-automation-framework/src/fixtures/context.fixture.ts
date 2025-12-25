import { test as baseTest, BrowserContext } from '@playwright/test';

type ContextFixture = {
  context: BrowserContext;
};

export const test = baseTest.extend<ContextFixture>({
  context: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(context);
    await context.close();
  },
});