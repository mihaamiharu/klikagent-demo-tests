import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { bookAppointmentPage } from '../../../fixtures/bookAppointmentPage';

const testCases = [
  { persona: personas.patient },
  { persona: personas.doctor },
  { persona: personas.admin },
];

test.describe('Book Appointment | Sidebar Link and Dashboard CTA Visibility', { tag: ['@book-appointment', '@smoke'] }, () => {
  test.each(testCases)('$persona.name sees Book Appointment sidebar link on dashboard', async ({ page, bookAppointmentPage }) => {
    await page.goto('/dashboard');
    await bookAppointmentPage.expectSidebarLinkVisible();
  });

  test.each(testCases)('$persona.name sees Book Now CTA card on dashboard', async ({ page, bookAppointmentPage }) => {
    await page.goto('/dashboard');
    await bookAppointmentPage.expectBookNowCtaVisible();
    await bookAppointmentPage.expectHealthCheckupHeadingVisible();
  });

  test.each(testCases)('$persona.name sidebar Book Appointment link navigates to correct page', async ({ page, bookAppointmentPage }) => {
    await page.goto('/dashboard');
    const sidebarHref = await bookAppointmentPage.getSidebarLinkHref();
    expect(sidebarHref).toMatch(/appointments\/book/);
    await bookAppointmentPage.clickSidebarLink();
    await expect(page).toHaveURL(/appointments\/book/);
  });

  test.each(testCases)('$persona.name Book Now CTA navigates to booking page', async ({ page, bookAppointmentPage }) => {
    await page.goto('/dashboard');
    const ctaHref = await bookAppointmentPage.getBookNowCtaHref();
    expect(ctaHref).toMatch(/appointments\/book/);
    await bookAppointmentPage.clickBookNowCta();
    await expect(page).toHaveURL(/appointments\/book/);
    await bookAppointmentPage.expectBookAppointmentHeadingVisible();
  });
});