import { test, expect } from '../../../fixtures';
import { DepartmentsPage } from '../../../pages/departments/DepartmentsPage';

test.describe('Departments | Access Control', { tag: ['@departments', '@regression'] }, () => {
  test('patient does NOT see Create Department button', async ({ asPatient }) => {
    await asPatient.goto('/departments');
    await expect(asPatient.getByTestId('create-department-button')).not.toBeVisible();
  });
});

test.describe('Departments | Admin CRUD', { tag: ['@departments', '@regression'] }, () => {
  const uniqueName = () => `QA-${Date.now()}`;

  test('admin can create a new department with all required fields', async ({ departmentsPage }) => {
    await departmentsPage.goto();
    await departmentsPage.expectDepartmentsHeadingVisible();
    await departmentsPage.clickCreateDepartmentButton();
    await departmentsPage.expectCreateModalVisible();
    await departmentsPage.submitForm();
    await departmentsPage.expectValidationError();
  });

  test('admin can create a new department with valid data', async ({ departmentsPage }) => {
    const deptName = uniqueName();
    await departmentsPage.goto();
    await departmentsPage.clickCreateDepartmentButton();
    await departmentsPage.fillDepartmentForm(deptName, 'Test description');
    await departmentsPage.submitForm();
    await departmentsPage.expectModalClosed();
    await departmentsPage.expectSuccessMessage('Department created successfully');
    await departmentsPage.expectDepartmentInList(deptName);

    // Cleanup: delete the created department
    await departmentsPage.searchDepartment(deptName);
    await departmentsPage.clickDeleteButton();
    await departmentsPage.expectModalClosed();
  });

  test('admin can edit an existing department', async ({ departmentsPage }) => {
    const originalName = uniqueName();
    const updatedName = `${originalName}-Updated`;

    // Create a department to edit
    await departmentsPage.goto();
    await departmentsPage.clickCreateDepartmentButton();
    await departmentsPage.fillDepartmentForm(originalName, 'Original description');
    await departmentsPage.submitForm();
    await departmentsPage.expectModalClosed();
    await departmentsPage.expectDepartmentInList(originalName);

    // Edit the department
    await departmentsPage.searchDepartment(originalName);
    await departmentsPage.clickEditButton();
    await departmentsPage.fillDepartmentName(updatedName);
    await departmentsPage.submitForm();
    await departmentsPage.expectModalClosed();
    await departmentsPage.expectSuccessMessage('Department updated successfully');
    await departmentsPage.expectDepartmentInList(updatedName);

    // Cleanup: delete the updated department
    await departmentsPage.searchDepartment(updatedName);
    await departmentsPage.clickDeleteButton();
    await departmentsPage.expectModalClosed();
  });

  test('cancel button closes the form without saving', async ({ departmentsPage }) => {
    await departmentsPage.goto();
    await departmentsPage.clickCreateDepartmentButton();
    await departmentsPage.fillDepartmentName('Department For Cancel Test');
    await departmentsPage.clickCancelButton();
    await departmentsPage.expectModalClosed();
    await departmentsPage.expectDepartmentNotInList('Department For Cancel Test');
  });
});
