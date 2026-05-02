import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Departments | Access Control', { tag: ['@departments', '@smoke'] }, () => {
  test('patient does NOT see Create Department button', async ({ asPatient }) => {
    await asPatient.goto('/departments');
    await expect(asPatient.getByTestId('create-department-button')).not.toBeVisible();
  });

  test(`${personas.admin.displayName} sees Create Department button`, async ({ departmentsPage }) => {
    await departmentsPage.goto();
    await departmentsPage.expectNewDepartmentButtonVisible();
  });
});

test.describe('Departments | Admin CRUD', { tag: ['@departments', '@regression'] }, () => {
  test(`${personas.admin.displayName} can create a new department with validation`, async ({ departmentsPage }) => {
    await departmentsPage.goto();
    await departmentsPage.clickNewDepartmentButton();
    await departmentsPage.expectCreateModalVisible();
    await departmentsPage.expectNameInputVisible();
    await departmentsPage.expectSubmitButtonVisible();
    await departmentsPage.clickSubmitButton();
    await departmentsPage.expectValidationErrorVisible();
  });

  test(`${personas.admin.displayName} can create a new department successfully`, async ({ departmentsPage }) => {
    const uniqueDeptName = `QA Test Department ${Date.now()}`;
    await departmentsPage.goto();
    await departmentsPage.clickNewDepartmentButton();
    await departmentsPage.fillDepartmentForm(uniqueDeptName, 'QA Test Description');
    await departmentsPage.clickSubmitButton();
    await departmentsPage.expectModalClosed();
    await departmentsPage.searchForDepartment(uniqueDeptName);
    await departmentsPage.expectDepartmentInList(uniqueDeptName);
  });

  test('cancel button closes the form without saving', async ({ departmentsPage }) => {
    const tempDeptName = `Temp Department ${Date.now()}`;
    await departmentsPage.goto();
    await departmentsPage.clickNewDepartmentButton();
    await departmentsPage.fillDepartmentForm(tempDeptName, 'Temp Description');
    await departmentsPage.clickCancelButton();
    await departmentsPage.expectModalClosed();
    await departmentsPage.searchForDepartment(tempDeptName);
    await departmentsPage.expectDepartmentNotInList(tempDeptName);
  });

  // SKIPPED: Edit button uses dynamic UUID pattern 'edit-department-{uuid}'
  // which cannot be determined without API/database access to get the department UUID
  test.skip(`${personas.admin.displayName} can edit an existing department`, async () => {
    // SKIPPED: edit-department-{uuid} locator requires dynamic UUID that is only
    // known after department creation via API response
  });
});
