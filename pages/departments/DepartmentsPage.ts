import { Page, Locator, expect } from '@playwright/test';

export class DepartmentsPage {
  readonly page: Page;
  readonly newDepartmentButton: Locator;
  readonly searchInput: Locator;
  readonly deptNameInput: Locator;
  readonly deptDescriptionInput: Locator;
  readonly deptImageUrlInput: Locator;
  readonly cancelButton: Locator;
  readonly submitButton: Locator;
  readonly validationError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newDepartmentButton = page.getByTestId('create-department-button');
    this.searchInput = page.getByTestId('departments-search');
    this.deptNameInput = page.getByTestId('dept-name-input');
    this.deptDescriptionInput = page.getByTestId('dept-description-input');
    this.deptImageUrlInput = page.getByTestId('dept-imageurl-input');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.submitButton = page.getByTestId('dept-form-submit');
    this.validationError = page.getByTestId('dept-name-error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/departments');
  }

  async clickNewDepartmentButton(): Promise<void> {
    await this.newDepartmentButton.click();
  }

  async expectNewDepartmentButtonVisible(): Promise<void> {
    await expect(this.newDepartmentButton).toBeVisible();
  }

  async expectNewDepartmentButtonNotVisible(): Promise<void> {
    await expect(this.newDepartmentButton).not.toBeVisible();
  }

  async expectCreateModalVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Create New Department' })).toBeVisible();
  }

  async expectNameInputVisible(): Promise<void> {
    await expect(this.deptNameInput).toBeVisible();
  }

  async expectSubmitButtonVisible(): Promise<void> {
    await expect(this.submitButton).toBeVisible();
  }

  async expectValidationErrorVisible(): Promise<void> {
    await expect(this.validationError).toBeVisible();
    await expect(this.validationError).toContainText('required');
  }

  async fillDepartmentForm(name: string, description: string, imageUrl?: string): Promise<void> {
    await this.deptNameInput.fill(name);
    await this.deptDescriptionInput.fill(description);
    if (imageUrl) {
      await this.deptImageUrlInput.fill(imageUrl);
    }
  }

  async clickSubmitButton(): Promise<void> {
    await this.submitButton.click();
  }

  async clickCancelButton(): Promise<void> {
    await this.cancelButton.click();
  }

  async expectModalClosed(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Create New Department' })).not.toBeVisible();
  }

  async searchForDepartment(name: string): Promise<void> {
    await this.searchInput.fill(name);
  }

  async expectDepartmentInList(name: string): Promise<void> {
    await expect(this.page.getByRole('heading', { level: 3, name: name })).toBeVisible();
  }

  async expectDepartmentNotInList(name: string): Promise<void> {
    await expect(this.page.getByRole('heading', { level: 3, name: name })).not.toBeVisible();
  }

  async expectSuccessToastVisible(): Promise<void> {
    await expect(this.page.getByRole('alert')).toContainText(/success/i);
  }
}
