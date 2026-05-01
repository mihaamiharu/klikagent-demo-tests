import { Page, Locator, expect } from '@playwright/test';

export class BookAppointmentPage {
  readonly page: Page;
  readonly sidebarLink: Locator;
  readonly dashboardCtaButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebarLink = page.getByRole('link', { name: 'Book Appointment' });
    this.dashboardCtaButton = page.getByRole('link', { name: 'Book Now' });
  }

  async gotoDashboard(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async expectSidebarLinkVisible(): Promise<void> {
    await expect(this.sidebarLink).toBeVisible();
  }

  async expectCtaVisible(): Promise<void> {
    await expect(this.dashboardCtaButton).toBeVisible();
  }

  async getSidebarHref(): Promise<string | null> {
    return this.sidebarLink.getAttribute('href');
  }

  async getCtaHref(): Promise<string | null> {
    return this.dashboardCtaButton.getAttribute('href');
  }
}
