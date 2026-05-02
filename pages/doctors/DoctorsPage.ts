import { Page, Locator, expect } from '@playwright/test';

export class DoctorsPage {
  readonly page: Page;
  readonly doctorsHeading: Locator;
  readonly createDoctorButton: Locator;
  readonly doctorsSearch: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly phoneInput: Locator;
  readonly departmentInput: Locator;
  readonly licenseInput: Locator;
  readonly specializationInput: Locator;
  readonly bioInput: Locator;
  readonly cancelButton: Locator;
  readonly createButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.doctorsHeading = page.getByRole('heading', { name: 'Doctors' });
    this.createDoctorButton = page.getByTestId('create-doctor-button');
    this.doctorsSearch = page.getByTestId('doctors-search');
    this.firstNameInput = page.getByTestId('doctor-firstName-input');
    this.lastNameInput = page.getByTestId('doctor-lastName-input');
    this.emailInput = page.getByTestId('doctor-email-input');
    this.passwordInput = page.getByTestId('doctor-password-input');
    this.phoneInput = page.getByTestId('doctor-phone-input');
    this.departmentInput = page.getByTestId('doctor-department-input');
    this.licenseInput = page.getByTestId('doctor-license-input');
    this.specializationInput = page.getByTestId('doctor-specialization-input');
    this.bioInput = page.getByTestId('doctor-bio-input');
    this.cancelButton = page.getByTestId('doctor-form-cancel');
    this.createButton = page.getByTestId('doctor-form-submit');
  }

  async goto(): Promise<void> {
    await this.page.goto('/doctors');
    await expect(this.doctorsHeading).toBeVisible();
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
    phone?: string;
    bio?: string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.departmentInput.selectOption({ label: data.department });
    await this.licenseInput.fill(data.license);
    await this.specializationInput.fill(data.specialization);

    if (data.phone) {
      await this.phoneInput.fill(data.phone);
    }
    if (data.bio) {
      await this.bioInput.fill(data.bio);
    }
  }

  async submitDoctorForm(): Promise<void> {
    await this.createButton.click();
  }

  async expectCreateDoctorButtonVisible(): Promise<void> {
    await expect(this.createDoctorButton).toBeVisible();
  }

  async expectCreateDoctorButtonNotVisible(): Promise<void> {
    await expect(this.createDoctorButton).not.toBeVisible();
  }

  async expectDoctorInList(fullName: string): Promise<void> {
    await expect(this.page.getByText(fullName)).toBeVisible();
  }

  async expectModalClosed(): Promise<void> {
    await expect(this.firstNameInput).not.toBeVisible();
    await expect(this.createDoctorButton).toBeVisible();
  }

  async expectSuccessNotification(): Promise<void> {
    await expect(this.page.getByRole('alert')).toContainText('Doctor created successfully');
  }
}
