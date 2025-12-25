
import { Locator, Page } from 'playwright';

export class ProductSearchPage {
    private page: Page;

    private searchInput: Locator;
    private searchButton: Locator;
    private resultsContainer: Locator;

    constructor(page: Page) {
        this.page = page;
        // Flipkart's search input is usually at the top
        this.searchInput = this.page.locator('input[title="Search for products, brands and more"], input[placeholder*="Search"]');
        this.searchButton = this.page.locator('button[type="submit"]');
        // Product cards: div[data-id] is common for product results
        this.resultsContainer = this.page.locator('div[data-id]');
    }

    async navigate(): Promise<void> {
        await this.page.goto('https://www.flipkart.com/');
    }

    async searchForProduct(productName: string): Promise<void> {
        // Handle login popup if present
        if (await this.page.locator('input[type="text"][autocomplete="username"]').isVisible({ timeout: 3000 }).catch(() => false)) {
            // Close the login modal if it appears
            const closeBtn = this.page.locator('button[aria-label="Close"]');
            if (await closeBtn.isVisible()) {
                await closeBtn.click();
            }
        }
        await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.searchInput.fill(productName);
        await this.searchButton.click();
    }

    async getSearchResults(): Promise<string[]> {
        // Wait for results to load and grid to update
        await this.page.waitForLoadState('networkidle');
        let names: string[] = [];
        const timeout = Date.now() + 10000;
        while (Date.now() < timeout) {
            const cards = await this.page.$$('div[data-id]');
            names = [];
            for (const card of cards) {
                let name = '';
                try {
                    const anchor = await card.$('a[title]');
                    if (anchor) {
                        name = await anchor.getAttribute('title') || '';
                    }
                    if (!name) {
                        const fallback = await card.$('a');
                        if (fallback) {
                            name = (await fallback.textContent())?.trim() || '';
                        }
                    }
                } catch {}
                if (!name) {
                    try {
                        name = (await card.textContent())?.split('\n')[0].trim() || '';
                    } catch {}
                }
                if (name) names.push(name);
            }
            if (names.length > 0) break;
            await this.page.waitForTimeout(500);
        }
        // Log for debugging
        console.log('Extracted product names:', names);
        return names;
    }

    async searchForProduct(productName: string): Promise<void> {
        // Handle login popup if present
        if (await this.page.locator('input[type="text"][autocomplete="username"]').isVisible({ timeout: 3000 }).catch(() => false)) {
            // Close the login modal if it appears
            const closeBtn = this.page.locator('button[aria-label="Close"]');
            if (await closeBtn.isVisible()) {
                await closeBtn.click();
            }
        }
        await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.searchInput.fill(productName);
        await this.searchButton.click();
    }
}