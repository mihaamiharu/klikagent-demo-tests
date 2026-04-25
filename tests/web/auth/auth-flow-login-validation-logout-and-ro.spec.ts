import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {

  // ── Login: valid credentials ─────────────────────────────────────────────────

  test('redirects to dashboard on valid patient login', { tag: ['@smoke', '@auth'] }, async ({ authPage, page }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('shows welcome message with user first name', { tag: ['@smoke', '@auth'] }, async ({ authPage, page }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
    await expect(page.getByRole('heading', { name: /Welcome back, Jane/ })).toBeVisible();
  });

  test('shows user full name and role in sidebar', { tag: ['@smoke', '@auth'] }, async ({ authPage, page }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
    await expect(page.getByRole('complementary').getByText('Jane Doe')).toBeVisible();
    await expect(page.getByRole('complementary').getByText('patient')).toBeVisible();
  });

  // ── Login: invalid credentials ───────────────────────────────────────────────

  test('shows error and no redirect on wrong password', { tag: ['@regression', '@auth'] }, async ({ authPage, page }) => {
    await page.goto('/login');
    await authPage.emailInput.fill(personas.patient.email);
    await authPage.passwordInput.fill('wrongpassword');
    await authPage.submitButton.click();
    await expect(page.getByRole('alert')).toContainText('Invalid email or password');
    await expect(page).toHaveURL(/login/);
  });

  test('shows error and no redirect on non-existent email', { tag: ['@regression', '@auth'] }, async ({ authPage, page }) => {
    await page.goto('/login');
    await authPage.emailInput.fill('nonexistent@caresync.dev');
    await authPage.passwordInput.fill(personas.patient.password);
    await authPage.submitButton.click();
    await expect(page.getByRole('alert')).toContainText('Invalid email or password');
    await expect(page).toHaveURL(/login/);
  });

  test('email field retains its value after failed attempt', { tag: ['@regression', '@auth'] }, async ({ authPage, page }) => {
    await page.goto('/login');
    await authPage.emailInput.fill('nonexistent@caresync.dev');
    await authPage.passwordInput.fill('wrongpassword');
    await authPage.submitButton.click();
    await expect(authPage.emailInput).toHaveValue('nonexistent@caresync.dev');
  });

  test('password field is cleared after failed attempt', { tag: ['@regression', '@auth'] }, async ({ authPage, page }) => {
    await page.goto('/login');
    await authPage.emailInput.fill(personas.patient.email);
    await authPage.passwordInput.fill('wrongpassword');
    await authPage.submitButton.click();
    await expect(authPage.passwordInput).toBeEmpty();
  });

  // ── Login: empty fields ─────────────────────────────────────────────────────

  test('shows validation errors on both fields when empty', { tag: ['@regression', '@auth'] }, async ({ authPage, page }) => {
    await page.goto('/login');
    await authPage.submitButton.click();
    await expect(page.getByText('Invalid email address')).toBeVisible();
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
  });

  test('shows password error when only email is filled', { tag: ['@regression', '@auth'] }, async ({ authPage, page }) => {
    await page.goto('/login');
    await authPage.emailInput.fill(personas.patient.email);
    await authPage.submitButton.click();
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
  });

  test('shows email error when only password is filled', { tag: ['@regression', '@auth'] }, async ({ authPage, page }) => {
    await page.goto('/login');
    await authPage.passwordInput.fill('Password123!');
    await authPage.submitButton.click();
    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

  // ── Logout ───────────────────────────────────────────────────────────────────

  test('logs out and redirects to /login', { tag: ['@smoke', '@auth'] }, async ({ authPage, page }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
    await authPage.logout();
    await expect(page).toHaveURL(/login/);
  });

  test('navigating to /dashboard while logged out redirects back to /login', { tag: ['@regression', '@auth'] }, async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/);
  });

  // ── Role-based redirect ──────────────────────────────────────────────────────

  test('admin is redirected to /admin after login', { tag: ['@regression', '@auth'] }, async ({ authPage, page }) => {
    await authPage.login(personas.admin.email, personas.admin.password);
    await expect(page).toHaveURL(/admin/);
    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
  });

  test('doctor is redirected to /dashboard after login', { tag: ['@regression', '@auth'] }, async ({ authPage, page }) => {
    await authPage.login(personas.doctor.email, personas.doctor.password);
    await expect(page).toHaveURL(/dashboard/);
  });

});