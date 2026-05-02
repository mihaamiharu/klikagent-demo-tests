import { type Page, type Locator, expect } from '@playwright/test';

export class DepartmentsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly createButton: Locator;
  readonly createModal: Locator;
  readonly departmentNameInput: Locator;
  readonly departmentDescriptionInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly searchInput: Locator;
  readonly validationError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Departments' });
    this.createButton = page.getByTestId('create-department-button');
    this.createModal = page.getByTestId('create-department-modal');
    this.departmentNameInput = page.getByLabel('Department Name');
    this.departmentDescriptionInput = page.getByLabel('Description');
    this.submitButton = page.getByTestId('submit-department-button');
    this.cancelButton = page.getByTestId('cancel-department-button');
    this.searchInput = page.getByTestId('department-search-input');
    this.validationError = page.getByTestId('validation-error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/departments');
  }

  async expectDepartmentsHeadingVisible(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async clickCreateDepartmentButton(): Promise<void> {
    await this.createButton.click();
  }

  async expectCreateModalVisible(): Promise<void> {
    await expect(this.createModal).toBeVisible();
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
    await this.submitButton.click();
  }

  async clickCancelButton(): Promise<void> {
    await this.cancelButton.click();
  }

  async expectValidationError(): Promise<void> {
    await expect(this.validationError).toBeVisible();
  }

  async expectModalClosed(): Promise<void> {
    await expect(this.createModal).not.toBeVisible();
  }

  async expectSuccessMessage(message: string): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectDepartmentInList(name: string): Promise<void> {
    const card = this.page.locator('[data-testid^="department-card-"]').filter({ hasText: name });
    await expect(card).toBeVisible();
  }

  async expectDepartmentNotInList(name: string): Promise<void> {
    const card = this.page.locator('[data-testid^="department-card-"]').filter({ hasText: name });
    await expect(card).not.toBeVisible();
  }

  async searchDepartment(name: string): Promise<void> {
    await this.searchInput.fill(name);
  }

  async clickEditButton(): Promise<void> {
    await this.page.getByRole('button', { name: /edit/i }).first().click();
  }

  async clickDeleteButton(): Promise<void> {
    await this.page.getByRole('button', { name: /delete/i }).first().click();
  }
}