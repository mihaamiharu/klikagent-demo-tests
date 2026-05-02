import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { DoctorsPage } from '../../../pages/doctors/DoctorsPage';

// Helper to generate unique doctor data
function generateDoctorData() {
  const timestamp = Date.now();
  return {
    firstName: `DrFirst${timestamp}`,
    lastName: `DrLast${timestamp}`,
    email: `dr.test${timestamp}@example.com`,
    password: personas.admin.password,
    department: 'General Medicine',
    specialization: 'General Practice',
    license: `LIC-${timestamp}`,
  };
}

test.describe('Doctors | Access Control', { tag: ['@doctors', '@smoke'] }, () => {
  test('patient does not see Create Doctor button', async ({ doctorsPageAsPatient }) => {
    await doctorsPageAsPatient.goto();
    await doctorsPageAsPatient.expectCreateDoctorButtonNotVisible();
  });
});

test.describe('Doctors | Admin Flow', { tag: ['@doctors', '@regression'] }, () => {
  test('admin can create a new doctor', async ({ doctorsPage }) => {
    const doctorData = generateDoctorData();

    await doctorsPage.goto();
    await doctorsPage.expectCreateDoctorButtonVisible();

    await doctorsPage.clickCreateDoctorButton();
    await doctorsPage.fillDoctorForm(doctorData);
    await doctorsPage.submitDoctorForm();

    await doctorsPage.expectModalClosed();
    await doctorsPage.expectDoctorInList(`${doctorData.firstName} ${doctorData.lastName}`);
    await doctorsPage.expectSuccessNotification();
  });
});
