import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { BookAppointmentPage } from '../../../pages/book-appointment/BookAppointmentPage';

test.describe('Book Appointment | Sidebar Link and Dashboard CTA', { tag: ['@book-appointment', '@smoke'] }, () => {
  test('sees Book Appointment link in sidebar on dashboard', async ({ asPatient }) => {
    await asPatient.goto('/dashboard');
    const pom = new BookAppointmentPage(asPatient);
    await pom.expectWelcomeHeading(/Welcome back/);
    await pom.expectBookAppointmentSidebarLinkVisible();
    await pom.expectBookAppointmentSidebarLinkPointsToBooking();
  });

  test('sees Book Appointment CTA card on dashboard', async ({ asPatient }) => {
    await asPatient.goto('/dashboard');
    const pom = new BookAppointmentPage(asPatient);
    await pom.expectWelcomeHeading(/Welcome back/);
    await pom.expectBookNowCTAVisible();
    await pom.expectBookNowCTAPointsToBooking();
  });

  test('sidebar link and dashboard CTA point to the same booking URL', async ({ asPatient }) => {
    await asPatient.goto('/dashboard');
    const pom = new BookAppointmentPage(asPatient);
    const sidebarHref = await pom.sidebarBookAppointmentLink.getAttribute('href');
    const ctaHref = await pom.dashboardBookNowCTA.getAttribute('href');
    expect(sidebarHref).toBe(ctaHref);
    await pom.expectBookAppointmentSidebarLinkVisible();
    await pom.expectBookNowCTAVisible();
  });
});