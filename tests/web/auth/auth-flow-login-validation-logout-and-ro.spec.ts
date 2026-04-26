import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { AuthPage } from '../../../pages/auth/AuthPage';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  // ===== LOGIN — VALID CREDENTIALS =====

  test('Patient logs in with valid credentials and is redirected to /dashboard', { tag: ['@smoke', '@auth'] }, async ({ page, authPage }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Patient sees welcome message with their first name after login', { tag: ['@regression', '@auth'] }, async ({ page, authPage }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
    await expect(page).toHaveURL(/dashboard/);
    await authPage.expectWelcomeMessageContains(personas.patient.name.split(' ')[0]);
  });

  test('Sidebar shows patient full name and role after login', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
    await authPage.expectSidebarShowsUser(personas.patient.name, personas.patient.role);
  });

  // ===== LOGIN — INVALID CREDENTIALS =====

  test('Wrong password shows error message and stays on /login', { tag: ['@smoke', '@auth'] }, async ({ page, authPage }) => {
    await authPage.goto();
    await authPage.fillLoginForm(personas.patient.email, 'wrongpassword');
    await authPage.submitLogin();
    await expect(page).toHaveURL(/login/);
    await authPage.expectLoginError();
  });

  test('Non-existent email shows error message and stays on /login', { tag: ['@smoke', '@auth'] }, async ({ page, authPage }) => {
    await authPage.goto();
    await authPage.fillLoginForm('nonexistent@test.com', personas.patient.password);
    await authPage.submitLogin();
    await expect(page).toHaveURL(/login/);
    await authPage.expectLoginError();
  });

  test('Email field retains its value after a failed login attempt', { tag: ['@regression', '@auth'] }, async ({ page, authPage }) => {
    await authPage.goto();
    await authPage.fillLoginForm('testuser@test.com', 'somepassword');
    await authPage.submitLogin();
    await expect(page).toHaveURL(/login/);
    await expect(authPage.emailInput).toHaveValue('testuser@test.com');
  });

  // ===== LOGIN — EMPTY FIELDS =====

  test('Both fields empty shows validation errors on both fields', { tag: ['@smoke', '@auth'] }, async ({ page, authPage }) => {
    await authPage.goto();
    await authPage.submitLogin();
    await authPage.expectEmailValidationError();
    await authPage.expectPasswordValidationError();
  });

  test('Only email filled shows password validation error', { tag: ['@regression', '@auth'] }, async ({ page, authPage }) => {
    await authPage.goto();
    await authPage.fillLoginForm(personas.patient.email, '');
    await authPage.submitLogin();
    await authPage.expectPasswordValidationError();
  });

  test('Only password filled shows email validation error', { tag: ['@regression', '@auth'] }, async ({ page, authPage }) => {
    await authPage.goto();
    await authPage.fillLoginForm('', personas.patient.password);
    await authPage.submitLogin();
    await authPage.expectEmailValidationError();
  });

  // ===== LOGOUT =====

  test('Authenticated patient clicks logout and is redirected to /login', { tag: ['@smoke', '@auth'] }, async ({ page, authPage }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
    await authPage.logout();
    await expect(page).toHaveURL(/login/);
  });

  test('Navigating to /dashboard while logged out redirects back to /login', { tag: ['@smoke', '@auth'] }, async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/);
  });

  // ===== ROLE-BASED REDIRECT =====

  test('Admin is redirected to /admin after login', { tag: ['@smoke', '@auth'] }, async ({ page, authPage }) => {
    await authPage.login(personas.admin.email, personas.admin.password);
    await expect(page).toHaveURL(/admin/);
  });

  test('Doctor is redirected to /doctor after login', { tag: ['@smoke', '@auth'] }, async ({ page, authPage }) => {
    await authPage.login(personas.doctor.email, personas.doctor.password);
    await expect(page).toHaveURL(/doctor/);
  });

  test('Patient is redirected to /dashboard after login', { tag: ['@smoke', '@auth'] }, async ({ page, authPage }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
    await expect(page).toHaveURL(/dashboard/);
  });

  // ===== LOGOUT — DOCTOR & ADMIN =====

  test('Authenticated doctor clicks logout and is redirected to /login', { tag: ['@regression', '@auth'] }, async ({ page, authPage }) => {
    await authPage.login(personas.doctor.email, personas.doctor.password);
    await authPage.logout();
    await expect(page).toHaveURL(/login/);
  });

  test('Authenticated admin clicks logout and is redirected to /login', { tag: ['@regression', '@auth'] }, async ({ page, authPage }) => {
    await authPage.login(personas.admin.email, personas.admin.password);
    await authPage.logout();
    await expect(page).toHaveURL(/login/);
  });
});