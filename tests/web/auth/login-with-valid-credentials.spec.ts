import { test, expect } from '../../../fixtures';
import { AuthPage } from '../../../pages/auth/AuthPage';

test.describe('Authentication | Login', { tag: '@auth' }, () => {
  test('login with valid patient credentials redirects to dashboard', { tag: ['@smoke', '@auth'] }, async ({ page }) => {
    const authPage = new AuthPage(page);

    await authPage.login('jane.doe@caresync.dev', 'Password123!');

    await expect(page).toHaveURL(/dashboard/);
    await authPage.expectOnDashboard();
  });
});