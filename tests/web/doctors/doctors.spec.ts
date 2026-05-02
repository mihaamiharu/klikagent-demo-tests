import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { DoctorsPage } from '../../../pages/doctors/DoctorsPage';

test.describe('Doctors | Access Control', { tag: ['@doctors', '@regression'] }, () => {
  test('patient sees Doctors page heading', async ({ asPatient }) => {
    await asPatient.goto('/doctors');
    const doctorsPage = new DoctorsPage(asPatient);
    await doctorsPage.expectPageHeadingVisible();
  });

  test('patient does NOT see Create Doctor button', async ({ asPatient }) => {
    await asPatient.goto('/doctors');
    const doctorsPage = new DoctorsPage(asPatient);
    await doctorsPage.expectPageHeadingVisible();
    await doctorsPage.expectCreateDoctorButtonHidden();
  });
});

test.describe('Doctors | Admin CRUD', { tag: ['@doctors', '@smoke'] }, () => {
  test('admin sees Doctors page with Create Doctor button', async ({ asAdmin }) => {
    await asAdmin.goto('/doctors');
    const doctorsPage = new DoctorsPage(asAdmin);
    await doctorsPage.expectPageHeadingVisible();
    await doctorsPage.expectCreateDoctorButtonVisible();
  });

  test('admin can create a new doctor', async ({ asAdmin }) => {
    await asAdmin.goto('/doctors');
    const doctorsPage = new DoctorsPage(asAdmin);

    // Click Create Doctor button
    await doctorsPage.clickCreateDoctorButton();
    await doctorsPage.expectCreateDoctorFormVisible();

    // Generate unique data using timestamp to avoid duplicates
    const timestamp = Date.now();
    const doctorData = {
      firstName: `TestDoc${timestamp}`,
      lastName: `AutoTest${timestamp}`,
      email: `testdoc${timestamp}@autotest.com`,
      password: 'Password123!',
      department: 'Cardiology',
      license: `LIC-${timestamp}`,
      specialization: 'Cardiology',
    };

    // Fill in the doctor form
    await doctorsPage.fillDoctorForm(doctorData);
    await doctorsPage.submitDoctorForm();

    // Modal should close
    await doctorsPage.expectFormClosed();

    // New doctor should appear in the list
    const fullName = `${doctorData.firstName} ${doctorData.lastName}`;
    await doctorsPage.expectDoctorInList(fullName);
  });
});