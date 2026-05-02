import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Departments | Admin CRUD', { tag: ['@departments', '@regression'] }, () => {
  test('admin can navigate to departments page', async ({ departmentsPage }) => {
    await departmentsPage.goto();
    await departmentsPage.expectDepartmentsPageVisible();
    await expect(departmentsPage.page).toHaveURL(/\/departments/);
  });

  test('admin can create a new department', async ({ departmentsPage }) => {
    await departmentsPage.goto();
    
    // Get initial count before creating
    const initialCount = await departmentsPage.getCurrentUnitsCount();
    
    // Click New Department button
    await departmentsPage.clickNewDepartmentButton();
    await departmentsPage.expectCreateModalVisible();
    
    // Fill department form with unique data using timestamp
    const uniqueName = `QA Test Department ${Date.now()}`;
    const uniqueDescription = 'This is a test department created by QA automation';
    
    await departmentsPage.fillDepartmentForm(uniqueName, uniqueDescription);
    await departmentsPage.clickCreateDepartmentButton();
    
    // Verify modal closed
    await departmentsPage.expectModalClosed();
    
    // Verify success toast
    await departmentsPage.expectToastSuccess();
    
    // Verify new department appears in list
    await departmentsPage.expectDepartmentInList(uniqueName);
    
    // Verify count increased by 1
    await departmentsPage.expectUnitsCountChanged(initialCount + 1);
  });

  test('admin can edit an existing department', async ({ departmentsPage }) => {
    await departmentsPage.goto();
    
    // Create a new department first to avoid flaky tests with existing data
    await departmentsPage.clickNewDepartmentButton();
    await departmentsPage.expectCreateModalVisible();
    
    const originalName = `QA Test Department ${Date.now()}`;
    const originalDescription = 'Original description';
    const updatedName = `${originalName} - Updated`;
    
    await departmentsPage.fillDepartmentForm(originalName, originalDescription);
    await departmentsPage.clickCreateDepartmentButton();
    
    // Wait for modal to close and department to appear
    await departmentsPage.expectModalClosed();
    await departmentsPage.expectDepartmentInList(originalName);
    await departmentsPage.expectToastSuccess();
    
    // Click Edit button for the newly created department
    await departmentsPage.clickEditButtonForDepartment(originalName);
    await departmentsPage.expectEditModalVisible();
    
    // Verify name is pre-filled in the modal
    await expect(departmentsPage.departmentNameInput).toHaveValue(originalName);
    
    // Update the name
    await departmentsPage.departmentNameInput.clear();
    await departmentsPage.fillDepartmentName(updatedName);
    
    // Click Save Changes
    await departmentsPage.clickSaveChangesButton();
    
    // Verify modal closed
    await departmentsPage.expectModalClosed();
    
    // Verify success toast
    await departmentsPage.expectToastSuccess();
    
    // Verify updated name appears in the list
    await departmentsPage.expectDepartmentInList(updatedName);
    
    // Verify the original name is no longer visible
    await departmentsPage.expectDepartmentNotInList(originalName);
  });

  test('admin can search for a department', async ({ departmentsPage }) => {
    await departmentsPage.goto();
    
    // Create a department first
    await departmentsPage.clickNewDepartmentButton();
    await departmentsPage.expectCreateModalVisible();
    
    const searchName = `Search Test Dept ${Date.now()}`;
    await departmentsPage.fillDepartmentForm(searchName, 'Description for search test');
    await departmentsPage.clickCreateDepartmentButton();
    
    await departmentsPage.expectModalClosed();
    await departmentsPage.expectDepartmentInList(searchName);
    
    // Search for the department
    await departmentsPage.searchForDepartment(searchName);
    
    // Verify the department is still visible
    await departmentsPage.expectDepartmentInList(searchName);
  });
});

test.describe('Departments | Access Control', { tag: ['@departments', '@access-control'] }, () => {
  test('doctor cannot access departments page', async ({ asDoctor }) => {
    await asDoctor.goto('/departments');
    // Should be redirected or see access denied
    await expect(asDoctor).toHaveURL(/login|dashboard|403/);
  });

  test('patient cannot access departments page', async ({ asPatient }) => {
    await asPatient.goto('/departments');
    // Should be redirected or see access denied
    await expect(asPatient).toHaveURL(/login|dashboard|403/);
  });
});
