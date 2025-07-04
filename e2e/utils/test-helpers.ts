import { Page } from '@playwright/test';

export class TestHelpers {
  static async waitForNetworkIdle(page: Page, timeout = 10000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  static async waitForElementToBeVisible(page: Page, selector: string, timeout = 5000): Promise<void> {
    await page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  static async waitForElementToBeHidden(page: Page, selector: string, timeout = 5000): Promise<void> {
    await page.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  static async waitForUrl(page: Page, urlPattern: string, timeout = 10000): Promise<void> {
    await page.waitForURL(urlPattern, { timeout });
  }

  static async takeScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({ path: `e2e/screenshots/${name}-${Date.now()}.png` });
  }

  static async clearAndFillInput(page: Page, selector: string, value: string): Promise<void> {
    await page.locator(selector).clear();
    await page.locator(selector).fill(value);
  }

  static async selectOptionByText(page: Page, selector: string, text: string): Promise<void> {
    await page.locator(selector).selectOption({ label: text });
  }

  static async clickElementByText(page: Page, text: string): Promise<void> {
    await page.locator(`text=${text}`).click();
  }

  static async expectElementToHaveText(page: Page, selector: string, expectedText: string): Promise<void> {
    const actualText = await page.locator(selector).textContent();
    if (actualText !== expectedText) {
      throw new Error(`Expected element to have text "${expectedText}" but got "${actualText}"`);
    }
  }

  static async expectElementToContainText(page: Page, selector: string, expectedText: string): Promise<void> {
    const actualText = await page.locator(selector).textContent();
    if (!actualText?.includes(expectedText)) {
      throw new Error(`Expected element to contain text "${expectedText}" but got "${actualText}"`);
    }
  }

  static async expectElementToBeEnabled(page: Page, selector: string): Promise<void> {
    const isEnabled = await page.locator(selector).isEnabled();
    if (!isEnabled) {
      throw new Error(`Expected element ${selector} to be enabled`);
    }
  }

  static async expectElementToBeDisabled(page: Page, selector: string): Promise<void> {
    const isEnabled = await page.locator(selector).isEnabled();
    if (isEnabled) {
      throw new Error(`Expected element ${selector} to be disabled`);
    }
  }

  static async expectElementToBeChecked(page: Page, selector: string): Promise<void> {
    const isChecked = await page.locator(selector).isChecked();
    if (!isChecked) {
      throw new Error(`Expected element ${selector} to be checked`);
    }
  }

  static async expectElementToBeUnchecked(page: Page, selector: string): Promise<void> {
    const isChecked = await page.locator(selector).isChecked();
    if (isChecked) {
      throw new Error(`Expected element ${selector} to be unchecked`);
    }
  }
}
