import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { DashboardPage } from '../../../pages/dashboard/DashboardPage';

test.describe(`Dashboard | Visibility`, { tag: ['@dashboard', '@smoke'] }, () => {
  test('BA-1: user with booking access sees Book Appointment sidebar link and dashboard CTA', async ({ asPersona }) => {
    const userPage = asPersona(personas.patient.role);
    await userPage.goto('/dashboard');
    const dashboardPage = new DashboardPage(userPage);

    // Verify user is on the dashboard
    await dashboardPage.expectOnDashboard();

    // Verify Book Appointment sidebar link is visible
    await dashboardPage.expectSidebarLinkVisible();

    // Verify Book Now CTA card is visible on dashboard
    await dashboardPage.expectBookNowCtaVisible();

    // Verify both link to /appointments/book
    await expect(dashboardPage.getSidebarLinkHref()).resolves.toMatch(/\/appointments\/book/);
    await expect(dashboardPage.getBookNowCtaHref()).resolves.toMatch(/\/appointments\/book/);
  });
});

test.describe('Dashboard | Access Control', { tag: ['@dashboard', '@regression'] }, () => {
  test('BA-2: restricted role is redirected from /appointments/book to default route', async ({ asPersona }) => {
    const restrictedPersonaKey = 'nonexistent@example.com';
    const restrictedPage = asPersona(restrictedPersonaKey);
    await restrictedPage.goto('/appointments/book');

    // restricted role should be redirected due to role-based access control
    await expect(restrictedPage).toHaveURL(/\/admin/);
  });
});
