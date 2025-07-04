import { test } from '@playwright/test';

import { LoginPage } from '../pages/login.page';
import { ApiHelpers } from '../utils/api-helpers';

interface ITestEnvironment {
  testUser: {
    email: string;
    password: string;
    name: string;
  };
  testClients: Array<{
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    tag?: string;
  }>;
  testArticles: Array<{
    id: number;
    name: string;
    family: number;
    sellPrice: number;
    provider?: string;
  }>;
  testTags: Array<{ id: number; name: string }>;
  testLocations: Array<{ id: number; name: string }>;
  testProviders: Array<{
    id: number;
    name: string;
    mail?: string;
  }>;
  testFormulas: Array<{
    id: number;
    name: string;
    formula: string;
  }>;
}

test.describe('Complete Application Workflow', () => {
  let testEnvironment: ITestEnvironment;

  test.beforeAll(async ({ request }) => {
    // Setup complete test environment
    const apiHelpers = new ApiHelpers(request);
    testEnvironment = await apiHelpers.setupTestEnvironment();
  });

  test.afterAll(async ({ request }) => {
    // Cleanup test environment
    const apiHelpers = new ApiHelpers(request);
    await apiHelpers.cleanupTestEnvironment();
  });

  test('should complete full workflow: login -> create offer -> view data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    // Step 1: Login with test credentials
    await loginPage.navigateToLogin();
    await loginPage.login(testEnvironment.testUser.email, testEnvironment.testUser.password);
    await loginPage.expectSuccessfulLogin();

    // Step 2: Navigate to offers page
    await page.goto('/offers');
    await page.waitForLoadState('networkidle');

    // Step 3: Verify we can see the offers page
    await page.waitForSelector('[data-testid="offers-page"]', { timeout: 10000 });

    // Step 4: Navigate to clients settings page and verify test client exists
    await page.goto('/settings/clients');
    await page.waitForLoadState('networkidle');

    // Should see the test client we created
    await page.waitForSelector(`text=${testEnvironment.testClients[0].name}`, { timeout: 10000 });

    // Step 5: Navigate to articles settings page and verify test articles exist
    await page.goto('/settings/articles');
    await page.waitForLoadState('networkidle');

    // Should see test articles
    for (const article of testEnvironment.testArticles) {
      await page.waitForSelector(`text=${article.name}`, { timeout: 10000 });
    }

    // Step 6: Navigate to tags settings page and verify test tags exist
    await page.goto('/settings/tags');
    await page.waitForLoadState('networkidle');

    // Should see test tags
    for (const tag of testEnvironment.testTags) {
      await page.waitForSelector(`text=${tag.name}`, { timeout: 10000 });
    }

    // Step 7: Navigate to locations settings page and verify test locations exist
    await page.goto('/settings/locations');
    await page.waitForLoadState('networkidle');

    // Should see test locations
    for (const location of testEnvironment.testLocations) {
      await page.waitForSelector(`text=${location.name}`, { timeout: 10000 });
    }

    // Step 8: Navigate to providers settings page and verify test providers exist
    await page.goto('/settings/providers');
    await page.waitForLoadState('networkidle');

    // Should see test providers
    for (const provider of testEnvironment.testProviders) {
      await page.waitForSelector(`text=${provider.name}`, { timeout: 10000 });
    }

    // Step 9: Navigate to formulas settings page and verify test formulas exist
    await page.goto('/settings/formulas');
    await page.waitForLoadState('networkidle');

    // Should see test formulas
    for (const formula of testEnvironment.testFormulas) {
      await page.waitForSelector(`text=${formula.name}`, { timeout: 10000 });
    }
  });

  test('should handle authentication errors properly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    // Test with invalid credentials
    await loginPage.navigateToLogin();
    await loginPage.login('invalid@test.com', 'wrongpassword');

    // Should show error message
    await page.waitForSelector('[data-testid="error-message"]', { timeout: 10000 });

    // Should not redirect to dashboard
    await page.waitForURL('**/login', { timeout: 5000 });
  });

  test('should maintain session after successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    // Login first
    await loginPage.navigateToLogin();
    await loginPage.login(testEnvironment.testUser.email, testEnvironment.testUser.password);
    await loginPage.expectSuccessfulLogin();

    // Navigate to different pages
    await page.goto('/offers');
    await page.waitForLoadState('networkidle');

    await page.goto('/settings/clients');
    await page.waitForLoadState('networkidle');

    await page.goto('/settings/articles');
    await page.waitForLoadState('networkidle');

    // Should still be logged in (not redirected to login)
    await page.waitForURL('**/settings/articles', { timeout: 5000 });
  });
});
