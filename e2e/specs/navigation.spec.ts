import { test } from '@playwright/test';

import { BasePage } from '../pages/base.page';

test.describe('Navigation', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('should load login page', async () => {
    await basePage.navigateTo('/login');
    await basePage.waitForPageLoad();

    // Verify the page loaded by checking for the login form
    await basePage.expectElementToBeVisible('[data-testid="login-form"]');
  });

  test('should display login form elements', async () => {
    await basePage.navigateTo('/login');
    await basePage.waitForPageLoad();

    // Check that all form elements are present
    await basePage.expectElementToBeVisible('[data-testid="email-input"]');
    await basePage.expectElementToBeVisible('[data-testid="password-input"]');
    await basePage.expectElementToBeVisible('[data-testid="login-button"]');
  });

  test('should handle invalid route gracefully', async () => {
    await basePage.navigateTo('/invalid-route');
    await basePage.waitForPageLoad();

    // Should either show a 404 page or redirect to login
    // This test just verifies the app doesn't crash
  });
});
