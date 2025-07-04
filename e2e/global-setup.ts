import { chromium, FullConfig } from '@playwright/test';

import { TestDataFactory } from './fixtures/test-data';

async function globalSetup(_config: FullConfig): Promise<void> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to login page
    await page.goto('http://localhost:4200/login');

    // Wait for login form to be visible
    await page.waitForSelector('[data-testid="email-input"] input');
    await page.waitForSelector('[data-testid="password-input"] input');
    await page.waitForSelector('[data-testid="login-button"]');

    // Get test credentials
    const validCredentials = TestDataFactory.getValidCredentials();

    // Fill login form
    await page.fill('[data-testid="email-input"] input', validCredentials.email);
    await page.fill('[data-testid="password-input"] input', validCredentials.password);

    // Click login button
    await page.click('[data-testid="login-button"]');

    // Wait for successful login (redirect to offers page)
    await page.waitForURL('**/offers', { timeout: 10000 });

    // Store the authenticated state
    await page.context().storageState({ path: 'e2e/auth.json' });

    console.log('✅ Global authentication setup completed successfully');
  } catch (error) {
    console.error('❌ Global authentication setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
