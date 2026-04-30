import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Book Appointment feature
 * Handles verification of sidebar link and dashboard CTA visibility
 */
export class BookAppointmentPage {
  readonly page: Page;

  // Dashboard locators
  readonly bookAppointmentSidebarLink: Locator;
  readonly bookNowCtaLink: Locator;
  readonly logoutButton: Locator;
  readonly dashboardNavLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Dashboard locators
    this.bookAppointmentSidebarLink = page.getByRole('link', { name: 'Book Appointment' });
    this.bookNowCtaLink = page.getByRole('link', { name: 'Book Now' });
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
    this.dashboardNavLink = page.getByRole('link', { name: 'Dashboard' });
  }

  /**
   * Assert that the Book Appointment sidebar link is visible
   */
  async expectBookAppointmentSidebarLinkVisible(): Promise<void> {
    await expect(this.bookAppointmentSidebarLink).toBeVisible();
  }

  /**
   * Assert that the Book Now CTA card link is visible on the dashboard
   */
  async expectBookNowCtaVisible(): Promise<void> {
    await expect(this.bookNowCtaLink).toBeVisible();
  }

  /**
   * Click the Book Appointment sidebar link
   */
  async clickBookAppointmentSidebarLink(): Promise<void> {
    await this.bookAppointmentSidebarLink.click();
  }

  /**
   * Click the Book Now CTA link
   */
  async clickBookNowCta(): Promise<void> {
    await this.bookNowCtaLink.click();
  }

  /**
   * Verify navigation to the booking page after clicking a booking link
   */
  async expectNavigatedToBookingPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/appointments\/book/);
  }

  /**
   * Assert that the dashboard is visible (user is logged in)
   */
  async expectOnDashboard(): Promise<void> {
    await expect(this.dashboardNavLink).toBeVisible();
  }

  /**
   * Log out from the dashboard
   */
  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}