import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

const NONEXISTENT_EMAIL = 'nonexistent@test.com';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test.describe('Login — valid credentials', { tag: '@smoke' }, () => {
    test('redirects to dashboard and shows welcome message', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      await authPage.expectOnDashboard();
      await authPage.expectWelcomeMessage(personas.patient.displayName);
    });

    test('sidebar shows user full name and role', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      await authPage.expectSidebarUserInfo(personas.patient.displayName + ' Doe', personas.patient.role);
    });
  });

  test.describe('Login — invalid credentials', { tag: '@regression' }, () => {
    test('shows error with wrong password and does not redirect', async ({ authPage }) => {
      await authPage.login(personas.patient.email, 'WrongPassword123!');
      await authPage.expectOnLoginPage();
      await authPage.expectErrorMessage('Invalid email or password');
    });

    test('shows error with non-existent email and does not redirect', async ({ authPage }) => {
      await authPage.login(NONEXISTENT_EMAIL, personas.patient.password);
      await authPage.expectOnLoginPage();
      await authPage.expectErrorMessage('Invalid email or password');
    });

    test('email field retains value after failed attempt', async ({ authPage }) => {
      await authPage.login(personas.patient.email, 'WrongPassword123!');
      await expect(authPage.emailInput).toHaveValue(personas.patient.email);
    });

    test('password field is cleared after failed attempt', async ({ authPage }) => {
      await authPage.login(personas.patient.email, 'WrongPassword123!');
      await expect(authPage.passwordInput).toBeEmpty();
    });
  });

  test.describe('Login — empty fields', { tag: '@regression' }, () => {
    test('shows validation errors on both fields when both are empty', async ({ authPage }) => {
      await authPage.submitButton.click();
      await authPage.expectValidationError('email', 'Invalid email address');
      await authPage.expectValidationError('password', 'Password must be at least 6 characters');
    });

    test('shows password validation error when only email is filled', async ({ authPage }) => {
      await authPage.emailInput.fill(personas.patient.email);
      await authPage.submitButton.click();
      await authPage.expectValidationError('password', 'Password must be at least 6 characters');
    });

    test('shows email validation error when only password is filled', async ({ authPage }) => {
      await authPage.passwordInput.fill('Password123!');
      await authPage.submitButton.click();
      await authPage.expectValidationError('email', 'Invalid email address');
    });
  });

  test.describe('Logout', { tag: '@smoke' }, () => {
    test('clicking logout redirects to login page', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      await authPage.logout();
      await authPage.expectLoggedOut();
    });
  });

  test.describe('Role-based redirect', { tag: '@regression' }, () => {
    test('navigating to dashboard while logged out redirects back to login', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/login/);
    });
  });
});