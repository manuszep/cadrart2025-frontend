import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getElement(selector: string): Promise<Locator> {
    return this.page.locator(selector);
  }

  async clickElement(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async fillInput(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }

  async expectElementToBeVisible(selector: string): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'visible' });
  }

  async waitForElement(selector: string, timeout = 5000): Promise<void> {
    await this.page.locator(selector).waitFor({ timeout });
  }

  async getElementText(selector: string): Promise<string> {
    return (await this.page.locator(selector).textContent()) || '';
  }

  async selectOption(selector: string, value: string): Promise<void> {
    await this.page.selectOption(selector, value);
  }

  async checkCheckbox(selector: string): Promise<void> {
    await this.page.check(selector);
  }

  async uncheckCheckbox(selector: string): Promise<void> {
    await this.page.uncheck(selector);
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}
