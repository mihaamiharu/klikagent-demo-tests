import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { DoctorsPage } from '../../../pages/doctors/DoctorsPage';

test.describe('Doctors | Navigation', { tag: ['@doctors', '@smoke'] }, () => {
  test('navigate to /doctors shows Doctors heading', async ({ asAdmin }) => {
    const doctorsPage = new DoctorsPage(asAdmin);
    await doctorsPage.gotoDoctors();
    await doctorsPage.expectDoctorsHeadingVisible();
  });
});

test.describe('Doctors | Access Control', { tag: ['@doctors', '@regression'] }, () => {
  test('patient does NOT see Create Doctor button', async ({ asPatient }) => {
    const doctorsPage = new DoctorsPage(asPatient);
    await doctorsPage.gotoDoctors();
    await doctorsPage.expectDoctorsHeadingVisible();
    await doctorsPage.expectCreateDoctorButtonHidden();
  });
});

test.describe('Doctors | Admin CRUD', { tag: ['@doctors', '@regression'] }, () => {
  test('admin can create a new doctor', async ({ asAdmin }) => {
    const doctorsPage = new DoctorsPage(asAdmin);
    await doctorsPage.gotoDoctors();
    await doctorsPage.expectDoctorsHeadingVisible();

    // Click Create Doctor button
    await doctorsPage.clickCreateDoctorButton();
    await doctorsPage.expectDoctorFormModalVisible();

    // Generate unique data
    const timestamp = Date.now();
    const firstName = `Dr${timestamp}`;
    const lastName = `Test${timestamp}`;
    const email = `dr.test${timestamp}@example.com`;
    const license = `LIC-${timestamp}`;
    const department = 'Cardiology';
    const specialization = 'Cardiologist';

    // Fill the form
    await doctorsPage.fillDoctorForm({
      firstName,
      lastName,
      email,
      password: personas.admin.password,
      department,
      specialization,
      license,
    });

    // Submit the form
    await doctorsPage.clickDoctorFormSubmit();

    // Verify modal closes
    await doctorsPage.waitForModalClosed();

    // Verify the new doctor appears in the list
    await doctorsPage.expectDoctorInList(firstName);
  });
});
