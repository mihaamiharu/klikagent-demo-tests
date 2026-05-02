import { Page, Locator, expect } from '@playwright/test';

export interface DoctorFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  department: string;
  license: string;
  specialization: string;
}

export class DoctorsPage {
  readonly page: Page;

  // Page heading
  readonly pageHeading: Locator;

  // Create Doctor button
  readonly createDoctorButton: Locator;

  // Create Doctor form modal
  readonly createDoctorForm: Locator;

  // Form inputs
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly departmentSelect: Locator;
  readonly licenseInput: Locator;
  readonly specializationInput: Locator;

  // Form buttons
  readonly cancelButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Page heading
    this.pageHeading = page.getByRole('heading', { name: 'Doctors' });

    // Create Doctor button
    this.createDoctorButton = page.getByTestId('doctor-create-button');

    // Create Doctor form modal
    this.createDoctorForm = page.getByTestId('doctor-form-modal');

    // Form inputs using data-testid for resilience
    this.firstNameInput = page.getByTestId('doctor-firstName-input');
    this.lastNameInput = page.getByTestId('doctor-lastName-input');
    this.emailInput = page.getByTestId('doctor-email-input');
    this.passwordInput = page.getByTestId('doctor-password-input');
    this.departmentSelect = page.getByTestId('doctor-department-input');
    this.licenseInput = page.getByTestId('doctor-license-input');
    this.specializationInput = page.getByTestId('doctor-specialization-input');

    // Form buttons
    this.cancelButton = page.getByTestId('doctor-form-cancel');
    this.submitButton = page.getByTestId('doctor-form-submit');
  }

  // Navigation
  async gotoDoctors(): Promise<void> {
    await this.page.goto('/doctors');
  }

  // Page assertions
  async expectPageHeadingVisible(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }

  // Create Doctor button actions
  async clickCreateDoctorButton(): Promise<void> {
    await this.createDoctorButton.click();
  }

  async expectCreateDoctorButtonVisible(): Promise<void> {
    await expect(this.createDoctorButton).toBeVisible();
  }

  async expectCreateDoctorButtonHidden(): Promise<void> {
    await expect(this.createDoctorButton).toBeHidden();
  }

  // Form modal
  async expectCreateDoctorFormVisible(): Promise<void> {
    await expect(this.createDoctorForm).toBeVisible();
  }

  async expectFormClosed(): Promise<void> {
    await expect(this.createDoctorForm).toBeHidden();
  }

  // Fill form
  async fillDoctorForm(data: DoctorFormData): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.departmentSelect.selectOption(data.department);
    await this.licenseInput.fill(data.license);
    await this.specializationInput.fill(data.specialization);
  }

  // Submit form
  async submitDoctorForm(): Promise<void> {
    await this.submitButton.click();
  }

  // Doctor list
  async expectDoctorInList(fullName: string): Promise<void> {
    await expect(this.page.getByText(fullName)).toBeVisible();
  }
}
