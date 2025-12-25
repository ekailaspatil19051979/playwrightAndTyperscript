import { test, expect } from '@playwright/test';
import { logInfo } from '../utils/logger';
import { PlannerAgent } from '../agents/PlannerAgent';
import { GeneratorAgent } from '../agents/GeneratorAgent';
import { HealerAgent } from '../agents/HealerAgent';

// Flipkart Home Page UI Tests

test.describe('Flipkart Home Page UI', () => {
  // Instantiate agents
  const planner = new PlannerAgent();
  const generator = new GeneratorAgent();
  const healer = new HealerAgent();

  test.beforeAll(() => {
    logInfo('Starting Flipkart Home Page UI tests');
    // Example: Use planner agent to decompose a test goal
    const subtasks = planner.planTask('Test Flipkart home page UI');
    logInfo('PlannerAgent subtasks: ' + JSON.stringify(subtasks));
  });

  test.afterAll(() => {
    logInfo('Finished Flipkart Home Page UI tests');
  });
  test('should load successfully', async ({ page }) => {
    logInfo('Test: should load successfully');
    await page.goto('https://www.flipkart.com/');
    logInfo('Navigated to Flipkart home page');
    await expect(page).toHaveTitle(/Flipkart/);
    await expect(page.locator('body')).toBeVisible();
    logInfo('Home page loaded and visible');
  });

  test('should display visible and clickable Flipkart logo', async ({ page }) => {
    logInfo('Test: should display visible and clickable Flipkart logo');
    await page.goto('https://www.flipkart.com/');
    logInfo('Navigated to Flipkart home page');
    const logo = page.locator('a[title="Flipkart"] img, img[alt="Flipkart"]');
    await expect(logo).toBeVisible();
    await expect(logo).toBeEnabled();
    await logo.click();
    await expect(page).toHaveURL(/flipkart.com/);
    logInfo('Flipkart logo clicked and verified');
  });

  test('should have present and enabled search bar', async ({ page }) => {
    logInfo('Test: should have present and enabled search bar');
    await page.goto('https://www.flipkart.com/');
    logInfo('Navigated to Flipkart home page');
    const search = page.locator('input[title="Search for products, brands and more"], input[placeholder*="Search"]');
    await expect(search).toBeVisible();
    await expect(search).toBeEnabled();
    logInfo('Search bar is present and enabled');
  });

  test('should display category navigation menu', async ({ page }) => {
    logInfo('Test: should display category navigation menu');
    await page.goto('https://www.flipkart.com/');
    logInfo('Navigated to Flipkart home page');
    await page.waitForLoadState('domcontentloaded');
    // Updated selector for navigation menu
    const navMenu = page.locator('nav[role="navigation"], header nav, .navbar');
    await expect(navMenu).toBeVisible({ timeout: 10000 });
    logInfo('Category navigation menu is visible');
  });

  test('should allow guest user to browse categories', async ({ page }) => {
    logInfo('Test: should allow guest user to browse categories');
    await page.goto('https://www.flipkart.com/');
    logInfo('Navigated to Flipkart home page');
    await page.waitForLoadState('domcontentloaded');
    // Updated selector for category link
    const firstCategory = page.locator('nav[role="navigation"] a, header nav a, .navbar a').first();
    await expect(firstCategory).toBeVisible({ timeout: 10000 });
    await firstCategory.click();
    await expect(page).not.toHaveURL('https://www.flipkart.com/');
    logInfo('Guest user browsed category');
  });

  test('should load banners without breaking layout', async ({ page }) => {
    await page.goto('https://www.flipkart.com/');
    await page.waitForLoadState('domcontentloaded');
    // Updated selector for banners
    const banners = page.locator('img[alt*="banner"], .banner, .main-banner');
    await expect(banners.first()).toBeVisible({ timeout: 10000 });
    // Check for no horizontal scroll (layout break)
    const hasScroll = await page.evaluate(() => document.body.scrollWidth > document.body.clientWidth);
    expect(hasScroll).toBeFalsy();
  });

  test('should have accessible footer links', async ({ page }) => {
    await page.goto('https://www.flipkart.com/');
    await page.waitForLoadState('domcontentloaded');
    // Updated selector for footer
    const footer = page.locator('footer[role="contentinfo"], footer, .footer, #seo--footer');
    await expect(footer).toBeVisible({ timeout: 10000 });
    const links = footer.locator('a');
    await expect(links.first()).toBeVisible({ timeout: 10000 });
    expect(await links.count()).toBeGreaterThan(0);
  });
});
