import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { AuthPage } from '../../../pages/auth/AuthPage';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    const authPage = new AuthPage(page);
    await authPage.gotoLogin();
  });

  test.describe('Login — valid credentials', { tag: '@smoke' }, () => {
    test('Patient logs in and is redirected to /dashboard with welcome message and sidebar info', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.login(personas.patient.email, personas.patient.password);

      await expect(page).toHaveURL('/dashboard');
      await expect(authPage.welcomeHeading).toContainText(`Welcome back, ${personas.patient.name}!`);
      await expect(authPage.sidebarUserName).toBeVisible();
      await expect(authPage.sidebarUserRole).toBeVisible();
    });
  });

  test.describe('Login — invalid credentials', { tag: '@regression' }, () => {
    test('Wrong password shows error and stays on /login — email is retained', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.login(personas.patient.email, 'wrongpassword');

      await expect(page).toHaveURL(/\/login/);
      await expect(authPage.invalidCredentialsAlert).toContainText('Invalid email or password');
      await expect(authPage.emailInput).toHaveValue(personas.patient.email);
    });

    test('Non-existent email shows error and stays on /login — email is retained', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.login('nonexistent@caresync.dev', personas.patient.password);

      await expect(page).toHaveURL(/\/login/);
      await expect(authPage.invalidCredentialsAlert).toContainText('Invalid email or password');
      await expect(authPage.emailInput).toHaveValue('nonexistent@caresync.dev');
    });
  });

  test.describe('Login — empty fields', { tag: '@regression' }, () => {
    test('Both fields empty — validation errors on both email and password', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.signInButton.click();

      await expect(authPage.invalidEmailError).toBeVisible();
      await expect(authPage.passwordMinLengthError).toBeVisible();
    });

    test('Only email filled — password validation error appears', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.emailInput.fill(personas.patient.email);
      await authPage.signInButton.click();

      await expect(authPage.passwordMinLengthError).toBeVisible();
    });

    test('Only password filled — email validation error appears', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.passwordInput.fill(personas.patient.password);
      await authPage.signInButton.click();

      await expect(authPage.invalidEmailError).toBeVisible();
    });
  });

  test.describe('Logout', { tag: '@smoke' }, () => {
    test('Authenticated patient clicks Log out and is redirected to /login', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.login(personas.patient.email, personas.patient.password);
      await expect(page).toHaveURL('/dashboard');

      await authPage.logout();

      await expect(page).toHaveURL(/\/login/);
      await expect(authPage.emailInput).toBeVisible();
    });

    test('Navigating to /dashboard while logged out redirects back to /login', async ({ page }) => {
      await page.goto('/dashboard');

      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Role-based redirect', { tag: '@smoke' }, () => {
    test('Admin is redirected to /admin after login', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.login(personas.admin.email, personas.admin.password);

      await expect(page).toHaveURL('/admin');
    });

    test('Doctor is redirected to /doctor after login', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.login(personas.doctor.email, personas.doctor.password);

      await expect(page).toHaveURL('/doctor');
    });

    test('Patient is redirected to /dashboard after login', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.login(personas.patient.email, personas.patient.password);

      await expect(page).toHaveURL('/dashboard');
    });
  });
});