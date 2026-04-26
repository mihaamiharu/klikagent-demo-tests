import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state to ensure clean login page state
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test('Login — valid credentials redirects to dashboard with welcome message', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
    await authPage.expectOnLoginPage();
    await authPage.login(personas.patient.email, personas.patient.password);
    await authPage.expectLoginSuccess();
    await authPage.expectWelcomeWithUserName(personas.patient.displayName);
  });

  test('Login — sidebar shows user full name and role', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
    await authPage.expectSidebarUserInfo(personas.patient.displayName, personas.patient.role);
  });

  test('Login — invalid password shows error and stays on login', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.expectOnLoginPage();
    await authPage.login(personas.patient.email, 'wrongpassword');
    await authPage.expectErrorMessage('Invalid email or password');
    await expect(authPage.page).toHaveURL(/\/login/);
  });

  test('Login — non-existent email shows error and stays on login', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.expectOnLoginPage();
    await authPage.login('nonexistent@test.com', personas.patient.password);
    await authPage.expectErrorMessage('Invalid email or password');
    await expect(authPage.page).toHaveURL(/\/login/);
  });

  test('Login — email field retains value after failed attempt', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.login(personas.patient.email, 'wrongpassword');
    await authPage.expectEmailRetained(personas.patient.email);
  });

  test('Login — password field is cleared after failed attempt', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.login(personas.patient.email, 'wrongpassword');
    await authPage.expectPasswordCleared();
  });

  test('Login — empty fields show validation errors on both fields', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.expectOnLoginPage();
    await authPage.submitEmptyForm();
    await authPage.expectEmailValidationError();
    await authPage.expectPasswordValidationError();
  });

  test('Login — only email filled shows password validation error', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.fillEmailOnly(personas.patient.email);
    await authPage.expectPasswordValidationError();
  });

  test('Login — only password filled shows email validation error', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.fillPasswordOnly(personas.patient.password);
    await authPage.expectEmailValidationError();
  });

  test('Logout — authenticated user clicks logout and is redirected to login', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
    await authPage.login(personas.patient.email, personas.patient.password);
    await authPage.logout();
    await authPage.expectLoggedOut();
  });

  test('Logout — navigating to dashboard while logged out redirects to login', { tag: ['@regression', '@auth'] }, async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});