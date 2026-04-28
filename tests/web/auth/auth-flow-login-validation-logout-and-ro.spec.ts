import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { AuthPage } from '../../../pages/auth/AuthPage';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.describe('Login — valid credentials', { tag: '@auth' }, () => {
    test('patient logs in and is redirected to /dashboard with welcome message', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.login(personas.patient.email, personas.patient.password);

      await authPage.expectOnDashboard();
      await authPage.expectWelcomeMessage(`Welcome back, ${personas.patient.name}!`);
      await authPage.expectUserInfo(personas.patient.name, personas.patient.role);
    });
  });

  test.describe('Login — invalid credentials', { tag: '@auth' }, () => {
    test('wrong password shows error and stays on /login', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.login(personas.patient.email, 'wrongpassword');

      await authPage.expectLoginErrorVisible();
      await authPage.expectOnLoginPage();
    });

    test('non-existent email shows error and stays on /login', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.login('nonexistent@example.com', personas.patient.password);

      await authPage.expectLoginErrorVisible();
      await authPage.expectOnLoginPage();
    });

    test('email field retains value after failed attempt', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.login('nonexistent@example.com', 'wrongpassword');

      await authPage.expectEmailFieldValue('nonexistent@example.com');
    });
  });

  test.describe('Login — empty fields', { tag: '@auth' }, () => {
    test('both fields empty shows validation errors on both', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.submitButton.click();

      await authPage.expectEmailError('Invalid email address');
      await authPage.expectPasswordError('Password must be at least 6 characters');
      await authPage.expectOnLoginPage();
    });

    test('only email filled shows password validation error', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.emailInput.fill(personas.patient.email);
      await authPage.submitButton.click();

      await authPage.expectPasswordError('Password must be at least 6 characters');
      await authPage.expectOnLoginPage();
    });

    test('only password filled shows email validation error', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.passwordInput.fill(personas.patient.password);
      await authPage.submitButton.click();

      await authPage.expectEmailError('Invalid email address');
      await authPage.expectOnLoginPage();
    });
  });

  test.describe('Logout', { tag: '@auth' }, () => {
    test('authenticated patient logs out and is redirected to /login', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.login(personas.patient.email, personas.patient.password);
      await authPage.expectOnDashboard();

      await authPage.logout();

      await authPage.expectOnLoginPage();
    });

    test('navigating to /dashboard while logged out redirects to /login', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.gotoDashboard();

      await authPage.expectOnLoginPage();
    });
  });

  test.describe('Role-based redirect', { tag: '@auth' }, () => {
    test('admin is redirected to /admin after login', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.login(personas.admin.email, personas.admin.password);

      await authPage.expectOnAdminPage();
      await authPage.expectAdminDashboardHeading();
      await authPage.expectUserInfo(personas.admin.name, personas.admin.role);
    });

    test('doctor is redirected to /doctor after login', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.login(personas.doctor.email, personas.doctor.password);

      await authPage.expectOnDoctorPage();
      await authPage.expectDoctorDashboardHeading();
      await authPage.expectUserInfo(personas.doctor.name, personas.doctor.role);
    });
  });
});