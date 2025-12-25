import { test as base } from '../fixtures/auth.fixture';
import { expect } from '@playwright/test';
const test = base;
import { ProductSearchPage } from '../pages/ProductSearchPage';
import { ApiClient } from '../api/ApiClient';
import { logInfo } from '../utils/logger';
import { PlannerAgent } from '../agents/PlannerAgent';
import { GeneratorAgent } from '../agents/GeneratorAgent';
import { HealerAgent } from '../agents/HealerAgent';

test.describe('Product Search', () => {

    // Instantiate agents
    const planner = new PlannerAgent();
    const generator = new GeneratorAgent();
    const healer = new HealerAgent();

    test.beforeAll(() => {
        logInfo('Starting Product Search tests');
        // Example: Use planner agent to decompose a test goal
        const subtasks = planner.planTask('Test product search feature');
        logInfo('PlannerAgent subtasks: ' + JSON.stringify(subtasks));
    });

    test.afterAll(() => {
        logInfo('Finished Product Search tests');
    });

    let productSearchPage: ProductSearchPage;
    let apiClient: ApiClient;

    test.beforeEach(async ({ page }) => {
        apiClient = new ApiClient('https://www.flipkart.com');
        productSearchPage = new ProductSearchPage(page);
        // Optionally, set up API state or login here if needed
    });

    test('should display search results for a valid product', async ({ page }) => {
        logInfo('Test: should display search results for a valid product');
        await productSearchPage.navigate();
        logInfo('Navigated to product search page');
        await productSearchPage.searchForProduct('Samsung S24 Ultra');
        logInfo('Searched for Samsung S24 Ultra');
        const results = await productSearchPage.getSearchResults();
        logInfo(`Search results count: ${results.length}`);
        if (results.length === 0) {
            logInfo('No results found, taking screenshot');
            await page.screenshot({ path: 'search-no-results.png' });
            // Example: Use healer agent to suggest a fix
            const fix = healer.heal('No results found for Samsung S24 Ultra');
            logInfo('HealerAgent suggestion: ' + fix);
        }
        // Example: Use generator agent to log a code generation
        const code = generator.generateCode('Assert search results > 0');
        logInfo('GeneratorAgent code: ' + code);
        expect(results.length).toBeGreaterThan(0);
        logInfo('Valid product search test completed');
    });

    test('should show no results for an invalid product', async ({ page }) => {
        logInfo('Test: should show no results for an invalid product');
        await productSearchPage.navigate();
        logInfo('Navigated to product search page');
        await productSearchPage.searchForProduct('invalidproductname1234567890');
        logInfo('Searched for invalid product');
        const results = await productSearchPage.getSearchResults();
        logInfo(`Search results count: ${results.length}`);
        const found = results.some(name => name.toLowerCase().includes('invalidproductname1234567890'));
        if (found) {
            logInfo('Invalid product found in results, taking screenshot');
            await page.screenshot({ path: 'search-invalid-found.png' });
        }
        expect(found).toBeFalsy();
        logInfo('Invalid product search test completed');
    });
});