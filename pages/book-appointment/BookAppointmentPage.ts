import { Page, Locator, expect } from '@playwright/test';

export class BookAppointmentPage {
  readonly page: Page;
  readonly sidebarBookAppointmentLink: Locator;
  readonly dashboardCTA: Locator;
  readonly dashboardCTAHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebarBookAppointmentLink = page.getByRole('link', { name: 'Book Appointment' });
    this.dashboardCTA = page.getByRole('link', { name: 'Book Now' });
    this.dashboardCTAHeading = page.getByRole('heading', { name: 'Health checkup?' });
  }

  async gotoDashboard(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async expectSidebarLinkVisible(): Promise<void> {
    await expect(this.sidebarBookAppointmentLink).toBeVisible();
  }

  async expectDashboardCTAVisible(): Promise<void> {
    await expect(this.dashboardCTA).toBeVisible();
    await expect(this.dashboardCTAHeading).toBeVisible();
  }

  async clickSidebarLink(): Promise<void> {
    await this.sidebarBookAppointmentLink.click();
  }

  async clickCTALink(): Promise<void> {
    await this.dashboardCTA.click();
  }

  async expectOnBookAppointmentPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/appointments\/book/);
  }

  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
  }
}