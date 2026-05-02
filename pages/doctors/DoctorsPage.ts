import { Page, Locator, expect } from '@playwright/test';

export class DoctorsPage {
  readonly page: Page;

  // Page heading
  readonly doctorsHeading: Locator;

  // Create Doctor button
  readonly createDoctorButton: Locator;

  // Doctor form locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly departmentSelect: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  // Form container
  readonly doctorForm: Locator;

  constructor(page: Page) {
    this.page = page;

    // Page heading
    this.doctorsHeading = page.getByRole('heading', { name: 'Doctors' });

    // Create Doctor button
    this.createDoctorButton = page.getByRole('button', { name: 'Create Doctor' });

    // Doctor form inputs
    this.firstNameInput = page.getByLabel('First Name');
    this.lastNameInput = page.getByLabel('Last Name');
    this.emailInput = page.getByLabel('Email');
    this.departmentSelect = page.getByLabel('Department');
    this.submitButton = page.getByRole('button', { name: 'Create' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });

    // Form container (modal/dialog)
    this.doctorForm = page.getByRole('dialog');
  }

  // Navigation
  async gotoDoctors(): Promise<void> {
    await this.page.goto('/doctors');
  }

  // Page assertions
  async expectDoctorsHeadingVisible(): Promise<void> {
    await expect(this.doctorsHeading).toBeVisible();
  }

  // Create Doctor button assertions
  async expectCreateDoctorButtonVisible(): Promise<void> {
    await expect(this.createDoctorButton).toBeVisible();
  }

  async expectCreateDoctorButtonNotVisible(): Promise<void> {
    await expect(this.createDoctorButton).not.toBeVisible();
  }

  // Create Doctor button interaction
  async clickCreateDoctorButton(): Promise<void> {
    await this.createDoctorButton.click();
  }

  // Form interactions
  async fillDoctorForm(doctorData: {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
  }): Promise<void> {
    await this.firstNameInput.fill(doctorData.firstName);
    await this.lastNameInput.fill(doctorData.lastName);
    await this.emailInput.fill(doctorData.email);
    await this.departmentSelect.selectOption(doctorData.department);
  }

  async submitDoctorForm(): Promise<void> {
    await this.submitButton.click();
  }

  async cancelDoctorForm(): Promise<void> {
    await this.cancelButton.click();
  }

  // Form visibility assertions
  async expectFormVisible(): Promise<void> {
    await expect(this.doctorForm).toBeVisible();
  }

  async expectFormNotVisible(): Promise<void> {
    await expect(this.doctorForm).not.toBeVisible();
  }

  // Doctor list assertions
  async expectDoctorInList(fullName: string): Promise<void> {
    await expect(this.page.getByText(fullName)).toBeVisible();
  }

  // Test data generation
  generateUniqueDoctorData(): {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
  } {
    const timestamp = Date.now();
    return {
      firstName: 'John',
      lastName: 'Smith',
      email: `dr.${String(timestamp)}@caresync.dev`,
      department: 'General',
    };
  }
}
