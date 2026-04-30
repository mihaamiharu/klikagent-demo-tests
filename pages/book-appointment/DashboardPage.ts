import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  // Sidebar locators
  readonly bookAppointmentSidebarLink: Locator;

  // Dashboard CTA card locators
  readonly bookNowCtaCard: Locator;
  readonly healthCheckupHeading: Locator;
  readonly bookNowCtaLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sidebar locators
    this.bookAppointmentSidebarLink = page.getByRole('link', { name: 'Book Appointment' });

    // Dashboard CTA card locators
    this.bookNowCtaCard = page.locator('.grid > .space-y-8');
    this.healthCheckupHeading = page.getByRole('heading', { name: 'Health checkup?' });
    this.bookNowCtaLink = page.getByRole('link', { name: 'Book Now' });
  }

  async expectBookAppointmentSidebarLinkVisible(): Promise<void> {
    await expect(this.bookAppointmentSidebarLink).toBeVisible();
  }

  async expectBookNowCtaCardVisible(): Promise<void> {
    await expect(this.bookNowCtaCard).toBeVisible();
  }

  async expectHealthCheckupHeadingVisible(): Promise<void> {
    await expect(this.healthCheckupHeading).toBeVisible();
  }

  async expectBookNowCtaLinkVisible(): Promise<void> {
    await expect(this.bookNowCtaLink).toBeVisible();
  }
}