import { Page, Locator, expect } from '@playwright/test';

export class BookAppointmentPage {
  readonly page: Page;
  readonly bookAppointmentSidebarLink: Locator;
  readonly bookNowCtaLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bookAppointmentSidebarLink = page.getByRole('link', { name: 'Book Appointment' });
    this.bookNowCtaLink = page.getByRole('link', { name: 'Book Now' });
  }

  async expectSidebarLinkVisible(): Promise<void> {
    await expect(this.bookAppointmentSidebarLink).toBeVisible();
  }

  async expectDashboardCtaVisible(): Promise<void> {
    await expect(this.bookNowCtaLink).toBeVisible();
  }

  async clickSidebarLink(): Promise<void> {
    await this.bookAppointmentSidebarLink.click();
  }

  async clickDashboardCta(): Promise<void> {
    await this.bookNowCtaLink.click();
  }

  async expectNavigatedToBookAppointment(): Promise<void> {
    await expect(this.page).toHaveURL(/\/appointments\/book/);
  }
}