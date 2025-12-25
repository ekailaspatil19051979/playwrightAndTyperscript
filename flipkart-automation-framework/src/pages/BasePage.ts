import { Page } from 'playwright';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    protected async navigateTo(url: string): Promise<void> {
        await this.page.goto(url);
    }

    protected async click(locator: string): Promise<void> {
        await this.page.locator(locator).click();
    }

    protected async fill(locator: string, value: string): Promise<void> {
        await this.page.locator(locator).fill(value);
    }

    protected async getText(locator: string): Promise<string> {
        return await this.page.locator(locator).innerText();
    }

    protected async waitForVisible(locator: string): Promise<void> {
        await this.page.locator(locator).waitFor({ state: 'visible' });
    }

    protected async assertVisible(locator: string): Promise<void> {
        await this.page.locator(locator).isVisible();
    }
}