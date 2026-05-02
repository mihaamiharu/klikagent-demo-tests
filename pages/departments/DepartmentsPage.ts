import { Page, Locator, expect } from '@playwright/test';

export class DepartmentsPage {
  readonly page: Page;

  // Main page elements
  readonly createDepartmentButton: Locator;
  readonly searchInput: Locator;
  readonly departmentList: Locator;

  // Create/Edit modal elements
  readonly createModal: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly validationError: Locator;

  constructor(page: Page) {
    this.page = page;

    // Main page
    this.createDepartmentButton = page.getByTestId('create-department-button');
    this.searchInput = page.getByTestId('department-search-input');
    this.departmentList = page.getByTestId('department-list');

    // Modal
    this.createModal = page.getByTestId('department-form-modal');
    this.nameInput = page.getByTestId('department-name-input');
    this.descriptionInput = page.getByTestId('department-description-input');
    this.submitButton = page.getByTestId('department-submit-button');
    this.cancelButton = page.getByTestId('department-cancel-button');
    this.validationError = page.getByTestId('department-validation-error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/departments');
    await this.createDepartmentButton.waitFor({ state: 'visible' });
  }

  async clickNewDepartmentButton(): Promise<void> {
    await this.createDepartmentButton.click();
  }

  async fillDepartmentForm(name: string, description: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.descriptionInput.fill(description);
  }

  async clickSubmitButton(): Promise<void> {
    await this.submitButton.click();
  }

  async clickCancelButton(): Promise<void> {
    await this.cancelButton.click();
  }

  async searchForDepartment(name: string): Promise<void> {
    await this.searchInput.fill(name);
  }

  async expectNewDepartmentButtonVisible(): Promise<void> {
    await expect(this.createDepartmentButton).toBeVisible();
  }

  async expectCreateModalVisible(): Promise<void> {
    await expect(this.createModal).toBeVisible();
  }

  async expectNameInputVisible(): Promise<void> {
    await expect(this.nameInput).toBeVisible();
  }

  async expectSubmitButtonVisible(): Promise<void> {
    await expect(this.submitButton).toBeVisible();
  }

  async expectValidationErrorVisible(): Promise<void> {
    await expect(this.validationError).toBeVisible();
  }

  async expectModalClosed(): Promise<void> {
    await expect(this.createModal).not.toBeVisible();
  }

  async expectDepartmentInList(name: string): Promise<void> {
    const departmentItem = this.departmentList.getByText(name, { exact: false });
    await expect(departmentItem).toBeVisible();
  }

  async expectDepartmentNotInList(name: string): Promise<void> {
    const departmentItem = this.departmentList.getByText(name, { exact: false });
    await expect(departmentItem).not.toBeVisible();
  }
}