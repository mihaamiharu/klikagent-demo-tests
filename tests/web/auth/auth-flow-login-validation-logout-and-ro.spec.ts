import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login flow', { tag: '@auth' }, () => {
  test('redirects to dashboard on valid login', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
    await expect(authPage.page).toHaveURL(/\/dashboard/);
    await expect(authPage.page.getByRole('heading', { name: /Welcome back, Jane/ })).toBeVisible();
    await expect(authPage.sidebarUserName).toContainText(personas.patient.displayName);
    await expect(authPage.sidebarUserRole).toContainText(personas.patient.role);
  });

  test('shows error on invalid credentials', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
    await authPage.gotoLogin();
    await authPage.fillEmail(personas.patient.email);
    await authPage.fillPassword('wrongpassword');
    await authPage.clickSignIn();
    await expect(authPage.errorAlert).toContainText('Invalid email or password');
    await expect(authPage.page).toHaveURL(/\/login/);
    await expect(authPage.emailInput).toHaveValue(personas.patient.email);
    await expect(authPage.passwordInput).toBeEmpty();
  });

  test('shows error on non-existent email', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.gotoLogin();
    await authPage.fillEmail('nonexistent@caresync.dev');
    await authPage.fillPassword('Password123!');
    await authPage.clickSignIn();
    await expect(authPage.errorAlert).toContainText('Invalid email or password');
    await expect(authPage.page).toHaveURL(/\/login/);
    await expect(authPage.emailInput).toHaveValue('nonexistent@caresync.dev');
    await expect(authPage.passwordInput).toBeEmpty();
  });

  test('shows validation errors on empty fields', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.gotoLogin();
    await authPage.clickSignIn();
    await expect(authPage.emailValidationError).toContainText('Invalid email address');
    await expect(authPage.passwordValidationError).toContainText('Password must be at least 6 characters');
  });

  test('shows password error when only email is filled', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.gotoLogin();
    await authPage.fillEmail(personas.patient.email);
    await authPage.clickSignIn();
    await expect(authPage.passwordValidationError).toContainText('Password must be at least 6 characters');
  });

  test('shows email error when only password is filled', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.gotoLogin();
    await authPage.fillPassword('Password123!');
    await authPage.clickSignIn();
    await expect(authPage.emailValidationError).toContainText('Invalid email address');
  });
});

test.describe('Auth | Logout flow', { tag: '@auth' }, () => {
  test('logs out and redirects to login', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
    await authPage.logout();
    await expect(authPage.page).toHaveURL(/\/login/);
  });

  test('redirects to login when accessing dashboard while logged out', { tag: ['@regression', '@auth'] }, async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Auth | Role-based redirect', { tag: '@auth' }, () => {
  test('admin redirects to admin dashboard', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
    await authPage.login(personas.admin.email, personas.admin.password);
    await expect(authPage.page).toHaveURL(/\/admin/);
    await expect(authPage.sidebarUserName).toContainText('Admin User');
  });

  test('patient redirects to patient dashboard', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
    await expect(authPage.page).toHaveURL(/\/dashboard/);
    await expect(authPage.sidebarUserName).toContainText(personas.patient.displayName);
  });

  test('doctor redirects to dashboard', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
    await authPage.login(personas.doctor.email, personas.doctor.password);
    await expect(authPage.page).toHaveURL(/\/dashboard/);
    await expect(authPage.sidebarUserName).toContainText(personas.doctor.displayName);
  });
});