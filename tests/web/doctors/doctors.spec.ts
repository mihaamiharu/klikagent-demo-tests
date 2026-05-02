import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { DoctorsPage } from '../../../pages/doctors/DoctorsPage';

test.describe('Doctors | Navigation', { tag: ['@doctors', '@smoke'] }, () => {
  test('patient sees Doctors heading when navigating to /doctors', async ({ asPatient }) => {
    await asPatient.goto('/doctors');
    const pom = new DoctorsPage(asPatient);
    await pom.expectDoctorsHeadingVisible();
  });

  test('doctor sees Doctors heading when navigating to /doctors', async ({ asDoctor }) => {
    await asDoctor.goto('/doctors');
    const pom = new DoctorsPage(asDoctor);
    await pom.expectDoctorsHeadingVisible();
  });

  test('admin sees Doctors heading when navigating to /doctors', async ({ asAdmin }) => {
    await asAdmin.goto('/doctors');
    const pom = new DoctorsPage(asAdmin);
    await pom.expectDoctorsHeadingVisible();
  });
});

test.describe('Doctors | Access Control', { tag: ['@doctors', '@regression'] }, () => {
  test('patient does NOT see Create Doctor button', async ({ asPatient }) => {
    await asPatient.goto('/doctors');
    const pom = new DoctorsPage(asPatient);
    await pom.expectCreateDoctorButtonHidden();
  });

  test('doctor does NOT see Create Doctor button', async ({ asDoctor }) => {
    await asDoctor.goto('/doctors');
    const pom = new DoctorsPage(asDoctor);
    await pom.expectCreateDoctorButtonHidden();
  });

  test('admin sees Create Doctor button', async ({ asAdmin }) => {
    await asAdmin.goto('/doctors');
    const pom = new DoctorsPage(asAdmin);
    await pom.expectCreateDoctorButtonVisible();
  });
});

test.describe('Doctors | Admin CRUD', { tag: ['@doctors', '@regression'] }, () => {
  test('admin can create a new doctor', async ({ asAdmin }) => {
    await asAdmin.goto('/doctors');
    const pom = new DoctorsPage(asAdmin);

    // Generate randomized data for uniqueness
    const timestamp = Date.now();
    const firstName = `TestDr${timestamp}`;
    const lastName = `User${timestamp}`;
    const email = `dr.test${timestamp}@test.com`;
    const password = 'Password123!';
    const department = 'General Medicine';
    const specialization = 'General Practice';
    const license = `LIC${timestamp}`;

    // Open create modal
    await pom.clickCreateDoctorButton();
    await pom.expectCreateDoctorButtonVisible();

    // Fill the form
    await pom.fillDoctorForm({
      firstName,
      lastName,
      email,
      password,
      department,
      specialization,
      license,
    });

    // Submit
    await pom.submitDoctorForm();

    // Verify modal closes and doctor appears in list
    await pom.expectModalClosed();
    await pom.expectDoctorInList(firstName, lastName);
  });
});
