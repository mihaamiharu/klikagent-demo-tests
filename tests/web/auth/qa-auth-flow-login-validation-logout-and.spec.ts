import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.describe('Login — valid credentials', { tag: '@smoke' }, () => {
    test('patient logs in successfully and sees dashboard', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.login(personas.patient.email, personas.patient.password);
      await expect(page).toHaveURL(/\/dashboard/);
      await authPage.expectWelcomeHeading(new RegExp(`Welcome back, ${personas.patient.name}`));
      await authPage.expectSidebarUser(personas.patient.name, personas.patient.role);
    });

    test('doctor logs in successfully and sees doctor page', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.login(personas.doctor.email, personas.doctor.password);
      await expect(page).toHaveURL(/\/doctor/);
      await authPage.expectWelcomeHeading(new RegExp(`Welcome, Dr\\. ${personas.doctor.name}`));
      await authPage.expectSidebarUser(personas.doctor.name, personas.doctor.role);
    });

    test('admin logs in successfully and sees admin page', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.login(personas.admin.email, personas.admin.password);
      await expect(page).toHaveURL(/\/admin/);
      await authPage.expectWelcomeHeading(/Admin Dashboard/);
      await authPage.expectSidebarUser(personas.admin.name, personas.admin.role);
    });
  });

  test.describe('Login — invalid credentials', { tag: '@regression' }, () => {
    test('shows error and stays on login when password is wrong', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.fillEmail(personas.patient.email);
      await authPage.fillPassword('wrongpassword');
      await authPage.clickSubmit();
      await authPage.expectLoginError('Invalid email or password');
      await authPage.expectOnLoginPage();
      // Email field should retain its value
      await expect(authPage.emailInput).toHaveValue(personas.patient.email);
    });

    test('shows error and stays on login when email does not exist', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.fillEmail('nonexistent@example.com');
      await authPage.fillPassword('anypassword');
      await authPage.clickSubmit();
      await authPage.expectLoginError('Invalid email or password');
      await authPage.expectOnLoginPage();
      // Email field should retain its value
      await expect(authPage.emailInput).toHaveValue('nonexistent@example.com');
    });
  });

  test.describe('Login — empty fields validation', { tag: '@regression' }, () => {
    test('shows errors on both fields when both are empty', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.clearEmail();
      await authPage.clearPassword();
      await authPage.clickSubmit();
      await authPage.expectEmailError('Invalid email address');
      await authPage.expectPasswordError('Password must be at least 6 characters');
      await authPage.expectOnLoginPage();
    });

    test('shows password error when only email is filled', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.fillEmail(personas.patient.email);
      await authPage.clearPassword();
      await authPage.clickSubmit();
      await authPage.expectPasswordError('Password must be at least 6 characters');
      await authPage.expectOnLoginPage();
      // Email field should retain its value
      await expect(authPage.emailInput).toHaveValue(personas.patient.email);
    });

    test('shows email error when only password is filled', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.clearEmail();
      await authPage.fillPassword('Password123!');
      await authPage.clickSubmit();
      await authPage.expectEmailError('Invalid email address');
      await authPage.expectOnLoginPage();
      // Password field should retain its value
      await expect(authPage.passwordInput).toHaveValue('Password123!');
    });
  });

  test.describe('Logout', { tag: '@smoke' }, () => {
    test('authenticated user can logout and is redirected to login', async ({ authPage }) => {
      // Login as patient
      await authPage.gotoLogin();
      await authPage.login(personas.patient.email, personas.patient.password);
      await expect(page).toHaveURL(/\/dashboard/);

      // Logout
      await authPage.logout();
      await authPage.expectOnLoginPage();

      // Verify dashboard is not accessible
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Role-based redirect', { tag: '@smoke' }, () => {
    test('patient is redirected to /dashboard after login', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.login(personas.patient.email, personas.patient.password);
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('doctor is redirected to /doctor after login', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.login(personas.doctor.email, personas.doctor.password);
      await expect(page).toHaveURL(/\/doctor/);
    });

    test('admin is redirected to /admin after login', async ({ authPage }) => {
      await authPage.gotoLogin();
      await authPage.login(personas.admin.email, personas.admin.password);
      await expect(page).toHaveURL(/\/admin/);
    });
  });

  test.describe('Missing locators — skipped tests', { tag: '@skip' }, () => {
    test.skip('register link navigation not tested', async () => {
      // SKIPPED: "registerLinkText" was not observed on /login during exploration — 
      // Sign up link uses getByTestId('register-link'), not visible text-based locator. 
      // The element was observed but not interacted with during the flows.
    });

    test.skip('dashboard redirect after logout not cleanly tested', async () => {
      // SKIPPED: "dashboardAfterLogoutRedirect" was not observed on /dashboard during exploration — 
      // Could not cleanly test 'navigating to /dashboard while logged out redirects to /login' 
      // because browser state had admin session from previous test. 
      // The admin session persisted when navigating with patient persona due to state reuse.
    });
  });
});