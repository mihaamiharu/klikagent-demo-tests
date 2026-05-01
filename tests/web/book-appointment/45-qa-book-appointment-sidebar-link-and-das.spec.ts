import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { BookAppointmentPage } from '../../pages/book-appointment/BookAppointmentPage';

test.describe('Book Appointment | Dashboard BA-1', { tag: ['@book-appointment', '@smoke'] }, () => {
  test(`${personas.patient.displayName} sees Book Appointment sidebar link and dashboard CTA on dashboard`, async ({ asPatient }) => {
    await asPatient.goto('/dashboard');
    const pom = new BookAppointmentPage(asPatient);
    await pom.expectBothVisible();
  });

  test('sidebar Book Appointment link navigates to booking page', async ({ asPatient }) => {
    await asPatient.goto('/dashboard');
    const pom = new BookAppointmentPage(asPatient);
    await pom.clickSidebarLink();
    await pom.expectNavigationToBookingPage();
  });

  test('dashboard Book Now CTA navigates to booking page', async ({ asPatient }) => {
    await asPatient.goto('/dashboard');
    const pom = new BookAppointmentPage(asPatient);
    await pom.clickBookNowCta();
    await pom.expectNavigationToBookingPage();
  });

  test('sidebar and dashboard CTA links point to same booking URL', async ({ asPatient }) => {
    await asPatient.goto('/dashboard');
    const pom = new BookAppointmentPage(asPatient);
    const sidebarHref = await pom.getSidebarLinkHref();
    const ctaHref = await pom.getBookNowCtaHref();
    expect(sidebarHref).toBe(ctaHref);
    expect(sidebarHref).toContain('/appointments/book');
  });

  test('sidebar Book Appointment link shows as active on booking page', async ({ asPatient }) => {
    await asPatient.goto('/appointments/book');
    const pom = new BookAppointmentPage(asPatient);
    await pom.expectSidebarLinkActive();
  });
});
