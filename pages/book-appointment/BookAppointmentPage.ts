import { Page, Locator, expect } from '@playwright/test';

export class BookAppointmentPage {
  readonly page: Page;

  // Dashboard elements
  readonly sidebarBookAppointmentLink: Locator;
  readonly dashboardBookNowCTA: Locator;
  readonly welcomeHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sidebar navigation
    this.sidebarBookAppointmentLink = page.getByRole('link', { name: 'Book Appointment' });

    // Dashboard CTA card
    this.dashboardBookNowCTA = page.getByRole('link', { name: 'Book Now' });

    // Welcome heading (dynamic with user's display name)
    this.welcomeHeading = page.getByRole('heading', { level: 1 });
  }

  async gotoDashboard(): Promise<void> {
    await this.page.goto('/dashboard');
    await expect(this.welcomeHeading).toBeVisible();
  }

  async expectBookAppointmentSidebarLinkVisible(): Promise<void> {
    await expect(this.sidebarBookAppointmentLink).toBeVisible();
  }

  async expectBookNowCTAVisible(): Promise<void> {
    await expect(this.dashboardBookNowCTA).toBeVisible();
  }

  async expectWelcomeHeading(textPattern: string | RegExp): Promise<void> {
    await expect(this.welcomeHeading).toContainText(textPattern);
  }

  async expectBookAppointmentSidebarLinkPointsToBooking(): Promise<void> {
    await expect(this.sidebarBookAppointmentLink).toHaveAttribute('href', /appointments\/book/);
  }

  async expectBookNowCTAPointsToBooking(): Promise<void> {
    await expect(this.dashboardBookNowCTA).toHaveAttribute('href', /appointments\/book/);
  }

  async getSidebarLinkHref(): Promise<string | null> {
    return this.sidebarBookAppointmentLink.getAttribute('href');
  }

  async getCTAHref(): Promise<string | null> {
    return this.dashboardBookNowCTA.getAttribute('href');
  }
}
