import { Page, Locator, expect } from '@playwright/test';

export class DoctorsPage {
  readonly page: Page;
  readonly createDoctorButton: Locator;
  readonly doctorsSearch: Locator;
  readonly doctorFirstNameInput: Locator;
  readonly doctorLastNameInput: Locator;
  readonly doctorEmailInput: Locator;
  readonly doctorPasswordInput: Locator;
  readonly doctorDepartmentInput: Locator;
  readonly doctorLicenseInput: Locator;
  readonly doctorSpecializationInput: Locator;
  readonly doctorFormCancel: Locator;
  readonly doctorFormSubmit: Locator;
  readonly firstNameRequiredError: Locator;
  readonly lastNameRequiredError: Locator;
  readonly departmentRequiredError: Locator;
  readonly specializationRequiredError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createDoctorButton = page.getByTestId('create-doctor-button');
    this.doctorsSearch = page.getByTestId('doctors-search');
    this.doctorFirstNameInput = page.getByTestId('doctor-firstName-input');
    this.doctorLastNameInput = page.getByTestId('doctor-lastName-input');
    this.doctorEmailInput = page.getByTestId('doctor-email-input');
    this.doctorPasswordInput = page.getByTestId('doctor-password-input');
    this.doctorDepartmentInput = page.getByTestId('doctor-department-input');
    this.doctorLicenseInput = page.getByTestId('doctor-license-input');
    this.doctorSpecializationInput = page.getByTestId('doctor-specialization-input');
    this.doctorFormCancel = page.getByTestId('doctor-form-cancel');
    this.doctorFormSubmit = page.getByTestId('doctor-form-submit');
    this.firstNameRequiredError = page.getByText('First name is required');
    this.lastNameRequiredError = page.getByText('Last name is required');
    this.departmentRequiredError = page.getByText('Please select a department');
    this.specializationRequiredError = page.getByText('Specialization is required');
  }

  async goto(): Promise<void> {
    await this.page.goto('/doctors');
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
    await this.doctorFirstNameInput.fill(data.firstName);
    await this.doctorLastNameInput.fill(data.lastName);
    await this.doctorEmailInput.fill(data.email);
    await this.doctorPasswordInput.fill(data.password);
    await this.doctorDepartmentInput.selectOption({ label: data.department });
    await this.doctorSpecializationInput.fill(data.specialization);
    await this.doctorLicenseInput.fill(data.license);
  }

  async submitDoctorForm(): Promise<void> {
    await this.doctorFormSubmit.click();
  }

  async cancelDoctorForm(): Promise<void> {
    await this.doctorFormCancel.click();
  }

  async expectCreateDoctorFormVisible(): Promise<void> {
    await expect(this.doctorFirstNameInput).toBeVisible();
  }

  async expectValidationErrorsVisible(): Promise<void> {
    await expect(this.firstNameRequiredError).toBeVisible();
    await expect(this.lastNameRequiredError).toBeVisible();
    await expect(this.departmentRequiredError).toBeVisible();
    await expect(this.specializationRequiredError).toBeVisible();
  }

  async expectDoctorInList(firstName: string, lastName: string): Promise<void> {
    await expect(this.page.getByText(`${firstName} ${lastName}`)).toBeVisible();
  }

  async expectSuccessNotification(): Promise<void> {
    await expect(this.page.getByRole('region', { name: 'Notifications' }).getByText('Doctor created successfully')).toBeVisible();
  }

  async expectEmailRequiredError(): Promise<void> {
    await expect(this.page.getByText('Email is required')).toBeVisible();
  }

  async expectPasswordRequiredError(): Promise<void> {
    await expect(this.page.getByText('Password is required')).toBeVisible();
  }
}
