import { test, expect, request } from '@playwright/test';

// Example API test using Playwright's APIRequestContext

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
