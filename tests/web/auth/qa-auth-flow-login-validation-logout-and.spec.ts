import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: ['@auth', '@smoke', '@regression'] }, () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.navigateToLogin();
  });

  test.describe('Login — valid credentials', { tag: '@smoke' }, () => {
    test('patient is redirected to /dashboard with welcome message and sidebar info', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      await expect(authPage.page).toHaveURL(/\/dashboard/);
      await expect(authPage.getPatientWelcomeHeading(personas.patient.displayName)).toBeVisible();
      await expect(authPage.userDisplayNameLocator(personas.patient.displayName)).toBeVisible();
      await expect(authPage.userRoleLocator(personas.patient.role)).toBeVisible();
    });

    test('doctor is redirected to /doctor with welcome message and sidebar info', async ({ authPage }) => {
      await authPage.login(personas.doctor.email, personas.doctor.password);
      await expect(authPage.page).toHaveURL(/\/doctor/);
      await expect(authPage.getDoctorWelcomeHeading(personas.doctor.displayName)).toBeVisible();
      await expect(authPage.userDisplayNameLocator(personas.doctor.displayName)).toBeVisible();
      await expect(authPage.userRoleLocator(personas.doctor.role)).toBeVisible();
    });

    test('admin is redirected to /admin with welcome message and sidebar info', async ({ authPage }) => {
      await authPage.login(personas.admin.email, personas.admin.password);
      await expect(authPage.page).toHaveURL(/\/admin/);
      await expect(authPage.getAdminDashboardHeading()).toBeVisible();
      await expect(authPage.userDisplayNameLocator(personas.admin.displayName)).toBeVisible();
      await expect(authPage.userRoleLocator(personas.admin.role)).toBeVisible();
    });
  });

  test.describe('Login — invalid credentials', { tag: '@regression' }, () => {
    test('wrong password shows error and retains email value', async ({ authPage }) => {
      await authPage.emailInput.fill(personas.patient.email);
      await authPage.passwordInput.fill('wrongpassword');
      await authPage.loginSubmit.click();
      await authPage.expectLoginError();
      await expect(authPage.page).toHaveURL(/\/login/);
      await expect(authPage.emailInput).toHaveValue(personas.patient.email);
    });

    test('non-existent email shows error and retains email value', async ({ authPage }) => {
      await authPage.emailInput.fill('nonexistent@example.com');
      await authPage.passwordInput.fill('wrongpassword');
      await authPage.loginSubmit.click();
      await authPage.expectLoginError();
      await expect(authPage.page).toHaveURL(/\/login/);
      await expect(authPage.emailInput).toHaveValue('nonexistent@example.com');
    });
  });

  test.describe('Login — empty fields validation', { tag: '@regression' }, () => {
    test('both fields empty shows both validation errors', async ({ authPage }) => {
      await authPage.loginSubmit.click();
      await authPage.expectBothValidationErrors();
      await expect(authPage.page).toHaveURL(/\/login/);
    });

    test('only email filled shows password validation error', async ({ authPage }) => {
      await authPage.emailInput.fill('test@test.com');
      await authPage.loginSubmit.click();
      await authPage.expectPasswordValidationError();
      await authPage.expectNoEmailValidationError();
      await expect(authPage.page).toHaveURL(/\/login/);
    });

    test('only password filled shows email validation error', async ({ authPage }) => {
      await authPage.passwordInput.fill('test');
      await authPage.loginSubmit.click();
      await authPage.expectEmailValidationError();
      await authPage.expectPasswordValidationError();
      await expect(authPage.page).toHaveURL(/\/login/);
    });
  });

  test.describe('Logout', { tag: '@smoke' }, () => {
    test('authenticated patient logs out and is redirected to /login', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      await expect(authPage.page).toHaveURL(/\/dashboard/);
      await authPage.logout();
      await authPage.expectLoggedOut();
    });

    test('unauthenticated access to /dashboard redirects to /login', async ({ authPage }) => {
      await authPage.page.goto('/dashboard');
      await authPage.expectUnauthenticatedRedirect();
    });
  });

  test.describe('Role-based redirect', { tag: '@smoke' }, () => {
    test('patient goes to /dashboard after login', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      await expect(authPage.page).toHaveURL(/\/dashboard/);
    });

    test('doctor goes to /doctor after login', async ({ authPage }) => {
      await authPage.login(personas.doctor.email, personas.doctor.password);
      await expect(authPage.page).toHaveURL(/\/doctor/);
    });

    test('admin goes to /admin after login', async ({ authPage }) => {
      await authPage.login(personas.admin.email, personas.admin.password);
      await expect(authPage.page).toHaveURL(/\/admin/);
    });
  });
});