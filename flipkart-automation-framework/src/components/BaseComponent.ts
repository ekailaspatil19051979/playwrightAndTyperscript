import { Page, Locator } from '@playwright/test';

export class BaseComponent {
  protected page: Page;
  protected root: Locator;

  constructor(page: Page, rootSelector: string) {
    this.page = page;
    this.root = page.locator(rootSelector);
  }

  async isVisible(): Promise<boolean> {
    return await this.root.isVisible();
  }
}
