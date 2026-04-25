import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('shows login form at /login', { tag: ['@smoke', '@auth'] }, async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'CareSync', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test.describe('Login — valid credentials', () => {
    test('redirects to dashboard with welcome message on successful login', { tag: ['@smoke', '@auth'] }, async ({ page }) => {
      await page.getByLabel('Email').fill(personas.patient.email);
      await page.getByLabel('Password').fill(personas.patient.password);
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page).toHaveURL(/dashboard/);
      await expect(page.getByRole('heading', { name: /Welcome back, Jane!/ })).toBeVisible();
    });

    test('shows user full name and role in sidebar', { tag: ['@smoke', '@auth'] }, async ({ page, authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);

      await expect(page.getByText('Jane Doe')).toBeVisible();
      await expect(page.getByText('patient')).toBeVisible();
    });
  });

  test.describe('Login — invalid credentials', () => {
    test('shows error on wrong password and remains on login page', { tag: ['@regression', '@auth'] }, async ({ page }) => {
      await page.getByLabel('Email').fill(personas.patient.email);
      await page.getByLabel('Password').fill('WrongPassword123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.getByRole('alert')).toContainText('Invalid email or password');
      await expect(page).toHaveURL(/login/);
    });

    test('shows error on non-existent email and remains on login page', { tag: ['@regression', '@auth'] }, async ({ page }) => {
      await page.getByLabel('Email').fill('nonexistent@example.com');
      await page.getByLabel('Password').fill('Password123!');
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.getByRole('alert')).toContainText('Invalid email or password');
      await expect(page).toHaveURL(/login/);
    });

    test('email field retains value after failed attempt', { tag: ['@regression', '@auth'] }, async ({ page }) => {
      await page.getByLabel('Email').fill(personas.patient.email);
      await page.getByLabel('Password').fill('WrongPassword123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.getByLabel('Email')).toHaveValue(personas.patient.email);
    });

    test('password field is cleared after failed attempt', { tag: ['@regression', '@auth'] }, async ({ page }) => {
      await page.getByLabel('Email').fill(personas.patient.email);
      await page.getByLabel('Password').fill('WrongPassword123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.getByLabel('Password')).toBeEmpty();
    });
  });

  test.describe('Login — empty fields', () => {
    test('shows validation errors on both fields when both are empty', { tag: ['@regression', '@auth'] }, async ({ page }) => {
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.getByText('Invalid email address')).toBeVisible();
      await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    });

    test('shows password validation error when only email is filled', { tag: ['@regression', '@auth'] }, async ({ page }) => {
      await page.getByLabel('Email').fill(personas.patient.email);
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    });

    test('shows email validation error when only password is filled', { tag: ['@regression', '@auth'] }, async ({ page }) => {
      await page.getByLabel('Password').fill(personas.patient.password);
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.getByText('Invalid email address')).toBeVisible();
    });
  });

  test.describe('Logout', () => {
    test('logs out and redirects to /login', { tag: ['@smoke', '@auth'] }, async ({ page, authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      await page.getByRole('button', { name: 'Log out' }).click();

      await expect(page).toHaveURL(/login/);
      await expect(page.getByRole('heading', { name: 'CareSync', level: 1 })).toBeVisible();
    });
  });

  test.describe('Auth redirect', () => {
    test('unauthenticated user is redirected to /login when accessing /dashboard', { tag: ['@regression', '@auth'] }, async ({ page }) => {
      await page.goto('/dashboard');

      await expect(page).toHaveURL(/login/);
    });
  });
});