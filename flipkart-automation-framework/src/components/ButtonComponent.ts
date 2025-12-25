import { BaseComponent } from './BaseComponent';
import { Locator, Page } from '@playwright/test';

export class ButtonComponent extends BaseComponent {
  constructor(page: Page, rootSelector: string) {
    super(page, rootSelector);
  }

  async click(): Promise<void> {
    await this.root.click();
  }

  async getText(): Promise<string> {
    return await this.root.textContent() ?? '';
  }
}
