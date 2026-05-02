import { Page, Locator, expect } from '@playwright/test';

export class DepartmentsPage {
  readonly page: Page;
  readonly departmentsSidebarLink: Locator;
  readonly logoutButton: Locator;
  readonly searchBox: Locator;
  readonly newDepartmentButton: Locator;
  readonly departmentNameInput: Locator;
  readonly descriptionInput: Locator;
  readonly coverImageUrlInput: Locator;
  readonly cancelButton: Locator;
  readonly createDepartmentButton: Locator;
  readonly saveChangesButton: Locator;
  readonly unitsCount: Locator;
  readonly toastSuccess: Locator;

  constructor(page: Page) {
    this.page = page;
    this.departmentsSidebarLink = page.getByRole('link', { name: 'Departments' });
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
    this.searchBox = page.getByTestId('departments-search');
    this.newDepartmentButton = page.getByTestId('create-department-button');
    this.departmentNameInput = page.getByLabel('Department Name');
    this.descriptionInput = page.getByLabel('Description');
    this.coverImageUrlInput = page.getByLabel('Cover Image URL');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.createDepartmentButton = page.getByRole('button', { name: 'Create Department' });
    this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });
    this.unitsCount = page.locator('text=Units Available');
    this.toastSuccess = page.locator('text=/Department (created|updated) successfully/');
  }

  async goto(): Promise<void> {
    await this.page.goto('/departments');
  }

  async clickDepartmentsSidebarLink(): Promise<void> {
    await this.departmentsSidebarLink.click();
  }

  async clickNewDepartmentButton(): Promise<void> {
    await this.newDepartmentButton.click();
  }

  async fillDepartmentName(name: string): Promise<void> {
    await this.departmentNameInput.fill(name);
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput.fill(description);
  }

  async fillCoverImageUrl(url: string): Promise<void> {
    await this.coverImageUrlInput.fill(url);
  }

  async fillDepartmentForm(name: string, description: string, coverImageUrl?: string): Promise<void> {
    await this.fillDepartmentName(name);
    await this.fillDescription(description);
    if (coverImageUrl) {
      await this.fillCoverImageUrl(coverImageUrl);
    }
  }

  async clickCreateDepartmentButton(): Promise<void> {
    await this.createDepartmentButton.click();
  }

  async clickSaveChangesButton(): Promise<void> {
    await this.saveChangesButton.click();
  }

  async clickCancelButton(): Promise<void> {
    await this.cancelButton.click();
  }

  async clickEditButtonForDepartment(departmentName: string): Promise<void> {
    // Find the department card by name and click its edit button
    const departmentCard = this.page.getByRole('heading', { name: departmentName }).locator('..');
    const editButton = departmentCard.getByRole('button', { name: 'Edit' });
    await editButton.click();
  }

  async searchForDepartment(name: string): Promise<void> {
    await this.searchBox.fill(name);
  }

  async expectDepartmentsPageVisible(): Promise<void> {
    await expect(this.departmentsSidebarLink).toBeVisible();
    await expect(this.newDepartmentButton).toBeVisible();
    await expect(this.searchBox).toBeVisible();
  }

  async expectCreateModalVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Create New Department' })).toBeVisible();
    await expect(this.departmentNameInput).toBeVisible();
    await expect(this.descriptionInput).toBeVisible();
    await expect(this.createDepartmentButton).toBeVisible();
  }

  async expectEditModalVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Edit Department' })).toBeVisible();
    await expect(this.departmentNameInput).toBeVisible();
    await expect(this.saveChangesButton).toBeVisible();
  }

  async expectModalClosed(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Create New Department' })).not.toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Edit Department' })).not.toBeVisible();
  }

  async expectToastSuccess(): Promise<void> {
    await expect(this.toastSuccess).toBeVisible();
  }

  async expectDepartmentInList(name: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name })).toBeVisible();
  }

  async expectDepartmentNotInList(name: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name })).not.toBeVisible();
  }

  async expectUnitsCountChanged(expectedCount: number): Promise<void> {
    await expect(this.page.locator(`text=${expectedCount} Units Available`)).toBeVisible();
  }

  async getCurrentUnitsCount(): Promise<number> {
    const text = await this.unitsCount.textContent();
    const match = text?.match(/(\d+)\s+Units Available/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
