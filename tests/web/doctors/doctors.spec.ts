import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { DoctorsPage } from '../../../pages/doctors/DoctorsPage';

test.describe('Doctors | Navigation', { tag: ['@doctors', '@smoke'] }, () => {
  test('shows Doctors heading when navigating directly to /doctors', async ({ asPatient }) => {
    await asPatient.goto('/doctors');
    const doctorsPage = new DoctorsPage(asPatient);
    await doctorsPage.expectPageVisible();
  });
});

test.describe('Doctors | Access Control', { tag: ['@doctors', '@regression'] }, () => {
  test('patient does not see Create Doctor button', async ({ asPatient }) => {
    await asPatient.goto('/doctors');
    const doctorsPage = new DoctorsPage(asPatient);
    await doctorsPage.expectPageVisible();
    await doctorsPage.expectCreateDoctorButtonHidden();
  });

  test('admin sees Create Doctor button', async ({ asAdmin }) => {
    await asAdmin.goto('/doctors');
    const doctorsPage = new DoctorsPage(asAdmin);
    await doctorsPage.expectPageVisible();
    await doctorsPage.expectCreateDoctorButtonVisible();
  });
});

test.describe('Doctors | Admin CRUD', { tag: ['@doctors', '@regression'] }, () => {
  test('admin can create a new doctor', async ({ asAdmin }) => {
    await asAdmin.goto('/doctors');
    const doctorsPage = new DoctorsPage(asAdmin);
    await doctorsPage.expectPageVisible();
    await doctorsPage.clickCreateDoctor();
    await doctorsPage.expectModalVisible();
    await doctorsPage.fillDoctorForm({
      firstName: 'John',
      lastName: 'Test',
      email: 'john.test@example.com',
      password: 'Password123!',
      department: 'Cardiology',
      licenseNumber: 'LIC-999999',
      specialization: 'Test Specialist',
    });
    await doctorsPage.submitForm();
    await doctorsPage.expectModalHidden();
    await doctorsPage.expectSuccessNotificationVisible();
    await doctorsPage.expectDoctorInList('Dr. John Test');
  });
});
