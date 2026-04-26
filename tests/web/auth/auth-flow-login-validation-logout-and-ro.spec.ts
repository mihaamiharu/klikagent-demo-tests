import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {

  test.describe('Login — valid credentials', { tag: '@smoke' }, () => {
    test('User logs in and is redirected to /dashboard with welcome message and sidebar info', async ({ page, authPage }) => {
      await authPage.expectOnLoginPage();
      await authPage.login(personas.patient.email, personas.patient.password);
      await expect(page).toHaveURL(/\/dashboard/);
      await authPage.expectOnDashboard(personas.patient.name, personas.patient.role);
    });

    test('User logs in and is redirected to /admin', async ({ page, authPage }) => {
      await authPage.expectOnLoginPage();
      await authPage.login(personas.admin.email, personas.admin.password);
      await expect(page).toHaveURL(/\/admin/);
      await authPage.expectOnDashboard(personas.admin.name, personas.admin.role);
    });

    test('User logs in and is redirected to /doctor', async ({ page, authPage }) => {
      await authPage.expectOnLoginPage();
      await authPage.login(personas.doctor.email, personas.doctor.password);
      await expect(page).toHaveURL(/\/doctor/);
      await authPage.expectOnDashboard(personas.doctor.name, personas.doctor.role);
    });
  });

  test.describe('Login — invalid credentials', { tag: '@regression' }, () => {
    test('Wrong password shows error and stays on /login', async ({ page, authPage }) => {
      await authPage.expectOnLoginPage();
      await authPage.login(personas.patient.email, 'WrongPassword123!');
      await expect(page).toHaveURL(/\/login/);
      await authPage.expectLoginError();
      await authPage.expectEmailRetained(personas.patient.email);
    });

    test('Non-existent email shows error and stays on /login', async ({ page, authPage }) => {
      await authPage.expectOnLoginPage();
      await authPage.login('nonexistent@test.com', 'WrongPassword123!');
      await expect(page).toHaveURL(/\/login/);
      await authPage.expectLoginError();
      await authPage.expectEmailRetained('nonexistent@test.com');
    });
  });

  test.describe('Login — empty fields validation', { tag: '@regression' }, () => {
    test('Both fields empty — validation errors on both fields', async ({ page, authPage }) => {
      await authPage.expectOnLoginPage();
      await authPage.clickSignIn();
      await authPage.expectEmailError();
      await authPage.expectPasswordError();
    });

    test('Only email filled — password validation error', async ({ page, authPage }) => {
      await authPage.expectOnLoginPage();
      await authPage.fillEmail(personas.patient.email);
      await authPage.clickSignIn();
      await authPage.expectPasswordError();
    });

    test('Only password filled — email validation error', async ({ page, authPage }) => {
      await authPage.expectOnLoginPage();
      await authPage.fillPassword('Password123!');
      await authPage.clickSignIn();
      await authPage.expectEmailError();
    });
  });

  test.describe('Logout', { tag: '@smoke' }, () => {
    test('User clicks logout and is redirected to /login', async ({ page, authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      await expect(page).toHaveURL(/\/dashboard/);
      await authPage.logout();
      await expect(page).toHaveURL(/\/login/);
    });

    test('Navigating to /dashboard while logged out redirects back to /login', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/login/);
    });
  });
});