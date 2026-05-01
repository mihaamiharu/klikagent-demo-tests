import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { BookAppointmentPage } from '../../../pages/book-appointment/BookAppointmentPage';

test.describe('Book Appointment | Dashboard Visibility', { tag: ['@book-appointment', '@smoke'] }, () => {
  test(`BA-1: ${personas.patient.role} sees Book Appointment sidebar link on dashboard`, async ({ asPatient }) => {
    await asPatient.goto('/dashboard');
    const pom = new BookAppointmentPage(asPatient);
    await pom.expectSidebarLinkVisible();
    const href = await pom.getSidebarHref();
    expect(href).toContain('/appointments/book');
  });

  test(`BA-1: ${personas.patient.role} sees Book Appointment CTA card on dashboard`, async ({ asPatient }) => {
    await asPatient.goto('/dashboard');
    const pom = new BookAppointmentPage(asPatient);
    await pom.expectCtaVisible();
    const pomCta = new BookAppointmentPage(asPatient);
    await pomCta.expectCtaVisible();
    const href = await pomCta.getCtaHref();
    expect(href).toContain('/appointments/book');
  });

  test(`BA-2: Redirect from /appointments/book to /admin`, async ({ asAdmin }) => {
    await asAdmin.goto('/appointments/book');
    await expect(asAdmin).toHaveURL('/admin');
  });
});
