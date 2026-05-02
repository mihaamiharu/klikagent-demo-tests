import { Page, Locator, expect } from '@playwright/test';

export class DepartmentsPage {
  readonly page: Page;
  
  // Page locators
  readonly pageTitle: Locator;
  readonly newDepartmentButton: Locator;
  readonly searchInput: Locator;
  
  // Create modal
  readonly createModal: Locator;
  readonly departmentNameInput: Locator;
  readonly departmentDescriptionInput: Locator;
  readonly createDepartmentButton: Locator;
  
  // Edit modal
  readonly editModal: Locator;
  readonly saveChangesButton: Locator;
  
  // Department list
  readonly departmentList: Locator;
  
  // Toast
  readonly toastSuccess: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Page elements
    this.pageTitle = page.getByRole('heading', { name: /departments/i });
    this.newDepartmentButton = page.getByRole('button', { name: /new department/i });
    this.searchInput = page.getByPlaceholder(/search/i);
    
    // Create modal
    this.createModal = page.getByRole('dialog', { name: /new department/i });
    this.departmentNameInput = this.createModal.getByLabel(/name/i);
    this.departmentDescriptionInput = this.createModal.getByLabel(/description/i);
    this.createDepartmentButton = this.createModal.getByRole('button', { name: /create/i });
    
    // Edit modal
    this.editModal = page.getByRole('dialog', { name: /edit department/i });
    this.saveChangesButton = this.editModal.getByRole('button', { name: /save changes/i });
    
    // List
    this.departmentList = page.getByTestId('department-list');
    
    // Toast - specific locator to avoid strict mode violation
    this.toastSuccess = page.getByText('Department created successfully');
  }

  async goto(): Promise<void> {
    await this.page.goto('/departments');
  }

  async clickNewDepartmentButton(): Promise<void> {
    await this.newDepartmentButton.click();
  }

  async expectDepartmentsPageVisible(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
  }

  async expectCreateModalVisible(): Promise<void> {
    await expect(this.createModal).toBeVisible();
  }

  async fillDepartmentForm(name: string, description: string): Promise<void> {
    await this.departmentNameInput.fill(name);
    await this.departmentDescriptionInput.fill(description);
  }

  async clickCreateDepartmentButton(): Promise<void> {
    await this.createDepartmentButton.click();
  }

  async expectModalClosed(): Promise<void> {
    await expect(this.createModal).not.toBeVisible();
    await expect(this.editModal).not.toBeVisible();
  }

  async expectToastSuccess(): Promise<void> {
    await expect(this.toastSuccess).toBeVisible();
  }

  async expectDepartmentInList(name: string): Promise<void> {
    await expect(this.departmentList.getByText(name)).toBeVisible();
  }

  async expectDepartmentNotInList(name: string): Promise<void> {
    await expect(this.departmentList.getByText(name)).not.toBeVisible();
  }

  async getCurrentUnitsCount(): Promise<number> {
    const items = await this.departmentList.locator('[data-testid="department-item"]').all();
    return items.length;
  }

  async expectUnitsCountChanged(expected: number): Promise<void> {
    await expect(this.departmentList.locator('[data-testid="department-item"]')).toHaveCount(expected);
  }

  async clickEditButtonForDepartment(name: string): Promise<void> {
    const row = this.departmentList.getByText(name).locator('..');
    await row.getByRole('button', { name: /edit/i }).click();
  }

  async expectEditModalVisible(): Promise<void> {
    await expect(this.editModal).toBeVisible();
  }

  async fillDepartmentName(name: string): Promise<void> {
    await this.departmentNameInput.fill(name);
  }

  async clickSaveChangesButton(): Promise<void> {
    await this.saveChangesButton.click();
  }

  async searchForDepartment(name: string): Promise<void> {
    await this.searchInput.fill(name);
  }
}
