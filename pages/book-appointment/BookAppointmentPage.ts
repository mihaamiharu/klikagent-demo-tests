import { Page, Locator, expect } from '@playwright/test';

export class BookAppointmentPage {
  readonly page: Page;

  // Book appointment wizard heading
  readonly bookAppointmentHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bookAppointmentHeading = page.getByRole('heading', { name: 'Book an Appointment' });
  }

  async gotoBookAppointment(): Promise<void> {
    await this.page.goto('/appointments/book');
  }

  async expectOnBookAppointmentPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/appointments\/book/);
  }

  async expectBookAppointmentWizardVisible(): Promise<void> {
    await expect(this.bookAppointmentHeading).toBeVisible();
  }

  async expectBookAppointmentWizardNotVisible(): Promise<void> {
    await expect(this.bookAppointmentHeading).not.toBeVisible();
  }
}
