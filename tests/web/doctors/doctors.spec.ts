import { test, expect } from '../../../fixtures';
import { DoctorsPage } from '../../../pages/doctors/DoctorsPage';

test.describe('Doctors | Navigation', { tag: ['@doctors', '@smoke'] }, () => {
  test('authenticated user sees doctors page heading', async ({ asPatient }) => {
    await asPatient.goto('/doctors');
    const doctorsPage = new DoctorsPage(asPatient);
    await doctorsPage.expectDoctorsHeadingVisible();
  });
});

test.describe('Doctors | Access Control', { tag: ['@doctors', '@regression'] }, () => {
  test('patient does NOT see Create Doctor button', async ({ asPatient }) => {
    await asPatient.goto('/doctors');
    const doctorsPage = new DoctorsPage(asPatient);
    await doctorsPage.expectDoctorsHeadingVisible();
    await doctorsPage.expectCreateDoctorButtonNotVisible();
  });
});

test.describe('Doctors | Admin CRUD', { tag: ['@doctors', '@regression'] }, () => {
  test('admin sees Create Doctor button', async ({ asAdmin }) => {
    await asAdmin.goto('/doctors');
    const doctorsPage = new DoctorsPage(asAdmin);
    await doctorsPage.expectDoctorsHeadingVisible();
    await doctorsPage.expectCreateDoctorButtonVisible();
  });

  test('admin can create a new doctor', async ({ asAdmin }) => {
    await asAdmin.goto('/doctors');
    const doctorsPage = new DoctorsPage(asAdmin);

    // Generate unique data to avoid duplicates
    const doctorData = doctorsPage.generateUniqueDoctorData();
    const fullName = `${doctorData.firstName} ${doctorData.lastName}`;

    // Click Create Doctor button
    await doctorsPage.clickCreateDoctorButton();

    // Fill the form
    await doctorsPage.fillDoctorForm(doctorData);

    // Submit the form
    await doctorsPage.submitDoctorForm();

    // Verify modal closes
    await doctorsPage.expectFormNotVisible();

    // Verify the doctor appears in the list
    await doctorsPage.expectDoctorInList(fullName);
  });

  test('admin can cancel doctor creation', async ({ asAdmin }) => {
    await asAdmin.goto('/doctors');
    const doctorsPage = new DoctorsPage(asAdmin);

    // Generate unique data
    const doctorData = doctorsPage.generateUniqueDoctorData();

    // Click Create Doctor button
    await doctorsPage.clickCreateDoctorButton();

    // Verify form is visible
    await doctorsPage.expectFormVisible();

    // Fill partial form
    await doctorsPage.firstNameInput.fill(doctorData.firstName);
    await doctorsPage.lastNameInput.fill(doctorData.lastName);

    // Cancel the form
    await doctorsPage.cancelDoctorForm();

    // Verify modal closes
    await doctorsPage.expectFormNotVisible();
  });
});
