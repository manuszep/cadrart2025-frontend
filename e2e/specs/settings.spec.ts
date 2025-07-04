import { test } from '@playwright/test';

import { SettingsPage } from '../pages/settings.page';

test.describe('Settings', () => {
  let settingsPage: SettingsPage;

  test.beforeEach(async ({ page }) => {
    settingsPage = new SettingsPage(page);
  });

  test('should navigate to settings page', async () => {
    await settingsPage.navigateToSettings();
    await settingsPage.expectSettingsMenuToBeVisible();
  });

  test('should navigate to team members section', async () => {
    await settingsPage.navigateToTeamMembers();
    await settingsPage.expectElementToBeVisible('[data-testid="team-member-section"]');
  });

  test('should navigate to tags section', async () => {
    await settingsPage.navigateToTags();
    await settingsPage.expectElementToBeVisible('[data-testid="tag-section"]');
  });

  test('should navigate to providers section', async () => {
    await settingsPage.navigateToProviders();
    await settingsPage.expectElementToBeVisible('[data-testid="provider-section"]');
  });

  test('should navigate to locations section', async () => {
    await settingsPage.navigateToLocations();
    await settingsPage.expectElementToBeVisible('[data-testid="location-section"]');
  });

  test('should navigate to clients section', async () => {
    await settingsPage.navigateToClients();
    await settingsPage.expectElementToBeVisible('[data-testid="client-section"]');
  });

  test('should navigate to formulas section', async () => {
    await settingsPage.navigateToFormulas();
    await settingsPage.expectElementToBeVisible('[data-testid="formula-section"]');
  });

  test('should navigate to articles section', async () => {
    await settingsPage.navigateToArticles();
    await settingsPage.expectElementToBeVisible('[data-testid="article-section"]');
  });

  test('should display settings menu', async () => {
    await settingsPage.navigateToSettings();
    await settingsPage.expectSettingsMenuToBeVisible();
  });
});
