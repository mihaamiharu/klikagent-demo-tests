import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { DashboardPage } from '../../../pages/book-appointment/DashboardPage';

test.describe('Book Appointment | Sidebar link and dashboard CTA visibility', { tag: '@book-appointment' }, () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
  });

  test('BA-1 — User sees Book Appointment link in sidebar and dashboard CTA card', { tag: ['@smoke', '@regression'] }, async ({ dashboardPage }) => {
    await expect(dashboardPage.page).toHaveURL(/\/dashboard/);

    // Verify "Book Appointment" sidebar link is visible
    await dashboardPage.expectBookAppointmentSidebarLinkVisible();

    // Verify "Book Now" CTA card is visible on dashboard
    await dashboardPage.expectBookNowCtaCardVisible();
    await dashboardPage.expectHealthCheckupHeadingVisible();
    await dashboardPage.expectBookNowCtaLinkVisible();
  });
});