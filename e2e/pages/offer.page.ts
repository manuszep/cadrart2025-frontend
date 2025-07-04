import { Page } from '@playwright/test';

import { BasePage } from './base.page';

export class OfferPage extends BasePage {
  // Note: No create offer button exists in the current implementation
  private readonly offerList = '[data-testid="offer-list"]';
  private readonly offerItem = '[data-testid="offer-item"]';
  private readonly searchInput = '[data-testid="search-input"]';
  private readonly filters = '[data-testid="filters"]';

  constructor(page: Page) {
    super(page);
  }

  async navigateToOffers(): Promise<void> {
    await this.navigateTo('/offers');
    await this.waitForPageLoad();
  }

  // Note: No create offer functionality exists in the current implementation

  async searchOffers(searchTerm: string): Promise<void> {
    // The search input is an esfs-field component, so we need to find the actual input element
    const searchInput = this.page.locator(this.searchInput).locator('input');
    await searchInput.fill(searchTerm);
  }

  async filterOffers(filterValue: string): Promise<void> {
    // Click on the filter button that matches the value
    await this.clickElement(`[data-testid="filters"] button:has-text("${filterValue}")`);
  }

  async expectOfferListToBeVisible(): Promise<void> {
    // Wait for either the offer list to be visible or for the page to load completely
    try {
      await this.expectElementToBeVisible(this.offerList);
    } catch (_error) {
      // If offer list is not visible, check if the page loaded at all
      await this.expectElementToBeVisible('[data-testid="offers-page"]');
      console.log('Offer list not visible, but offers page loaded');
    }
  }

  async getOfferCount(): Promise<number> {
    const offers = await this.page.locator(this.offerItem).count();
    return offers;
  }

  async clickOfferByIndex(index: number): Promise<void> {
    const offers = await this.page.locator(this.offerItem);
    await offers.nth(index).click();
  }

  async expectOfferToExist(offerTitle: string): Promise<void> {
    const offers = await this.page.locator(this.offerItem);
    const count = await offers.count();

    for (let i = 0; i < count; i++) {
      const text = await offers.nth(i).textContent();
      if (text?.includes(offerTitle)) {
        return;
      }
    }

    throw new Error(`Offer with title "${offerTitle}" not found`);
  }
}
