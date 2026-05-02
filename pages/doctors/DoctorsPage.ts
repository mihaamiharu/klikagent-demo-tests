import { Page, Locator, expect } from '@playwright/test';

export class DoctorsPage {
  readonly page: Page;

  // Page header and navigation
  readonly doctorsHeading: Locator;
  readonly createDoctorButton: Locator;
  readonly searchBox: Locator;
  readonly logoutButton: Locator;

  // Modal form locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly departmentSelect: Locator;
  readonly licenseInput: Locator;
  readonly specializationInput: Locator;
  readonly bioInput: Locator;
  readonly cancelButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Page header and navigation
    this.doctorsHeading = page.getByRole('heading', { name: 'Doctors' });
    this.createDoctorButton = page.getByTestId('create-doctor-button');
    this.searchBox = page.getByTestId('doctors-search');
    this.logoutButton = page.getByRole('button', { name: 'Log out' });

    // Modal form locators
    this.firstNameInput = page.getByTestId('doctor-firstName-input');
    this.lastNameInput = page.getByTestId('doctor-lastName-input');
    this.emailInput = page.getByTestId('doctor-email-input');
    this.passwordInput = page.getByTestId('doctor-password-input');
    this.departmentSelect = page.getByTestId('doctor-department-input');
    this.licenseInput = page.getByTestId('doctor-license-input');
    this.specializationInput = page.getByTestId('doctor-specialization-input');
    this.bioInput = page.getByTestId('doctor-bio-input');
    this.cancelButton = page.getByTestId('doctor-form-cancel');
    this.submitButton = page.getByTestId('doctor-form-submit');
  }

  /**
   * Navigate to the doctors list page
   */
  async goto(): Promise<void> {
    await this.page.goto('/doctors');
  }

  /**
   * Expect the doctors page heading to be visible
   */
  async expectDoctorsHeadingVisible(): Promise<void> {
    await expect(this.doctorsHeading).toBeVisible();
  }

  /**
   * Check if Create Doctor button is visible
   */
  async expectCreateDoctorButtonVisible(): Promise<void> {
    await expect(this.createDoctorButton).toBeVisible();
  }

  /**
   * Check if Create Doctor button is NOT visible
   */
  async expectCreateDoctorButtonNotVisible(): Promise<void> {
    await expect(this.createDoctorButton).not.toBeVisible();
  }

  /**
   * Click the Create Doctor button
   */
  async clickCreateDoctorButton(): Promise<void> {
    await this.createDoctorButton.click();
  }

  /**
   * Fill the doctor form with provided data
   */
  async fillDoctorForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    department: string;
    license: string;
    specialization: string;
    bio?: string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.departmentSelect.selectOption(data.department);
    await this.licenseInput.fill(data.license);
    await this.specializationInput.fill(data.specialization);
    if (data.bio) {
      await this.bioInput.fill(data.bio);
    }
  }

  /**
   * Submit the doctor form
   */
  async submitDoctorForm(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Cancel the doctor form
   */
  async cancelDoctorForm(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Expect the form inputs to be visible (modal is open)
   */
  async expectFormVisible(): Promise<void> {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
  }

  /**
   * Expect the form inputs to not be visible (modal is closed)
   */
  async expectFormNotVisible(): Promise<void> {
    await expect(this.firstNameInput).not.toBeVisible();
  }

  /**
   * Check if a doctor name is visible in the list
   */
  async expectDoctorInList(doctorName: string): Promise<void> {
    await expect(this.page.getByText(doctorName, { exact: false })).toBeVisible();
  }

  /**
   * Generate unique doctor data for test
   * @param name Optional custom name to use instead of default
   * @param bio Optional custom bio content
   */
  generateUniqueDoctorData(name?: string, bio?: string): {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    department: string;
    license: string;
    specialization: string;
    bio: string;
  } {
    const timestamp = Date.now();
    const displayName = name ?? 'Test';
    return {
      firstName: displayName,
      lastName: `Doctor${timestamp}`,
      email: `dr.${timestamp.toLowerCase()}@caresync.dev`,
      password: 'Password123!',
      department: 'General Medicine',
      license: `LIC-${timestamp}`,
      specialization: 'General Practice',
      bio: bio ?? `Test bio - ${timestamp}`,
    };
  }
}
