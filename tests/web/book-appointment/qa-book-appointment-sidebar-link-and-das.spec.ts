import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Book Appointment | Sidebar link and dashboard CTA visibility', { tag: ['@book-appointment', '@smoke'] }, () => {
  test(`${personas.patient.displayName} sees Book Appointment sidebar link on dashboard`, { tag: ['@book-appointment', '@smoke'] }, async ({ dashboardPage }) => {
    await dashboardPage.expectSidebarBookAppointmentLinkVisible();
  });

  test(`${personas.patient.displayName} sees Book Appointment CTA card on dashboard`, { tag: ['@book-appointment', '@smoke'] }, async ({ dashboardPage }) => {
    await dashboardPage.expectCtaCardVisible();
  });

  test('sidebar Book Appointment link navigates to /appointments/book', { tag: ['@book-appointment', '@smoke'] }, async ({ dashboardPage }) => {
    await dashboardPage.clickSidebarBookAppointmentLink();
    await dashboardPage.expectOnBookAppointmentPage();
  });

  test('CTA Book Now link navigates to /appointments/book', { tag: ['@book-appointment', '@smoke'] }, async ({ dashboardPage }) => {
    await dashboardPage.clickCtaBookNowLink();
    await dashboardPage.expectOnBookAppointmentPage();
  });
});