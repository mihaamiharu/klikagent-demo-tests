import { test, expect } from '../../../fixtures';
import { AuthPage } from '../../../pages/auth/AuthPage';

test.describe('Authentication | Login flow', { tag: '@auth' }, () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
  });

  test('patient can log in with valid credentials and be redirected to dashboard', { tag: ['@smoke', '@auth'] }, async ({}) => {
    // Navigate to login page
    await authPage.goto();

    // Fill in login credentials
    await authPage.fillEmail('jane.doe@caresync.dev');
    await authPage.fillPassword('Password123!');

    // Click sign in button
    await authPage.clickLogin();

    // Verify redirect to dashboard
    await authPage.expectOnDashboard();

    // Verify welcome message appears
    await expect(authPage.welcomeHeading).toBeVisible();
  });
});