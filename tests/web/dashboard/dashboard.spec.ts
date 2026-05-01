import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { DashboardPage } from '../../../pages/dashboard/DashboardPage';

test.describe('Dashboard | Visibility', { tag: ['@dashboard', '@smoke'] }, () => {
  test('BA-1: patient sees Book Appointment sidebar link and dashboard CTA', async ({ asPatient }) => {
    await asPatient.goto('/dashboard');
    const dashboardPage = new DashboardPage(asPatient);

    // Verify sidebar Book Appointment link is visible
    await dashboardPage.expectSidebarBookAppointmentLinkVisible();

    // Verify dashboard Book Now CTA is visible
    await dashboardPage.expectDashboardBookNowCtaVisible();

    // Verify both links navigate to /appointments/book
    await dashboardPage.expectSidebarLinkHasHref('/appointments/book');
    await dashboardPage.expectCtaLinkHasHref('/appointments/book');
  });
});

test.describe('Dashboard | Access Control', { tag: ['@dashboard', '@regression'] }, () => {
  test('BA-2: user with admin role is redirected from /appointments/book to their role-based route', async ({ asAdmin }) => {
    await asAdmin.goto('/appointments/book');
    
    // User should be redirected to their role-based route
    await expect(asAdmin).toHaveURL(`/${personas.admin.role}/`);
    
    // Verify dashboard heading is visible (dynamic from personas)
    await expect(asAdmin.getByRole('heading', { name: new RegExp(personas.admin.role, 'i') })).toBeVisible();
  });
});
