import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test('shows sign-in form at /login', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
    await authPage.goto();
    await authPage.expectOnLoginPage();
    await expect(authPage.heading).toContainText('CareSync');
    await expect(authPage.subheading).toContainText('Sign in to your account');
    await expect(authPage.emailInput).toBeVisible();
    await expect(authPage.passwordInput).toBeVisible();
    await expect(authPage.signInButton).toBeVisible();
  });

  test('redirects to /dashboard on valid login and shows user info', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
    await authPage.goto();
    await authPage.login(personas.patient.email, personas.patient.password);
    await authPage.expectLoginSuccess();
    await expect(authPage.welcomeMessage).toContainText('Welcome back');
    await expect(authPage.sidebarUserName).toContainText(personas.patient.displayName);
    await expect(authPage.sidebarUserRole).toContainText(personas.patient.role);
  });

  test('shows error and stays on /login on wrong password', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.goto();
    await authPage.emailInput.fill(personas.patient.email);
    await authPage.passwordInput.fill('wrongpassword');
    await authPage.signInButton.click();
    await authPage.expectLoginError();
    await expect(authPage.emailInput).toHaveValue(personas.patient.email);
    await expect(authPage.passwordInput).toBeEmpty();
  });

  test('shows error and stays on /login for non-existent email', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.goto();
    await authPage.emailInput.fill('nonexistent@test.com');
    await authPage.passwordInput.fill(personas.patient.password);
    await authPage.signInButton.click();
    await authPage.expectLoginError();
    await expect(authPage.emailInput).toHaveValue('nonexistent@test.com');
  });

  test('shows validation errors when both fields are empty', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.goto();
    await authPage.signInButton.click();
    await expect(authPage.emailError).toContainText('Invalid email address');
    await expect(authPage.passwordError).toContainText('Password must be at least 6 characters');
  });

  test('shows password error when only email is filled', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.goto();
    await authPage.emailInput.fill(personas.patient.email);
    await authPage.signInButton.click();
    await expect(authPage.passwordError).toContainText('Password must be at least 6 characters');
  });

  test('shows email error when only password is filled', { tag: ['@regression', '@auth'] }, async ({ authPage }) => {
    await authPage.goto();
    await authPage.passwordInput.fill(personas.patient.password);
    await authPage.signInButton.click();
    await expect(authPage.emailError).toContainText('Invalid email address');
  });

  test('logs out and redirects to /login', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
    await authPage.goto();
    await authPage.login(personas.patient.email, personas.patient.password);
    await authPage.logout();
    await authPage.expectOnLoginPage();
  });

  test('navigating to /dashboard while logged out redirects to /login', { tag: ['@smoke', '@auth'] }, async ({ authPage }) => {
    await authPage.goto();
    await authPage.expectOnLoginPage();
  });
});