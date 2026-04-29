import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { AuthPage } from '../../../pages/auth/AuthPage';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test.describe('Login — valid credentials', { tag: '@smoke' }, () => {
    test('patient is redirected to /dashboard and sees welcome message', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);

      await expect(authPage.page).toHaveURL(/\/dashboard/);
      await authPage.expectWelcomeMessage(personas.patient.displayName.split(' ')[0]);
      await authPage.expectUserProfile(personas.patient.displayName, personas.patient.role);
    });

    test('admin is redirected to /admin', async ({ authPage }) => {
      await authPage.login(personas.admin.email, personas.admin.password);

      await expect(authPage.page).toHaveURL(/\/admin/);
      await authPage.expectOnRolePage('admin');
    });

    test('doctor is redirected to /doctor', async ({ authPage }) => {
      await authPage.login(personas.doctor.email, personas.doctor.password);

      await expect(authPage.page).toHaveURL(/\/doctor/);
      await authPage.expectOnRolePage('doctor');
    });
  });

  test.describe('Login — invalid credentials', { tag: '@regression' }, () => {
    test('shows error with wrong password and no redirect', async ({ authPage }) => {
      await authPage.login(personas.patient.email, 'wrongpassword');
      await authPage.expectErrorVisible();
      await expect(authPage.page).toHaveURL(/\/login/);
    });

    test('shows error with non-existent email and no redirect', async ({ authPage }) => {
      await authPage.login('nonexistent@example.com', personas.patient.password);
      await authPage.expectErrorVisible();
      await expect(authPage.page).toHaveURL(/\/login/);
    });

    test('email field retains value after failed attempt', async ({ authPage }) => {
      await authPage.emailTextbox.fill('some.email@example.com');
      await authPage.passwordTextbox.fill('wrongpassword');
      await authPage.signInButton.click();
      await authPage.expectErrorVisible();
      await expect(authPage.emailTextbox).toHaveValue('some.email@example.com');
    });
  });

  test.describe('Login — empty fields validation', { tag: '@regression' }, () => {
    test('shows validation errors when both fields are empty', async ({ authPage }) => {
      await authPage.signInButton.click();
      await authPage.expectEmailValidationError();
      await authPage.expectPasswordValidationError();
    });

    test('shows password validation error when only email is filled', async ({ authPage }) => {
      await authPage.emailTextbox.fill(personas.patient.email);
      await authPage.signInButton.click();
      await authPage.expectPasswordValidationError();
    });

    test('shows email validation error when only password is filled', async ({ authPage }) => {
      await authPage.passwordTextbox.fill('Password123!');
      await authPage.signInButton.click();
      await authPage.expectEmailValidationError();
    });
  });

  test.describe('Logout', { tag: '@smoke' }, () => {
    test('patient can logout and is redirected to /login', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      await expect(authPage.page).toHaveURL(/\/dashboard/);
      await authPage.logout();
      await authPage.expectLoggedOut();
    });

    test('admin can logout and is redirected to /login', async ({ authPage }) => {
      await authPage.login(personas.admin.email, personas.admin.password);
      await expect(authPage.page).toHaveURL(/\/admin/);
      await authPage.logout();
      await authPage.expectLoggedOut();
    });
  });

  test.describe('Protected route access', { tag: '@regression' }, () => {
    test('redirects to /login when navigating to /dashboard while logged out', async ({ authPage }) => {
      // Navigate to logout to ensure we're logged out
      await authPage.page.goto('/logout');
      // Try to access dashboard
      await authPage.page.goto('/dashboard');
      await authPage.expectOnLoginPage();
    });
  });
});