import { test, expect } from '../../../fixtures';
import { AuthPage } from '../../../pages/auth/AuthPage';

test.describe('Authentication | Patient Login', { tag: '@auth' }, () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
  });

  test('patient can login with valid credentials and is redirected to dashboard', { tag: ['@smoke', '@auth'] }, async ({ page }) => {
    // Arrange
    const validEmail = 'jane.doe@caresync.dev';
    const validPassword = 'Password123!';

    // Act
    await authPage.login(validEmail, validPassword);

    // Assert
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByRole('heading', { name: 'Welcome back, Jane!' })).toBeVisible();
  });

  test('user name appears in sidebar after login', { tag: ['@smoke', '@auth'] }, async ({ page }) => {
    // Arrange
    const validEmail = 'jane.doe@caresync.dev';
    const validPassword = 'Password123!';

    // Act
    await authPage.login(validEmail, validPassword);

    // Assert
    await expect(page.getByText('Jane Doe')).toBeVisible();
    await expect(page.getByText('patient')).toBeVisible();
  });
});