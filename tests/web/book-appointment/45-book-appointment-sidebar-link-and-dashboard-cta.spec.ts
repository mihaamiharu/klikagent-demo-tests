import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { BookAppointmentPage } from '../../pages/book-appointment/BookAppointmentPage';

test.describe('Book Appointment | Sidebar Link and Dashboard CTA', { tag: ['@book-appointment', '@smoke'] }, () => {
  test('sees Book Appointment sidebar link and dashboard CTA on dashboard', async ({ asPersona }) => {
    const currentPersona = personas.patient;
    await asPersona.goto('/dashboard');
    const pom = new BookAppointmentPage(asPersona);
    
    // Verify sidebar link is visible
    await pom.expectSidebarLinkVisible();
    
    // Verify dashboard CTA card is visible with heading and link
    await pom.expectDashboardCTAVisible();
  });

  test('can navigate to book appointment page via sidebar link', async ({ asPersona }) => {
    await asPersona.goto('/dashboard');
    const pom = new BookAppointmentPage(asPersona);
    
    await pom.clickSidebarLink();
    await pom.expectOnBookAppointmentPage();
  });

  test('can navigate to book appointment page via dashboard CTA', async ({ asPersona }) => {
    await asPersona.goto('/dashboard');
    const pom = new BookAppointmentPage(asPersona);
    
    await pom.clickCTALink();
    await pom.expectOnBookAppointmentPage();
  });
});