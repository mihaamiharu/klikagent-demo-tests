import { test, expect } from '../../../fixtures';
import { AuthPage } from '../../../pages/auth/AuthPage';

test.describe('Authentication | Login with valid credentials', { tag: '@auth' }, () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.page.goto('/login');
  });

  test('Patient can log in with valid credentials and is redirected to dashboard', { tag: ['@smoke', '@auth'] }, async () => {
    await authPage.login('jane.doe@caresync.dev', 'Password123!');
    await authPage.expectOnDashboard();
    await expect(authPage.page.getByRole('heading', { name: 'Welcome back, Jane!' })).toBeVisible();
    await expect(authPage.page.getByText('patient')).toBeVisible();
  });
});