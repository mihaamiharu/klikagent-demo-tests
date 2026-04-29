import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { AuthPage } from '../../../pages/auth/AuthPage';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.describe('Login — valid credentials', { tag: '@smoke' }, () => {
    test('user redirects to /dashboard and sees welcome message', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.gotoLogin();
      await authPage.login(personas.patient.email, personas.patient.password);
      await authPage.expectLoginSuccess(/\/dashboard/);
      // Welcome heading uses first name dynamically — pattern: 'Welcome back, <FirstName>!'
      await authPage.expectWelcomeHeading(/Welcome back, .+/);
      await authPage.expectUserProfile(personas.patient.displayName, personas.patient.role);
    });

    test('user redirects to /admin', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.gotoLogin();
      await authPage.login(personas.admin.email, personas.admin.password);
      await authPage.expectLoginSuccess(/\/admin/);
      await authPage.expectWelcomeHeading(/Welcome back, .+/);
      await authPage.expectUserProfile(personas.admin.displayName, personas.admin.role);
    });

    test('user redirects to /doctor', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.gotoLogin();
      await authPage.login(personas.doctor.email, personas.doctor.password);
      await authPage.expectLoginSuccess(/\/doctor/);
      // Welcome heading includes title and name
      await authPage.expectWelcomeHeading(/Welcome, Dr\./);
      await authPage.expectUserProfile(personas.doctor.displayName, personas.doctor.role);
    });
  });

  test.describe('Login — invalid credentials', { tag: '@regression' }, () => {
    test('wrong password shows error and no redirect', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.gotoLogin();
      await authPage.login(personas.patient.email, 'wrongpassword');
      await authPage.expectLoginErrorVisible();
      await authPage.expectOnLoginPage();
      await authPage.expectEmailFieldRetainsValue(personas.patient.email);
    });

    test('non-existent email shows error and no redirect', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.gotoLogin();
      await authPage.login('nonexistent@example.com', 'wrongpassword');
      await authPage.expectLoginErrorVisible();
      await authPage.expectOnLoginPage();
      await authPage.expectEmailFieldRetainsValue('nonexistent@example.com');
    });
  });

  test.describe('Login — empty fields validation', { tag: '@regression' }, () => {
    test('both fields empty shows validation errors on both', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.gotoLogin();
      await authPage.clearFields();
      await authPage.submitButton.click();
      await authPage.expectEmailValidationError();
      await authPage.expectPasswordValidationError();
      await authPage.expectOnLoginPage();
    });

    test('only email filled shows password validation error', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.gotoLogin();
      await authPage.emailInput.fill(personas.patient.email);
      await authPage.passwordInput.clear();
      await authPage.submitButton.click();
      await authPage.expectPasswordValidationError();
      await authPage.expectOnLoginPage();
    });

    test('only password filled shows email validation error', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.gotoLogin();
      await authPage.emailInput.clear();
      await authPage.passwordInput.fill(personas.patient.password);
      await authPage.submitButton.click();
      await authPage.expectEmailValidationError();
      await authPage.expectOnLoginPage();
    });
  });

  test.describe('Logout', { tag: '@smoke' }, () => {
    test('user logs out and is redirected to /login', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.gotoLogin();
      await authPage.login(personas.patient.email, personas.patient.password);
      await authPage.expectLoginSuccess(/\/dashboard/);
      await authPage.logout();
    });

    test('user logs out and is redirected to /login', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.gotoLogin();
      await authPage.login(personas.admin.email, personas.admin.password);
      await authPage.expectLoginSuccess(/\/admin/);
      await authPage.logout();
    });

    test('user logs out and is redirected to /login', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.gotoLogin();
      await authPage.login(personas.doctor.email, personas.doctor.password);
      await authPage.expectLoginSuccess(/\/doctor/);
      await authPage.logout();
    });
  });

  test.describe('Unauthenticated redirect', { tag: '@smoke' }, () => {
    test('navigating to /dashboard while logged out redirects back to /login', async ({ page }) => {
      const authPage = new AuthPage(page);
      // Clear any existing session
      await page.context().clearCookies();
      await authPage.page.goto('/dashboard');
      await authPage.expectOnLoginPage();
    });
  });
});