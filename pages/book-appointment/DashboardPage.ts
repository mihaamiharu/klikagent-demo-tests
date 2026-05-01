import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly sidebarBookAppointmentLink: Locator;
  readonly bookNowCta: Locator;
  readonly healthCheckupCtaCard: Locator;
  readonly welcomeHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebarBookAppointmentLink = page.getByRole('link', { name: 'Book Appointment' });
    this.bookNowCta = page.getByRole('link', { name: 'Book Now' });
    this.healthCheckupCtaCard = page.getByRole('heading', { name: 'Health checkup?' });
    this.welcomeHeading = page.getByRole('heading', { name: /Welcome back,/ });
  }

  async gotoDashboard(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async expectSidebarBookAppointmentLinkVisible(): Promise<void> {
    await expect(this.sidebarBookAppointmentLink).toBeVisible();
  }

  async expectBookNowCtaVisible(): Promise<void> {
    await expect(this.bookNowCta).toBeVisible();
  }

  async expectHealthCheckupCtaCardVisible(): Promise<void> {
    await expect(this.healthCheckupCtaCard).toBeVisible();
  }

  async clickSidebarBookAppointmentLink(): Promise<void> {
    await this.sidebarBookAppointmentLink.click();
  }

  async clickBookNowCta(): Promise<void> {
    await this.bookNowCta.click();
  }

  async getSidebarBookAppointmentHref(): Promise<string | null> {
    return this.sidebarBookAppointmentLink.getAttribute('href');
  }

  async getBookNowCtaHref(): Promise<string | null> {
    return this.bookNowCta.getAttribute('href');
  }

  async expectWelcomeHeadingContainsName(name: string): Promise<void> {
    await expect(this.welcomeHeading).toContainText(name);
  }

  async expectDashboardUrl(urlPattern: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(urlPattern);
  }
}
