import { Page, Locator, expect } from '@playwright/test';

export class DoctorsPage {
  readonly page: Page;
  readonly doctorsHeading: Locator;
  readonly createDoctorButton: Locator;
  readonly doctorsSearchInput: Locator;
  readonly doctorLink: Locator;
  readonly doctorCardEditButton: Locator;
  readonly doctorCardDeleteButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly departmentSelect: Locator;
  readonly licenseInput: Locator;
  readonly specializationInput: Locator;
  readonly bioInput: Locator;
  readonly cancelButton: Locator;
  readonly createButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.doctorsHeading = page.getByRole('heading', { name: 'Doctors' });
    this.createDoctorButton = page.getByTestId('create-doctor-button');
    this.doctorsSearchInput = page.getByTestId('doctors-search');
    this.doctorLink = page.locator('a[href^="/doctors/"]');
    this.doctorCardEditButton = page.getByRole('button', { name: 'Edit' });
    this.doctorCardDeleteButton = page.getByRole('button', { name: 'Delete' });
    this.firstNameInput = page.getByTestId('doctor-firstName-input');
    this.lastNameInput = page.getByTestId('doctor-lastName-input');
    this.emailInput = page.getByTestId('doctor-email-input');
    this.passwordInput = page.getByTestId('doctor-password-input');
    this.departmentSelect = page.getByTestId('doctor-department-input');
    this.licenseInput = page.getByTestId('doctor-license-input');
    this.specializationInput = page.getByTestId('doctor-specialization-input');
    this.bioInput = page.getByTestId('doctor-bio-input');
    this.cancelButton = page.getByTestId('doctor-form-cancel');
    this.createButton = page.getByTestId('doctor-form-submit');
  }

  async goto(): Promise<void> {
    await this.page.goto('/doctors');
  }

  async expectDoctorsHeadingVisible(): Promise<void> {
    await expect(this.doctorsHeading).toBeVisible();
  }

  async expectCreateDoctorButtonHidden(): Promise<void> {
    await expect(this.createDoctorButton).not.toBeVisible();
  }

  async expectCreateDoctorButtonVisible(): Promise<void> {
    await expect(this.createDoctorButton).toBeVisible();
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
    bio?: string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.departmentSelect.selectOption(data.department);
    await this.specializationInput.fill(data.specialization);
    await this.licenseInput.fill(data.license);
    if (data.bio) {
      await this.bioInput.fill(data.bio);
    }
  }

  async submitDoctorForm(): Promise<void> {
    await this.createButton.click();
  }

  async expectDoctorInList(firstName: string, lastName: string): Promise<void> {
    const doctorName = `${firstName} ${lastName}`;
    await expect(this.page.getByText(doctorName)).toBeVisible();
  }

  async expectModalClosed(): Promise<void> {
    await expect(this.createButton).not.toBeVisible();
    await expect(this.firstNameInput).not.toBeVisible();
  }
}
