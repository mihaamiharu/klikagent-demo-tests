import { Page, Locator, expect } from '@playwright/test';

export class DoctorsPage {
  readonly page: Page;

  // Main page locators
  readonly heading: Locator;
  readonly createDoctorButton: Locator;
  readonly searchBox: Locator;
  readonly doctorsNavLink: Locator;
  readonly logoutButton: Locator;

  // Modal locators
  readonly modal: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly phoneInput: Locator;
  readonly departmentSelect: Locator;
  readonly licenseNumberInput: Locator;
  readonly specializationInput: Locator;
  readonly bioInput: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;
  readonly successNotification: Locator;

  constructor(page: Page) {
    this.page = page;

    // Main page locators
    this.heading = page.getByRole('heading', { name: 'Doctors' });
    this.createDoctorButton = page.getByTestId('create-doctor-button');
    this.searchBox = page.getByTestId('doctors-search');
    this.doctorsNavLink = page.getByRole('link', { name: 'Doctors' });
    this.logoutButton = page.getByRole('button', { name: 'Log out' });

    // Modal form locators
    this.modal = page.getByRole('dialog');
    this.firstNameInput = page.getByLabel('First Name');
    this.lastNameInput = page.getByLabel('Last Name');
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.phoneInput = page.getByLabel('Phone');
    this.departmentSelect = page.getByLabel('Department');
    this.licenseNumberInput = page.getByLabel('License Number');
    this.specializationInput = page.getByLabel('Specialization');
    this.bioInput = page.getByLabel('Bio');
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.successNotification = page.getByRole('status');
  }

  async goto(): Promise<void> {
    await this.page.goto('/doctors');
  }

  async expectPageVisible(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectCreateDoctorButtonVisible(): Promise<void> {
    await expect(this.createDoctorButton).toBeVisible();
  }

  async expectCreateDoctorButtonHidden(): Promise<void> {
    await expect(this.createDoctorButton).not.toBeVisible();
  }

  async clickCreateDoctor(): Promise<void> {
    await this.createDoctorButton.click();
  }

  async expectModalVisible(): Promise<void> {
    await expect(this.modal).toBeVisible();
  }

  async expectModalHidden(): Promise<void> {
    await expect(this.modal).not.toBeVisible();
  }

  async fillDoctorForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    department: string;
    licenseNumber: string;
    specialization: string;
    bio?: string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    if (data.phone) {
      await this.phoneInput.fill(data.phone);
    }
    await this.departmentSelect.selectOption(data.department);
    await this.licenseNumberInput.fill(data.licenseNumber);
    await this.specializationInput.fill(data.specialization);
    if (data.bio) {
      await this.bioInput.fill(data.bio);
    }
  }

  async submitForm(): Promise<void> {
    await this.createButton.click();
  }

  async expectSuccessNotificationVisible(): Promise<void> {
    await expect(this.successNotification).toContainText('Doctor created successfully');
  }

  async expectDoctorInList(fullName: string): Promise<void> {
    await expect(this.page.getByText(fullName)).toBeVisible();
  }

  async searchDoctors(query: string): Promise<void> {
    await this.searchBox.fill(query);
  }
}
