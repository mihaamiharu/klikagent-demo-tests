import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

/**
 * Book Appointment feature tests
 * BA-1: Patient sees Book Appointment link in sidebar and dashboard CTA
 */
test.describe('Book Appointment | BA-1 Dashboard visibility', { tag: ['@book-appointment', '@smoke'] }, () => {
  const patient = personas.patient;

  test.beforeEach(async ({ authPage }) => {
    // Login as patient before each test
    await authPage.login(patient.email, patient.password);
  });

  test(`${patient.name} sees Book Appointment sidebar link on dashboard`, async ({ bookAppointmentPage }) => {
    // Verify the Book Appointment sidebar link is visible
    await bookAppointmentPage.expectBookAppointmentSidebarLinkVisible();
    
    // Verify we are on the dashboard
    await bookAppointmentPage.expectOnDashboard();
  });

  test(`${patient.name} sees Book Now CTA card on dashboard`, async ({ bookAppointmentPage }) => {
    // Verify the Book Now CTA link is visible on the dashboard
    await bookAppointmentPage.expectBookNowCtaVisible();
    
    // Verify we are on the dashboard
    await bookAppointmentPage.expectOnDashboard();
  });

  test(`${patient.name} can navigate to booking page via sidebar link`, async ({ bookAppointmentPage }) => {
    // Click the Book Appointment sidebar link
    await bookAppointmentPage.clickBookAppointmentSidebarLink();
    
    // Verify navigation to the booking page
    await bookAppointmentPage.expectNavigatedToBookingPage();
  });

  test(`${patient.name} can navigate to booking page via dashboard CTA`, async ({ bookAppointmentPage }) => {
    // Click the Book Now CTA link
    await bookAppointmentPage.clickBookNowCta();
    
    // Verify navigation to the booking page
    await bookAppointmentPage.expectNavigatedToBookingPage();
  });

  test(`${patient.name} has both booking entry points visible simultaneously`, async ({ bookAppointmentPage }) => {
    // Both the sidebar link and dashboard CTA should be visible at the same time
    await expect(bookAppointmentPage.bookAppointmentSidebarLink).toBeVisible();
    await expect(bookAppointmentPage.bookNowCtaLink).toBeVisible();
  });
});