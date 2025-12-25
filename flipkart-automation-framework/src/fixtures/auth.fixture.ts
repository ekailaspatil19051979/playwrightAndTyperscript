import { test as baseTest, expect } from '@playwright/test';

const test = baseTest.extend({
  auth: async ({ page }, use) => {
    // Perform authentication and store the state
    await page.goto('https://www.flipkart.com/');
    await page.fill('input[aria-label="Enter Email/Mobile number"]', 'your-email-or-mobile');
    await page.fill('input[aria-label="Password"]', 'your-password');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Store the authentication state
    await use(page.context().storageState());
  },
});

export { test };