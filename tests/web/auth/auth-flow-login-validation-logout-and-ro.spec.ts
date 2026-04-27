import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { AuthPage } from '../../../pages/auth/AuthPage';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goto();
  });

  test.describe('Login — valid credentials', { tag: '@smoke' }, () => {
    test('patient logs in and is redirected to /dashboard with welcome message and sidebar info', async ({
      page,
    }) => {
      await authPage.login(personas.patient.email, personas.patient.password);

      await expect(page).toHaveURL('/dashboard');
      await expect(authPage.welcomeHeading).toBeVisible();
      await expect(authPage.sidebarUserName).toBeVisible();
      await expect(authPage.sidebarRole).toBeVisible();
    });

    test('admin logs in and is redirected to /admin', async ({ page }) => {
      await authPage.login(personas.admin.email, personas.admin.password);

      await expect(page).toHaveURL('/admin');
      await expect(authPage.welcomeHeading).toBeVisible();
    });

    test('doctor logs in and is redirected to /doctor', async ({ page }) => {
      await authPage.login(personas.doctor.email, personas.doctor.password);

      await expect(page).toHaveURL('/doctor');
      await expect(authPage.welcomeHeading).toBeVisible();
    });
  });

  test.describe('Login — invalid credentials', { tag: '@regression' }, () => {
    test('wrong password shows error and stays on /login', async ({ page }) => {
      await authPage.login(personas.patient.email, 'wrongpassword');

      await expect(page).toHaveURL('/login');
      await expect(authPage.errorAlert).toContainText('Invalid email or password');
    });

    test('non-existent email shows error and stays on /login', async ({ page }) => {
      await authPage.login('nonexistent@test.com', 'wrongpassword');

      await expect(page).toHaveURL('/login');
      await expect(authPage.errorAlert).toContainText('Invalid email or password');
    });

    test('email field retains its value after failed attempt', async ({ page }) => {
      await authPage.emailInput.fill('retain@test.com');
      await authPage.passwordInput.fill('wrongpassword');
      await authPage.clickSignIn();

      await expect(authPage.emailInput).toHaveValue('retain@test.com');
    });
  });

  test.describe('Login — empty fields validation', { tag: '@regression' }, () => {
    test('both fields empty shows validation errors on both', async ({ page }) => {
      await authPage.clickSignIn();

      await expect(authPage.emailError).toBeVisible();
      await expect(authPage.passwordError).toBeVisible();
    });

    test('only email filled shows password validation error', async ({ page }) => {
      await authPage.emailInput.fill(personas.patient.email);
      await authPage.clickSignIn();

      await expect(authPage.passwordError).toBeVisible();
    });

    test('only password filled shows email validation error', async ({ page }) => {
      await authPage.passwordInput.fill('Password123!');
      await authPage.clickSignIn();

      await expect(authPage.emailError).toBeVisible();
    });
  });

  test.describe('Logout', { tag: '@smoke' }, () => {
    test('authenticated user clicks logout and is redirected to /login', async ({ page }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      await expect(page).toHaveURL('/dashboard');

      await authPage.logout();
      await expect(page).toHaveURL('/login');
    });

    test('navigating to /dashboard while logged out redirects to /login', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL('/login');
    });
  });
});
