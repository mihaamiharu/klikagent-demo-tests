import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  // Sidebar locators
  readonly bookAppointmentSidebarLink: Locator;
  readonly logoutButton: Locator;

  // Dashboard CTA locators
  readonly bookNowCTALink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sidebar links
    this.bookAppointmentSidebarLink = page.getByRole('link', { name: 'Book Appointment' });
    this.logoutButton = page.getByRole('button', { name: 'Log out' });

    // Dashboard CTA
    this.bookNowCTALink = page.getByRole('link', { name: 'Book Now' });
  }

  async gotoDashboard(): Promise<void> {
    await this.page.goto('/dashboard');
    await this.expectOnDashboard();
  }

  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
  }

  async expectBookAppointmentSidebarLinkVisible(): Promise<void> {
    await expect(this.bookAppointmentSidebarLink).toBeVisible();
  }

  async expectBookNowCTAVisible(): Promise<void> {
    await expect(this.bookNowCTALink).toBeVisible();
  }

  async expectLogoutButtonVisible(): Promise<void> {
    await expect(this.logoutButton).toBeVisible();
  }

  async clickBookAppointmentSidebarLink(): Promise<void> {
    await this.bookAppointmentSidebarLink.click();
  }

  async clickBookNowCTA(): Promise<void> {
    await this.bookNowCTALink.click();
  }

  async expectNavigateToBookAppointment(): Promise<void> {
    await expect(this.page).toHaveURL(/\/appointments\/book/);
  }
}
