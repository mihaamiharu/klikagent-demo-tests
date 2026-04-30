import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly bookAppointmentSidebarLink: Locator;
  readonly healthCheckupCtaHeading: Locator;
  readonly bookNowCtaLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bookAppointmentSidebarLink = page.getByRole('link', { name: 'Book Appointment' });
    this.healthCheckupCtaHeading = page.getByRole('heading', { name: 'Health checkup?' });
    this.bookNowCtaLink = page.getByRole('link', { name: 'Book Now' });
  }

  async gotoDashboard(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async expectDashboardLoaded(): Promise<void> {
    await expect(this.bookAppointmentSidebarLink).toBeVisible();
  }

  async expectSidebarLinkVisible(): Promise<void> {
    await expect(this.bookAppointmentSidebarLink).toBeVisible();
  }

  async expectCtaCardVisible(): Promise<void> {
    await expect(this.healthCheckupCtaHeading).toBeVisible();
    await expect(this.bookNowCtaLink).toBeVisible();
  }

  async getSidebarLinkHref(): Promise<string | null> {
    return this.bookAppointmentSidebarLink.getAttribute('href');
  }

  async getBookNowLinkHref(): Promise<string | null> {
    return this.bookNowCtaLink.getAttribute('href');
  }
}