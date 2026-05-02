import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { DepartmentsPage } from '../../../pages/departments/DepartmentsPage';

test.describe('Departments | Access Control', { tag: ['@departments', '@regression'] }, () => {
  test('patient does NOT see Create Department button', async ({ asPatient }) => {
    await asPatient.goto('/departments');
    await expect(asPatient.getByTestId('create-department-button')).not.toBeVisible();
  });
});

test.describe('Departments | Admin CRUD', { tag: ['@departments', '@regression'] }, () => {
  test('admin can create a new department with all required fields', async ({ departmentsPage }) => {
    await departmentsPage.goto();
    await departmentsPage.expectDepartmentsHeadingVisible();
    await departmentsPage.clickCreateDepartmentButton();
    await departmentsPage.expectCreateModalVisible();
    await departmentsPage.submitForm();
    await departmentsPage.expectValidationError();
  });

  test('admin can create a new department with valid data', async ({ departmentsPage }) => {
    await departmentsPage.goto();
    await departmentsPage.clickCreateDepartmentButton();
    await departmentsPage.fillDepartmentForm('QA Test Department', 'Test description');
    await departmentsPage.submitForm();
    await departmentsPage.expectModalClosed();
    await departmentsPage.expectSuccessMessage('Department created successfully');
    await departmentsPage.expectDepartmentInList('QA Test Department');
  });

  test('admin can edit an existing department', async ({ departmentsPage }) => {
    await departmentsPage.goto();
    await departmentsPage.searchDepartment('QA Test Department');
    await departmentsPage.clickEditButton();
    await departmentsPage.fillDepartmentName('QA Test Department Updated');
    await departmentsPage.submitForm();
    await departmentsPage.expectModalClosed();
    await departmentsPage.expectSuccessMessage('Department updated successfully');
    await departmentsPage.expectDepartmentInList('QA Test Department Updated');
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
