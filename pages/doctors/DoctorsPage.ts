import { Page, Locator, expect } from '@playwright/test';

export class DoctorsPage {
  readonly page: Page;

  // List page locators
  readonly headingDoctors: Locator;
  readonly searchInput: Locator;
  readonly createDoctorButton: Locator;
  readonly logoutButton: Locator;

  // Form modal locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly departmentInput: Locator;
  readonly licenseInput: Locator;
  readonly specializationInput: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // List page locators
    this.headingDoctors = page.getByRole('heading', { name: 'Doctors' });
    this.searchInput = page.getByTestId('doctors-search');
    this.createDoctorButton = page.getByTestId('create-doctor-button');
    this.logoutButton = page.getByRole('button', { name: 'Log out' });

    // Form modal locators
    this.firstNameInput = page.getByTestId('doctor-firstName-input');
    this.lastNameInput = page.getByTestId('doctor-lastName-input');
    this.emailInput = page.getByTestId('doctor-email-input');
    this.passwordInput = page.getByTestId('doctor-password-input');
    this.departmentInput = page.getByTestId('doctor-department-input');
    this.licenseInput = page.getByTestId('doctor-license-input');
    this.specializationInput = page.getByTestId('doctor-specialization-input');
    this.formCancelButton = page.getByTestId('doctor-form-cancel');
    this.formSubmitButton = page.getByTestId('doctor-form-submit');
  }

  async goto(): Promise<void> {
    await this.page.goto('/doctors');
  }

  async expectDoctorsPageVisible(): Promise<void> {
    await expect(this.headingDoctors).toBeVisible();
  }

  async expectCreateDoctorButtonVisible(): Promise<void> {
    await expect(this.createDoctorButton).toBeVisible();
  }

  async expectCreateDoctorButtonHidden(): Promise<void> {
    await expect(this.createDoctorButton).not.toBeVisible();
  }

  async clickCreateDoctorButton(): Promise<void> {
    await this.createDoctorButton.click();
  }

  async fillDoctorForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    department: string;
    specialization: string;
    license: string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.departmentInput.selectOption({ label: data.department });
    await this.licenseInput.fill(data.license);
    await this.specializationInput.fill(data.specialization);
  }

  async submitDoctorForm(): Promise<void> {
    await this.formSubmitButton.click();
  }

  async expectDoctorInList(fullName: string): Promise<void> {
    await expect(this.page.getByText(fullName)).toBeVisible();
  }

  async expectModalClosed(): Promise<void> {
    await expect(this.formSubmitButton).not.toBeVisible();
  }
}
