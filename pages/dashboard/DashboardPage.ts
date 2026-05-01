import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  // Sidebar locators
  readonly sidebarBookAppointmentLink: Locator;
  readonly sidebarDashboardLink: Locator;
  readonly logoutButton: Locator;

  // Dashboard CTAs
  readonly dashboardBookNowCta: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Sidebar navigation
    this.sidebarBookAppointmentLink = page.getByRole('link', { name: 'Book Appointment' });
    this.sidebarDashboardLink = page.getByRole('link', { name: 'Dashboard' });
    this.logoutButton = page.getByRole('button', { name: 'Log out' });

    // Dashboard content
    this.dashboardBookNowCta = page.getByRole('link', { name: 'Book Now' });
  }

  // Navigation methods
  async gotoDashboard(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async gotoAppointmentsBook(): Promise<void> {
    await this.page.goto('/appointments/book');
  }

  // Assertion methods
  async expectSidebarBookAppointmentLinkVisible(): Promise<void> {
    await expect(this.sidebarBookAppointmentLink).toBeVisible();
  }

  async expectDashboardBookNowCtaVisible(): Promise<void> {
    await expect(this.dashboardBookNowCta).toBeVisible();
  }

  async expectSidebarDashboardLinkVisible(): Promise<void> {
    await expect(this.sidebarDashboardLink).toBeVisible();
  }

  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
  }

  // Getter methods for attribute access (Pattern 4)
  async getSidebarBookAppointmentHref(): Promise<string | null> {
    return this.sidebarBookAppointmentLink.getAttribute('href');
  }

  async getDashboardBookNowHref(): Promise<string | null> {
    return this.dashboardBookNowCta.getAttribute('href');
  }

  async expectSidebarLinkHasHref(href: string): Promise<void> {
    await expect(this.sidebarBookAppointmentLink).toHaveAttribute('href', href);
  }

  async expectCtaLinkHasHref(href: string): Promise<void> {
    await expect(this.dashboardBookNowCta).toHaveAttribute('href', href);
  }
}
