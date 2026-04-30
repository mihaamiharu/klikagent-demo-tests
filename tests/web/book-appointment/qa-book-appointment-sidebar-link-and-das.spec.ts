import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { DashboardPage } from '../../pages/book-appointment/DashboardPage';

test.describe('Book Appointment | Sidebar Link and Dashboard CTA', { tag: ['@book-appointment', '@regression'] }, () => {
  test(`${personas.patient.displayName} sees Book Appointment sidebar link and dashboard CTA`, async ({ asPatient }) => {
    await asPatient.goto('/dashboard');
    const dashboardPage = new DashboardPage(asPatient);

    // Verify dashboard loaded
    await dashboardPage.expectDashboardLoaded();

    // AC: Book Appointment sidebar link is visible
    await dashboardPage.expectSidebarLinkVisible();

    // AC: Book Appointment CTA card on dashboard is visible
    await dashboardPage.expectCtaCardVisible();

    // Verify both links navigate to the correct path
    const sidebarHref = await dashboardPage.getSidebarLinkHref();
    expect(sidebarHref).toBe('/appointments/book');

    const bookNowHref = await dashboardPage.getBookNowLinkHref();
    expect(bookNowHref).toBe('/appointments/book');
  });
});