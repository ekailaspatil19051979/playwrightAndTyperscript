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
    const navMenu = page.locator('nav, div[role="navigation"], .eFQ30H');
    try {
      await expect(navMenu).toBeVisible();
      // Use generator agent to log a code generation
      const code = generator.generateCode('Assert navigation menu is visible');
      logInfo('GeneratorAgent code: ' + code);
      logInfo('Category navigation menu is visible');
    } catch (error) {
      // Use healer agent to suggest a fix
      const fix = healer.heal('Navigation menu not visible');
      logInfo('HealerAgent suggestion: ' + fix);
      throw error;
    }
  });

  test('should allow guest user to browse categories', async ({ page }) => {
    logInfo('Test: should allow guest user to browse categories');
    await page.goto('https://www.flipkart.com/');
    logInfo('Navigated to Flipkart home page');
    const firstCategory = page.locator('nav a, .eFQ30H a').first();
    try {
      await expect(firstCategory).toBeVisible();
      await firstCategory.click();
      await expect(page).not.toHaveURL('https://www.flipkart.com/');
      // Use generator agent to log a code generation
      const code = generator.generateCode('Assert guest user can browse categories');
      logInfo('GeneratorAgent code: ' + code);
      logInfo('Guest user browsed category');
    } catch (error) {
      // Use healer agent to suggest a fix
      const fix = healer.heal('Guest user cannot browse categories');
      logInfo('HealerAgent suggestion: ' + fix);
      throw error;
    }
  });

  test('should load banners without breaking layout', async ({ page }) => {
    await page.goto('https://www.flipkart.com/');
    const banners = page.locator('img[alt*="banner"], ._2OHU_q, ._3qGmMb');
    try {
      await expect(banners.first()).toBeVisible();
      // Use generator agent to log a code generation
      const code = generator.generateCode('Assert banners are visible and layout is not broken');
      logInfo('GeneratorAgent code: ' + code);
      // Check for no horizontal scroll (layout break)
      const hasScroll = await page.evaluate(() => document.body.scrollWidth > document.body.clientWidth);
      expect(hasScroll).toBeFalsy();
    } catch (error) {
      // Use healer agent to suggest a fix
      const fix = healer.heal('Banners not visible or layout broken');
      logInfo('HealerAgent suggestion: ' + fix);
      throw error;
    }
  });

  test('should have accessible footer links', async ({ page }) => {
    await page.goto('https://www.flipkart.com/');
    const footer = page.locator('footer, ._3JHi7F');
    try {
      await expect(footer).toBeVisible();
      const links = footer.locator('a');
      await expect(links.first()).toBeVisible();
      await expect(await links.count()).toBeGreaterThan(0);
      // Use generator agent to log a code generation
      const code = generator.generateCode('Assert footer links are accessible');
      logInfo('GeneratorAgent code: ' + code);
    } catch (error) {
      // Use healer agent to suggest a fix
      const fix = healer.heal('Footer links not accessible');
      logInfo('HealerAgent suggestion: ' + fix);
      throw error;
    }
  });
});
