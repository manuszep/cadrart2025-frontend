import { Page } from '@playwright/test';

import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly emailInput = '[data-testid="email-input"] input';
  private readonly passwordInput = '[data-testid="password-input"] input';
  private readonly loginButton = '[data-testid="login-button"]';
  private readonly errorMessage = '[data-testid="error-message"]';

  constructor(page: Page) {
    super(page);
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  async expectLoginError(message: string): Promise<void> {
    await this.expectElementToBeVisible(this.errorMessage);
    const errorText = await this.getElementText(this.errorMessage);
    if (!errorText.includes(message)) {
      throw new Error(`Expected error message to contain "${message}" but got "${errorText}"`);
    }
  }

  async expectSuccessfulLogin(): Promise<void> {
    await this.page.waitForURL('**/offers', { timeout: 10000 });
  }

  async navigateToLogin(): Promise<void> {
    await this.navigateTo('/login');
    await this.waitForPageLoad();
  }
}
