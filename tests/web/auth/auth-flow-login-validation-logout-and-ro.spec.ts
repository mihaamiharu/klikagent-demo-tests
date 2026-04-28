import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { AuthPage } from '../../../pages/auth/AuthPage';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test.describe('Login — valid credentials', { tag: ['@smoke', '@auth'] }, () => {
    test('Patient logs in with valid credentials and is redirected to /dashboard', async ({ authPage, page }) => {
      const patient = personas.patient;
      await authPage.login(patient.email, patient.password);
      await expect(page).toHaveURL(/dashboard/);
      await expect(page.getByRole('heading', { name: /Welcome back, Jane/i })).toBeVisible();
      await expect(page.getByText('Jane Doe')).toBeVisible();
      await expect(page.getByText(patient.role)).toBeVisible();
    });

    test('Doctor logs in with valid credentials and is redirected to /doctor', async ({ authPage, page }) => {
      await authPage.login(personas.doctor.email, personas.doctor.password);
      await expect(page).toHaveURL(/doctor/);
    });

    test('Admin logs in with valid credentials and is redirected to /admin', async ({ authPage, page }) => {
      await authPage.login(personas.admin.email, personas.admin.password);
      await expect(page).toHaveURL(/admin/);
    });
  });

  test.describe('Login — invalid credentials', { tag: ['@regression', '@auth'] }, () => {
    test('Wrong password shows error and stays on /login', async ({ authPage, page }) => {
      await authPage.login(personas.patient.email, 'WrongPassword123!');
      await expect(page).toHaveURL(/login/);
      await authPage.expectLoginError('Invalid email or password');
    });

    test('Non-existent email shows error and stays on /login', async ({ authPage, page }) => {
      await authPage.login('nonexistent@test.com', 'WrongPassword123!');
      await expect(page).toHaveURL(/login/);
      await authPage.expectLoginError('Invalid email or password');
    });

    test('Email field retains value after failed attempt', async ({ authPage, page }) => {
      const testEmail = personas.patient.email;
      await authPage.fillEmail(testEmail);
      await authPage.fillPassword('WrongPassword123!');
      await authPage.submit();
      await authPage.expectEmailRetained(testEmail);
    });
  });

  test.describe('Login — empty fields validation', { tag: ['@regression', '@auth'] }, () => {
    test('Both fields empty shows validation errors on both fields', async ({ authPage }) => {
      await authPage.submit();
      await authPage.expectEmailError('Invalid email address');
      await authPage.expectPasswordError('Password must be at least 6 characters');
    });

    test('Only email filled shows password validation error', async ({ authPage }) => {
      await authPage.fillEmail(personas.patient.email);
      await authPage.submit();
      await authPage.expectPasswordError('Password must be at least 6 characters');
    });

    test('Only password filled shows email validation error', async ({ authPage }) => {
      await authPage.fillPassword(personas.patient.password);
      await authPage.submit();
      await authPage.expectEmailError('Invalid email address');
    });
  });

  test.describe('Logout', { tag: ['@smoke', '@auth'] }, () => {
    const roles = ['patient', 'doctor', 'admin'] as const;

    for (const role of roles) {
      test(`Authenticated ${role} clicks logout and is redirected to /login`, async ({ page, authPage }) => {
        const persona = personas[role];
        await authPage.login(persona.email, persona.password);
        await page.goto('/login');
        await authPage.logout();
        await expect(page).toHaveURL(/login/);
        await authPage.expectOnLoginPage();
      });
    }

    test('Navigating to /dashboard while logged out redirects back to /login', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/login/);
    });
  });
});