import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.goto();
  });

  test('shows login form with correct elements', { tag: ['@smoke'] }, async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'CareSync' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByText("Don't have an account?")).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  });

  test('redirects to dashboard after valid login and shows user info', { tag: ['@smoke'] }, async ({ authPage }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
    await expect(authPage.page).toHaveURL(/\/dashboard/);
    await expect(authPage.page.getByRole('heading', { name: /Welcome back, Jane/ })).toBeVisible();
    await expect(authPage.page.getByRole('complementary').getByText('Jane Doe')).toBeVisible();
    await expect(authPage.page.getByRole('complementary').getByText('patient')).toBeVisible();
  });

  test('shows error and retains email after wrong password', { tag: ['@regression'] }, async ({ authPage }) => {
    await authPage.loginWithInvalidPassword(personas.patient.email, 'WrongPassword!');
    await expect(authPage.page).toHaveURL(/\/login/);
    await expect(authPage.page.getByRole('alert')).toContainText('Invalid email or password');
    await expect(authPage.page.getByLabel('Email')).toHaveValue(personas.patient.email);
    await expect(authPage.page.getByLabel('Password')).toBeEmpty();
  });

  test('shows error after non-existent email login', { tag: ['@regression'] }, async ({ authPage }) => {
    await authPage.loginWithNonExistentEmail(personas.nonExistent.email, personas.patient.password);
    await expect(authPage.page).toHaveURL(/\/login/);
    await expect(authPage.page.getByRole('alert')).toContainText('Invalid email or password');
    await expect(authPage.page.getByLabel('Email')).toHaveValue(personas.nonExistent.email);
    await expect(authPage.page.getByLabel('Password')).toBeEmpty();
  });

  test('shows validation errors when both fields are empty', { tag: ['@regression'] }, async ({ authPage }) => {
    await authPage.submitEmptyForm();
    await expect(authPage.page.getByTestId('email-error')).toContainText('Invalid email address');
    await expect(authPage.page.getByTestId('password-error')).toContainText('Password must be at least 6 characters');
    await expect(authPage.page).toHaveURL(/\/login/);
  });

  test('shows password validation error when only email is filled', { tag: ['@regression'] }, async ({ authPage }) => {
    await authPage.submitWithEmailOnly(personas.patient.email);
    await expect(authPage.page.getByTestId('password-error')).toContainText('Password must be at least 6 characters');
    await expect(authPage.page.getByTestId('email-error')).not.toBeVisible();
    await expect(authPage.page).toHaveURL(/\/login/);
  });

  test('shows email validation error when only password is filled', { tag: ['@regression'] }, async ({ authPage }) => {
    await authPage.submitWithPasswordOnly(personas.patient.password);
    await expect(authPage.page.getByTestId('email-error')).toContainText('Invalid email address');
    await expect(authPage.page.getByTestId('password-error')).not.toBeVisible();
    await expect(authPage.page).toHaveURL(/\/login/);
  });

  test.describe('Authenticated state', () => {
    test.beforeEach(async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
    });

    test('redirects to login after logout', { tag: ['@smoke'] }, async ({ authPage }) => {
      await authPage.logout();
      await expect(authPage.page).toHaveURL(/\/login/);
    });

    test('redirects unauthenticated user from dashboard back to login', { tag: ['@regression'] }, async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/login/);
      await context.close();
    });

    test('admin sees correct dashboard and role info', { tag: ['@regression'] }, async ({ authPage }) => {
      await authPage.login(personas.admin.email, personas.admin.password);
      await expect(authPage.page).toHaveURL(/\/dashboard/);
      await expect(authPage.page.getByRole('complementary').getByText(personas.admin.displayName)).toBeVisible();
      await expect(authPage.page.getByRole('complementary').getByText(personas.admin.role)).toBeVisible();
    });

    test('doctor sees correct dashboard and role info', { tag: ['@regression'] }, async ({ authPage }) => {
      await authPage.login(personas.doctor.email, personas.doctor.password);
      await expect(authPage.page).toHaveURL(/\/dashboard/);
      await expect(authPage.page.getByRole('complementary').getByText(personas.doctor.displayName)).toBeVisible();
      await expect(authPage.page.getByRole('complementary').getByText(personas.doctor.role)).toBeVisible();
    });
  });
});