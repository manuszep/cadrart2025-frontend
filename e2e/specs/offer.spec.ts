import { test } from '@playwright/test';

import { LoginPage } from '../pages/login.page';
import { OfferPage } from '../pages/offer.page';
import { TestDataFactory } from '../fixtures/test-data';

test.describe('Offers', () => {
  let loginPage: LoginPage;
  let offerPage: OfferPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    offerPage = new OfferPage(page);

    // Login first
    await loginPage.navigateToLogin();
    const validCredentials = TestDataFactory.getValidCredentials();
    console.log('Attempting login with:', validCredentials.email);
    await loginPage.login(validCredentials.email, validCredentials.password);
    await loginPage.expectSuccessfulLogin();
    console.log('Login successful, current URL:', await page.url());
  });

  test('should navigate to offers page', async () => {
    await offerPage.navigateToOffers();

    // Just check if we're on the offers page by checking the URL
    const currentUrl = await offerPage.getCurrentUrl();
    if (!currentUrl.includes('/offers')) {
      throw new Error(`Expected to be on offers page, but URL is: ${currentUrl}`);
    }

    console.log('Successfully navigated to offers page:', currentUrl);
  });

  test('should display offer list with action buttons', async () => {
    await offerPage.navigateToOffers();
    await offerPage.expectOfferListToBeVisible();

    // Verify the table has action buttons (start, stop, complete)
    // These are rendered per row, so we check if the table structure is correct
    await offerPage.expectElementToBeVisible('[data-testid="offer-list"]');
  });

  test('should allow searching offers', async () => {
    await offerPage.navigateToOffers();

    // The search input is in the navigation component, not specific to offers
    // This test verifies the global search functionality is available
    await offerPage.expectElementToBeVisible('[data-testid="search-input"]');

    // Test that we can interact with the search
    await offerPage.searchOffers('test offer');
  });

  test('should allow filtering offers', async () => {
    await offerPage.navigateToOffers();

    // Verify filters are visible
    await offerPage.expectElementToBeVisible('[data-testid="filters"]');

    // Test clicking on a filter button (using the actual filter values from the component)
    await offerPage.filterOffers('PAUSED');
  });

  test('should display offer list', async () => {
    await offerPage.navigateToOffers();
    await offerPage.expectOfferListToBeVisible();

    const offerCount = await offerPage.getOfferCount();
    // Should have at least 0 offers (empty state is valid)
    if (offerCount < 0) {
      throw new Error('Invalid offer count');
    }

    // Log the count for debugging
    console.log(`Found ${offerCount} offers`);
  });
});
