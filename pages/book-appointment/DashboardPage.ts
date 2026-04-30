import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly bookAppointmentSidebarLink: Locator;
  readonly bookAppointmentCta: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bookAppointmentSidebarLink = page.getByRole('link', { name: 'Book Appointment' });
    this.bookAppointmentCta = page.getByRole('link', { name: 'Book Now' });
  }

  async expectSidebarBookAppointmentLinkVisible(): Promise<void> {
    await expect(this.bookAppointmentSidebarLink).toBeVisible();
  }

  async expectCtaCardVisible(): Promise<void> {
    await expect(this.bookAppointmentCta).toBeVisible();
  }

  async clickSidebarBookAppointmentLink(): Promise<void> {
    await this.bookAppointmentSidebarLink.click();
  }

  async clickCtaBookNowLink(): Promise<void> {
    await this.bookAppointmentCta.click();
  }

  async expectOnBookAppointmentPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/appointments\/book/);
  }
}
