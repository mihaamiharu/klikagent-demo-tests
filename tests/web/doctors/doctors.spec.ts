import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Doctors | Navigation', { tag: ['@doctors', '@smoke'] }, () => {
  test('navigate to /doctors shows Doctors heading', async ({ doctorsPage }) => {
    await doctorsPage.goto();
    await doctorsPage.expectDoctorsPageVisible();
  });
});

test.describe('Doctors | Access Control', { tag: ['@doctors', '@regression'] }, () => {
  test('patient does NOT see Create Doctor button', async ({ asPatient }) => {
    await asPatient.goto('/doctors');
    await expect(asPatient.getByRole('heading', { name: 'Doctors' })).toBeVisible();
    await expect(asPatient.getByTestId('create-doctor-button')).not.toBeVisible();
  });
});

test.describe('Doctors | Admin CRUD', { tag: ['@doctors', '@regression'] }, () => {
  test('admin can create a new doctor', async ({ doctorsPage }) => {
    await doctorsPage.goto();
    await doctorsPage.expectDoctorsPageVisible();
    await doctorsPage.expectCreateDoctorButtonVisible();

    // Generate random doctor data for uniqueness
    const timestamp = Date.now();
    const doctorData = {
      firstName: `QADoctorFirst${timestamp}`,
      lastName: `QADoctorLast${timestamp}`,
      email: `qa.doctor.${timestamp}@test.com`,
      password: personas.admin.password,
      department: 'Cardiology',
      specialization: 'Cardiologist',
      license: `LIC-${timestamp}`,
    };

    await doctorsPage.clickCreateDoctorButton();
    await doctorsPage.fillDoctorForm(doctorData);
    await doctorsPage.submitDoctorForm();

    // Verify modal closed and doctor appears in list
    await doctorsPage.expectModalClosed();
    await doctorsPage.expectDoctorInList(`${doctorData.firstName} ${doctorData.lastName}`);
  });
});
