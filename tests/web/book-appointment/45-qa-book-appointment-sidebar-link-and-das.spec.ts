import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { DashboardPage } from '../../../pages/book-appointment/DashboardPage';
import { BookAppointmentPage } from '../../../pages/book-appointment/BookAppointmentPage';
import { AdminPage } from '../../../pages/book-appointment/AdminPage';

test.describe('Book Appointment | Dashboard Visibility', { tag: ['@book-appointment', '@smoke'] }, () => {
  test('BA-1: patient sees Book Appointment sidebar link and dashboard CTA', async ({ asPatient }) => {
    // Navigate to dashboard as patient
    await asPatient.goto('/dashboard');
    const dashboardPage = new DashboardPage(asPatient);
    
    // Verify sidebar contains 'Book Appointment' link
    await dashboardPage.expectBookAppointmentSidebarLinkVisible();
    
    // Verify dashboard contains 'Book Now' CTA card
    await dashboardPage.expectBookNowCTAVisible();
    
    // Click sidebar 'Book Appointment' link
    await dashboardPage.clickBookAppointmentSidebarLink();
    
    // Verify navigation to /appointments/book
    await dashboardPage.expectNavigateToBookAppointment();
    
    // Verify booking wizard is visible
    const bookAppointmentPage = new BookAppointmentPage(asPatient);
    await bookAppointmentPage.expectBookAppointmentWizardVisible();
  });

  test('BA-2: admin user cannot access book appointment page and is redirected', async ({ asAdmin }) => {
    // Navigate to /appointments/book with admin persona
    const bookAppointmentPage = new BookAppointmentPage(asAdmin);
    await bookAppointmentPage.gotoBookAppointment();
    
    // Verify redirect occurs to /admin
    await expect(asAdmin).toHaveURL(/\/admin/);
    
    // Verify admin dashboard is visible
    const adminPage = new AdminPage(asAdmin, personas.admin.displayName + ' Dashboard');
    await adminPage.expectAdminDashboardVisible();
    
    // Verify book appointment wizard is NOT visible
    await bookAppointmentPage.expectBookAppointmentWizardNotVisible();
  });
});
