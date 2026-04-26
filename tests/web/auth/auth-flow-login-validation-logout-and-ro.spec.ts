import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.goto();
  });

  test.describe('Login — valid credentials', { tag: '@auth' }, () => {
    test('admin user is redirected to /admin dashboard with welcome message', { tag: ['@smoke', '@auth'] }, async ({ authPage, page }) => {
      await authPage.login(personas.admin.email, personas.admin.password);

      await expect(page).toHaveURL(/\/admin$/);
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Welcome back');
    });

    test('sidebar shows admin user full name and role', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
      await authPage.login(personas.admin.email, personas.admin.password);

      await authPage.expectSidebarUserName('admin');
      await authPage.expectSidebarRole('admin');
    });
  });

  test.describe('Login — invalid credentials', { tag: '@auth' }, () => {
    test('wrong password shows error and stays on login', { tag: ['@regression', '@auth'] }, async ({ authPage, page }) => {
      await authPage.login(personas.admin.email, 'WrongPassword123!');

      await expect(page.getByRole('alert')).toContainText('Invalid email or password');
      await expect(page).toHaveURL(/\/login/);
      await expect(page).not.toHaveURL(/\/admin/);
    });

    test('non-existent email shows error and stays on login', { tag: ['@regression', '@auth'] }, async ({ authPage, page }) => {
      await authPage.login('nonexistent@example.com', personas.admin.password);

      await expect(page.getByRole('alert')).toContainText('Invalid email or password');
      await expect(page).toHaveURL(/\/login/);
    });

    test('email field retains value after failed attempt', { tag: ['@regression', '@auth'] }, async ({ authPage, page }) => {
      await authPage.login(personas.admin.email, 'WrongPassword123!');

      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(personas.admin.email);
    });

    test('password field is cleared after failed attempt', { tag: ['@regression', '@auth'] }, async ({ authPage, page }) => {
      await authPage.login(personas.admin.email, 'WrongPassword123!');

      await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue('');
    });
  });

  test.describe('Login — empty fields', { tag: '@auth' }, () => {
    test('both empty shows validation errors on both fields', { tag: ['@regression', '@auth'] }, async ({ authPage, page }) => {
      await authPage.submitEmptyForm();

      await expect(page.getByText('Invalid email address')).toBeVisible();
      await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    });

    test('only email filled shows password validation error', { tag: ['@regression', '@auth'] }, async ({ authPage, page }) => {
      await authPage.fillEmailOnly(personas.admin.email);

      await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    });

    test('only password filled shows email validation error', { tag: ['@regression', '@auth'] }, async ({ authPage, page }) => {
      await authPage.fillPasswordOnly(personas.admin.password);
      await authPage.submit();

      await expect(page.getByText('Invalid email address')).toBeVisible();
    });
  });

  test.describe('Logout', { tag: '@auth' }, () => {
    test('authenticated user clicking logout is redirected to /login', { tag: ['@smoke', '@auth'] }, async ({ authPage, page }) => {
      await authPage.login(personas.admin.email, personas.admin.password);
      await authPage.logout();

      await expect(page).toHaveURL(/\/login/);
    });

    test('navigating to /dashboard while logged out redirects to /login', { tag: ['@regression', '@auth'] }, async ({ page }) => {
      await page.goto('/dashboard');

      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Role-based redirect', { tag: '@auth' }, () => {
    test('admin is redirected to /admin dashboard (not /dashboard)', { tag: ['@smoke', '@auth'] }, async ({ authPage, page }) => {
      await authPage.login(personas.admin.email, personas.admin.password);

      await expect(page).toHaveURL(/\/admin/);
      await authPage.expectDashboardHeading('admin');
    });
  });
});