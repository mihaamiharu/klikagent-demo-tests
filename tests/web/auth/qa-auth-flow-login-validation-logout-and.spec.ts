import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { AuthPage } from '../../../pages/auth/AuthPage';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.describe('Login — valid credentials', { tag: '@smoke' }, () => {
    test('patient logs in successfully and is redirected to dashboard', async ({ page, authPage }) => {
      await authPage.gotoLogin();

      // Verify login page elements are visible
      await expect(authPage.careSyncHeading).toBeVisible();
      await expect(authPage.signInSubtitle).toBeVisible();
      await expect(authPage.emailInput).toBeVisible();
      await expect(authPage.passwordInput).toBeVisible();
      await expect(authPage.signInButton).toBeVisible();

      // Fill in valid credentials and sign in
      await authPage.login(personas.patient.email, personas.patient.password);

      // Verify redirect to dashboard
      await expect(page).toHaveURL(/\/dashboard/);

      // Verify welcome message with patient's first name (using parameterized locator)
      const welcomeHeading = authPage.getWelcomeHeading(personas.patient.firstName);
      await expect(welcomeHeading).toBeVisible();

      // Verify sidebar shows user's full name and role (using parameterized locators)
      await expect(authPage.getSidebarUserName(personas.patient.fullName)).toBeVisible();
      await expect(authPage.getSidebarUserRole(personas.patient.role)).toBeVisible();
    });
  });

  test.describe('Login — invalid credentials', { tag: '@regression' }, () => {
    test('shows error with wrong password and retains email field', async ({ page, authPage }) => {
      await authPage.gotoLogin();
      await authPage.fillEmail(personas.patient.email);
      await authPage.fillPassword('WrongPassword123!');
      await authPage.clickSignIn();

      // Verify error message is shown
      await expect(authPage.loginError).toBeVisible();
      await expect(authPage.loginError).toContainText('Invalid email or password');

      // Verify no redirect (still on login page)
      await expect(page).toHaveURL(/\/login/);

      // Verify email field retains its value
      await expect(authPage.emailInput).toHaveValue(personas.patient.email);
    });

    test('shows error with non-existent email and retains email field', async ({ page, authPage }) => {
      await authPage.gotoLogin();
      await authPage.fillEmail('nonexistent@example.com');
      await authPage.fillPassword(personas.patient.password);
      await authPage.clickSignIn();

      // Verify error message is shown
      await expect(authPage.loginError).toBeVisible();
      await expect(authPage.loginError).toContainText('Invalid email or password');

      // Verify no redirect (still on login page)
      await expect(page).toHaveURL(/\/login/);

      // Verify email field retains its value
      await expect(authPage.emailInput).toHaveValue('nonexistent@example.com');
    });
  });

  test.describe('Login — empty fields', { tag: '@regression' }, () => {
    test('shows validation errors when both fields are empty', async ({ page, authPage }) => {
      await authPage.gotoLogin();
      await authPage.clickSignIn();

      // Verify both validation errors are shown
      await expect(authPage.emailError).toBeVisible();
      await expect(authPage.emailError).toContainText('Invalid email address');
      await expect(authPage.passwordError).toBeVisible();
      await expect(authPage.passwordError).toContainText('Password must be at least 6 characters');
    });

    test('shows password validation error when only email is filled', async ({ page, authPage }) => {
      await authPage.gotoLogin();
      await authPage.fillEmail(personas.patient.email);
      await authPage.clickSignIn();

      // Verify password validation error is shown
      await expect(authPage.passwordError).toBeVisible();
      await expect(authPage.passwordError).toContainText('Password must be at least 6 characters');
    });

    test('shows email validation error when only password is filled', async ({ page, authPage }) => {
      await authPage.gotoLogin();
      await authPage.fillPassword(personas.patient.password);
      await authPage.clickSignIn();

      // Verify email validation error is shown
      await expect(authPage.emailError).toBeVisible();
      await expect(authPage.emailError).toContainText('Invalid email address');
    });
  });

  test.describe('Logout', { tag: '@smoke' }, () => {
    test('authenticated patient logs out and is redirected to login', async ({ page, authPage }) => {
      // Login first
      await authPage.login(personas.patient.email, personas.patient.password);
      await expect(page).toHaveURL(/\/dashboard/);

      // Click logout button
      await authPage.logout();

      // Verify redirect to login
      await expect(page).toHaveURL(/\/login/);
    });

    test('authenticated admin logs out and is redirected to login', async ({ page, authPage }) => {
      // Login as admin
      await authPage.login(personas.admin.email, personas.admin.password);
      await expect(page).toHaveURL(/\/admin/);

      // Click logout button
      await authPage.logout();

      // Verify redirect to login
      await expect(page).toHaveURL(/\/login/);
    });

    test('authenticated doctor logs out and is redirected to login', async ({ page, authPage }) => {
      // Login as doctor
      await authPage.login(personas.doctor.email, personas.doctor.password);
      await expect(page).toHaveURL(/\/doctor/);

      // Click logout button
      await authPage.logout();

      // Verify redirect to login
      await expect(page).toHaveURL(/\/login/);
    });

    test('unauthenticated access to dashboard redirects to login', async ({ page, authPage }) => {
      await authPage.gotoDashboard();

      // Verify redirect to login
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Role-based redirect', { tag: '@smoke' }, () => {
    test('admin is redirected to /admin after login', async ({ page, authPage }) => {
      await authPage.login(personas.admin.email, personas.admin.password);

      // Verify redirect to admin dashboard
      await expect(page).toHaveURL(/\/admin/);
      await expect(authPage.adminDashboardHeading).toBeVisible();
      await expect(authPage.getSidebarUserName(personas.admin.fullName)).toBeVisible();
      await expect(authPage.getSidebarUserRole(personas.admin.role)).toBeVisible();
    });

    test('doctor is redirected to /doctor after login', async ({ page, authPage }) => {
      await authPage.login(personas.doctor.email, personas.doctor.password);

      // Verify redirect to doctor dashboard
      await expect(page).toHaveURL(/\/doctor/);
      await expect(authPage.getDoctorWelcomeHeading(personas.doctor.fullName)).toContainText(`Welcome, Dr. ${personas.doctor.fullName}`);
      await expect(authPage.getSidebarUserName(personas.doctor.fullName)).toBeVisible();
      await expect(authPage.getSidebarUserRole(personas.doctor.role)).toBeVisible();
    });

    test('patient is redirected to /dashboard after login', async ({ page, authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);

      // Verify redirect to dashboard
      await expect(page).toHaveURL(/\/dashboard/);
      await expect(authPage.getWelcomeHeading(personas.patient.firstName)).toContainText(`Welcome back, ${personas.patient.firstName}!`);
    });
  });
});