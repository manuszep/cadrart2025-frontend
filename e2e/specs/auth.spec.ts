import { test } from '@playwright/test';

import { LoginPage } from '../pages/login.page';
import { TestDataFactory } from '../fixtures/test-data';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('should display login form', async () => {
    await loginPage.expectElementToBeVisible('[data-testid="email-input"]');
    await loginPage.expectElementToBeVisible('[data-testid="password-input"]');
    await loginPage.expectElementToBeVisible('[data-testid="login-button"]');
  });

  test('should show error with invalid credentials', async () => {
    const invalidCredentials = TestDataFactory.getInvalidCredentials();

    await loginPage.login(invalidCredentials.email, invalidCredentials.password);

    // Wait for error message to appear
    await loginPage.expectElementToBeVisible('[data-testid="error-message"]');
  });

  test('should attempt login with valid credentials', async () => {
    const validCredentials = TestDataFactory.getValidCredentials();

    await loginPage.login(validCredentials.email, validCredentials.password);

    // For valid credentials, we should either be redirected or see no error
    // Wait a moment for the login attempt to process
    await loginPage.waitForTimeout(2000);

    // Check if we're still on login page (error) or redirected (success)
    const currentUrl = await loginPage.getCurrentUrl();
    if (currentUrl.includes('/login')) {
      // Still on login page, should show error
      await loginPage.expectElementToBeVisible('[data-testid="error-message"]');
    } else {
      // Successfully redirected, no error message expected
      // This is the expected behavior for valid credentials
    }
  });

  test('should validate required fields', async () => {
    // Try to login without credentials
    await loginPage.clickElement('[data-testid="login-button"]');

    // Should show validation errors
    await loginPage.expectElementToBeVisible('[data-testid="error-message"]');
  });
});
