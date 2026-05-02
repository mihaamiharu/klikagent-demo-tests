import { Page, Locator, expect } from '@playwright/test';

export class DepartmentsPage {
  readonly page: Page;
  readonly createDepartmentButton: Locator;
  readonly departmentsSearch: Locator;
  readonly departmentNameInput: Locator;
  readonly departmentDescriptionInput: Locator;
  readonly cancelButton: Locator;
  readonly formSubmitButton: Locator;
  readonly editButton: Locator;
  readonly departmentsHeading: Locator;
  readonly departmentsCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createDepartmentButton = page.getByTestId('create-department-button');
    this.departmentsSearch = page.getByTestId('departments-search');
    this.departmentNameInput = page.getByTestId('dept-name-input');
    this.departmentDescriptionInput = page.getByTestId('dept-description-input');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.formSubmitButton = page.getByTestId('dept-form-submit');
    this.editButton = page.getByRole('button', { name: 'Edit' });
    this.departmentsHeading = page.getByRole('heading', { name: 'Departments' });
    this.departmentsCount = page.locator('text=Units Available');
  }

  async goto(): Promise<void> {
    await this.page.goto('/departments');
  }

  async expectDepartmentsHeadingVisible(): Promise<void> {
    await expect(this.departmentsHeading).toBeVisible();
  }

  async expectCreateDepartmentButtonVisible(): Promise<void> {
    await expect(this.createDepartmentButton).toBeVisible();
  }

  async expectCreateDepartmentButtonNotVisible(): Promise<void> {
    await expect(this.createDepartmentButton).not.toBeVisible();
  }

  async clickCreateDepartmentButton(): Promise<void> {
    await this.createDepartmentButton.click();
  }

  async expectCreateModalVisible(): Promise<void> {
    await expect(this.departmentNameInput).toBeVisible();
    await expect(this.departmentDescriptionInput).toBeVisible();
    await expect(this.formSubmitButton).toBeVisible();
  }

  async fillDepartmentName(name: string): Promise<void> {
    await this.departmentNameInput.fill(name);
  }

  async fillDepartmentDescription(description: string): Promise<void> {
    await this.departmentDescriptionInput.fill(description);
  }

  async fillDepartmentForm(name: string, description: string): Promise<void> {
    await this.fillDepartmentName(name);
    await this.fillDepartmentDescription(description);
  }

  async submitForm(): Promise<void> {
    await this.formSubmitButton.click();
  }

  async clickCancelButton(): Promise<void> {
    await this.cancelButton.click();
  }

  async expectModalClosed(): Promise<void> {
    await expect(this.departmentNameInput).not.toBeVisible();
    await expect(this.departmentDescriptionInput).not.toBeVisible();
  }

  async searchDepartment(query: string): Promise<void> {
    await this.departmentsSearch.fill(query);
  }

  async expectDepartmentInList(name: string): Promise<void> {
    await expect(this.page.getByText(name)).toBeVisible();
  }

  async expectDepartmentNotInList(name: string): Promise<void> {
    await expect(this.page.getByText(name)).not.toBeVisible();
  }

  async clickEditButton(): Promise<void> {
    await this.editButton.first().click();
  }

  async expectValidationError(): Promise<void> {
    await expect(this.page.getByText('Name is required')).toBeVisible();
  }

  async expectSuccessMessage(message: string): Promise<void> {
    await expect(this.page.getByRole('alert').getByText(message)).toBeVisible();
  }
}
