import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  // Sidebar locators
  readonly bookAppointmentSidebarLink: Locator;
  readonly dashboardLink: Locator;
  readonly appointmentsLink: Locator;
  readonly logoutButton: Locator;

  // Dashboard CTA locators
  readonly bookNowCta: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sidebar locators
    this.bookAppointmentSidebarLink = page.getByRole('link', { name: 'Book Appointment' });
    this.dashboardLink = page.getByRole('link', { name: 'Dashboard', exact: true });
    this.appointmentsLink = page.getByRole('link', { name: 'Appointments' });
    this.logoutButton = page.getByRole('button', { name: 'Log out' });

    // Dashboard CTA
    this.bookNowCta = page.getByRole('link', { name: 'Book Now' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async expectSidebarLinkVisible(): Promise<void> {
    await expect(this.bookAppointmentSidebarLink).toBeVisible();
  }

  async expectBookNowCtaVisible(): Promise<void> {
    await expect(this.bookNowCta).toBeVisible();
  }

  async getSidebarLinkHref(): Promise<string | null> {
    return this.bookAppointmentSidebarLink.getAttribute('href');
  }

  async getBookNowCtaHref(): Promise<string | null> {
    return this.bookNowCta.getAttribute('href');
  }

  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
  }
}
