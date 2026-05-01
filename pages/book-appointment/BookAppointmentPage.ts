import { Page, Locator, expect } from '@playwright/test';

export class BookAppointmentPage {
  readonly page: Page;
  readonly sidebarBookAppointmentLink: Locator;
  readonly bookNowCtaLink: Locator;
  readonly dashboardLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Sidebar link for Book Appointment
    this.sidebarBookAppointmentLink = page.getByRole('link', { name: 'Book Appointment' });
    // Dashboard CTA for Book Now
    this.bookNowCtaLink = page.getByRole('link', { name: 'Book Now' });
    // Dashboard navigation
    this.dashboardLink = page.getByRole('link', { name: 'Dashboard' });
    // Logout button
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

  async expectBothVisible(): Promise<void> {
    await expect(this.sidebarBookAppointmentLink).toBeVisible();
    await expect(this.bookNowCtaLink).toBeVisible();
  }

  async clickSidebarLink(): Promise<void> {
    await this.sidebarBookAppointmentLink.click();
  }

  async clickBookNowCta(): Promise<void> {
    await this.bookNowCtaLink.click();
  }

  async expectNavigationToBookingPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/appointments\/book/);
  }

  async expectSidebarLinkActive(): Promise<void> {
    await expect(this.sidebarBookAppointmentLink).toHaveAttribute('aria-current', 'page');
  }

  async getSidebarLinkHref(): Promise<string | null> {
    return this.sidebarBookAppointmentLink.getAttribute('href');
  }

  async getBookNowCtaHref(): Promise<string | null> {
    return this.bookNowCtaLink.getAttribute('href');
  }
}
