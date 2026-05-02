import { Page, Locator, expect } from '@playwright/test';

export class DoctorsPage {
  readonly page: Page;

  // Page heading
  readonly pageHeading: Locator;

  // Create Doctor button (admin only)
  readonly createDoctorButton: Locator;

  // Create Doctor form modal
  readonly createDoctorForm: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly departmentSelect: Locator;
  readonly licenseInput: Locator;
  readonly specializationInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Page heading
    this.pageHeading = page.getByRole('heading', { name: 'Doctors' });

    // Create Doctor button
    this.createDoctorButton = page.getByRole('button', { name: 'Create Doctor' });

    // Create Doctor form
    this.createDoctorForm = page.getByRole('dialog', { name: /create doctor/i });
    this.firstNameInput = page.getByLabel('First Name');
    this.lastNameInput = page.getByLabel('Last Name');
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.departmentSelect = page.getByLabel('Department');
    this.licenseInput = page.getByLabel('License Number');
    this.specializationInput = page.getByLabel('Specialization');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async expectPageHeadingVisible(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
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

  async expectCreateDoctorFormVisible(): Promise<void> {
    await expect(this.createDoctorForm).toBeVisible();
  }

  async fillDoctorForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    department: string;
    license: string;
    specialization: string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.departmentSelect.selectOption(data.department);
    await this.licenseInput.fill(data.license);
    await this.specializationInput.fill(data.specialization);
  }

  async submitDoctorForm(): Promise<void> {
    await this.submitButton.click();
  }

  async expectFormClosed(): Promise<void> {
    await expect(this.createDoctorForm).not.toBeVisible();
  }

  async expectDoctorInList(fullName: string): Promise<void> {
    await expect(this.page.getByRole('link', { name: fullName })).toBeVisible();
  }
}