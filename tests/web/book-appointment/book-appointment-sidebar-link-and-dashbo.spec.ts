import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Book Appointment | Sidebar and Dashboard CTA Visibility', { tag: '@book-appointment' }, () => {
  test.beforeEach(async ({ authPage, testData }) => {
    await authPage.login(testData.persona.email, testData.persona.password);
  });

  test('sees Book Appointment sidebar link and dashboard CTA on dashboard', { tag: ['@smoke', '@regression'] }, async ({ bookAppointmentPage }) => {
    await expect(bookAppointmentPage.page).toHaveURL(/\/dashboard/);
    
    await bookAppointmentPage.expectSidebarLinkVisible();
    
    await bookAppointmentPage.expectDashboardCtaVisible();
  });

  test('Sidebar Book Appointment link navigates to /appointments/book', { tag: '@regression' }, async ({ bookAppointmentPage }) => {
    await bookAppointmentPage.clickSidebarLink();
    await bookAppointmentPage.expectNavigatedToBookAppointment();
  });

  test('Dashboard Book Now CTA navigates to /appointments/book', { tag: '@regression' }, async ({ bookAppointmentPage }) => {
    await bookAppointmentPage.clickDashboardCta();
    await bookAppointmentPage.expectNavigatedToBookAppointment();
  });
});