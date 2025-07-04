import { Page } from '@playwright/test';

import { BasePage } from './base.page';

export class SettingsPage extends BasePage {
  private readonly settingsMenu = '[data-testid="settings-menu"]';
  private readonly teamMemberSection = '[data-testid="team-member-section"]';
  private readonly tagSection = '[data-testid="tag-section"]';
  private readonly providerSection = '[data-testid="provider-section"]';
  private readonly locationSection = '[data-testid="location-section"]';
  private readonly clientSection = '[data-testid="client-section"]';
  private readonly formulaSection = '[data-testid="formula-section"]';
  private readonly articleSection = '[data-testid="article-section"]';

  constructor(page: Page) {
    super(page);
  }

  async navigateToSettings(): Promise<void> {
    await this.navigateTo('/settings');
    await this.waitForPageLoad();
  }

  async navigateToTeamMembers(): Promise<void> {
    await this.navigateTo('/settings/team-member');
    await this.waitForPageLoad();
  }

  async navigateToTags(): Promise<void> {
    await this.navigateTo('/settings/tag');
    await this.waitForPageLoad();
  }

  async navigateToProviders(): Promise<void> {
    await this.navigateTo('/settings/provider');
    await this.waitForPageLoad();
  }

  async navigateToLocations(): Promise<void> {
    await this.navigateTo('/settings/location');
    await this.waitForPageLoad();
  }

  async navigateToClients(): Promise<void> {
    await this.navigateTo('/settings/client');
    await this.waitForPageLoad();
  }

  async navigateToFormulas(): Promise<void> {
    await this.navigateTo('/settings/formula');
    await this.waitForPageLoad();
  }

  async navigateToArticles(): Promise<void> {
    await this.navigateTo('/settings/article');
    await this.waitForPageLoad();
  }

  async expectSettingsMenuToBeVisible(): Promise<void> {
    await this.expectElementToBeVisible(this.settingsMenu);
  }

  async clickSection(sectionName: string): Promise<void> {
    const sectionSelector = `[data-testid="${sectionName}-section"]`;
    await this.clickElement(sectionSelector);
  }
}
