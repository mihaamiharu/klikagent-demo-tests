import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { DashboardPage } from '../../../pages/book-appointment/DashboardPage';
import { BookAppointmentPage } from '../../../pages/book-appointment/BookAppointmentPage';

test.describe('Book Appointment | Dashboard Visibility', { tag: ['@book-appointment', '@regression'] }, () => {
  test('BA-1: sees Book Appointment sidebar link on dashboard', async ({ asPatient }) => {
    await asPatient.goto('/dashboard');
    const dashboardPage = new DashboardPage(asPatient);
    await dashboardPage.expectSidebarBookAppointmentLinkVisible();
    const href = await dashboardPage.getSidebarBookAppointmentHref();
    expect(href).toContain('/appointments/book');
  });

  test('BA-1: sees Book Now CTA card on dashboard', async ({ asPatient }) => {
    await asPatient.goto('/dashboard');
    const dashboardPage = new DashboardPage(asPatient);
    await dashboardPage.expectHealthCheckupCtaCardVisible();
    await dashboardPage.expectBookNowCtaVisible();
    const href = await dashboardPage.getBookNowCtaHref();
    expect(href).toContain('/appointments/book');
  });

  test('BA-1: can navigate to booking wizard via sidebar link', async ({ asPatient }) => {
    await asPatient.goto('/dashboard');
    const dashboardPage = new DashboardPage(asPatient);
    await dashboardPage.clickSidebarBookAppointmentLink();
    const bookAppointmentPage = new BookAppointmentPage(asPatient);
    await bookAppointmentPage.expectOnBookAppointmentPage();
  });

  test('BA-1: can navigate to booking wizard via Book Now CTA', async ({ asPatient }) => {
    await asPatient.goto('/dashboard');
    const dashboardPage = new DashboardPage(asPatient);
    await dashboardPage.clickBookNowCta();
    const bookAppointmentPage = new BookAppointmentPage(asPatient);
    await bookAppointmentPage.expectOnBookAppointmentPage();
  });

  test('BA-1: dashboard welcome heading contains display name', async ({ asPatient }) => {
    await asPatient.goto('/dashboard');
    const dashboardPage = new DashboardPage(asPatient);
    await dashboardPage.expectWelcomeHeadingContainsName(personas.patient.displayName);
  });
});

test.describe('Book Appointment | Access Control', { tag: ['@book-appointment', '@regression'] }, () => {
  test(`BA-2: ${personas.admin.role} role is redirected away from /appointments/book`, async ({ asAdmin }) => {
    await asAdmin.goto('/appointments/book');
    const dashboardPage = new DashboardPage(asAdmin);
    const adminDashboardPattern = new RegExp(`/${personas.admin.role}/dashboard/`);
    await dashboardPage.expectDashboardUrl(adminDashboardPattern);
  });

  test(`BA-2: ${personas.admin.role} role cannot see booking wizard`, async ({ asAdmin }) => {
    await asAdmin.goto('/appointments/book');
    const bookAppointmentPage = new BookAppointmentPage(asAdmin);
    await expect(bookAppointmentPage.pageHeading).not.toBeVisible();
  });
});
