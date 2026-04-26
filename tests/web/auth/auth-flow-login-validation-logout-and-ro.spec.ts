import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test.describe('Login — valid credentials', { tag: '@smoke' }, () => {
    test('redirects to dashboard after successful login', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      await authPage.expectLoginSuccess();
    });

    test('shows welcome message with user first name', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      await authPage.expectWelcomeHeading('Welcome back, Jane!');
    });

    test('sidebar shows user full name and role', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      await authPage.expectSidebarUserInfo('Jane Doe', 'patient');
    });
  });

  test.describe('Login — invalid credentials', { tag: '@regression' }, () => {
    test('shows error and no redirect on wrong password', async ({ authPage }) => {
      await authPage.login(personas.patient.email, 'wrongpassword');
      await authPage.expectErrorMessage('Invalid email or password');
      await authPage.expectOnLoginPage();
    });

    test('shows error and no redirect on non-existent email', async ({ authPage }) => {
      await authPage.login(personas.nonExistent.email, personas.patient.password);
      await authPage.expectErrorMessage('Invalid email or password');
      await authPage.expectOnLoginPage();
    });

    test('email field retains value after failed attempt', async ({ authPage }) => {
      await authPage.login(personas.patient.email, 'wrongpassword');
      await authPage.expectEmailRetained(personas.patient.email);
    });

    test('password field is cleared after failed attempt', async ({ authPage }) => {
      await authPage.login(personas.patient.email, 'wrongpassword');
      await authPage.expectPasswordCleared();
    });
  });

  test.describe('Login — empty fields', { tag: '@regression' }, () => {
    test('shows validation errors on both fields when both are empty', async ({ authPage }) => {
      await authPage.submitForm();
      await authPage.expectEmailValidationError();
      await authPage.expectPasswordValidationError();
    });

    test('shows password validation error when only email is filled', async ({ authPage }) => {
      await authPage.fillEmailField(personas.patient.email);
      await authPage.submitForm();
      await authPage.expectPasswordValidationError();
    });

    test('shows email validation error when only password is filled', async ({ authPage }) => {
      await authPage.fillPasswordField('Password123!');
      await authPage.submitForm();
      await authPage.expectEmailValidationError();
    });
  });

  test.describe('Logout', { tag: '@smoke' }, () => {
    test('redirects to /login after logout', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      await authPage.logout();
      await authPage.expectOnLoginPage();
    });

    test('navigating to dashboard while logged out redirects to login', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/login/);
    });
  });

  test.describe('Role-based redirect', { tag: '@regression' }, () => {
    test('patient redirected to dashboard after login', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      await authPage.expectLoginSuccess();
    });

    test('doctor redirected to dashboard after login', async ({ authPage }) => {
      await authPage.login(personas.doctor.email, personas.doctor.password);
      await authPage.expectLoginSuccess();
    });

    test('admin redirected to dashboard after login', async ({ authPage }) => {
      await authPage.login(personas.admin.email, personas.admin.password);
      await authPage.expectLoginSuccess();
    });
  });
});
