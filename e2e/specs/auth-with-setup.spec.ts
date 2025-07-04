import { test } from '@playwright/test';

import { LoginPage } from '../pages/login.page';
import { ApiHelpers } from '../utils/api-helpers';
import { TestDataFactory } from '../fixtures/test-data';

interface ITestEnvironment {
  testUser: {
    email: string;
    password: string;
    name: string;
  };
  testClient: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  testArticles: Array<{ id: number; name: string }>;
  testTags: Array<{ id: number; name: string }>;
  testLocations: Array<{ id: number; name: string }>;
  testProviders: Array<{ id: number; name: string }>;
  testFormulas: Array<{ id: number; name: string }>;
}

test.describe('Authentication with Test Environment', () => {
  let testEnvironment: ITestEnvironment;

  test.beforeAll(async ({ request }) => {
    // Setup test environment once for all tests
    const apiHelpers = new ApiHelpers(request);
    testEnvironment = await apiHelpers.setupTestEnvironment();
  });

  test.afterAll(async ({ request }) => {
    // Cleanup test environment after all tests
    const apiHelpers = new ApiHelpers(request);
    await apiHelpers.cleanupTestEnvironment();
  });

  test('should successfully login with valid credentials from test environment', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();

    // Use credentials from the test environment
    const validCredentials = testEnvironment.testUser;

    await loginPage.login(validCredentials.email, validCredentials.password);
    await loginPage.expectSuccessfulLogin();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();

    const invalidCredentials = TestDataFactory.getInvalidCredentials();

    await loginPage.login(invalidCredentials.email, invalidCredentials.password);

    // Wait for error message to appear
    await loginPage.expectElementToBeVisible('[data-testid="error-message"]');
  });

  test('should validate required fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();

    // Try to login without credentials
    await loginPage.clickElement('[data-testid="login-button"]');

    // Should show validation errors
    await loginPage.expectElementToBeVisible('[data-testid="error-message"]');
  });

  test('should display login form elements', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();

    // Check that all form elements are present
    await loginPage.expectElementToBeVisible('[data-testid="email-input"]');
    await loginPage.expectElementToBeVisible('[data-testid="password-input"]');
    await loginPage.expectElementToBeVisible('[data-testid="login-button"]');
  });
});
