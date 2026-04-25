import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
  });

  test('redirects to /dashboard after successful login', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
    await authPage.expectOnDashboard();
  });

  test('shows welcome message with user first name', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
    const welcomeHeading = authPage.page.getByRole('heading', { name: /^Welcome back, Jane/ });
    await expect(welcomeHeading).toBeVisible();
  });

  test('shows user full name and role in sidebar', { tag: ['@smoke', '@auth'] }, async ({ page }) => {
    const sidebar = page.locator('.sidebar-user');
    await expect(sidebar.getByText('Jane Doe')).toBeVisible();
    await expect(sidebar.getByText('patient')).toBeVisible();
  });

  test('shows error and no redirect for wrong password', { tag: ['@regression', '@auth'] }, async ({ page }) => {
    await page.goto('/login');
    await page.getByTextbox('Email').fill(personas.patient.email);
    await page.getByTextbox('Password').fill('WrongPassword123!');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByRole('alert')).toContainText('Invalid email or password');
    await expect(page).toHaveURL(/\/login/);
  });

  test('shows error and no redirect for non-existent email', { tag: ['@regression', '@auth'] }, async ({ page }) => {
    await page.goto('/login');
    await page.getByTextbox('Email').fill('nonexistent@test.com');
    await page.getByTextbox('Password').fill('Password123!');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByRole('alert')).toContainText('Invalid email or password');
    await expect(page).toHaveURL(/\/login/);
  });

  test('email field retains value after failed attempt', { tag: ['@regression', '@auth'] }, async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.getByTextbox('Email');
    const testEmail = 'test@example.com';
    await emailInput.fill(testEmail);
    await page.getByTextbox('Password').fill('wrong');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(emailInput).toHaveValue(testEmail);
  });

  test('password field is cleared after failed attempt', { tag: ['@regression', '@auth'] }, async ({ page }) => {
    await page.goto('/login');
    const passwordInput = page.getByTextbox('Password');
    await page.getByTextbox('Email').fill(personas.patient.email);
    await passwordInput.fill('WrongPassword!');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(passwordInput).toBeEmpty();
  });

  test('shows validation errors for empty fields', { tag: ['@regression', '@auth'] }, async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Invalid email address')).toBeVisible();
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
  });

  test('shows password validation error when only email is filled', { tag: ['@regression', '@auth'] }, async ({ page }) => {
    await page.goto('/login');
    await page.getByTextbox('Email').fill(personas.patient.email);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
  });

  test('shows email validation error when only password is filled', { tag: ['@regression', '@auth'] }, async ({ page }) => {
    await page.goto('/login');
    await page.getByTextbox('Password').fill('Password123!');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

  test('logs out and redirects to /login', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
    await authPage.logout();
    await authPage.expectOnLoginPage();
  });

  test('navigating to /dashboard while logged out redirects to /login', { tag: ['@smoke', '@auth'] }, async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('admin user logs in and is redirected to dashboard', { tag: ['@regression', '@auth'] }, async ({ page }) => {
    await page.goto('/login');
    await page.getByTextbox('Email').fill(personas.admin.email);
    await page.getByTextbox('Password').fill(personas.admin.password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('doctor user logs in and is redirected to dashboard', { tag: ['@regression', '@auth'] }, async ({ page }) => {
    await page.goto('/login');
    await page.getByTextbox('Email').fill(personas.doctor.email);
    await page.getByTextbox('Password').fill(personas.doctor.password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
  });
});