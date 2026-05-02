import { Page, Locator, expect } from '@playwright/test';

export class DoctorsPage {
  readonly page: Page;

  // Page elements
  readonly pageHeading: Locator;
  readonly createDoctorButton: Locator;
  readonly searchInput: Locator;
  readonly doctorLink: Locator;
  readonly logoutButton: Locator;

  // Form elements
  readonly formHeading: Locator;
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

    // Page elements
    this.pageHeading = page.getByRole('heading', { name: 'Doctors' });
    this.createDoctorButton = page.getByTestId('create-doctor-button');
    this.searchInput = page.getByTestId('doctors-search');
    this.doctorLink = page.locator('link').filter({ hasText: /^Dr\..*/ }).first();
    this.logoutButton = page.getByRole('button', { name: 'Log out' });

    // Form elements
    this.formHeading = page.getByRole('heading', { name: 'Create Doctor' });
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

  async gotoDoctors(): Promise<void> {
    await this.page.goto('/doctors');
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
    await expect(this.formHeading).toBeVisible();
  }

  async fillDoctorForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    department: string;
    license: string;
    specialization: string;
    phone?: string;
    bio?: string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.departmentInput.selectOption(data.department);
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

  async expectFormClosed(): Promise<void> {
    await expect(this.formHeading).not.toBeVisible();
  }

  async expectDoctorInList(fullName: string): Promise<void> {
    // The doctor appears in the list with "Dr. FirstName LastName" format
    const doctorNamePattern = new RegExp(`Dr\.\s${fullName}`);
    await expect(this.page.locator('link').filter({ hasText: doctorNamePattern }).first()).toBeVisible();
  }

  async expectDoctorWithLicense(licenseNumber: string): Promise<void> {
    // Check if a doctor with the given license number is visible in the list
    await expect(this.page.getByText(licenseNumber)).toBeVisible();
  }
}
