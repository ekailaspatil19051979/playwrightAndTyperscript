export class MobilesFiltersPage {
    constructor(private page: any) {}

    /**
     * Returns a list of available brand filter names (visible labels) on the page.
     */
    async getAvailableBrands(): Promise<string[]> {
        // Try to find all visible brand labels under the Brand section
        // This assumes the brand filter section contains a heading or label 'Brand'
        let brands: string[] = [];
        // Try to find a section or div with 'Brand' and get all label children
        const brandSection = await this.page.locator('section:has-text("Brand"), div:has-text("Brand")').first();
        if (await brandSection.isVisible().catch(() => false)) {
            brands = await brandSection.locator('label').allTextContents();
        } else {
            // Fallback: get all visible labels on the page
            brands = await this.page.locator('label').allTextContents();
        }
        // Filter out empty and non-brand labels (e.g., RAM, Special Price, etc.)
        brands = brands.map(b => b.trim()).filter(b => b && b.length > 1 && !b.match(/ram|price|emi|save|more|gb|off|special|pages|dairy|rate|sign|model|ceramic|mug|stand|sticker|warranty|processor|display|camera|battery|offer|exchange|only|left|deals|no cost/i));
        // Remove duplicates
        brands = Array.from(new Set(brands));
        return brands;
    }

    async navigate(): Promise<void> {
        await this.page.goto('https://www.flipkart.com/mobiles');
    }

    async navigateToFilters() {
        await this.page.click(this.filterSection);
    }

    async selectBrand(brand: string) {
        await this.page.locator(this.brandFilter).selectOption(brand);
    }

    async setPriceRange(min: number, max: number) {
        await this.page.fill(this.priceRangeFilter, `${min}-${max}`);
    }

    async applyFilters() {
        await this.page.click(this.applyButton);
    }

    async validateFiltersApplied() {
        // Implement validation logic to check if filters are applied correctly
    }

    // --- Stubs for test compatibility ---
    async applyFilter(filterType: string, value: string) {
        // Only brand filter implemented for now
        if (filterType.toLowerCase() === 'brand') {
            let found = false;
            let lastError = '';
            // Try label:has-text (case-insensitive, partial)
            const labelSelectors = [
                `label:has-text("${value}")`,
                `label:has-text("${value.toLowerCase()}")`,
                `label:has-text("${value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}")`,
                `label:has-text("${value.toUpperCase()}")`,
                `label:has-text("${value.toLowerCase().slice(0,3)}")`,
            ];
            for (const sel of labelSelectors) {
                const label = await this.page.locator(sel).first();
                if (await label.isVisible().catch(() => false)) {
                    await label.click();
                    found = true;
                    break;
                }
            }
            // Try input[type=checkbox][value*="brand"]
            if (!found) {
                const input = await this.page.locator(`input[type="checkbox"][value*="${value}"]`).first();
                if (await input.isVisible().catch(() => false)) {
                    await input.click();
                    found = true;
                }
            }
            // Try aria-label
            if (!found) {
                const aria = await this.page.locator(`[aria-label*="${value}"]`).first();
                if (await aria.isVisible().catch(() => false)) {
                    await aria.click();
                    found = true;
                }
            }
            // Try DOM structure: find brand filter section, then checkbox with text
            if (!found) {
                const brandSection = await this.page.locator('section:has-text("Brand")').first();
                if (await brandSection.isVisible().catch(() => false)) {
                    const check = await brandSection.locator(`input[type="checkbox"]`).first();
                    if (await check.isVisible().catch(() => false)) {
                        await check.click();
                        found = true;
                    }
                }
            }
            // Log all brand filter labels for debugging if not found
            if (!found) {
                const allLabels = await this.page.locator('label').allTextContents();
                console.error('Brand filter not found. All visible labels:', allLabels);
                throw new Error(`Brand filter '${value}' not found on page. See console for all labels.`);
            }
            // Wait for product grid to update (wait for at least one product card to appear)
            await this.page.waitForSelector('div[data-id]', { timeout: 10000 });
            await this.page.waitForLoadState('networkidle');
        }
    }

    async resetFilters() {
        // Click the first visible 'Clear all' button
        const clearBtns = this.page.locator('//span[text()="Clear all"]');
        const count = await clearBtns.count();
        for (let i = 0; i < count; i++) {
            const btn = clearBtns.nth(i);
            if (await btn.isVisible()) {
                await btn.click();
                await this.page.waitForLoadState('networkidle');
                break;
            }
        }
    }

    async getFilteredResults(): Promise<string[]> {
        // Parse product cards as in ProductSearchPage
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
        if (names.length === 0) {
            console.warn('No products found after filtering!');
            await this.page.screenshot({ path: 'no-products-after-filter.png' });
        } else {
            console.log('Extracted product names:', names);
        }
        return names;
    }
}