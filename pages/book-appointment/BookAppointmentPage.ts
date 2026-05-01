import { Page, Locator, expect } from '@playwright/test';

export class BookAppointmentPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly stepIndicatorStep1: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: 'Book an Appointment' });
    this.stepIndicatorStep1 = page.getByTestId('step-indicator-1');
  }

  async gotoBookAppointment(): Promise<void> {
    await this.page.goto('/appointments/book');
  }

  async expectPageHeadingVisible(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }

  async expectStepIndicatorStep1Visible(): Promise<void> {
    await expect(this.stepIndicatorStep1).toBeVisible();
  }

  async expectBookingWizardVisible(): Promise<void> {
    await this.expectPageHeadingVisible();
    await this.expectStepIndicatorStep1Visible();
  }

  async expectOnBookAppointmentPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/appointments\/book/);
    await this.expectBookingWizardVisible();
  }
}
