import { test as base } from '../fixtures/auth.fixture';
import { expect } from '@playwright/test';
const test = base;
import { MobilesFiltersPage } from '../pages/MobilesFiltersPage';
import { ApiClient } from '../api/ApiClient';
import { logInfo } from '../utils/logger';
import { PlannerAgent } from '../agents/PlannerAgent';
import { GeneratorAgent } from '../agents/GeneratorAgent';
import { HealerAgent } from '../agents/HealerAgent';

test.describe('Mobiles and Tablets Filters', () => {

    // Instantiate agents
    const planner = new PlannerAgent();
    const generator = new GeneratorAgent();
    const healer = new HealerAgent();

    let mobilesFiltersPage: MobilesFiltersPage;

    test.beforeAll(() => {
        logInfo('Starting Mobiles and Tablets Filters tests');
        // Example: Use planner agent to decompose a test goal
        const subtasks = planner.planTask('Test mobiles and tablets filters feature');
        logInfo('PlannerAgent subtasks: ' + JSON.stringify(subtasks));
    });

    test.afterAll(() => {
        logInfo('Finished Mobiles and Tablets Filters tests');
    });

    test.beforeEach(async ({ page }) => {
        logInfo('Setting up MobilesFiltersPage');
        // apiClient = new ApiClient('https://www.flipkart.com'); // Uncomment and set baseUrl if needed
        mobilesFiltersPage = new MobilesFiltersPage(page);
        // Optionally, set up API state or login here if needed
        await mobilesFiltersPage.navigate();
        logInfo('Navigated to mobiles filters page');
    });

    test('should apply filters correctly', async ({ page }) => {
        logInfo('Test: should apply filters correctly');
        // Dynamically get available brands
        const brands = await mobilesFiltersPage.getAvailableBrands();
        logInfo(`Available brands: ${brands.join(', ')}`);
        if (!brands.length) {
            logInfo('No available brands found on the page.');
            // Use healer agent to suggest a fix
            const fix = healer.heal('No available brands found on the page');
            logInfo('HealerAgent suggestion: ' + fix);
            throw new Error('No available brands found on the page.');
        }
        // Pick a random brand for robustness
        const brand = brands[Math.floor(Math.random() * brands.length)];
        logInfo(`Testing with brand: ${brand}`);
        await mobilesFiltersPage.applyFilter('Brand', brand);
        logInfo(`Applied filter for brand: ${brand}`);
        const results = await mobilesFiltersPage.getFilteredResults();
        logInfo(`Filtered results count: ${results.length}`);
        if (results.length === 0) {
            logInfo('No products found after applying filter, taking screenshot');
            await page.screenshot({ path: 'filter-no-products.png' });
            // Use healer agent to suggest a fix
            const fix = healer.heal(`No products found after applying '${brand}' filter`);
            logInfo('HealerAgent suggestion: ' + fix);
            throw new Error(`No products found after applying '${brand}' filter. See filter-no-products.png`);
        }
        const found = results.some(name => name.toLowerCase().includes(brand.toLowerCase()));
        if (!found) {
            logInfo('Products found, but none contain brand, taking screenshot');
            await page.screenshot({ path: 'filter-no-brand.png' });
            // Use healer agent to suggest a fix
            const fix = healer.heal(`Products found, but none contain '${brand}'`);
            logInfo('HealerAgent suggestion: ' + fix);
            console.error(`Products found, but none contain '${brand}'. Names:`, results);
        }
        // Use generator agent to log a code generation
        const code = generator.generateCode(`Assert at least one product contains '${brand}'`);
        logInfo('GeneratorAgent code: ' + code);
        expect(found, `Expected at least one product to contain '${brand}', but got: ${results.join(', ')}`).toBeTruthy();
        logInfo('Filter application test completed');
    });

    test('should reset filters', async ({ page }) => {
        // Dynamically get available brands
        const brands = await mobilesFiltersPage.getAvailableBrands();
        if (!brands.length) {
            // Use healer agent to suggest a fix
            const fix = healer.heal('No available brands found on the page');
            logInfo('HealerAgent suggestion: ' + fix);
            throw new Error('No available brands found on the page.');
        }
        // Pick a random brand for robustness
        const brand = brands[Math.floor(Math.random() * brands.length)];
        console.log('Testing reset with brand:', brand);
        await mobilesFiltersPage.applyFilter('Brand', brand);
        await mobilesFiltersPage.resetFilters();
        const results = await mobilesFiltersPage.getFilteredResults();
        // Negative case: if no products, log and screenshot
        if (results.length === 0) {
            await page.screenshot({ path: 'reset-no-products.png' });
            // Use healer agent to suggest a fix
            const fix = healer.heal('No products found after resetting filters');
            logInfo('HealerAgent suggestion: ' + fix);
            throw new Error('No products found after resetting filters. See reset-no-products.png');
        }
        // If any product contains the brand, log and screenshot
        if (results.some(name => name.toLowerCase().includes(brand.toLowerCase()))) {
            await page.screenshot({ path: 'reset-still-brand.png' });
            // Use healer agent to suggest a fix
            const fix = healer.heal(`Products after reset still contain '${brand}'`);
            logInfo('HealerAgent suggestion: ' + fix);
            console.error(`Products after reset still contain '${brand}':`, results);
        }
        // Use generator agent to log a code generation
        const code = generator.generateCode(`Assert no product contains '${brand}' after reset`);
        logInfo('GeneratorAgent code: ' + code);
        expect(results.some(name => name.toLowerCase().includes(brand.toLowerCase()))).toBeFalsy();
    });
});