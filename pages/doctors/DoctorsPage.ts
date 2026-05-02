import { Page, Locator, expect } from '@playwright/test';

export class DoctorsPage {
  readonly page: Page;

  // Header elements
  readonly doctorsHeading: Locator;
  readonly createDoctorButton: Locator;
  readonly doctorsSearch: Locator;

  // Modal elements
  readonly doctorFormModalHeading: Locator;
  readonly doctorFirstNameInput: Locator;
  readonly doctorLastNameInput: Locator;
  readonly doctorEmailInput: Locator;
  readonly doctorPasswordInput: Locator;
  readonly doctorPhoneInput: Locator;
  readonly doctorDepartmentInput: Locator;
  readonly doctorLicenseInput: Locator;
  readonly doctorSpecializationInput: Locator;
  readonly doctorBioInput: Locator;
  readonly doctorFormCancel: Locator;
  readonly doctorFormSubmit: Locator;

  // List elements
  readonly doctorCard: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header elements
    this.doctorsHeading = page.getByRole('heading', { name: 'Doctors' });
    this.createDoctorButton = page.getByTestId('create-doctor-button');
    this.doctorsSearch = page.getByTestId('doctors-search');

    // Modal elements
    this.doctorFormModalHeading = page.getByRole('heading', { name: 'Create Doctor' });
    this.doctorFirstNameInput = page.getByTestId('doctor-firstName-input');
    this.doctorLastNameInput = page.getByTestId('doctor-lastName-input');
    this.doctorEmailInput = page.getByTestId('doctor-email-input');
    this.doctorPasswordInput = page.getByTestId('doctor-password-input');
    this.doctorPhoneInput = page.getByTestId('doctor-phone-input');
    this.doctorDepartmentInput = page.getByTestId('doctor-department-input');
    this.doctorLicenseInput = page.getByTestId('doctor-license-input');
    this.doctorSpecializationInput = page.getByTestId('doctor-specialization-input');
    this.doctorBioInput = page.getByTestId('doctor-bio-input');
    this.doctorFormCancel = page.getByTestId('doctor-form-cancel');
    this.doctorFormSubmit = page.getByTestId('doctor-form-submit');

    // List elements
    this.doctorCard = page.locator('[data-testid="doctor-card"]');
  }

  // Navigation
  async gotoDoctors(): Promise<void> {
    await this.page.goto('/doctors');
  }

  // Assertions
  async expectDoctorsHeadingVisible(): Promise<void> {
    await expect(this.doctorsHeading).toBeVisible();
  }

  async expectCreateDoctorButtonVisible(): Promise<void> {
    await expect(this.createDoctorButton).toBeVisible();
  }

  async expectCreateDoctorButtonHidden(): Promise<void> {
    await expect(this.createDoctorButton).not.toBeVisible();
  }

  async expectDoctorFormModalVisible(): Promise<void> {
    await expect(this.doctorFormModalHeading).toBeVisible();
  }

  async expectDoctorCardVisible(): Promise<void> {
    await expect(this.doctorCard).toBeVisible();
  }

  // Actions
  async clickCreateDoctorButton(): Promise<void> {
    await this.createDoctorButton.click();
  }

  async clickDoctorFormCancel(): Promise<void> {
    await this.doctorFormCancel.click();
  }

  async clickDoctorFormSubmit(): Promise<void> {
    await this.doctorFormSubmit.click();
  }

  // Form filling
  async fillDoctorForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    department: string;
    specialization: string;
    license: string;
    bio?: string;
  }): Promise<void> {
    await this.doctorFirstNameInput.fill(data.firstName);
    await this.doctorLastNameInput.fill(data.lastName);
    await this.doctorEmailInput.fill(data.email);
    await this.doctorPasswordInput.fill(data.password);
    
    if (data.phone) {
      await this.doctorPhoneInput.fill(data.phone);
    }
    
    await this.doctorDepartmentInput.selectOption({ label: data.department });
    await this.doctorLicenseInput.fill(data.license);
    await this.doctorSpecializationInput.fill(data.specialization);
    
    if (data.bio) {
      await this.doctorBioInput.fill(data.bio);
    }
  }

  // Helper to wait for modal to close
  async waitForModalClosed(): Promise<void> {
    await expect(this.doctorFormModalHeading).not.toBeVisible();
  }

  // Helper to verify doctor appears in list with specific name
  async expectDoctorInList(partialName: string): Promise<void> {
    await expect(this.doctorCard.filter({ hasText: partialName })).toBeVisible();
  }
}
