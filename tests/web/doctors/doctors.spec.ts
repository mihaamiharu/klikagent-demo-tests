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
    // Generate unique identifiers to avoid conflicts with existing data
    const uniqueId = Date.now();
    const doctorFirstName = `John${uniqueId}`;
    const doctorLastName = `Test${uniqueId}`;
    const doctorEmail = `john.test.${uniqueId}@example.com`;
    const licenseNumber = `LIC-${uniqueId}`;

    await asAdmin.goto('/doctors');
    const doctorsPage = new DoctorsPage(asAdmin);
    await doctorsPage.expectPageVisible();
    await doctorsPage.clickCreateDoctor();
    await doctorsPage.expectModalVisible();
    await doctorsPage.fillDoctorForm({
      firstName: doctorFirstName,
      lastName: doctorLastName,
      email: doctorEmail,
      password: 'Password123!',
      department: 'Cardiology',
      licenseNumber: licenseNumber,
      specialization: 'Test Specialist',
    });
    await doctorsPage.submitForm();
    await doctorsPage.expectModalHidden();
    await doctorsPage.expectSuccessNotificationVisible();
    await doctorsPage.expectDoctorInList(`Dr. ${doctorFirstName} ${doctorLastName}`);
  });
});
