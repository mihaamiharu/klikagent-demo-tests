import { Page, Locator, expect } from '@playwright/test';

export class BookAppointmentPage {
  readonly page: Page;
  readonly sidebarBookAppointmentLink: Locator;
  readonly bookNowCtaLink: Locator;
  readonly healthCheckupHeading: Locator;
  readonly bookAppointmentHeading: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebarBookAppointmentLink = page.getByRole('link', { name: 'Book Appointment' });
    this.bookNowCtaLink = page.getByRole('link', { name: 'Book Now' });
    this.healthCheckupHeading = page.getByRole('heading', { name: 'Health checkup?' });
    this.bookAppointmentHeading = page.getByRole('heading', { name: 'Book an Appointment' });
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
  }

  async gotoDashboard(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async expectSidebarLinkVisible(): Promise<void> {
    await expect(this.sidebarBookAppointmentLink).toBeVisible();
  }

  async expectBookNowCtaVisible(): Promise<void> {
    await expect(this.bookNowCtaLink).toBeVisible();
  }

  async expectHealthCheckupHeadingVisible(): Promise<void> {
    await expect(this.healthCheckupHeading).toBeVisible();
  }

  async expectBookAppointmentHeadingVisible(): Promise<void> {
    await expect(this.bookAppointmentHeading).toBeVisible();
  }

  async clickSidebarLink(): Promise<void> {
    await this.sidebarBookAppointmentLink.click();
  }

  async clickBookNowCta(): Promise<void> {
    await this.bookNowCtaLink.click();
  }

  async getSidebarLinkHref(): Promise<string | null> {
    return this.sidebarBookAppointmentLink.getAttribute('href');
  }

  async getBookNowCtaHref(): Promise<string | null> {
    return this.bookNowCtaLink.getAttribute('href');
  }
}
